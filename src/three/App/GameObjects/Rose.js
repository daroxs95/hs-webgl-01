import { GameObject } from "../Framework";

export class Rose extends GameObject {
  constructor(app) {
    super(app, "rose");
  }

  onLoad() {
    super.onLoad();
    this._model.scale.set(1.2, 1.2, 1.2);
    this._model.position.set(0.2, 10.36, 3);
  }

  onUpdate(deltaTime) {}
}
