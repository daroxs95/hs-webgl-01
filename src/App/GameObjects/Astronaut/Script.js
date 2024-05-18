import { Script } from "../../Framework/Components/Script";
import { Quaternion, Vector3 } from "three";

export class Astronaut extends Script {
  _transform;
  _rigidBodyTransform;
  _mixer;
  _resource;
  _rigidBody;
  _movementAxis = new Vector3(0, 0, 0);
  _movementSpeed = 10;
  _currentSpeed = 0;
  _controlled = false;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("animated_mesh")._model;
    this._mixer = this._entity.getComponent("animated_mesh")._mixer;
    this._resource = this._entity.getComponent("animated_mesh")._resource;

    this._transform.scale.set(0.1, 0.1, 0.1);
    this._transform.position.set(0, 11.11, 0);
    const action = this._mixer.clipAction(this._resource.animsByName["idle"]);
    action.play();
  }

  onReady() {
    this._rigidBody = this._entity.getComponent("rigid_body").getRigidBody();
    this._rigidBodyTransform = this._entity.getComponent("rigid_body").getTransform();
  }

  onUpdate(deltaTime, elapsedTime) {
    const gravity = new Vector3(0, 0, 0)
      .sub(this._transform.position)
      .normalize()
      .multiplyScalar(4);

    const movementVelocity = new Vector3(
      0,
      0,
      -1
    );
    console.log(movementVelocity);
    // movementVelocity.applyQuaternion(this._transform.quaternion);

    // Apply movement axis on model local space
    movementVelocity.multiplyScalar(this._movementAxis.z * this._movementSpeed);

    gravity.add(movementVelocity);
    this._rigidBody.setLinearVelocity(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));

    const astronautQuaternion = this._transform.quaternion.clone();
    const planetPosition = new Vector3(0, 0, 0);
    // make y local axis point to the planet
    const astronautUp = new Vector3(0, 1, 0).applyQuaternion(astronautQuaternion);
    const planetUp = new Vector3(0, 1, 0);
    const axis = astronautUp.clone().cross(planetUp);
    const angle = astronautUp.angleTo(planetUp);
    const quaternion = new Quaternion().setFromAxisAngle(axis, angle);

    this._rigidBodyTransform.setRotation(
      new Ammo.btQuaternion(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      )
    );
  }

  onKeyDown(e) {
    if (!this._controlled) return;
    switch (e.key) {
      case "w":
        this._movementAxis.z = 1;
        break;
      case "s":
        this._movementAxis.z = -1;
        break;
      case "a":
        this._movementAxis.x = -1;
        break;
      case "d":
        this._movementAxis.x = 1;
        break;
      case " ":
        this._movementAxis.y = 1;
        break;
    }
  }

  onKeyUp(e) {
    if (!this._controlled) return;
    switch (e.key) {
      case "w":
      case "s":
        this._movementAxis.z = 0;
        break;
      case "a":
      case "d":
        this._movementAxis.x = 0;
        break;
      case " ":
        this._movementAxis.y = 0;
        break;
    }
  }

  setControlled(val) {
    this._controlled = val;
  }
}
