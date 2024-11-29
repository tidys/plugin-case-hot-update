import { _decorator, Component, Label, Node } from 'cc'
const { ccclass, property } = _decorator
@ccclass("DialogLayer")

export class DialogLayer extends Component {
    @property({ type: Node })
    okBtn: Node = null
    @property({ type: Node })
    cancelBtn: Node = null
    @property({ type: Node })
    closeBtn: Node = null
    @property(Label)
    tipsLabel: Label = null

    _okCb = null;
    _cancelCb = null;
    _closeCb = null;


    showTipsWithOkBtn(word, okCb, cancelCb, closeCb = null) {
        this.okBtn.active = true;
        this.cancelBtn.active = false;
        this.tipsLabel.string = word;

        this._okCb = okCb;
        this._cancelCb = cancelCb;
        this._closeCb = closeCb;
    }
    showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb) {
        this.okBtn.active = true;
        this.cancelBtn.active = true;
        this.tipsLabel.string = word;

        this._okCb = okCb;
        this._cancelCb = cancelCb;
        this._closeCb = closeCb;
    }
    setCloseBtnVisible(b = false) {
        this.closeBtn.active = b;
    }
    onClickBtnOk() {
        //添加声音资源
        if (this._okCb) {
            this._okCb();
        }
        if (this.node) {
            this.node.destroy();
        }
    }
    onClickBtnCancel() {
        if (this._cancelCb) {
            this._cancelCb();
        }
        if (this.node) {
            this.node.destroy();
        }
    }
    onClickBtnClose() {
        if (this._closeCb) {
            this._closeCb();
        }
        this.node.destroy();
    }
}



