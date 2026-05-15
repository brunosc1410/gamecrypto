export type PetElement = 'fire' | 'water' | 'grass' | 'electric' | 'dark' | 'ice';

export type MapZone = 'forest' | 'volcano' | 'ocean' | 'thunder' | 'shadow' | 'glacier';

export interface PetStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  exp: number;
  expToNext: number;
}

export interface PetColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Pet {
  id: string;
  name: string;
  element: PetElement;
  image: string;
  stats: PetStats;
  colors: PetColors;
  defaultColors: PetColors;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  wins: number;
  losses: number;
  isNFT: boolean;
  tokenId?: string;
}

export interface BattleLog {
  id: string;
  message: string;
  type: 'attack' | 'defend' | 'critical' | 'miss' | 'win' | 'lose' | 'info' | 'heal';
  timestamp: number;
}

export interface BattleAnimation {
  type: 'idle' | 'attack-player' | 'attack-enemy' | 'hit-player' | 'hit-enemy' | 'faint-player' | 'faint-enemy' | 'flash' | 'none';
  duration: number;
}

export interface BattleState {
  isActive: boolean;
  playerPet: Pet | null;
  enemyPet: Pet | null;
  playerCurrentHp: number;
  enemyCurrentHp: number;
  logs: BattleLog[];
  turn: number;
  winner: 'player' | 'enemy' | null;
  isAutoPlaying: boolean;
  battleSpeed: number;
  currentAnimation: BattleAnimation;
  showDamage: { player: number | null; enemy: number | null };
}

export interface ExploreState {
  isExploring: boolean;
  searching: boolean;
  currentZone: MapZone;
  avatarX: number;
  avatarY: number;
  direction: 'down' | 'up' | 'left' | 'right';
  stepCount: number;
  encounterPending: boolean;
  encounterFlash: boolean;
}

export type EncounterPhase =
  | 'appearing'
  | 'ready'
  | 'throwing'
  | 'shaking'
  | 'caught'
  | 'broke-free'
  | 'fled'
  | 'battle';

export interface EncounterState {
  active: boolean;
  wildPet: Pet | null;
  phase: EncounterPhase;
  shakeCount: number;
  ballsLeft: number;
  catchChance: number;
  fleeChance: number;
  attempts: number;
}

export type AvatarGender = 'male' | 'female';
export type AvatarClass = 'archer' | 'warrior' | 'mage' | 'dwarf' | 'elf' | 'zombie' | 'vampire' | 'viking';

export type GameScreen = 'menu' | 'collection' | 'battle' | 'shop' | 'wallet' | 'explore' | 'encounter' | 'codex' | 'profile';
