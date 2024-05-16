import { lerp } from "three/src/math/MathUtils";
import { PerspectiveCamera, Vector3 } from "three";
import { GameObject } from "../Framework";

export class Camera extends GameObject {
  _camera;
  _appComposer;
  _mouse = { x: 0, y: 0 };
  _initialPosition = { x: 0, y: 5500, z: 2.5 };
  _moveSpeed = 2;
  _moveAmount = 0.25;
  _orbitControls;
  _controlEnabled = true;
  _focusObject;
  _focusObjects;
  _realSpeed = 0;
  _isInsideOrbit = false;

  constructor(focusObjects) {
    super();
    const aspectRatio = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    this._focusObjects = focusObjects;
    this._focusObject = this._focusObjects[0];
  }

  onLoad() {
    this._camera.position.set(
      this._initialPosition.x,
      this._initialPosition.y,
      this._initialPosition.z
    );

    const prevBtn = document.querySelector("#slider-prev");
    prevBtn.addEventListener("click", () => {
      this.focusPrev();
    });
    const nextBtn = document.querySelector("#slider-next");
    nextBtn.addEventListener("click", () => {
      this.focusNext();
    });
  }

  getCamera() {
    return this._camera;
  }

  onUpdate(deltaTime) {
    const cameraLastPos = this._camera.position.clone();
    if (this._controlEnabled) {

      const new_x =
        this._focusObject.getModel().position.x +
        1 +
        this._mouse.x * this._moveAmount;
      const new_y =
        this._focusObject.getModel().position.y +
        3 +
        this._mouse.y * this._moveAmount;
      const new_z = this._focusObject.getModel().position.z + 2.5;
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
      directionToTarget
        .subVectors(
          this._focusObject.getModel().position,
          this._camera.position
        )
        .normalize();
      const currentDirection = new Vector3();
      this._camera.getWorldDirection(currentDirection);
      const newDirection = new Vector3();
      newDirection.lerpVectors(
        currentDirection,
        directionToTarget,
        this._moveSpeed * deltaTime
      );
      this._camera.lookAt(this._camera.position.clone().add(newDirection));
    }
    this._realSpeed = this._camera.position.distanceTo(cameraLastPos) * 10;
    this._appComposer?.setCameraSpeed(this._realSpeed);
    this._isInsideOrbit = this._camera.position.distanceTo(
      this._focusObject.getModel().position
    ) < 10;
    this._moveSpeed = this._isInsideOrbit ? 8 : 2;
    this._appComposer?.toggleChromaticAberration(this._isInsideOrbit);
  }

  focusNext() {
    const index = this._focusObjects.indexOf(this._focusObject);
    this._focusObject =
      this._focusObjects[(index + 1) % this._focusObjects.length];
  }

  focusPrev() {
    const index = this._focusObjects.indexOf(this._focusObject);
    this._focusObject =
      this._focusObjects[
      (index - 1 + this._focusObjects.length) % this._focusObjects.length
        ];
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
      this.focusNext();
    }
  }

  addFocusObject(focusObject) {
    this._focusObjects.push(focusObject);
  }
}
