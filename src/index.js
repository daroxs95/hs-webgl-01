import Renderer from "./App/Framework/Systems/Renderer";
import { LoadingManager } from "three";
import { assets } from "./App/assets";
import { Postprocessing } from "./App/Postprocessing";
import { Camera } from "./App/GameObjects/Camera";
import { Resources } from "./App/Framework";
import { GameLoop } from "./App/Framework/GameLoop";
import { Scriptable } from "./App/Framework/Systems/Scriptable";
import { Lighting } from "./App/GameObjects/Lighting";
import { Physics } from "./App/Framework/Systems/Physics";
import { createRocket } from "./App/GameObjects/Rocket/Entity";
import { createAtmosphere, createPlanet } from "./App/GameObjects/Planet/Entity";
import { createStar } from "./App/GameObjects/Star/Entity";
import { createAstronaut } from "./App/GameObjects/Astronaut/Entity";
import { createRose } from "./App/GameObjects/Rose/Entity";

const autoplay = true;

const manager = new LoadingManager();

const progressElem = document.querySelector("#progress");
const loadingElem = document.querySelector("#loading");
const playBtnElem = document.querySelector("#play");

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressElem.innerHTML = `${((itemsLoaded / itemsTotal) * 100) | 0}%`;
  if (itemsLoaded === itemsTotal) {
    progressElem.style.opacity = 0;
    if (!autoplay) {
      playBtnElem.style.opacity = 1;
    }
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
// Creating game entities from "factories"
const astronaut = createAstronaut(gameLoop);
createPlanet(gameLoop);
createAtmosphere(gameLoop);
const rocket = createRocket(gameLoop);
const rose = createRose(gameLoop);
const star = createStar(gameLoop);


// Lighting entity
const lighting = gameLoop.createEntity("lighting");
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
    rocket.getComponent("mesh")
  ],
  renderer
);

renderer.registerGameObject(camera);
renderer.load();

scriptable.ready();

const startApp = () => {
  loadingElem.style.opacity = 0;
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
