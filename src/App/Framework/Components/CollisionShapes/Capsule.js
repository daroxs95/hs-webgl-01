import { CollisionShape } from "./CollisionShape";
import { CapsuleGeometry, Mesh } from "three";
import { collisionHelperMeshShader } from "./Shader";

export class CapsuleCollisionShape extends CollisionShape {
  constructor(radius, height, helperVisible) {
    const helperMesh = new Mesh(
      new CapsuleGeometry(radius, height, 50, 50),
      collisionHelperMeshShader,
    );
    super(helperMesh, helperVisible);
    this._shape = new Ammo.btCapsuleShape(radius, height);
  }
}
