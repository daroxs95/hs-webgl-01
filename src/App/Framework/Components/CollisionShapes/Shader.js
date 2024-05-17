import { AdditiveBlending, ShaderMaterial } from "three";

export const collisionHelperMeshShader = new ShaderMaterial({
  blending: AdditiveBlending,
  transparent: true,
  wireframe: true,
});
