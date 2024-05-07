import {GameObject} from "../Resources/Objects/GameObject";

export class Rocket extends GameObject {
    constructor(app) {
        super(app, 'rocket');
        this._mixer = null;
    }

    onLoad() {
        super.onLoad();
        this._model.scale.set(0.003, 0.003, 0.003);
        this._model.position.set(-2, -0.3, -2);
        this._model.rotation.z = Math.PI * 0.06;
        this._model.rotation.x = Math.PI * -0.06;
    }
}