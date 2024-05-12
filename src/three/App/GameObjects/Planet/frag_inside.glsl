uniform vec3 uSkyColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 viewDir;
varying float cameraDistance;

void main() {
    vec3 normal = normalize(vNormal);
    float fresnel = 1.0 - dot(-1.0 * normal, viewDir);
    float fresnel2 = 1.0 - dot(normal, viewDir);
    fresnel = pow(fresnel, 2.0);
    fresnel2 = pow(fresnel2, 3.0);
    vec4 outer = vec4(uSkyColor, 0.5) * fresnel;
    vec4 inner = vec4(uSkyColor, 1.0) * fresnel2;
    float factorInner = 1.0 - pow(smoothstep(0.0, 100.0, cameraDistance), 0.8);
    float factor = pow(smoothstep(50.0, 200.0, cameraDistance), 1.0);
    gl_FragColor = inner * factorInner + outer * factor;
    //        gl_FragColor = inner;
    //    gl_FragColor = outer * factor * 0.05;
    //    gl_FragColor = vec4(factor, 0.0, 0.0, 1.0);/**/
}