import { Resources } from "../Resources";
import { MeshObject } from "./MeshObject";
import { AxesHelper } from "three";

export class ResourceMeshObject extends MeshObject {
  _resource;

  constructor(resource_name, entity, withHelper, instanced) {
    const resource = Resources.getInstance().get(resource_name);

    // TODO this implementation of instanced is way off
    const model = instanced ? resource.scene.clone() : resource.scene;

    super(model, entity);
    this._resource = resource;

    // Enabling shadows
    this._resource.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Adding axes helper
    if (withHelper) {
      const axesHelper = new AxesHelper(50);
      this._resource.scene.add(axesHelper);
    }
  }
}
