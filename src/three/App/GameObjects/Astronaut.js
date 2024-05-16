import { GameObjectAnimated } from "../Framework";

export class Astronaut extends GameObjectAnimated {
  constructor() {
    super("astronaut_anim");
  }

  onLoad() {
    super.onLoad();
    this._model.scale.set(0.1, 0.1, 0.1);
    this._model.position.set(0, 11.11, 0);
    const action = this._mixer.clipAction(this._resource.animsByName["idle"]);
    action.play();
  }
}
