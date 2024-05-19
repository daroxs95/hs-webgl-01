import { AnimationMixer } from "three";
import { ResourceMeshObject } from "./ResourceMeshObject";

export class AnimatedGameObject extends ResourceMeshObject {
  _mixer;

  constructor(resource_name, entity, withHelper) {
    super(resource_name, entity, withHelper);
    this._mixer = new AnimationMixer(this._model);
  }

  getMixer() {
    return this._mixer;
  }
}
