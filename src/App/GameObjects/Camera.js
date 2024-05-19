import { PerspectiveCamera, Vector3 } from "three";
import { GameObject } from "../Framework";
import { OrbitControls } from "three/addons";

export class Camera extends GameObject {
  _camera;
  _appComposer;
  _mouse = { x: 0, y: 0 };
  _initialPosition = new Vector3(0, 150, 2.5);
  _moveSpeed = 2;
  _moveAmount = 0.25;
  _orbitControls;
  _controlEnabled = true;
  _focusObject;
  _focusObjects;
  _realSpeed = 0;
  _isInsideOrbit = false;
  _renderer;
  _isInGame = false;

  _lastPosition = new Vector3();
  _moveDirection = new Vector3();
  _modelOffset = new Vector3(10, 10, 10.5);
  _targetObejct = new Vector3();
  _zoomSpeed = 3;

  constructor(focusObjects, renderer) {
    super();
    const aspectRatio = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    this._focusObjects = focusObjects;
    this._focusObject = this._focusObjects[0];
    this._appComposer = renderer.getComposer();
    this._renderer = renderer.getGlInstance();
  }

  onLoad() {
    this._camera.position.copy(this._initialPosition);

    this._orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement,
    );
    this._orbitControls.enabled = !this._controlEnabled;

    const prevBtn = document.querySelector("#slider-prev");
    prevBtn.addEventListener("click", () => {
      this.focusPrev();
    });
    const nextBtn = document.querySelector("#slider-next");
    nextBtn.addEventListener("click", () => {
      this.focusNext();
    });
    const playBtn = document.querySelector("#start_game");
    playBtn?.addEventListener("click", () => {
      this.lockOnChar();
      playBtn.style.opacity = 0;
      nextBtn.style.opacity = 0;
      prevBtn.style.opacity = 0;
    });
  }

  lockOnChar() {
    this._isInGame = true;
    this._modelOffset.set(0, 2, -2);
    const focusObjectScript = this._focusObject
      .getEntity()
      .getComponent("script");
    if (focusObjectScript.setControlled) focusObjectScript.setControlled(true);
  }

  getCamera() {
    return this._camera;
  }

  onUpdate(deltaTime) {
    if (this._controlEnabled) {
      this._targetObejct
        .copy(this._focusObject.getModel().position)
        .add(this._modelOffset);
      this._targetObejct.x += this._mouse.x * this._moveAmount;
      this._targetObejct.y += this._mouse.y * this._moveAmount;

      this._moveDirection = this._targetObejct
        .clone()
        .sub(this._camera.position);
      const distance = this._moveDirection.length();
      const velocity = this._moveDirection
        .normalize()
        .multiplyScalar(this._moveSpeed * deltaTime);

      if (distance < velocity.length()) {
        this._camera.position.copy(this._targetObejct);
      } else {
        this._camera.position.add(velocity);
      }

      // Calculate the direction from the camera to the target object
      const directionToTarget = new Vector3();
      directionToTarget
        .subVectors(
          this._focusObject.getModel().position,
          this._camera.position,
        )
        .normalize();
      const currentDirection = new Vector3();
      this._camera.getWorldDirection(currentDirection);
      const newDirection = new Vector3();
      newDirection.lerpVectors(
        currentDirection,
        directionToTarget,
        this._moveSpeed * deltaTime,
      );
      this._camera.lookAt(this._camera.position.clone().add(newDirection));
    }

    this._realSpeed =
      this._camera.position.distanceTo(this._lastPosition) / deltaTime;
    this._lastPosition.copy(this._camera.position);

    this._appComposer?.setCameraSpeed(this._realSpeed);
    this._isInsideOrbit =
      this._camera.position.distanceTo(this._focusObject.getModel().position) <
      40;
    this._moveSpeed = this._isInsideOrbit ? 10 : 50;
    this._appComposer?.toggleChromaticAberration(this._isInsideOrbit);
  }

  focusNext() {
    if (this._isInGame) return;

    const index = this._focusObjects.indexOf(this._focusObject);
    this._focusObject =
      this._focusObjects[(index + 1) % this._focusObjects.length];
  }

  focusPrev() {
    if (this._isInGame) return;

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
    if (e.key === "f" && !this._isInGame) {
      this.focusNext();
    }
  }

  addFocusObject(focusObject) {
    this._focusObjects.push(focusObject);
  }

  onMouseScroll(e) {
    if (this._isInGame) return;

    const directionToTarget = new Vector3();
    directionToTarget
      .subVectors(this._focusObject.getModel().position, this._camera.position)
      .normalize()
      .multiplyScalar(this._zoomSpeed);

    if (e.deltaY < 0) {
      // zoom in camera
      this._modelOffset.add(directionToTarget);
    } else {
      // zoom out camera
      this._modelOffset.sub(directionToTarget);
    }
  }
}
