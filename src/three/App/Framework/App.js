import {
  Clock,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import Stats from "stats.js";

export default class App {
  _gl;
  _camera;
  _scene;
  _stats;
  _mixers;
  _clock;
  _gameObjects;
  _composer;
  _renderer;

  constructor(Composer) {
    this.init();
    this._gameObjects = [];
    this._composer = Composer
      ? new Composer(this._gl, this._scene, this._camera)
      : null;
    this._composer?.onLoad();
    this._renderer = this._composer ?? this._gl;
    this.resize();
  }

  init() {
    this._gl = new WebGLRenderer({
      // powerPreference: "high-performance",
      canvas: document.querySelector("#canvas"),
      antialias: window.devicePixelRatio <= 1,
      stencil: true,
      depth: true
    });

    // Renderer
    this._gl.setSize(window.innerWidth, window.innerHeight);
    const aspectRatio = window.innerWidth / window.innerHeight;

    if (window.devicePixelRatio > 1) {
      const dpr = Math.min(window.devicePixelRatio, 2);
      this._gl.setPixelRatio(dpr);
    }

    this._camera = new PerspectiveCamera(60, aspectRatio, 0.1, 1000);

    // With shadows
    this._gl.shadowMap.enabled = true;
    this._gl.shadowMap.type = PCFSoftShadowMap;

    // Scene
    this._scene = new Scene();

    // Stats
    this._stats = new Stats();
    document.querySelector("#stats").appendChild(this._stats.dom);

    this._mixers = [];
    this._clock = new Clock();

    this.handleEvents();
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
      gameObject.onUpdate(deltaTime, this.getTime());
    }
    this._composer?.onUpdate(deltaTime);
    this._stats.end();
    window.requestAnimationFrame(() => this.render());
  }

  resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  handleEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    window.addEventListener("keydown", (e) => {
      for (const gameObject of this._gameObjects) {
        gameObject.onKeyDown(e);
      }
    });

    window.addEventListener("keyup", (e) => {
      for (const gameObject of this._gameObjects) {
        gameObject.onKeyUp(e);
      }
    });

    window.addEventListener("pointermove", (e) => {
      for (const gameObject of this._gameObjects) {
        gameObject.onMouseMove(e);
      }
    });
  }

  getScene() {
    return this._scene;
  }

  getCamera() {
    return this._camera;
  }

  setCamera(camera) {
    this._camera = camera;
  }

  addModelToScene = (model) => {
    this._scene.add(model);
  };

  registerGameObject(gameObject) {
    this._gameObjects.push(gameObject);
    if (gameObject.getModel) {
      this.addModelToScene(gameObject.getModel());
    }

    if (gameObject.getCamera) {
      this.setCamera(gameObject.getCamera());
    }

    if (gameObject.getMixer) {
      this._mixers.push(gameObject.getMixer());
    }
  }

  getTime() {
    return this._clock.getElapsedTime();
  }

  getComposer() {
    return this._composer;
  }
}
