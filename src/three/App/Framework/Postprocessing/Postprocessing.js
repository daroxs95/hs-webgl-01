import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { FloatType } from "three";

export class Postprocessing {
  _composer;
  _gl;
  _scene;
  _camera;

  constructor(gl, scene, camera) {
    this._gl = gl;
    this._scene = scene;
    this._camera = camera;
    this.onLoad();
  }

  onLoad() {
    this._composer = new EffectComposer(this._gl, {
      frameBufferType: FloatType,
    });
    const renderPass = new RenderPass(this._scene, this._camera);
    this._composer.addPass(renderPass);
    const outputPass = new OutputPass();
    this._composer.addPass(outputPass);
  }

  setSize(width, height) {
    this._composer.setSize(width, height);
  }

  render() {
    this._composer.render();
  }
}
