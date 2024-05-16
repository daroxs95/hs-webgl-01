import { AmbientLight, DirectionalLight, Group } from "three";
import { GameObject } from "../Framework";

export class Lighting extends GameObject {
  _node;

  constructor() {
    super();
    this._node = new Group();

    this._node.add(new AmbientLight(0xfefefe, 0.2));

    const directionalLight = new DirectionalLight(0xffffff, 4);
    directionalLight.position.set(15, 20, 0);
    directionalLight.castShadow = true;
    directionalLight.lookAt(0, 0, 0);
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.near = 5;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.bias = -0.01;
    directionalLight.shadow.mapSize.set(2048, 2048);
    this._node.add(directionalLight);
  }

  getNode() {
    return this._node;
  }
}