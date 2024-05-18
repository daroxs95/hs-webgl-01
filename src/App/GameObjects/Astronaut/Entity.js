import { AnimatedGameObject } from "../../Framework";
import { Astronaut } from "./Script";
import { RigidBody } from "../../Framework/Components/RigidBody";
import { CapsuleCollisionShape } from "../../Framework/Components/CollisionShapes/Capsule";
import { Vector3 } from "three";

export function createAstronaut(ecs) {
  const astronaut = ecs.createEntity("astronaut");
  astronaut.addComponent(
    "animated_mesh",
    new AnimatedGameObject("astronaut_anim", astronaut)
  );
  astronaut.addComponent("script", Astronaut);
  astronaut.addComponent(
    "rigid_body",
    new RigidBody(
      {
        mass: 1,
        collisionShape: new CapsuleCollisionShape(0.4, 0.3, true),
        // collisionShape: new ShpereCollisionShape(0.4, true),
        offset: new Vector3(0, -0.4, 0),
        friction: 0.5
      },
      astronaut
    )
  );

  return astronaut;
}