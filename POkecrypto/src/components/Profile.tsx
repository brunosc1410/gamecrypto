import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import PlayerAvatar from './PlayerAvatar';
import { AVATAR_CLASSES, GENDER_OPTIONS } from '../data/avatars';
import { AvatarClass, AvatarGender } from '../types/game';

export default function Profile() {
  const {
    setScreen, playerName, setPlayerName, playerGender, setPlayerGender,
    playerClass, setPlayerClass, pets, totalBattles,
    totalCaptures, isVip, walletConnected, connectWallet,
  } = useGameStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const cls = AVATAR_CLASSES.find(a => a.class === playerClass);
  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };

  const handleSaveName = () => {
    if (nameInput.trim()) setPlayerName(nameInput.trim());
    setEditingName(false);
  };

  const totalWins = pets.reduce((a, p) => a + p.wins, 0);
  const totalLosses = pets.reduce((a, p) => a + p.losses, 0);
  const winRate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
  const avgLevel = pets.length > 0 ? Math.round(pets.reduce((a, p) => a + p.stats.level, 0) / pets.length) : 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: 17 }}>👤 Perfil</span>
        <div />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Avatar display */}
        <div style={{ ...card, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ padding: 12, borderRadius: '50%', background: '#0a0a1a', border: '2px solid #252550' }}>
              <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={72} />
            </div>
          </div>

          {/* Name */}
          {editingName ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={16}
                style={{
                  background: '#0a0a1a', border: '1px solid #252550', borderRadius: 8,
                  color: 'white', padding: '8px 12px', fontSize: 14, textAlign: 'center', width: 160,
                  outline: 'none',
                }}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button onClick={handleSaveName} style={{ background: '#16a34a', border: 'none', borderRadius: 8, color: 'white', padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✓</button>
            </div>
          ) : (
            <div onClick={() => { setEditingName(true); setNameInput(playerName); }} style={{ cursor: 'pointer' }}>
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{playerName}</h2>
              <p style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>toque para editar</p>
            </div>
          )}

          <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>
            {cls?.emoji} {cls?.label} {playerGender === 'male' ? '♂️' : '♀️'}
          </p>

          {isVip && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, marginTop: 8,
              background: 'linear-gradient(90deg, rgba(255,215,0,0.22), rgba(234,179,8,0.14))',
              border: '1px solid rgba(250,204,21,0.35)', color: '#fde68a', fontSize: 10, fontWeight: 700,
            }}>👑 VIP</div>
          )}
        </div>

        {/* Gender select */}
        <div style={{ ...card, padding: 16, marginBottom: 16 }}>
          <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Gênero</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {GENDER_OPTIONS.map(g => (
              <button key={g.key} onClick={() => setPlayerGender(g.key as AvatarGender)} className="active:scale-95 transition-transform" style={{
                flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                background: playerGender === g.key ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                border: playerGender === g.key ? '2px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: playerGender === g.key ? '#22d3ee' : '#6b7280',
                fontSize: 12, fontWeight: 700,
              }}>{g.emoji} {g.label}</button>
            ))}
          </div>
        </div>

        {/* Class select */}
        <div style={{ ...card, padding: 16, marginBottom: 16 }}>
          <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Classe</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {AVATAR_CLASSES.map(a => (
              <button key={a.class} onClick={() => setPlayerClass(a.class as AvatarClass)} className="active:scale-95 transition-transform" style={{
                padding: '10px 4px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                background: playerClass === a.class ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                border: playerClass === a.class ? '2px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: playerClass === a.class ? '#22d3ee' : '#6b7280',
              }}>
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
                <p style={{ fontSize: 8, fontWeight: 700, marginTop: 4 }}>{a.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ ...card, padding: 16, marginBottom: 16 }}>
          <p style={{ color: '#facc15', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>📊 Estatísticas</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { l: 'Batalhas', v: totalBattles, c: '#ef4444', e: '⚔️' },
              { l: 'Capturas', v: totalCaptures, c: '#ec4899', e: '✨' },
              { l: 'Win Rate', v: `${winRate}%`, c: '#22c55e', e: '🏆' },
              { l: 'Nv. Médio', v: avgLevel, c: '#60a5fa', e: '📈' },
              { l: 'Vitórias', v: totalWins, c: '#4ade80', e: '🎉' },
              { l: 'Derrotas', v: totalLosses, c: '#f87171', e: '😢' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a0a1a', borderRadius: 10, padding: '10px 12px', border: '1px solid #1e1e40' }}>
                <p style={{ color: '#6b7280', fontSize: 9 }}>{s.e} {s.l}</p>
                <p style={{ color: s.c, fontWeight: 700, fontSize: 16, marginTop: 2 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet */}
        <div style={{ ...card, padding: 16, marginBottom: 16 }}>
          <p style={{ color: '#60a5fa', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>👛 Carteira</p>
          {walletConnected ? (
            <p style={{ color: '#4ade80', fontSize: 12 }}>🔗 Conectada</p>
          ) : (
            <button onClick={connectWallet} className="active:scale-95 transition-transform" style={{
              width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', color: 'white', fontSize: 12, fontWeight: 700,
            }}>🔗 Conectar Wallet</button>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setScreen('wallet')} className="active:scale-95 transition-transform" style={{
            padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(90deg,#0891b2,#06b6d4)', color: 'white', fontSize: 11, fontWeight: 700,
          }}>👛 Carteira</button>
          <button onClick={() => setScreen('shop')} className="active:scale-95 transition-transform" style={{
            padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(90deg,#7c3aed,#8b5cf6)', color: 'white', fontSize: 11, fontWeight: 700,
          }}>🛒 Loja</button>
        </div>

        {/* Reset button */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => {
              if (confirm('Resetar todo progresso?')) {
                localStorage.removeItem('cryptopets-arena-save');
                window.location.reload();
              }
            }}
            style={{
              padding: '10px 24px', borderRadius: 10, border: '1px solid #7f1d1d',
              background: 'rgba(127,29,29,0.15)', color: '#f87171', fontSize: 10,
              fontWeight: 700, cursor: 'pointer',
            }}
          >🗑️ Resetar Progresso</button>
        </div>
      </div>
    </div>
  );
}
