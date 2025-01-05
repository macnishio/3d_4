import { useEffect, useRef, useState } from 'react';
import { Scene, Engine, Vector3, AbstractMesh } from '@babylonjs/core';
import { createLighting, setupMeshes, configureCamera } from '../lib/sceneUtils';

interface SceneSetupOptions {
  canvas: HTMLCanvasElement;
  characters: any[];
}

export const useSceneSetup = ({ canvas, characters }: SceneSetupOptions) => {
  const engineRef = React.useRef<Engine | null>(null);
  const sceneRef = React.useRef<Scene | null>(null);
  const meshesRef = React.useRef<AbstractMesh[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!canvas) return;

    const initScene = async () => {
      engineRef.current = new Engine(canvas, true, { 
        preserveDrawingBuffer: true,
        stencil: true
      });

      sceneRef.current = new Scene(engineRef.current);
      
      const camera = configureCamera(sceneRef.current, canvas);
      createLighting(sceneRef.current);
      
      meshesRef.current = await setupMeshes(sceneRef.current, characters);

      engineRef.current.runRenderLoop(() => {
        sceneRef.current?.render();
      });

      setIsLoading(false);
    };

    initScene();

    return () => {
      engineRef.current?.dispose();
      sceneRef.current?.dispose();
    };
  }, [canvas, characters]);

  const handleCharacterClick = (meshId: string) => {
    const mesh = meshesRef.current.find(m => m.id === meshId);
    if (mesh) {
      mesh.position = new Vector3(
        mesh.position.x,
        mesh.position.y + 0.5,
        mesh.position.z
      );
    }
  };

  const optimizePerformance = () => {
    if (sceneRef.current) {
      sceneRef.current.getEngine().setHardwareScalingLevel(1.5);
      sceneRef.current.freezeMaterials();
      sceneRef.current.blockMaterialDirtyMechanism = true;
    }
  };

  return {
    scene: sceneRef.current,
    isLoading,
    handleCharacterClick,
    optimizePerformance
  };
};