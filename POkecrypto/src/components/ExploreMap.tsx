import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES, generateEnemyForZone } from '../data/pets';
import PlayerAvatar from './PlayerAvatar';

/*
  Tile-based map like GameBoy Pokémon:
  0 = path (walkable, no encounter)
  1 = tree (blocked)
  2 = tall grass (walkable, can trigger encounter)
  3 = flower/decoration
*/
const TILE_SIZE = 16; // px per tile
const MAP_W = 20;
const MAP_H = 16;

// Generate a deterministic map layout
function generateMap(seed: number): number[][] {
  const map: number[][] = [];
  const rng = (i: number) => Math.abs(Math.sin(seed * 1000 + i * 9301 + 49297) * 233280) % 1;

  for (let y = 0; y < MAP_H; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_W; x++) {
      const i = y * MAP_W + x;
      // Borders = trees
      if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) {
        row.push(1);
        continue;
      }
      // Main paths — horizontal and vertical corridors
      const isHPath = y === 4 || y === 8 || y === 12;
      const isVPath = x === 5 || x === 10 || x === 15;
      if (isHPath || isVPath) {
        row.push(0);
        continue;
      }
      // Around paths = possible grass
      const nearPath =
        (y >= 3 && y <= 5) || (y >= 7 && y <= 9) || (y >= 11 && y <= 13) ||
        (x >= 4 && x <= 6) || (x >= 9 && x <= 11) || (x >= 14 && x <= 16);

      const r = rng(i);
      if (nearPath && r < 0.55) {
        row.push(2); // tall grass
      } else if (r < 0.35) {
        row.push(1); // tree
      } else if (r < 0.42) {
        row.push(3); // flower
      } else {
        row.push(r < 0.6 ? 2 : 0); // grass or path
      }
      // Make sure starting area is clear
      if (x >= 9 && x <= 11 && y >= 11 && y <= 13) {
        row[row.length - 1] = 0;
      }
    }
    map.push(row);
  }
  return map;
}

// Zone-specific tile colors
const ZONE_TILES: Record<string, { path: string; tree: string; treeDark: string; grass: string; grassDark: string; flower: string }> = {
  forest:  { path: '#6B7355', tree: '#1a4a14', treeDark: '#0d2a0d', grass: '#2d8a27', grassDark: '#1e6a1a', flower: '#f472b6' },
  volcano: { path: '#6B4226', tree: '#3a1a0a', treeDark: '#2a0a00', grass: '#5a3a1a', grassDark: '#4a2a0a', flower: '#ff6b35' },
  ocean:   { path: '#a0c2b0', tree: '#0a4a5a', treeDark: '#053040', grass: '#3a8a7a', grassDark: '#2a6a5a', flower: '#60a5fa' },
  thunder: { path: '#9B8B55', tree: '#3a3a14', treeDark: '#2a2a0a', grass: '#5a5a27', grassDark: '#4a4a1a', flower: '#fbbf24' },
  shadow:  { path: '#4B3B5B', tree: '#1a0a2a', treeDark: '#0d0520', grass: '#3a2a4a', grassDark: '#2a1a3a', flower: '#a78bfa' },
  glacier: { path: '#a0c0d8', tree: '#5080a0', treeDark: '#406080', grass: '#80b0c8', grassDark: '#6090a8', flower: '#e0f0ff' },
};

// Zone-specific tree emoji (reserved for future use)
const _ZONE_TREE: Record<string, string> = {
  forest: '🌲', volcano: '🪨', ocean: '🪸', thunder: '⚡', shadow: '🦇', glacier: '🧊',
};
void _ZONE_TREE;
const ZONE_FLOWER: Record<string, string> = {
  forest: '🌸', volcano: '🔥', ocean: '🐚', thunder: '✨', shadow: '👁️', glacier: '❄️',
};

export default function ExploreMap() {
  const {
    explore, moveAvatar, triggerEncounter, setEncounterFlash,
    startEncounter, playerGender, playerClass,
    pets, selectedPetId, coins, cryptoBalls, isVip,
  } = useGameStore();

  const zone = ZONES.find(z => z.id === explore.currentZone) ?? ZONES[0];
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const [speedConfirm, setSpeedConfirm] = useState<number | null>(null);
  const walkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const encounterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);
  const speed = useGameStore(s => s.exploreSpeed);

  // Zone index as seed for map generation
  const zoneIdx = ZONES.findIndex(z => z.id === explore.currentZone);
  const tileMap = useMemo(() => generateMap(zoneIdx + 1), [zoneIdx]);
  const tiles = ZONE_TILES[zone.id] ?? ZONE_TILES.forest;

  // Avatar position in tile coords
  const avatarTileX = Math.round((explore.avatarX / 100) * (MAP_W - 1));
  const avatarTileY = Math.round((explore.avatarY / 100) * (MAP_H - 1));

  // Check if a tile is walkable
  const canWalk = useCallback((tx: number, ty: number) => {
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return false;
    const tile = tileMap[ty]?.[tx];
    return tile !== 1; // only trees block
  }, [tileMap]);

  // Check if current tile is grass
  const isOnGrass = useCallback((tx: number, ty: number) => {
    return tileMap[ty]?.[tx] === 2;
  }, [tileMap]);

  const handleMove = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (explore.encounterPending) return;

    let ntx = avatarTileX;
    let nty = avatarTileY;
    if (dir === 'left') ntx--;
    if (dir === 'right') ntx++;
    if (dir === 'up') nty--;
    if (dir === 'down') nty++;

    if (!canWalk(ntx, nty)) {
      // Blocked — update direction only
      useGameStore.setState((s) => ({
        explore: { ...s.explore, direction: dir },
      }));
      return;
    }

    // Move to new tile
    const newX = (ntx / (MAP_W - 1)) * 100;
    const newY = (nty / (MAP_H - 1)) * 100;
    moveAvatar(newX - explore.avatarX, newY - explore.avatarY, dir);
    stepRef.current += 1;

    // Encounter only on grass tiles
    if (isOnGrass(ntx, nty) && stepRef.current > 3 && Math.random() < zone.encounterRate * speed * 1.5) {
      triggerEncounter();
      encounterTimer.current = setTimeout(() => {
        setEncounterFlash(false);
        if (selectedPet) {
          const enemy = generateEnemyForZone(explore.currentZone, selectedPet.stats.level);
          startEncounter(enemy);
        }
        stepRef.current = 0;
      }, 1000);
    }
  }, [explore.encounterPending, explore.avatarX, explore.avatarY, explore.currentZone,
    avatarTileX, avatarTileY, canWalk, isOnGrass, moveAvatar, triggerEncounter,
    setEncounterFlash, startEncounter, selectedPet, speed, zone.encounterRate]);

  // Auto-walk
  useEffect(() => {
    if (!explore.searching || explore.encounterPending) return;
    const dirs: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
    walkTimer.current = setInterval(() => {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      handleMove(dir);
    }, 350 / speed);
    return () => { if (walkTimer.current) clearInterval(walkTimer.current); };
  }, [explore.searching, explore.encounterPending, handleMove, speed]);

  useEffect(() => {
    return () => {
      if (walkTimer.current) clearInterval(walkTimer.current);
      if (encounterTimer.current) clearTimeout(encounterTimer.current);
    };
  }, []);

  const requestSpeedChange = (s: number) => {
    if (s === speed) return;
    setSpeedConfirm(s);
  };

  const confirmSpeed = () => {
    if (speedConfirm === null) return;
    if (speedConfirm === 3 && !isVip) {
      if (coins < 100) return;
      useGameStore.setState((st) => ({ exploreSpeed: 3, coins: st.coins - 100 }));
    } else {
      useGameStore.setState({ exploreSpeed: speedConfirm });
    }
    setSpeedConfirm(null);
  };

  // Camera offset to center on avatar
  const mapPxW = MAP_W * TILE_SIZE;
  const mapPxH = MAP_H * TILE_SIZE;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550',
      }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{zone.emoji} {zone.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map(s => {
              const isActive = speed === s;
              const is3x = s === 3;
              return (
                <button key={s} onClick={() => requestSpeedChange(s)} className="active:scale-90 transition-transform" style={{
                  padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: isActive ? 'rgba(250,204,21,0.25)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '1px solid rgba(250,204,21,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#facc15' : '#6b7280',
                }}>{s}x{is3x && !isVip && !isActive ? '💰' : is3x && isVip ? '👑' : ''}</button>
              );
            })}
          </div>
          <span style={{ color: '#eab308', fontSize: 12, fontWeight: 700 }}>💰{coins}</span>
          <span style={{ color: '#06b6d4', fontSize: 12, fontWeight: 700 }}>🔮{cryptoBalls}</span>
        </div>
      </div>

      {/* Tile-based map */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: zone.bgGradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: mapPxW, height: mapPxH,
          position: 'relative',
          imageRendering: 'pixelated',
          transform: 'scale(1.6)',
          transformOrigin: 'center center',
        }}>
          {/* Render tiles */}
          {tileMap.map((row, ty) =>
            row.map((tile, tx) => {
              const x = tx * TILE_SIZE;
              const y = ty * TILE_SIZE;
              const isAvatarHere = tx === avatarTileX && ty === avatarTileY;

              return (
                <div key={`${tx}-${ty}`} style={{
                  position: 'absolute', left: x, top: y,
                  width: TILE_SIZE, height: TILE_SIZE,
                  background: tile === 1 ? tiles.treeDark : tile === 2 ? tiles.grassDark : tiles.path,
                  overflow: 'hidden',
                }}>
                  {/* Path tile */}
                  {tile === 0 && (
                    <div style={{
                      width: '100%', height: '100%',
                      background: tiles.path,
                      borderRight: tx < MAP_W - 1 && tileMap[ty][tx + 1] === 0 ? 'none' : `1px solid ${tiles.treeDark}30`,
                      borderBottom: ty < MAP_H - 1 && tileMap[ty + 1]?.[tx] === 0 ? 'none' : `1px solid ${tiles.treeDark}30`,
                      boxSizing: 'border-box',
                    }} />
                  )}

                  {/* Tree tile — pixel tree */}
                  {tile === 1 && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {/* tree trunk */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                        width: 4, height: 6, background: '#5a3a00',
                      }} />
                      {/* tree crown */}
                      <div style={{
                        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                        width: 12, height: 10, borderRadius: '50%',
                        background: tiles.tree,
                        boxShadow: `inset -2px -2px 0 ${tiles.treeDark}`,
                      }} />
                      {/* tree top highlight */}
                      <div style={{
                        position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)',
                        width: 6, height: 4, borderRadius: '50%',
                        background: `${tiles.tree}cc`,
                      }} />
                    </div>
                  )}

                  {/* Grass tile — with grass blades */}
                  {tile === 2 && (
                    <div style={{
                      width: '100%', height: '100%',
                      background: tiles.grass,
                      position: 'relative',
                    }}>
                      {/* grass blade pattern */}
                      <div style={{ position: 'absolute', bottom: 1, left: 2, width: 2, height: 5, background: tiles.grassDark, borderRadius: '0 0 1px 1px' }} />
                      <div style={{ position: 'absolute', bottom: 1, left: 6, width: 2, height: 7, background: `${tiles.tree}88`, borderRadius: '0 0 1px 1px' }} />
                      <div style={{ position: 'absolute', bottom: 1, left: 10, width: 2, height: 4, background: tiles.grassDark, borderRadius: '0 0 1px 1px' }} />
                      <div style={{ position: 'absolute', bottom: 1, left: 13, width: 2, height: 6, background: `${tiles.tree}88`, borderRadius: '0 0 1px 1px' }} />
                      {/* subtle grass animation indicator */}
                      {isAvatarHere && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(255,255,255,0.08)',
                          animation: 'pulse-ring 1s ease-in-out infinite',
                        }} />
                      )}
                    </div>
                  )}

                  {/* Flower/decoration tile */}
                  {tile === 3 && (
                    <div style={{
                      width: '100%', height: '100%',
                      background: tiles.path,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10,
                    }}>
                      {ZONE_FLOWER[zone.id] ?? '🌸'}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Avatar on top of tiles */}
          <div style={{
            position: 'absolute',
            left: avatarTileX * TILE_SIZE,
            top: avatarTileY * TILE_SIZE - 6,
            width: TILE_SIZE,
            height: TILE_SIZE + 6,
            zIndex: 20,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            transition: 'left 0.12s, top 0.12s',
          }}>
            <PlayerAvatar gender={playerGender} avatarClass={playerClass} size={14} direction={explore.direction} />
          </div>
        </div>

        {/* Encounter flash */}
        {explore.encounterFlash && (
          <div className="animate-encounter-flash" style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 50 }} />
        )}

        {/* Status indicator */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <p style={{
            background: explore.searching ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.75)',
            color: explore.searching ? '#4ade80' : '#f59e0b',
            padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            {explore.searching
              ? isOnGrass(avatarTileX, avatarTileY)
                ? `🌿 Grama alta! (${speed}x)`
                : `🚶 Caminhando... (${speed}x)`
              : '⏸ Parado'}
          </p>
        </div>

        {/* Speed confirm modal */}
        {speedConfirm !== null && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}>
            <div style={{
              background: '#111128', border: '1px solid #252550', borderRadius: 18,
              padding: 20, textAlign: 'center', maxWidth: 260, width: '100%',
            }}>
              <p style={{ fontSize: 24, marginBottom: 8 }}>{speedConfirm === 3 ? '🏃‍♂️💨' : speedConfirm === 2 ? '🚶‍♂️' : '🐢'}</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Velocidade {speedConfirm}x</p>
              {speedConfirm === 3 && !isVip ? (
                <>
                  <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 6 }}>Ativar velocidade máxima por</p>
                  <p style={{ color: '#eab308', fontWeight: 700, fontSize: 15, marginTop: 4 }}>💰 100 coins</p>
                  <p style={{ color: '#6b7280', fontSize: 9, marginTop: 4 }}>Saldo: 💰 {coins}</p>
                </>
              ) : speedConfirm === 3 && isVip ? (
                <p style={{ color: '#4ade80', fontSize: 10, marginTop: 6 }}>👑 Grátis para VIP!</p>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 6 }}>Alterar velocidade de exploração?</p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                <button onClick={() => setSpeedConfirm(null)} style={{
                  padding: '9px 0', borderRadius: 8, border: '1px solid #374151', background: 'none',
                  color: '#9ca3af', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                }}>Cancelar</button>
                <button onClick={confirmSpeed} disabled={speedConfirm === 3 && !isVip && coins < 100}
                  className="active:scale-95 transition-transform" style={{
                  padding: '9px 0', borderRadius: 8, border: 'none',
                  cursor: (speedConfirm === 3 && !isVip && coins < 100) ? 'not-allowed' : 'pointer',
                  background: (speedConfirm === 3 && !isVip && coins < 100) ? '#374151' : 'linear-gradient(90deg,#16a34a,#22c55e)',
                  color: 'white', fontSize: 10, fontWeight: 700,
                  opacity: (speedConfirm === 3 && !isVip && coins < 100) ? 0.5 : 1,
                }}>✓ Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '12px 14px', background: '#111128', borderTop: '1px solid #252550', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 10,
        opacity: explore.encounterPending ? 0.4 : 1,
        pointerEvents: explore.encounterPending ? 'none' : 'auto',
      }}>
        <button
          onClick={() => useGameStore.setState((s) => ({ explore: { ...s.explore, searching: !s.explore.searching } }))}
          disabled={explore.encounterPending}
          className="active:scale-95 transition-transform"
          style={{
            width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: explore.searching ? 'linear-gradient(90deg,#dc2626,#ef4444)' : 'linear-gradient(90deg,#16a34a,#22c55e)',
            color: 'white', fontSize: 13, fontWeight: 700,
          }}
        >{explore.searching ? '⏹ Parar Busca' : '▶ Iniciar Busca'}</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          <button onClick={() => useGameStore.getState().setScreen('menu')} className="active:scale-95 transition-transform" style={{
            padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: '#1f2937', color: '#d1d5db', fontSize: 10, fontWeight: 700,
          }}>🏠 Menu</button>
          <button onClick={() => useGameStore.getState().setScreen('collection')} className="active:scale-95 transition-transform" style={{
            padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: '#1f2937', color: '#4ade80', fontSize: 10, fontWeight: 700,
          }}>📋 Coleção</button>
          <button onClick={() => useGameStore.getState().setScreen('shop')} className="active:scale-95 transition-transform" style={{
            padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: '#1f2937', color: '#a78bfa', fontSize: 10, fontWeight: 700,
          }}>🛒 Loja</button>
          <button onClick={() => useGameStore.getState().setScreen('profile')} className="active:scale-95 transition-transform" style={{
            padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: '#1f2937', color: '#22d3ee', fontSize: 10, fontWeight: 700,
          }}>👤 Perfil</button>
        </div>
      </div>
    </div>
  );
}
