import { ResourceMeshObject } from "../../Framework/Components/ResourceMeshObject";
import { Planet } from "./Script";
import { RigidBody } from "../../Framework/Components/RigidBody";
import { MeshObject } from "../../Framework";
import { Mesh, SphereGeometry } from "three";
import { Atmosphere } from "./Atmosphere/Script";
import { ShpereCollisionShape } from "../../Framework/Components/CollisionShapes/Sphere";

export function createPlanet(ecs) {
  const planet = ecs.createEntity("planet");
  planet.addComponent("mesh", new ResourceMeshObject("planet"));
  planet.addComponent("script", Planet);
  planet.addComponent(
    "rigid_body",
    new RigidBody(
      {
        mass: 0,
        collisionShape: new ShpereCollisionShape(11, true),
      },
      planet,
    ),
  );

  return planet;
}

export function createAtmosphere(ecs) {
  const atmosphere = ecs.createEntity("atmosphere");
  atmosphere.addComponent(
    "mesh",
    new MeshObject(new Mesh(new SphereGeometry(20, 100, 100))),
  );
  atmosphere.addComponent("script", Atmosphere);

  return atmosphere;
}
