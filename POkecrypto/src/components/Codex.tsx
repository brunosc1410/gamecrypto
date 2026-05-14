import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ALL_PETS, ELEMENT_EMOJIS, RARITY_COLORS } from '../data/pets';
import PetSprite from './PetSprite';
import { Pet, PetElement } from '../types/game';

const ELEMS: { key: PetElement | 'all'; emoji: string }[] = [
  { key: 'all', emoji: '📖' },
  { key: 'fire', emoji: '🔥' },
  { key: 'water', emoji: '💧' },
  { key: 'grass', emoji: '🌿' },
  { key: 'electric', emoji: '⚡' },
  { key: 'dark', emoji: '🌑' },
  { key: 'ice', emoji: '❄️' },
];

export default function Codex() {
  const { setScreen, seenPets, pets } = useGameStore();
  const [filter, setFilter] = useState<PetElement | 'all'>('all');
  const [sel, setSel] = useState<string | null>(null);

  const ownedNames = new Set(pets.map(p => p.name));
  const seenSet = new Set(seenPets);
  const filtered = filter === 'all' ? ALL_PETS : ALL_PETS.filter(p => p.element === filter);
  const totalOwned = new Set(pets.map(p => p.name)).size;
  const entry = sel ? ALL_PETS.find(p => p.name === sel) : null;
  const isSeen = sel ? seenSet.has(sel) : false;
  const isOwned = sel ? ownedNames.has(sel) : false;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <style>{`.cdx-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#f87171', fontWeight: 700, fontSize: 17 }}>📕 Codex</span>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{totalOwned}/{ALL_PETS.length}</p>
          <p style={{ color: '#6b7280', fontSize: 10 }}>{seenPets.length} vistos</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '12px 28px', background: 'rgba(17,17,40,0.5)', borderBottom: '1px solid rgba(37,37,80,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#9ca3af', fontSize: 11, flexShrink: 0 }}>Progresso</span>
          <div style={{ flex: 1, height: 10, background: '#1f2937', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg,#dc2626,#f87171)', width: `${(totalOwned / ALL_PETS.length) * 100}%` }} />
          </div>
          <span style={{ color: '#f87171', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{Math.round((totalOwned / ALL_PETS.length) * 100)}%</span>
        </div>
      </div>

      {/* Filters — row of small buttons, NO horizontal scroll */}
      <div style={{ padding: '10px 24px', display: 'flex', justifyContent: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
        {ELEMS.map(el => (
          <button key={el.key} onClick={() => setFilter(el.key)} style={{
            padding: '7px 10px', borderRadius: 8, fontSize: 16, cursor: 'pointer',
            background: filter === el.key ? 'rgba(185,28,28,0.3)' : '#111128',
            border: filter === el.key ? '2px solid rgba(239,68,68,0.5)' : '1px solid #252550',
            lineHeight: 1,
          }} className="active:scale-90 transition-transform">
            {el.emoji}
          </button>
        ))}
      </div>

      {/* Grid — hidden scrollbar, drag to scroll */}
      <div className="cdx-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div style={{ padding: '8px 24px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {filtered.map((e, i) => {
              const seen = seenSet.has(e.name);
              const owned = ownedNames.has(e.name);
              const idx = ALL_PETS.indexOf(e) + 1;
              const isSel = sel === e.name;

              return (
                <button key={`${e.name}-${i}`} onClick={() => setSel(e.name)} style={{
                  position: 'relative', borderRadius: 10, padding: 6,
                  border: isSel ? '2px solid rgba(248,113,113,0.5)' : owned ? '2px solid rgba(34,197,94,0.2)' : '2px solid rgba(255,255,255,0.04)',
                  background: isSel ? 'rgba(127,29,29,0.12)' : owned ? 'rgba(20,83,45,0.08)' : 'rgba(255,255,255,0.015)',
                  cursor: 'pointer', textAlign: 'left' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                }} className="active:scale-95 transition-transform">
                  <span style={{ position: 'absolute', top: 3, left: 5, fontSize: 6, fontWeight: 700, color: '#4b5563' }}>#{String(idx).padStart(3, '0')}</span>
                  {owned && <span style={{ position: 'absolute', top: 2, right: 4, color: '#22c55e', fontSize: 9, fontWeight: 700 }}>✓</span>}

                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                    {seen || owned ? (
                      <div style={{ width: 32, height: 32, filter: !owned ? 'grayscale(0.7) brightness(0.5)' : undefined }}>
                        <PetSprite pet={{ ...e, id: 'cx' } as Pet} size={32} animate={owned} showParticles={false} />
                      </div>
                    ) : (
                      <span style={{ fontSize: 14, opacity: 0.1 }}>❓</span>
                    )}
                  </div>

                  <p style={{ textAlign: 'center', fontSize: 6, fontWeight: 700, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', color: owned ? 'white' : seen ? '#9ca3af' : '#374151' }}>
                    {seen || owned ? e.name : '???'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel — vertical layout, well spaced */}
      {entry && (
        <div style={{ flexShrink: 0, background: '#111128', borderTop: '1px solid #252550', padding: '20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            {/* Sprite */}
            <div style={{ flexShrink: 0 }}>
              {isSeen || isOwned ? (
                <div style={{
                  width: 72, height: 72,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.03)', borderRadius: 14,
                  filter: !isOwned ? 'grayscale(0.7) brightness(0.5)' : undefined,
                }}>
                  <PetSprite pet={{ ...entry, id: 'd' } as Pet} size={56} animate={isOwned} showParticles={false} />
                </div>
              ) : (
                <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 14 }}>
                  <span style={{ fontSize: 28, opacity: 0.1 }}>❓</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name + element */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{isSeen || isOwned ? entry.name : '???'}</span>
                <span style={{ fontSize: 18 }}>{ELEMENT_EMOJIS[entry.element]}</span>
              </div>

              {(isSeen || isOwned) ? (
                <>
                  {/* Rarity + status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 8,
                      color: RARITY_COLORS[entry.rarity],
                      background: RARITY_COLORS[entry.rarity] + '18',
                      border: `1px solid ${RARITY_COLORS[entry.rarity]}30`,
                    }}>{entry.rarity.toUpperCase()}</span>
                    {isOwned && <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700 }}>✓ Capturado</span>}
                    {isSeen && !isOwned && <span style={{ color: '#9ca3af', fontSize: 11 }}>👁 Visto</span>}
                  </div>

                  {/* Stats — 2x2 grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
                    {[
                      { l: 'HP', v: entry.stats.maxHp, c: '#f87171', e: '❤️' },
                      { l: 'ATK', v: entry.stats.attack, c: '#fb923c', e: '⚔️' },
                      { l: 'DEF', v: entry.stats.defense, c: '#60a5fa', e: '🛡️' },
                      { l: 'SPD', v: entry.stats.speed, c: '#facc15', e: '💨' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '6px 10px',
                      }}>
                        <span style={{ fontSize: 12 }}>{s.e}</span>
                        <span style={{ color: '#9ca3af', fontSize: 10, fontWeight: 600 }}>{s.l}</span>
                        <span style={{ color: s.c, fontSize: 12, fontWeight: 700, marginLeft: 'auto' }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>Explore os mapas para encontrar!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
