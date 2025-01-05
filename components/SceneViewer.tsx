
'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Character } from '../models/characters';

interface SceneViewerProps {
  characters: Character[];
  sceneId: string;
}

const SceneViewer: React.FC<SceneViewerProps> = ({ characters, sceneId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initScene = async () => {
      const { Engine, Scene } = await import('@babylonjs/core');
      const { useSceneSetup } = await import('../hooks/useSceneSetup');
      
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);
      
      const { initScene, handleCharacterClick, optimizePerformance } = useSceneSetup({
        canvas: canvasRef.current,
        characters
      });

      engine.runRenderLoop(() => {
        scene.render();
      });

      const handleResize = () => {
        engine.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        engine.dispose();
      };
    };

    initScene();
  }, [characters, sceneId]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100vh',
        outline: 'none',
        touchAction: 'none'
      }}
    />
  );
};

export default dynamic(() => Promise.resolve(SceneViewer), {
  ssr: false
});
