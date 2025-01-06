export interface FurnitureModel {
  id: string;
  name: string;
  modelPath: string;
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  defaultPosition: { x: number; y: number; z: number };
}

export interface FurniturePlacement {
  modelId: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

export const FURNITURE_MODELS: Record<string, FurnitureModel> = {
  OFFICE_CHAIR: {
    id: 'chair1',
    name: 'Office Chair',
    modelPath: '/chair.glb',
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    defaultPosition: { x: 0, y: 0, z: 0 }
  },
  DESK_TABLE: {
    id: 'table',
    name: 'Office Table',
    modelPath: '/table.glb',
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    defaultPosition: { x: 0, y: 0.5, z: 0 }
  }
};

export const calculateFurniturePlacement = (
  roomDimensions: { width: number; length: number },
  furniture: FurnitureModel[]
): FurniturePlacement[] => {
  const placements: FurniturePlacement[] = [];
  const gridSize = 2;
  
  for (let x = -roomDimensions.width/2; x < roomDimensions.width/2; x += gridSize) {
    for (let z = -roomDimensions.length/2; z < roomDimensions.length/2; z += gridSize) {
      const randomFurniture = furniture[Math.floor(Math.random() * furniture.length)];
      placements.push({
        modelId: randomFurniture.id,
        position: {
          x: x + (Math.random() * 0.5 - 0.25),
          y: randomFurniture.defaultPosition.y,
          z: z + (Math.random() * 0.5 - 0.25)
        },
        rotation: {
          x: randomFurniture.rotation.x,
          y: Math.random() * Math.PI * 2,
          z: randomFurniture.rotation.z
        }
      });
    }
  }
  
  return placements;
};

export const isValidPlacement = (
  placement: FurniturePlacement,
  existingPlacements: FurniturePlacement[],
  minDistance: number = 1.5
): boolean => {
  return existingPlacements.every(existing => {
    const dx = placement.position.x - existing.position.x;
    const dz = placement.position.z - existing.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance >= minDistance;
  });
};