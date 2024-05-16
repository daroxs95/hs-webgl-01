export class Singleton {
  static _instance = null;

  constructor() {
    if (new.target === Singleton) {
      throw new TypeError("Cannot construct Singleton instances directly");
    }

    if (Singleton._instance) {
      return Singleton._instance;
    }

    Singleton._instance = this;
    return this;
  }

  static getInstance() {
    return Singleton._instance;
  }
}
