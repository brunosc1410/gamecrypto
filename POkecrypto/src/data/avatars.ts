import { AvatarClass, AvatarGender } from '../types/game';

export interface AvatarConfig {
  class: AvatarClass;
  label: string;
  emoji: string;
  colors: { skin: string; hair: string; outfit: string; accent: string; };
}

export const AVATAR_CLASSES: AvatarConfig[] = [
  { class: 'warrior',  label: 'Guerreiro', emoji: '⚔️', colors: { skin: '#fdd', hair: '#8B4513', outfit: '#c0392b', accent: '#e74c3c' } },
  { class: 'archer',   label: 'Arqueiro',  emoji: '🏹', colors: { skin: '#fdd', hair: '#2c3e50', outfit: '#27ae60', accent: '#2ecc71' } },
  { class: 'mage',     label: 'Mago',      emoji: '🔮', colors: { skin: '#fdd', hair: '#ecf0f1', outfit: '#8e44ad', accent: '#9b59b6' } },
  { class: 'dwarf',    label: 'Anão',      emoji: '⛏️', colors: { skin: '#f5cba7', hair: '#d35400', outfit: '#7f8c8d', accent: '#95a5a6' } },
  { class: 'elf',      label: 'Elfo',      emoji: '🧝', colors: { skin: '#fdebd0', hair: '#f1c40f', outfit: '#1abc9c', accent: '#16a085' } },
  { class: 'zombie',   label: 'Zumbi',     emoji: '🧟', colors: { skin: '#a9cca6', hair: '#4a4a4a', outfit: '#5d4e37', accent: '#6b5b3e' } },
  { class: 'vampire',  label: 'Vampiro',   emoji: '🧛', colors: { skin: '#e8ddd3', hair: '#1a1a2e', outfit: '#2c2c54', accent: '#e74c3c' } },
  { class: 'viking',   label: 'Viking',    emoji: '🛡️', colors: { skin: '#fdd', hair: '#d4a256', outfit: '#6c5b3e', accent: '#b8860b' } },
];

export const GENDER_OPTIONS: { key: AvatarGender; label: string; emoji: string }[] = [
  { key: 'male', label: 'Masculino', emoji: '♂️' },
  { key: 'female', label: 'Feminino', emoji: '♀️' },
];

export function getAvatarConfig(cls: AvatarClass): AvatarConfig {
  return AVATAR_CLASSES.find(a => a.class === cls) ?? AVATAR_CLASSES[0];
}
