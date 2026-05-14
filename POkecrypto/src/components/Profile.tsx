import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { AVATAR_CLASSES, GENDER_OPTIONS } from '../data/avatars';
import PlayerAvatar from './PlayerAvatar';
import { AvatarClass, AvatarGender } from '../types/game';
import InventoryPanel from './InventoryPanel';
import ActivePetBadge from './ActivePetBadge';

export default function Profile() {
  const {
    setScreen, playerName, setPlayerName, playerGender, setPlayerGender,
    playerClass, setPlayerClass, coins, gems, cryptoBalls,
    walletConnected, walletAddress, pets, totalBattles, totalCaptures, encounterMode, addCoins, isVip,
  } = useGameStore();

  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [confirmMode, setConfirmMode] = useState<null | 'auto-battle' | 'auto-capture' | 'auto-flee'>(null);

  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 16 };
  const cls = AVATAR_CLASSES.find(a => a.class === playerClass);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      <style>{`.profile-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* Header */}
      <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => { setEditing(false); setScreen('menu'); }} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: 17 }}>{editing ? '✏️ Editar' : '👤 Perfil'}</span>
        <div style={{ width: 40 }} />
      </div>

      <div className="profile-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: '24px 28px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 } as React.CSSProperties}>

        {!editing ? (
          <>
            {/* === VIEW MODE === */}

            {/* Avatar card — trainer left / encounter config right */}
            <div style={{ ...card, padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
                {/* Trainer block */}
                <div style={{
                  width: '42%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: 14,
                }}>
                  <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={72} />
                  {isVip && (
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, rgba(255,215,0,0.22), rgba(234,179,8,0.14))',
                      border: '1px solid rgba(250,204,21,0.35)',
                      color: '#fde68a',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}>
                      👑 VIP
                    </div>
                  )}
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 16, textAlign: 'center', lineHeight: 1.2 }}>{playerName}</span>
                  <span style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', lineHeight: 1.3 }}>
                    {cls?.emoji} {cls?.label}<br />{playerGender === 'male' ? '♂️' : '♀️'}
                  </span>
                  {pets.length > 0 && <ActivePetBadge size="small" />}
                  <button onClick={() => { setTempName(playerName); setEditing(true); }} className="active:scale-95 transition-transform" style={{
                    marginTop: 2, padding: '7px 14px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: 12, color: '#22d3ee', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>✏️ Editar</button>
                </div>

                {/* Encounter config block */}
                <div style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: 12,
                }}>
                  <p style={{ color: '#f87171', fontSize: 12, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>⚙️ Config. Encontro</p>
                  <p style={{ color: '#6b7280', fontSize: 9, textAlign: 'center', marginBottom: 10, lineHeight: 1.3 }}>Uma opção por vez</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {([
                      { key: 'manual' as const, label: 'Manual', emoji: '🎮', color: '#9ca3af', free: true },
                      { key: 'auto-battle' as const, label: 'Batalhar', emoji: '⚔️', color: '#ef4444', free: false },
                      { key: 'auto-capture' as const, label: 'Capturar', emoji: '🔮', color: '#06b6d4', free: false },
                      { key: 'auto-flee' as const, label: 'Fugir', emoji: '🏃', color: '#eab308', free: false },
                    ]).map(opt => {
                      const active = encounterMode === opt.key;
                      return (
                        <button key={opt.key}
                          onClick={() => {
                            if (active) return;
                            if (opt.free || isVip) {
                              useGameStore.setState({ encounterMode: opt.key });
                            } else {
                              setConfirmMode(opt.key as 'auto-battle' | 'auto-capture' | 'auto-flee');
                            }
                          }}
                          className="active:scale-[0.98] transition-transform"
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                            minHeight: 58, padding: '8px 4px', borderRadius: 12, cursor: active ? 'default' : 'pointer', textAlign: 'center',
                            background: active ? `${opt.color}15` : 'rgba(255,255,255,0.02)',
                            border: active ? `2px solid ${opt.color}50` : '2px solid rgba(255,255,255,0.05)',
                          }}>
                          <span style={{ fontSize: 18, lineHeight: 1 }}>{opt.emoji}</span>
                          <div style={{ color: active ? opt.color : '#d1d5db', fontWeight: 700, fontSize: 10, lineHeight: 1.1 }}>{opt.label}</div>
                          {!opt.free && !active ? (
                            <span style={{ color: isVip ? '#4ade80' : '#facc15', fontSize: 8, fontWeight: 700, lineHeight: 1 }}>{isVip ? 'FREE' : '💰50'}</span>
                          ) : active ? (
                            <span style={{ color: opt.color, fontSize: 9, fontWeight: 700, lineHeight: 1 }}>ATIVO</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm mode purchase modal */}
            {confirmMode && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
              }}>
                <div style={{ width: '100%', maxWidth: 280, background: '#111128', border: '1px solid #252550', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>
                    {confirmMode === 'auto-battle' ? '⚔️' : confirmMode === 'auto-capture' ? '🔮' : '🏃'}
                  </p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                    {confirmMode === 'auto-battle' ? 'Auto Batalhar' : confirmMode === 'auto-capture' ? 'Auto Capturar' : 'Auto Fugir'}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
                    Liberar este modo por<br />
                    <span style={{ color: '#facc15', fontWeight: 700, fontSize: 18 }}>💰 50 coins</span>
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 11, marginBottom: 18 }}>Saldo: 💰 {coins}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setConfirmMode(null)} className="active:scale-95 transition-transform" style={{
                      flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, color: '#9ca3af', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>Cancelar</button>
                    <button onClick={() => {
                      if (coins >= 50) {
                        addCoins(-50);
                        useGameStore.setState({ encounterMode: confirmMode as any });
                        setConfirmMode(null);
                      }
                    }} disabled={coins < 50} className="active:scale-95 transition-transform" style={{
                      flex: 1, padding: '12px 0',
                      background: coins >= 50 ? 'linear-gradient(90deg,#16a34a,#22c55e)' : '#374151',
                      border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700,
                      cursor: coins >= 50 ? 'pointer' : 'not-allowed',
                    }}>Ativar!</button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{ ...card, padding: 18 }}>
              <p style={{ color: '#facc15', fontSize: 12, fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>📊 Estatísticas</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { e: '💰', v: coins, l: 'Coins', c: '#eab308' },
                  { e: '💎', v: gems, l: 'Gemas', c: '#a855f7' },
                  { e: '🔮', v: cryptoBalls, l: 'Bolas', c: '#06b6d4' },
                  { e: '🐾', v: pets.length, l: 'Pets', c: '#22c55e' },
                  { e: '⚔️', v: totalBattles, l: 'Batalhas', c: '#ef4444' },
                  { e: '✨', v: totalCaptures, l: 'Capturas', c: '#ec4899' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18 }}>{s.e}</div>
                    <div style={{ color: s.c, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{s.v}</div>
                    <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory */}
            <div style={{ ...card, padding: 18 }}>
              <p style={{ color: '#06b6d4', fontSize: 12, fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>🎒 Inventário</p>
              <InventoryPanel />
            </div>

            {/* Wallet */}
            <div style={{ ...card, padding: 18, borderColor: walletConnected ? 'rgba(34,197,94,0.25)' : '#252550' }}>
              <p style={{ color: '#60a5fa', fontSize: 12, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>👛 Carteira</p>
              {walletConnected ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>Conectada</span>
                  </div>
                  <div style={{ background: '#0a0a1a', borderRadius: 10, padding: 12, wordBreak: 'break-all' }}>
                    <p style={{ color: '#93c5fd', fontSize: 10, fontFamily: 'monospace' }}>{walletAddress}</p>
                  </div>
                  <button onClick={() => setScreen('wallet')} className="active:scale-95 transition-transform" style={{ marginTop: 14, padding: '10px 20px', background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 12, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                    👛 Gerenciar Carteira
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 700 }}>Desconectada</span>
                  </div>
                  <button onClick={() => setScreen('wallet')} className="active:scale-95 transition-transform" style={{ padding: '12px 24px', background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    🦊 Conectar Carteira
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* === EDIT MODE === */}

            {/* Preview */}
            <div style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={110} />
              <span style={{ color: '#9ca3af', fontSize: 12 }}>Preview</span>
            </div>

            {/* Name */}
            <div style={{ ...card, padding: 18 }}>
              <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>Nome</p>
              <input
                type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                maxLength={16}
                style={{ width: '100%', textAlign: 'center', background: '#0a0a1a', border: '2px solid #252550', borderRadius: 12, padding: '12px 16px', color: '#facc15', fontSize: 16, fontWeight: 700, outline: 'none' }}
              />
            </div>

            {/* Gender */}
            <div style={{ ...card, padding: 18 }}>
              <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>Gênero</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {GENDER_OPTIONS.map((g) => (
                  <button key={g.key} onClick={() => setPlayerGender(g.key as AvatarGender)} className="active:scale-95 transition-transform" style={{
                    padding: '12px 8px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                    background: playerGender === g.key ? 'rgba(6,182,212,0.18)' : 'rgba(255,255,255,0.03)',
                    border: playerGender === g.key ? '2px solid rgba(6,182,212,0.45)' : '2px solid rgba(255,255,255,0.06)',
                    color: playerGender === g.key ? '#22d3ee' : '#9ca3af',
                  }}>
                    <div style={{ fontSize: 22 }}>{g.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{g.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div style={{ ...card, padding: 18 }}>
              <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>Classe</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {AVATAR_CLASSES.map((a) => (
                  <button key={a.class} onClick={() => setPlayerClass(a.class as AvatarClass)} className="active:scale-95 transition-transform" style={{
                    padding: '10px 4px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    background: playerClass === a.class ? 'rgba(6,182,212,0.18)' : 'rgba(255,255,255,0.03)',
                    border: playerClass === a.class ? '2px solid rgba(6,182,212,0.45)' : '2px solid rgba(255,255,255,0.06)',
                    color: playerClass === a.class ? '#22d3ee' : '#9ca3af',
                  }}>
                    <div style={{ fontSize: 20 }}>{a.emoji}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, marginTop: 4 }}>{a.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={() => { setPlayerName(tempName.trim() || playerName); setEditing(false); }}
              className="active:scale-95 transition-transform"
              style={{
                padding: '14px 0', background: 'linear-gradient(90deg,#16a34a,#22c55e)',
                border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%',
              }}
            >
              ✓ Salvar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
