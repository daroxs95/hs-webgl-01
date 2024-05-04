import App from "./App/App";
import {
    AmbientLight,
    DirectionalLight,
    PMREMGenerator
} from "three";
import {OrbitControls} from "three/addons";
import {resources} from "./App/assets";

const app = new App(resources);

await app.load();

const addSceneModel = (name) => {
    const model = app.getResources().get(name);
    model.scene.castShadow = true;
    model.scene.receiveShadow = true;
    model.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    app.getScene().add(model.scene);
    return model;
}

const model = addSceneModel('astronaut');
model.scene.scale.set(0.1, 0.1, 0.1);
model.scene.position.set(0, -0.08, 0);

const rocket = addSceneModel('rocket');
rocket.scene.scale.set(0.003, 0.003, 0.003);
rocket.scene.position.set(-2, -0.3, -2);
//rotate rocket 2 degrees
rocket.scene.rotation.z = Math.PI * 0.06;
rocket.scene.rotation.x = Math.PI * -0.06;

// add planet
const planet = addSceneModel('planet');
planet.scene.position.set(0, -11, 0);

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
const hdrTexture = app.getResources().get("space");
const pmremGenerator = new PMREMGenerator(app.getGlContext());
pmremGenerator.compileEquirectangularShader();
const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
pmremGenerator.dispose();
// app.getScene().background = envMap;
app.getScene().environment = envMap;

// update camera pos
app.getCamera().position.z = 2;
app.getCamera().position.y = 2;
app.getCamera().position.x = 1;

new OrbitControls(app.getCamera(), app.getGlContext().domElement);

app.render();

