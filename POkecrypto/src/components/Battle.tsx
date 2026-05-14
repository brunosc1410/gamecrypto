import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS } from '../data/pets';
import { BattleSprite } from './BattleSprite';

export default function Battle() {
  const { battle, processBattleTurn, endBattle, setBattleSpeed, setScreen, clearBattleAnimation, explore } = useGameStore();
  const logRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (battle.isActive && battle.isAutoPlaying && !battle.winner) {
      intervalRef.current = setInterval(processBattleTurn, battle.battleSpeed);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [battle.isActive, battle.isAutoPlaying, battle.winner, battle.battleSpeed, processBattleTurn]);

  useEffect(() => {
    if (battle.currentAnimation.type !== 'idle' && battle.currentAnimation.type !== 'none') {
      animTimer.current = setTimeout(clearBattleAnimation, battle.currentAnimation.duration);
      return () => { if (animTimer.current) clearTimeout(animTimer.current); };
    }
  }, [battle.currentAnimation, clearBattleAnimation]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [battle.logs]);

  if (!battle.playerPet || !battle.enemyPet) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f2e' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ color: '#facc15', fontSize: 16, marginBottom: 16 }}>Selecione um pet!</p>
          <button onClick={() => setScreen('collection')} className="game-btn bg-yellow-600 text-white">← Coleção</button>
        </div>
      </div>
    );
  }

  const pHp = Math.max(0, (battle.playerCurrentHp / battle.playerPet.stats.maxHp) * 100);
  const eHp = Math.max(0, (battle.enemyCurrentHp / battle.enemyPet.stats.maxHp) * 100);
  const hpC = (p: number) => (p > 50 ? '#22c55e' : p > 25 ? '#eab308' : '#ef4444');
  const a = battle.currentAnimation.type;

  const pClass =
    a === 'attack-player' ? 'animate-attack-right' :
    a === 'hit-player' ? 'animate-shake-hit' :
    a === 'faint-player' ? 'animate-faint' :
    battle.winner === 'player' ? 'animate-victory' : 'animate-idle-bounce';

  const eClass =
    a === 'attack-enemy' ? 'animate-attack-left' :
    a === 'hit-enemy' ? 'animate-shake-hit' :
    a === 'faint-enemy' ? 'animate-faint' :
    battle.winner === 'enemy' ? 'animate-victory' : 'animate-idle-float';

  const logColor = (t: string) => {
    if (t === 'critical') return '#f87171';
    if (t === 'win') return '#4ade80';
    if (t === 'lose') return '#ef4444';
    if (t === 'miss') return '#6b7280';
    if (t === 'attack') return '#fdba74';
    if (t === 'info') return '#93c5fd';
    return '#d1d5db';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(180deg,#151542 0%,#0a0a22 48%,#142219 100%)' }}>
      {/* Header */}
      <div style={{ padding: '16px 28px 14px 28px', background: '#111128', borderBottom: '1px solid #252550', flexShrink: 0 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <button
            onClick={() => setScreen(explore.isExploring ? 'explore' : 'collection')}
            style={{ background: 'none', border: 'none', color: '#facc15', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
          >
            ← {battle.winner ? 'Sair' : 'Fugir'}
          </button>

          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            <p style={{ color: '#f87171', fontWeight: 700, fontSize: 14 }}>⚔️ Arena</p>
            <p style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>Turno {battle.turn}</p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {[{ l: '1x', s: 1500 }, { l: '2x', s: 800 }, { l: '5x', s: 300 }].map((sp) => (
              <button
                key={sp.l}
                onClick={() => setBattleSpeed(sp.s)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  border: '1px solid transparent',
                  background: battle.battleSpeed === sp.s ? 'rgba(250,204,21,0.18)' : 'rgba(255,255,255,0.05)',
                  color: battle.battleSpeed === sp.s ? '#facc15' : '#9ca3af',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {sp.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arena */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/arena-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.42) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Enemy area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 28px 8px 28px', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 16, left: 24, right: 24,
              background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16,
              padding: '12px 14px', zIndex: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{battle.enemyPet.name}</span>
                <span style={{ color: '#9ca3af', fontSize: 11, flexShrink: 0 }}>{ELEMENT_EMOJIS[battle.enemyPet.element]} Lv.{battle.enemyPet.stats.level}</span>
              </div>
              <div style={{ height: 12, background: '#1f2937', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 9999, width: `${eHp}%`, background: hpC(eHp), transition: 'width 0.3s' }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: 11, marginTop: 6, textAlign: 'right' }}>{battle.enemyCurrentHp}/{battle.enemyPet.stats.maxHp}</p>
            </div>

            <div style={{ position: 'relative', marginTop: 50 }}>
              {battle.showDamage.enemy !== null && (
                <div style={{ position: 'absolute', top: -32, left: '50%', zIndex: 30 }} className="animate-damage-float">
                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: 20 }}>-{battle.showDamage.enemy}</span>
                </div>
              )}
              <BattleSprite
                pet={battle.enemyPet}
                className={`w-28 h-28 sm:w-36 sm:h-36 ${eClass}`}
                style={{
                  transform: 'scaleX(-1)',
                  opacity: battle.winner === 'player' ? 0.3 : 1,
                  filter: battle.enemyCurrentHp <= 0 ? 'grayscale(1) brightness(0.4)' : undefined,
                }}
              />
            </div>
          </div>

          {/* Center badge */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 6px 0', zIndex: 20 }}>
            {!battle.winner ? (
              <div style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(250,204,21,0.16)', borderRadius: 9999, padding: '7px 18px' }}>
                <span className="game-font text-yellow-400 text-sm animate-pulse">VS</span>
              </div>
            ) : (
              <div style={{
                padding: '10px 18px', borderRadius: 16, border: `2px solid ${battle.winner === 'player' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                background: battle.winner === 'player' ? 'rgba(20,83,45,0.55)' : 'rgba(127,29,29,0.55)',
              }} className="anim-bounce">
                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{battle.winner === 'player' ? '🏆 VITÓRIA!' : '💀 DERROTA!'}</span>
              </div>
            )}
          </div>

          {/* Player area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px 28px 20px 28px', position: 'relative' }}>
            <div style={{ position: 'relative', marginBottom: 52 }}>
              {battle.showDamage.player !== null && (
                <div style={{ position: 'absolute', top: -32, left: '50%', zIndex: 30 }} className="animate-damage-float">
                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: 20 }}>-{battle.showDamage.player}</span>
                </div>
              )}
              <BattleSprite
                pet={battle.playerPet}
                className={`w-32 h-32 sm:w-40 sm:h-40 ${pClass}`}
                style={{
                  opacity: battle.winner === 'enemy' ? 0.3 : 1,
                  filter: battle.playerCurrentHp <= 0 ? 'grayscale(1) brightness(0.4)' : undefined,
                }}
              />
            </div>

            <div style={{
              position: 'absolute', bottom: 16, left: 24, right: 24,
              background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(34,197,94,0.18)', borderRadius: 16,
              padding: '12px 14px', zIndex: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{battle.playerPet.name}</span>
                <span style={{ color: '#9ca3af', fontSize: 11, flexShrink: 0 }}>{ELEMENT_EMOJIS[battle.playerPet.element]} Lv.{battle.playerPet.stats.level}</span>
              </div>
              <div style={{ height: 12, background: '#1f2937', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 9999, width: `${pHp}%`, background: hpC(pHp), transition: 'width 0.3s' }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: 11, marginTop: 6, textAlign: 'right' }}>{battle.playerCurrentHp}/{battle.playerPet.stats.maxHp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div style={{ flexShrink: 0, background: '#111128', borderTop: '1px solid #252550' }}>
        {battle.winner && (
          <div style={{ padding: '14px 24px 12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 10,
            }}>
              <button
                onClick={endBattle}
                className="game-btn text-[10px] bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                style={{ width: '100%', paddingTop: 14, paddingBottom: 14 }}
              >
                ✓ Coletar Recompensa
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: '14px 24px 16px 24px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>Log da batalha</p>
            </div>
            <div ref={logRef} style={{ height: 112, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }} className="scrollbar-thin">
              {battle.logs.map((log) => (
                <p key={log.id} style={{ fontSize: 12, lineHeight: 1.45, color: logColor(log.type) }}>{log.message}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
