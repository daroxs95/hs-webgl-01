import { Color, PointLight } from "three";
import { Script } from "../Framework/Components/Script";

export class Star extends Script {
  _materials;
  _transform;

  _rotationSpeed = 0.3;
  _floatingSpeed = 3;
  _floatingAmmount = 0.2;
  _initialPosition = { x: -2, y: 11.3, z: 2.5 };

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;
    this._materials = this._entity.getComponent("mesh")._materials;

    this._transform.scale.set(0.5, 0.5, 0.5);
    this._transform.position.set(
      this._initialPosition.x,
      this._initialPosition.y,
      this._initialPosition.z
    );
    this._materials[0].material.emissive = new Color(0xffd400);
    const pointLight = new PointLight(0xffd400, 1, 100);
    this._transform.add(pointLight);
  }

  onUpdate(deltaTime, elapsedTime) {
    // floating movement using deltaTime
    this._transform.position.y =
      this._initialPosition.y +
      Math.sin(this._floatingSpeed * elapsedTime) *
      this._floatingAmmount;

    //floating rotation on all axis movement
    this._transform.rotation.x += this._rotationSpeed * deltaTime;
    this._transform.rotation.y += this._rotationSpeed * deltaTime;
    this._transform.rotation.z += this._rotationSpeed * deltaTime;
  }
}
