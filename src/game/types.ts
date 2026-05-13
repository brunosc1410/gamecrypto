export type Rarity = 'common' | 'rare' | 'super_rare' | 'epic' | 'super_epic' | 'legendary' | 'super_legendary';
export type HeroState = 'idle' | 'moving' | 'bombing' | 'fleeing' | 'waiting' | 'resting';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type CrateType = 'common' | 'rare' | 'epic' | 'legendary';
export type HeadType = 'frog' | 'ninja' | 'cowboy' | 'vampire' | 'werewolf' | 'wizard' | 'dragon' | 'fox' | 'bear' | 'skeleton' | 'cat' | 'panda';
export type MapTheme = 'stone' | 'wind' | 'forest' | 'fire' | 'water' | 'swamp' | 'cloud' | 'ice';

export const MAP_COLS = 31;
export const MAP_ROWS = 19;
export const BOMB_TIMER = 2.5;
export const EXPLOSION_DURATION = 0.6;
export const STAMINA_DRAIN = 2;
export const STAMINA_RECOVERY = 5;
export const MAX_TEAM_SIZE = 8;
export const STARTING_BCOIN = 500;

export const ALL_HEADS: HeadType[] = ['frog', 'ninja', 'cowboy', 'vampire', 'werewolf', 'wizard', 'dragon', 'fox', 'bear', 'skeleton', 'cat', 'panda'];

export const HEAD_LABELS: Record<HeadType, string> = {
  frog: 'Sapo', ninja: 'Ninja', cowboy: 'Cowboy', vampire: 'Vampiro',
  werewolf: 'Lobisomem', wizard: 'Mago', dragon: 'Dragão', fox: 'Raposa',
  bear: 'Urso', skeleton: 'Esqueleto', cat: 'Gato', panda: 'Panda',
};

export const HEAD_EMOJIS: Record<HeadType, string> = {
  frog: '🐸', ninja: '🥷', cowboy: '🤠', vampire: '🧛', werewolf: '🐺',
  wizard: '🧙', dragon: '🐉', fox: '🦊', bear: '🐻', skeleton: '💀',
  cat: '🐱', panda: '🐼',
};

export interface ThemeConfig {
  name: string; emoji: string;
  floor1: string; floor2: string;
  wall: string; wallLight: string; wallDark: string; wallMortar: string;
  block: string; blockDark: string; blockLight: string; blockGrain: string;
  chestGlow: string; ambient: string;
}

export const MAP_THEMES: Record<MapTheme, ThemeConfig> = {
  stone: { name: 'Pedra', emoji: '🪨', floor1: '#6a6a5e', floor2: '#78786c', wall: '#585858', wallLight: '#6a6a6a', wallDark: '#484848', wallMortar: '#3a3a3a', block: '#a08860', blockDark: '#806840', blockLight: '#b8a078', blockGrain: '#907850', chestGlow: 'rgba(255,215,0,0.12)', ambient: 'rgba(0,0,0,0)' },
  wind: { name: 'Vento', emoji: '💨', floor1: '#a0c8d8', floor2: '#b0d8e8', wall: '#8ab0c0', wallLight: '#9ac0d0', wallDark: '#7aa0b0', wallMortar: '#6a90a0', block: '#c0dde8', blockDark: '#a0bdcc', blockLight: '#d0edf8', blockGrain: '#b0cdda', chestGlow: 'rgba(150,220,255,0.2)', ambient: 'rgba(180,220,255,0.04)' },
  forest: { name: 'Floresta', emoji: '🌿', floor1: '#3a7a2a', floor2: '#4a8a3a', wall: '#5a4a2a', wallLight: '#6a5a3a', wallDark: '#4a3a1a', wallMortar: '#3a2a10', block: '#6a5a30', blockDark: '#4a4020', blockLight: '#7a6a40', blockGrain: '#5a4a28', chestGlow: 'rgba(100,255,100,0.15)', ambient: 'rgba(0,80,0,0.06)' },
  fire: { name: 'Fogo', emoji: '🔥', floor1: '#8a3a1a', floor2: '#9a4a2a', wall: '#6a2a10', wallLight: '#7a3a20', wallDark: '#5a1a08', wallMortar: '#4a1005', block: '#aa5530', blockDark: '#8a4020', blockLight: '#cc6640', blockGrain: '#9a4828', chestGlow: 'rgba(255,100,0,0.2)', ambient: 'rgba(255,50,0,0.04)' },
  water: { name: 'Água', emoji: '🌊', floor1: '#2a6a9a', floor2: '#3a7aaa', wall: '#1a4a7a', wallLight: '#2a5a8a', wallDark: '#103a6a', wallMortar: '#0a2a5a', block: '#4a8ab0', blockDark: '#2a6a90', blockLight: '#5a9ac0', blockGrain: '#3a7aa0', chestGlow: 'rgba(100,200,255,0.2)', ambient: 'rgba(0,100,255,0.05)' },
  swamp: { name: 'Pântano', emoji: '🏚️', floor1: '#4a5a28', floor2: '#566a32', wall: '#3a3a1a', wallLight: '#4a4a2a', wallDark: '#2a2a10', wallMortar: '#1a1a08', block: '#5a6a30', blockDark: '#3a4a18', blockLight: '#6a7a40', blockGrain: '#4a5a24', chestGlow: 'rgba(150,200,50,0.15)', ambient: 'rgba(50,80,0,0.06)' },
  cloud: { name: 'Nuvem', emoji: '☁️', floor1: '#d0dce8', floor2: '#dce8f4', wall: '#b8c8d8', wallLight: '#c8d8e8', wallDark: '#a8b8c8', wallMortar: '#98a8b8', block: '#e0e8f0', blockDark: '#c8d0d8', blockLight: '#f0f4f8', blockGrain: '#d0d8e0', chestGlow: 'rgba(200,220,255,0.25)', ambient: 'rgba(200,220,255,0.06)' },
  ice: { name: 'Gelo', emoji: '🧊', floor1: '#90d0e8', floor2: '#a0ddf0', wall: '#70b0c8', wallLight: '#80c0d8', wallDark: '#60a0b8', wallMortar: '#5090a8', block: '#b0e0f0', blockDark: '#90c0d0', blockLight: '#c8f0ff', blockGrain: '#a0d0e0', chestGlow: 'rgba(100,220,255,0.25)', ambient: 'rgba(100,200,255,0.05)' },
};

export const THEME_ORDER: MapTheme[] = ['stone', 'forest', 'fire', 'water', 'wind', 'swamp', 'ice', 'cloud'];

export interface Point { x: number; y: number }
export interface Cell { type: 'empty' | 'wall' | 'block' | 'chest'; hp: number; maxHp: number; bcoinValue: number }
export interface HeroData { id: string; name: string; rarity: Rarity; power: number; maxStamina: number; speed: number; bombNum: number; bombRange: number; abilities: string[]; currentStamina: number; headType: HeadType; }
export interface RuntimeHero extends HeroData { x: number; y: number; tileX: number; tileY: number; direction: Direction; state: HeroState; stamina: number; activeBombs: number; path: Point[]; pathIndex: number; animTimer: number; waitTimer: number; movingToX: number; movingToY: number; hasDoubleCoins: boolean; staminaRecoveryMult: number; fleeingFrom: Point | null; }
export interface Bomb { x: number; y: number; timer: number; range: number; power: number; heroId: string; animTimer: number }
export interface Explosion { cells: Point[]; timer: number; maxTimer: number; power: number; heroId: string }
export interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; type: 'coin' | 'spark' | 'smoke' | 'damage' | 'text'; text?: string; }
export interface HeroDrop { x: number; y: number; hero: HeroData; timer: number; maxTimer: number; hp: number; maxHp: number; collected: boolean; }
export interface GameState { map: Cell[][]; heroes: RuntimeHero[]; bombs: Bomb[]; explosions: Explosion[]; particles: Particle[]; heroDrops: HeroDrop[]; bcoinCollected: number; totalChests: number; chestsOpened: number; totalBlocks: number; blocksDestroyed: number; gameTime: number; running: boolean; complete: boolean; mapNumber: number; theme: MapTheme; }

export interface CrateConfig { name: string; price: number; emoji: string; color: string; bgGradient: string; probabilities: Record<Rarity, number>; }

export const CRATES: Record<CrateType, CrateConfig> = {
  common: { name: 'Cápsula Comum', price: 10, emoji: '📦', color: '#8B7355', bgGradient: 'from-amber-800 to-amber-950', probabilities: { common: 70, rare: 20, super_rare: 7, epic: 2.5, super_epic: 0.5, legendary: 0, super_legendary: 0 } },
  rare: { name: 'Cápsula Rara', price: 30, emoji: '📦', color: '#4169E1', bgGradient: 'from-blue-700 to-blue-950', probabilities: { common: 38, rare: 30, super_rare: 18, epic: 9, super_epic: 4, legendary: 0.8, super_legendary: 0.2 } },
  epic: { name: 'Cápsula Épica', price: 80, emoji: '📦', color: '#EA580C', bgGradient: 'from-orange-700 to-orange-950', probabilities: { common: 8, rare: 14, super_rare: 22, epic: 24, super_epic: 18, legendary: 10, super_legendary: 4 } },
  legendary: { name: 'Cápsula Lendária', price: 200, emoji: '📦', color: '#D97706', bgGradient: 'from-yellow-700 to-yellow-950', probabilities: { common: 2, rare: 5, super_rare: 10, epic: 18, super_epic: 25, legendary: 25, super_legendary: 15 } },
};

export const BCOIN_BY_RARITY: Record<Rarity, number[]> = {
  common: [0, 1], rare: [0, 1], super_rare: [0, 2], epic: [0, 2],
  super_epic: [0, 2], legendary: [0, 3], super_legendary: [0, 3],
};

export const BLOCK_HERO_DROP_RATE = 0.006;
export const HERO_DROP_RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 500, rare: 250, super_rare: 130, epic: 65, super_epic: 30, legendary: 18, super_legendary: 7,
};

export const RARITY_CONFIG: Record<Rarity, { label: string; colors: { primary: string; secondary: string; helmet: string; glow: string }; stars: number }> = {
  common: { label: 'Comum', colors: { primary: '#8B7355', secondary: '#6B5B45', helmet: '#A0937D', glow: 'transparent' }, stars: 1 },
  rare: { label: 'Raro', colors: { primary: '#4169E1', secondary: '#2850B8', helmet: '#6495ED', glow: 'rgba(65,105,225,0.3)' }, stars: 2 },
  super_rare: { label: 'Super Raro', colors: { primary: '#9333EA', secondary: '#7E22CE', helmet: '#A855F7', glow: 'rgba(147,51,234,0.3)' }, stars: 3 },
  epic: { label: 'Épico', colors: { primary: '#EA580C', secondary: '#C2410C', helmet: '#F97316', glow: 'rgba(234,88,12,0.3)' }, stars: 4 },
  super_epic: { label: 'Super Épico', colors: { primary: '#DC2626', secondary: '#991B1B', helmet: '#EF4444', glow: 'rgba(220,38,38,0.35)' }, stars: 5 },
  legendary: { label: 'Lendário', colors: { primary: '#D97706', secondary: '#B45309', helmet: '#FBBF24', glow: 'rgba(251,191,36,0.4)' }, stars: 6 },
  super_legendary: { label: 'Super Lendário', colors: { primary: '#E0E7FF', secondary: '#A5B4FC', helmet: '#F5F3FF', glow: 'rgba(224,231,255,0.5)' }, stars: 7 },
};

const HERO_NAMES: Record<Rarity, string[]> = {
  common: ['TNT Tom', 'Blast Bob', 'Boom Ben', 'Crash Cal', 'Fuse Fred', 'Pow Pete', 'Dyna Dan', 'Rookie Ray'],
  rare: ['Rocket Rick', 'Thunder Ty', 'Storm Sam', 'Blaze Bri', 'Volt Vic', 'Spark Sal', 'Jet Jess'],
  super_rare: ['Nova Nick', 'Cosmo Cam', 'Pulsar Pam', 'Quasar Quinn', 'Nebula Ned', 'Astro Amy'],
  epic: ['Inferno Ike', 'Tsunami Tess', 'Blizzard Blake', 'Meteor Mel', 'Cyclone Cy'],
  super_epic: ['Armageddon Ash', 'Titan Forge', 'Doomsday Dawn', 'Calamity Rex', 'Ragnarok Ray'],
  legendary: ['Supreme Spark', 'Omega Blast', 'Ultimate Boom', 'Titan Thunder', 'Phoenix Flash'],
  super_legendary: ['Cosmic Cataclysm', 'Eternal Nova', 'Infinite Void', 'Omega Supreme', 'Absolute Zero'],
};

const ALL_ABILITIES = ['Recuperação de Stamina', 'Poder Extra', 'Velocidade Extra', 'Bomba Extra', 'Alcance Estendido', 'Moedas Duplas'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let heroIdCounter = 0;
export function generateHero(rarity: Rarity): HeroData {
  heroIdCounter++;
  const id = `hero_${Date.now()}_${heroIdCounter}`;
  const name = randomChoice(HERO_NAMES[rarity]);
  const headType = randomChoice(ALL_HEADS);
  let power: number, maxStamina: number, speed: number, bombNum: number, bombRange: number;
  switch (rarity) {
    case 'common': power = 1; maxStamina = randomInt(70, 95); speed = 1.5 + Math.random() * 0.3; bombNum = 1; bombRange = 1; break;
    case 'rare': power = randomInt(1, 2); maxStamina = randomInt(95, 125); speed = 1.7 + Math.random() * 0.3; bombNum = 1; bombRange = randomInt(1, 2); break;
    case 'super_rare': power = randomInt(2, 4); maxStamina = randomInt(125, 160); speed = 1.9 + Math.random() * 0.3; bombNum = randomInt(1, 2); bombRange = 2; break;
    case 'epic': power = randomInt(3, 5); maxStamina = randomInt(160, 200); speed = 2.1 + Math.random() * 0.3; bombNum = 2; bombRange = randomInt(2, 3); break;
    case 'super_epic': power = randomInt(5, 7); maxStamina = randomInt(200, 250); speed = 2.3 + Math.random() * 0.3; bombNum = 2; bombRange = randomInt(3, 4); break;
    case 'legendary': power = randomInt(7, 10); maxStamina = randomInt(250, 310); speed = 2.5 + Math.random() * 0.3; bombNum = randomInt(2, 3); bombRange = randomInt(4, 5); break;
    case 'super_legendary': power = randomInt(10, 13); maxStamina = randomInt(310, 380); speed = 2.7 + Math.random() * 0.3; bombNum = 3; bombRange = randomInt(5, 6); break;
  }
  const abilityCount = rarity === 'common' ? 0 : rarity === 'rare' ? randomInt(0, 1) : rarity === 'super_rare' ? 1 : rarity === 'epic' ? randomInt(1, 2) : rarity === 'super_epic' ? randomInt(2, 3) : rarity === 'legendary' ? randomInt(2, 3) : randomInt(3, 4);
  const abilities: string[] = [];
  const available = [...ALL_ABILITIES];
  for (let i = 0; i < abilityCount && available.length > 0; i++) {
    const idx = randomInt(0, available.length - 1);
    abilities.push(available.splice(idx, 1)[0]);
  }
  for (const ability of abilities) {
    switch (ability) {
      case 'Poder Extra': power = Math.ceil(power * 1.3); break;
      case 'Velocidade Extra': speed *= 1.25; break;
      case 'Bomba Extra': bombNum += 1; break;
      case 'Alcance Estendido': bombRange += 1; break;
      case 'Recuperação de Stamina': maxStamina = Math.ceil(maxStamina * 1.25); break;
    }
  }
  return { id, name, rarity, power, maxStamina, speed, bombNum, bombRange, abilities, currentStamina: maxStamina, headType };
}

export function rollCrate(crateType: CrateType): HeroData {
  const config = CRATES[crateType];
  const roll = Math.random() * 100;
  let cumulative = 0;
  const rarities: Rarity[] = ['common', 'rare', 'super_rare', 'epic', 'super_epic', 'legendary', 'super_legendary'];
  for (const rarity of rarities) {
    cumulative += config.probabilities[rarity];
    if (roll < cumulative) return generateHero(rarity);
  }
  return generateHero('common');
}

export function rollBlockHeroDrop(): HeroData | null {
  if (Math.random() > BLOCK_HERO_DROP_RATE) return null;
  const rarities: Rarity[] = ['common', 'rare', 'super_rare', 'epic', 'super_epic', 'legendary', 'super_legendary'];
  const totalWeight = rarities.reduce((s, r) => s + HERO_DROP_RARITY_WEIGHTS[r], 0);
  let roll = Math.random() * totalWeight;
  for (const r of rarities) {
    roll -= HERO_DROP_RARITY_WEIGHTS[r];
    if (roll <= 0) return generateHero(r);
  }
  return generateHero('common');
}

export function generateStartingTeam(): HeroData[] {
  return [generateHero('common'), generateHero('common'), generateHero('common'), generateHero('rare')];
}
