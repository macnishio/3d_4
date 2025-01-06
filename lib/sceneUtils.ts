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
  const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 15, new Vector3(0, 0, 0), scene);
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

import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

export const setupMeshes = async (scene: Scene, characters: any[]) => {
  const meshes: AbstractMesh[] = [];
  
  // Load furniture models
  try {
    const tableResult = await SceneLoader.ImportMeshAsync("", "/", "table.glb", scene);
    const chairResult = await SceneLoader.ImportMeshAsync("", "/", "chair.glb", scene);
    
    // Position and scale the models
    if (tableResult.meshes[0]) {
      tableResult.meshes[0].position.y = 0;
      tableResult.meshes[0].scaling.scaleInPlace(1);
    }
    
    if (chairResult.meshes[0]) {
      chairResult.meshes[0].position.set(2, 0, 0);
      chairResult.meshes[0].scaling.scaleInPlace(1);
    }
    
    meshes.push(...tableResult.meshes);
    meshes.push(...chairResult.meshes);
  } catch (error) {
    console.error("Error loading GLB models:", error);
  }
  
  // Add character meshes
  for (const character of characters) {
    const mesh = createBasicMesh(scene, 'box', { 
      width: 1,
      height: 2,
      depth: 1
    });
    mesh.id = character.id;
    mesh.position = new Vector3(character.position.x, character.position.y, character.position.z);
    meshes.push(mesh);
  }
  
  return meshes;
};