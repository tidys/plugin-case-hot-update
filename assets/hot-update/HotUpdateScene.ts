import { _decorator, Asset, Component, director, game, instantiate, Label, log, Node, Prefab, ProgressBar, resources, sys } from 'cc';
import { DialogLayer } from '../resources/DialogLayer';
import HotUpdate, { HotOptions, VersionData } from "./HotUpdate";
const { ccclass, property } = _decorator;

@ccclass
export default class HotUpdateScene extends Component {
    @property({ displayName: 'project.manifest', type: Asset, })
    manifest: Asset = null;

    @property({ displayName: '版本号', type: Label, })
    versionLabel: Label = null;

    @property({ displayName: '热更新进度条', type: ProgressBar })
    updateProgress: ProgressBar = null;

    @property({ displayName: '消息提示', type: Label })
    tipsLabel: Label = null;

    @property({ displayName: '添加节点', type: Node })
    dialogNode: Node = null;
    @property(Prefab)
    prefabDialog: Prefab = null

    onLoad() {
        this._initView();
        let options = new HotOptions();
        options.OnVersionInfo = (data: VersionData) => {
            let { local, server } = data;
            this.versionLabel.string = `本地版本号:${local}, 服务器版本号:${server}`;
        };
        options.OnUpdateProgress = (event: jsb.EventAssetsManager) => {
            let bytes = event.getDownloadedBytes() + '/' + event.getTotalBytes();
            let files = event.getDownloadedFiles() + '/' + event.getTotalFiles();

            let file = event.getPercentByFile().toFixed(2);
            let byte = event.getPercent().toFixed(2);
            let msg = event.getMessage();

            console.log('[update]: 进度=' + file);
            this.updateProgress.progress = parseFloat(file);
            this.tipsLabel.string = '正在更新中,请耐心等待';
            console.log(msg);
        };
        options.OnNeedToUpdate = (event: jsb.EventAssetsManager) => {
            const fileSize = event.getTotalBytes();
            const fileCount = event.getTotalFiles();
            this.showTipsWithOkBtn(`检测到新版本,一共${fileCount}个文件:${fileSize}Kb\n点击确定开始更新`, () => {
                HotUpdate.hotUpdate();
            });
        };
        options.OnNoNeedToUpdate = () => {
            this._enterGame();
        };
        options.OnUpdateFailed = (event: jsb.EventAssetsManager) => {
            const code: number = event.getEventCode();
            const msg = `更新失败:${code}`;
            this.tipsLabel.string = msg;
            log(msg);
            this.showTipsWithOkBtn('更新失败,点击重试', () => {
                HotUpdate.checkUpdate();
            });

        };
        options.OnUpdateSucceed = () => {
            this.tipsLabel.string = '更新成功';
            log('更新成功');
            this.showTipsWithOkBtn('更新成功,点击确定重启游戏', () => {
                //  audioEngine.stopAll();
                game.restart();
            });
        };
        HotUpdate.init(this.manifest, options);

    }
    private showTipsWithOkBtn(word: string, okCb = null, cancelCb = null, closeCb = null) {
        this.dialogNode.active = true;
        let script = this.dialogNode.getComponent(DialogLayer);
        if (script) {
            script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
        }
    }

    _initView() {
        this.tipsLabel.string = '';
        this.versionLabel.string = '';
        this.updateProgress.progress = 0;
        this.dialogNode.active = false;
    }

    // 检查更新
    onBtnClickCheckUpdate() {
        if (sys.isNative) {
            if (this.manifest) {
                this.tipsLabel.string = '正在获取版本...';
                HotUpdate.checkUpdate();
            }
        } else {
            log('web 平台不需要热更新');
            this._enterGame();
        }
    }

    _enterGame() {
        log('进入游戏成功');
        this.updateProgress.node.active = false;
        director.loadScene('GameScene');
    }
}
