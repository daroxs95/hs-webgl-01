import { GameObject } from "../../Framework";
import { AdditiveBlending, BackSide, Mesh, SphereGeometry, Vector3 } from "three";
import { ShaderMaterial } from "three";
import fragment from "./frag.glsl?raw";
import fragmentInside from "./frag_inside.glsl?raw";
import vertex from "./vertex.glsl?raw";

export class Planet extends GameObject {
  _skyColor = new Vector3(0, 0.5, 1);

  constructor(app) {
    super(app, "planet");
  }

  onLoad() {
    super.onLoad();
    this._model.position.set(0, 0, 0);

    const atmosphereGeometry = new SphereGeometry(20, 100, 100);
    // const atmosphereMaterial = new ShaderMaterial({
    //   vertexShader: vertex,
    //   fragmentShader: fragment,
    //   blending: AdditiveBlending,
    //   transparent: true,
    //   uniforms: {
    //     uSkyColor: { value: this._skyColor }
    //   },
    //   // wireframe: true
    // });

    const atmosphereMaterialInner = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragmentInside,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
      uniforms: {
        uSkyColor: { value: this._skyColor }
      },
      // wireframe: true
    });

    // const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial);
    const atmosphereInner = new Mesh(atmosphereGeometry, atmosphereMaterialInner);

    // this._model.add(atmosphere);
    this._model.add(atmosphereInner);
  }
}
