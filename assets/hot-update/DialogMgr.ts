import { director, view, Prefab, resources, Node, instantiate, find } from 'cc'
import { DialogLayer } from '../resources/DialogLayer';
export default {
    showTipsWithOkBtn(word: string, okCb = null, cancelCb = null, closeCb = null) {

        let w = view.getVisibleSize().width;
        let h = view.getVisibleSize().height;
        resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
            if (!err) {
                let layer = instantiate(prefab);
                this.addToCanvas(layer);

                let script = layer.getComponent(DialogLayer);
                if (script) {
                    script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                }
            }
        });

    },
    showTipsWithOkCancelBtn(word, okCb, cancelCb?, closeCb?, showCb?) {

        let w = view.getVisibleSize().width;
        let h = view.getVisibleSize().height;
        resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
            if (!err) {
                let layer: Node = instantiate(prefab);
                this.addToCanvas(layer);

                let script = layer.getComponent(DialogLayer);
                if (script) {
                    script.showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb);
                }
                if (showCb) {
                    showCb(layer);
                }
            }
        });

    },
    // 只有一个确定按钮
    showTipsWithOkBtnAndNoCloseBtn(word: string, okCb = null, cancelCb = null, showCb = null) {

        let w = view.getVisibleSize().width;
        let h = view.getVisibleSize().height;
        resources.load("DialogLayer", (err, prefab: Prefab) => {
            if (!err) {
                let layer: Node = instantiate(prefab);
                this.addToCanvas(layer);
                let script = layer.getComponent(DialogLayer);
                if (script) {
                    script.showTipsWithOkBtn(word, okCb, cancelCb);
                    script.setCloseBtnVisible();
                }
                if (showCb) {
                    showCb(layer);
                }
            }
        });

    },
    addToCanvas(node: Node) {
        const canvas = find("Canvas");
        if (canvas) {
            node.setPosition(0, 0);
            canvas.addChild(node);
        }
    }
}
