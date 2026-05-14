import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Shop() {
  const { setScreen, coins, gems, addCoins, upgradeStat, selectedPetId, cryptoBalls } = useGameStore();
  const [note, setNote] = useState<string | null>(null);
  const notify = (m: string) => { setNote(m); setTimeout(() => setNote(null), 2000); };

  const items = [
    { id: 'b5', name: 'CryptoBalls ×5', desc: '+5 bolas', price: 100, cur: 'coins' as const, emoji: '🔮',
      act: () => { if (coins >= 100) { addCoins(-100); useGameStore.setState({ cryptoBalls: cryptoBalls + 5 }); notify('✅ +5 CryptoBalls!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'b20', name: 'CryptoBalls ×20', desc: '+20 bolas', price: 350, cur: 'coins' as const, emoji: '🔮',
      act: () => { if (coins >= 350) { addCoins(-350); useGameStore.setState({ cryptoBalls: cryptoBalls + 20 }); notify('✅ +20 CryptoBalls!'); } else notify('❌ Coins insuficientes!'); } },
    { id: 'cp', name: 'Pacote Coins', desc: '+200 coins', price: 2, cur: 'gems' as const, emoji: '💰',
      act: () => { if (gems >= 2) { addCoins(200); useGameStore.setState({ gems: gems - 2 }); notify('✅ +200 Coins!'); } else notify('❌ Sem gemas!'); } },
    { id: 'hp', name: 'Poção Vida', desc: '+10 HP máx', price: 50, cur: 'coins' as const, emoji: '❤️',
      act: () => { if (selectedPetId && coins >= 50) { upgradeStat(selectedPetId, 'hp'); notify('✅ +10 HP!'); } else notify('❌ Erro!'); } },
    { id: 'atk', name: 'Elixir Força', desc: '+5 Ataque', price: 50, cur: 'coins' as const, emoji: '⚔️',
      act: () => { if (selectedPetId && coins >= 50) { upgradeStat(selectedPetId, 'attack'); notify('✅ +5 ATK!'); } else notify('❌ Erro!'); } },
    { id: 'mega', name: 'Mega Pack', desc: '+500 coins + stat', price: 5, cur: 'gems' as const, emoji: '🎁',
      act: () => { if (gems >= 5) { addCoins(500); useGameStore.setState({ gems: gems - 5 }); if (selectedPetId) { const s = ['attack', 'defense', 'speed', 'hp'] as const; upgradeStat(selectedPetId, s[Math.floor(Math.random() * s.length)]); addCoins(50); } notify('✅ Mega Pack!'); } else notify('❌ Sem gemas!'); } },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <style>{`.shop-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <div style={{
        padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550',
      }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 17 }}>🛒 Loja</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#a855f7' }}>💎{gems}</span>
          <span style={{ color: '#06b6d4' }}>🔮{cryptoBalls}</span>
        </div>
      </div>

      {/* Notification */}
      {note && (
        <div style={{
          position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, background: '#1f2937', border: '2px solid rgba(250,204,21,0.4)',
          borderRadius: 14, padding: '10px 20px',
        }}>
          <span style={{ color: '#facc15', fontWeight: 700, fontSize: 14 }}>{note}</span>
        </div>
      )}

      {/* Content */}
      <div className="shop-scroll" style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        padding: '24px 32px 28px 32px',
      } as React.CSSProperties}>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(it => (
            <div key={it.id} style={{
              background: '#111128', border: '1px solid #252550',
              borderRadius: 16, padding: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 28, marginBottom: 8 }}>{it.emoji}</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{it.name}</span>
              <span style={{ color: '#9ca3af', fontSize: 11, marginTop: 4, textAlign: 'center' }}>{it.desc}</span>

              <span style={{
                marginTop: 10, fontWeight: 700, fontSize: 14,
                color: it.cur === 'coins' ? '#eab308' : '#a855f7',
              }}>
                {it.cur === 'coins' ? '💰' : '💎'} {it.price}
              </span>

              <button onClick={it.act} className="active:scale-95 transition-transform" style={{
                width: '100%', marginTop: 12, padding: '10px 0',
                borderRadius: 12, border: '1px solid rgba(168,85,247,0.3)',
                background: 'rgba(168,85,247,0.08)', color: '#c4b5fd',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>
                Comprar
              </button>
            </div>
          ))}
        </div>

        {/* Daily reward */}
        <div style={{
          marginTop: 20, background: 'rgba(161,98,7,0.1)', border: '1px solid rgba(250,204,21,0.2)',
          borderRadius: 16, padding: 20, textAlign: 'center',
        }}>
          <p style={{ color: '#facc15', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎉 Recompensa Diária</p>
          <button onClick={() => { addCoins(50); notify('✅ +50 Coins!'); }} className="active:scale-95 transition-transform" style={{
            padding: '12px 28px', background: 'linear-gradient(90deg,#ca8a04,#eab308)',
            border: 'none', borderRadius: 12, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Press Start 2P', system-ui",
          }}>
            Coletar 💰 50
          </button>
        </div>
      </div>
    </div>
  );
}
