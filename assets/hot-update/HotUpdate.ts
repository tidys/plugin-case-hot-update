export type HotCallback = (event: jsb.EventAssetsManager) => void;
export type VersionData = { local: string, server: string };
export type VersionCallback = (param: VersionData) => void;
export class HotOptions {
    OnVersionInfo: VersionCallback;
    OnNeedToUpdate: HotCallback;
    OnNoNeedToUpdate: HotCallback;
    OnUpdateFailed: HotCallback;
    OnUpdateSucceed: HotCallback;
    OnUpdateProgress: HotCallback;

    check() {
        for (let key in this) {
            if (key !== 'check') {
                if (!this[key]) {
                    cc.log(`参数HotOptions.${key}未设置！`);
                    return false;
                }
            }
        }
        return true
    }
}

class Hot {
    _assetsMgr: jsb.AssetsManager = null;
    _options: HotOptions = null;
    _state = Hot.State.None;

    static State = {
        None: 0,
        Check: 1,
        Update: 2,
    }

    // 检查更新
    checkUpdate() {
        if (!this._assetsMgr) {
            cc.log('请先初始化')
            return;
        }

        if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            cc.error('未初始化')
            return;
        }
        if (!this._assetsMgr.getLocalManifest().isLoaded()) {
            console.log('加载本地 manifest 失败 ...');
            return;
        }
        this._assetsMgr.setEventCallback(this._hotUpdateCallBack.bind(this));
        this._state = Hot.State.Check;
        // 下载version.manifest，进行版本比对
        this._assetsMgr.checkUpdate();
    }

    hotUpdate() {
        if (!this._assetsMgr) {
            cc.log('请先初始化')
            return
        }
        this._assetsMgr.setEventCallback(this._hotUpdateCallBack.bind(this));
        this._state = Hot.State.Update;
        this._assetsMgr.update();
    }

    _hotUpdateCallBack(event: jsb.EventAssetsManager) {
        let code = event.getEventCode();
        cc.log(`hotUpdate Code: ${code}`);
        const { ERROR_NO_LOCAL_MANIFEST,
            ERROR_DOWNLOAD_MANIFEST,
            ERROR_PARSE_MANIFEST,
            ERROR_UPDATING,
            ERROR_DECOMPRESS,
        } = jsb.EventAssetsManager;
        const codeMsg = {};
        codeMsg[ERROR_NO_LOCAL_MANIFEST.toString()] = "未找到manifest";
        codeMsg[ERROR_DOWNLOAD_MANIFEST.toString()] = "下载manifest失败";
        codeMsg[ERROR_PARSE_MANIFEST.toString()] = "解析manifest失败";
        codeMsg[ERROR_UPDATING.toString()] = "更新失败";
        codeMsg[ERROR_DECOMPRESS.toString()] = "解压失败";

        switch (code) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("已经和远程版本一致，无须更新");
                this._options.OnNoNeedToUpdate && this._options.OnNoNeedToUpdate(event)
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('发现新版本,请更新');
                this._options.OnNeedToUpdate && this._options.OnNeedToUpdate(event);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log('更新中...')
                if (this._state === Hot.State.Update) {
                    this._options.OnUpdateProgress && this._options.OnUpdateProgress(event);
                } else {
                    // 检查状态下，不回调更新进度
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('更新成功');
                this._onUpdateFinished(event);
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                // 不予理会的消息事件
                break;
            default:
                cc.log(`error code msg: ${codeMsg[code.toString()]}`);
                this._onUpdateFailed(code);
                break;
        }
    }

    _onUpdateFailed(code) {
        this._assetsMgr.setEventCallback(null)
        this._options.OnUpdateFailed && this._options.OnUpdateFailed(code);
    }

    // 更新完成
    _onUpdateFinished(event: jsb.EventAssetsManager) {
        this._assetsMgr.setEventCallback(null)
        let searchPaths = jsb.fileUtils.getSearchPaths();
        let newPaths = this._assetsMgr.getLocalManifest().getSearchPaths();
        cc.log("[HotUpdate] 搜索路径: " + JSON.stringify(newPaths));
        Array.prototype.unshift(searchPaths, newPaths);
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

        jsb.fileUtils.setSearchPaths(searchPaths);
        this._options.OnUpdateSucceed && this._options.OnUpdateSucceed(event);
    }

    showSearchPath() {
        cc.log("========================搜索路径========================");
        let searchPaths = jsb.fileUtils.getSearchPaths();
        for (let i = 0; i < searchPaths.length; i++) {
            cc.log("[" + i + "]: " + searchPaths[i]);
        }
        cc.log("======================================================");
    }

    // ------------------------------初始化------------------------------
    init(manifest: cc.Asset, opt: HotOptions) {
        if (!cc.sys.isNative) {
            return;
        }
        if (!opt.check()) {
            return;
        }
        this._options = opt;

        if (this._assetsMgr) {
            return;
        }

        this.showSearchPath();
        let url = manifest.nativeUrl;
        if (cc.loader.md5Pipe) {
            url = cc.loader.md5Pipe.transformURL(url)
        }
        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        this._assetsMgr = new jsb.AssetsManager(url, storagePath, (versionA, versionB) => {
            // 比较版本
            cc.log("客户端版本: " + versionA + ', 当前最新版本: ' + versionB);
            this._options.OnVersionInfo({ local: versionA, server: versionB });
            let vA = versionA.split('.');
            let vB = versionB.split('.');
            for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || '0');
                if (a !== b) {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        });
        this._assetsMgr.setVerifyCallback((assetsFullPath, asset) => {
            let { compressed, md5, path, size } = asset;
            if (compressed) {
                return true;
            } else {
                return true;
            }
        })
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // 安卓手机设置 最大并发任务数量限制为2
            // this._assetsMgr.setMaxConcurrentTask(10);
        }

        let localManifest = this._assetsMgr.getLocalManifest()
        cc.log('[HotUpdate] 热更新资源存放路径: ' + storagePath);
        cc.log('[HotUpdate] 本地manifest路径: ' + url);
        cc.log('[HotUpdate] local packageUrl: ' + localManifest.getPackageUrl());
        cc.log('[HotUpdate] project.manifest remote url: ' + localManifest.getManifestFileUrl());
        cc.log('[HotUpdate] version.manifest remote url: ' + localManifest.getVersionFileUrl());
    }
}

let hotInstance = new Hot();

export default hotInstance;
