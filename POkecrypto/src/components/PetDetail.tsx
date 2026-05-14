import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS, RARITY_COLORS } from '../data/pets';
import { Pet } from '../types/game';
import PetSprite from './PetSprite';

interface Props { pet: Pet; onBack: () => void; }

export default function PetDetail({ pet, onBack }: Props) {
  const { upgradeStat, coins, setScreen } = useGameStore();
  const [tab, setTab] = useState<'stats' | 'info'>('stats');
  const cost = 50;
  const bar = (v: number, max = 200) => `${Math.min((v / max) * 100, 100)}%`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '20px 36px 28px 36px' }}>
          <button
            onClick={onBack}
            style={{
              color: '#eab308',
              fontWeight: 700,
              fontSize: 14,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            ← Voltar
          </button>

          {/* Pet card */}
          <div style={{ background: '#12122a', borderRadius: 18, padding: 20, border: '1px solid #2a2a5a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ flexShrink: 0 }}>
                <PetSprite pet={pet} size={90} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>{pet.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ color: pet.colors.primary, fontSize: 14 }}>{ELEMENT_EMOJIS[pet.element]} {pet.element}</span>
                  <span style={{ color: RARITY_COLORS[pet.rarity], fontSize: 14 }}>· {pet.rarity}</span>
                </div>
                <p style={{ color: '#facc15', fontWeight: 700, fontSize: 16, marginTop: 10 }}>Nível {pet.stats.level}</p>
                <div style={{ height: 10, background: '#1f2937', borderRadius: 9999, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#60a5fa', borderRadius: 9999, width: `${(pet.stats.exp / pet.stats.expToNext) * 100}%` }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>{pet.stats.exp}/{pet.stats.expToNext} EXP · {pet.wins}W/{pet.losses}L</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', marginTop: 24, background: '#0a0a1e', borderRadius: '12px 12px 0 0', overflow: 'hidden', border: '1px solid #2a2a5a', borderBottom: 'none' }}>
            {(['stats', 'info'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  fontSize: 14,
                  fontWeight: 700,
                  background: tab === t ? '#12122a' : 'transparent',
                  color: tab === t ? '#facc15' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {t === 'stats' ? '📊 Status' : 'ℹ️ Info'}
              </button>
            ))}
          </div>

          <div style={{ background: '#12122a', borderRadius: '0 0 12px 12px', padding: 20, border: '1px solid #2a2a5a', borderTop: 'none' }}>
            {tab === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#facc15', fontSize: 14, fontWeight: 600 }}>Upgrade: 🪙{cost} · Saldo: 🪙{coins}</p>
                {[
                  { k: 'hp' as const, l: 'HP', v: pet.stats.maxHp, c: '#22c55e', e: '❤️' },
                  { k: 'attack' as const, l: 'Ataque', v: pet.stats.attack, c: '#ef4444', e: '⚔️' },
                  { k: 'defense' as const, l: 'Defesa', v: pet.stats.defense, c: '#3b82f6', e: '🛡️' },
                  { k: 'speed' as const, l: 'Velocidade', v: pet.stats.speed, c: '#eab308', e: '💨' },
                ].map((s) => (
                  <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#d1d5db', fontSize: 14, width: 92, flexShrink: 0 }}>{s.e} {s.l}</span>
                    <div style={{ flex: 1, height: 24, background: '#1f2937', borderRadius: 9999, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 9999, width: bar(s.v), backgroundColor: s.c }} />
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>{s.v}</span>
                    </div>
                    <button
                      onClick={() => upgradeStat(pet.id, s.k)}
                      disabled={coins < cost}
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '8px 12px',
                        borderRadius: 10,
                        flexShrink: 0,
                        border: coins >= cost ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(55,65,81,0.5)',
                        background: coins >= cost ? 'rgba(22,101,52,0.35)' : '#1f2937',
                        color: coins >= cost ? '#4ade80' : '#6b7280',
                        cursor: coins >= cost ? 'pointer' : 'not-allowed',
                      }}
                      className={coins >= cost ? 'active:scale-95' : ''}
                    >
                      +UP
                    </button>
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
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(42,42,90,0.5)', paddingBottom: 10 }}>
                    <span style={{ color: '#9ca3af', fontSize: 14 }}>{r.l}</span>
                    <span style={{ color: r.c || '#e5e7eb', fontSize: 14, fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: 'sticky', bottom: 0, background: '#12122a', borderTop: '1px solid #2a2a5a', padding: '16px 24px', display: 'flex', justifyContent: 'center', zIndex: 30 }}>
        <button
          onClick={() => setScreen('menu')}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(90deg,#16a34a,#22c55e)',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Press Start 2P', system-ui",
          }}
          className="active:scale-95 transition-transform"
        >
          🗺️ Explorar
        </button>
      </div>
    </div>
  );
}
