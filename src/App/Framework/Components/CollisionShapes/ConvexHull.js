import { CollisionShape } from "./CollisionShape";
import { Matrix4, Mesh } from "three";
import { collisionHelperMeshShader } from "./Shader";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export class ConvexHullCollisionShape extends CollisionShape {
  constructor(model, helperVisible) {
    const mergedGeometry = getMergedGeometry(model)
      .scale(model.scale.x, model.scale.y, model.scale.z);
    // .applyQuaternion(model.quaternion);
    const inverseRotationMatrix = new Matrix4();
    inverseRotationMatrix.makeRotationFromQuaternion(model.quaternion).invert();
    // mergedGeometry.applyMatrix4(inverseRotationMatrix);

    const helperMesh = new Mesh(mergedGeometry, collisionHelperMeshShader);
    super(helperMesh, helperVisible);
    this._shape = genConvexHull(mergedGeometry);
  }
}

function genConvexHull(geometry) {
  const vertices = geometry.attributes.position.array;
  const shape = new Ammo.btConvexHullShape();

  for (let i = 0; i < vertices.length; i += 3) {
    const vx = vertices[i];
    const vy = vertices[i + 1];
    const vz = vertices[i + 2];
    const btVec = new Ammo.btVector3(vx, vy, vz);
    shape.addPoint(btVec, true);
  }

  return shape;
}

// Function to generate a convex hull from all geometries in a GLTF model
function getMergedGeometry(model) {
  const geometries = [];

  // Traverse the GLTF scene to collect all vertices
  model.traverse((child) => {
    if (child.isMesh) {
      geometries.push(child.geometry);
    }
  });

  return mergeGeometries(geometries);
}
