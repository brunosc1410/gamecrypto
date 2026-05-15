import { Pet, PetElement, MapZone } from '../types/game';

const EC: Record<PetElement, { primary: string; secondary: string; accent: string }> = {
  fire: { primary: '#ff6b35', secondary: '#ff2200', accent: '#ffcc00' },
  water: { primary: '#4a90d9', secondary: '#1a5276', accent: '#85c1e9' },
  grass: { primary: '#27ae60', secondary: '#1e8449', accent: '#82e0aa' },
  electric: { primary: '#f1c40f', secondary: '#d4ac0d', accent: '#f9e154' },
  dark: { primary: '#6c3483', secondary: '#4a235a', accent: '#bb8fce' },
  ice: { primary: '#85c1e9', secondary: '#5dade2', accent: '#d6eaf8' },
};

const IMG: Record<PetElement, string> = {
  fire: '/images/pet-flamarion.png',
  water: '/images/pet-aqualis.png',
  grass: '/images/pet-verdex.png',
  electric: '/images/pet-voltix.png',
  dark: '/images/pet-umbrix.png',
  ice: '/images/pet-glacius.png',
};

type R = 'common' | 'rare' | 'epic' | 'legendary';

function makePet(name: string, element: PetElement, rarity: R, hp: number, atk: number, def: number, spd: number): Omit<Pet, 'id'> {
  return {
    name,
    element,
    image: IMG[element],
    rarity,
    stats: { hp, maxHp: hp, attack: atk, defense: def, speed: spd, level: 1, exp: 0, expToNext: 100 },
    colors: { ...EC[element] },
    defaultColors: { ...EC[element] },
    wins: 0,
    losses: 0,
    isNFT: false,
  };
}

export const ALL_PETS: Omit<Pet, 'id'>[] = [
  // GRASS
  makePet('Leafyx', 'grass', 'common', 120, 50, 55, 55),
  makePet('Thornex', 'grass', 'rare', 140, 60, 65, 60),
  makePet('Floradon', 'grass', 'epic', 170, 75, 75, 70),
  makePet('Buglin', 'grass', 'common', 90, 35, 30, 40),
  makePet('Cocorix', 'grass', 'common', 100, 30, 55, 25),
  makePet('Papilox', 'grass', 'rare', 130, 55, 45, 70),
  makePet('Spikora', 'grass', 'common', 95, 40, 30, 45),
  makePet('Verdex', 'grass', 'common', 130, 55, 60, 60),
  makePet('Fungrix', 'grass', 'common', 110, 50, 50, 40),
  makePet('Vinelash', 'grass', 'rare', 145, 65, 55, 55),
  makePet('Tanglor', 'grass', 'rare', 135, 60, 70, 50),
  makePet('Palmeon', 'grass', 'rare', 150, 70, 60, 50),
  // FIRE
  makePet('Flamarion', 'fire', 'common', 120, 65, 45, 70),
  makePet('Blazeclaw', 'fire', 'rare', 145, 75, 55, 75),
  makePet('Infernox', 'fire', 'epic', 180, 90, 65, 85),
  makePet('Foxfire', 'fire', 'rare', 135, 60, 55, 70),
  makePet('Ninetrix', 'fire', 'epic', 165, 75, 70, 85),
  makePet('Embark', 'fire', 'rare', 150, 70, 55, 65),
  makePet('Pyrehound', 'fire', 'epic', 180, 85, 70, 80),
  makePet('Gallopyr', 'fire', 'rare', 140, 65, 50, 85),
  makePet('Magmorth', 'fire', 'rare', 140, 80, 50, 70),
  makePet('Drakonix', 'fire', 'epic', 125, 60, 50, 65),
  makePet('Dracoflare', 'fire', 'legendary', 200, 95, 80, 90),
  // WATER
  makePet('Aqualis', 'water', 'common', 140, 50, 65, 55),
  makePet('Shelldon', 'water', 'rare', 155, 60, 75, 60),
  makePet('Torrentor', 'water', 'epic', 185, 75, 85, 65),
  makePet('Quackling', 'water', 'common', 115, 55, 45, 60),
  makePet('Goldstream', 'water', 'rare', 150, 70, 65, 75),
  makePet('Tadplex', 'water', 'common', 100, 40, 40, 65),
  makePet('Tentarix', 'water', 'rare', 145, 65, 55, 70),
  makePet('Klawster', 'water', 'rare', 130, 75, 60, 55),
  makePet('Seahorse', 'water', 'common', 110, 50, 50, 65),
  makePet('Goldfin', 'water', 'common', 105, 55, 50, 60),
  makePet('Starix', 'water', 'rare', 140, 65, 60, 75),
  makePet('Karplash', 'water', 'common', 80, 20, 45, 60),
  makePet('Leviathor', 'water', 'epic', 190, 85, 70, 75),
  makePet('Vaporix', 'water', 'rare', 165, 60, 65, 60),
  // ELECTRIC
  makePet('Voltix', 'electric', 'rare', 110, 70, 40, 80),
  makePet('Thunderon', 'electric', 'epic', 140, 85, 50, 95),
  makePet('Magnetix', 'electric', 'rare', 120, 65, 60, 55),
  makePet('Spherion', 'electric', 'common', 100, 50, 45, 80),
  makePet('Blitzorb', 'electric', 'rare', 130, 70, 55, 90),
  makePet('Sparkbuzz', 'electric', 'rare', 135, 75, 50, 85),
  makePet('Joltrix', 'electric', 'rare', 135, 70, 50, 95),
  makePet('Zapwing', 'electric', 'legendary', 180, 90, 75, 95),
  // DARK
  makePet('Umbrix', 'dark', 'common', 100, 80, 35, 75),
  makePet('Serpox', 'dark', 'rare', 135, 75, 55, 70),
  makePet('Toxidon', 'dark', 'common', 110, 50, 55, 45),
  makePet('Venoqueen', 'dark', 'epic', 175, 70, 75, 65),
  makePet('Venoking', 'dark', 'epic', 170, 80, 65, 70),
  makePet('Batrix', 'dark', 'common', 95, 45, 40, 70),
  makePet('Mothox', 'dark', 'rare', 125, 60, 50, 75),
  makePet('Slimex', 'dark', 'common', 110, 55, 50, 35),
  makePet('Phantex', 'dark', 'common', 90, 55, 30, 80),
  makePet('Spectrex', 'dark', 'rare', 115, 70, 40, 85),
  makePet('Shadowex', 'dark', 'epic', 140, 85, 50, 95),
  makePet('Fumeron', 'dark', 'common', 100, 50, 60, 40),
  // ICE
  makePet('Glacius', 'ice', 'common', 135, 60, 55, 50),
  makePet('Frostong', 'ice', 'rare', 160, 65, 75, 55),
  makePet('Shellice', 'ice', 'rare', 120, 60, 85, 45),
  makePet('Psycat', 'ice', 'rare', 100, 40, 35, 85),
  makePet('Mindara', 'ice', 'epic', 130, 80, 45, 95),
  makePet('Drowzix', 'ice', 'common', 115, 50, 55, 45),
  makePet('Hypnora', 'ice', 'rare', 145, 65, 65, 60),
  makePet('Frostjinx', 'ice', 'rare', 135, 70, 50, 80),
  makePet('Laprix', 'ice', 'epic', 185, 70, 70, 55),
  makePet('Cubonix', 'ice', 'common', 115, 55, 60, 40),
  makePet('Punchamp', 'ice', 'rare', 150, 80, 55, 50),
  makePet('Snorix', 'ice', 'epic', 220, 55, 55, 25),
  makePet('Articyx', 'ice', 'legendary', 180, 80, 85, 75),
  makePet('Mewlix', 'ice', 'legendary', 200, 90, 80, 90),
  // FIRE LEGENDARIES
  makePet('Moltrex', 'fire', 'legendary', 180, 90, 70, 85),
  makePet('Mytheon', 'fire', 'legendary', 200, 85, 85, 85),
];

export const STARTER_PETS = ALL_PETS.filter(p =>
  ['Flamarion', 'Aqualis', 'Verdex', 'Voltix', 'Umbrix', 'Glacius'].includes(p.name)
);

export const ELEMENT_ADVANTAGE: Record<PetElement, PetElement> = {
  fire: 'grass',
  water: 'fire',
  grass: 'electric',
  electric: 'water',
  dark: 'ice',
  ice: 'dark',
};

export const ELEMENT_EMOJIS: Record<PetElement, string> = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  dark: '🌑',
  ice: '❄️',
};

export const RARITY_COLORS: Record<string, string> = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

export const ZONE_ELEMENTS: Record<MapZone, PetElement[]> = {
  forest: ['grass', 'grass', 'grass', 'dark'],
  volcano: ['fire', 'fire', 'fire', 'dark'],
  ocean: ['water', 'water', 'water', 'ice'],
  thunder: ['electric', 'electric', 'electric', 'fire'],
  shadow: ['dark', 'dark', 'dark', 'ice'],
  glacier: ['ice', 'ice', 'ice', 'water'],
};

export interface ZoneConfig {
  id: MapZone;
  name: string;
  emoji: string;
  bgGradient: string;
  groundColor: string;
  treeColor: string;
  pathColor: string;
  decorEmojis: string[];
  encounterRate: number;
}

export const ZONES: ZoneConfig[] = [
  { id: 'forest', name: 'Floresta Verde', emoji: '🌲', bgGradient: 'linear-gradient(180deg,#1a3a1a 0%,#0d1f0d 100%)', groundColor: '#2d5a27', treeColor: '#1a4a14', pathColor: '#8B7355', decorEmojis: ['🌿', '🍃', '🌱', '🍀', '🌸'], encounterRate: 0.03 },
  { id: 'volcano', name: 'Monte Vulcânico', emoji: '🌋', bgGradient: 'linear-gradient(180deg,#3a1a0a 0%,#1f0d05 100%)', groundColor: '#4a2a1a', treeColor: '#3a1a0a', pathColor: '#6B4226', decorEmojis: ['🔥', '💀', '🪨', '💎', '🌑'], encounterRate: 0.04 },
  { id: 'ocean', name: 'Costa Oceânica', emoji: '🌊', bgGradient: 'linear-gradient(180deg,#0a2a3a 0%,#051520 100%)', groundColor: '#c2b280', treeColor: '#0a3a5a', pathColor: '#a0d2db', decorEmojis: ['🌊', '🐚', '🦀', '⚓', '🏝️'], encounterRate: 0.03 },
  { id: 'thunder', name: 'Planície Trovão', emoji: '⚡', bgGradient: 'linear-gradient(180deg,#2a2a0a 0%,#15150d 100%)', groundColor: '#5a5a27', treeColor: '#3a3a14', pathColor: '#9B8B55', decorEmojis: ['⚡', '🌩️', '💡', '✨', '🌾'], encounterRate: 0.035 },
  { id: 'shadow', name: 'Caverna Sombria', emoji: '🌑', bgGradient: 'linear-gradient(180deg,#1a0a2a 0%,#0d0520 100%)', groundColor: '#2a1a3a', treeColor: '#1a0a2a', pathColor: '#4B3B5B', decorEmojis: ['🌑', '🦇', '🕸️', '💜', '👁️'], encounterRate: 0.05 },
  { id: 'glacier', name: 'Geleira Eterna', emoji: '❄️', bgGradient: 'linear-gradient(180deg,#1a2a3a 0%,#0d1520 100%)', groundColor: '#a0c0d8', treeColor: '#7090a8', pathColor: '#d0e8f0', decorEmojis: ['❄️', '🧊', '⛄', '💠', '🏔️'], encounterRate: 0.03 },
];

export function generateEnemyForZone(zone: MapZone, playerLevel: number): Pet {
  const elems = ZONE_ELEMENTS[zone];
  const el = elems[Math.floor(Math.random() * elems.length)];
  const candidates = ALL_PETS.filter(p => p.element === el);
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  const lv = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
  const m = 1 + (lv - 1) * 0.12;
  return {
    ...template,
    id: `enemy-${Date.now()}-${Math.random()}`,
    stats: {
      hp: Math.floor(template.stats.hp * m),
      maxHp: Math.floor(template.stats.maxHp * m),
      attack: Math.floor(template.stats.attack * m),
      defense: Math.floor(template.stats.defense * m),
      speed: Math.floor(template.stats.speed * m),
      level: lv,
      exp: 0,
      expToNext: 100,
    },
  };
}
