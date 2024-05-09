import { GameObject } from "../../Framework";
// import {ShaderMaterial} from "three";
// import fragment from "./frag.glsl?raw";
// import vertex from "./vertex.glsl?raw";

export class Planet extends GameObject {
  constructor(app) {
    super(app, "planet");
  }

  onLoad() {
    super.onLoad();
    this._model.position.set(0, 0, 0);
    // this._materials[0].material = new ShaderMaterial({
    //     vertexShader: vertex,
    //     fragmentShader: fragment,
    // });
    // this._materials[0].needsUpdate = true;
  }
}
