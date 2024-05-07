import {GameObjectAnimated} from "../Framework";

export class Planet extends GameObjectAnimated {
    constructor(app) {
        super(app, 'planet');
        this._mixer = null;
    }

    onLoad() {
        super.onLoad();
        this._model.position.set(0, -11.16, 0);
    }
}