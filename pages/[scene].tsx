import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import SceneViewer from '../components/SceneViewer';
import { fetchCharacters } from '../lib/api/characterApi';
import { Character } from '../models/characters';

interface ScenePageProps {
  initialCharacters: Character[];
  sceneId: string;
}

export default function ScenePage({ initialCharacters, sceneId }: ScenePageProps) {
  const [characters, setCharacters] = useState(initialCharacters);

  useEffect(() => {
    const updateCharacters = async () => {
      try {
        const updatedCharacters = await fetchCharacters(sceneId);
        setCharacters(updatedCharacters);
      } catch (error) {
        console.error('Failed to update characters:', error);
      }
    };

    const interval = setInterval(updateCharacters, 30000);
    return () => clearInterval(interval);
  }, [sceneId]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <SceneViewer 
        characters={characters}
        sceneId={sceneId}
      />
    </div>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { scene: 'main' } }
    ],
    fallback: false
  };
};

export const getStaticProps: GetServerSideProps = async (context) => {
  const sceneId = context.params?.scene as string;

  try {
    const initialCharacters = await fetchCharacters(sceneId);
    return {
      props: {
        initialCharacters,
        sceneId,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};