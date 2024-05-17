import { Entity } from "./Entity";

export class System {
  _entities: Entity[] = [];

  constructor() {
    if (new.target === System) {
      throw new TypeError("Cannot construct System instances directly");
    }
  }

  pointToEntities(entities: Entity[]) {
    this._entities = entities;
  }

  process() {
    throw new Error("Method 'process' must be implemented.");
  }
}
