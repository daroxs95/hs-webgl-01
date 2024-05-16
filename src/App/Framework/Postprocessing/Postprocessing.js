import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { FloatType } from "three";

export class Postprocessing {
  _composer;
  _gl;
  _scene;
  _camera;
  _renderPass;

  constructor(gl, scene, camera) {
    this._gl = gl;
    this._scene = scene;
    this._camera = camera;
    // this.onLoad();
  }

  onLoad() {
    this._composer = new EffectComposer(this._gl, {
      frameBufferType: FloatType
    });
    this._renderPass = new RenderPass(this._scene, this._camera);
    this._composer.addPass(this._renderPass);
    const outputPass = new OutputPass();
    this._composer.addPass(outputPass);
  }

  setSize(width, height) {
    this._composer.setSize(width, height);
  }

  render() {
    this._composer.render();
  }

  setCamera(camera) {
    this._camera = camera;
    if (this._renderPass) {
      this._renderPass.camera = camera;
    }
  }
}
