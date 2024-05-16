import { Script } from "../Framework/Components/Script";

export class Rocket extends Script {
  _transform;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;

    this._transform.scale.set(0.003, 0.003, 0.003);
    this._transform.position.set(-2, 10.71, -2);
    this._transform.rotation.z = Math.PI * 0.06;
    this._transform.rotation.x = Math.PI * -0.06;
  }
}
