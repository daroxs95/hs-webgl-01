import { AdditiveBlending, BackSide, Color, ShaderMaterial } from "three";
import fragmentInside from "./frag_inside.glsl?raw";
import vertex from "./vertex.glsl?raw";
import { Script } from "../../Framework/Components/Script";

export class Atmosphere extends Script {
  _initialSkyColor = new Color(0, 0.5, 1);
  _skyColor = new Color(this._initialSkyColor);
  _materials;
  _material;
  _transform;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("mesh")._model;
    this._materials = this._entity.getComponent("mesh")._materials;

    this._transform.position.set(0, 0, 0);

    this._materials[0].material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragmentInside,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
      uniforms: {
        uSkyColor: { value: this._skyColor }
      }
      // wireframe: true
    });

    this._material = this._materials[0].material;

    const colorInput = document.querySelector("#atmosphere-color-input");
    // retrieve hex color from input
    colorInput.addEventListener("change", (e) => {
      try {
        const hexColor = e.target.value;
        if (!hexColor) {
          this._skyColor = this._initialSkyColor;
          return;
        }
        const rgbColor = parseInt(hexColor.replace("#", ""), 16);
        const r = (rgbColor >> 16) & 255;
        const g = (rgbColor >> 8) & 255;
        const b = rgbColor & 255;
        this._skyColor.set(r / 255, g / 255, b / 255);
      } catch (e) {
        this._skyColor = this._initialSkyColor;
      }
    });
  }

  onUpdate(deltaTime) {
    // update material uniforms
    this._material.uniforms.uSkyColor.value = this._skyColor;
  }
}
