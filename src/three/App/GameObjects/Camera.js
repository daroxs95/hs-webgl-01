import { lerp } from "three/src/math/MathUtils";
import { OrbitControls } from "three/addons";
import { Vector3 } from "three";

export class Camera {
  _camera;
  _app;
  _mouse = { x: 0, y: 0 };
  _initialPosition = { x: 0, y: 12.26, z: 2.5 };
  _moveSpeed = 10;
  _moveAmount = 0.25;
  _orbitControls;
  _controlEnabled = true;
  _focusObject;
  _focusObjects;

  constructor(app, focusObjects) {
    this._app = app;
    this._camera = this._app.getCamera();
    this._focusObjects = focusObjects;
    this._focusObject = this._focusObjects[0];
  }

  onLoad() {
    this._camera.position.set(
      this._initialPosition.x,
      this._initialPosition.y,
      this._initialPosition.z
    );
    this._orbitControls = new OrbitControls(
      this._camera,
      this._app.getGlContext().domElement
    );
    this._orbitControls.enabled = !this._controlEnabled;
    window.addEventListener("pointermove", (e) => this.onMouseMove(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  onUpdate(deltaTime) {
    if (this._controlEnabled) {
      const new_x = this._initialPosition.x + this._mouse.x * this._moveAmount;
      const new_y = this._initialPosition.y + this._mouse.y * this._moveAmount;
      const new_z = this._initialPosition.z;
      this._camera.position.x = lerp(
        this._camera.position.x,
        new_x,
        deltaTime * this._moveSpeed
      );
      this._camera.position.y = lerp(
        this._camera.position.y,
        new_y,
        deltaTime * this._moveSpeed
      );
      this._camera.position.z = lerp(
        this._camera.position.z,
        new_z,
        deltaTime * this._moveSpeed
      );

      // Calculate the direction from the camera to the target object
      const directionToTarget = new Vector3();
      directionToTarget.subVectors(this._focusObject.getModel().position, this._camera.position).normalize();
      const currentDirection = new Vector3();
      this._camera.getWorldDirection(currentDirection);
      const newDirection = new Vector3();
      newDirection.lerpVectors(currentDirection, directionToTarget, this._moveSpeed * deltaTime);
      this._camera.lookAt(this._camera.position.clone().add(newDirection));
    }
  }

  onMouseMove(e) {
    this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onKeyUp(e) {
    if (e.key === "c") {
      this._controlEnabled = !this._controlEnabled;
      this._orbitControls.enabled = !this._controlEnabled;
    }

    // change focusObject
    if (e.key === "f") {
      const index = this._focusObjects.indexOf(this._focusObject);
      this._focusObject =
        this._focusObjects[(index + 1) % this._focusObjects.length];
    }
  }
}
