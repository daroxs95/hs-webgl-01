import { Entity } from "./Entity";
import { Component } from "./Component";
import { System } from "./System";

class ECS {
  _entities: Entity[] = [];
  _systems: System[] = [];

  constructor() {
    this._entities = [];
  }

  createEntity(id: string) {
    const entity = new Entity(id);
    this._entities.push(entity);
    return entity;
  }

  removeEntity(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index > -1) {
      this._entities.splice(index, 1);
    }
  }

  addSystem(system: System) {
    this._systems.push(system);
  }

  removeSystem(system: System) {
    const index = this._systems.indexOf(system);
    if (index > -1) {
      this._systems.splice(index, 1);
    }
  }

  syncSystemsAndEntities() {
    this._systems.forEach(system => {
      system.pointToEntities(this._entities);
    });
  }

  pointSystemsToEntities(entities: Entity[]) {
    this._systems.forEach(system => {
      system.pointToEntities(entities);
    });
  }

  getEntities() {
    return this._entities;
  }
}

export {
  Entity,
  Component,
  System,
  ECS
};
