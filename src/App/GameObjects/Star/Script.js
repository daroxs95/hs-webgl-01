import { Color, PointLight, Vector2, Vector3 } from "three";
import { Script } from "../../Framework/Components/Script";

export class Star extends Script {
  _materials;
  _transform;
  _rotationSpeed = 0.3;
  _floatingSpeed = 2;
  _floatingAmmount = 0.2;
  // _initialPosition = { x: -2, y: 11.3, z: 2.5 };

  _orbitRadius = 20;
  _v1 = new Vector3(0, 0, 0);
  _v2 = new Vector3(0, 0, 0);

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;
    this._materials = this._entity.getComponent("mesh")._materials;

    this._transform.scale.set(1, 1, 1);
    // this._transform.position.set(
    //   this._initialPosition.x,
    //   this._initialPosition.y,
    //   this._initialPosition.z,
    // );

    // randomly place stars in orbit
    this._v1 = new Vector3(
      Math.random(),
      Math.random(),
      Math.random(),
    ).normalize();
    this._v2 = new Vector3(Math.random(), Math.random(), Math.random())
      .cross(this._v1)
      .normalize();

    this._materials[0].material.emissive = new Color(0xffd400);
    const pointLight = new PointLight(0xffd400, 1, 100);
    this._transform.add(pointLight);
  }

  onUpdate(deltaTime, elapsedTime) {
    // floating movement using deltaTime
    // this._transform.position.y +=
    //   Math.sin(this._floatingSpeed * elapsedTime) * this._floatingAmmount;

    //floating rotation on all axis movement
    this._transform.rotation.x += this._rotationSpeed * deltaTime;
    this._transform.rotation.y += this._rotationSpeed * deltaTime;
    this._transform.rotation.z += this._rotationSpeed * deltaTime;

    // Float around the orbit
    // Calculate new position based on angles

    this._transform.position.copy(
      this.circleParametric(elapsedTime * 0.1 * this._floatingSpeed),
    );
  }

  circleParametric(t) {
    const h = 0;
    const k = 0;
    const l = 0;

    const r = this._orbitRadius;

    const u_x = this._v1.x;
    const u_y = this._v1.y;
    const u_z = this._v1.z;

    const v_x = this._v2.x; // Component of v vector in x direction
    const v_y = this._v2.y; // Component of v vector in y direction
    const v_z = this._v2.z; // Component of v vector in z direction

    const x = h + r * (u_x * Math.cos(t) + v_x * Math.sin(t));
    const y = k + r * (u_y * Math.cos(t) + v_y * Math.sin(t));
    const z = l + r * (u_z * Math.cos(t) + v_z * Math.sin(t));

    return new Vector3(x, y, z);
  }
}
