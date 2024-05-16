import Renderer from "./App/Framework/Systems/Renderer";
import { AmbientLight, DirectionalLight, LoadingManager, Mesh, ShaderMaterial, SphereGeometry } from "three";
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

const manager = new LoadingManager();

const progressElem = document.querySelector("#progress");
const loadingElem = document.querySelector("#loading");

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressElem.innerHTML = `${((itemsLoaded / itemsTotal) * 100) | 0}%`;
  if (itemsLoaded === itemsTotal) {
    setTimeout(() => {
      loadingElem.style.opacity = 0;
    }, 500);
  }
};


const resources = new Resources(assets, manager);
await resources.load();


// ECS setup
const gameLoop = new GameLoop();

// Systems
const renderer = new Renderer(Postprocessing);

const scriptable = new Scriptable();
gameLoop.addSystem(scriptable);
gameLoop.addSystem(renderer);

// Entities
const astronaut = gameLoop.createEntity("astronaut");
astronaut.addComponent("animated_mesh", new AnimatedGameObject("astronaut_anim"));
astronaut.addComponent("script", Astronaut);

const planet = gameLoop.createEntity("planet");
planet.addComponent("mesh", new ResourceMeshObject("planet"));
planet.addComponent("script", Planet);

const rocket = gameLoop.createEntity("rocket");
rocket.addComponent("mesh", new ResourceMeshObject("rocket"));
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
atmosphere.addComponent("mesh", new MeshObject(
  new Mesh(new SphereGeometry(20, 100, 100))
));
atmosphere.addComponent("script", Atmosphere);

// Assign entities to systems
gameLoop.syncSystemsAndEntities();

// Trigger load of script components
scriptable.load();

// Camera
const camera = new Camera([
  astronaut.getComponent("animated_mesh"),
  star.getComponent("mesh"),
  rose.getComponent("mesh"),
  rocket.getComponent("mesh")
]);

// Lighting entity
const lighting = gameLoop.createEntity("alien");
lighting.addComponent("node", Lighting);

renderer.registerGameObject(camera);
// renderer.registerGameObject(new Planet());
renderer.load();

gameLoop.loop();