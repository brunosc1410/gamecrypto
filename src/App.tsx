import { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { GameRenderer } from './game/renderer';
import {
  generateStartingTeam, rollCrate, RARITY_CONFIG,
  CRATES, MAX_TEAM_SIZE, STARTING_BCOIN,
  HEAD_EMOJIS, HEAD_LABELS,
  type HeroData, type Rarity, type CrateType, type HeadType,
} from './game/types';

// ─── Stat Bar ───
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const ratio = Math.min(value / max, 1);
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-14 text-gray-300 text-right text-xs">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${ratio * 100}%`, backgroundColor: color }} />
      </div>
      <span className="w-6 text-gray-400 font-mono text-xs">{value}</span>
    </div>
  );
}

// ─── Animated BCOIN Coin ───
function AnimatedCoin({ size = 48 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-yellow-600 shadow-lg shadow-yellow-900/30"
        style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)' }} />
      {/* Inner circle */}
      <div className="absolute rounded-full"
        style={{
          inset: size * 0.12,
          background: 'linear-gradient(135deg, #FFE066, #FFD700, #CC9900)',
        }} />
      {/* Animated B letter */}
      <span className="relative z-10 font-black text-yellow-900 select-none"
        style={{
          fontSize: size * 0.4,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          animation: 'coinPulse 2s ease-in-out infinite',
        }}>
        B
      </span>
      {/* Shine */}
      <div className="absolute rounded-full bg-white/20"
        style={{
          width: size * 0.3, height: size * 0.2,
          top: size * 0.12, left: size * 0.15,
          transform: 'rotate(-30deg)',
        }} />
    </div>
  );
}

function HeroEmoji({ headType, size = 'text-2xl' }: { headType: HeadType; size?: string }) {
  return <span className={size}>{HEAD_EMOJIS[headType]}</span>;
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const config = RARITY_CONFIG[rarity];
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: config.colors.helmet, backgroundColor: `${config.colors.primary}33`, border: `1px solid ${config.colors.primary}66` }}>
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
    <div onClick={showToggle ? onToggle : undefined}
      className={`relative border-2 ${borderColors[hero.rarity]} ${selected ? 'ring-2 ring-green-400 ring-offset-1 ring-offset-gray-900 bg-green-900/20' : ''} ${showToggle ? 'cursor-pointer' : ''} rounded-xl bg-gradient-to-b ${bgColors[hero.rarity]} p-2 sm:p-2.5 w-[44vw] sm:w-40 max-w-[180px] transition-all duration-200 hover:shadow-lg hover:shadow-black/30 active:scale-95 ${hero.rarity === 'legendary' ? 'animate-pulse' : ''}`}
      style={hero.rarity === 'legendary' ? { boxShadow: '0 0 20px rgba(251,191,36,0.15)' } : hero.rarity === 'epic' ? { boxShadow: '0 0 15px rgba(234,88,12,0.1)' } : undefined}
    >
      {selected && <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">✓</div>}
      <div className="relative z-10">
        <div className="flex justify-center mb-1">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg transition-transform"
            style={{ background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`, boxShadow: hero.rarity === 'legendary' ? '0 0 15px rgba(251,191,36,0.4)' : hero.rarity === 'epic' ? '0 0 10px rgba(234,88,12,0.3)' : 'none' }}>
            <HeroEmoji headType={hero.headType} size="text-xl" />
          </div>
        </div>
        <h3 className="text-center text-white font-bold text-sm truncate">{hero.name}</h3>
        <div className="text-center text-gray-400 text-[10px]">{HEAD_LABELS[hero.headType]}</div>
        <div className="flex justify-center gap-0.5 my-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={`text-[10px] ${i < config.stars ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
          ))}
        </div>
        <div className="flex justify-center mb-1.5"><RarityBadge rarity={hero.rarity} /></div>
        <div className="space-y-0.5">
          <StatBar label="Poder" value={hero.power} max={12} color="#EF4444" />
          <StatBar label="Stamina" value={hero.maxStamina} max={360} color="#22C55E" />
          <StatBar label="Veloc." value={Math.round(hero.speed * 10)} max={45} color="#3B82F6" />
          <StatBar label="Bombas" value={hero.bombNum} max={4} color="#F59E0B" />
          <StatBar label="Alcance" value={hero.bombRange} max={8} color="#8B5CF6" />
        </div>
        {hero.abilities.length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-gray-700/50">
            {hero.abilities.map((a, i) => (
              <div key={i} className="text-[9px] text-cyan-400 flex items-center gap-0.5"><span>✦</span> {a}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Crate Open Modal ───
function CrateOpenModal({ hero, crateType, onClose }: { hero: HeroData; crateType: CrateType; onClose: () => void }) {
  const [phase, setPhase] = useState<'shaking' | 'revealing' | 'showing'>('shaking');
  const crateConfig = CRATES[crateType];
  const config = RARITY_CONFIG[hero.rarity];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 1200);
    const t2 = setTimeout(() => setPhase('showing'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-2xl">
        {phase === 'shaking' && (
          <div className="flex flex-col items-center py-12">
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-6xl"
              style={{ background: `linear-gradient(135deg, ${crateConfig.color}, ${crateConfig.color}88)`, animation: 'bounce 0.4s infinite alternate' }}>
              📦
            </div>
            <p className="text-gray-300 mt-4 animate-pulse text-lg">Abrindo baú...</p>
          </div>
        )}
        {phase === 'revealing' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl animate-pulse"
              style={{ background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`, boxShadow: `0 0 60px ${config.colors.glow}, 0 0 120px ${config.colors.glow}` }}>
              <HeroEmoji headType={hero.headType} size="text-5xl" />
            </div>
          </div>
        )}
        {phase === 'showing' && (
          <div className="flex flex-col items-center">
            <div className="mb-2 text-sm text-gray-400">Você conseguiu:</div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3"
              style={{ background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`, boxShadow: `0 0 30px ${config.colors.glow}` }}>
              <HeroEmoji headType={hero.headType} size="text-4xl" />
            </div>
            <h2 className="text-xl font-black text-white mb-1">{hero.name}</h2>
            <div className="flex justify-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < config.stars ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
              ))}
            </div>
            <RarityBadge rarity={hero.rarity} />
            <div className="w-full mt-4 space-y-1">
              <StatBar label="Poder" value={hero.power} max={12} color="#EF4444" />
              <StatBar label="Stamina" value={hero.maxStamina} max={360} color="#22C55E" />
              <StatBar label="Veloc." value={Math.round(hero.speed * 10)} max={45} color="#3B82F6" />
              <StatBar label="Bombas" value={hero.bombNum} max={4} color="#F59E0B" />
              <StatBar label="Alcance" value={hero.bombRange} max={8} color="#8B5CF6" />
            </div>
            {hero.abilities.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-700 w-full">
                <div className="text-[9px] text-gray-400 font-bold mb-1">HABILIDADES</div>
                {hero.abilities.map((a, i) => <div key={i} className="text-xs text-cyan-400">✦ {a}</div>)}
              </div>
            )}
            <button onClick={onClose}
              className="mt-4 px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg">
              Coletar! ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gacha Capsule Card ───
function CapsuleCard({ config, canAfford, onBuy }: {
  config: typeof CRATES.common; canAfford: boolean; onBuy: () => void;
}) {
  const [hover, setHover] = useState(false);
  const rarityOrder: Rarity[] = ['super_legendary', 'legendary', 'super_epic', 'epic', 'super_rare', 'rare', 'common'];

  return (
    <button
      onClick={canAfford ? onBuy : undefined} disabled={!canAfford}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)} onTouchEnd={() => setHover(false)}
      className={`relative flex flex-col items-center rounded-2xl p-3 transition-all duration-300 snap-center shrink-0 w-[170px] sm:w-auto
        ${canAfford ? 'cursor-pointer active:scale-95' : 'opacity-40 cursor-not-allowed'}
        ${hover && canAfford ? 'scale-105 -translate-y-1 shadow-2xl' : ''}`}
      style={{
        background: `linear-gradient(180deg, ${config.color}40 0%, ${config.color}20 100%)`,
        border: `2px solid ${config.color}${canAfford ? 'cc' : '44'}`,
        boxShadow: hover && canAfford ? `0 8px 32px ${config.color}33` : 'none',
      }}
    >
      {/* Capsule */}
      <div className="relative w-28 h-28 mx-auto mb-2">
        {/* Capsule top (colored) */}
        <div className="absolute inset-0 rounded-t-full rounded-b-[40%] overflow-hidden" style={{ background: `linear-gradient(180deg, ${config.color}, ${config.color}aa)` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
          {/* Shine */}
          <div className="absolute top-2 left-3 w-8 h-4 bg-white/30 rounded-full -rotate-12" />
        </div>
        {/* Capsule bottom (transparent) */}
        <div className="absolute bottom-0 left-1 right-1 h-14 rounded-b-full bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-2 border-t-0 rounded-t-[1px]"
          style={{ borderColor: `${config.color}66` }}>
          {/* Character inside (silhouette) */}
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl opacity-60 grayscale contrast-150" style={{ filter: 'brightness(0.6)' }}>
              {['🐸', '🥷', '🤠', '🧛', '🐺', '🧙', '🐉', '🦊', '🐻', '💀', '🐱', '🐼'][Math.floor(Math.random() * 12)]}
            </span>
          </div>
        </div>
        {/* Divider line */}
        <div className="absolute top-1/2 left-1 right-1 h-[3px]" style={{ backgroundColor: config.color }} />
        {/* Floating animation */}
        <div className="absolute -top-1 -right-1 text-lg" style={{ animation: 'coinPulse 2s ease-in-out infinite' }}>
          ✨
        </div>
      </div>

      {/* Name */}
      <h3 className="text-white font-bold text-sm mb-1">{config.name}</h3>

      {/* Price */}
      <div className="flex items-center justify-center gap-1.5 bg-black/30 rounded-full px-3 py-1 mb-2">
        <AnimatedCoin size={20} />
        <span className="text-yellow-400 font-black text-sm">{config.price}</span>
      </div>

      {/* All rarities with % */}
      <div className="w-full space-y-0.5">
        {rarityOrder.map(r => {
          const pct = config.probabilities[r];
          const rc = RARITY_CONFIG[r];
          return (
            <div key={r} className="flex items-center justify-between gap-1 px-1">
              <div className="flex items-center gap-0.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rc.colors.primary }} />
                <span className="text-[10px] text-gray-300">{rc.label}</span>
              </div>
              <span className={`text-[10px] font-bold ${pct >= 10 ? 'text-yellow-300' : pct > 0 ? 'text-gray-400' : 'text-gray-600'}`}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Buy indicator */}
      {canAfford && (
        <div className="mt-2 w-full py-1.5 rounded-lg text-center text-white font-bold text-xs transition-all"
          style={{ backgroundColor: `${config.color}88` }}>
          Comprar
        </div>
      )}
    </button>
  );
}

// ─── Collection Screen ───
function CollectionScreen({ bcoin, heroes, hasSavedGame, onBuyCrate, onStartHunt, onResumeGame }: {
  bcoin: number; heroes: HeroData[]; hasSavedGame: boolean;
  onBuyCrate: (type: CrateType) => void;
  onStartHunt: () => void;
  onResumeGame: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex flex-col items-center relative overflow-hidden">
      {/* Animated BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              width: `${3 + (i % 6) * 2}px`, height: `${3 + (i % 6) * 2}px`,
              background: ['#FFD700', '#4169E1', '#9333EA', '#EF4444', '#22C55E'][i % 5],
              left: `${(i * 5.3) % 100}%`, top: `${(i * 7.9) % 100}%`,
              opacity: 0.06, animationDelay: `${i * 0.2}s`, animationDuration: `${2 + (i % 4)}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-3 py-4">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-0.5">
          💣 Bomber Heroes
        </h1>
        <p className="text-indigo-300 text-xs sm:text-sm mb-4">Colete heróis e caçe tesouros!</p>

        {/* BCOIN */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border border-yellow-600/40 rounded-2xl px-5 sm:px-8 py-3 flex items-center gap-3 mb-5 shadow-lg shadow-yellow-900/20">
          <AnimatedCoin size={44} />
          <div>
            <div className="text-yellow-400 font-black text-xl sm:text-3xl">{bcoin}</div>
            <div className="text-yellow-600 text-[10px] sm:text-xs font-bold">BCOIN</div>
          </div>
        </div>

        {/* Resume */}
        {hasSavedGame && (
          <button onClick={onResumeGame}
            className="w-full max-w-md mb-4 bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-2 border-green-500/40 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-green-900/30 min-h-[50px]">
            <span className="text-2xl">▶️</span>
            <div className="text-left flex-1">
              <div className="text-green-300 font-black text-sm">Continuar Jogo</div>
              <div className="text-green-500/60 text-[10px]">Mapa e heróis salvos</div>
            </div>
            <span className="text-green-400 text-lg">→</span>
          </button>
        )}

        {/* Gacha Capsules */}
        <div className="w-full mb-5">
          <h2 className="text-white font-bold text-base sm:text-lg mb-2.5 text-center">🏪 Comprar Cápsulas</h2>
          <div className="flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-hide justify-center flex-wrap sm:flex-nowrap">
            {(Object.entries(CRATES) as [CrateType, typeof CRATES.common][]).map(([type, cfg]) => (
              <CapsuleCard key={type} config={cfg} canAfford={bcoin >= cfg.price} onBuy={() => onBuyCrate(type)} />
            ))}
          </div>
        </div>

        {/* Collection */}
        <div className="w-full mb-5">
          <h2 className="text-white font-bold text-base sm:text-lg mb-2 text-center">⚔️ Coleção ({heroes.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {heroes.map(h => <HeroCard key={h.id} hero={h} />)}
          </div>
          {heroes.length === 0 && <p className="text-gray-500 text-center py-6 text-sm">Compre cápsulas para ganhar heróis!</p>}
        </div>

        {/* Start */}
        <button onClick={onStartHunt} disabled={heroes.length === 0}
          className={`w-full max-w-md px-5 py-3.5 rounded-2xl font-black text-base transition-all shadow-xl mb-6 min-h-[50px]
            ${heroes.length > 0
              ? 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white hover:scale-[1.02] shadow-red-900/50 active:scale-95'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
          🏴‍☠️ Nova Caça ao Tesouro!
        </button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex flex-col items-center p-4">
      <h1 className="text-2xl font-black text-white mt-6 mb-2">⚔️ Monte seu Time</h1>
      <p className="text-indigo-300 text-sm mb-4">Selecione até {MAX_TEAM_SIZE} heróis para a caça ao tesouro</p>

      <div className="flex items-center gap-2 mb-4 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
        <div className="flex -space-x-1">
          {Array.from({ length: MAX_TEAM_SIZE }).map((_, i) => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 ${i < selectedIds.length ? 'bg-green-500 border-green-400' : 'bg-gray-700 border-gray-600'}`} />
          ))}
        </div>
        <span className="text-white font-bold text-sm ml-2">{selectedIds.length}/{MAX_TEAM_SIZE}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-5xl">
        {heroes.map(hero => (
          <HeroCard key={hero.id} hero={hero} selected={selectedIds.includes(hero.id)} onToggle={() => onToggle(hero.id)} showToggle />
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all active:scale-95">
          ← Voltar
        </button>
        <button onClick={onStart} disabled={selectedIds.length === 0}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedIds.length > 0 ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white hover:scale-105 active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
          🏴‍☠️ Começar Caça! ({selectedIds.length} heróis)
        </button>
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
    <div className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 border transition-colors ${staminaLow ? 'bg-red-900/30 border-red-700/50' : 'bg-gray-800/80 border-gray-700/50 hover:border-gray-600'}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 shadow-inner"
        style={{ backgroundColor: config.colors.primary }}>
        <HeroEmoji headType={hero.headType} size="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-bold truncate">{hero.name}</span>
          <span className="text-base shrink-0">{stateIcons[hero.state] || '❓'}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200" style={{
              width: `${Math.max(0, ratio * 100)}%`,
              backgroundColor: ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#FF9800' : '#F44336',
            }} />
          </div>
          <span className="text-[10px] text-gray-400 font-mono w-8 text-right">{Math.round(hero.stamina)}</span>
        </div>
      </div>
      {onSwap && staminaLow && (
        <button onClick={() => onSwap(hero.id)}
          className="shrink-0 px-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95 min-w-[44px] min-h-[36px]">
          ⇄
        </button>
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
  const rendererRef = useRef<GameRenderer>(new GameRenderer());
  const animRef = useRef<number>(0);

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

  // Create engine once (team only used for initial creation)
  const teamRef = useRef(team);
  teamRef.current = team;
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine(teamRef.current);
    }
    // NO cleanup here - game loop effect handles its own animation frame
  }, [engineRef]);

  // Resize
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

  // Game loop
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

        // Collect heroes from broken cages
        const brokenDrops = state.heroDrops.filter(d => d.collected);
        if (brokenDrops.length > 0 && engineRef.current) {
          const droppedHeroes = engineRef.current.collectHeroDrops();
          if (droppedHeroes.length > 0) {
            onHeroDrop(droppedHeroes);
          }
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
  }, [canvasSize, engineRef]);

  // Auto-advance
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

  // Swap hero logic
  const getBenchHeroes = () => allHeroes.filter(h =>
    !engineRef.current?.state.heroes.some(ah => ah.id === h.id) &&
    h.currentStamina > h.maxStamina * 0.45
  );

  const handleSwap = (newHeroId: string) => {
    if (!engineRef.current || !swapHeroId) return;
    // Save stamina of hero being removed
    const staminaMap = engineRef.current.getHeroStaminaMap();
    onStaminaUpdate(staminaMap);
    // Do the swap in engine
    engineRef.current.removeHero(swapHeroId);
    const newHero = allHeroes.find(h => h.id === newHeroId);
    if (newHero) {
      engineRef.current.addHero(newHero);
    }
    setSwapHeroId(null);
  };

  const handleGoHome = () => {
    // Engine stays alive in engineRef — just leave
    onLeave();
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top HUD - Mobile friendly */}
      <div className="bg-gray-800 border-b border-gray-700/50 px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between shrink-0 z-10 gap-1">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-yellow-900/30 rounded-lg px-2 sm:px-3 py-1 border border-yellow-700/30">
            <AnimatedCoin size={24} />
            <div>
              <div className="text-yellow-400 font-black text-sm sm:text-base leading-none">{hudData.bcoin}</div>
              <div className="text-yellow-600 text-[8px] sm:text-[10px] font-bold">BCOIN</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-base">📦</span>
            <div>
              <div className="text-white font-bold text-[10px] sm:text-xs leading-none">{hudData.chests}/{hudData.totalChests}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <div className="w-28">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div className="text-gray-400 text-[8px] text-center mt-0.5">{Math.round(progress)}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-indigo-900/40 rounded-lg px-2 py-1 border border-indigo-700/30">
          <span className="text-xs sm:text-sm">🗺️</span>
          <span className="text-indigo-200 font-bold text-[10px] sm:text-xs">{hudData.mapNumber}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-base">⏱️</span>
            <span className="text-white font-bold text-[10px] sm:text-xs font-mono">{formatTime(hudData.time)}</span>
          </div>

          {/* Claim */}
          <button onClick={handleClaim} disabled={unclaimedBcoin < 50}
            className={`flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all min-h-[40px] ${
              unclaimedBcoin >= 50
                ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white shadow-lg shadow-yellow-800/40 active:scale-95'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30'}`}>
            <span>💰</span>
            <span className="hidden sm:inline">{unclaimedBcoin >= 50 ? `+${unclaimedBcoin}` : `${unclaimedBcoin}/50`}</span>
            <span className="sm:hidden">{unclaimedBcoin >= 50 ? `+${unclaimedBcoin}` : `${unclaimedBcoin}`}</span>
          </button>

          {/* Home */}
          <button onClick={handleGoHome}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 bg-gray-700/80 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 min-h-[40px]">
            <span>🏠</span><span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <div ref={containerRef} className="flex-1 relative bg-gray-950">
          <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
            className="block" style={{ imageRendering: 'pixelated' }} />

          {/* Map Complete */}
          {showMapComplete && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-gradient-to-b from-gray-800/95 to-gray-900/95 border-2 border-yellow-500/60 rounded-2xl px-10 py-6 text-center shadow-2xl shadow-yellow-900/30"
                style={{ animation: 'bounce 0.6s ease-in-out infinite alternate' }}>
                <div className="text-4xl mb-2">🏆</div>
                <h2 className="text-2xl font-black text-yellow-400">Mapa {hudData.mapNumber} Completo!</h2>
                <p className="text-yellow-300 font-bold text-xl mt-2">+{lastMapBcoin} 🪙 BCOIN</p>
                <p className="text-gray-400 text-xs mt-2">Próximo mapa em 3s...</p>
              </div>
            </div>
          )}
        </div>

        {/* Side panel - Desktop */}
        <div className="w-52 bg-gradient-to-b from-gray-800/95 to-gray-900/95 border-l border-gray-700/50 p-2 flex-col gap-1.5 overflow-y-auto shrink-0 hidden lg:flex">
          <h3 className="text-white font-bold text-[10px] text-center py-1.5 border-b border-gray-700/50 mb-0.5 bg-gray-800/50 rounded-lg">
            ⚔️ Time ({hudData.heroes.length})
          </h3>
          {hudData.heroes.map((hero, i) => <HeroStatusMini key={i} hero={hero} onSwap={setSwapHeroId} />)}
          <div className="mt-auto pt-2 border-t border-gray-700/50">
            <div className="text-[8px] text-gray-500 text-center">Modo automático</div>
          </div>
        </div>

        {/* Bottom bar - Mobile hero status */}
        <div className="lg:hidden bg-gray-800/95 border-t border-gray-700/50 px-2 py-1.5 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-hide">
          {hudData.heroes.map((hero, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-700/50 rounded-lg px-1.5 py-1 shrink-0">
              <span className="text-sm">{HEAD_EMOJIS[hero.headType]}</span>
              <div className="min-w-[36px] max-w-[48px]">
                <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${Math.max(0, (hero.stamina / hero.maxStamina) * 100)}%`,
                    backgroundColor: hero.stamina / hero.maxStamina > 0.5 ? '#4CAF50' : hero.stamina / hero.maxStamina > 0.25 ? '#FF9800' : '#F44336',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-base">Trocar Herói</h3>
            <p className="text-gray-400 text-xs mt-0.5">Substituir <span className="text-white font-semibold">{activeHero.name}</span> (Stamina: {Math.round(activeHero.stamina)}/{activeHero.maxStamina})</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none p-1">✕</button>
        </div>
        <div className="overflow-y-auto p-3 flex-1 space-y-2">
          {benchHeroes.length === 0 && (
            <p className="text-gray-500 text-center py-6 text-sm">Nenhum herói disponível com stamina acima de 45%</p>
          )}
          {benchHeroes.map(h => {
            const hc = RARITY_CONFIG[h.rarity];
            const staminaPct = h.currentStamina / h.maxStamina;
            return (
              <button key={h.id} onClick={() => onSwap(h.id)}
                className="w-full flex items-center gap-3 bg-gray-700/50 hover:bg-gray-600/60 rounded-xl p-3 transition-all active:scale-[0.98] border border-gray-600/30 hover:border-gray-500/50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: `linear-gradient(135deg, ${hc.colors.primary}, ${hc.colors.secondary})` }}>
                  {HEAD_EMOJIS[h.headType]}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm truncate">{h.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ color: hc.colors.helmet, backgroundColor: `${hc.colors.primary}33` }}>
                      {hc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${staminaPct * 100}%`,
                        backgroundColor: staminaPct > 0.5 ? '#4CAF50' : '#FF9800',
                      }} />
                    </div>
                    <span className="text-xs text-gray-300 font-mono">{Math.round(h.currentStamina)}/{h.maxStamina}</span>
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5">POW {h.power} • SPD {Math.round(h.speed * 10)} • RNG {h.bombRange}</div>
                </div>
                <span className="text-green-400 text-lg shrink-0">⇄</span>
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

interface PlayerState {
  bcoin: number;
  heroes: HeroData[];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('collection');
  const [player, setPlayer] = useState<PlayerState>(() => ({
    bcoin: STARTING_BCOIN,
    heroes: generateStartingTeam(),
  }));
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [crateResult, setCrateResult] = useState<{ hero: HeroData; crateType: CrateType } | null>(null);

  // Shared engine ref — survives screen changes!
  const engineRef = useRef<GameEngine | null>(null);

  const handleBuyCrate = useCallback((type: CrateType) => {
    const config = CRATES[type];
    if (player.bcoin < config.price) return;
    const hero = rollCrate(type);
    // Deduct BCOIN but DON'T add hero yet - wait for reveal
    setPlayer(prev => ({ ...prev, bcoin: prev.bcoin - config.price }));
    setCrateResult({ hero, crateType: type });
  }, [player.bcoin]);

  const handleCloseCrate = useCallback(() => {
    // NOW add the hero to collection after reveal
    if (crateResult) {
      setPlayer(prev => ({ ...prev, heroes: [...prev.heroes, crateResult.hero] }));
    }
    setCrateResult(null);
  }, [crateResult]);

  const handleStartHunt = useCallback(() => {
    // Discard any saved game if starting fresh
    engineRef.current = null;
    setSelectedTeamIds(player.heroes.map(h => h.id).slice(0, MAX_TEAM_SIZE));
    setScreen('teamSelect');
  }, [player.heroes]);

  const handleResumeGame = useCallback(() => {
    // Resume existing game — just go to game screen
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
      // New game — save stamina from old engine first, then discard
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
    // Save stamina from running game back to player heroes
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

  // Bench heroes recover stamina faster (10x normal rate, every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => {
        const activeIds = new Set(engineRef.current?.state.heroes.map(h => h.id) ?? []);
        return {
          ...prev,
          heroes: prev.heroes.map(h => {
            if (!activeIds.has(h.id) && h.currentStamina < h.maxStamina) {
              return { ...h, currentStamina: Math.min(h.maxStamina, h.currentStamina + Math.ceil(h.maxStamina * 0.08) + 5) };
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
    return <GameScreen engineRef={engineRef} team={teamToUse} onLeave={handleLeaveGame} onClaim={handleClaimFromGame} onHeroDrop={handleHeroDrop} allHeroes={player.heroes} onStaminaUpdate={handleStaminaUpdate} />;
  }

  if (screen === 'teamSelect') {
    return (
      <TeamSelectScreen heroes={player.heroes} selectedIds={selectedTeamIds}
        onToggle={handleToggleHero} onStart={handleStartGame} onBack={handleBackToCollection} />
    );
  }

  return (
    <>
      <CollectionScreen bcoin={player.bcoin} heroes={player.heroes} hasSavedGame={hasSavedGame}
        onBuyCrate={handleBuyCrate} onStartHunt={handleStartHunt} onResumeGame={handleResumeGame} />
      {crateResult && <CrateOpenModal hero={crateResult.hero} crateType={crateResult.crateType} onClose={handleCloseCrate} />}
    </>
  );
}
