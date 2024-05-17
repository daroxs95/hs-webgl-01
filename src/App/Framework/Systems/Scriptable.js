import { System } from "../ECS";

export class Scriptable extends System {
  load() {
    for (let i = 0; i < this._entities.length; i++) {
      this._entities[i].getComponent("script")?.onLoad();
    }
  }

  ready() {
    for (let i = 0; i < this._entities.length; i++) {
      this._entities[i].getComponent("script")?.onReady();
    }
  }

  process(deltaTime, elapsedTime) {
    for (let i = 0; i < this._entities.length; i++) {
      this._entities[i]
        .getComponent("script")
        ?.onUpdate(deltaTime, elapsedTime);
    }
  }
}
