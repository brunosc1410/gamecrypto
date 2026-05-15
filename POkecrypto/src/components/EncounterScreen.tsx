import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS, RARITY_COLORS } from '../data/pets';
import PetSprite from './PetSprite';
import { CryptoBallIcon } from './PixelIcons';

/* Pixel art CryptoBall for the throw animation — larger & detailed */
function ThrowBall({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 6px rgba(124,58,237,0.5))' }}>
      <rect x="5" y="1" width="6" height="1" fill="#7c3aed" />
      <rect x="3" y="2" width="10" height="1" fill="#7c3aed" />
      <rect x="2" y="3" width="12" height="1" fill="#8b5cf6" />
      <rect x="2" y="4" width="12" height="1" fill="#8b5cf6" />
      <rect x="1" y="5" width="14" height="1" fill="#a78bfa" />
      <rect x="1" y="6" width="14" height="1" fill="#a78bfa" />
      <rect x="1" y="7" width="14" height="1" fill="#7c3aed" />
      <rect x="4" y="3" width="2" height="1" fill="#c4b5fd" />
      <rect x="3" y="4" width="1" height="1" fill="#c4b5fd" />
      <rect x="4" y="4" width="1" height="1" fill="#ddd6fe" />
      <rect x="1" y="8" width="14" height="1" fill="#1e1b4b" />
      <rect x="6" y="7" width="4" height="3" fill="#1e1b4b" />
      <rect x="7" y="7" width="2" height="1" fill="#e0e7ff" />
      <rect x="7" y="8" width="2" height="1" fill="#c7d2fe" />
      <rect x="7" y="9" width="2" height="1" fill="#e0e7ff" />
      <rect x="7" y="7" width="1" height="1" fill="#f8fafc" />
      <rect x="1" y="9" width="14" height="1" fill="#4c1d95" />
      <rect x="1" y="10" width="14" height="1" fill="#3b0764" />
      <rect x="2" y="11" width="12" height="1" fill="#3b0764" />
      <rect x="2" y="12" width="12" height="1" fill="#2e1065" />
      <rect x="3" y="13" width="10" height="1" fill="#2e1065" />
      <rect x="5" y="14" width="6" height="1" fill="#1e1b4b" />
    </svg>
  );
}

export default function EncounterScreen() {
  const {
    encounter, throwBall, setEncounterPhase, resolveCapture,
    finishEncounter, fleeBattle, startBattleFromEncounter, cryptoBalls, encounterMode,
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
  const autoActed = useRef(false);

  // Auto-show pet on appearing
  useEffect(() => {
    if (encounter.phase === 'appearing') {
      const t = setTimeout(() => setEncounterPhase('ready'), 800);
      return () => clearTimeout(t);
    }
  }, [encounter.phase, setEncounterPhase]);

  // Auto-action based on encounterMode
  useEffect(() => {
    if (encounter.phase !== 'ready' || autoActed.current || !pet) return;
    if (encounterMode === 'manual') return;

    autoActed.current = true;
    const t = setTimeout(() => {
      if (encounterMode === 'auto-flee') {
        fleeBattle();
      } else if (encounterMode === 'auto-battle') {
        startBattleFromEncounter(pet);
      } else if (encounterMode === 'auto-capture') {
        handleThrow();
      }
    }, 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounter.phase, encounterMode, pet]);

  // Reset autoActed when encounter changes
  useEffect(() => {
    autoActed.current = false;
  }, [encounter.wildPet?.id]);

  // Show result message
  useEffect(() => {
    if (result === 'caught') setMsg(`🎉 ${pet?.name} foi capturado!`);
    else if (result === 'fled') setMsg(`💨 ${pet?.name} fugiu!`);
    else if (result === 'broke-free') setMsg(`😤 ${pet?.name} escapou!`);
  }, [result, pet?.name]);

  // Auto-finish after result (for auto modes)
  useEffect(() => {
    if (!result || encounterMode === 'manual') return;
    if (result === 'caught' || result === 'fled') {
      const t = setTimeout(() => finishEncounter(), 1500);
      return () => clearTimeout(t);
    }
    if (result === 'broke-free' && encounterMode === 'auto-capture') {
      const t = setTimeout(() => {
        setResult(null);
        setMsg('');
        if (cryptoBalls > 0) handleThrow();
        else finishEncounter();
      }, 1200);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, encounterMode]);

  if (!pet) return null;

  const handleThrow = () => {
    if (busy || cryptoBalls <= 0) return;
    setBusy(true);
    setResult(null);
    setMsg('');
    setShakes(0);
    setBallAnim('throwing');
    throwBall();

    timer.current = setTimeout(() => {
      setBallAnim('shaking');
      setPetVisible(false);

      let shakeCount = 0;
      const shakeInterval = setInterval(() => {
        shakeCount++;
        setShakes(shakeCount);

        if (shakeCount >= 3) {
          clearInterval(shakeInterval);
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
    }, 700);
  };

  const showThrow = !result || result === 'broke-free';
  const showResult = result === 'caught' || result === 'fled';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>🌿 Encontro!</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <CryptoBallIcon size={14} />
          <span style={{ color: '#06b6d4', fontSize: 11, fontWeight: 700 }}>{cryptoBalls}</span>
          {encounterMode !== 'manual' && (
            <span style={{ color: '#f59e0b', fontSize: 8, fontWeight: 700, background: '#f59e0b18', padding: '2px 6px', borderRadius: 4 }}>
              {encounterMode === 'auto-battle' ? '⚔️ AUTO' : encounterMode === 'auto-capture' ? '🔮 AUTO' : '🏃 AUTO'}
            </span>
          )}
        </div>
      </div>

      {/* Battle area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #0a1a2a 0%, #0a2a1a 50%, #1a2a1a 100%)' }}>
        {/* Wild pet info */}
        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
            {pet.name} {ELEMENT_EMOJIS[pet.element]}
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 3 }}>
            <span style={{ color: RARITY_COLORS[pet.rarity], fontSize: 10, fontWeight: 700 }}>{pet.rarity.toUpperCase()}</span>
            <span style={{ color: '#facc15', fontSize: 10 }}>Lv.{pet.stats.level}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 4, fontSize: 9, color: '#9ca3af' }}>
            <span>❤️{pet.stats.maxHp}</span>
            <span>⚔️{pet.stats.attack}</span>
            <span>🛡️{pet.stats.defense}</span>
            <span>💨{pet.stats.speed}</span>
          </div>
        </div>

        {/* Pet — hide when caught or fled */}
        {petVisible && result !== 'caught' && result !== 'fled' && (
          <div className="animate-wild-idle" style={{
            position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)',
          }}>
            <PetSprite pet={pet} size={110} animate showParticles />
          </div>
        )}

        {/* CryptoBall animation — pixel art */}
        {ballAnim !== 'hidden' && (
          <div
            className={ballAnim === 'throwing' ? 'animate-ball-throw' : 'animate-ball-shake'}
            style={{
              position: 'absolute', left: '50%', bottom: '30%', zIndex: 20,
            }}
          >
            <ThrowBall size={44} />
          </div>
        )}

        {/* Trail particles during throw */}
        {ballAnim === 'throwing' && (
          <>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                position: 'absolute', left: `${48 + (Math.random() * 4)}%`, bottom: `${10 + i * 6}%`,
                width: 4, height: 4, borderRadius: '50%',
                background: '#a78bfa', opacity: 0.4 - i * 0.07,
                animation: 'fade-in 0.2s ease-out',
                animationDelay: `${i * 0.08}s`,
              }} />
            ))}
          </>
        )}

        {/* Sparkles on catch */}
        {sparkle && result === 'caught' && (
          <div style={{ position: 'absolute', top: '38%', left: '50%', zIndex: 30 }}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} className="animate-sparkle-burst" style={{
                position: 'absolute', '--angle': `${i * 45}deg`, fontSize: 16,
              } as React.CSSProperties}>✨</div>
            ))}
            <span style={{ fontSize: 36, position: 'relative', zIndex: 31 }}>✨</span>
          </div>
        )}

        {/* Fled — big centered display */}
        {result === 'fled' && (
          <div style={{
            position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 60 }}>💨</p>
            <p style={{ color: '#f87171', fontWeight: 900, fontSize: 18, marginTop: 8 }}>{pet.name} fugiu!</p>
          </div>
        )}

        {/* Message */}
        {msg && (
          <div style={{
            position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)', color: 'white', padding: '8px 18px',
            borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 20,
          }}>{msg}</div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{
        flexShrink: 0, padding: '14px 20px', background: '#111128', borderTop: '1px solid #252550',
        minHeight: 80,
      }}>
        {/* Shake indicators */}
        {busy && (
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i <= shakes ? '#22c55e' : '#374151',
                  transition: 'background 0.3s',
                  boxShadow: i <= shakes ? '0 0 6px #22c55e50' : 'none',
                }} />
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: 10 }}>
              {ballAnim === 'throwing' ? '🔮 Lançando...' : `Balançando... ${shakes}/3`}
            </p>
          </div>
        )}

        {/* Action buttons (manual mode) */}
        {!busy && showThrow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handleThrow} disabled={cryptoBalls <= 0}
              className="active:scale-95 transition-transform" style={{
                width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: cryptoBalls > 0 ? 'linear-gradient(90deg,#06b6d4,#22d3ee)' : '#374151',
                color: 'white', fontSize: 13, fontWeight: 700, opacity: cryptoBalls > 0 ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
              <CryptoBallIcon size={16} /> Lançar ({cryptoBalls})
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => startBattleFromEncounter(pet)} className="active:scale-95 transition-transform" style={{
                padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(90deg,#dc2626,#ef4444)', color: 'white', fontSize: 11, fontWeight: 700,
              }}>⚔️ Batalhar</button>
              <button onClick={() => fleeBattle()} className="active:scale-95 transition-transform" style={{
                padding: '10px 0', borderRadius: 10, border: '1px solid #374151', background: 'none',
                color: '#9ca3af', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>🏃 Fugir</button>
            </div>
          </div>
        )}

        {/* Final results */}
        {!busy && showResult && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: result === 'caught' ? '#4ade80' : '#f87171', fontWeight: 900, fontSize: 16, marginBottom: 6 }}>
              {result === 'caught' ? '🎉 CAPTURADO!' : '💨 FUGIU!'}
            </p>
            <button onClick={finishEncounter} className="active:scale-95 transition-transform" style={{
              width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: 'white', fontSize: 13, fontWeight: 700,
            }}>✓ Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
}
