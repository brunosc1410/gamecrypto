import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS, RARITY_COLORS } from '../data/pets';
import PetSprite from './PetSprite';

export default function EncounterScreen() {
  const {
    encounter, throwBall, setEncounterPhase, resolveCapture,
    finishEncounter, fleeBattle, startBattleFromEncounter, cryptoBalls,
  } = useGameStore();

  const pet = encounter.wildPet;
  const [busy, setBusy] = useState(false);
  const [shakes, setShakes] = useState(0);
  const [result, setResult] = useState<'caught' | 'fled' | 'broke-free' | null>(null);
  const [sparkle, setSparkle] = useState(false);
  const [ballAnim, setBallAnim] = useState<'hidden' | 'throwing' | 'shaking'>('hidden');
  const [petVisible, setPetVisible] = useState(true);
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-show pet on appearing
  useEffect(() => {
    if (encounter.phase === 'appearing') {
      const t = setTimeout(() => {
        setEncounterPhase('ready');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [encounter.phase, setEncounterPhase]);

  // Show result message
  useEffect(() => {
    if (result === 'caught') setMsg(`🎉 ${pet?.name} foi capturado!`);
    else if (result === 'fled') setMsg(`💨 ${pet?.name} fugiu!`);
    else if (result === 'broke-free') setMsg(`😤 ${pet?.name} escapou da bola!`);
  }, [result, pet?.name]);

  if (!pet) return null;

  const handleThrow = () => {
    if (busy || cryptoBalls <= 0) return;
    setBusy(true);
    setResult(null);
    setMsg('');
    setShakes(0);
    setBallAnim('throwing');
    throwBall();

    // Throwing animation
    timer.current = setTimeout(() => {
      setBallAnim('shaking');
      setPetVisible(false);

      // Shake animation (3 shakes)
      let shakeCount = 0;
      const shakeInterval = setInterval(() => {
        shakeCount++;
        setShakes(shakeCount);

        if (shakeCount >= 3) {
          clearInterval(shakeInterval);

          // Resolve capture
          setTimeout(() => {
            const outcome = resolveCapture();
            setResult(outcome);
            setBallAnim('hidden');

            if (outcome === 'caught') {
              setSparkle(true);
              setTimeout(() => setSparkle(false), 1500);
            } else {
              setPetVisible(true);
            }
            setBusy(false);
          }, 600);
        }
      }, 600);
    }, 600);
  };

  const handleBattle = () => {
    startBattleFromEncounter(pet);
  };

  const handleFlee = () => {
    fleeBattle();
  };

  const handleFinish = () => {
    finishEncounter();
  };

  const showThrow = !result || result === 'broke-free';
  const showResult = result === 'caught' || result === 'fled';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>🌿 Encontro!</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#06b6d4', fontSize: 12, fontWeight: 700 }}>🔮 {cryptoBalls}</span>
        </div>
      </div>

      {/* Battle area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #0a1a2a 0%, #0a2a1a 50%, #1a2a1a 100%)' }}>
        {/* Wild pet info */}
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
            {pet.name} {ELEMENT_EMOJIS[pet.element]}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 4 }}>
            <span style={{ color: RARITY_COLORS[pet.rarity], fontSize: 11, fontWeight: 700 }}>{pet.rarity.toUpperCase()}</span>
            <span style={{ color: '#facc15', fontSize: 11 }}>Lv.{pet.stats.level}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 6, fontSize: 10, color: '#9ca3af' }}>
            <span>❤️ {pet.stats.maxHp}</span>
            <span>⚔️ {pet.stats.attack}</span>
            <span>🛡️ {pet.stats.defense}</span>
            <span>💨 {pet.stats.speed}</span>
          </div>
        </div>

        {/* Pet */}
        {petVisible && result !== 'caught' && (
          <div className="animate-wild-idle" style={{
            position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
          }}>
            <PetSprite pet={pet} size={120} animate showParticles />
          </div>
        )}

        {/* Ball animation */}
        {ballAnim !== 'hidden' && (
          <div className={ballAnim === 'throwing' ? 'animate-ball-throw' : 'animate-ball-shake'} style={{
            position: 'absolute', left: '50%', bottom: '30%',
            fontSize: 32, zIndex: 20,
          }}>🔮</div>
        )}

        {/* Sparkles on catch */}
        {sparkle && result === 'caught' && (
          <div style={{ position: 'absolute', top: '35%', left: '50%', zIndex: 30 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="animate-sparkle-burst" style={{
                position: 'absolute',
                '--angle': `${i * 45}deg`,
                fontSize: 16,
              } as React.CSSProperties}>✨</div>
            ))}
            <span style={{ fontSize: 40, position: 'relative', zIndex: 31 }}>✨</span>
          </div>
        )}

        {/* Fled */}
        {result === 'fled' && (
          <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 60 }}>💨</div>
        )}

        {/* Message */}
        {msg && (
          <div style={{
            position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 20px',
            borderRadius: 12, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 20,
          }}>{msg}</div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{
        flexShrink: 0, padding: '16px 24px', background: '#111128', borderTop: '1px solid #252550',
        minHeight: 100,
      }}>
        {/* Shake indicators */}
        {busy && (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: i <= shakes ? '#22c55e' : '#374151',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: 11 }}>
              {ballAnim === 'throwing' ? '🔮 Lançando...' : ballAnim === 'shaking' ? `Balançando... ${shakes}/3` : '...'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!busy && showThrow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleThrow}
              disabled={cryptoBalls <= 0}
              className="active:scale-95 transition-transform"
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: cryptoBalls > 0 ? 'linear-gradient(90deg,#06b6d4,#22d3ee)' : '#374151',
                color: 'white', fontSize: 14, fontWeight: 700,
                opacity: cryptoBalls > 0 ? 1 : 0.5,
              }}
            >🔮 Lançar CryptoBall ({cryptoBalls})</button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={handleBattle} className="active:scale-95 transition-transform" style={{
                padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(90deg,#dc2626,#ef4444)', color: 'white', fontSize: 12, fontWeight: 700,
              }}>⚔️ Batalhar</button>
              <button onClick={handleFlee} className="active:scale-95 transition-transform" style={{
                padding: '12px 0', borderRadius: 12, border: '1px solid #374151', background: 'none',
                color: '#9ca3af', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>🏃 Fugir</button>
            </div>
          </div>
        )}

        {/* Final results */}
        {!busy && showResult && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {result === 'caught' ? '🎉' : '💨'}
            </div>
            <p style={{ color: result === 'caught' ? '#4ade80' : '#f87171', fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
              {result === 'caught' ? 'CAPTURADO!' : 'FUGIU!'}
            </p>
            <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>
              {result === 'caught'
                ? `${pet.name} foi adicionado à sua coleção!`
                : `${pet.name} escapou antes da captura.`}
            </p>
            <button onClick={handleFinish} className="active:scale-95 transition-transform" style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: 'white', fontSize: 14, fontWeight: 700,
            }}>✓ Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
}
