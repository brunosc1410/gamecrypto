// Custom sprite overrides
// You can use either:
// 1) a single image override per pet, or
// 2) pose-specific overrides (recommended for battle poses)

export type PoseKey = 'front' | 'side' | 'back' | 'faint';

// Single-image override (used everywhere if no pose-specific override exists)
export const CUSTOM_SPRITE_OVERRIDES: Record<string, string> = {
  // Keep empty for now to avoid broken Verdex full-sheet rendering.
};

// Pose-specific overrides (BEST OPTION)
// Put 4 separate images on GitHub/public folder and map them here.
// Example URLs if you later upload them:
// front: 'https://raw.githubusercontent.com/.../verdex-front.png'
// back: 'https://raw.githubusercontent.com/.../verdex-back.png'
// side: 'https://raw.githubusercontent.com/.../verdex-side.png'
// faint: 'https://raw.githubusercontent.com/.../verdex-faint.png'
export const CUSTOM_POSE_OVERRIDES: Record<string, Partial<Record<PoseKey, string>>> = {
  // Verdex: {
  //   front: 'https://raw.githubusercontent.com/brunosc1410/gamecrypto/main/POkecrypto/poekomons/verdex-front.png',
  //   back:  'https://raw.githubusercontent.com/brunosc1410/gamecrypto/main/POkecrypto/poekomons/verdex-back.png',
  //   side:  'https://raw.githubusercontent.com/brunosc1410/gamecrypto/main/POkecrypto/poekomons/verdex-side.png',
  //   faint: 'https://raw.githubusercontent.com/brunosc1410/gamecrypto/main/POkecrypto/poekomons/verdex-faint.png',
  // },
};

// Optional spritesheet support (disabled by default)
export interface SheetCrop { x: number; y: number; w: number; h: number; }
export interface SpriteSheetConfig { poses: Record<PoseKey, SheetCrop>; }
export const CUSTOM_SPRITE_SHEETS: Record<string, SpriteSheetConfig> = {};
