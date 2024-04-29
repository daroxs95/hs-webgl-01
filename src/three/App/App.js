import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Stats from "stats.js";

export default class App {
    _gl
    _camera
    _scene
    _stats

    constructor() {
        this.init();
    }

    init() {
        this._gl = new WebGLRenderer({
            canvas: document.querySelector('#canvas'),
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);
        const aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);

        this._scene = new Scene();

        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        this.handleEvents();
    }

    render() {
        this._stats.begin();
        this._gl.render(this._scene, this._camera);
        this._stats.end();
        window.requestAnimationFrame(() => this.render());
    }

    resize() {
        this._gl.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    handleEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    getScene() {
        return this._scene;
    }

    getCamera() {
        return this._camera;
    }

    getGlConteext() {
        return this._gl;
    }
}