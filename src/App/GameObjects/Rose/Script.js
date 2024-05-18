import { Script } from "../../Framework/Components/Script";

export class Rose extends Script {
  _transform;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;

    this._transform.scale.set(1.2, 1.2, 1.2);
    this._transform.position.set(0.2, 10.36, 3);
  }
}
