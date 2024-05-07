import {GameObjectAnimated} from "../Resources/Objects/GameObjectAnimated";

export class Astronaut extends GameObjectAnimated {
    constructor(app) {
        super(app, 'astronaut_anim');
        this._mixer = null;
    }

    onLoad() {
        super.onLoad();
        this._model.scale.set(0.1, 0.1, 0.1);
        this._model.position.set(0, 0.1, 0);
        const action = this._mixer.clipAction(this._resource.animsByName['idle']);
        action.play();
    }

    onUpdate() {
    }
}