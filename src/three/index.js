import App from "./App/App";
import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";
import {OrbitControls} from "three/addons";

const app = new App();

app.getScene().add(new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({color: 0xff0000})
));

app.getCamera().position.z = 5;

new OrbitControls(app.getCamera(), app.getGlConteext().domElement);

app.render();

