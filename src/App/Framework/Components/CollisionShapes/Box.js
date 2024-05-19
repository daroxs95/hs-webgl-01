import { CollisionShape } from "./CollisionShape";
import { BoxGeometry, Mesh } from "three";
import { collisionHelperMeshShader } from "./Shader";

export class BoxCollisionShape extends CollisionShape {
  constructor(width, height, depth, helperVisible) {
    const helperMesh = new Mesh(
      new BoxGeometry(width, height, depth, 10, 10),
      collisionHelperMeshShader,
    );
    super(helperMesh, helperVisible);
    this._shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width / 2, height / 2, depth / 2),
    );
  }
}
