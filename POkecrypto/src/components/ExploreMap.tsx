import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES, generateEnemyForZone } from '../data/pets';
import PlayerAvatar from './PlayerAvatar';
import InventoryPanel from './InventoryPanel';

type Dir = 'up' | 'down' | 'left' | 'right';

// Tall grass patches — coordinates in % of the FULL map div
// Avatar also moves in % of the FULL map div
// So these match directly
interface GrassPatch { x: number; y: number; w: number; h: number; }
const TALL_GRASS: GrassPatch[] = [
  { x: 14, y: 18, w: 16, h: 10 },
  { x: 58, y: 14, w: 14, h: 10 },
  { x: 62, y: 40, w: 14, h: 12 },
  { x: 12, y: 52, w: 18, h: 10 },
  { x: 38, y: 60, w: 16, h: 10 },
  { x: 64, y: 68, w: 14, h: 8 },
  { x: 16, y: 76, w: 16, h: 8 },
  { x: 50, y: 80, w: 18, h: 8 },
];

function isInTallGrass(px: number, py: number): boolean {
  return TALL_GRASS.some(g => px >= g.x && px <= g.x + g.w && py >= g.y && py <= g.y + g.h);
}

const BORDER_ELEM: Record<string, { emoji: string; size: number }> = {
  forest: { emoji: '🌲', size: 22 }, volcano: { emoji: '⛰️', size: 20 }, ocean: { emoji: '🏝️', size: 18 },
  thunder: { emoji: '🌾', size: 18 }, shadow: { emoji: '🗿', size: 20 }, glacier: { emoji: '❄️', size: 18 },
};

const PAL: Record<string, { bg: string; bgAlt: string; path: string; pathE: string; tree: string; treeD: string; trunk: string; tg: string; tgL: string; tgBlade: string; fl1: string; fl2: string; borderBg: string }> = {
  forest:  { bg: '#68b840', bgAlt: '#58a830', path: '#d8c078', pathE: '#c0a858', tree: '#306028', treeD: '#204818', trunk: '#805830', tg: '#2a7818', tgL: '#1e5c10', tgBlade: '#44a030', fl1: '#f04040', fl2: '#f8f840', borderBg: '#2d5a1e' },
  volcano: { bg: '#a07050', bgAlt: '#907040', path: '#c8a870', pathE: '#b09060', tree: '#604030', treeD: '#483020', trunk: '#604028', tg: '#6a4030', tgL: '#502818', tgBlade: '#885840', fl1: '#f06020', fl2: '#f8c030', borderBg: '#3a1a0a' },
  ocean:   { bg: '#70b898', bgAlt: '#60a888', path: '#e0d8a8', pathE: '#c8c090', tree: '#307858', treeD: '#206048', trunk: '#706048', tg: '#308060', tgL: '#206848', tgBlade: '#48a878', fl1: '#60c0f0', fl2: '#f0f0f0', borderBg: '#d4c49a' },
  thunder: { bg: '#a0a850', bgAlt: '#909840', path: '#d8c878', pathE: '#c0b060', tree: '#606828', treeD: '#485018', trunk: '#807040', tg: '#686820', tgL: '#505010', tgBlade: '#888828', fl1: '#f8e830', fl2: '#f8f8a0', borderBg: '#4a4a1e' },
  shadow:  { bg: '#585070', bgAlt: '#484060', path: '#807898', pathE: '#686080', tree: '#302840', treeD: '#201830', trunk: '#504060', tg: '#302050', tgL: '#201040', tgBlade: '#483068', fl1: '#b060d0', fl2: '#8080c0', borderBg: '#1a1030' },
  glacier: { bg: '#90c0d8', bgAlt: '#80b0c8', path: '#d8e8f0', pathE: '#c0d0e0', tree: '#6090a8', treeD: '#507888', trunk: '#607080', tg: '#5898b0', tgL: '#4880a0', tgBlade: '#70b0c8', fl1: '#d0e8f8', fl2: '#f0f8ff', borderBg: '#4a6878' },
};

export default function ExploreMap() {
  const explore = useGameStore((s) => s.explore);
  const selectedPetId = useGameStore((s) => s.selectedPetId);
  const pets = useGameStore((s) => s.pets);
  const moveAvatar = useGameStore((s) => s.moveAvatar);
  const triggerEncounter = useGameStore((s) => s.triggerEncounter);
  const startEncounter = useGameStore((s) => s.startEncounter);
  const setScreen = useGameStore((s) => s.setScreen);
  const stopExploring = useGameStore((s) => s.stopExploring);
  const playerGender = useGameStore((s) => s.playerGender);
  const playerClass = useGameStore((s) => s.playerClass);

  const exploreSpeed = useGameStore((s) => s.exploreSpeed);
  const coins = useGameStore((s) => s.coins);
  const addCoins = useGameStore((s) => s.addCoins);
  const isVip = useGameStore((s) => s.isVip);

  const [paused, setPaused] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [flashVisible, setFlashVisible] = useState(false);
  const [onGrass, setOnGrass] = useState(false);
  const [show3xConfirm, setShow3xConfirm] = useState(false);
  const speed = exploreSpeed;
  const dirRef = useRef<Dir>('right');
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const walkRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chgRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mRef = useRef(true);
  const stepsOnGrassRef = useRef(0);

  const zone = ZONES.find(z => z.id === explore.currentZone) ?? ZONES[0];
  const playerPet = pets.find(p => p.id === selectedPetId);
  const c = PAL[zone.id] ?? PAL.forest;
  const be = BORDER_ELEM[zone.id] ?? BORDER_ELEM.forest;

  const flowers = useMemo(() => {
    const f: { x: number; y: number; c: string }[] = [];
    for (let i = 0; i < 15; i++) {
      const x = ((i * 23 + zone.id.charCodeAt(0) * 7) % 70) + 15;
      const y = ((i * 17 + zone.id.charCodeAt(1) * 5) % 65) + 18;
      if (!isInTallGrass(x, y)) f.push({ x, y, c: i % 2 === 0 ? c.fl1 : c.fl2 });
    }
    return f;
  }, [zone.id, c]);

  const innerTrees = useMemo(() => {
    const pos = [
      { x: 48, y: 14 }, { x: 85, y: 24 }, { x: 34, y: 40 }, { x: 52, y: 44 },
      { x: 18, y: 38 }, { x: 85, y: 54 }, { x: 34, y: 70 }, { x: 82, y: 80 }, { x: 42, y: 88 },
    ];
    return pos.filter(p => !isInTallGrass(p.x, p.y)).map((p, i) => ({ ...p, s: 20 + (i % 3) * 4 }));
  }, []);

  const borders = useMemo(() => {
    const b: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i += be.size * 0.4) { b.push({ x: i, y: 0 }); b.push({ x: i, y: 100 }); }
    for (let i = 0; i <= 100; i += be.size * 0.5) { b.push({ x: 0, y: i }); b.push({ x: 100, y: i }); }
    return b;
  }, [be]);

  // Walk animation
  useEffect(() => {
    if (!paused && !explore.encounterPending) {
      const animMs = speed === 3 ? 80 : speed === 2 ? 140 : 200;
      walkRef.current = setInterval(() => setWalkFrame(f => (f + 1) % 4), animMs);
      return () => { if (walkRef.current) clearInterval(walkRef.current); };
    }
  }, [paused, explore.encounterPending, speed]);

  // Direction changes
  const schedDir = useCallback(() => {
    chgRef.current = setTimeout(() => {
      if (!mRef.current) return;
      dirRef.current = (['up', 'down', 'left', 'right'] as Dir[])[Math.floor(Math.random() * 4)];
      schedDir();
    }, 2000 + Math.random() * 3000);
  }, []);

  // Auto walk + encounter check in same loop
  useEffect(() => {
    if (paused || explore.encounterPending) {
      if (autoRef.current) clearInterval(autoRef.current);
      if (chgRef.current) clearTimeout(chgRef.current);
      return;
    }
    const ms = speed === 3 ? 100 : speed === 2 ? 180 : 300;
    const ss = speed === 3 ? 2.5 : speed === 2 ? 1.8 : 1.2;

    autoRef.current = setInterval(() => {
      const st = useGameStore.getState();
      if (st.explore.encounterPending || !st.explore.isExploring) return;

      let d = dirRef.current;
      const { avatarX: ax, avatarY: ay } = st.explore;

      // Bounce off edges
      if (ax <= 12 && d === 'left') dirRef.current = 'right';
      if (ax >= 88 && d === 'right') dirRef.current = 'left';
      if (ay <= 12 && d === 'up') dirRef.current = 'down';
      if (ay >= 88 && d === 'down') dirRef.current = 'up';
      d = dirRef.current;

      const dx = d === 'left' ? -ss : d === 'right' ? ss : 0;
      const dy = d === 'up' ? -ss : d === 'down' ? ss : 0;
      const nx = ax + dx;
      const ny = ay + dy;

      // Move
      moveAvatar(dx, dy, d);

      // Check if on tall grass
      const nowOnGrass = isInTallGrass(nx, ny);
      setOnGrass(nowOnGrass);

      if (nowOnGrass) {
        stepsOnGrassRef.current++;
        // Only trigger encounter after 5+ steps on grass, with zone encounter rate
        if (stepsOnGrassRef.current > 5 && Math.random() < zone.encounterRate) {
          triggerEncounter();
          stepsOnGrassRef.current = 0;
        }
      } else {
        stepsOnGrassRef.current = 0;
      }
    }, ms);

    schedDir();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
      if (chgRef.current) clearTimeout(chgRef.current);
    };
  }, [paused, explore.encounterPending, speed, moveAvatar, schedDir, zone.encounterRate, triggerEncounter]);

  // Flash → encounter (respects encounterMode)
  useEffect(() => {
    if (!explore.encounterPending) return;
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    if (chgRef.current) { clearTimeout(chgRef.current); chgRef.current = null; }

    const mode = useGameStore.getState().encounterMode;

    // Auto-flee: skip entirely, just reset and keep walking
    if (mode === 'auto-flee') {
      useGameStore.setState({
        explore: { ...useGameStore.getState().explore, encounterPending: false, encounterFlash: false, stepCount: 0 },
      });
      return;
    }

    let n = 0; setFlashVisible(true);
    const fi = setInterval(() => {
      n++; setFlashVisible(n % 2 === 0);
      if (n >= 8) {
        clearInterval(fi); setFlashVisible(false);
        if (!playerPet) return;
        const enemy = generateEnemyForZone(explore.currentZone, playerPet.stats.level);

        if (mode === 'auto-battle') {
          // Go directly to battle
          useGameStore.getState().startBattleFromEncounter(enemy);
        } else {
          // manual or auto-capture → go to encounter screen
          startEncounter(enemy);
        }
      }
    }, 110);
    return () => { clearInterval(fi); setFlashVisible(false); };
  }, [explore.encounterPending]);

  useEffect(() => {
    mRef.current = true;
    return () => { mRef.current = false; [autoRef, walkRef].forEach(r => { if (r.current) clearInterval(r.current); }); if (chgRef.current) clearTimeout(chgRef.current); };
  }, []);

  const isWalking = !paused && !explore.encounterPending;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none' }}>
      {/* Header */}
      <div style={{
        padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, zIndex: 30, borderBottom: `2px solid ${c.tree}`, backgroundColor: c.treeD + 'ee',
      }}>
        <button onClick={stopExploring} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>← Sair</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{zone.emoji}</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{zone.name}</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700 }}>{explore.stepCount} 👣</span>
      </div>

      {/* MAP */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: c.borderBg }}>
        {flashVisible && <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'white', pointerEvents: 'none' }} />}

        {/* Border emojis */}
        {borders.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, fontSize: be.size, transform: 'translate(-50%,-50%)', opacity: 0.9, pointerEvents: 'none', zIndex: 5 }}>{be.emoji}</div>
        ))}

        {/* Inner playable area */}
        <div style={{ position: 'absolute', left: '8%', top: '8%', right: '8%', bottom: '8%', backgroundColor: c.bg, border: `3px solid ${c.treeD}`, zIndex: 1 }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(0deg,${c.bgAlt} 1px,transparent 1px),linear-gradient(90deg,${c.bgAlt} 1px,transparent 1px)`, backgroundSize: '16px 16px', opacity: 0.35 }} />

          {/* Paths */}
          <div style={{ position: 'absolute', left: '28%', top: 0, width: '14%', height: '100%', backgroundColor: c.path, borderLeft: `2px solid ${c.pathE}`, borderRight: `2px solid ${c.pathE}` }} />
          <div style={{ position: 'absolute', left: 0, top: '38%', width: '42%', height: '12%', backgroundColor: c.path, borderTop: `2px solid ${c.pathE}`, borderBottom: `2px solid ${c.pathE}` }} />
          <div style={{ position: 'absolute', left: '42%', top: '26%', width: '58%', height: '12%', backgroundColor: c.path, borderTop: `2px solid ${c.pathE}`, borderBottom: `2px solid ${c.pathE}` }} />

          {/* ===== TALL GRASS — visually distinct ===== */}
          {TALL_GRASS.map((g, i) => (
            <div key={`tg${i}`} style={{
              position: 'absolute',
              left: `${g.x}%`, top: `${g.y}%`, width: `${g.w}%`, height: `${g.h}%`,
              backgroundColor: c.tg,
              border: `2px solid ${c.tgL}`,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              {/* Dense vertical grass blades */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(90deg, ${c.tgBlade} 0px, ${c.tgBlade} 2px, ${c.tg} 2px, ${c.tg} 4px)`,
                opacity: 0.7,
              }} />
              {/* Horizontal crosshatch */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, ${c.tgL}60 3px, ${c.tgL}60 4px)`,
              }} />
              {/* Diagonal texture for more depth */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent 5px, ${c.tgBlade}30 5px, ${c.tgBlade}30 6px)`,
              }} />
              {/* Top highlight edge */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: c.tgBlade, opacity: 0.5,
              }} />
            </div>
          ))}

          {/* Flowers */}
          {flowers.map((f, i) => (
            <div key={`fl${i}`} style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, width: 5, height: 5, backgroundColor: f.c, borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }} />
          ))}

          {/* Inner trees */}
          {innerTrees.map((t, i) => (
            <div key={`it${i}`} style={{
              position: 'absolute', left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%,-50%)',
              zIndex: t.y > explore.avatarY ? 15 : 4, width: t.s, height: t.s * 1.2, pointerEvents: 'none',
            }}>
              <div style={{ width: t.s, height: t.s * 0.75, borderRadius: '40%', backgroundColor: c.tree, boxShadow: `inset -${t.s * 0.2}px ${t.s * 0.1}px 0 ${c.treeD}`, border: `1px solid ${c.treeD}` }} />
              <div style={{ width: t.s * 0.25, height: t.s * 0.35, backgroundColor: c.trunk, margin: '0 auto', marginTop: -2, borderRadius: '0 0 2px 2px' }} />
            </div>
          ))}

          {/* Avatar */}
          <div style={{
            position: 'absolute', zIndex: 10,
            left: `${explore.avatarX}%`, top: `${explore.avatarY}%`,
            transform: `translate(-50%,-50%) ${explore.direction === 'left' ? 'scaleX(-1)' : ''} translateY(${isWalking ? (walkFrame % 2 === 0 ? -2 : 2) : 0}px)`,
            transition: 'left 0.25s linear, top 0.25s linear',
          }}>
            <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={42} />
          </div>
        </div>

        {/* Status indicator */}
        {isWalking && (
          <div style={{
            position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, borderRadius: 20, padding: '6px 16px',
            background: onGrass ? 'rgba(30,92,16,0.85)' : 'rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: onGrass ? '#a7f3d0' : 'rgba(255,255,255,0.35)' }} className={onGrass ? 'animate-pulse' : ''}>
              {onGrass ? '🌿 Grama alta!' : 'Caminhando...'}
            </span>
          </div>
        )}

        {paused && !explore.encounterPending && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', borderRadius: 24, padding: '32px 40px', textAlign: 'center' }}>
              <span style={{ color: '#facc15', fontSize: 24, fontWeight: 700 }}>⏸</span>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginTop: 8 }}>Pausado</p>
            </div>
          </div>
        )}

        {/* 3x speed confirmation */}
        {show3xConfirm && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#111128', border: '1px solid #252550', borderRadius: 20, padding: '28px 24px', textAlign: 'center', maxWidth: 280 }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🏃‍♂️💨</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Velocidade 3x</p>
              <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                Ativar velocidade máxima por<br />
                <span style={{ color: '#facc15', fontWeight: 700, fontSize: 18 }}>💰 100 coins</span>
              </p>
              <p style={{ color: '#6b7280', fontSize: 11, marginBottom: 20 }}>Saldo atual: 💰 {coins}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShow3xConfirm(false)} className="active:scale-95 transition-transform" style={{
                  flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: '#9ca3af', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>Cancelar</button>
                <button onClick={() => {
                  if (coins >= 100) {
                    addCoins(-100);
                    useGameStore.setState({ exploreSpeed: 3 });
                    setShow3xConfirm(false);
                  }
                }} disabled={coins < 100} className="active:scale-95 transition-transform" style={{
                  flex: 1, padding: '12px 0',
                  background: coins >= 100 ? 'linear-gradient(90deg,#dc2626,#ef4444)' : '#374151',
                  border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700,
                  cursor: coins >= 100 ? 'pointer' : 'not-allowed',
                }}>Ativar!</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inventory bar */}
      <div style={{ flexShrink: 0, backgroundColor: c.treeD + 'dd', padding: '8px 16px', borderTop: `1px solid ${c.tree}60` }}>
        <InventoryPanel compact />
      </div>

      {/* Controls */}
      <div style={{ flexShrink: 0, backgroundColor: c.treeD + 'ee', borderTop: `1px solid ${c.tree}40` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', gap: 12 }}>
          <button onClick={() => setPaused(!paused)} className={`rounded-2xl flex items-center justify-center active:scale-90 border-2 ${paused ? 'bg-green-600/50 border-green-400/60' : 'bg-white/10 border-white/20'}`} style={{ width: 56, height: 56 }}>
            <span style={{ fontSize: 24 }}>{paused ? '▶️' : '⏸️'}</span>
          </button>
          {/* Speed buttons: 1x, 2x, 3x(paid) */}
          {[1, 2, 3].map(s => {
            const isActive = speed === s;
            const is3x = s === 3;
            return (
              <button key={s} onClick={() => {
                if (s === 3 && speed !== 3 && !isVip) {
                  setShow3xConfirm(true);
                } else {
                  useGameStore.setState({ exploreSpeed: s });
                }
              }} className="rounded-2xl flex items-center justify-center active:scale-90 border-2" style={{
                width: 50, height: 50,
                background: isActive ? (is3x ? 'rgba(239,68,68,0.35)' : 'rgba(249,115,22,0.35)') : 'rgba(255,255,255,0.06)',
                borderColor: isActive ? (is3x ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.5)') : 'rgba(255,255,255,0.12)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{s}x</div>
                  {is3x && !isActive && <div style={{ color: isVip ? '#4ade80' : '#facc15', fontSize: 8, fontWeight: 700 }}>{isVip ? '👑FREE' : '💰100'}</div>}
                </div>
              </button>
            );
          })}
          <button onClick={() => setScreen('collection')} className="bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center active:scale-90" style={{ width: 56, height: 56 }}>
            <span style={{ fontSize: 20 }}>📋</span>
          </button>
          <button onClick={stopExploring} className="bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center active:scale-90" style={{ width: 56, height: 56 }}>
            <span style={{ fontSize: 20 }}>🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
}
