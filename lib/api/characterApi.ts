
import { Character } from '../../models/characters';
import { defaultCharacters } from '../../models/characters';

export async function fetchCharacters(sceneId: string): Promise<Character[]> {
  // For now, return default characters
  // In a real implementation, this would fetch from an API
  return Object.values(defaultCharacters);
}
