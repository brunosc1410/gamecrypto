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
  currentZone: MapZone;
  avatarX: number;
  avatarY: number;
  direction: 'down' | 'up' | 'left' | 'right';
  stepCount: number;
  encounterPending: boolean;
  encounterFlash: boolean;
}

export type EncounterPhase = 
  | 'appearing'    // pet is sliding in
  | 'ready'        // waiting for player to throw
  | 'throwing'     // ball flying towards pet
  | 'shaking'      // ball shaking 1..3
  | 'caught'       // success!
  | 'broke-free'   // pet broke out, still here
  | 'fled'         // pet ran away
  | 'battle';      // player chose to battle instead

export interface EncounterState {
  active: boolean;
  wildPet: Pet | null;
  phase: EncounterPhase;
  shakeCount: number;      // 0-3 shakes before result
  ballsLeft: number;
  catchChance: number;     // 0-1 base catch chance
  fleeChance: number;      // 0-1 chance pet flees after break
  attempts: number;
}

export type GameScreen = 'menu' | 'collection' | 'battle' | 'shop' | 'wallet' | 'explore' | 'encounter' | 'codex';
