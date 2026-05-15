import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import PlayerAvatar from './PlayerAvatar';
import PetSprite from './PetSprite';
import ActivePetBadge from './ActivePetBadge';
import { AVATAR_CLASSES, GENDER_OPTIONS } from '../data/avatars';
import { AvatarClass, AvatarGender } from '../types/game';
import {
  CryptoBallIcon, PotionHpIcon, PotionAtkIcon, PotionDefIcon,
  PotionSpdIcon, CoinIcon, VipCrownIcon,
} from './PixelIcons';

type ViewMode = 'main' | 'edit' | 'use-item' | 'mint';

export default function Profile() {
  const store = useGameStore();
  const {
    playerName, setPlayerName, playerGender, setPlayerGender,
    playerClass, setPlayerClass, pets, totalBattles, selectedPetId,
    totalCaptures, isVip, walletConnected, connectWallet,
    coins, gems, cryptoBalls, inventory, encounterMode, upgradeStat,
  } = store;

  const [view, setView] = useState<ViewMode>('main');
  const [nameInput, setNameInput] = useState(playerName);
  const [genderInput, setGenderInput] = useState(playerGender);
  const [classInput, setClassInput] = useState(playerClass);
  const [usingItem, setUsingItem] = useState<string | null>(null);
  const [modeConfirm, setModeConfirm] = useState<'manual' | 'auto-battle' | 'auto-capture' | 'auto-flee' | null>(null);

  const cls = AVATAR_CLASSES.find(a => a.class === playerClass);
  const card: React.CSSProperties = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };
  const selectedPet = pets.find(p => p.id === selectedPetId);

  const totalWins = pets.reduce((a, p) => a + p.wins, 0);
  const totalLosses = pets.reduce((a, p) => a + p.losses, 0);
  const winRate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
  const avgLevel = pets.length > 0 ? Math.round(pets.reduce((a, p) => a + p.stats.level, 0) / pets.length) : 0;

  const handleSave = () => {
    if (nameInput.trim()) setPlayerName(nameInput.trim());
    setPlayerGender(genderInput as AvatarGender);
    setPlayerClass(classInput as AvatarClass);
    setView('main');
  };

  const requestModeChange = (mode: 'manual' | 'auto-battle' | 'auto-capture' | 'auto-flee') => {
    if (mode === encounterMode) return; // already active
    setModeConfirm(mode);
  };

  const confirmModeChange = () => {
    if (!modeConfirm) return;
    const cost = 50;
    if (modeConfirm !== 'manual' && !isVip) {
      if (coins < cost) return;
      useGameStore.setState((s) => ({ coins: s.coins - cost, encounterMode: modeConfirm }));
    } else {
      useGameStore.setState({ encounterMode: modeConfirm });
    }
    setModeConfirm(null);
  };

  const ITEM_MAP: Record<string, { label: string; emoji: React.ReactNode; stat: 'hp' | 'attack' | 'defense' | 'speed'; color: string }> = {
    potionHp:  { label: 'Poção Vida', emoji: <PotionHpIcon size={28} />, stat: 'hp', color: '#22c55e' },
    potionAtk: { label: 'Elixir Força', emoji: <PotionAtkIcon size={28} />, stat: 'attack', color: '#ef4444' },
    potionDef: { label: 'Escudo Mágico', emoji: <PotionDefIcon size={28} />, stat: 'defense', color: '#3b82f6' },
    potionSpd: { label: 'Botas de Vento', emoji: <PotionSpdIcon size={28} />, stat: 'speed', color: '#eab308' },
  };

  const applyItem = (itemKey: string, petId: string) => {
    const inv = { ...useGameStore.getState().inventory };
    const qty = (inv as any)[itemKey] || 0;
    if (qty <= 0) return;
    (inv as any)[itemKey] = qty - 1;
    const item = ITEM_MAP[itemKey];
    if (item) {
      // upgradeStat deducts 50 coins, so we add 50 first to cancel it out
      useGameStore.setState((s) => ({ coins: s.coins + 50 }));
      upgradeStat(petId, item.stat);
    }
    useGameStore.setState({ inventory: inv });
    setUsingItem(null);
    setView('main');
  };

  /* ══════════════════════════════════════
     USE ITEM — pick a pet to apply potion
     ══════════════════════════════════════ */
  if (view === 'use-item' && usingItem) {
    const item = ITEM_MAP[usingItem];
    const RARITY_BDR: Record<string, string> = { common: '#8a8a8a', rare: '#4a9eff', epic: '#c06eff', legendary: '#ffb830' };
    const RARITY_SHINE: Record<string, string> = { rare: 'shine-rare', epic: 'shine-epic', legendary: 'shine-legendary' };
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
        <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
          <button onClick={() => { setView('main'); setUsingItem(null); }} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {item?.emoji}
            <span style={{ color: item?.color, fontWeight: 700, fontSize: 15 }}>{item?.label}</span>
          </div>
          <div />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px' }}>
          <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginBottom: 14 }}>Toque no pet para aplicar:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {pets.map(pet => {
              const bdr = RARITY_BDR[pet.rarity] ?? '#8a8a8a';
              const shine = RARITY_SHINE[pet.rarity] ?? '';
              return (
                <button
                  key={pet.id}
                  onClick={() => applyItem(usingItem, pet.id)}
                  className={`active:scale-95 transition-transform ${shine}`}
                  style={{
                    width: 100, padding: '10px 6px 8px 6px',
                    background: '#111128', border: `2px solid ${bdr}`,
                    borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <div style={{ width: 52, height: 52 }}>
                    <PetSprite pet={pet} size={52} animate={false} showParticles={false} />
                  </div>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 10 }}>{pet.name}</p>
                  <p style={{ color: bdr, fontSize: 7, fontWeight: 700 }}>{pet.rarity.toUpperCase()}</p>
                  <p style={{ color: '#6b7280', fontSize: 7 }}>Lv.{pet.stats.level}</p>
                  <div style={{ display: 'flex', gap: 4, fontSize: 7, color: '#9ca3af' }}>
                    <span>❤️{pet.stats.maxHp}</span>
                    <span>⚔{pet.stats.attack}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, fontSize: 7, color: '#9ca3af' }}>
                    <span>🛡{pet.stats.defense}</span>
                    <span>💨{pet.stats.speed}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     MINT NFT — choose pet screen
     ══════════════════════════════════════ */
  if (view === 'mint') {
    const mintable = pets.filter(p => !p.isNFT);
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
        <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
          <button onClick={() => setView('main')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
          <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: 15 }}>⛏️ Mintar NFT</span>
          <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>💎 {gems}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {mintable.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 36, marginBottom: 8 }}>✅</p>
              <p style={{ color: '#4ade80', fontWeight: 700, fontSize: 16 }}>Todos mintados!</p>
              <p style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>Seus pets já são NFTs.</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginBottom: 14 }}>
                Toque no pet para mintar — custo: 💎2
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                {mintable.map(pet => {
                  const RBDR: Record<string,string> = { common:'#8a8a8a', rare:'#4a9eff', epic:'#c06eff', legendary:'#ffb830' };
                  const RSHINE: Record<string,string> = { rare:'shine-rare', epic:'shine-epic', legendary:'shine-legendary' };
                  const bc = RBDR[pet.rarity] ?? '#8a8a8a';
                  return (
                    <button
                      key={pet.id}
                      onClick={() => {
                        if (gems < 2) return;
                        useGameStore.setState((s) => ({
                          pets: s.pets.map(p => p.id !== pet.id ? p : { ...p, isNFT: true, tokenId: `#${Math.floor(Math.random() * 9999)}` }),
                          gems: s.gems - 2,
                        }));
                      }}
                      disabled={gems < 2}
                      className={`active:scale-95 transition-transform ${RSHINE[pet.rarity] ?? ''}`}
                      style={{
                        width: 100, padding: '10px 6px 8px 6px',
                        background: '#111128', border: `2px solid ${bc}`,
                        borderRadius: 14, cursor: gems >= 2 ? 'pointer' : 'not-allowed',
                        textAlign: 'center', opacity: gems >= 2 ? 1 : 0.5,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <div style={{ width: 48, height: 48 }}>
                        <PetSprite pet={pet} size={48} animate={false} showParticles={false} />
                      </div>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 9 }}>{pet.name}</p>
                      <p style={{ color: bc, fontSize: 7, fontWeight: 700 }}>{pet.rarity.toUpperCase()}</p>
                      <p style={{ color: '#6b7280', fontSize: 7 }}>Lv.{pet.stats.level}</p>
                      <div style={{
                        padding: '3px 8px', borderRadius: 6, marginTop: 2,
                        background: gems >= 2 ? 'linear-gradient(90deg,#06b6d4,#22d3ee)' : '#374151',
                        color: 'white', fontSize: 8, fontWeight: 700,
                      }}>💎2 Mint</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     EDIT PROFILE VIEW
     ══════════════════════════════════════ */
  if (view === 'edit') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
        <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
          <button onClick={() => setView('main')} style={{ color: '#6b7280', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>✕ Cancelar</button>
          <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: 17 }}>✏️ Editar Perfil</span>
          <div />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Avatar preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ padding: 16, borderRadius: '50%', background: '#0a0a1a', border: '2px solid #252550' }}>
              <PlayerAvatar gender={genderInput} avatarClass={classInput} size={80} />
            </div>
          </div>

          {/* Name */}
          <div style={{ ...card, padding: 16, marginBottom: 16 }}>
            <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Nome do Treinador</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={16}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              style={{
                width: '100%', background: '#0a0a1a', border: '1px solid #252550', borderRadius: 10,
                color: 'white', padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Gender */}
          <div style={{ ...card, padding: 16, marginBottom: 16 }}>
            <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Gênero</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {GENDER_OPTIONS.map(g => (
                <button key={g.key} onClick={() => setGenderInput(g.key as AvatarGender)} className="active:scale-95 transition-transform" style={{
                  flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                  background: genderInput === g.key ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                  border: genderInput === g.key ? '2px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: genderInput === g.key ? '#22d3ee' : '#6b7280',
                  fontSize: 12, fontWeight: 700,
                }}>{g.emoji} {g.label}</button>
              ))}
            </div>
          </div>

          {/* Class */}
          <div style={{ ...card, padding: 16, marginBottom: 16 }}>
            <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Classe</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {AVATAR_CLASSES.map(a => (
                <button key={a.class} onClick={() => setClassInput(a.class as AvatarClass)} className="active:scale-95 transition-transform" style={{
                  padding: '10px 4px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                  background: classInput === a.class ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                  border: classInput === a.class ? '2px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: classInput === a.class ? '#22d3ee' : '#6b7280',
                }}>
                  <span style={{ fontSize: 22 }}>{a.emoji}</span>
                  <p style={{ fontSize: 8, fontWeight: 700, marginTop: 4 }}>{a.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div style={{ padding: '12px 24px', flexShrink: 0 }}>
          <button onClick={handleSave} className="active:scale-95 transition-transform" style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: 'white', fontSize: 14, fontWeight: 700,
          }}>✓ Salvar</button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     MAIN PROFILE VIEW
     ══════════════════════════════════════ */
  const encounterModes: { mode: 'manual' | 'auto-battle' | 'auto-capture' | 'auto-flee'; label: string; emoji: string; desc: string }[] = [
    { mode: 'manual', label: 'Manual', emoji: '🎯', desc: 'Você escolhe a ação' },
    { mode: 'auto-battle', label: 'Batalhar', emoji: '⚔️', desc: 'Batalha automática' },
    { mode: 'auto-capture', label: 'Capturar', emoji: '🔮', desc: 'Captura automática' },
    { mode: 'auto-flee', label: 'Fugir', emoji: '🏃', desc: 'Foge sempre' },
  ];

  const MODE_LABELS: Record<string, string> = {
    'manual': '🎯 Manual', 'auto-battle': '⚔️ Batalhar', 'auto-capture': '🔮 Capturar', 'auto-flee': '🏃 Fugir',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20', position: 'relative' }}>

      {/* Mode change confirm modal */}
      {modeConfirm && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#111128', border: '1px solid #252550', borderRadius: 18,
            padding: 22, textAlign: 'center', maxWidth: 280, width: '100%',
          }}>
            <p style={{ fontSize: 28, marginBottom: 6 }}>{MODE_LABELS[modeConfirm]?.split(' ')[0]}</p>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
              Trocar para {MODE_LABELS[modeConfirm]}?
            </p>
            {modeConfirm !== 'manual' && !isVip && (
              <>
                <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 8 }}>Ativar este modo custa</p>
                <p style={{ color: '#eab308', fontWeight: 700, fontSize: 16, marginTop: 4 }}>💰 50 coins</p>
                <p style={{ color: '#6b7280', fontSize: 9, marginTop: 4 }}>Saldo: 💰 {coins}</p>
              </>
            )}
            {modeConfirm !== 'manual' && isVip && (
              <p style={{ color: '#4ade80', fontSize: 11, marginTop: 8 }}>👑 Grátis para VIP!</p>
            )}
            {modeConfirm === 'manual' && (
              <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 8 }}>Modo manual é sempre grátis</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              <button onClick={() => setModeConfirm(null)} style={{
                padding: '10px 0', borderRadius: 10, border: '1px solid #374151', background: 'none',
                color: '#9ca3af', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>Cancelar</button>
              <button
                onClick={confirmModeChange}
                disabled={modeConfirm !== 'manual' && !isVip && coins < 50}
                className="active:scale-95 transition-transform"
                style={{
                  padding: '10px 0', borderRadius: 10, border: 'none',
                  cursor: (modeConfirm !== 'manual' && !isVip && coins < 50) ? 'not-allowed' : 'pointer',
                  background: (modeConfirm !== 'manual' && !isVip && coins < 50) ? '#374151' : 'linear-gradient(90deg,#16a34a,#22c55e)',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  opacity: (modeConfirm !== 'manual' && !isVip && coins < 50) ? 0.5 : 1,
                }}
              >✓ Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => useGameStore.getState().goBack()} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Voltar</button>
        <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: 17 }}>👤 Perfil</span>
        <div />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

        {/* ══════ TRAINER + ENCOUNTER CONFIG — SIDE BY SIDE ══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>

          {/* LEFT: Trainer Card */}
          <div style={{ ...card, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* VIP badge */}
            {isVip && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 999,
                background: 'linear-gradient(90deg, rgba(255,215,0,0.22), rgba(234,179,8,0.14))',
                border: '1px solid rgba(250,204,21,0.35)',
              }}>
                <VipCrownIcon size={10} />
                <span style={{ color: '#fde68a', fontSize: 7, fontWeight: 700 }}>VIP</span>
              </div>
            )}
            {/* Avatar */}
            <div style={{ padding: 8, borderRadius: '50%', background: '#0a0a1a', border: '2px solid #252550' }}>
              <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={48} />
            </div>
            {/* Name */}
            <p style={{ color: 'white', fontWeight: 700, fontSize: 13, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{playerName}</p>
            <p style={{ color: '#6b7280', fontSize: 9 }}>{cls?.emoji} {cls?.label} {playerGender === 'male' ? '♂️' : '♀️'}</p>
            {/* Active pet */}
            {selectedPet && (
              <div style={{ width: '100%' }}>
                <ActivePetBadge size="small" />
              </div>
            )}
            {/* Edit button */}
            <button onClick={() => { setNameInput(playerName); setGenderInput(playerGender); setClassInput(playerClass); setView('edit'); }} className="active:scale-95 transition-transform" style={{
              width: '100%', padding: '7px 0', borderRadius: 8,
              background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
              color: '#22d3ee', fontSize: 9, fontWeight: 700, cursor: 'pointer',
            }}>✏️ Editar</button>
          </div>

          {/* RIGHT: Encounter Config */}
          <div style={{ ...card, padding: 14, display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700, marginBottom: 2, textAlign: 'center' }}>⚙️ Modo Encontro</p>
            <p style={{ color: '#6b7280', fontSize: 6, marginBottom: 6, textAlign: 'center', lineHeight: 1.3 }}>
              {isVip ? '👑 VIP — todos grátis!' : 'Apenas 1 ativo por vez · 💰50'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, flex: 1 }}>
              {encounterModes.map(opt => {
                const active = encounterMode === opt.mode;
                const isFree = opt.mode === 'manual' || isVip;
                return (
                  <button
                    key={opt.mode}
                    onClick={() => requestModeChange(opt.mode)}
                    disabled={!isFree && coins < 50}
                    className="active:scale-95 transition-transform"
                    style={{
                      padding: '5px 3px', borderRadius: 9, cursor: 'pointer', textAlign: 'center',
                      background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                      border: active ? '2px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      opacity: (!isFree && coins < 50) ? 0.4 : 1,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{opt.emoji}</span>
                    <p style={{ color: active ? '#f59e0b' : '#9ca3af', fontSize: 7, fontWeight: 700 }}>{opt.label}</p>
                    <p style={{ color: '#4b5563', fontSize: 5, lineHeight: 1.2 }}>{opt.desc}</p>
                    {active && <p style={{ color: '#4ade80', fontSize: 6, fontWeight: 700 }}>✓ ATIVO</p>}
                    {!isFree && !active && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
                        <CoinIcon size={6} /><span style={{ color: '#eab308', fontSize: 6 }}>50</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════ INVENTORY ══════ */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <p style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>🎒 Inventário</p>
          {/* Currencies */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
            <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '8px 4px', textAlign: 'center', border: '1px solid #1e1e40' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><CoinIcon size={18} /></div>
              <p style={{ color: '#eab308', fontWeight: 700, fontSize: 13, marginTop: 3 }}>{coins}</p>
              <p style={{ color: '#6b7280', fontSize: 7 }}>Coins</p>
            </div>
            <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '8px 4px', textAlign: 'center', border: '1px solid #1e1e40' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 14 12" width={18} height={15} style={{ imageRendering: 'pixelated' }}>
                  <rect x="4" y="0" width="6" height="1" fill="#c084fc"/><rect x="2" y="1" width="10" height="1" fill="#a855f7"/>
                  <rect x="1" y="2" width="12" height="1" fill="#9333ea"/><rect x="0" y="3" width="14" height="1" fill="#7e22ce"/>
                  <rect x="1" y="4" width="12" height="1" fill="#9333ea"/><rect x="2" y="5" width="10" height="1" fill="#7e22ce"/>
                  <rect x="3" y="6" width="8" height="1" fill="#6b21a8"/><rect x="4" y="7" width="6" height="1" fill="#581c87"/>
                  <rect x="5" y="8" width="4" height="1" fill="#4c1d95"/><rect x="6" y="9" width="2" height="1" fill="#3b0764"/>
                </svg>
              </div>
              <p style={{ color: '#a855f7', fontWeight: 700, fontSize: 13, marginTop: 3 }}>{gems}</p>
              <p style={{ color: '#6b7280', fontSize: 7 }}>Gemas</p>
            </div>
            <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '8px 4px', textAlign: 'center', border: '1px solid #1e1e40' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><CryptoBallIcon size={18} /></div>
              <p style={{ color: '#06b6d4', fontWeight: 700, fontSize: 13, marginTop: 3 }}>{cryptoBalls}</p>
              <p style={{ color: '#6b7280', fontSize: 7 }}>CryptoBalls</p>
            </div>
          </div>

          {/* Potions — clickable to use */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {([
              { key: 'potionHp', icon: <PotionHpIcon size={22} />, qty: inventory.potionHp, label: 'Vida', c: '#22c55e' },
              { key: 'potionAtk', icon: <PotionAtkIcon size={22} />, qty: inventory.potionAtk, label: 'Força', c: '#ef4444' },
              { key: 'potionDef', icon: <PotionDefIcon size={22} />, qty: inventory.potionDef, label: 'Escudo', c: '#3b82f6' },
              { key: 'potionSpd', icon: <PotionSpdIcon size={22} />, qty: inventory.potionSpd, label: 'Vento', c: '#eab308' },
            ]).map((item) => {
              const canUse = item.qty > 0 && pets.length > 0;
              return (
                <button
                  key={item.key}
                  onClick={() => { if (canUse) { setUsingItem(item.key); setView('use-item'); } }}
                  disabled={!canUse}
                  className="active:scale-95 transition-transform"
                  style={{
                    background: '#0a0a1a', borderRadius: 10, padding: '8px 4px', textAlign: 'center',
                    border: canUse ? `1px solid ${item.c}30` : '1px solid #1e1e40',
                    opacity: canUse ? 1 : 0.35, cursor: canUse ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <p style={{ color: item.c, fontWeight: 700, fontSize: 12, marginTop: 2 }}>{item.qty}</p>
                  <p style={{ color: '#6b7280', fontSize: 7 }}>{item.label}</p>
                  {canUse && <p style={{ color: '#4ade80', fontSize: 6, marginTop: 2 }}>USAR</p>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════ STATS ══════ */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <p style={{ color: '#facc15', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>📊 Estatísticas</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { l: 'Batalhas', v: totalBattles, c: '#ef4444', e: '⚔️' },
              { l: 'Capturas', v: totalCaptures, c: '#ec4899', e: '✨' },
              { l: 'Win Rate', v: `${winRate}%`, c: '#22c55e', e: '🏆' },
              { l: 'Nv. Médio', v: avgLevel, c: '#60a5fa', e: '📈' },
              { l: 'Vitórias', v: totalWins, c: '#4ade80', e: '🎉' },
              { l: 'Derrotas', v: totalLosses, c: '#f87171', e: '😢' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a0a1a', borderRadius: 8, padding: '6px 4px', border: '1px solid #1e1e40', textAlign: 'center' }}>
                <p style={{ fontSize: 12 }}>{s.e}</p>
                <p style={{ color: s.c, fontWeight: 700, fontSize: 13, marginTop: 1 }}>{s.v}</p>
                <p style={{ color: '#6b7280', fontSize: 7 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ WALLET — inline content ══════ */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <p style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>👛 Carteira</p>

          {!walletConnected ? (
            /* Not connected — show connect button */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontSize: 24, marginBottom: 6 }}>🔒</p>
              <p style={{ color: '#9ca3af', fontSize: 10, marginBottom: 12 }}>Conecte para mintar NFTs</p>
              <button onClick={connectWallet} className="active:scale-95 transition-transform" style={{
                width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', color: 'white', fontSize: 11, fontWeight: 700,
              }}>🔗 Conectar Wallet</button>
              <p style={{ color: '#4b5563', fontSize: 8, marginTop: 8 }}>* Simulação</p>
            </div>
          ) : (
            /* Connected — show wallet content inline */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Address */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#4ade80', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>🔗 Conectada</p>
                <p style={{ color: '#93c5fd', fontSize: 8, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {useGameStore.getState().walletAddress}
                </p>
              </div>

              {/* Assets */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {[
                  { e: '💰', v: coins, l: 'Coins', bc: 'rgba(234,179,8,0.1)', brd: 'rgba(234,179,8,0.2)' },
                  { e: '💎', v: gems, l: 'Gemas', bc: 'rgba(168,85,247,0.1)', brd: 'rgba(168,85,247,0.2)' },
                  { e: '🐾', v: `${pets.filter(p => p.isNFT).length}/${pets.length}`, l: 'NFTs', bc: 'rgba(6,182,212,0.1)', brd: 'rgba(6,182,212,0.2)' },
                ].map((a, i) => (
                  <div key={i} style={{
                    background: a.bc, border: `1px solid ${a.brd}`, borderRadius: 10,
                    padding: '8px 4px', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 16 }}>{a.e}</p>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 12, marginTop: 2 }}>{a.v}</p>
                    <p style={{ color: '#6b7280', fontSize: 7 }}>{a.l}</p>
                  </div>
                ))}
              </div>

              {/* Mint button */}
              <button onClick={() => setView('mint')} className="active:scale-95 transition-transform" style={{
                width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(90deg,#06b6d4,#22d3ee)', color: 'white', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                ⛏️ Mintar NFT
                {pets.filter(p => !p.isNFT).length > 0 && (
                  <span style={{
                    background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 999, fontSize: 9,
                  }}>{pets.filter(p => !p.isNFT).length}</span>
                )}
              </button>
            </div>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
