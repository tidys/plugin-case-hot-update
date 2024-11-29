import { director, view, Prefab, resources, Node, instantiate, find } from 'cc'
import { DialogLayer } from '../resources/DialogLayer';
function addToCanvas(node: Node) {
    const canvas = find("Canvas");
    if (canvas) {
        node.setPosition(0, 0);
        canvas.addChild(node);
    }
}
export default {
    showTipsWithOkBtn(word: string, okCb = null, cancelCb = null, closeCb = null) {
        resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
            if (!err) {
                let layer = instantiate(prefab);
                addToCanvas(layer);

                let script = layer.getComponent(DialogLayer);
                if (script) {
                    script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                }
            }
        });

    },
    showTipsWithOkCancelBtn(word: string, okCb = null, cancelCb = null, closeCb = null, showCb?) {
        resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
            if (!err) {
                let layer: Node = instantiate(prefab);
                addToCanvas(layer);

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
        resources.load("DialogLayer", (err, prefab: Prefab) => {
            if (!err) {
                let layer: Node = instantiate(prefab);
                addToCanvas(layer);
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
}
