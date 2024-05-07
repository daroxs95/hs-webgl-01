import {GameObject} from "../Resources/Objects/GameObject";

export class Planet extends GameObject {
    constructor(app) {
        super(app, 'planet');
        this._mixer = null;
    }

    onLoad() {
        super.onLoad();
        this._model.position.set(0, -11, 0);
    }
}