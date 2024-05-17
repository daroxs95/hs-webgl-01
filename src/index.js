import Renderer from "./App/Framework/Systems/Renderer";
import { LoadingManager, Mesh, SphereGeometry, Vector3 } from "three";
import { assets } from "./App/assets";
import { Astronaut } from "./App/GameObjects/Astronaut";
import { Rocket } from "./App/GameObjects/Rocket";
import { Planet } from "./App/GameObjects/Planet/Planet";
import { Postprocessing } from "./App/Postprocessing";
import { Camera } from "./App/GameObjects/Camera";
import { Rose } from "./App/GameObjects/Rose";
import { Star } from "./App/GameObjects/Star";
import { Alien } from "./App/GameObjects/Alien";
import { AnimatedGameObject, MeshObject, Resources } from "./App/Framework";
import { GameLoop } from "./App/Framework/GameLoop";
import { Scriptable } from "./App/Framework/Systems/Scriptable";
import { ResourceMeshObject } from "./App/Framework/Components/ResourceMeshObject";
import { Atmosphere } from "./App/GameObjects/Planet/Atmosphere";
import { Lighting } from "./App/GameObjects/Lighting";
import { Physics } from "./App/Framework/Systems/Physics";
import { RigidBody } from "./App/Framework/Components/RigidBody";
import { ShpereCollisionShape } from "./App/Framework/Components/CollisionShapes/Sphere";
import { CapsuleCollisionShape } from "./App/Framework/Components/CollisionShapes/Capsule";
import { ConvexHullCollisionShape } from "./App/Framework/Components/CollisionShapes/ConvexHull";

const autoplay = true;

const manager = new LoadingManager();

const progressElem = document.querySelector("#progress");
const loadingElem = document.querySelector("#loading");
const playBtnElem = document.querySelector("#play");

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressElem.innerHTML = `${((itemsLoaded / itemsTotal) * 100) | 0}%`;
  if (itemsLoaded === itemsTotal) {
    progressElem.style.opacity = 0;
    if (!autoplay) playBtnElem.style.opacity = 1;
  }
};

const resources = new Resources(assets, manager);
await resources.load();

// ECS setup
const gameLoop = new GameLoop();

// Systems
const renderer = new Renderer(Postprocessing);
const scriptable = new Scriptable();
// Create and trigger load of physics system
const physics = new Physics();
await physics.load();

gameLoop.addSystem(scriptable);
gameLoop.addSystem(renderer);
gameLoop.addSystem(physics);

// Entities
const astronaut = gameLoop.createEntity("astronaut");
astronaut.addComponent(
  "animated_mesh",
  new AnimatedGameObject("astronaut_anim"),
);
astronaut.addComponent("script", Astronaut);

const planet = gameLoop.createEntity("planet");
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

const rocket = gameLoop.createEntity("rocket");
rocket.addComponent("mesh", new ResourceMeshObject("rocket"));
rocket.addComponent(
  "rigid_body",
  new RigidBody(
    {
      mass: 1,
      // collisionShape: new CapsuleCollisionShape(0.5, 1, true),
      // collisionShape: new ConvexHullCollisionShape(rocket.getComponent("mesh").getModel(), 1, true),
      // offset: new Vector3(0, -1, 0)
    },
    rocket,
  ),
);
rocket.addComponent("script", Rocket);

const rose = gameLoop.createEntity("rose");
rose.addComponent("mesh", new ResourceMeshObject("rose"));
rose.addComponent("script", Rose);

const star = gameLoop.createEntity("star");
star.addComponent("mesh", new ResourceMeshObject("star"));
star.addComponent("script", Star);

const alien = gameLoop.createEntity("alien");
alien.addComponent("mesh", new ResourceMeshObject("alien"));
alien.addComponent("script", Alien);

const atmosphere = gameLoop.createEntity("atmosphere");
atmosphere.addComponent(
  "mesh",
  new MeshObject(new Mesh(new SphereGeometry(20, 100, 100))),
);
atmosphere.addComponent("script", Atmosphere);

// Lighting entity
const lighting = gameLoop.createEntity("alien");
lighting.addComponent("node", Lighting);

// Assign entities to systems
gameLoop.syncSystemsAndEntities();

// Trigger load of script components
scriptable.load();

// Add physics objects to the physic world
physics.collectObjects();

// Camera
const camera = new Camera(
  [
    astronaut.getComponent("animated_mesh"),
    star.getComponent("mesh"),
    rose.getComponent("mesh"),
    rocket.getComponent("mesh"),
  ],
  renderer.getComposer(),
);

renderer.registerGameObject(camera);
renderer.load();

scriptable.ready();

const startApp = () => {
  setTimeout(() => {
    loadingElem.style.opacity = 0;
  }, 500);
  gameLoop.loop();
};

if (autoplay) {
  startApp();
} else {
  playBtnElem.addEventListener("click", () => {
    startApp();
  });
}

let helperOn = false;
const helperElements = document.querySelectorAll(".helper-ui");

const toggleHelpers = (val) => {
  helperElements.forEach((elem) => {
    elem.style.display = !helperOn ? "none" : "block";
  });
};
toggleHelpers(helperOn);

document.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    helperOn = !helperOn;
    toggleHelpers(helperOn);
  }
});
