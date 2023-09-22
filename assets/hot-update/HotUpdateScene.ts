import HotUpdate, { HotOptions, VersionData } from "./HotUpdate";
import DialogMgr from "./DialogMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({ displayName: 'project.manifest', type: cc.Asset, })
    manifest: cc.Asset = null;

    @property({ displayName: '版本号', type: cc.Label, })
    versionLabel: cc.Label = null;

    @property({ displayName: '热更新进度条', type: cc.ProgressBar })
    updateProgress: cc.ProgressBar = null;

    @property({ displayName: '消息提示', type: cc.Label })
    tipsLabel: cc.Label = null;

    @property({ displayName: '添加节点', type: cc.Node })
    addNode: cc.Node = null;


    onLoad() {
        cc.resources.load("DialogLayer"); // preload prefab
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
            DialogMgr.showTipsWithOkBtn(`检测到新版本,一共${fileCount}个文件:${fileSize}Kb\n点击确定开始更新`, () => {
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
            cc.log(msg);
            DialogMgr.showTipsWithOkBtn('更新失败,点击重试', () => {
                HotUpdate.checkUpdate();
            });

        };
        options.OnUpdateSucceed = () => {
            this.tipsLabel.string = '更新成功';
            cc.log('更新成功');
            DialogMgr.showTipsWithOkBtn('更新成功,点击确定重启游戏', () => {
                cc.audioEngine.stopAll();
                cc.game.restart();
            });
        };
        HotUpdate.init(this.manifest, options);

    }


    _initView() {
        this.tipsLabel.string = '';
        this.versionLabel.string = '';
        this.updateProgress.progress = 0;
        this.addNode.destroyAllChildren();
    }

    // 检查更新
    onBtnClickCheckUpdate() {
        if (cc.sys.isNative) {
            if (this.manifest) {
                this.tipsLabel.string = '正在获取版本...';
                HotUpdate.checkUpdate();
            }
        } else {
            cc.log('web 平台不需要热更新');
            this._enterGame();
        }
    }

    _enterGame() {
        cc.log('进入游戏成功');
        this.updateProgress.node.active = false;
        cc.director.loadScene('GameScene');
    }
}
