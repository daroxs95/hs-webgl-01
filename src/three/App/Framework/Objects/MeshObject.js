import { GameObject } from "./GameObject";
import { Resources } from "../Resources";

export class MeshObject extends GameObject {
  _resource;
  _model;
  _materials;

  constructor(resource_name) {
    if (new.target === MeshObject) {
      throw new TypeError("Cannot construct MeshObject instances directly");
    }
    super();
    this._materials = [];
    this._resource = Resources.getInstance().get(resource_name);

    this._resource.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this._model = this._resource.scene;
    this._model.traverse((child) => {
      if (child.isMesh) {
        // TODO fix this flow
        this._materials.push(child);
      }
    });
  }

  onLoad() {
  }

  getModel() {
    return this._model;
  }
}
