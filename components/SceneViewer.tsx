
'use client';

import React, { useEffect, useRef } from 'react';
import { useSceneSetup } from '../hooks/useSceneSetup';
import { Character } from '../models/characters';
import '@babylonjs/loaders/glTF';

interface SceneViewerProps {
  characters: Character[];
  sceneId: string;
}

const SceneViewer: React.FC<SceneViewerProps> = ({ characters, sceneId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scene, isLoading, handleCharacterClick, optimizePerformance } = useSceneSetup({
    canvas: canvasRef.current,
    characters
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    optimizePerformance();
  }, [characters, sceneId, optimizePerformance]);

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

export default SceneViewer;
