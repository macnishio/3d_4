export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  model: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  animations: CharacterAnimation[];
  interactionZone: InteractionZone;
  metadata: CharacterMetadata;
}

export enum CharacterRole {
  POSTMAN = 'postman',
  BOSS = 'boss',
  ADVISOR = 'advisor'
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CharacterAnimation {
  name: string;
  frames: number[];
  loop: boolean;
  speed: number;
}

export interface InteractionZone {
  radius: number;
  height: number;
  triggerDistance: number;
}

export interface CharacterMetadata {
  description: string;
  dialogues: Dialogue[];
  tasks?: Task[];
  availability: Schedule;
}

export interface Dialogue {
  id: string;
  text: string;
  conditions?: DialogueCondition[];
  nextDialogueId?: string;
}

export interface DialogueCondition {
  type: 'task' | 'time' | 'interaction';
  value: string | number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward?: string;
  isCompleted: boolean;
}

export interface Schedule {
  workDays: number[];
  workHours: {
    start: number;
    end: number;
  };
}

export const defaultCharacters: Record<CharacterRole, Character> = {
  [CharacterRole.POSTMAN]: {
    id: 'postman-1',
    name: 'Mail Runner',
    role: CharacterRole.POSTMAN,
    model: '/models/characters/postman.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    animations: [
      { name: 'walk', frames: [0, 30], loop: true, speed: 1 },
      { name: 'idle', frames: [31, 60], loop: true, speed: 1 }
    ],
    interactionZone: {
      radius: 2,
      height: 3,
      triggerDistance: 1.5
    },
    metadata: {
      description: 'Office mail delivery specialist',
      dialogues: [
        { id: 'd1', text: 'Got some mail for you!' }
      ],
      availability: {
        workDays: [1, 2, 3, 4, 5],
        workHours: { start: 9, end: 17 }
      }
    }
  },
  [CharacterRole.BOSS]: {
    id: 'boss-1',
    name: 'Director',
    role: CharacterRole.BOSS,
    model: '/models/characters/boss.glb',
    position: { x: 5, y: 0, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    animations: [
      { name: 'sit', frames: [0, 30], loop: true, speed: 1 },
      { name: 'talk', frames: [31, 60], loop: true, speed: 1 }
    ],
    interactionZone: {
      radius: 3,
      height: 4,
      triggerDistance: 2
    },
    metadata: {
      description: 'Office director',
      dialogues: [
        { id: 'd1', text: 'How are the projects coming along?' }
      ],
      tasks: [
        {
          id: 't1',
          title: 'Weekly Report',
          description: 'Submit weekly progress report',
          isCompleted: false
        }
      ],
      availability: {
        workDays: [1, 2, 3, 4, 5],
        workHours: { start: 8, end: 18 }
      }
    }
  },
  [CharacterRole.ADVISOR]: {
    id: 'advisor-1',
    name: 'Mentor',
    role: CharacterRole.ADVISOR,
    model: '/models/characters/advisor.glb',
    position: { x: -5, y: 0, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    animations: [
      { name: 'explain', frames: [0, 30], loop: true, speed: 1 },
      { name: 'listen', frames: [31, 60], loop: true, speed: 1 }
    ],
    interactionZone: {
      radius: 2.5,
      height: 3.5,
      trig