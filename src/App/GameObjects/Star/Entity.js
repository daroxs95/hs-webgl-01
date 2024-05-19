import { ResourceMeshObject } from "../../Framework/Components/ResourceMeshObject";
import { Star } from "./Script";

export function createStar(ecs, name) {
  const star = ecs.createEntity(name);
  star.addComponent("mesh", new ResourceMeshObject("star", star, false, true));
  star.addComponent("script", new Star(star));

  return star;
}

export function createStarFactory(ecs, ammount) {
  return Array.from({ length: ammount }, (_, i) =>
    createStar(ecs, `star_${i}`),
  );
}
