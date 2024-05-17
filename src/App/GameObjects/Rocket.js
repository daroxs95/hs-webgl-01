import { Script } from "../Framework/Components/Script";
import { Vector3 } from "three";

export class Rocket extends Script {
  _transform;
  _rigidBody;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;

    this._transform.scale.set(0.003, 0.003, 0.003);
    this._transform.position.set(-2, 15.71, -2);
    this._transform.rotation.z = Math.PI * 0.06;
    this._transform.rotation.x = Math.PI * -0.06;
  }

  onReady() {
    this._rigidBody = this._entity.getComponent("rigid_body").getRigidBody();
  }

  onUpdate(deltaTime, elapsedTime) {
    const d = new Vector3(0, 0, 0)
      .sub(this._transform.position)
      .normalize()
      .multiplyScalar(4);
    this._rigidBody.setLinearVelocity(new Ammo.btVector3(d.x, d.y, d.z));
  }
}
