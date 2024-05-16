import { Postprocessing as BasePostprocessing } from "./Framework/Postprocessing/Postprocessing";
import {
  RenderPass,
  EffectPass,
  NoiseEffect,
  EffectComposer,
  BloomEffect,
  ChromaticAberrationEffect
} from "postprocessing";
import { FloatType } from "three";
import { lerp, smoothstep } from "three/src/math/MathUtils";

export class Postprocessing extends BasePostprocessing {
  _cameraSpeed;
  _baseNoiseV = 0.018;
  _caEffect;
  _dampFactor = 10;
  _caEfectOn = false;
  _renderPass;

  onLoad() {
    this._composer = new EffectComposer(this._gl, {
      frameBufferType: FloatType
    });
    this._renderPass = new RenderPass(this._scene, this._camera);

    const noiseEffect = new NoiseEffect();
    noiseEffect.blendMode.opacity.value = this._baseNoiseV;
    this._caEffect = new ChromaticAberrationEffect();
    this._caEffect.offset.x = 0;
    this._caEffect.offset.y = 0;

    const effectPass = new EffectPass(
      this._camera,
      // this._caEffect,
      noiseEffect,
      new BloomEffect({
        mipmapBlur: true,
        radius: 0.25,
        levels: 1,
        luminanceThreshold: 0.9,
        luminanceSmoothing: 0.75,
        intensity: 0.25
      })
    );
    this._composer.addPass(this._renderPass);
    this._composer.addPass(effectPass);
    this._cameraSpeed = 10;
  }

  setCameraSpeed(speed) {
    this._cameraSpeed = speed;
  }

  toggleChromaticAberration(val) {
    this._caEfectOn = val;
  }

  onUpdate(deltaTime) {
    const amount = this._caEfectOn ? smoothstep(this._cameraSpeed, 0, 2) * 0.008 : 0;
    this._caEffect.offset.x = lerp(
      this._caEffect.offset.x,
      amount,
      deltaTime * this._dampFactor
    );
    this._caEffect.offset.y = lerp(
      this._caEffect.offset.y,
      amount,
      deltaTime * this._dampFactor
    );
  }
}
