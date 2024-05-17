import { CollisionShape } from "./CollisionShape";
import { Mesh, SphereGeometry } from "three";
import { collisionHelperMeshShader } from "./Shader";

export class ShpereCollisionShape extends CollisionShape {
  constructor(radius, helperVisible) {
    const helperMesh = new Mesh(
      new SphereGeometry(radius, 50, 50),
      collisionHelperMeshShader,
    );
    super(helperMesh, helperVisible);
    this._shape = new Ammo.btSphereShape(radius);
  }
}
