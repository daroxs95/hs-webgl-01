import { System } from "../ECS";
import AmmoLib from "ammojs3";
import { Vector3 } from "three";

export class Physics extends System {
  _world;
  _tmpTrans;

  async load() {
    await AmmoLib.bind(window)();
    this.setupPhysicsWorld();
  }

  process(deltaTime, elapsedTime) {
    this._world.stepSimulation(deltaTime, 10);

    for (let i = 0; i < this._entities.length; i++) {
      const rigidBody = this._entities[i].getComponent("rigid_body");
      const mesh = this._entities[i].getComponent("mesh");
      if (rigidBody) {
        const objAmmo = rigidBody.getRigidBody();
        const helperMesh = rigidBody.getCollisionShapeHelper();
        const offset = rigidBody.getOffset().clone();
        let ms = objAmmo.getMotionState();
        if (ms) {
          ms.getWorldTransform(this._tmpTrans);
          const p = this._tmpTrans.getOrigin();
          const q = this._tmpTrans.getRotation();
          mesh.getModel().position.set(p.x(), p.y(), p.z());
          mesh.getModel().quaternion.set(q.x(), q.y(), q.z(), q.w());
          helperMesh?.position.set(p.x(), p.y(), p.z());
          helperMesh?.quaternion.set(q.x(), q.y(), q.z(), q.w());

          // Transform the offset to the current local space of the mesh
          offset.applyQuaternion(mesh.getModel().quaternion);
          mesh.getModel().position.add(offset);
        }
      }
    }
  }

  setupPhysicsWorld() {
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache = new Ammo.btDbvtBroadphase(),
      solver = new Ammo.btSequentialImpulseConstraintSolver();

    this._world = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration,
    );
    this._world.setGravity(new Ammo.btVector3(0, 0, 0));
    this._tmpTrans = new Ammo.btTransform();
  }

  collectObjects() {
    for (let i = 0; i < this._entities.length; i++) {
      let rigidBody = this._entities[i].getComponent("rigid_body");
      if (rigidBody) {
        rigidBody.onLoad();
        this._world.addRigidBody(rigidBody.getRigidBody());
      }
    }
  }

  setGravity(x, y, z) {
    this._world.setGravity(new Ammo.btVector3(x, y, z));
  }
}
