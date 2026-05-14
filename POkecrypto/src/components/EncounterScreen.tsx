import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ELEMENT_EMOJIS, RARITY_COLORS, ZONES } from '../data/pets';
import PetSprite from './PetSprite';

// Simple sequential animation using promises
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export default function EncounterScreen() {
  const encounter = useGameStore((s) => s.encounter);
  const explore = useGameStore((s) => s.explore);
  const cryptoBalls = useGameStore((s) => s.cryptoBalls);
  const coins = useGameStore((s) => s.coins);
  const throwBall = useGameStore((s) => s.throwBall);
  const resolveCapture = useGameStore((s) => s.resolveCapture);
  const finishEncounter = useGameStore((s) => s.finishEncounter);
  const fleeBattle = useGameStore((s) => s.fleeBattle);
  const startBattleFromEncounter = useGameStore((s) => s.startBattleFromEncounter);
  const addCoins = useGameStore((s) => s.addCoins);

  // All visual state is local - no complex effects
  const [petVisible, setPetVisible] = useState(false);
  const [ballAnim, setBallAnim] = useState<'hidden'|'throwing'|'landed'|'shaking'>('hidden');
  const [shakes, setShakes] = useState(0);
  const [result, setResult] = useState<'none'|'caught'|'escaped'|'fled'>('none');
  const [busy, setBusy] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [msg, setMsg] = useState('');
  const mounted = useRef(true);

  const pet = encounter.wildPet;
  const zone = ZONES.find(z => z.id === explore.currentZone) ?? ZONES[0];
  const maxAttempts = 3;
  const attemptsLeft = maxAttempts - encounter.attempts;

  // Appear animation on mount
  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(() => { if (mounted.current) setPetVisible(true); }, 100);
    const t2 = setTimeout(() => { if (mounted.current) setMsg(`${pet?.name} selvagem apareceu!`); }, 600);
    return () => { mounted.current = false; clearTimeout(t); clearTimeout(t2); };
  }, []);

  // The entire throw sequence as one async function - no effects, no callbacks
  const doThrow = async () => {
    if (busy || !pet) return;
    if (cryptoBalls <= 0) { setMsg('Sem CryptoBalls!'); return; }
    if (attemptsLeft <= 0) return;

    setBusy(true);
    setResult('none');
    setMsg('');
    setShakes(0);

    // 1) Throw ball
    throwBall(); // deducts 1 ball in store
    setBallAnim('throwing');
    await wait(600);
    if (!mounted.current) return;

    // 2) Ball lands
    setBallAnim('landed');
    await wait(300);
    if (!mounted.current) return;

    // 3) Shake 1-3 times
    setBallAnim('shaking');
    for (let i = 1; i <= 3; i++) {
      setShakes(i);
      await wait(700);
      if (!mounted.current) return;

      // Each shake can fail early (harder pets break earlier)
      if (i < 3) {
        const breakChance = 1 - (encounter.catchChance + 0.15);
        if (Math.random() < breakChance * 0.4) {
          // Broke free early
          setBallAnim('hidden');
          setShakes(0);
          // Check flee
          const fleeRoll = Math.random();
          const fChance = encounter.fleeChance + encounter.attempts * 0.1;
          if (fleeRoll < fChance) {
            setResult('fled');
            setPetVisible(false);
            setMsg(`💨 ${pet.name} fugiu!`);
            useGameStore.getState().setEncounterPhase('fled');
          } else {
            setResult('escaped');
            setMsg(`${pet.name} escapou! (${attemptsLeft - 1} tentativas restantes)`);
            useGameStore.getState().setEncounterPhase('broke-free');
          }
          setBusy(false);
          return;
        }
      }
    }

    // 4) All 3 shakes done - final resolve
    if (!mounted.current) return;
    const finalResult = resolveCapture();
    setBallAnim('hidden');
    setShakes(0);

    if (finalResult === 'caught') {
      setResult('caught');
      setSparkle(true);
      setMsg(`✨ ${pet.name} foi capturado!`);
    } else if (finalResult === 'fled') {
      setResult('fled');
      setPetVisible(false);
      setMsg(`💨 ${pet.name} fugiu!`);
    } else {
      setResult('escaped');
      setMsg(`${pet.name} escapou! (${attemptsLeft - 1} tentativas restantes)`);
    }
    setBusy(false);
  };

  // Auto-catch: pay 10 coins, guaranteed catch
  const doAutoCatch = async () => {
    if (busy || !pet) return;
    if (coins < 10) { setMsg('Precisa de 10 🪙!'); return; }

    setBusy(true);
    setResult('none');
    setMsg('');
    addCoins(-10);

    setBallAnim('throwing');
    await wait(600);
    if (!mounted.current) return;
    setBallAnim('landed');
    await wait(300);
    if (!mounted.current) return;
    setBallAnim('shaking');
    for (let i = 1; i <= 3; i++) {
      setShakes(i);
      await wait(500);
      if (!mounted.current) return;
    }
    setBallAnim('hidden');
    setShakes(0);
    setSparkle(true);
    setResult('caught');
    setMsg(`✨ ${pet.name} foi capturado!`);
    useGameStore.getState().setEncounterPhase('caught');
    setBusy(false);
  };

  if (!pet) return null;

  const rColor = RARITY_COLORS[pet.rarity];
  const canAct = (!busy && result === 'none') || result === 'escaped';
  const showThrow = canAct && attemptsLeft > 0;
  const showResult = result === 'caught' || result === 'fled' || (result === 'escaped' && attemptsLeft <= 0);

  return (
    <div className="h-full flex flex-col overflow-hidden select-none" style={{ background: zone.bgGradient }}>
      {/* Header */}
      <div style={{
        padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, zIndex: 30, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
      }}>
        <button onClick={fleeBattle} disabled={busy} style={{ color: '#f87171', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', opacity: busy ? 0.4 : 1 }}>
          🏃 Fugir
        </button>
        <span style={{ color: '#eab308', fontWeight: 700, fontSize: 13 }} className="animate-pulse">⭐ PET SELVAGEM</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 13, fontWeight: 700 }}>
          <span style={{ color: '#06b6d4' }}>🔮{cryptoBalls}</span>
          <span style={{ color: '#eab308' }}>🪙{coins}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Glow */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${pet.colors.primary}20,transparent 70%)`, filter: 'blur(30px)' }} />

        {/* Info card — bigger for mobile */}
        <div style={{ margin: '16px 24px 0 24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: 16, zIndex: 10, border: `1px solid ${rColor}40` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">{pet.name}</span>
              <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: rColor + '25', color: rColor }}>
                {pet.rarity.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{ELEMENT_EMOJIS[pet.element]}</span>
              <span className="text-gray-300 font-bold text-base">Lv.{pet.stats.level}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-2.5 text-base font-semibold">
            <span className="text-red-400">❤️ {pet.stats.maxHp}</span>
            <span className="text-orange-400">⚔️ {pet.stats.attack}</span>
            <span className="text-blue-400">🛡️ {pet.stats.defense}</span>
            <span className="text-yellow-400">💨 {pet.stats.speed}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Dificuldade</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: i <= Math.ceil((1 - encounter.catchChance) * 5) ? '#ef4444' : '#374151' }} />
                ))}
              </div>
            </div>
            <span className="text-gray-300 text-base font-bold">
              {attemptsLeft}/{maxAttempts}
            </span>
          </div>
        </div>

        {/* Pet + Ball area */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Pet */}
          {petVisible && result !== 'caught' && (
            <div className={`relative transition-all duration-700 ease-out ${petVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-60 opacity-0 scale-75'}`}>
              {showThrow && !busy && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-[3px] animate-pulse-ring" style={{ borderColor: rColor + '40' }} />
                </div>
              )}
              <PetSprite pet={pet} size={176} animate={!busy} showParticles={true} />
            </div>
          )}

          {/* CryptoBall animation */}
          {ballAnim !== 'hidden' && (
            <div className={`absolute z-20 left-1/2 ${
              ballAnim === 'throwing' ? 'animate-ball-throw' : ''
            } ${ballAnim === 'shaking' || ballAnim === 'landed' ? 'animate-ball-shake bottom-[42%]' : ''}`}
              style={{ transform: 'translateX(-50%)' }}>
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#374151" strokeWidth="3" />
                  <path d="M 50 4 A 46 46 0 0 1 96 50 L 4 50 A 46 46 0 0 1 50 4 Z" fill="#06b6d4" />
                  <path d="M 4 50 A 46 46 0 0 0 96 50 L 4 50 Z" fill="#e5e7eb" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="#374151" strokeWidth="4" />
                  <circle cx="50" cy="50" r="13" fill="#f8fafc" stroke="#374151" strokeWidth="4" />
                  <circle cx="50" cy="50" r="6" fill="#06b6d4" />
                  <ellipse cx="32" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-25 32 28)" />
                </svg>
              </div>
            </div>
          )}

          {/* Sparkles on catch */}
          {sparkle && result === 'caught' && (
            <div className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="absolute w-3 h-3 animate-sparkle-burst" style={{
                  left: '50%', top: '50%',
                  backgroundColor: ['#fbbf24', '#06b6d4', '#f472b6', '#a78bfa'][i % 4],
                  borderRadius: i % 2 === 0 ? '50%' : '3px',
                  animationDelay: `${i * 0.08}s`,
                  '--angle': `${i * 45}deg`,
                } as React.CSSProperties} />
              ))}
              <div className="text-6xl animate-fade-in">✨</div>
            </div>
          )}

          {/* Fled */}
          {result === 'fled' && (
            <div className="text-center animate-fade-in"><span className="text-7xl">💨</span></div>
          )}
        </div>

        {/* Message */}
        {msg && (
          <div style={{ margin: '0 24px 16px 24px', background: 'rgba(0,0,0,0.6)', borderRadius: 16, padding: 16, zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }} className="animate-fade-in">
            <p className="text-white text-center text-lg font-bold">{msg}</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 bg-black/80 backdrop-blur-md border-t border-white/10 z-30">
        {/* Shake indicators while animating */}
        {busy && (
          <div className="p-5 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  i <= shakes ? 'bg-cyan-400 border-cyan-300 scale-125 shadow-lg shadow-cyan-400/50' : 'bg-gray-700 border-gray-600'
                }`} />
              ))}
            </div>
            <p className="text-gray-300 text-base font-semibold animate-pulse">
              {ballAnim === 'throwing' ? '🔮 Lançando...' : ballAnim === 'shaking' ? `Balançando... ${shakes}/3` : '...'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!busy && showThrow && (
          <div style={{ padding: '18px 24px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Main throw card */}
            <div style={{
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.18)',
              borderRadius: 18,
              padding: 10,
            }}>
              <button
                onClick={doThrow}
                disabled={cryptoBalls <= 0}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-cyan-500 active:from-cyan-700 disabled:from-gray-700 disabled:to-gray-600 rounded-2xl py-4 active:scale-[0.97] transition-transform shadow-lg shadow-cyan-500/20"
              >
                <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0">
                  <path d="M 50 5 A 45 45 0 0 1 95 50 L 5 50 A 45 45 0 0 1 50 5 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="4" />
                  <path d="M 5 50 A 45 45 0 0 0 95 50 L 5 50 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="#f8fafc" stroke="#374151" strokeWidth="4" />
                  <circle cx="50" cy="50" r="5" fill="#06b6d4" />
                </svg>
                <span className="text-white font-bold text-base">
                  {cryptoBalls <= 0 ? 'Sem bolas!' : 'Lançar CryptoBall'}
                </span>
                <span className="text-cyan-200 text-sm font-semibold">×{cryptoBalls}</span>
              </button>
            </div>

            {/* Secondary actions */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 12,
            }}>
              <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>
                Outras ações
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <button
                  onClick={doAutoCatch}
                  disabled={coins < 10}
                  className="rounded-2xl active:scale-[0.97] transition-transform border"
                  style={{
                    padding: '14px 8px',
                    background: coins < 10 ? 'rgba(55,65,81,0.5)' : 'rgba(161,98,7,0.35)',
                    borderColor: coins < 10 ? 'rgba(75,85,99,0.5)' : 'rgba(250,204,21,0.25)',
                    color: 'white',
                    cursor: coins < 10 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🎯</div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Auto</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fde68a', marginTop: 2 }}>🪙10</div>
                </button>

                <button
                  onClick={() => { if (pet) startBattleFromEncounter(pet); }}
                  className="rounded-2xl active:scale-[0.97] transition-transform border"
                  style={{
                    padding: '14px 8px',
                    background: 'rgba(127,29,29,0.35)',
                    borderColor: 'rgba(239,68,68,0.25)',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⚔️</div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Lutar</div>
                  <div style={{ fontSize: 10, color: '#fca5a5', marginTop: 2 }}>Batalha</div>
                </button>

                <button
                  onClick={fleeBattle}
                  className="rounded-2xl active:scale-[0.97] transition-transform border"
                  style={{
                    padding: '14px 8px',
                    background: 'rgba(55,65,81,0.4)',
                    borderColor: 'rgba(107,114,128,0.35)',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🏃</div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Fugir</div>
                  <div style={{ fontSize: 10, color: '#d1d5db', marginTop: 2 }}>Mapa</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final results */}
        {!busy && showResult && (
          <div style={{ padding: '18px 24px 22px 24px' }}>
            <div style={{
              background: result === 'caught' ? 'rgba(20,83,45,0.22)' : 'rgba(127,29,29,0.22)',
              border: result === 'caught' ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(239,68,68,0.28)',
              borderRadius: 20,
              padding: '18px 16px',
              textAlign: 'center',
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>
                {result === 'caught' ? '🎉' : result === 'fled' ? '💨' : '😢'}
              </div>
              <p style={{
                fontWeight: 700,
                fontSize: 21,
                color: result === 'caught' ? '#4ade80' : '#f87171',
                lineHeight: 1.2,
              }}>
                {result === 'caught' ? 'CAPTURADO!' : result === 'fled' ? 'FUGIU!' : 'SEM TENTATIVAS'}
              </p>
              <p style={{ color: '#d1d5db', fontSize: 15, marginTop: 10, lineHeight: 1.35 }}>
                {result === 'caught'
                  ? `${pet.name} foi adicionado à sua coleção e você recebeu +50 🪙.`
                  : result === 'fled'
                    ? `${pet.name} escapou antes da captura.`
                    : `${pet.name} escapou depois das tentativas.`}
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 10,
            }}>
              <button
                onClick={finishEncounter}
                className="w-full active:scale-[0.97] transition-transform"
                style={{
                  padding: '14px 16px',
                  width: '100%',
                  border: 'none',
                  borderRadius: 14,
                  background: result === 'caught'
                    ? 'linear-gradient(90deg,#16a34a,#22c55e)'
                    : 'linear-gradient(90deg,#4b5563,#6b7280)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: result === 'caught'
                    ? '0 10px 24px rgba(34,197,94,0.18)'
                    : '0 10px 24px rgba(107,114,128,0.18)',
                }}
              >
                {result === 'caught' ? '✓ Continuar' : '← Voltar ao mapa'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
