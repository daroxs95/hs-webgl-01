export function prepModelAndAnimations(model) {
  const animsByName = {};
  model.animations?.forEach((clip) => {
    animsByName[clip.name] = clip;
  });
  model.animsByName = animsByName;
}
