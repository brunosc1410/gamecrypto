import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ALL_PETS } from '../data/pets';
import { Pet } from '../types/game';
import PetSprite from './PetSprite';
import {
  CryptoBallIcon, VipCrownIcon, CapsuleIcon,
  PotionHpIcon, PotionAtkIcon, PotionDefIcon, PotionSpdIcon,
  GemIcon, CoinIcon,
} from './PixelIcons';

/* ── Gacha rarity roll ── */
function rollCapsule(): Pet {
  const roll = Math.random();
  let rarity: 'common' | 'rare' | 'epic' | 'legendary';
  if (roll < 0.05) rarity = 'legendary';
  else if (roll < 0.17) rarity = 'epic';
  else if (roll < 0.45) rarity = 'rare';
  else rarity = 'common';
  const candidates = ALL_PETS.filter(p => p.rarity === rarity);
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    ...template,
    id: `pet-${Date.now()}-${Math.random()}`,
    stats: { ...template.stats },
    colors: { ...template.colors },
    defaultColors: { ...template.defaultColors },
    wins: 0, losses: 0,
  };
}

const RARITY_COLOR: Record<string, string> = {
  common: '#9ca3af', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b',
};
const RARITY_LABEL: Record<string, string> = {
  common: 'COMUM', rare: 'RARO', epic: 'ÉPICO', legendary: 'LENDÁRIO',
};

/* ══════════════════════════════════════════
   Capsule Opening Animation Component
   shaking → burst → all pets at once in grid
   ══════════════════════════════════════════ */
function CapsuleOpening({ pets, onDone }: { pets: Pet[]; onDone: () => void }) {
  const [phase, setPhase] = useState<'shaking' | 'burst' | 'show'>('shaking');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setPhase('burst'), 1400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === 'burst') {
      timerRef.current = setTimeout(() => setPhase('show'), 700);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [phase]);

  // Shaking
  if (phase === 'shaking') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0b20' }}>
        <style>{`@keyframes capShake{0%,100%{transform:rotate(0)}20%{transform:rotate(12deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}80%{transform:rotate(-6deg)}}@keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div style={{ animation: 'capShake 0.4s ease-in-out infinite' }}>
          <CapsuleIcon size={110} />
        </div>
        <p style={{ color: '#fde68a', fontWeight: 700, fontSize: 14, marginTop: 24, animation: 'pulse2 0.8s infinite' }}>
          Abrindo {pets.length > 1 ? `${pets.length} cápsulas` : 'cápsula'}...
        </p>
      </div>
    );
  }

  // Burst flash
  if (phase === 'burst') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b20', position: 'relative' }}>
        <style>{`@keyframes flashBoom{0%{opacity:1;transform:scale(0.3)}40%{opacity:1;transform:scale(1.3)}100%{opacity:0;transform:scale(2)}}`}</style>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,215,0,0.4) 35%, transparent 65%)',
          animation: 'flashBoom 0.7s ease-out forwards',
        }} />
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%', fontSize: 22,
            animation: 'sparkle-burst 0.7s ease-out forwards',
            ['--angle' as string]: `${i * 45}deg`,
          }}>✨</div>
        ))}
      </div>
    );
  }

  // Show all pets at once — flex wrap grid
  const hasBonus = pets.length === 11;
  // Sort: legendary/epic first for visual impact
  const sorted = [...pets].sort((a, b) => {
    const order: Record<string, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return (order[a.rarity] ?? 3) - (order[b.rarity] ?? 3);
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', textAlign: 'center', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 16 }}>
          🎉 {pets.length} Pet{pets.length > 1 ? 's' : ''} Obtido{pets.length > 1 ? 's' : ''}!
        </p>
        {hasBonus && (
          <p style={{ color: '#4ade80', fontSize: 10, fontWeight: 700, marginTop: 4 }}>🎁 +1 Bônus incluído!</p>
        )}
      </div>

      {/* Pet grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px' }}>
        <style>{`@keyframes popIn{0%{opacity:0;transform:scale(0.3)}60%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}`}</style>
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
        }}>
          {sorted.map((pet, i) => {
            const rc = RARITY_COLOR[pet.rarity];
            const isLeg = pet.rarity === 'legendary';
            const isEp = pet.rarity === 'epic';
            const isBonusPet = hasBonus && pet === pets[pets.length - 1];
            return (
              <div
                key={pet.id}
                style={{
                  width: 90, padding: '10px 6px 8px 6px',
                  background: isLeg ? 'linear-gradient(160deg, #2a1a00, #181830)' : isEp ? 'linear-gradient(160deg, #1a0a2a, #181830)' : '#111128',
                  border: `2px solid ${rc}50`,
                  borderRadius: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  position: 'relative',
                  boxShadow: isLeg ? `0 0 16px ${rc}30` : isEp ? `0 0 10px ${rc}20` : 'none',
                  animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both`,
                }}
              >
                {/* bonus tag */}
                {isBonusPet && (
                  <span style={{
                    position: 'absolute', top: -6, right: -4,
                    background: '#22c55e', color: 'white', fontSize: 7, fontWeight: 700,
                    padding: '2px 5px', borderRadius: 6,
                  }}>BÔNUS</span>
                )}
                {/* legendary star */}
                {isLeg && (
                  <span style={{ position: 'absolute', top: -6, left: -4, fontSize: 14 }}>⭐</span>
                )}
                {/* sprite */}
                <div style={{ width: 52, height: 52 }}>
                  <PetSprite pet={pet} size={52} animate={false} showParticles={false} />
                </div>
                {/* name */}
                <p style={{ color: 'white', fontWeight: 700, fontSize: 9, textAlign: 'center', lineHeight: 1.1 }}>{pet.name}</p>
                {/* rarity badge */}
                <span style={{
                  color: rc, fontSize: 7, fontWeight: 700,
                  background: `${rc}18`, padding: '1px 6px', borderRadius: 4,
                }}>{RARITY_LABEL[pet.rarity]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 24px', flexShrink: 0 }}>
        <button onClick={onDone} className="active:scale-95 transition-transform" style={{
          width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: 'white', fontSize: 14, fontWeight: 700,
        }}>✓ Continuar</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Shop — Main Component
   ══════════════════════════════════════════ */
export default function Shop() {
  const { coins, gems, isVip } = useGameStore();
  const [openingPets, setOpeningPets] = useState<Pet[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  const buyBalls = (qty: number, cost: number) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({ coins: s.coins - cost, cryptoBalls: s.cryptoBalls + qty }));
    showToast(`🔮 +${qty} CryptoBalls compradas!`);
  };

  const buyPotion = (key: string, cost: number, name: string) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({
      coins: s.coins - cost,
      inventory: { ...s.inventory, [key]: (s.inventory as any)[key] + 1 },
    }));
    showToast(`🧪 ${name} comprado!`);
  };

  const buyGems = (qty: number, cost: number) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({ coins: s.coins - cost, gems: s.gems + qty }));
    showToast(`💎 +${qty} Gemas compradas!`);
  };

  const buyVip = () => {
    if (gems < 50) return;
    useGameStore.setState((s) => ({ gems: s.gems - 50, isVip: true }));
    showToast('👑 Passe VIP ativado!');
  };

  const buyCapsules = (qty: number, cost: number) => {
    if (coins < cost) return;
    const total = qty === 10 ? 11 : qty;
    const results: Pet[] = [];
    for (let i = 0; i < total; i++) results.push(rollCapsule());
    useGameStore.setState((s) => ({
      coins: s.coins - cost,
      pets: [...s.pets, ...results],
      seenPets: [...new Set([...s.seenPets, ...results.map(p => p.name)])],
    }));
    setOpeningPets(results);
  };

  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };

  // Capsule opening animation
  if (openingPets) {
    return <CapsuleOpening pets={openingPets} onDone={() => setOpeningPets(null)} />;
  }

  const toastOverlay = toast && (
    <div style={{
      position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
      zIndex: 100, animation: 'fade-in 0.25s ease-out',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.88)', color: '#4ade80', padding: '10px 20px',
        borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
        border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>{toast}</div>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20', position: 'relative' }}>
      {/* Toast notification */}
      {toastOverlay}
      {/* Header */}
      <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => useGameStore.getState().goBack()} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
        <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 17 }}>🛒 Loja</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 700, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#eab308' }}><CoinIcon size={14} /> {coins}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#a855f7' }}><GemIcon size={14} /> {gems}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px 20px' }}>

        {/* ══════ CAPSULES ══════ */}
        <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>
          🎁 CÁPSULAS — PET ALEATÓRIO
        </p>
        <div style={{ ...card, padding: 16, marginBottom: 8, background: 'linear-gradient(135deg, #1a1a3a, #2a1530)', border: '2px solid rgba(245,158,11,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <CapsuleIcon size={52} />
            <div>
              <p style={{ color: '#fde68a', fontWeight: 700, fontSize: 13 }}>Cápsula Misteriosa</p>
              <p style={{ color: '#9ca3af', fontSize: 9, marginTop: 2, lineHeight: 1.3 }}>Receba 1 pet aleatório!</p>
              <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 8, color: '#9ca3af', background: '#9ca3af18', padding: '2px 6px', borderRadius: 4 }}>55% Comum</span>
                <span style={{ fontSize: 8, color: '#3b82f6', background: '#3b82f618', padding: '2px 6px', borderRadius: 4 }}>28% Raro</span>
                <span style={{ fontSize: 8, color: '#a855f7', background: '#a855f718', padding: '2px 6px', borderRadius: 4 }}>12% Épico</span>
                <span style={{ fontSize: 8, color: '#f59e0b', background: '#f59e0b18', padding: '2px 6px', borderRadius: 4 }}>5% Lendário</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { qty: 1, price: 200, label: '1 Cápsula' },
              { qty: 2, price: 380, label: '2 Cápsulas' },
              { qty: 5, price: 900, label: '5 Cápsulas' },
              { qty: 10, price: 1700, label: '10+1 Cápsulas' },
            ].map(opt => {
              const canBuy = coins >= opt.price;
              return (
                <button key={opt.qty} onClick={() => buyCapsules(opt.qty, opt.price)} disabled={!canBuy}
                  className="active:scale-95 transition-transform"
                  style={{
                    padding: '10px 8px', borderRadius: 10, border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed',
                    background: canBuy ? 'linear-gradient(90deg,#d97706,#f59e0b)' : '#374151',
                    color: 'white', fontSize: 10, fontWeight: 700, opacity: canBuy ? 1 : 0.5,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}>
                  <span>{opt.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9 }}>
                    <CoinIcon size={10} /> {opt.price}
                    {opt.qty === 10 && <span style={{ color: '#4ade80', marginLeft: 2 }}>+1 GRÁTIS</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 12 }} />

        {/* ══════ VIP ══════ */}
        {!isVip && (
          <>
            <p style={{ color: '#fde68a', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>👑 PREMIUM</p>
            <div style={{
              ...card, padding: 18, marginBottom: 20,
              background: 'linear-gradient(135deg, #1a1a3a, #2a1a40)',
              border: '2px solid rgba(255,215,0,0.3)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <VipCrownIcon size={48} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fde68a', fontWeight: 700, fontSize: 14 }}>👑 Passe VIP</p>
                <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 2 }}>2x recompensas, velocidade 3x grátis</p>
              </div>
              <button onClick={buyVip} disabled={gems < 50} className="active:scale-95 transition-transform" style={{
                padding: '10px 16px', borderRadius: 10, border: 'none', cursor: gems >= 50 ? 'pointer' : 'not-allowed',
                background: gems >= 50 ? 'linear-gradient(90deg,#d97706,#f59e0b)' : '#374151',
                color: 'white', fontSize: 11, fontWeight: 700, opacity: gems >= 50 ? 1 : 0.5,
                display: 'flex', alignItems: 'center', gap: 4,
              }}><GemIcon size={12} /> 50</button>
            </div>
          </>
        )}

        {/* ══════ CRYPTOBALLS ══════ */}
        <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>🔮 CRYPTOBALLS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { qty: 5, price: 100 },
            { qty: 20, price: 350 },
            { qty: 50, price: 800 },
          ].map(item => {
            const canBuy = coins >= item.price;
            return (
              <div key={item.qty} style={{ ...card, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CryptoBallIcon size={36} />
                </div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 11, textAlign: 'center' }}>{item.qty} Bolas</p>
                <button onClick={() => buyBalls(item.qty, item.price)} disabled={!canBuy} className="active:scale-95 transition-transform" style={{
                  width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed',
                  background: canBuy ? 'linear-gradient(90deg,#7c3aed,#8b5cf6)' : '#374151',
                  color: 'white', fontSize: 10, fontWeight: 700, opacity: canBuy ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}><CoinIcon size={10} /> {item.price}</button>
              </div>
            );
          })}
        </div>

        {/* ══════ POTIONS ══════ */}
        <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>🧪 POÇÕES & ITENS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { id: 'hp', name: 'Poção Vida', icon: <PotionHpIcon size={40} />, desc: '+10 HP max', price: 80, key: 'potionHp' },
            { id: 'atk', name: 'Elixir Força', icon: <PotionAtkIcon size={40} />, desc: '+5 Ataque', price: 120, key: 'potionAtk' },
            { id: 'def', name: 'Escudo Mágico', icon: <PotionDefIcon size={40} />, desc: '+5 Defesa', price: 120, key: 'potionDef' },
            { id: 'spd', name: 'Botas de Vento', icon: <PotionSpdIcon size={40} />, desc: '+5 Velocidade', price: 120, key: 'potionSpd' },
          ].map(item => {
            const canBuy = coins >= item.price;
            return (
              <div key={item.id} style={{ ...card, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 11, textAlign: 'center' }}>{item.name}</p>
                <p style={{ color: '#6b7280', fontSize: 10, textAlign: 'center' }}>{item.desc}</p>
                <button onClick={() => buyPotion(item.key, item.price, item.name)} disabled={!canBuy} className="active:scale-95 transition-transform" style={{
                  width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed',
                  background: canBuy ? 'linear-gradient(90deg,#7c3aed,#8b5cf6)' : '#374151',
                  color: 'white', fontSize: 10, fontWeight: 700, opacity: canBuy ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}><CoinIcon size={10} /> {item.price}</button>
              </div>
            );
          })}
        </div>

        {/* ══════ GEMS ══════ */}
        <p style={{ color: '#a855f7', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>💎 GEMAS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { qty: 5, price: 500 },
            { qty: 15, price: 1200 },
          ].map(g => {
            const canBuy = coins >= g.price;
            return (
              <div key={g.qty} style={{ ...card, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GemIcon size={36} /></div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 11, textAlign: 'center' }}>{g.qty} Gemas</p>
                <button onClick={() => buyGems(g.qty, g.price)} disabled={!canBuy} className="active:scale-95 transition-transform" style={{
                  width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed',
                  background: canBuy ? 'linear-gradient(90deg,#7c3aed,#8b5cf6)' : '#374151',
                  color: 'white', fontSize: 10, fontWeight: 700, opacity: canBuy ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}><CoinIcon size={10} /> {g.price}</button>
              </div>
            );
          })}
        </div>

        {/* ══════ DEV / TEST BUTTONS ══════ */}
        <p style={{ color: '#374151', fontWeight: 700, fontSize: 11, marginBottom: 10, letterSpacing: 0.5 }}>🛠️ TESTE (DEV)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => useGameStore.setState((s) => ({ coins: s.coins + 90000 }))}
            className="active:scale-95 transition-transform"
            style={{
              padding: '14px 10px', borderRadius: 12, border: '2px dashed #374151', cursor: 'pointer',
              background: 'rgba(234,179,8,0.08)', color: '#eab308', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <CoinIcon size={16} /> +90.000
          </button>
          <button
            onClick={() => useGameStore.setState((s) => ({ gems: s.gems + 900000 }))}
            className="active:scale-95 transition-transform"
            style={{
              padding: '14px 10px', borderRadius: 12, border: '2px dashed #374151', cursor: 'pointer',
              background: 'rgba(168,85,247,0.08)', color: '#a855f7', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <GemIcon size={16} /> +900.000
          </button>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
