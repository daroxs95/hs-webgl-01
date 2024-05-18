import { Script } from "../../Framework/Components/Script";

export class Planet extends Script {
  _transform;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;

    this._transform.position.set(0, 0, 0);
  }
}
