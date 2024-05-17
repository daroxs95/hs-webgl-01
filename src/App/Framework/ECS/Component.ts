import { Entity } from "./Entity";

export class Component {
  _entity: Entity;

  constructor(entity: Entity) {
    this._entity = entity;
  }

  getEntity() {
    return this._entity;
  }
}
