import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ALL_PETS } from '../data/pets';
import PetSprite from './PetSprite';
import { Pet } from '../types/game';
import VipIcon from './VipIcon';

// Capsule SVG icon
function CapsuleIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 140" style={{ width: size, height: size * 1.4 }}>
      <defs>
        <linearGradient id="capTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="capBot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      {/* Top half */}
      <path d="M 15 70 L 15 35 Q 15 5 50 5 Q 85 5 85 35 L 85 70 Z" fill="url(#capTop)" />
      {/* Bottom half */}
      <path d="M 15 70 L 15 105 Q 15 135 50 135 Q 85 135 85 105 L 85 70 Z" fill="url(#capBot)" />
      {/* Center line */}
      <rect x="10" y="65" width="80" height="10" rx="3" fill="#374151" />
      {/* Center button */}
      <circle cx="50" cy="70" r="10" fill="white" stroke="#374151" strokeWidth="3" />
      <circle cx="50" cy="70" r="5" fill="#a855f7" />
      {/* Shine */}
      <ellipse cx="35" cy="32" rx="12" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-20 35 32)" />
      {/* Star sparkle */}
      <polygon points="72,22 70,28 64,28 69,32 67,38 72,34 77,38 75,32 80,28 74,28" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

// Rarity tiers for capsule
const CAPSULE_TIERS = [
  { label: 'Comum', rarity: 'common' as const, chance: 45, color: '#9ca3af' },
  { label: 'Raro', rarity: 'rare' as const, chance: 25, color: '#3b82f6' },
  { label: 'Super Raro', rarity: 'rare' as const, boost: true, chance: 15, color: '#06b6d4' },
  { label: 'Épico', rarity: 'epic' as const, chance: 9, color: '#a855f7' },
  { label: 'Super Épico', rarity: 'epic' as const, boost: true, chance: 5, color: '#ec4899' },
  { label: 'Lendário', rarity: 'legendary' as const, chance: 1, color: '#f59e0b' },
];

let idCounter = 0;
function genId() { return `pet-${Date.now()}-${idCounter++}`; }

export default function Shop() {
  const { setScreen, coins, gems, addCoins, cryptoBalls, isVip } = useGameStore();
  const [note, setNote] = useState<string | null>(null);
  const [capsuleConfirm, setCapsuleConfirm] = useState(false);
  const [capsuleResult, setCapsuleResult] = useState<Pet | null>(null);
  const [capsuleOpening, setCapsuleOpening] = useState(false);
  const notify = (m: string) => { setNote(m); setTimeout(() => setNote(null), 2000); };

  const addItem = (key: string, qty: number) => {
    const inv = { ...useGameStore.getState().inventory };
    (inv as any)[key] = ((inv as any)[key] || 0) + qty;
    useGameStore.setState({ inventory: inv });
  };

  const openCapsule = async () => {
    if (gems < 5) { notify('❌ Sem gemas!'); return; }
    useGameStore.setState({ gems: gems - 5 });
    setCapsuleConfirm(false);
    setCapsuleOpening(true);

    // Wait for animation
    await new Promise(r => setTimeout(r, 1500));

    // Roll rarity
    const roll = Math.random() * 100;
    let cumulative = 0;
    let tier = CAPSULE_TIERS[0];
    for (const t of CAPSULE_TIERS) {
      cumulative += t.chance;
      if (roll < cumulative) { tier = t; break; }
    }

    // Pick random pet of that rarity
    const candidates = ALL_PETS.filter(p => p.rarity === tier.rarity);
    const template = candidates[Math.floor(Math.random() * candidates.length)];

    // Create pet with optional stat boost for "super" tiers
    const boost = (tier as any).boost ? 1.15 : 1;
    const newPet: Pet = {
      ...template,
      id: genId(),
      stats: {
        ...template.stats,
        hp: Math.floor(template.stats.hp * boost),
        maxHp: Math.floor(template.stats.maxHp * boost),
        attack: Math.floor(template.stats.attack * boost),
        defense: Math.floor(template.stats.defense * boost),
        speed: Math.floor(template.stats.speed * boost),
      },
      wins: 0, losses: 0,
    };

    // Add to collection
    const state = useGameStore.getState();
    useGameStore.setState({ pets: [...state.pets, newPet] });

    setCapsuleOpening(false);
    setCapsuleResult(newPet);
  };

  const items = [
    { id: 'b5', name: 'CryptoBalls ×5', desc: '+5 bolas de captura', price: 100, cur: 'coins' as const, emoji: '🔮',
      act: () => { if (coins >= 100) { addCoins(-100); useGameStore.setState({ cryptoBalls: cryptoBalls + 5 }); notify('✅ +5 CryptoBalls!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'b20', name: 'CryptoBalls ×20', desc: '+20 bolas de captura', price: 350, cur: 'coins' as const, emoji: '🔮',
      act: () => { if (coins >= 350) { addCoins(-350); useGameStore.setState({ cryptoBalls: cryptoBalls + 20 }); notify('✅ +20 CryptoBalls!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'hp', name: 'Poção Vida', desc: '+10 HP máx', price: 50, cur: 'coins' as const, emoji: '❤️',
      act: () => { if (coins >= 50) { addCoins(-50); addItem('potionHp', 1); notify('✅ +1 Poção Vida!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'atk', name: 'Elixir Força', desc: '+5 Ataque', price: 50, cur: 'coins' as const, emoji: '⚔️',
      act: () => { if (coins >= 50) { addCoins(-50); addItem('potionAtk', 1); notify('✅ +1 Elixir!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'def', name: 'Escudo Mágico', desc: '+5 Defesa', price: 50, cur: 'coins' as const, emoji: '🛡️',
      act: () => { if (coins >= 50) { addCoins(-50); addItem('potionDef', 1); notify('✅ +1 Escudo!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'spd', name: 'Botas Vento', desc: '+5 Velocidade', price: 50, cur: 'coins' as const, emoji: '💨',
      act: () => { if (coins >= 50) { addCoins(-50); addItem('potionSpd', 1); notify('✅ +1 Botas!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'cp', name: 'Pacote Coins', desc: '+200 coins', price: 2, cur: 'gems' as const, emoji: '💰',
      act: () => { if (gems >= 2) { addCoins(200); useGameStore.setState({ gems: gems - 2 }); notify('✅ +200 Coins!'); } else notify('❌ Sem gemas!'); } },
  ];

  // Capsule confirm overlay
  if (capsuleConfirm) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
        <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
          <button onClick={() => setCapsuleConfirm(false)} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
          <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 17 }}>Cápsula Pet</span>
          <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 12 }}>💎{gems}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <CapsuleIcon size={60} />
          <p style={{ color: 'white', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>Cápsula Misteriosa</p>
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>
            Contém 1 pet aleatório!<br />Quanto mais raro, mais forte.
          </p>

          {/* Chances table */}
          <div style={{ width: '100%', background: '#111128', border: '1px solid #252550', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Probabilidades</p>
            {CAPSULE_TIERS.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color }} />
                  <span style={{ color: t.color, fontWeight: 700, fontSize: 13 }}>{t.label}</span>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{t.chance}%</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 20 }}>💎 5</span>
            <span style={{ color: '#6b7280', fontSize: 14 }}>gemas</span>
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button onClick={() => setCapsuleConfirm(false)} className="active:scale-95 transition-transform" style={{
              flex: 1, padding: '14px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, color: '#9ca3af', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={openCapsule} disabled={gems < 5} className="active:scale-95 transition-transform" style={{
              flex: 1, padding: '14px 0', background: gems >= 5 ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : '#374151',
              border: 'none', borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 700, cursor: gems >= 5 ? 'pointer' : 'not-allowed',
            }}>Abrir!</button>
          </div>
        </div>
      </div>
    );
  }

  // Capsule opening animation
  if (capsuleOpening) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0b20', gap: 20 }}>
        <div className="anim-bounce" style={{ filter: 'drop-shadow(0 0 20px #a855f780)' }}>
          <CapsuleIcon size={80} />
        </div>
        <p style={{ color: '#a855f7', fontWeight: 700, fontSize: 18 }} className="animate-pulse">Abrindo cápsula...</p>
      </div>
    );
  }

  // Capsule result
  if (capsuleResult) {
    const rc: Record<string, string> = { common: '#9ca3af', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0b20', padding: '24px 28px', gap: 16 }}>
        <p style={{ color: rc[capsuleResult.rarity], fontWeight: 700, fontSize: 14 }}>
          {capsuleResult.rarity === 'legendary' ? '🌟 LENDÁRIO!' : capsuleResult.rarity === 'epic' ? '💜 ÉPICO!' : capsuleResult.rarity === 'rare' ? '💙 RARO!' : '⬜ COMUM'}
        </p>
        <div style={{ filter: `drop-shadow(0 0 16px ${rc[capsuleResult.rarity]}60)` }}>
          <PetSprite pet={capsuleResult} size={120} animate showParticles />
        </div>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>{capsuleResult.name}</p>
        <div style={{ display: 'flex', gap: 12, fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: '#f87171' }}>❤️{capsuleResult.stats.maxHp}</span>
          <span style={{ color: '#fb923c' }}>⚔️{capsuleResult.stats.attack}</span>
          <span style={{ color: '#60a5fa' }}>🛡️{capsuleResult.stats.defense}</span>
          <span style={{ color: '#facc15' }}>💨{capsuleResult.stats.speed}</span>
        </div>
        <p style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>Adicionado à sua coleção!</p>
        <button onClick={() => { setCapsuleResult(null); }} className="active:scale-95 transition-transform" style={{
          padding: '14px 32px', background: 'linear-gradient(90deg,#16a34a,#22c55e)',
          border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8,
        }}>✓ Continuar</button>
      </div>
    );
  }

  // Normal shop view
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <style>{`.shop-scroll::-webkit-scrollbar{display:none}`}</style>

      <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 17 }}>🛒 Loja</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#a855f7' }}>💎{gems}</span>
        </div>
      </div>

      {note && (
        <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: '#1f2937', border: '2px solid rgba(250,204,21,0.4)', borderRadius: 14, padding: '10px 20px' }}>
          <span style={{ color: '#facc15', fontWeight: 700, fontSize: 14 }}>{note}</span>
        </div>
      )}

      <div className="shop-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: '24px 28px 28px 28px' } as React.CSSProperties}>

        {/* CAPSULE — featured item */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1040 0%, #111128 100%)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: 18, padding: 20, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flexShrink: 0 }}><CapsuleIcon size={50} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#c4b5fd', fontWeight: 700, fontSize: 15 }}>Cápsula Pet</p>
            <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>Receba 1 pet aleatório! De comum a lendário.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 16 }}>💎 5</span>
              <button onClick={() => setCapsuleConfirm(true)} className="active:scale-95 transition-transform" style={{
                padding: '8px 16px', background: 'linear-gradient(90deg,#7c3aed,#a855f7)',
                border: 'none', borderRadius: 10, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>Ver chances</button>
            </div>
          </div>
        </div>

        {/* VIP Pack */}
        <div style={{
          background: isVip
            ? 'linear-gradient(135deg, rgba(250,204,21,0.08), rgba(17,17,40,1))'
            : 'linear-gradient(135deg, #2a1a08 0%, #111128 100%)',
          border: isVip ? '1px solid rgba(250,204,21,0.3)' : '1px solid rgba(250,204,21,0.15)',
          borderRadius: 18, padding: 20, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flexShrink: 0 }}><VipIcon size={48} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ color: '#ffd700', fontWeight: 700, fontSize: 15 }}>Pacote VIP</p>
              {isVip && <span style={{ background: '#ffd700', color: '#1a1a00', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>ATIVO</span>}
            </div>
            {isVip ? (
              <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>Você já é VIP! Velocidade 3x e modos automáticos gratuitos.</p>
            ) : (
              <>
                <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>
                  Velocidade 3x grátis + Config. de encontro sem custo!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 16 }}>💎 50</span>
                  <button onClick={() => {
                    if (gems >= 50) {
                      useGameStore.setState({ gems: gems - 50, isVip: true });
                      notify('👑 Parabéns! Você agora é VIP!');
                    } else {
                      notify('❌ Gemas insuficientes!');
                    }
                  }} className="active:scale-95 transition-transform" style={{
                    padding: '8px 16px', background: 'linear-gradient(90deg,#b8860b,#ffd700)',
                    border: 'none', borderRadius: 10, color: '#1a1a00', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>Comprar VIP</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(it => (
            <div key={it.id} style={{ background: '#111128', border: '1px solid #252550', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 28, marginBottom: 8 }}>{it.emoji}</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>{it.name}</span>
              <span style={{ color: '#9ca3af', fontSize: 10, marginTop: 4, textAlign: 'center' }}>{it.desc}</span>
              <span style={{ marginTop: 10, fontWeight: 700, fontSize: 14, color: it.cur === 'coins' ? '#eab308' : '#a855f7' }}>
                {it.cur === 'coins' ? '💰' : '💎'} {it.price}
              </span>
              <button onClick={it.act} className="active:scale-95 transition-transform" style={{
                width: '100%', marginTop: 12, padding: '10px 0', borderRadius: 12, border: '1px solid rgba(168,85,247,0.3)',
                background: 'rgba(168,85,247,0.08)', color: '#c4b5fd', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>Comprar</button>
            </div>
          ))}
        </div>

        {/* Daily reward */}
        <div style={{ marginTop: 20, background: 'rgba(161,98,7,0.1)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <p style={{ color: '#facc15', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎉 Recompensa Diária</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => { addCoins(50); notify('✅ +50 Coins!'); }} className="active:scale-95 transition-transform" style={{
              padding: '12px 22px', background: 'linear-gradient(90deg,#ca8a04,#eab308)', border: 'none', borderRadius: 12, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Press Start 2P', system-ui",
            }}>Coletar 💰 50</button>
            <button onClick={() => { useGameStore.setState({ gems: useGameStore.getState().gems + 50 }); notify('✅ +50 Gemas!'); }} className="active:scale-95 transition-transform" style={{
              padding: '12px 22px', background: 'linear-gradient(90deg,#7c3aed,#a855f7)', border: 'none', borderRadius: 12, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Press Start 2P', system-ui",
            }}>Coletar 💎 50</button>
          </div>
        </div>
      </div>
    </div>
  );
}
