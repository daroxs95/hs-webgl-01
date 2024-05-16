import { GameObject } from "./GameObject";

export class MeshObject extends GameObject {
  _model;
  _materials = [];

  constructor(model) {
    super();
    this._model = model;

    model.traverse((child) => {
      if (child.isMesh) {
        // TODO fix this flow
        this._materials.push(child);
      }
    });
  }

  getModel() {
    return this._model;
  }
}
