import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextureLoader, LoadingManager } from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { Singleton } from "./Objects/Singleton";
import { prepModelAndAnimations } from "./Animations";

export class Resources extends Singleton {
  _resources;
  _assets;
  _loaders;

  /**
   *
   * @param assets {Array<{key: string, type: string, url: string}>}
   * @param manager {LoadingManager}
   */
  constructor(assets, manager = undefined) {
    super();
    this._resources = new Map();
    this._loaders = {
      gltf: new GLTFLoader(manager),
      texture: new TextureLoader(manager),
      rgbe: new RGBELoader(manager)
    };
    this._assets = assets;
  }

  get(name) {
    return this._resources.get(name);
  }

  getAll() {
    return this._resources;
  }

  register(name, resource) {
    this._assets.set(name, resource);
  }

  async load() {
    const promises = [];
    for (const asset of this._assets) {
      const loader = this._loaders[asset.type];
      promises.push(
        new Promise((resolve, reject) => {
          loader.load(asset.url, (resource) => {
            this._resources.set(asset.key, resource);
            resolve(resource);
          });
        })
      );
    }
    await Promise.all(promises);
    this.prepModelsAndAnimations();
  }

  prepModelsAndAnimations() {
    for (let value of this.getAll().values()) {
      prepModelAndAnimations(value);
    }
  }
}
