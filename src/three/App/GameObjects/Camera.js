import {lerp} from "three/src/math/MathUtils";
import {OrbitControls} from "three/addons";

export class Camera {
    _camera
    _app
    _mouse = {x: 0, y: 0}
    _initialPosition = {x: 0, y: 1.1, z: 2.5}
    _moveSpeed = 10
    _moveAmount = 0.25
    _orbitControls

    constructor(app) {
        this._app = app;
        this._camera = this._app.getCamera();
    }

    onLoad() {
        this._camera.position.set(this._initialPosition.x, this._initialPosition.y, this._initialPosition.z);
        this._camera.lookAt(0, 0, 0);
        this._orbitControls = new OrbitControls(this._camera, this._app.getGlContext().domElement);
        this._orbitControls.enabled = false;
        window.addEventListener('pointermove', e => this.onMouseMove(e));
        window.addEventListener('keyup', e => this.onKeyUp(e));
    }

    onUpdate(deltaTime) {
        // rotate camera pivoting from 0.0.0 based on mouse position clamped to only some small movement and deltaTime
        const new_x = this._initialPosition.x + this._mouse.x * this._moveAmount;
        const new_y = this._initialPosition.y + this._mouse.y * this._moveAmount;
        const new_z = this._initialPosition.z;
        this._camera.position.x = lerp(this._camera.position.x, new_x, deltaTime * this._moveSpeed);
        this._camera.position.y = lerp(this._camera.position.y, new_y, deltaTime * this._moveSpeed);
        this._camera.position.z = lerp(this._camera.position.z, new_z, deltaTime * this._moveSpeed);
        this._camera.lookAt(0, 0, 0);
    }

    onMouseMove(e) {
        this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onKeyUp(e) {
        if (e.key === "c") {
            this._orbitControls.enabled = !this._orbitControls.enabled;
        }
    }
}