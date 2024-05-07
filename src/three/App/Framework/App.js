import {Clock, LoadingManager, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Stats from "stats.js";
import {Resources} from "./Resources";
import {prepModelAndAnimations} from "./Animations";

export default class App {
    _gl
    _camera
    _scene
    _stats
    _resources
    _manager
    _mixers
    _clock
    _gameObjects
    _composer
    _renderer

    constructor(assets, Composer) {
        this.init();
        this._resources = new Resources(assets, this._manager);
        this._gameObjects = [];
        this._composer = Composer ? new Composer(this._gl, this._scene, this._camera) : null;
        this._renderer = this._composer ?? this._gl;
        this.resize();
    }

    init() {
        this._gl = new WebGLRenderer({
            // powerPreference: "high-performance",
            canvas: document.querySelector('#canvas'),
            antialias: window.devicePixelRatio <= 1,
            stencil: true,
            depth: true
        });

        // Renderer
        this._gl.setSize(window.innerWidth, window.innerHeight);
        const aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);

        // With shadows
        this._gl.shadowMap.enabled = true;
        this._gl.shadowMap.type = PCFSoftShadowMap;

        // Scene
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
        this._renderer.render(this._scene, this._camera);
        for (const mixer of this._mixers) {
            mixer.update(deltaTime);
        }
        for (const gameObject of this._gameObjects) {
            gameObject.onUpdate(deltaTime)
        }
        this._stats.end();
        window.requestAnimationFrame(() => this.render());
    }

    resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
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