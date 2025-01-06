import { useEffect, useRef, useState } from 'react';
import { Scene, Engine, Vector3, AbstractMesh } from '@babylonjs/core';
import { createLighting, setupMeshes, createCamera } from '../lib/sceneUtils';

interface SceneSetupOptions {
  canvas: HTMLCanvasElement;
  characters: any[];
}

export const useSceneSetup = ({ canvas, characters }: SceneSetupOptions) => {
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const meshesRef = useRef<AbstractMesh[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    const initScene = async () => {
      try {
        // Create engine and scene
        engineRef.current = new Engine(canvas, true, { 
          preserveDrawingBuffer: true,
          stencil: true
        });
        sceneRef.current = new Scene(engineRef.current);

        // Setup camera and lighting
        const camera = createCamera(sceneRef.current, canvas);
        createLighting(sceneRef.current);

        // Setup meshes
        meshesRef.current = await setupMeshes(sceneRef.current, characters);

        // Start render loop
        engineRef.current.runRenderLoop(() => {
          sceneRef.current?.render();
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize scene:", error);
        setIsLoading(false);
      }
    };

    initScene();

    // Cleanup
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