
import { GetStaticProps, GetStaticPaths } from 'next';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Character } from '../models/characters';
import { fetchCharacters } from '../lib/api/characterApi';

const SceneViewer = dynamic(
  () => import('../components/SceneViewer').then(mod => mod),
  {
    loading: () => <div>Loading 3D Scene...</div>,
    ssr: false
  }
);

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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { scene: 'main' } }
    ],
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<ScenePageProps> = async ({ params }) => {
  const sceneId = params?.scene as string;

  try {
    const initialCharacters = await fetchCharacters(sceneId);
    return {
      props: {
        initialCharacters,
        sceneId,
      },
      revalidate: 60
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};
