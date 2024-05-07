import App from "./App/App";
import {
    AmbientLight,
    DirectionalLight,
} from "three";
import {OrbitControls} from "three/addons";
import {resources} from "./App/assets";
import {Astronaut} from "./App/GameObjects/Astronaut";
import {Rocket} from "./App/GameObjects/Rocket";
import {Planet} from "./App/GameObjects/Planet";

const app = new App(resources);

const progressElem = document.querySelector('#progress');
const loadingElem = document.querySelector('#loading');
app.getManager().onProgress = (url, itemsLoaded, itemsTotal) => {
    progressElem.innerHTML = `${itemsLoaded / itemsTotal * 100 | 0}%`;
    if (itemsLoaded === itemsTotal) {
        setTimeout(() => {
            loadingElem.style.opacity = 0;
        }, 500);
    }
};

await app.loadResources();
app.prepModelsAndAnimations();
app.registerGameObject(new Astronaut(app));
app.registerGameObject(new Rocket(app));
app.registerGameObject(new Planet(app));
app.load();


// light
app.getScene().add(new AmbientLight(0xfefefe, 2));
const directionalLight = new DirectionalLight(0xffffff, 4);
directionalLight.position.set(15, 20, 0);
directionalLight.castShadow = true;
app.getScene().add(directionalLight);
directionalLight.lookAt(0, 0, 0)
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

// update camera pos
app.getCamera().position.z = 2;
app.getCamera().position.y = 2;
app.getCamera().position.x = 1;

new OrbitControls(app.getCamera(), app.getGlContext().domElement);

app.render();

