import { MeshObject } from "../Framework";
import { Color, PointLight } from "three";

export class Star extends MeshObject {
  _rotationSpeed = 0.3;
  _floatingSpeed = 3;
  _floatingAmmount = 0.2;
  _initialPosition = { x: -2, y: 11.3, z: 2.5 };

  constructor() {
    super("star");
  }

  onLoad() {
    super.onLoad();
    this._model.scale.set(0.5, 0.5, 0.5);
    this._model.position.set(
      this._initialPosition.x,
      this._initialPosition.y,
      this._initialPosition.z
    );
    this._materials[0].material.emissive = new Color(0xffd400);
    const pointLight = new PointLight(0xffd400, 1, 100);
    this._model.add(pointLight);
  }

  onUpdate(deltaTime, elapsedTime) {
    // floating movement using deltaTime
    this._model.position.y =
      this._initialPosition.y +
      Math.sin(this._floatingSpeed * elapsedTime) *
      this._floatingAmmount;

    //floating rotation on all axis movement
    this._model.rotation.x += this._rotationSpeed * deltaTime;
    this._model.rotation.y += this._rotationSpeed * deltaTime;
    this._model.rotation.z += this._rotationSpeed * deltaTime;
  }
}
