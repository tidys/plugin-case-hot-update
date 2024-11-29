import { director, view, Prefab, resources, Node, instantiate } from 'cc'
import { DialogLayer } from '../resources/DialogLayer';
export default {
    showTipsWithOkBtn(word, okCb, cancelCb?, closeCb?) {
        let scene = director.getScene();
        if (scene) {
            let w = view.getVisibleSize().width;
            let h = view.getVisibleSize().height;
            resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
                if (!err) {
                    let layer = instantiate(prefab);
                    layer.setPosition(w / 2, h / 2);
                    scene.addChild(layer);
                    let script = layer.getComponent(DialogLayer);
                    if (script) {
                        script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                    }
                }
            });
        }
    },
    showTipsWithOkCancelBtn(word, okCb, cancelCb?, closeCb?, showCb?) {
        let scene = director.getScene();
        if (scene) {
            let w = view.getVisibleSize().width;
            let h = view.getVisibleSize().height;
            resources.load("DialogLayer", Prefab, (err, prefab: Prefab) => {
                if (!err) {
                    let layer: Node = instantiate(prefab);
                    layer.setPosition(w / 2, h / 2);
                    scene.addChild(layer);
                    let script = layer.getComponent(DialogLayer);
                    if (script) {
                        script.showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb);
                    }
                    if (showCb) {
                        showCb(layer);
                    }
                }
            });
        }
    },
    // 只有一个确定按钮
    showTipsWithOkBtnAndNoCloseBtn(word, okCb, cancelCb?, showCb?) {
        let scene = director.getScene();
        if (scene) {
            let w = view.getVisibleSize().width;
            let h = view.getVisibleSize().height;
            resources.load("DialogLayer", (err, prefab: Prefab) => {
                if (!err) {
                    let layer: Node = instantiate(prefab);
                    layer.setPosition(w / 2, h / 2);
                    scene.addChild(layer);
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
        }
    },
}
