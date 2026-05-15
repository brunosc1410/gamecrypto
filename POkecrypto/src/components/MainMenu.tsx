import { useGameStore } from '../store/gameStore';
import { ZONES } from '../data/pets';
import PlayerAvatar from './PlayerAvatar';
import { AVATAR_CLASSES } from '../data/avatars';
import ActivePetBadge from './ActivePetBadge';
import { CoinIcon, GemIcon, CryptoBallIcon } from './PixelIcons';

export default function MainMenu() {
  const {
    setScreen, playerName, playerGender, playerClass,
    addStarterPets, pets, coins, gems, totalBattles,
    startExploring, stopExploring, selectedPetId, cryptoBalls, totalCaptures, isVip, explore,
  } = useGameStore();

  const cls = AVATAR_CLASSES.find((a) => a.class === playerClass);
  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '24px 28px 48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#facc15', fontSize: 22, fontWeight: 900, fontFamily: "'Press Start 2P', system-ui", textShadow: '0 0 20px rgba(250,204,21,0.3)' }}>
              🎮 CryptoPets
            </h1>
            <p style={{ color: '#f87171', fontSize: 14, fontWeight: 700, marginTop: 4, fontFamily: "'Press Start 2P', system-ui" }}>ARENA</p>
          </div>
          <p style={{ color: '#eab308', fontSize: 11, fontWeight: 700, marginTop: 10 }} className="animate-pulse">
            ⚔️ NFT BATTLE GAME ⚔️
          </p>

          {/* Trainer card */}
          <div
            onClick={() => setScreen('profile')}
            style={{
              width: '100%', marginTop: 28, ...card, padding: 18,
              display: 'grid',
              gridTemplateColumns: pets.length > 0 ? '52px 1fr auto 18px' : '52px 1fr 18px',
              alignItems: 'center', gap: 12, cursor: 'pointer',
            }}
            className="active:scale-[0.98] transition-transform"
          >
            <div style={{ flexShrink: 0 }}>
              <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={52} />
            </div>
            <div style={{ minWidth: 0 }}>
              {isVip && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 999,
                  background: 'linear-gradient(90deg, rgba(255,215,0,0.22), rgba(234,179,8,0.14))',
                  border: '1px solid rgba(250,204,21,0.35)', color: '#fde68a', fontSize: 8, fontWeight: 700, marginBottom: 5,
                }}>👑 VIP</div>
              )}
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playerName}</p>
              <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 3 }}>
                {cls?.emoji} {cls?.label} {playerGender === 'male' ? '♂️' : '♀️'}
              </p>
            </div>
            {pets.length > 0 && (
              <div style={{ justifySelf: 'end' }}>
                <ActivePetBadge size="small" />
              </div>
            )}
            <span style={{ color: '#6b7280', fontSize: 16, justifySelf: 'end' }}>›</span>
          </div>

          {/* Stats */}
          {pets.length > 0 && (
            <div style={{ width: '100%', marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { icon: <CoinIcon size={16} />, v: coins, c: '#eab308' },
                { icon: <GemIcon size={16} />, v: gems, c: '#a855f7' },
                { icon: <CryptoBallIcon size={16} />, v: cryptoBalls, c: '#06b6d4' },
                { icon: null, e: '🐾', v: pets.length, c: '#22c55e' },
                { icon: null, e: '⚔️', v: totalBattles, c: '#ef4444' },
                { icon: null, e: '✨', v: totalCaptures, c: '#ec4899' },
              ].map((s, i) => (
                <div key={i} style={{ ...card, padding: '10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: s.c, fontSize: 13, fontWeight: 700 }}>
                  {s.icon ?? <span>{s.e}</span>} {s.v}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {pets.length === 0 ? (
            <button
              onClick={() => addStarterPets()}
              style={{
                width: '100%', marginTop: 32, padding: '16px 0',
                background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                border: 'none', borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >🎮 Iniciar Jogo</button>
          ) : (
            <>
              {/* Explore */}
              <div style={{ ...card, width: '100%', marginTop: 24, padding: 20 }}>
                <p style={{ textAlign: 'center', color: '#eab308', fontWeight: 700, fontSize: 14, marginBottom: explore.isExploring ? 10 : 16 }}>🗺️ Explorar Mapa</p>

                {explore.isExploring && (
                  <div
                    style={{
                      width: '100%',
                      marginBottom: 14,
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: '1px solid rgba(34,211,238,0.28)',
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(34,211,238,0.08))',
                      color: '#67e8f9',
                      boxShadow: '0 0 18px rgba(34,211,238,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,255,255,0.06)',
                          fontSize: 14,
                        }}>🧭</div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.1 }}>Exploração em andamento</p>
                          <p style={{ fontSize: 8, color: '#a5f3fc', opacity: 0.85, marginTop: 2, lineHeight: 1.1 }}>
                            Continue ou encerre sua sessão atual
                          </p>
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: 'rgba(16,185,129,0.16)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        color: '#6ee7b7',
                        fontSize: 8,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>ATIVO</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        onClick={() => setScreen('explore')}
                        className="active:scale-[0.98] transition-transform"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 12,
                          border: '1px solid rgba(34,211,238,0.22)',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#67e8f9',
                          cursor: 'pointer',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >← Voltar ao mapa</button>

                      <button
                        onClick={() => stopExploring()}
                        className="active:scale-[0.98] transition-transform"
                        style={{
                          padding: '10px 12px',
                          borderRadius: 12,
                          border: '1px solid rgba(248,113,113,0.22)',
                          background: 'rgba(127,29,29,0.18)',
                          color: '#fca5a5',
                          cursor: 'pointer',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >✕ Fechar exploração</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {ZONES.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => { if (selectedPetId) startExploring(z.id); else setScreen('collection'); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        background: '#0a0a1a', border: '1px solid #1e1e40', borderRadius: 12,
                        padding: '14px 8px', cursor: 'pointer', color: 'white',
                      }}
                      className="active:scale-95 transition-transform"
                    >
                      <span style={{ fontSize: 24 }}>{z.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#d1d5db', lineHeight: 1.2, textAlign: 'center' }}>{z.name}</span>
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
                <NavBtn label="👤 Perfil" bg="linear-gradient(90deg,#0891b2,#06b6d4)" onClick={() => setScreen('profile')} />
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
    <button
      onClick={onClick}
      className="active:scale-95 transition-transform"
      style={{
        padding: '14px 8px', background: bg, border: 'none', borderRadius: 12,
        color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Press Start 2P', system-ui", letterSpacing: 0.5,
      }}
    >{label}</button>
  );
}
