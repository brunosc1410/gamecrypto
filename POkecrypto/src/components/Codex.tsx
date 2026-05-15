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

      {/* Filters */}
      <div style={{ padding: '10px 24px', display: 'flex', justifyContent: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
        {ELEMS.map(el => (
          <button key={el.key} onClick={() => { setSel(null); setFilter(el.key); }} style={{
            padding: '7px 10px', borderRadius: 8, fontSize: 16, cursor: 'pointer',
            background: filter === el.key ? 'rgba(185,28,28,0.3)' : '#111128',
            border: filter === el.key ? '2px solid rgba(239,68,68,0.5)' : '1px solid #252550',
            lineHeight: 1,
          }} className="active:scale-90 transition-transform">
            {el.emoji}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '12px 24px 28px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {filtered.map((e, i) => {
              const seen = seenSet.has(e.name);
              const owned = ownedNames.has(e.name);
              const idx = ALL_PETS.indexOf(e) + 1;
              const isSel2 = sel === e.name;

              return (
                <button key={`${e.name}-${i}`} onClick={() => setSel(e.name)} style={{
                  position: 'relative', borderRadius: 14, padding: '10px 8px 8px 8px',
                  border: isSel2 ? '2px solid rgba(248,113,113,0.5)' : owned ? '2px solid rgba(34,197,94,0.2)' : '2px solid rgba(255,255,255,0.06)',
                  background: isSel2 ? 'rgba(127,29,29,0.15)' : owned ? 'rgba(20,83,45,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                }} className="active:scale-95 transition-transform">
                  <span style={{ position: 'absolute', top: 5, left: 7, fontSize: 8, fontWeight: 700, color: '#6b7280' }}>#{String(idx).padStart(3, '0')}</span>
                  {owned && <span style={{ position: 'absolute', top: 4, right: 6, color: '#22c55e', fontSize: 12, fontWeight: 700 }}>✓</span>}
                  <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                    {seen || owned ? (
                      <div style={{ width: 48, height: 48, filter: !owned ? 'grayscale(0.7) brightness(0.5)' : undefined }}>
                        <PetSprite pet={{ ...e, id: 'cx' } as Pet} size={48} animate={owned} showParticles={false} />
                      </div>
                    ) : (
                      <span style={{ fontSize: 28, opacity: 0.3 }}>❓</span>
                    )}
                  </div>
                  <span style={{ fontSize: 8, color: seen || owned ? '#d1d5db' : '#4b5563', marginTop: 4, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                    {seen || owned ? e.name : '???'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {entry && (
        <div style={{
          flexShrink: 0, padding: '16px 24px', background: '#111128', borderTop: '1px solid #252550',
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <div style={{ width: 60, height: 60, flexShrink: 0 }}>
            {isSeen || isOwned ? (
              <PetSprite pet={{ ...entry, id: 'detail' } as Pet} size={60} animate={isOwned} showParticles={false} />
            ) : (
              <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 36, opacity: 0.3 }}>❓</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
              {isSeen || isOwned ? entry.name : '???'} {ELEMENT_EMOJIS[entry.element]}
            </p>
            {(isSeen || isOwned) ? (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: RARITY_COLORS[entry.rarity], fontSize: 10, fontWeight: 700 }}>{entry.rarity.toUpperCase()}</span>
                  {isOwned && <span style={{ color: '#22c55e', fontSize: 9 }}>✓ Capturado</span>}
                  {isSeen && !isOwned && <span style={{ color: '#6b7280', fontSize: 9 }}>👁 Visto</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 6 }}>
                  {[
                    { l: 'HP', v: entry.stats.maxHp, c: '#f87171', e: '❤️' },
                    { l: 'ATK', v: entry.stats.attack, c: '#fb923c', e: '⚔️' },
                    { l: 'DEF', v: entry.stats.defense, c: '#60a5fa', e: '🛡️' },
                    { l: 'SPD', v: entry.stats.speed, c: '#facc15', e: '💨' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10 }}>{s.e}</span>
                      <span style={{ color: '#6b7280', fontSize: 9 }}>{s.l}</span>
                      <span style={{ color: s.c, fontSize: 10, fontWeight: 700 }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>Explore os mapas para encontrar!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
