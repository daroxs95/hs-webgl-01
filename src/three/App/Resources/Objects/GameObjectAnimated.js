import {AnimationMixer} from "three";
import {GameObject} from "./GameObject";

export class GameObjectAnimated extends GameObject {
    _mixer

    constructor(app, resource_name) {
        if (new.target === GameObjectAnimated) {
            throw new TypeError("Cannot construct GameObjectAnimated instances directly");
        }
        super(app, resource_name);
        this._mixer = null;
    }

    onLoad() {
        super.onLoad();
        this._mixer = new AnimationMixer(this._model);
        this._app.getMixers().push(this._mixer);
    }
}