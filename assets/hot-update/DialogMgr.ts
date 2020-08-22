export default {
    showTipsWithOkBtn(word, okCb, cancelCb?, closeCb?) {
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.resources.load("DialogLayer", cc.Prefab, (err, prefab: cc.Prefab) => {
                if (!err) {
                    let layer = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
                    if (script) {
                        script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                    }
                }
            });
        }
    },
    showTipsWithOkCancelBtn(word, okCb, cancelCb?, closeCb?, showCb?) {
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.resources.load("DialogLayer", cc.Prefab, (err, prefab: cc.Prefab) => {
                if (!err) {
                    let layer: cc.Node = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
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
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.resources.load("DialogLayer", (err, prefab: cc.Prefab) => {
                if (!err) {
                    let layer: cc.Node = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
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
