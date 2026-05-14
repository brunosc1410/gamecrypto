import { useGameStore } from '../store/gameStore';
import PetSprite from './PetSprite';

export default function Wallet() {
  const { setScreen, walletConnected, walletAddress, connectWallet, pets, coins, gems } = useGameStore();

  const card = {
    background: '#111128',
    border: '1px solid #252550',
    borderRadius: 16,
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <style>{`.wallet-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <div style={{
        padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550',
      }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: 17 }}>👛 Carteira</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Content */}
      <div className="wallet-scroll" style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        padding: '24px 32px 28px 32px',
        display: 'flex', flexDirection: 'column', gap: 18,
      } as React.CSSProperties}>

        {/* Connection card */}
        <div style={{ ...card, padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{walletConnected ? '🔗' : '🔒'}</div>
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            {walletConnected ? 'Carteira Conectada' : 'Conectar Carteira'}
          </h2>

          {walletConnected ? (
            <div style={{ background: '#0a0a1a', borderRadius: 12, padding: 14, marginTop: 12, wordBreak: 'break-all' }}>
              <p style={{ color: '#93c5fd', fontSize: 11, fontFamily: 'monospace' }}>{walletAddress}</p>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 18 }}>Conecte para mintar NFTs</p>
              <button onClick={connectWallet} className="active:scale-95 transition-transform" style={{
                padding: '14px 28px', background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
                border: 'none', borderRadius: 14, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Press Start 2P', system-ui",
              }}>
                🦊 Conectar MetaMask
              </button>
              <p style={{ color: '#4b5563', fontSize: 11, marginTop: 12 }}>* Simulação</p>
            </div>
          )}
        </div>

        {/* Assets card */}
        <div style={{ ...card, padding: 20 }}>
          <p style={{ color: '#facc15', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>💰 Ativos</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { e: '🪙', v: coins, l: 'Coins', bc: 'rgba(234,179,8,0.12)', brd: 'rgba(234,179,8,0.2)' },
              { e: '💎', v: gems, l: 'Gemas', bc: 'rgba(168,85,247,0.12)', brd: 'rgba(168,85,247,0.2)' },
              { e: '🐾', v: `${pets.filter(p => p.isNFT).length}/${pets.length}`, l: 'NFTs', bc: 'rgba(6,182,212,0.12)', brd: 'rgba(6,182,212,0.2)' },
            ].map((a, i) => (
              <div key={i} style={{
                background: a.bc, border: `1px solid ${a.brd}`,
                borderRadius: 14, padding: '14px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 24 }}>{a.e}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginTop: 6 }}>{a.v}</div>
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{a.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mint card */}
        {walletConnected && (
          <div style={{ ...card, padding: 20, borderColor: 'rgba(6,182,212,0.25)' }}>
            <p style={{ color: '#22d3ee', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>⛏️ Mintar NFT</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pets.filter(p => !p.isNFT).map(pet => (
                <div key={pet.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#0a0a1a', borderRadius: 14, padding: '10px 14px',
                  border: '1px solid #1e1e40',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <PetSprite pet={pet} size={36} animate={false} showParticles={false} />
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{pet.name}</p>
                      <p style={{ color: '#6b7280', fontSize: 11 }}>Lv.{pet.stats.level}</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    const tid = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                    useGameStore.setState({ pets: pets.map(p => p.id === pet.id ? { ...p, isNFT: true, tokenId: tid } : p) });
                  }} className="active:scale-95 transition-transform" style={{
                    background: 'rgba(6,182,212,0.2)', color: '#a5f3fc',
                    fontWeight: 700, fontSize: 11, padding: '8px 14px',
                    borderRadius: 10, border: '1px solid rgba(6,182,212,0.3)', cursor: 'pointer',
                  }}>
                    Mintar 💎3
                  </button>
                </div>
              ))}

              {pets.filter(p => !p.isNFT).length === 0 && (
                <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>Todos mintados! ✅</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
