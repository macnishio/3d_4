import { Scene, Engine, Vector3, MeshBuilder, StandardMaterial, Texture, HemisphericLight, DirectionalLight, ArcRotateCamera } from '@babylonjs/core';

export const createBasicMesh = (scene: Scene, type: string, options: any) => {
  switch (type) {
    case 'box':
      return MeshBuilder.CreateBox('box', options, scene);
    case 'sphere':
      return MeshBuilder.CreateSphere('sphere', options, scene);
    case 'cylinder':
      return MeshBuilder.CreateCylinder('cylinder', options, scene);
    default:
      return MeshBuilder.CreateBox('default', options, scene);
  }
};

export const createMaterial = (scene: Scene, texturePath?: string) => {
  const material = new StandardMaterial('material', scene);
  if (texturePath) {
    material.diffuseTexture = new Texture(texturePath, scene);
  }
  return material;
};

export const setupLighting = (scene: Scene) => {
  const hemisphericLight = new HemisphericLight('hemisphericLight', new Vector3(0, 1, 0), scene);
  hemisphericLight.intensity = 0.7;

  const directionalLight = new DirectionalLight('directionalLight', new Vector3(0.5, -1, 0.5), scene);
  directionalLight.intensity = 0.5;

  return { hemisphericLight, directionalLight };
};

export const optimizeScene = (scene: Scene) => {
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;
  scene.blockMaterialDirtyMechanism = true;
};

export const configureCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
  const camera = new ArcRotateCamera("camera", 0, Math.PI / 3, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 20;
  return camera;
};

export const loadTexture = async (scene: Scene, path: string): Promise<Texture> => {
  return new Promise((resolve, reject) => {
    const texture = new Texture(path, scene, true, false);
    texture.onLoadObservable.addOnce(() => resolve(texture));
    texture.onErrorObservable.addOnce((error) => reject(error));
  });
};

export const disposeResources = (resources: any[]) => {
  resources.forEach(resource => {
    if (resource && typeof resource.dispose === 'function') {
      resource.dispose();
    }
  });
};