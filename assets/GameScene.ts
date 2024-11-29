
import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    @property(Label)
    txt: Label = null;

    start() {

    }

    private idx: number = 0
    update(deltaTime: number) {
        if (this.txt) {
            this.idx++
            this.txt.string = this.idx.toString()
        }
    }
}

