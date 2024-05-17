import { Component } from "./Component";

// TODO: This is naive implementation of Entity class.
//  It should be improved for example storing all component types together for every entity
export class Entity {
  _id: string;
  _components: Record<string, Component>;

  constructor(id: string) {
    this._id = id;
    this._components = {};
  }

  addComponent(componentType: string, component: typeof Component | Component) {
    if (typeof component === "function") {
      this._components[componentType] = new component(this);
    } else {
      this._components[componentType] = component;
    }
  }

  removeComponent(componentType: string) {
    delete this._components[componentType];
  }

  getComponent(componentType: string) {
    return this._components[componentType];
  }

  hasComponent(componentType: string) {
    return this._components.hasOwnProperty(componentType);
  }
}
