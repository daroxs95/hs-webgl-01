import { MeshObject } from "../Framework";

export class Alien extends MeshObject {
  constructor() {
    super("alien");
  }

  onLoad() {
    super.onLoad();
    this._model.scale.set(0.5, 0.5, 0.5);
    this._model.position.set(2, 10.36, -3);
    this._model.rotation.y = Math.PI * 0.5;
    this._model.rotation.x = Math.PI * -0.06;
    this._model.rotation.z = Math.PI * -0.06;
  }

  onUpdate(deltaTime) {
  }
}
