import React, { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import { useSceneSetup } from '../hooks/useSceneSetup';
import { Character, CharacterType } from '../models/characters';

interface SceneViewerProps {
  characters: Character[];
  onCharacterClick?: (character: Character) => void;
}

const SceneViewer: React.FC<SceneViewerProps> = ({ characters, onCharacterClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initScene, addCharacter, setupInteractions } = useSceneSetup();

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    
    initScene(scene);

    characters.forEach(character => {
      addCharacter(scene, character);
    });

    setupInteractions(scene, (character) => {
      onCharacterClick?.(character);
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
  }, [characters, onCharacterClick]);

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