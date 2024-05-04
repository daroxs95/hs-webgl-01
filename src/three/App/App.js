import {PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Stats from "stats.js";
import {Resources} from "./Resources/Resources";

export default class App {
    _gl
    _camera
    _scene
    _stats
    _resources

    constructor(assets) {
        this.init();
        this._resources = new Resources(assets);
    }

    init() {
        this._gl = new WebGLRenderer({
            canvas: document.querySelector('#canvas'),
            antialias: true
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);
        const aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);

        // With shadows
        this._gl.shadowMap.enabled = true;
        this._gl.shadowMap.type = PCFSoftShadowMap;

        this._scene = new Scene();

        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        this.handleEvents();
    }

    async load() {
        await this._resources.load();
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

    getGlContext() {
        return this._gl;
    }

    getResources() {
        return this._resources;
    }
}