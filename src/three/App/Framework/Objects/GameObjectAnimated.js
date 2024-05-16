import { AnimationMixer } from "three";
import { MeshObject } from "./MeshObject";

export class GameObjectAnimated extends MeshObject {
  _mixer;

  constructor(app, resource_name) {
    if (new.target === GameObjectAnimated) {
      throw new TypeError(
        "Cannot construct GameObjectAnimated instances directly"
      );
    }
    super(app, resource_name);
    this._mixer = new AnimationMixer(this._model);
  }

  getMixer() {
    return this._mixer;
  }
}
