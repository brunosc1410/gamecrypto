import { useGameStore } from '../store/gameStore';
import { ZONES } from '../data/pets';

export default function MainMenu() {
  const { setScreen, playerName, setPlayerName, addStarterPets, pets, coins, gems, totalBattles, startExploring, selectedPetId, cryptoBalls, totalCaptures } = useGameStore();

  const card = {
    background: '#111128',
    border: '1px solid #252550',
    borderRadius: 14,
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' as const, background: '#0b0b20' }}>
      <div style={{ flex: 1, overflowY: 'auto' as const }}>
        <div style={{ padding: '40px 28px 48px 28px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 0 }}>

          {/* Logo */}
          <img src="/images/logo.png" alt="CryptoPets Arena" style={{ width: 200, imageRendering: 'pixelated' as const }} className="drop-shadow-2xl" />
          <p style={{ color: '#eab308', fontSize: 11, fontWeight: 700, marginTop: 10 }} className="animate-pulse">
            ⚔️ NFT BATTLE GAME ⚔️
          </p>

          {/* Name */}
          <div style={{ width: '100%', marginTop: 32 }}>
            <label style={{ display: 'block', textAlign: 'center' as const, color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Nome do Treinador
            </label>
            <input
              type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
              maxLength={16}
              style={{
                width: '100%', textAlign: 'center' as const,
                background: '#111128', border: '2px solid #252550',
                borderRadius: 12, padding: '14px 16px',
                color: '#fde047', fontSize: 16, fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>

          {/* Stats */}
          {pets.length > 0 && (
            <div style={{ width: '100%', marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { e: '🪙', v: coins, c: '#eab308' },
                { e: '💎', v: gems, c: '#a855f7' },
                { e: '🔮', v: cryptoBalls, c: '#06b6d4' },
                { e: '🐾', v: pets.length, c: '#22c55e' },
                { e: '⚔️', v: totalBattles, c: '#ef4444' },
                { e: '✨', v: totalCaptures, c: '#ec4899' },
              ].map((s, i) => (
                <div key={i} style={{
                  ...card, padding: '10px 4px',
                  textAlign: 'center' as const, color: s.c,
                  fontSize: 13, fontWeight: 700,
                }}>
                  {s.e} {s.v}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {pets.length === 0 ? (
            <button onClick={() => { addStarterPets(); setScreen('collection'); }}
              style={{
                width: '100%', marginTop: 32, padding: '16px 0',
                background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                border: 'none', borderRadius: 14, color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>
              🎮 Iniciar Jogo
            </button>
          ) : (
            <>
              {/* Explore */}
              <div style={{ ...card, width: '100%', marginTop: 28, padding: 20 }}>
                <p style={{ textAlign: 'center' as const, color: '#eab308', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                  🗺️ Explorar Mapa
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {ZONES.map(z => (
                    <button key={z.id}
                      onClick={() => { if (selectedPetId) startExploring(z.id); else setScreen('collection'); }}
                      style={{
                        display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6,
                        background: '#0a0a1a', border: '1px solid #1e1e40',
                        borderRadius: 12, padding: '14px 8px',
                        cursor: 'pointer', color: 'white',
                      }}
                      className="active:scale-95 transition-transform"
                    >
                      <span style={{ fontSize: 24 }}>{z.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#d1d5db', lineHeight: 1.2, textAlign: 'center' as const }}>{z.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nav buttons */}
              <div style={{ width: '100%', marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <NavBtn label="📋 Coleção" bg="linear-gradient(90deg,#16a34a,#22c55e)" onClick={() => setScreen('collection')} />
                <NavBtn label="📕 Codex" bg="linear-gradient(90deg,#b91c1c,#dc2626)" onClick={() => setScreen('codex')} />
              </div>
              <div style={{ width: '100%', marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <NavBtn label="🛒 Loja" bg="linear-gradient(90deg,#7c3aed,#8b5cf6)" onClick={() => setScreen('shop')} />
                <NavBtn label="👛 Carteira" bg="linear-gradient(90deg,#2563eb,#3b82f6)" onClick={() => setScreen('wallet')} />
              </div>
            </>
          )}

          <p style={{ color: '#374151', fontSize: 10, marginTop: 40 }}>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ label, bg, onClick }: { label: string; bg: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="active:scale-95 transition-transform" style={{
      padding: '14px 8px', background: bg,
      border: 'none', borderRadius: 12, color: 'white',
      fontSize: 11, fontWeight: 700, cursor: 'pointer',
      fontFamily: "'Press Start 2P', system-ui",
      letterSpacing: 0.5,
    }}>
      {label}
    </button>
  );
}
