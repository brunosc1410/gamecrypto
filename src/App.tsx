import { useState, useRef, useCallback, useEffect } from 'react';
import { GameEngine } from './game/engine';
import { GameRenderer } from './game/renderer';
import {
  type HeroData, type Rarity, type CrateType, type HeadType,
  CRATES, RARITY_CONFIG, MAX_TEAM_SIZE, STARTING_BCOIN,
  HEAD_EMOJIS, HEAD_LABELS,
  generateStartingTeam, rollCrate,
} from './game/types';

// ─── Bcoin Icon ───
function BcoinIcon({ size = 20 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30 animate-[coinPulse_2s_ease-in-out_infinite]" />
      <span className="relative z-10 font-black text-yellow-900 text-sm">B</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
    </div>
  );
}

// ─── HUD Chest Icon (target for flying coins) ───
function HudChestIcon({ size = 22, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} className={pulse ? 'animate-[chestPulse_0.4s_ease-in-out]' : ''}>
      {/* Chest body */}
      <rect x="3" y="13" width="22" height="12" rx="2" fill="#8B5A2B" stroke="#5a3518" strokeWidth="1" />
      {/* Chest lid */}
      <path d="M3 13 Q3 7 14 7 Q25 7 25 13" fill="#A0722B" stroke="#5a3518" strokeWidth="1" />
      {/* Gold trim */}
      <line x1="3" y1="13" x2="25" y2="13" stroke="#DAA520" strokeWidth="1.5" />
      {/* Lock */}
      <rect x="11" y="16" width="6" height="5" rx="1" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5" />
      <circle cx="14" cy="17.5" r="1" fill="#333" />
      {/* Highlight */}
      <path d="M6 9 Q6 8 8 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
    </svg>
  );
}

// ─── Head Icon (FIX #1: Custom SVG for ninja instead of unsupported emoji) ───
function HeadIcon({ headType, size = 'text-2xl' }: { headType: HeadType; size?: string }) {
  if (headType === 'ninja') {
    return (
      <svg viewBox="0 0 36 36" className={`${size} inline-block align-middle`} style={{ width: '1.2em', height: '1.2em' }}>
        {/* Head */}
        <circle cx="18" cy="20" r="12" fill="#1a1a2a" />
        {/* Headband */}
        <rect x="4" y="15" width="28" height="5" rx="2" fill="#cc2222" />
        {/* Headband tail */}
        <path d="M4 17.5 Q0 17 -1 12 Q-2 7 -4 4" stroke="#cc2222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M4 17.5 Q0 18 -2 22 Q-3 26 -5 27" stroke="#cc2222" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* Eyes */}
        <ellipse cx="12" cy="18.5" rx="4" ry="2.8" fill="white" />
        <ellipse cx="24" cy="18.5" rx="4" ry="2.8" fill="white" />
        <circle cx="12" cy="18.5" r="1.8" fill="#111" />
        <circle cx="24" cy="18.5" r="1.8" fill="#111" />
        {/* Eye highlights */}
        <circle cx="11" cy="17.5" r="0.7" fill="rgba(255,255,255,0.6)" />
        <circle cx="23" cy="17.5" r="0.7" fill="rgba(255,255,255,0.6)" />
        {/* Shadow under headband */}
        <rect x="6" y="20" width="24" height="1" fill="rgba(0,0,0,0.15)" />
      </svg>
    );
  }
  return <span className={`${size} inline-block align-middle`}>{HEAD_EMOJIS[headType]}</span>;
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const config = RARITY_CONFIG[rarity];
  return (
    <span style={{ color: config.colors.primary }} className="text-xs font-bold">
      {config.label}
    </span>
  );
}

// ─── Hero Card ───
function HeroCard({ hero, selected, onToggle, showToggle }: {
  hero: HeroData; selected?: boolean; onToggle?: () => void; showToggle?: boolean;
}) {
  const config = RARITY_CONFIG[hero.rarity];
  const borderColors: Record<Rarity, string> = {
    common: 'border-gray-600 hover:border-gray-400', rare: 'border-blue-500 hover:border-blue-400',
    super_rare: 'border-purple-500 hover:border-purple-400', epic: 'border-orange-500 hover:border-orange-400',
    super_epic: 'border-red-500 hover:border-red-400', legendary: 'border-yellow-400 hover:border-yellow-300',
    super_legendary: 'border-violet-400 hover:border-violet-300',
  };
  const bgColors: Record<Rarity, string> = {
    common: 'from-gray-800 to-gray-900', rare: 'from-blue-900/40 to-gray-900',
    super_rare: 'from-purple-900/40 to-gray-900', epic: 'from-orange-900/40 to-gray-900',
    super_epic: 'from-red-900/40 to-gray-900', legendary: 'from-yellow-900/40 to-gray-900',
    super_legendary: 'from-violet-900/40 to-gray-900',
  };

  return (
    <div
      onClick={onToggle}
      className={`relative bg-gradient-to-b ${bgColors[hero.rarity]} border-2 ${borderColors[hero.rarity]} rounded-xl p-3 cursor-pointer transition-all select-none ${selected ? 'ring-2 ring-green-400' : ''}`}
    >
      {selected && <div className="absolute top-1 right-1 text-green-400 text-sm">✓</div>}
      <div className="flex flex-col items-center gap-1">
        <HeadIcon headType={hero.headType} />
        <span className="text-white text-sm font-bold text-center leading-tight">{hero.name}</span>
        <span className="text-gray-400 text-xs">{HEAD_LABELS[hero.headType]}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < config.stars ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
          ))}
        </div>
        <RarityBadge rarity={hero.rarity} />
        <div className="grid grid-cols-2 gap-x-2 text-xs text-gray-400 w-full">
          <span>⚡{hero.power}</span>
          <span>❤️{hero.maxStamina}</span>
          <span>💣{hero.bombNum}</span>
          <span>📏{hero.bombRange}</span>
        </div>
        {hero.abilities.length > 0 && (
          <div className="mt-1 space-y-0.5 w-full">
            {hero.abilities.map((a, i) => (
              <div key={i} className="text-xs text-cyan-400 truncate">✦ {a}</div>
            ))}
          </div>
        )}
      </div>
      {showToggle && (
        <div className="absolute top-1 left-1">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${selected ? 'bg-green-500 border-green-400 text-white' : 'border-gray-500'}`}>
            {selected ? '✓' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Crate Open Modal ───
function CrateOpenModal({ hero, crateType: _crateType, onClose }: { hero: HeroData; crateType: CrateType; onClose: () => void }) {
  const [phase, setPhase] = useState<'shaking' | 'revealing' | 'showing'>('shaking');
  const config = RARITY_CONFIG[hero.rarity];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 1200);
    const t2 = setTimeout(() => setPhase('showing'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
        {phase === 'shaking' && (
          <div className="flex flex-col items-center gap-4 animate-bounce">
            <div className="text-6xl">📦</div>
            <p className="text-white text-lg">Abrindo baú...</p>
          </div>
        )}
        {phase === 'revealing' && (
          <div className="w-24 h-24 mx-auto rounded-full animate-ping" style={{ background: config.colors.glow }} />
        )}
        {phase === 'showing' && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400">Você conseguiu:</p>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 rounded-xl p-4" style={{ borderColor: config.colors.primary }}>
              <HeadIcon headType={hero.headType} size="text-4xl" />
              <p className="text-white font-bold text-lg mt-2">{hero.name}</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < config.stars ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                ))}
              </div>
              <RarityBadge rarity={hero.rarity} />
              <div className="mt-2 text-xs text-gray-400">
                ⚡{hero.power} ❤️{hero.maxStamina} 💣{hero.bombNum} 📏{hero.bombRange}
              </div>
              {hero.abilities.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-gray-500 font-bold">HABILIDADES</p>
                  {hero.abilities.map((a, i) => <div key={i} className="text-xs text-cyan-400">✦ {a}</div>)}
                </div>
              )}
            </div>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition">Coletar!</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gacha Capsule Card (Gacha ball style like vending machine capsules) ───
function CapsuleCard({ config, canAfford, onBuy }: {
  config: typeof CRATES.common; canAfford: boolean; onBuy: () => void;
}) {
  const rarityOrder: Rarity[] = ['super_legendary', 'legendary', 'super_epic', 'epic', 'super_rare', 'rare', 'common'];
  const baseColor = config.color;

  return (
    <div
      onClick={canAfford ? onBuy : undefined}
      className={`relative bg-gradient-to-b from-gray-800/90 to-gray-900/95 rounded-xl p-3 border-2 cursor-pointer transition-all select-none flex flex-col items-center
        ${canAfford ? 'border-white/20 hover:border-white/50 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-white/5' : 'border-gray-700 opacity-50 cursor-not-allowed'}`}
    >
      {/* Gacha Capsule Ball SVG - looks like a real round capsule toy */}
      <svg viewBox="0 0 100 120" width="80" height="96" className="mb-2 drop-shadow-lg">
        {/* Drop shadow */}
        <ellipse cx="50" cy="112" rx="24" ry="5" fill="rgba(0,0,0,0.25)" />

        {/* Bottom half - solid colored plastic */}
        <path d="M18 65 Q18 105 50 105 Q82 105 82 65 L82 60 Q82 58 80 58 L20 58 Q18 58 18 60 Z" fill={baseColor} />
        {/* Bottom highlight */}
        <path d="M25 70 Q25 95 50 100 Q75 95 75 70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Bottom inner shadow at seam */}
        <path d="M20 60 Q50 62 80 60" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Top half - clear transparent dome */}
        <path d="M18 60 Q18 14 50 10 Q82 14 82 60 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

        {/* Seam ring around middle */}
        <ellipse cx="50" cy="60" rx="32" ry="4" fill="none" stroke="rgba(200,200,200,0.4)" strokeWidth="2" />
        {/* Inner seam shadow */}
        <ellipse cx="50" cy="61" rx="31" ry="3.5" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

        {/* Glass shine - big highlight arc */}
        <path d="M32 28 Q35 18 48 16" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 36 Q32 28 38 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />

        {/* Small sparkle dots on glass */}
        <circle cx="65" cy="30" r="1.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="70" cy="45" r="1" fill="rgba(255,255,255,0.2)" />

        {/* Mystery toy silhouette inside the dome */}
        <circle cx="50" cy="44" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* Question mark */}
        <text x="50" y="49" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="16" fontWeight="900" fontFamily="sans-serif">?</text>

        {/* Bottom half color gradient overlay */}
        <defs>
          <linearGradient id={`grad-${config.name.replace(/\s/g,'')}`} x1="0" y1="60" x2="0" y2="105">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="40%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
        </defs>
        <path d="M18 65 Q18 105 50 105 Q82 105 82 65 L82 60 Q82 58 80 58 L20 58 Q18 58 18 60 Z" fill={`url(#grad-${config.name.replace(/\s/g,'')})`} />

        {/* Small embossed logo area on bottom */}
        <circle cx="50" cy="82" r="8" fill="rgba(0,0,0,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <text x="50" y="86" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="bold" fontFamily="sans-serif">B</text>
      </svg>

      <p className="text-white text-xs font-bold text-center leading-tight">{config.name}</p>
      <div className="flex items-center justify-center gap-1.5 mt-1">
        <BcoinIcon size={14} />
        <span className="text-yellow-400 text-sm font-bold">{config.price}</span>
      </div>

      {/* Always visible probabilities */}
      <div className="mt-2 w-full space-y-[2px]">
        {rarityOrder.filter(r => config.probabilities[r] > 0).map(r => (
          <div key={r} className="flex justify-between items-center px-1">
            <span className="text-[9px] leading-tight" style={{ color: RARITY_CONFIG[r].colors.primary }}>{RARITY_CONFIG[r].label}</span>
            <span className="text-[9px] text-gray-400 leading-tight">{config.probabilities[r]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Collection Screen (FIX #2: Grid layout matches capsules) ───
function CollectionScreen({ bcoin, heroes, hasSavedGame, onBuyCrate, onStartHunt, onResumeGame }: {
  bcoin: number; heroes: HeroData[]; hasSavedGame: boolean;
  onBuyCrate: (type: CrateType) => void;
  onStartHunt: () => void;
  onResumeGame: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-auto">
      {/* Animated BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-yellow-500/5 animate-[coinPulse_3s_ease-in-out_infinite]" style={{
            width: 4 + (i * 7 % 8),
            height: 4 + (i * 7 % 8),
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
            💣 Bomber Heroes
          </h1>
        </div>
        <p className="text-center text-gray-400">Colete heróis e caçe tesouros!</p>

        {/* BCOIN */}
        <div className="flex items-center justify-center gap-2">
          <BcoinIcon />
          <div className="bg-gray-800/80 rounded-full px-4 py-1.5 flex items-center gap-2 border border-yellow-500/30">
            <span className="text-yellow-400 font-bold text-lg">{bcoin}</span>
            <span className="text-yellow-600 text-xs font-semibold">BCOIN</span>
          </div>
        </div>

        {/* Resume */}
        {hasSavedGame && (
          <div className="text-center">
            <button onClick={onResumeGame} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition shadow-lg shadow-green-500/30">
              ▶️ Retomar Caça
            </button>
          </div>
        )}

        {/* Gacha Capsules */}
        <div>
          <h2 className="text-xl font-bold text-center mb-3">🏪 Comprar Cápsulas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {(Object.entries(CRATES) as [CrateType, typeof CRATES.common][]).map(([type, cfg]) => (
              <CapsuleCard key={type} config={cfg} canAfford={bcoin >= cfg.price} onBuy={() => onBuyCrate(type)} />
            ))}
          </div>
        </div>

        {/* FIX #2: Collection grid matches capsules grid (grid-cols-2 sm:grid-cols-4) */}
        <div>
          <h2 className="text-xl font-bold text-center mb-3">⚔️ Coleção ({heroes.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {heroes.map(h => <HeroCard key={h.id} hero={h} />)}
          </div>
          {heroes.length === 0 && <p className="text-center text-gray-500 mt-2">Compre cápsulas para ganhar heróis!</p>}
        </div>

        {/* Start */}
        <div className="text-center pb-8">
          <button onClick={onStartHunt} className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-full font-bold text-lg transition shadow-lg shadow-red-500/30">
            ⚔️ Iniciar Caça ao Tesouro
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Team Select Screen ───
function TeamSelectScreen({ heroes, selectedIds, onToggle, onStart, onBack }: {
  heroes: HeroData[]; selectedIds: string[];
  onToggle: (id: string) => void; onStart: () => void; onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">⚔️ Monte seu Time</h1>
          <p className="text-gray-400 mt-1">Selecione até {MAX_TEAM_SIZE} heróis para a caça ao tesouro</p>
        </div>

        {/* Slots */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-2">
            {Array.from({ length: MAX_TEAM_SIZE }).map((_, i) => {
              const sid = selectedIds[i];
              const hero = sid ? heroes.find(h => h.id === sid) : undefined;
              return (
                <div key={i} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${hero ? 'border-green-500 bg-green-900/30' : 'border-gray-700 bg-gray-800/50'}`}>
                  {hero ? <HeadIcon headType={hero.headType} size="text-lg" /> : <span className="text-gray-600">?</span>}
                </div>
              );
            })}
          </div>
          <span className="text-gray-400 font-bold">{selectedIds.length}/{MAX_TEAM_SIZE}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {heroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} selected={selectedIds.includes(hero.id)} onToggle={() => onToggle(hero.id)} showToggle />
          ))}
        </div>

        <div className="flex gap-3 justify-center pb-6">
          <button onClick={onBack} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold transition">← Voltar</button>
          <button onClick={onStart} disabled={selectedIds.length === 0} className={`px-6 py-2 rounded-full font-bold transition ${selectedIds.length > 0 ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
            Iniciar ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Status Mini ───
function HeroStatusMini({ hero, onSwap }: { hero: { id: string; name: string; stamina: number; maxStamina: number; state: string; rarity: Rarity; headType: HeadType }; onSwap?: (id: string) => void }) {
  const config = RARITY_CONFIG[hero.rarity];
  const ratio = hero.stamina / hero.maxStamina;
  const stateIcons: Record<string, string> = { idle: '🔍', moving: '🏃', bombing: '💣', fleeing: '💨', waiting: '⏳', resting: '💤' };
  const staminaLow = ratio < 0.45;

  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: config.colors.primary }}>
        <span className="text-sm"><HeadIcon headType={hero.headType} size="text-sm" /></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-sm font-bold truncate">{hero.name}</span>
          <span className="text-sm">{stateIcons[hero.state] || '❓'}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.max(0, ratio * 100)}%`,
              backgroundColor: ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#FF9800' : '#F44336',
            }} />
          </div>
          <span className="text-sm text-gray-400 w-10 text-right">{Math.round(hero.stamina)}</span>
        </div>
      </div>
      {onSwap && staminaLow && (
        <button onClick={() => onSwap(hero.id)} className="text-sm px-2 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-white shrink-0 font-bold">🔄</button>
      )}
    </div>
  );
}

// ─── Game Screen ───
function GameScreen({ engineRef, team, onLeave, onClaim, onHeroDrop, allHeroes, onStaminaUpdate }: {
  engineRef: React.MutableRefObject<GameEngine | null>;
  team: HeroData[];
  onLeave: () => void;
  onClaim: (bcoin: number) => void;
  onHeroDrop: (heroes: HeroData[]) => void;
  allHeroes: HeroData[];
  onStaminaUpdate: (staminaMap: Map<string, number>) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef(new GameRenderer());
  const animRef = useRef(0);

  const [hudData, setHudData] = useState({
    bcoin: 0, chests: 0, totalChests: 0, blocks: 0, totalBlocks: 0,
    time: 0, complete: false, mapNumber: 1,
    heroes: [] as Array<{ id: string; name: string; stamina: number; maxStamina: number; state: string; rarity: Rarity; headType: HeadType }>,
  });

  const [showMapComplete, setShowMapComplete] = useState(false);
  const [lastMapBcoin, setLastMapBcoin] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [unclaimedBcoin, setUnclaimedBcoin] = useState(0);
  const bcoinBeforeMapRef = useRef(0);
  const [swapHeroId, setSwapHeroId] = useState<string | null>(null);
  const completionHandledRef = useRef(false);

  // Flying coins animation state
  const [flyingCoins, setFlyingCoins] = useState<Array<{ id: number; amount: number }>>([]);
  const prevBcoinRef = useRef(0);
  const coinIdRef = useRef(0);
  const [chestPulse, setChestPulse] = useState(false);

  const teamRef = useRef(team);
  teamRef.current = team;
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine(teamRef.current);
    }
  }, [engineRef]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let hudTimer = 0;

    const loop = (time: number) => {
      const dt = lastTime === 0 ? 0.016 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      engine.update(dt);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rendererRef.current.draw(ctx, engine.state, canvas.width, canvas.height);
      hudTimer += dt;
      if (hudTimer > 0.15) {
        hudTimer = 0;
        const state = engine.state;
        setHudData({
          bcoin: state.bcoinCollected, chests: state.chestsOpened, totalChests: state.totalChests,
          blocks: state.blocksDestroyed, totalBlocks: state.totalBlocks, time: state.gameTime,
          complete: state.complete, mapNumber: state.mapNumber,
          heroes: state.heroes.map(h => ({ id: h.id, name: h.name, stamina: h.stamina, maxStamina: h.maxStamina, state: h.state, rarity: h.rarity, headType: h.headType })),
        });
        setUnclaimedBcoin(state.bcoinCollected);
        // Track BCOIN changes for flying coin animation
        const bcoinDelta = state.bcoinCollected - prevBcoinRef.current;
        if (bcoinDelta > 0) {
          prevBcoinRef.current = state.bcoinCollected;
          const newId = ++coinIdRef.current;
          setFlyingCoins(prev => [...prev, { id: newId, amount: bcoinDelta }]);
          setChestPulse(true);
          setTimeout(() => setChestPulse(false), 400);
          setTimeout(() => {
            setFlyingCoins(prev => prev.filter(c => c.id !== newId));
          }, 1200);
        } else if (bcoinDelta < 0) {
          prevBcoinRef.current = state.bcoinCollected;
        }
        const brokenDrops = state.heroDrops.filter(d => d.collected);
        if (brokenDrops.length > 0 && engineRef.current) {
          const droppedHeroes = engineRef.current.collectHeroDrops();
          if (droppedHeroes.length > 0) onHeroDrop(droppedHeroes);
        }
        if (state.complete && !completionHandledRef.current) {
          completionHandledRef.current = true;
          setLastMapBcoin(state.bcoinCollected - bcoinBeforeMapRef.current);
          setShowMapComplete(true);
        }
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [canvasSize, engineRef, onHeroDrop]);

  useEffect(() => {
    if (showMapComplete) {
      const timer = setTimeout(() => {
        setShowMapComplete(false);
        completionHandledRef.current = false;
        if (engineRef.current) {
          engineRef.current.generateNewMap();
          bcoinBeforeMapRef.current = engineRef.current.state.bcoinCollected;
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showMapComplete, engineRef]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = hudData.totalBlocks > 0 ? ((hudData.blocks + hudData.chests) / (hudData.totalBlocks + hudData.totalChests)) * 100 : 0;

  const handleClaim = () => {
    if (!engineRef.current) return;
    const amount = engineRef.current.state.bcoinCollected;
    if (amount < 50) return;
    onClaim(amount);
    engineRef.current.state.bcoinCollected = 0;
    bcoinBeforeMapRef.current = 0;
    setUnclaimedBcoin(0);
    setHudData(prev => ({ ...prev, bcoin: 0 }));
  };

  const getBenchHeroes = () => allHeroes.filter(h =>
    !engineRef.current?.state.heroes.some(ah => ah.id === h.id) &&
    h.currentStamina > h.maxStamina * 0.45
  );

  const handleSwap = (newHeroId: string) => {
    if (!engineRef.current || !swapHeroId) return;
    const staminaMap = engineRef.current.getHeroStaminaMap();
    onStaminaUpdate(staminaMap);
    engineRef.current.removeHero(swapHeroId);
    const newHero = allHeroes.find(h => h.id === newHeroId);
    if (newHero) engineRef.current.addHero(newHero);
    setSwapHeroId(null);
  };

  const handleGoHome = () => {
    onLeave();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top HUD - LARGE FONTS */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/60 rounded-full px-3 py-1 border border-yellow-500/20">
            <HudChestIcon size={26} pulse={chestPulse} />
            <BcoinIcon size={20} />
            <span className="text-yellow-400 font-black text-lg">{hudData.bcoin}</span>
          </div>
          <div className="text-sm text-gray-400">
            📦 {hudData.chests}/{hudData.totalChests}
          </div>
          <div className="w-20 h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </div>
        <div className="text-lg font-bold">
          🗺️ <span className="text-blue-400">{hudData.mapNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            ⏱️ {formatTime(hudData.time)}
          </div>
          {unclaimedBcoin >= 50 && (
            <button onClick={handleClaim} className="text-sm px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-full font-bold animate-pulse shadow-lg shadow-yellow-500/30">
              💰 Coletar ({unclaimedBcoin})
            </button>
          )}
          <button onClick={handleGoHome} className="text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-full">🏠 Home</button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        <div ref={containerRef} className="flex-1 relative">
          <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} className="w-full h-full" />
          {showMapComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center animate-bounce">
                <div className="text-7xl">🏆</div>
                <p className="text-yellow-400 font-black text-3xl mt-3">Mapa {hudData.mapNumber} Completo!</p>
                <p className="text-yellow-300 text-xl">+{lastMapBcoin} 🪙 BCOIN</p>
                <p className="text-gray-400 text-base mt-2">Próximo mapa em 3s...</p>
              </div>
            </div>
          )}
        </div>

        {/* Side panel - Desktop */}
        <div className="hidden lg:flex flex-col w-64 bg-gray-900/80 border-l border-gray-800 p-3 gap-2 overflow-y-auto">
          <div className="text-base font-bold text-center mb-1">
            ⚔️ Time ({hudData.heroes.length})
          </div>
          {hudData.heroes.map((hero) => (
            <HeroStatusMini key={hero.id} hero={hero} onSwap={setSwapHeroId} />
          ))}
          <div className="mt-auto text-sm text-gray-600 text-center pt-2 border-t border-gray-800">
            Modo automático
          </div>
        </div>
      </div>

      {/* Bottom bar - Mobile hero status */}
      <div className="lg:hidden flex gap-2 px-3 py-2 bg-gray-900/90 border-t border-gray-800 overflow-x-auto scrollbar-hide shrink-0">
        {hudData.heroes.map((hero) => (
          <div key={hero.id} className="flex flex-col items-center shrink-0" onClick={() => hero.stamina / hero.maxStamina < 0.45 && setSwapHeroId(hero.id)}>
            <span className="text-2xl"><HeadIcon headType={hero.headType} size="text-2xl" /></span>
            <div className="w-10 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: `${Math.max(0, (hero.stamina / hero.maxStamina) * 100)}%`,
                backgroundColor: hero.stamina / hero.maxStamina > 0.5 ? '#4CAF50' : hero.stamina / hero.maxStamina > 0.25 ? '#FF9800' : '#F44336',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Flying coins animation overlay */}
      {flyingCoins.map(coin => (
        <div key={coin.id} className="fixed pointer-events-none z-[100]"
          style={{
            left: '50%',
            top: '55%',
            animation: 'flyCoinToChest 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}>
          <div className="flex items-center gap-1 bg-yellow-900/70 rounded-full px-2.5 py-1 border border-yellow-400/60 shadow-lg shadow-yellow-500/30"
            style={{ transform: 'translate(-50%, -50%)' }}>
            <span className="text-yellow-300 text-sm">🪙</span>
            <span className="text-yellow-300 text-sm font-black">+{coin.amount}</span>
          </div>
        </div>
      ))}

      {/* Swap Modal */}
      {swapHeroId && hudData.heroes.find(h => h.id === swapHeroId) && (
        <SwapHeroModal
          activeHero={hudData.heroes.find(h => h.id === swapHeroId)!}
          benchHeroes={getBenchHeroes()}
          onSwap={handleSwap}
          onClose={() => setSwapHeroId(null)}
        />
      )}
    </div>
  );
}

// ─── Swap Hero Modal ───
function SwapHeroModal({ activeHero, benchHeroes, onSwap, onClose }: {
  activeHero: { id: string; name: string; headType: HeadType; stamina: number; maxStamina: number; rarity: Rarity };
  benchHeroes: HeroData[];
  onSwap: (newHeroId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl p-4 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-3">
          <h3 className="text-white font-bold text-lg">Trocar Herói</h3>
          <p className="text-gray-400 text-sm">Substituir {activeHero.name} (Stamina: {Math.round(activeHero.stamina)}/{activeHero.maxStamina})</p>
        </div>
        <div className="space-y-2">
          {benchHeroes.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">Nenhum herói disponível com stamina acima de 45%</p>
          )}
          {benchHeroes.map(h => {
            const hc = RARITY_CONFIG[h.rarity];
            const staminaPct = h.currentStamina / h.maxStamina;
            return (
              <button key={h.id} onClick={() => onSwap(h.id)}
                className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-gray-700">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: hc.colors.primary }}>
                  <HeadIcon headType={h.headType} size="text-lg" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm">{h.name}</p>
                  <p className="text-xs" style={{ color: hc.colors.primary }}>{hc.label}</p>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${staminaPct * 100}%` }} />
                  </div>
                </div>
                <span className="text-green-400 text-sm font-bold">{Math.round(staminaPct * 100)}%</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
type Screen = 'collection' | 'teamSelect' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('collection');
  const [player, setPlayer] = useState(() => ({
    bcoin: STARTING_BCOIN,
    heroes: generateStartingTeam(),
  }));
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [crateResult, setCrateResult] = useState<{ hero: HeroData; crateType: CrateType } | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const handleBuyCrate = useCallback((type: CrateType) => {
    const config = CRATES[type];
    if (player.bcoin < config.price) return;
    const hero = rollCrate(type);
    setPlayer(prev => ({ ...prev, bcoin: prev.bcoin - config.price }));
    setCrateResult({ hero, crateType: type });
  }, [player.bcoin]);

  const handleCloseCrate = useCallback(() => {
    if (crateResult) {
      setPlayer(prev => ({ ...prev, heroes: [...prev.heroes, crateResult.hero] }));
    }
    setCrateResult(null);
  }, [crateResult]);

  const handleStartHunt = useCallback(() => {
    engineRef.current = null;
    setSelectedTeamIds(player.heroes.map(h => h.id).slice(0, MAX_TEAM_SIZE));
    setScreen('teamSelect');
  }, [player.heroes]);

  const handleResumeGame = useCallback(() => {
    setScreen('game');
  }, []);

  const handleToggleHero = useCallback((id: string) => {
    setSelectedTeamIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      return [...prev, id];
    });
  }, []);

  const handleStartGame = useCallback(() => {
    if (selectedTeamIds.length > 0) {
      if (engineRef.current) {
        const staminaMap = engineRef.current.getHeroStaminaMap();
        setPlayer(prev => ({
          ...prev,
          heroes: prev.heroes.map(h => ({
            ...h,
            currentStamina: staminaMap.get(h.id) ?? h.currentStamina,
          })),
        }));
      }
      engineRef.current = null;
      setScreen('game');
    }
  }, [selectedTeamIds, engineRef]);

  const handleClaimFromGame = useCallback((bcoin: number) => {
    setPlayer(prev => ({ ...prev, bcoin: prev.bcoin + bcoin }));
  }, []);

  const handleHeroDrop = useCallback((heroes: HeroData[]) => {
    setPlayer(prev => ({ ...prev, heroes: [...prev.heroes, ...heroes] }));
  }, []);

  const handleStaminaUpdate = useCallback((staminaMap: Map<string, number>) => {
    setPlayer(prev => ({
      ...prev,
      heroes: prev.heroes.map(h => ({
        ...h,
        currentStamina: staminaMap.get(h.id) ?? h.currentStamina,
      })),
    }));
  }, []);

  const handleLeaveGame = useCallback(() => {
    if (engineRef.current) {
      const staminaMap = engineRef.current.getHeroStaminaMap();
      setPlayer(prev => ({
        ...prev,
        heroes: prev.heroes.map(h => ({
          ...h,
          currentStamina: staminaMap.get(h.id) ?? h.currentStamina,
        })),
      }));
    }
    setScreen('collection');
  }, [engineRef]);

  const handleBackToCollection = useCallback(() => setScreen('collection'), []);

  // Bench heroes recover stamina faster
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => {
        const activeIds = new Set(engineRef.current?.state.heroes.map(h => h.id) ?? []);
        return {
          ...prev,
          heroes: prev.heroes.map(h => {
            if (!activeIds.has(h.id) && h.currentStamina < h.maxStamina) {
              return { ...h, currentStamina: Math.min(h.maxStamina, h.currentStamina + Math.ceil(h.maxStamina * 0.015) + 1) };
            }
            return h;
          }),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [engineRef]);

  const selectedTeam = player.heroes.filter(h => selectedTeamIds.includes(h.id));
  const hasSavedGame = engineRef.current !== null;

  if (screen === 'game' && (selectedTeam.length > 0 || engineRef.current)) {
    const teamToUse = engineRef.current ? engineRef.current.state.heroes.map(h => ({ ...h })) : selectedTeam;
    return (
      <GameScreen
        engineRef={engineRef}
        team={teamToUse}
        onLeave={handleLeaveGame}
        onClaim={handleClaimFromGame}
        onHeroDrop={handleHeroDrop}
        allHeroes={player.heroes}
        onStaminaUpdate={handleStaminaUpdate}
      />
    );
  }

  if (screen === 'teamSelect') {
    return (
      <TeamSelectScreen
        heroes={player.heroes}
        selectedIds={selectedTeamIds}
        onToggle={handleToggleHero}
        onStart={handleStartGame}
        onBack={handleBackToCollection}
      />
    );
  }

  return (
    <>
      <CollectionScreen
        bcoin={player.bcoin}
        heroes={player.heroes}
        hasSavedGame={hasSavedGame}
        onBuyCrate={handleBuyCrate}
        onStartHunt={handleStartHunt}
        onResumeGame={handleResumeGame}
      />
      {crateResult && <CrateOpenModal hero={crateResult.hero} crateType={crateResult.crateType} onClose={handleCloseCrate} />}
    </>
  );
}
