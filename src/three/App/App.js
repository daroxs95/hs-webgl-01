import {Clock, LoadingManager, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Stats from "stats.js";
import {Resources} from "./Resources/Resources";
import {prepModelAndAnimations} from "./Resources/Animations";

export default class App {
    _gl
    _camera
    _scene
    _stats
    _resources
    _manager
    _mixers
    _clock

    constructor(assets) {
        this.init();
        this._resources = new Resources(assets, this._manager);
        this._gameObjects = [];
    }

    init() {
        this._gl = new WebGLRenderer({
            canvas: document.querySelector('#canvas'), antialias: true
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);
        const aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);

        // With shadows
        this._gl.shadowMap.enabled = true;
        this._gl.shadowMap.type = PCFSoftShadowMap;

        this._scene = new Scene();

        // Stats
        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        // Loading manager
        this._manager = new LoadingManager();

        this._mixers = [];
        this._clock = new Clock();

        this.handleEvents();

    }

    async loadResources() {
        await this._resources.load();
    }

    load() {
        for (let gameObject of this._gameObjects) {
            gameObject.onLoad();
        }
    }

    render() {
        this._stats.begin();
        const deltaTime = this._clock.getDelta();
        this._gl.render(this._scene, this._camera);
        for (const mixer of this._mixers) {
            mixer.update(deltaTime);
        }
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

    getManager() {
        return this._manager;
    }

    addModelToScene = (name = false) => {
        const model = this._resources.get(name);

        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this._scene.add(model.scene);
        return model;
    }

    prepModelsAndAnimations() {
        for (let value of this._resources.getAll().values()) {
            prepModelAndAnimations(value);
        }
    }

    getMixers() {
        return this._mixers;
    }

    registerGameObject(gameObject) {
        this._gameObjects.push(gameObject);
    }
}