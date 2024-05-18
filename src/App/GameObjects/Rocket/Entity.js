import { ResourceMeshObject } from "../../Framework/Components/ResourceMeshObject";
import { RigidBody } from "../../Framework/Components/RigidBody";
import { CapsuleCollisionShape } from "../../Framework/Components/CollisionShapes/Capsule";
import { ConvexHullCollisionShape } from "../../Framework/Components/CollisionShapes/ConvexHull";
import { Vector3 } from "three";
import { Rocket } from "./Script";

export function createRocket(ecs) {
  const rocket = ecs.createEntity("rocket");
  rocket.addComponent("mesh", new ResourceMeshObject("rocket"));
  rocket.addComponent(
    "rigid_body",
    new RigidBody(
      {
        mass: 1,
        // collisionShape: new CapsuleCollisionShape(0.5, 1, true),
        collisionShape: new ConvexHullCollisionShape(rocket.getComponent("mesh").getModel(), 1, true),
        offset: new Vector3(0, -1, 0)
      },
      rocket
    )
  );
  rocket.addComponent("script", Rocket);

  return rocket;
}
