import { Pet, PetElement } from '../types/game';
import { ELEMENT_EMOJIS } from '../data/pets';

/* ── animation per element ── */
const ELEM_ANIM: Record<PetElement, string> = {
  fire: 'anim-fire-sway',
  water: 'anim-water-swim',
  grass: 'anim-grass-rustle',
  electric: 'anim-electric-jitter',
  dark: 'anim-dark-pulse',
  ice: 'anim-ice-shimmer',
};

/* ── starter dragon images (transparent PNGs from GitHub) ── */
const GH_RAW = 'https://raw.githubusercontent.com/brunosc1410/gamecrypto/main/POkecrypto/public/images';
const STARTER_IMAGES: Record<string, string> = {
  Flamarion: `${GH_RAW}/pet-flamarion.png`,
  Aqualis:   `${GH_RAW}/pet-aqualis.png`,
  Verdex:    `${GH_RAW}/pet-verdex.png`,
  Voltix:    `${GH_RAW}/pet-voltix.png`,
  Umbrix:    `${GH_RAW}/pet-umbrix.png`,
  Glacius:   `${GH_RAW}/pet-glacius.png`,
};

/*
  Per-pet visual scale correction via CSS transform.
  The PNG files have different amounts of transparent padding around the dragon.
  transform: scale() zooms the rendered image so all dragons look the same size.
  Verdex/Flamarion/Glacius = 1.0 (reference — they fill their PNG well).
  Aqualis/Voltix/Umbrix have more empty space, so we scale them up.
*/
const PET_SCALE: Record<string, number> = {
  Flamarion: 1.0,
  Aqualis:   1.5,
  Verdex:    1.0,
  Voltix:    1.5,
  Umbrix:    1.3,
  Glacius:   1.0,
};

/* ── visual constants ── */
const ELEM_BG: Record<string, string> = {
  fire:     'linear-gradient(180deg, #4a1a0a 0%, #2a0a00 40%, #1a0500 100%)',
  water:    'linear-gradient(180deg, #0a2a4a 0%, #051a2a 40%, #030f1a 100%)',
  grass:    'linear-gradient(180deg, #0a3a1a 0%, #051f0d 40%, #030f08 100%)',
  electric: 'linear-gradient(180deg, #3a3a0a 0%, #1f1f05 40%, #0f0f03 100%)',
  dark:     'linear-gradient(180deg, #2a0a3a 0%, #15051f 40%, #0a030f 100%)',
  ice:      'linear-gradient(180deg, #0a2a3a 0%, #05151f 40%, #030a0f 100%)',
};

const ELEM_EMOJI: Record<string, string> = {
  fire: '🔥', water: '💧', grass: '🌿', electric: '⚡', dark: '🌑', ice: '❄️',
};

const RARITY_BORDER: Record<string, string> = {
  common: '#8a8a8a', rare: '#4a9eff', epic: '#c06eff', legendary: '#ffb830',
};
const RARITY_GLOW: Record<string, string> = {
  common: 'none', rare: '0 0 8px #4a9eff40', epic: '0 0 12px #c06eff50', legendary: '0 0 16px #ffb83060',
};

/* ── emoji fallback for non-starters ── */
function EmojiSprite({ pet, size }: { pet: Pet; size: number }) {
  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: size * 0.72, height: size * 0.72, borderRadius: '50%',
        background: `radial-gradient(circle, ${pet.colors.primary}55, ${pet.colors.secondary}35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 ${size * 0.2}px ${pet.colors.primary}35`,
        border: `2px solid ${pet.colors.primary}30`,
      }}>
        <span style={{ fontSize: size * 0.34 }}>{ELEMENT_EMOJIS[pet.element]}</span>
      </div>
    </div>
  );
}

/*
  Standardized image container:
  All pet images render inside a SQUARE box of `size × size`.
  The image is forced to fill exactly 82% of that box (both width and height)
  and is centered, so every pet looks the same size regardless of original PNG dimensions.
*/
function StarterSprite({ src, name, size }: { src: string; name: string; size: number }) {
  const scale = PET_SCALE[name] ?? 1.0;
  return (
    <div style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          objectPosition: 'center center',
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 3px ${Math.max(3, size * 0.06)}px rgba(0,0,0,0.4))`,
        }}
        draggable={false}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   PetSprite — the main sprite component
   Used in: menu badge, battle, encounter, detail, codex mini
   ═══════════════════════════════════════════ */
export default function PetSprite({
  pet,
  size = 80,
  animate = true,
  showParticles = true,
}: {
  pet: Pet;
  size?: number;
  animate?: boolean;
  showParticles?: boolean;
}) {
  const animClass = animate ? ELEM_ANIM[pet.element] : '';
  const imgSrc = STARTER_IMAGES[pet.name];

  return (
    <div className={animClass} style={{ width: size, height: size, position: 'relative' }}>
      {imgSrc ? (
        <StarterSprite src={imgSrc} name={pet.name} size={size} />
      ) : (
        <EmojiSprite pet={pet} size={size} />
      )}

      {showParticles && animate && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="animate-float-particle"
              style={{
                position: 'absolute',
                left: `${18 + i * 26}%`,
                bottom: '8%',
                fontSize: Math.max(8, size * 0.11),
                animationDelay: `${i * 1.3}s`,
                opacity: 0.6,
              }}
            >
              {ELEM_EMOJI[pet.element]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PetCard — Collection & Codex card
   ═══════════════════════════════════════════ */
export function PetCard({
  pet,
  size = 160,
  onClick,
  selected = false,
}: {
  pet: Pet;
  size?: number;
  onClick?: () => void;
  selected?: boolean;
}) {
  const bdr = RARITY_BORDER[pet.rarity] ?? '#8a8a8a';
  const w = size;
  const h = size * 1.4;
  const imgSrc = STARTER_IMAGES[pet.name];

  const frameH = h * 0.44;
  const spriteSize = Math.round(frameH * 0.78);

  const shineClass =
    pet.rarity === 'legendary' ? 'shine-legendary' :
    pet.rarity === 'epic' ? 'shine-epic' :
    pet.rarity === 'rare' ? 'shine-rare' : '';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all active:scale-[0.96] hover:scale-[1.02] ${shineClass} ${
        selected ? 'scale-[1.03]' : ''
      }`}
      style={{
        width: w, height: h, borderRadius: 12,
        background: 'linear-gradient(160deg, #2a2a4a, #181830)',
        border: `3px solid ${selected ? '#facc15' : bdr}`,
        boxShadow: selected ? '0 0 20px #facc1540' : RARITY_GLOW[pet.rarity],
        overflow: 'hidden',
      }}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-white font-bold text-[11px] truncate">{pet.name}</span>
          <span className="text-gray-400 text-[9px] font-semibold flex-shrink-0">Lv.{pet.stats.level}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-red-400 font-black text-sm">{pet.stats.maxHp}</span>
          <span className="text-red-400 text-[9px]">HP</span>
          <span className="text-lg ml-0.5">{ELEM_EMOJI[pet.element]}</span>
        </div>
      </div>

      {/* ART FRAME */}
      <div
        className="mx-2 relative rounded-lg overflow-hidden"
        style={{
          height: frameH,
          border: `2px solid ${bdr}50`,
          background: ELEM_BG[pet.element],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* glow behind pet */}
        <div style={{
          position: 'absolute',
          width: '60%', height: '60%', borderRadius: '50%',
          background: `radial-gradient(circle, ${pet.colors.primary}30, transparent)`,
          filter: 'blur(16px)',
        }} />

        {/* pet sprite — standardized square container */}
        <div className="anim-generic-idle" style={{
          position: 'relative', zIndex: 2,
          width: spriteSize, height: spriteSize,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={pet.name}
              style={{
                width: spriteSize,
                height: spriteSize,
                objectFit: 'contain',
                objectPosition: 'center center',
                transform: `scale(${PET_SCALE[pet.name] ?? 1.0})`,
                filter: `drop-shadow(0 4px 10px ${pet.colors.primary}50)`,
              }}
              draggable={false}
            />
          ) : (
            <PetSprite pet={pet} size={Math.round(spriteSize * 0.85)} animate={false} showParticles={false} />
          )}
        </div>

        {/* NFT badge */}
        {pet.isNFT && (
          <span className="absolute top-1 left-1 text-cyan-400 text-[7px] font-bold bg-cyan-900/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            NFT
          </span>
        )}
      </div>

      {/* RARITY BAR */}
      <div className="flex items-center justify-between px-2 mt-1">
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{
          color: bdr, backgroundColor: bdr + '18', border: `1px solid ${bdr}30`,
        }}>{pet.rarity.toUpperCase()}</span>
        <span className="text-gray-500 text-[8px]">{pet.wins}W / {pet.losses}L</span>
      </div>

      {/* STATS */}
      <div style={{ padding: '0 10px', marginTop: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 6 }}>
          <span style={{ color: '#fb923c', fontSize: 9, fontWeight: 700 }}>⚔ {pet.stats.attack}</span>
          <span style={{ color: '#60a5fa', fontSize: 9, fontWeight: 700 }}>🛡 {pet.stats.defense}</span>
          <span style={{ color: '#facc15', fontSize: 9, fontWeight: 700 }}>💨 {pet.stats.speed}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <span style={{ color: '#f87171', fontSize: 7, fontWeight: 700, flexShrink: 0 }}>HP</span>
          <div style={{ flex: 1, height: 5, background: '#1f2937', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: '#22c55e', width: `${(pet.stats.hp / pet.stats.maxHp) * 100}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#60a5fa', fontSize: 7, fontWeight: 700, flexShrink: 0 }}>EXP</span>
          <div style={{ flex: 1, height: 4, background: '#1f2937', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: '#60a5fa', width: `${(pet.stats.exp / pet.stats.expToNext) * 100}%` }} />
          </div>
          <span style={{ color: '#6b7280', fontSize: 6, fontWeight: 600, flexShrink: 0 }}>{pet.stats.exp}/{pet.stats.expToNext}</span>
        </div>
      </div>

      {pet.rarity !== 'common' && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
        }} />
      )}
    </div>
  );
}
