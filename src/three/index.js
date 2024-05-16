import App from "./App/Framework/App";
import { AmbientLight, DirectionalLight, LoadingManager } from "three";
import { assets } from "./App/assets";
import { Astronaut } from "./App/GameObjects/Astronaut";
import { Rocket } from "./App/GameObjects/Rocket";
import { Planet } from "./App/GameObjects/Planet/Planet";
import { Postprocessing } from "./App/Postprocessing";
import { Camera } from "./App/GameObjects/Camera";
import { Rose } from "./App/GameObjects/Rose";
import { Star } from "./App/GameObjects/Star";
import { Alien } from "./App/GameObjects/Alien";
import { Resources } from "./App/Framework";

const manager = new LoadingManager();
const resources = new Resources(assets, manager);

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
await resources.load();


// const app = new App(Postprocessing);
const app = new App();

const objects = [
  new Astronaut(),
  new Rocket(),
  new Rose(),
  new Star(),
  new Alien()
];
for (const object of objects) {
  app.registerGameObject(object);
}
app.registerGameObject(new Camera(objects));
app.registerGameObject(new Planet());
app.load();

// light
app.getScene().add(new AmbientLight(0xfefefe, 0.2));
const directionalLight = new DirectionalLight(0xffffff, 4);
directionalLight.position.set(15, 20, 0);
directionalLight.castShadow = true;
app.getScene().add(directionalLight);
directionalLight.lookAt(0, 0, 0);
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.near = 5;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.bias = -0.01;
directionalLight.shadow.mapSize.set(2048, 2048);

// dlight shadow helper
// app.getScene().add(new CameraHelper(directionalLight.shadow.camera));

// env map
// const hdrTexture = app.getResources().get("mars");
// const pmremGenerator = new PMREMGenerator(app.getGlContext());
// pmremGenerator.compileEquirectangularShader();
// const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
// pmremGenerator.dispose();
// app.getScene().background = envMap;
// app.getScene().environment = envMap;


app.render();
