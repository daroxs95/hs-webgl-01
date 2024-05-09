export class GameObject {
  _resource;
  _model;
  _app;
  _resource_name;
  _materials;

  constructor(app, resource_name) {
    if (new.target === GameObject) {
      throw new TypeError("Cannot construct GameObject instances directly");
    }
    this._model = null;
    this._app = app;
    this._resource_name = resource_name;
    this._materials = [];
  }

  onLoad() {
    this._resource = this._app.addModelToScene(this._resource_name);
    this._model = this._resource.scene;
    this._model.traverse((child) => {
      if (child.isMesh) {
        // TODO fix this flow
        this._materials.push(child);
      }
    });
  }

  onUpdate(deltaTime) {}

  getModel() {
    return this._model;
  }
}
