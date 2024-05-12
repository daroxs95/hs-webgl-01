uniform vec3 uSkyColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 viewDir;
varying float cameraDistance;

void main() {
    vec3 normal = normalize(vNormal);
    float fresnel = 1.0 - dot(normal, viewDir);
    fresnel = pow(fresnel, 2.0);
    gl_FragColor = vec4(uSkyColor * fresnel, 1);
    gl_FragColor.a = 1.0 * smoothstep(0.0, 10.0, cameraDistance);
}