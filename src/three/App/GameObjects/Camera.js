export class Camera {
    _camera

    constructor(camera) {
        this._camera = camera;
    }

    onLoad() {
        this._camera.position.z = 2.5;
        this._camera.position.y = 1.1;
        this._camera.position.x = 0;
    }

    onUpdate(deltaTime) {
    }
}