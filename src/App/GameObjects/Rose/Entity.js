import { ResourceMeshObject } from "../../Framework/Components/ResourceMeshObject";
import { Rose } from "./Script";

export function createRose(ecs) {
  const rose = ecs.createEntity("rose");
  rose.addComponent("mesh", new ResourceMeshObject("rose"));
  rose.addComponent("script", Rose);

  return rose;
}