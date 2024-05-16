varying vec2 vUv;
varying vec3 vNormal;
varying vec3 viewDir;
varying float cameraDistance;

void main() {
    vUv = uv;
    vNormal = normal;
    viewDir = normalize(cameraPosition - gl_Position.xyz);
    cameraDistance = length(cameraPosition - gl_Position.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}