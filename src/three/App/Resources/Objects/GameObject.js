export class GameObject {
    _resource
    _model
    _app
    _resource_name

    constructor(app, resource_name) {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct GameObject instances directly");
        }
        this._model = null;
        this._app = app;
        this._resource_name = resource_name;
    }

    onLoad() {
        this._resource = this._app.addModelToScene(this._resource_name);
        this._model = this._resource.scene;
    };

    onUpdate() {
    };
}