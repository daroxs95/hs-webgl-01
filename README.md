# Basic working scene

## How to run

Using node version 18.19.1

```bash
npm install
```

```bash
npm run dev
```

## Featuring:

- Resize
- Request animation frame render
- Stats.js
- Basic lighting
- Model loading
- Basic shadows
- Basic postprocessing (noise, bloom)
- Camera interactivity
- Custom game object abstractions
- Animations
- Atmosphere shader(WIP, basic fresnel effect and blend between inner and outer view)
- Tonemapping (OPTIMIZED_CINEON to boost low poly esthetic)
- FXAA

![img.png](doc/img.png)

## Notes

- Models are not optimized and all the assets loading is sync as they are low poly.
- Not using HDRI lighting because space esthetic.
- Usage of three.js is abstracted as much as possible in form of ECS game engine (WIP).

## TODO

- [ ] Add motion blur
- [ ] Add abstraction for mouse and keys input
- [ ] Move camera following planet orbit
