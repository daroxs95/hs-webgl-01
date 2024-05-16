export class GameObject {
  constructor() {
    if (new.target === GameObject) {
      throw new TypeError("Cannot construct GameObject instances directly");
    }
  }

  onLoad() {
  }

  onUpdate(deltaTime) {
  }

  onKeyDown(e) {
  }

  onKeyUp(e) {
  }

  onMouseMove(e) {
  }
}
