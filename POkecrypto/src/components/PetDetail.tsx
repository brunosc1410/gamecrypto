import { useState } from 'react';
import { Pet } from '../types/game';
import { ELEMENT_EMOJIS, RARITY_COLORS } from '../data/pets';
import { useGameStore } from '../store/gameStore';
import PetSprite from './PetSprite';

interface Props {
  pet: Pet;
  onBack: () => void;
}

export default function PetDetail({ pet, onBack }: Props) {
  const { upgradeStat, coins } = useGameStore();
  const [tab, setTab] = useState<'stats' | 'info'>('stats');
  const cost = 50;
  const expPct = (pet.stats.exp / pet.stats.expToNext) * 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={onBack} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{pet.name}</span>
        <span style={{ color: '#6b7280', fontSize: 12 }}>Lv.{pet.stats.level}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        {/* Pet display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 120, height: 120 }}>
            <PetSprite pet={pet} size={120} animate showParticles />
          </div>
        </div>

        {/* Info card */}
        <div style={{ background: '#12122a', borderRadius: 18, padding: 20, border: '1px solid #2a2a5a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>{pet.name}</h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ color: pet.colors.primary, fontSize: 14 }}>{ELEMENT_EMOJIS[pet.element]} {pet.element}</span>
                <span style={{ color: RARITY_COLORS[pet.rarity], fontSize: 14 }}>· {pet.rarity}</span>
              </div>
              <p style={{ color: '#facc15', fontWeight: 700, fontSize: 16, marginTop: 10 }}>Nível {pet.stats.level}</p>
              <div style={{ height: 10, background: '#1f2937', borderRadius: 9999, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 9999, background: '#60a5fa', width: `${expPct}%`, transition: 'width 0.3s' }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>{pet.stats.exp}/{pet.stats.expToNext} EXP · {pet.wins}W/{pet.losses}L</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginTop: 16 }}>
            {(['stats', 'info'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '10px 0', cursor: 'pointer', border: 'none',
                  background: tab === t ? '#12122a' : '#0a0a1a',
                  color: tab === t ? '#facc15' : '#6b7280',
                  fontWeight: 700, fontSize: 12,
                  borderTop: tab === t ? '2px solid #facc15' : '2px solid transparent',
                  borderRadius: t === 'stats' ? '12px 0 0 0' : '0 12px 0 0',
                }}
              >{t === 'stats' ? '📊 Stats' : 'ℹ️ Info'}</button>
            ))}
          </div>

          <div style={{ background: '#12122a', borderRadius: '0 0 12px 12px', padding: 20, border: '1px solid #2a2a5a', borderTop: 'none' }}>
            {tab === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#facc15', fontSize: 14, fontWeight: 600 }}>Upgrade: 💰{cost} · Saldo: 💰{coins}</p>
                {[
                  { k: 'hp' as const, l: 'HP', v: pet.stats.maxHp, c: '#22c55e', e: '❤️' },
                  { k: 'attack' as const, l: 'Ataque', v: pet.stats.attack, c: '#ef4444', e: '⚔️' },
                  { k: 'defense' as const, l: 'Defesa', v: pet.stats.defense, c: '#3b82f6', e: '🛡️' },
                  { k: 'speed' as const, l: 'Velocidade', v: pet.stats.speed, c: '#eab308', e: '💨' },
                ].map((s) => (
                  <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#d1d5db', fontSize: 14, width: 92, flexShrink: 0 }}>{s.e} {s.l}</span>
                    <div style={{ flex: 1, height: 24, background: '#1f2937', borderRadius: 9999, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 9999, background: s.c, width: `${Math.min(100, (s.v / 200) * 100)}%`, transition: 'width 0.3s' }} />
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>{s.v}</span>
                    </div>
                    <button
                      onClick={() => upgradeStat(pet.id, s.k)}
                      disabled={coins < cost}
                      className="active:scale-90 transition-transform"
                      style={{
                        padding: '6px 12px', borderRadius: 8, border: 'none', cursor: coins >= cost ? 'pointer' : 'not-allowed',
                        background: coins >= cost ? '#16a34a' : '#374151', color: 'white', fontSize: 11, fontWeight: 700,
                        opacity: coins >= cost ? 1 : 0.5,
                      }}
                    >+</button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { l: 'Elemento', v: `${ELEMENT_EMOJIS[pet.element]} ${pet.element}` },
                  { l: 'Raridade', v: pet.rarity, c: RARITY_COLORS[pet.rarity] },
                  { l: 'Nível', v: `${pet.stats.level}` },
                  { l: 'Vitórias', v: `${pet.wins}` },
                  { l: 'Derrotas', v: `${pet.losses}` },
                  { l: 'Win Rate', v: pet.wins + pet.losses > 0 ? `${Math.round((pet.wins / (pet.wins + pet.losses)) * 100)}%` : 'N/A' },
                  { l: 'NFT', v: pet.isNFT ? 'Sim ✅' : 'Não' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: 8 }}>
                    <span style={{ color: '#9ca3af', fontSize: 14 }}>{r.l}</span>
                    <span style={{ color: r.c || '#e5e7eb', fontSize: 14, fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
