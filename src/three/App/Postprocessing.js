import { Postprocessing as BasePostprocessing } from "./Framework/Postprocessing/Postprocessing";
import {
  RenderPass,
  EffectPass,
  NoiseEffect,
  EffectComposer,
  FXAAEffect,
  BloomEffect,
  KawaseBlurPass,
} from "postprocessing";
import { FloatType } from "three";

export class Postprocessing extends BasePostprocessing {
  _kawaseBlur;

  onLoad() {
    this._composer = new EffectComposer(this._gl, {
      frameBufferType: FloatType,
    });
    const renderPass = new RenderPass(this._scene, this._camera);

    const noiseEffect = new NoiseEffect();
    noiseEffect.blendMode.opacity.value = 0.018;

    const effectPass = new EffectPass(
      this._camera,
      // new FXAAEffect(),
      noiseEffect,
      new BloomEffect({
        mipmapBlur: true,
        radius: 0.25,
        levels: 1,
        luminanceThreshold: 0.9,
        luminanceSmoothing: 0.75,
        intensity: 0.25,
      }),
    );
    this._composer.addPass(renderPass);
    this._composer.addPass(effectPass);
    // this._kawaseBlur = new KawaseBlurPass({
    //     kernelSize: 0,
    //     // resolutionScale: ,
    //     resolutionX: 0,
    //     resolutionY: 0,
    // });
    // this._composer.addPass(this._kawaseBlur);
  }

  render() {
    this._composer.render();
  }
}
