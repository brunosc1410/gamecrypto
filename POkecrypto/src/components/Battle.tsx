import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS } from '../data/pets';
import PetSprite from './PetSprite';

export default function Battle() {
  const { battle, processBattleTurn, endBattle, setBattleSpeed, setScreen, clearBattleAnimation, coins, isVip } = useGameStore();
  const logRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postBattleStartedRef = useRef(false);
  const [displayExp, setDisplayExp] = useState(0);
  const [displayExpToNext, setDisplayExpToNext] = useState(100);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [expGainText, setExpGainText] = useState<number | null>(null);
  const [speedConfirm, setSpeedConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (battle.isActive && battle.isAutoPlaying && !battle.winner && speedConfirm === null) {
      intervalRef.current = setInterval(processBattleTurn, battle.battleSpeed);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [battle.isActive, battle.isAutoPlaying, battle.winner, battle.battleSpeed, processBattleTurn, speedConfirm]);

  useEffect(() => {
    if (battle.playerPet) {
      setDisplayExp(battle.playerPet.stats.exp);
      setDisplayExpToNext(battle.playerPet.stats.expToNext);
      setDisplayLevel(battle.playerPet.stats.level);
      setExpGainText(null);
      postBattleStartedRef.current = false;
    }
  }, [battle.playerPet?.id, battle.isActive]);

  useEffect(() => {
    if (!battle.winner || !battle.playerPet || postBattleStartedRef.current) return;
    postBattleStartedRef.current = true;
    const expGain = battle.winner === 'player'
      ? 30 + (battle.enemyPet?.stats.level ?? 1) * 10
      : 10 + (battle.enemyPet?.stats.level ?? 1) * 3;
    setExpGainText(expGain);

    const timer = setTimeout(() => {
      setExpGainText(null);
      endBattle();
    }, 2500);
    return () => clearTimeout(timer);
  }, [battle.winner, battle.playerPet?.id, endBattle]);

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
          <button onClick={() => setScreen('collection')} className="game-btn bg-yellow-600 text-white">↪ Coleção</button>
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
    if (t === 'lose') return '#f87171';
    if (t === 'info') return '#60a5fa';
    return '#d1d5db';
  };

  const requestBattleSpeedChange = (speed: number) => {
    if (speed === battle.battleSpeed) return;
    setSpeedConfirm(speed);
  };

  const confirmBattleSpeedChange = () => {
    if (speedConfirm === null) return;
    if (speedConfirm === 700 && !isVip) {
      if (coins < 1000) return;
      useGameStore.setState((s) => ({ coins: s.coins - 1000 }));
    }
    setBattleSpeed(speedConfirm);
    setSpeedConfirm(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f0f2e', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '16px 28px 14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <p style={{ color: '#f87171', fontWeight: 700, fontSize: 14 }}>⚔️ Arena</p>
          <p style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>Turno {battle.turn}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { l: '1x', s: 2000 },
            { l: '2x', s: 1200 },
            { l: '5x', s: 700 },
          ].map((sp) => (
            <button key={sp.l} onClick={() => requestBattleSpeedChange(sp.s)} className="active:scale-90 transition-transform" style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer',
              background: battle.battleSpeed === sp.s ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.05)',
              border: battle.battleSpeed === sp.s ? '1px solid rgba(250,204,21,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: battle.battleSpeed === sp.s ? '#facc15' : '#6b7280',
            }}>{sp.l}{sp.s === 700 ? (!isVip ? '💰' : '👑') : ''}</button>
          ))}
        </div>
      </div>

      {/* Speed confirm modal */}
      {speedConfirm !== null && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#111128', border: '1px solid #252550', borderRadius: 18,
            padding: 22, textAlign: 'center', maxWidth: 290, width: '100%',
          }}>
            <p style={{ fontSize: 28, marginBottom: 6 }}>{speedConfirm === 700 ? '⚡' : speedConfirm === 1200 ? '🏃' : '⏱️'}</p>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
              Ativar velocidade {speedConfirm === 2000 ? '1x' : speedConfirm === 1200 ? '2x' : '5x'}?
            </p>
            {speedConfirm === 700 && !isVip ? (
              <>
                <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 8 }}>Modo 5x custa</p>
                <p style={{ color: '#eab308', fontWeight: 700, fontSize: 16, marginTop: 4 }}>💰 1000 moedas</p>
                <p style={{ color: '#6b7280', fontSize: 9, marginTop: 4 }}>Saldo: 💰 {coins}</p>
              </>
            ) : speedConfirm === 700 && isVip ? (
              <p style={{ color: '#4ade80', fontSize: 11, marginTop: 8 }}>👑 5x grátis para VIP!</p>
            ) : (
              <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 8 }}>Deseja mesmo mudar a velocidade da batalha?</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              <button onClick={() => setSpeedConfirm(null)} style={{
                padding: '10px 0', borderRadius: 10, border: '1px solid #374151', background: 'none',
                color: '#9ca3af', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>Cancelar</button>
              <button
                onClick={confirmBattleSpeedChange}
                disabled={speedConfirm === 700 && !isVip && coins < 1000}
                className="active:scale-95 transition-transform"
                style={{
                  padding: '10px 0', borderRadius: 10, border: 'none',
                  cursor: speedConfirm === 700 && !isVip && coins < 1000 ? 'not-allowed' : 'pointer',
                  background: speedConfirm === 700 && !isVip && coins < 1000 ? '#374151' : 'linear-gradient(90deg,#16a34a,#22c55e)',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  opacity: speedConfirm === 700 && !isVip && coins < 1000 ? 0.5 : 1,
                }}
              >✓ Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Battle field */}
      <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(180deg, #0a0a2e 0%, #151535 50%, #1a2a1a 100%)', overflow: 'hidden' }}>
        {/* Enemy */}
        <div style={{ position: 'absolute', top: '10%', right: '15%', textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: '#f87171', fontWeight: 700, fontSize: 13 }}>{battle.enemyPet.name} {ELEMENT_EMOJIS[battle.enemyPet.element]}</p>
            <p style={{ color: '#6b7280', fontSize: 10 }}>Lv.{battle.enemyPet.stats.level}</p>
            <div style={{ width: 120, height: 8, background: '#1f2937', borderRadius: 99, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ height: '100%', borderRadius: 99, background: hpC(eHp), width: `${eHp}%`, transition: 'width 0.3s' }} />
            </div>
            <p style={{ color: '#9ca3af', fontSize: 9, marginTop: 2 }}>{battle.enemyCurrentHp}/{battle.enemyPet.stats.maxHp}</p>
          </div>
          <div className={eClass} style={{ width: 100, height: 100, margin: '0 auto', transform: 'scaleX(-1)' }}>
            <PetSprite pet={battle.enemyPet} size={100} animate showParticles={false} />
          </div>
          {battle.showDamage.enemy !== null && (
            <div className="animate-damage-float" style={{ position: 'absolute', top: -10, left: '50%', color: '#f87171', fontWeight: 900, fontSize: 20, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              -{battle.showDamage.enemy}
            </div>
          )}
        </div>

        {/* Player */}
        <div style={{ position: 'absolute', bottom: '15%', left: '15%', textAlign: 'center' }}>
          <div className={pClass} style={{ width: 110, height: 110, margin: '0 auto' }}>
            <PetSprite pet={battle.playerPet} size={110} animate showParticles={false} />
          </div>
          {battle.showDamage.player !== null && (
            <div className="animate-damage-float" style={{ position: 'absolute', top: -10, left: '50%', color: '#f87171', fontWeight: 900, fontSize: 20, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              -{battle.showDamage.player}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>{battle.playerPet.name} {ELEMENT_EMOJIS[battle.playerPet.element]}</p>
            <p style={{ color: '#facc15', fontSize: 10 }}>Lv.{displayLevel}</p>
            <div style={{ width: 130, height: 8, background: '#1f2937', borderRadius: 99, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ height: '100%', borderRadius: 99, background: hpC(pHp), width: `${pHp}%`, transition: 'width 0.3s' }} />
            </div>
            <p style={{ color: '#9ca3af', fontSize: 9, marginTop: 2 }}>{battle.playerCurrentHp}/{battle.playerPet.stats.maxHp}</p>
            {/* EXP bar */}
            <div style={{ width: 130, height: 5, background: '#1f2937', borderRadius: 99, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ height: '100%', borderRadius: 99, background: '#60a5fa', width: `${(displayExp / displayExpToNext) * 100}%`, transition: 'width 0.2s' }} />
            </div>
            {expGainText !== null && (
              <p style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, marginTop: 4 }}>+{expGainText} EXP</p>
            )}
          </div>
        </div>

        {/* Winner overlay */}
        {battle.winner && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', background: '#111128', borderRadius: 20, padding: '24px 40px', border: '1px solid #252550' }}>
              <p style={{ fontSize: 36 }}>{battle.winner === 'player' ? '🎉' : '😢'}</p>
              <p style={{ color: battle.winner === 'player' ? '#4ade80' : '#f87171', fontWeight: 900, fontSize: 18, marginTop: 8 }}>
                {battle.winner === 'player' ? 'VITÓRIA!' : 'DERROTA'}
              </p>
              {battle.winner === 'player' && (
                <p style={{ color: '#eab308', fontSize: 12, marginTop: 8 }}>
                  +💰{100 + (battle.enemyPet?.stats.level ?? 1) * 20}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Battle log */}
      <div ref={logRef} style={{
        height: 120, flexShrink: 0, overflowY: 'auto', padding: '10px 20px',
        background: '#0a0a1a', borderTop: '1px solid #252550',
      }}>
        {battle.logs.slice(-8).map((log) => (
          <p key={log.id} style={{ color: logColor(log.type), fontSize: 11, marginBottom: 4, lineHeight: 1.3 }}>
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}
