import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES, generateEnemyForZone } from '../data/pets';
import PlayerAvatar from './PlayerAvatar';

export default function ExploreMap() {
  const {
    explore, moveAvatar, triggerEncounter, setEncounterFlash,
    startEncounter, stopExploring, playerGender, playerClass,
    pets, selectedPetId, coins, cryptoBalls,
  } = useGameStore();

  const zone = ZONES.find(z => z.id === explore.currentZone) ?? ZONES[0];
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const [paused] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const walkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const encounterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);

  const speed = useGameStore(s => s.exploreSpeed);

  const handleMove = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (paused || explore.encounterPending) return;
    const step = 3;
    const dx = dir === 'left' ? -step : dir === 'right' ? step : 0;
    const dy = dir === 'up' ? -step : dir === 'down' ? step : 0;
    moveAvatar(dx, dy, dir);
    stepRef.current += 1;

    // Random encounter check
    if (stepRef.current > 5 && Math.random() < zone.encounterRate * speed) {
      triggerEncounter();
      setIsWalking(false);

      encounterTimer.current = setTimeout(() => {
        setEncounterFlash(false);
        if (selectedPet) {
          const enemy = generateEnemyForZone(explore.currentZone, selectedPet.stats.level);
          startEncounter(enemy);
        }
        stepRef.current = 0;
      }, 1000);
    }
  }, [paused, explore.encounterPending, explore.currentZone, moveAvatar, triggerEncounter, setEncounterFlash, startEncounter, selectedPet, speed, zone.encounterRate]);

  // Auto-walk
  useEffect(() => {
    if (!isWalking || paused || explore.encounterPending) return;
    const dirs: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
    walkTimer.current = setInterval(() => {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      handleMove(dir);
    }, 400 / speed);
    return () => { if (walkTimer.current) clearInterval(walkTimer.current); };
  }, [isWalking, paused, explore.encounterPending, handleMove, speed]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (walkTimer.current) clearInterval(walkTimer.current);
      if (encounterTimer.current) clearTimeout(encounterTimer.current);
    };
  }, []);

  // Generate decorations deterministically
  const decorations = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      emoji: zone.decorEmojis[i % zone.decorEmojis.length],
      x: (i * 17 + 7) % 90 + 5,
      y: (i * 23 + 11) % 85 + 5,
      s: 14 + (i % 3) * 6,
    }))
  );

  // D-pad handler
  const handleDpadStart = (dir: 'up' | 'down' | 'left' | 'right') => {
    handleMove(dir);
    setIsWalking(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={stopExploring} style={{ color: '#eab308', fontWeight: 700, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>← Sair</button>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{zone.emoji} {zone.name}</span>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#06b6d4' }}>🔮{cryptoBalls}</span>
        </div>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: zone.bgGradient }}>
        {/* Ground pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17 + 10) % 100}%`,
              width: 60 + (i % 3) * 20,
              height: 30 + (i % 2) * 15,
              borderRadius: '50%',
              background: zone.groundColor,
            }} />
          ))}
        </div>

        {/* Decorations */}
        {decorations.current.map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${d.x}%`, top: `${d.y}%`,
            fontSize: d.s, pointerEvents: 'none',
            zIndex: d.y > explore.avatarY ? 15 : 4,
            opacity: 0.7,
          }}>
            {d.emoji}
          </div>
        ))}

        {/* Avatar */}
        <div style={{
          position: 'absolute',
          left: `${explore.avatarX}%`, top: `${explore.avatarY}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          transition: 'left 0.15s, top 0.15s',
        }}>
          <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={40} direction={explore.direction} />
        </div>

        {/* Encounter flash */}
        {explore.encounterFlash && (
          <div className="animate-encounter-flash" style={{
            position: 'absolute', inset: 0, background: 'white', zIndex: 50,
          }} />
        )}

        {/* Walking indicator */}
        {isWalking && (
          <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <p style={{
              background: 'rgba(0,0,0,0.7)', color: '#4ade80', padding: '6px 14px',
              borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
            }}>🌿 Explorando...</p>
          </div>
        )}

        {paused && !explore.encounterPending && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
            <p style={{ background: 'rgba(0,0,0,0.8)', color: '#facc15', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>⏸ Pausado</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#111128', borderTop: '1px solid #252550', flexShrink: 0,
      }}>
        {/* Speed buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(s => {
            const isActive = speed === s;
            return (
              <button key={s} onClick={() => useGameStore.setState({ exploreSpeed: s })} className="active:scale-90 transition-transform" style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                background: isActive ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.05)',
                border: isActive ? '1px solid rgba(250,204,21,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: isActive ? '#facc15' : '#6b7280',
              }}>{s}x</button>
            );
          })}
        </div>

        {/* Auto-walk */}
        <button
          onClick={() => setIsWalking(!isWalking)}
          className="active:scale-95 transition-transform"
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: isWalking ? 'linear-gradient(90deg,#dc2626,#ef4444)' : 'linear-gradient(90deg,#16a34a,#22c55e)',
            color: 'white', fontSize: 12, fontWeight: 700,
          }}
        >{isWalking ? '⏹ Parar' : '🚶 Explorar'}</button>

        {/* D-pad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 32px)', gridTemplateRows: 'repeat(3, 32px)', gap: 2 }}>
          <div />
          <button onClick={() => handleDpadStart('up')} className="active:scale-90" style={{ background: '#252550', border: 'none', borderRadius: 6, color: 'white', fontSize: 14, cursor: 'pointer' }}>↑</button>
          <div />
          <button onClick={() => handleDpadStart('left')} className="active:scale-90" style={{ background: '#252550', border: 'none', borderRadius: 6, color: 'white', fontSize: 14, cursor: 'pointer' }}>←</button>
          <div style={{ background: '#1a1a3a', borderRadius: 6 }} />
          <button onClick={() => handleDpadStart('right')} className="active:scale-90" style={{ background: '#252550', border: 'none', borderRadius: 6, color: 'white', fontSize: 14, cursor: 'pointer' }}>→</button>
          <div />
          <button onClick={() => handleDpadStart('down')} className="active:scale-90" style={{ background: '#252550', border: 'none', borderRadius: 6, color: 'white', fontSize: 14, cursor: 'pointer' }}>↓</button>
          <div />
        </div>
      </div>
    </div>
  );
}
