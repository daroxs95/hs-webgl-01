import { Script } from "../Framework/Components/Script";

export class Astronaut extends Script {
  _transform;
  _mixer;
  _resource;

  onLoad() {
    super.onLoad();

    this._transform = this._entity.getComponent("animated_mesh")._model;
    this._mixer = this._entity.getComponent("animated_mesh")._mixer;
    this._resource = this._entity.getComponent("animated_mesh")._resource;

    this._transform.scale.set(0.1, 0.1, 0.1);
    this._transform.position.set(0, 11.11, 0);
    const action = this._mixer.clipAction(this._resource.animsByName["idle"]);
    action.play();
  }
}
