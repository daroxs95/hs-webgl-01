import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import Stats from "stats.js";
import { System } from "../ECS";

export default class Renderer extends System {
  _gl;
  _camera;
  _scene;
  _stats;
  _mixers;
  _gameObjects;
  _composer;
  _renderer;

  constructor(Composer) {
    super();
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

    this.handleEvents();
  }

  load() {
    for (let gameObject of this._gameObjects) {
      gameObject.onLoad();
    }

    // TODO this is a hack because the ECS system is not fully implemented
    for (const entity of this._entities) {
      const animatedMesh = entity.getComponent("animated_mesh");
      if (animatedMesh) {
        this.registerGameObject(animatedMesh);
      }
      const mesh = entity.getComponent("mesh");
      if (mesh) {
        this.registerGameObject(mesh);
      }

      // TODO not used for now
      const camera = entity.getComponent("camera");
      if (camera) {
        this.registerGameObject(camera);
      }

      const node = entity.getComponent("node");
      if (node) {
        this.registerGameObject(node);
      }

      const rigidBody = entity.getComponent("rigid_body");
      if (rigidBody) {
        const helperMesh = rigidBody.getCollisionShapeHelper();
        if (helperMesh) {
          this.addModelToScene(helperMesh);
        }
      }
    }
  }

  process(deltaTime, elapsedTime) {
    this._stats.begin();

    this._renderer.render(this._scene, this._camera);

    // TODO this needs to be handled fully by Scriptable system, but animation logic is not fully implemented as component
    for (const mixer of this._mixers) {
      mixer.update(deltaTime);
    }
    // TODO this needs to be handled fully by Scriptable system, but camera logic is not fully implemented as component
    for (const gameObject of this._gameObjects) {
      gameObject.onUpdate(deltaTime, elapsedTime);
    }
    this._composer?.onUpdate(deltaTime);
    this._stats.end();
  }

  resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  // TODO events should be handled by a potential different ECS where we register different systems as keyboard and mouse input
  //  but it is coupled right now to gameObjects
  handleEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    window.addEventListener("keydown", (e) => {
      for (let i = 0; i < this._entities.length; i++) {
        this._entities[i].getComponent("script")?.onKeyDown(e);
      }
      for (const gameObject of this._gameObjects) {
        gameObject.onKeyDown(e);
      }
    });

    window.addEventListener("keyup", (e) => {
      for (let i = 0; i < this._entities.length; i++) {
        this._entities[i].getComponent("script")?.onKeyUp(e);
      }
      for (const gameObject of this._gameObjects) {
        gameObject.onKeyUp(e);
      }
    });

    window.addEventListener("pointermove", (e) => {
      for (let i = 0; i < this._entities.length; i++) {
        this._entities[i].getComponent("script")?.onMouseMove(e);
      }
      for (const gameObject of this._gameObjects) {
        gameObject.onMouseMove(e);
      }
    });
  }

  setCamera(camera) {
    this._camera = camera;
    this._composer?.setCamera(camera);
  }

  addModelToScene = (model) => {
    this._scene.add(model);
  };

  // TODO: This is a hack because the ECS system is not fully implemented
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

    if (gameObject.getNode) {
      this.addModelToScene(gameObject.getNode());
    }
  }

  getComposer() {
    return this._composer;
  }

  getGlInstance() {
    return this._gl;
  }
}
