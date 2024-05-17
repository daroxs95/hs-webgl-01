import { GameObject } from "./GameObject";
import { Vector3 } from "three";
import { ConvexHullCollisionShape } from "./CollisionShapes/ConvexHull";

const STATE = { DISABLE_DEACTIVATION: 4 };
const FLAGS = { CF_KINEMATIC_OBJECT: 2 };

export class RigidBody extends GameObject {
  _rigidBody;
  _transform;
  _mass = 0;
  _collisionShape;
  _posOffset = new Vector3(0, 0, 0);
  _friction = 0;
  _helperVisible = false;

  constructor(
    { mass, collisionShape, offset, friction, helperVisible },
    entity,
  ) {
    super(entity);

    this._collisionShape = collisionShape;
    if (mass) this._mass = mass;
    if (offset) this._posOffset = offset;
    if (friction) this._friction = friction;
    if (helperVisible) this._helperVisible = helperVisible;
  }

  onLoad() {
    super.onLoad();
    const mesh = this._entity.getComponent("mesh")?._model ??
      this._entity.getComponent("animated_mesh")?._model ?? {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 },
      };

    let pos = mesh.position.clone().add(this._posOffset);
    let scale = mesh.scale;
    let quat = mesh.quaternion;

    this._transform = new Ammo.btTransform();
    this._transform.setIdentity();
    this._transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this._transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w),
    );

    let motionState = new Ammo.btDefaultMotionState(this._transform);

    if (!this._collisionShape) {
      this._collisionShape = new ConvexHullCollisionShape(
        mesh,
        this._helperVisible,
      );
    }
    const colShape = this._collisionShape.getShape();
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(this._mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this._mass,
      motionState,
      colShape,
      localInertia,
    );
    this._rigidBody = new Ammo.btRigidBody(rbInfo);
    this._rigidBody.setActivationState(STATE.DISABLE_DEACTIVATION);
    this._rigidBody.setFriction(this._friction);
    // this._rigidBody.setRollingFriction(10);
    // this._rigidBody.setActivationState(STATE.DISABLE_DEACTIVATION);
    // this._rigidBody.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
  }

  getRigidBody() {
    return this._rigidBody;
  }

  getCollisionShapeHelper() {
    return this._collisionShape.getHelperMesh();
  }

  getOffset() {
    return this._posOffset;
  }
}
