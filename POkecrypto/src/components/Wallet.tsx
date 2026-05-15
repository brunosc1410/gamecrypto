import { useGameStore } from '../store/gameStore';

export default function Wallet() {
  const { setScreen, walletConnected, walletAddress, connectWallet, coins, gems, pets } = useGameStore();
  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: 17 }}>👛 Carteira</span>
        <div />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Connection card */}
        <div style={{ ...card, padding: 28, textAlign: 'center' }}>
          <p style={{ fontSize: 36 }}>{walletConnected ? '🔗' : '🔒'}</p>
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            {walletConnected ? 'Carteira Conectada' : 'Conectar Carteira'}
          </h2>
          {walletConnected ? (
            <p style={{ color: '#93c5fd', fontSize: 11, fontFamily: 'monospace' }}>{walletAddress}</p>
          ) : (
            <div style={{ marginTop: 8 }}>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 18 }}>Conecte para mintar NFTs</p>
              <button
                onClick={connectWallet}
                className="active:scale-95 transition-transform"
                style={{
                  padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(90deg,#3b82f6,#60a5fa)',
                  color: 'white', fontSize: 14, fontWeight: 700,
                }}
              >🔗 Conectar Wallet</button>
              <p style={{ color: '#4b5563', fontSize: 11, marginTop: 12 }}>* Simulação</p>
            </div>
          )}
        </div>

        {/* Assets card */}
        <div style={{ ...card, padding: 20 }}>
          <p style={{ color: '#facc15', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>💰 Ativos</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { e: '💰', v: coins, l: 'Coins', bc: 'rgba(234,179,8,0.12)', brd: 'rgba(234,179,8,0.2)' },
              { e: '💎', v: gems, l: 'Gemas', bc: 'rgba(168,85,247,0.12)', brd: 'rgba(168,85,247,0.2)' },
              { e: '🐾', v: `${pets.filter(p => p.isNFT).length}/${pets.length}`, l: 'NFTs', bc: 'rgba(6,182,212,0.12)', brd: 'rgba(6,182,212,0.2)' },
            ].map((a, i) => (
              <div key={i} style={{
                background: a.bc, border: `1px solid ${a.brd}`, borderRadius: 14,
                padding: '14px 8px', textAlign: 'center',
              }}>
                <p style={{ fontSize: 24 }}>{a.e}</p>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 18, marginTop: 4 }}>{a.v}</p>
                <p style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>{a.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mint card */}
        {walletConnected && (
          <div style={{ ...card, padding: 20, borderColor: 'rgba(6,182,212,0.25)' }}>
            <p style={{ color: '#22d3ee', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>⛏️ Mintar NFT</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pets.filter(p => !p.isNFT).length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>Todos mintados! ✅</p>
              ) : (
                pets.filter(p => !p.isNFT).map(pet => (
                  <div key={pet.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#0a0a1a', borderRadius: 14, padding: '10px 14px', border: '1px solid #1e1e40',
                  }}>
                    <div>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{pet.name}</p>
                      <p style={{ color: '#6b7280', fontSize: 11 }}>Lv.{pet.stats.level}</p>
                    </div>
                    <button
                      onClick={() => {
                        useGameStore.setState((s) => ({
                          pets: s.pets.map(p => p.id !== pet.id ? p : { ...p, isNFT: true, tokenId: `#${Math.floor(Math.random() * 9999)}` }),
                          gems: s.gems - 2,
                        }));
                      }}
                      disabled={gems < 2}
                      className="active:scale-95 transition-transform"
                      style={{
                        padding: '8px 16px', borderRadius: 10, border: 'none', cursor: gems >= 2 ? 'pointer' : 'not-allowed',
                        background: gems >= 2 ? 'linear-gradient(90deg,#06b6d4,#22d3ee)' : '#374151',
                        color: 'white', fontSize: 11, fontWeight: 700, opacity: gems >= 2 ? 1 : 0.5,
                      }}
                    >💎2 Mintar</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
