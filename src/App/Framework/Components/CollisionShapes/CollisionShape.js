import { Component } from "../../ECS";

export class CollisionShape extends Component {
  _shape;
  _uiHelperMesh;

  constructor(helperMesh, helperVisible = false, entity) {
    super(entity);
    this._shape = null;
    this._uiHelperMesh = helperMesh;
    if (helperVisible) this._uiHelperMesh.visible = helperVisible;
  }

  getShape() {
    return this._shape;
  }

  setUiHelperMeshVisible(visible) {
    if (this._uiHelperMesh) {
      this._uiHelperMesh.visible = visible;
    }
  }

  getHelperMesh() {
    return this._uiHelperMesh;
  }
}
