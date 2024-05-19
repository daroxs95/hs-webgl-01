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
    this._rigidBodyTransform = this._entity
      .getComponent("rigid_body")
      .getTransform();
  }

  onUpdate(deltaTime, elapsedTime) {
    const planetPosition = new Vector3(0, 0, 0);
    const gravity = planetPosition
      .clone()
      .sub(this._transform.position)
      .normalize()
      .multiplyScalar(4);

    // const movementVelocity = new Vector3(
    //   Math.cos(this._transform.rotation.y) * this._movementAxis.x * -1,
    //   Math.cos(this._transform.rotation.x) * this._movementAxis.y,
    //   Math.cos(this._transform.rotation.z) * this._movementAxis.z
    // );

    // this.player.position.x -= this.moveSpeed * Math.sin( this.player.rotation.y );
    // this.player.position.z -= this.moveSpeed * Math.cos( this.player.rotation.y );

    // movementVelocity.multiplyScalar(this._movementSpeed);

    // gravity.add(movementVelocity);
    this._rigidBody.setLinearVelocity(
      new Ammo.btVector3(gravity.x, gravity.y, gravity.z),
    );

    // level on planet
    // const a = gravity.clone().multiplyScalar(-1).normalize();
    // const q = new Quaternion().setFromUnitVectors(this._transform.up, a).multiply(new Quaternion().setFromEuler(this._transform.rotation));

    // const tr = new Ammo.btTransform();
    // tr.setOrigin(new Ammo.btVector3(this._transform.position.x, this._transform.position.y, this._transform.position.z));
    // const quat = new Ammo.btQuaternion(q.x, q.y, q.z, q.w);
    // tr.setRotation(quat);
    // this._rigidBody.setCenterOfMassTransform(tr);

    // this._rigidBodyTransform.setRotation(
    //   new Ammo.btQuaternion(q._x, q._y, q._z, q._w)
    // );

    // const astronautQuaternion = this._transform.quaternion.clone();
    // const planetPosition = new Vector3(0, 0, 0);
    // // make y local axis point to the planet
    // const astronautUp = new Vector3(0, 1, 0).applyQuaternion(astronautQuaternion);
    // const planetUp = new Vector3(0, 1, 0);
    // const axis = astronautUp.clone().cross(planetUp);
    // const angle = astronautUp.angleTo(planetUp);
    // const quaternion = new Quaternion().setFromAxisAngle(axis, angle);
    //
    // this._rigidBodyTransform.setRotation(
    //   new Ammo.btQuaternion(
    //     quaternion.x,
    //     quaternion.y,
    //     quaternion.z,
    //     quaternion.w
    //   )
    // );
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
