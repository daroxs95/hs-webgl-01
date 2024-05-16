import { ECS } from "./ECS";

export class GameLoop extends ECS {
  _then = 0;
  _elapsedTime = 0;

  loop(now = 0) {
    // convert to seconds
    now *= 0.001;
    const deltaTime = now - this._then;
    this._elapsedTime += deltaTime;
    this._then = now;

    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].process(deltaTime, this._elapsedTime);
    }

    window.requestAnimationFrame((now) => this.loop(now));
  }
}