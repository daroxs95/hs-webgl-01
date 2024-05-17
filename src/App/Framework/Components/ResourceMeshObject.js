import { Resources } from "../Resources";
import { MeshObject } from "./MeshObject";

export class ResourceMeshObject extends MeshObject {
  _resource;

  constructor(resource_name, entity) {
    const resource = Resources.getInstance().get(resource_name);
    const model = resource.scene;

    super(model, entity);
    this._resource = resource;

    // Enabling shadows
    this._resource.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}
