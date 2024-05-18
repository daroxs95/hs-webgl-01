import { ResourceMeshObject } from "../../Framework/Components/ResourceMeshObject";
import { Star } from "./Script";

export function createStar(ecs) {

  const star = ecs.createEntity("star");
  star.addComponent("mesh", new ResourceMeshObject("star"));
  star.addComponent("script", Star);

  return star;
}