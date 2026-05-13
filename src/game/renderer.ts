import {
  MAP_COLS, MAP_ROWS, type GameState, type RuntimeHero, type Cell,
  MAP_THEMES,
  type Rarity, type HeadType, type MapTheme, type Direction,
} from './types';

interface Palette {
  body: string; bodyDark: string; bodyLight: string; glow: string;
}

const PALETTES: Record<Rarity, Palette> = {
  common: { body: '#8B7355', bodyDark: '#6B5B45', bodyLight: '#9E8A6F', glow: 'transparent' },
  rare: { body: '#4169E1', bodyDark: '#2850B8', bodyLight: '#6A9AFF', glow: 'rgba(65,105,225,0.25)' },
  super_rare: { body: '#9333EA', bodyDark: '#7E22CE', bodyLight: '#B366FF', glow: 'rgba(147,51,234,0.25)' },
  epic: { body: '#EA580C', bodyDark: '#C2410C', bodyLight: '#FF8844', glow: 'rgba(234,88,12,0.3)' },
  super_epic: { body: '#DC2626', bodyDark: '#991B1B', bodyLight: '#FF5555', glow: 'rgba(220,38,38,0.35)' },
  legendary: { body: '#D97706', bodyDark: '#B45309', bodyLight: '#FFB833', glow: 'rgba(251,191,36,0.35)' },
  super_legendary: { body: '#C4B5FD', bodyDark: '#8B5CF6', bodyLight: '#E0E7FF', glow: 'rgba(196,181,253,0.45)' },
};

export class GameRenderer {
  private ts = 32;
  private ox = 0;
  private oy = 0;
  private p = 2;

  draw(ctx: CanvasRenderingContext2D, state: GameState, cw: number, ch: number) {
    this.ts = Math.floor(Math.min(cw / MAP_COLS, ch / MAP_ROWS));
    this.p = Math.max(1, Math.floor(this.ts / 16));
    this.ox = Math.floor((cw - this.ts * MAP_COLS) / 2);
    this.oy = Math.floor((ch - this.ts * MAP_ROWS) / 2);
    this.state = state;
    ctx.save();
    ctx.translate(this.ox, this.oy);
    this.drawFloor(ctx, state.theme, state);
    this.drawMap(ctx, state);
    this.drawBombs(ctx, state);
    this.drawExplosions(ctx, state);
    this.drawHeroes(ctx, state);
    this.drawParticles(ctx, state);
    const theme = MAP_THEMES[state.theme];
    if (theme.ambient !== 'rgba(0,0,0,0)') {
      ctx.fillStyle = theme.ambient;
      ctx.fillRect(0, 0, MAP_COLS * this.ts, MAP_ROWS * this.ts);
    }
    ctx.restore();
  }

  private circ(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── FLOOR ───
  private drawFloor(ctx: CanvasRenderingContext2D, theme: MapTheme) {
    const ts = this.ts;
    const p = this.p;
    const t = MAP_THEMES[theme];
    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) {
        const px = x * ts, py = y * ts;
        ctx.fillStyle = (x + y) % 2 === 0 ? t.floor1 : t.floor2;
        ctx.fillRect(px, py, ts, ts);
      }
    }
    // Themed decorations on empty tiles
    for (let y = 1; y < MAP_ROWS - 1; y++) {
      for (let x = 1; x < MAP_COLS - 1; x++) {
        if (this.gameState?.map[y][x].type !== 'empty') continue;
        // Seeded random from position
        const seed = (x * 73 + y * 137 + 42) % 100;
        if (seed > 35) continue;
        const px = x * ts, py = y * ts;
        const cx = px + ts / 2, cy = py + ts / 2;
        switch (theme) {
          case 'forest': {
            // Grass tufts
            ctx.fillStyle = seed % 3 === 0 ? '#2d6b1e' : seed % 3 === 1 ? '#3a8a2a' : '#45992e';
            if (seed < 15) {
              // Small flower
              ctx.fillRect(cx - p, py + ts * 0.6, p * 2, ts * 0.15);
              ctx.fillRect(cx, py + ts * 0.45, p, ts * 0.2);
              this.circ(ctx, cx, py + ts * 0.4, p * 1.2, seed < 8 ? '#FF69B4' : '#FFD700');
            } else {
              // Grass blades
              ctx.fillRect(cx - p * (seed % 3 + 1), py + ts * 0.5, p * 0.5, ts * 0.3);
              ctx.fillRect(cx + p * (seed % 2), py + ts * 0.45, p * 0.5, ts * 0.35);
              if (seed % 4 === 0) ctx.fillRect(cx - p, py + ts * 0.55, p, ts * 0.25);
            }
            break;
          }
          case 'fire': {
            // Cracks and embers
            ctx.fillStyle = `rgba(180,60,0,${0.1 + (seed % 5) * 0.04})`;
            ctx.fillRect(cx - p, cy - p * 0.5, p * 2, p);
            if (seed < 10) {
              ctx.fillStyle = `rgba(255,150,0,${0.15 + Math.sin(Date.now() * 0.005 + seed) * 0.1})`;
              this.circ(ctx, cx, cy, p, ctx.fillStyle as string);
            }
            break;
          }
          case 'water': {
            // Water ripples
            const wave = Math.sin(Date.now() * 0.002 + x * 0.5 + y * 0.3) * p;
            ctx.fillStyle = `rgba(100,180,255,${0.08 + (seed % 5) * 0.02})`;
            ctx.beginPath();
            ctx.ellipse(cx, cy + wave, p * 2, p * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'wind': {
            // Wind swirls
            if (seed < 12) {
              const sw = Math.sin(Date.now() * 0.003 + seed) * p * 2;
              ctx.fillStyle = `rgba(200,220,255,0.1)`;
              ctx.beginPath();
              ctx.arc(cx + sw, cy, p * 1.5, 0, Math.PI); ctx.fill();
            }
            break;
          }
          case 'swamp': {
            // Bubbles and moss
            if (seed < 10) {
              const bs = Math.sin(Date.now() * 0.002 + seed * 3) * p;
              ctx.fillStyle = 'rgba(100,140,50,0.15)';
              this.circ(ctx, cx + bs, cy + bs * 0.5, p * 1.5, 'rgba(80,120,30,0.12)');
            }
            if (seed > 20 && seed < 28) {
              ctx.fillStyle = 'rgba(80,110,40,0.2)';
              ctx.fillRect(cx - p, cy, p * 2, p * 0.5);
            }
            break;
          }
          case 'ice': {
            // Ice crystals
            if (seed < 15) {
              ctx.fillStyle = 'rgba(200,230,255,0.12)';
              ctx.fillRect(cx - p * 0.5, cy - p, p, p * 2);
              ctx.fillRect(cx - p, cy - p * 0.5, p * 2, p);
            }
            break;
          }
          case 'cloud': {
            // Puffy clouds
            if (seed < 18) {
              ctx.fillStyle = 'rgba(255,255,255,0.08)';
              this.circ(ctx, cx, cy, p * 2, 'rgba(255,255,255,0.06)');
              this.circ(ctx, cx - p, cy - p * 0.5, p * 1.2, 'rgba(255,255,255,0.05)');
            }
            break;
          }
          case 'stone': {
            // Pebbles
            if (seed < 12) {
              ctx.fillStyle = 'rgba(100,100,90,0.15)';
              this.circ(ctx, cx + (seed % 3 - 1) * p, cy + (seed % 5 - 2) * p * 0.3, p * 0.8, 'rgba(90,90,80,0.12)');
            }
            break;
          }
        }
      }
    }
  }

  // ─── MAP ───
  private drawMap(ctx: CanvasRenderingContext2D, state: GameState) {
    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) {
        const cell = state.map[y][x];
        const cx = x * this.ts, cy = y * this.ts;
        switch (cell.type) {
          case 'wall': this.drawWall(ctx, cx, cy, state.theme); break;
          case 'block': this.drawBlock(ctx, cx, cy, cell, state.theme); break;
          case 'chest': this.drawChest(ctx, cx, cy, cell, state.theme); break;
        }
      }
    }
  }

  private drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, theme: MapTheme) {
    const { ts, p } = this;
    const t = MAP_THEMES[theme];
    ctx.fillStyle = t.wall;
    ctx.fillRect(x, y, ts, ts);
    ctx.fillStyle = t.wallLight;
    ctx.fillRect(x + p, y + p, ts - p * 2, ts * 0.4 - p);
    ctx.fillStyle = t.wall;
    ctx.fillRect(x + p, y + ts * 0.45, ts - p * 2, ts * 0.4 - p);
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(x + p, y + ts * 0.4, ts - p * 2, p);
    ctx.fillRect(x + ts * 0.45, y + p, p, ts * 0.4 - p);
    ctx.fillRect(x + ts * 0.25, y + ts * 0.45, p, ts * 0.4 - p);
    ctx.fillStyle = t.wallLight;
    ctx.fillRect(x + p, y + p, ts - p * 2, p * 2);
    ctx.fillStyle = t.wallDark;
    ctx.fillRect(x + p, y + ts - p * 3, ts - p * 2, p * 2);
  }

  private drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, cell: Cell, theme: MapTheme) {
    const { ts, p } = this;
    const t = MAP_THEMES[theme];
    const dmg = 1 - cell.hp / cell.maxHp;
    const m = p * 2;
    ctx.fillStyle = dmg > 0.5 ? t.blockDark : t.block;
    ctx.fillRect(x + m, y + m, ts - m * 2, ts - m * 2);
    ctx.fillStyle = t.blockGrain;
    ctx.fillRect(x + m, y + ts * 0.3, ts - m * 2, p);
    ctx.fillRect(x + m, y + ts * 0.6, ts - m * 2, p);
    ctx.fillStyle = t.blockLight;
    ctx.fillRect(x + m, y + m, ts - m * 2, p);
    ctx.fillStyle = t.blockDark;
    ctx.fillRect(x + m, y + ts - m - p, ts - m * 2, p);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(x + m + p, y + m + p, p, p);
    ctx.fillRect(x + ts - m - p * 2, y + m + p, p, p);
    ctx.fillRect(x + m + p, y + ts - m - p * 2, p, p);
    ctx.fillRect(x + ts - m - p * 2, y + ts - m - p * 2, p, p);
    if (dmg > 0.3) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x + ts * 0.3, y + ts * 0.2, p, ts * 0.3);
      ctx.fillRect(x + ts * 0.5, y + ts * 0.4, ts * 0.2, p);
    }
  }

  private drawChest(ctx: CanvasRenderingContext2D, x: number, y: number, cell: Cell, _theme: MapTheme) {
    const { ts, p } = this;
    const dmg = 1 - cell.hp / cell.maxHp;
    const cx = x + ts / 2, cy = y + ts / 2;
    const m = p * 1.5;

    // Golden glow
    ctx.fillStyle = 'rgba(255,215,0,0.15)';
    ctx.beginPath(); ctx.arc(cx, cy, ts * 0.65, 0, Math.PI * 2); ctx.fill();

    const bodyY = y + ts * 0.38, bodyH = ts * 0.48;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, y + ts * 0.92, ts * 0.4, ts * 0.06, 0, 0, Math.PI * 2); ctx.fill();

    // Chest body (dark wood)
    const bodyColor = dmg > 0.6 ? '#5a3510' : dmg > 0.3 ? '#6B4226' : '#7B4B2A';
    ctx.fillStyle = bodyColor;
    ctx.beginPath(); ctx.roundRect(x + m, bodyY, ts - m * 2, bodyH, p); ctx.fill();

    // Wood grain lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = p * 0.5;
    ctx.beginPath(); ctx.moveTo(x + m + p, bodyY + bodyH * 0.3); ctx.lineTo(x + ts - m - p, bodyY + bodyH * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + m + p, bodyY + bodyH * 0.65); ctx.lineTo(x + ts - m - p, bodyY + bodyH * 0.65); ctx.stroke();

    // Metal bands (horizontal)
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(x + m, bodyY, ts - m * 2, p * 1.5);
    ctx.fillRect(x + m, bodyY + bodyH - p * 1.5, ts - m * 2, p * 1.5);

    // Metal band (vertical center)
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(cx - p * 0.75, bodyY, p * 1.5, bodyH);

    // Chest lid (lighter wood)
    const lidColor = dmg > 0.6 ? '#7a4a20' : dmg > 0.3 ? '#9B6B3F' : '#A8784A';
    ctx.fillStyle = lidColor;
    ctx.beginPath(); ctx.roundRect(x + m, y + ts * 0.18, ts - m * 2, ts * 0.22, [p, p, 0, 0]); ctx.fill();

    // Lid highlight
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x + m + p, y + ts * 0.19, ts - m * 2 - p * 2, p * 1.5);

    // Gold trim on lid edge
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(x + m, y + ts * 0.38, ts - m * 2, p * 1.2);

    // Lock plate
    const lockW = ts * 0.16, lockH = ts * 0.14;
    ctx.fillStyle = '#DAA520';
    ctx.beginPath(); ctx.roundRect(cx - lockW / 2, bodyY + bodyH * 0.2, lockW, lockH, p * 0.5); ctx.fill();

    // Keyhole
    ctx.fillStyle = '#333';
    this.circ(ctx, cx, bodyY + bodyH * 0.2 + lockH * 0.35, p * 0.7, '#333');
    ctx.fillRect(cx - p * 0.3, bodyY + bodyH * 0.2 + lockH * 0.5, p * 0.6, p);

    // Corner rivets
    ctx.fillStyle = '#AA8855';
    this.circ(ctx, x + m + p * 1.5, bodyY + p * 1.5, p, '#AA8855');
    this.circ(ctx, x + ts - m - p * 1.5, bodyY + p * 1.5, p, '#AA8855');
    this.circ(ctx, x + m + p * 1.5, bodyY + bodyH - p * 1.5, p, '#AA8855');
    this.circ(ctx, x + ts - m - p * 1.5, bodyY + bodyH - p * 1.5, p, '#AA8855');

    // Sparkle animation
    const st = Date.now() * 0.004;
    const sa = 0.6 + Math.sin(st * 2.5) * 0.3;
    this.circ(ctx, x + ts * 0.2 + Math.sin(st) * ts * 0.1, y + ts * 0.1, p * 1.5, `rgba(255,255,200,${sa})`);
    this.circ(ctx, x + ts * 0.8 + Math.cos(st * 1.3) * ts * 0.08, y + ts * 0.08, p, `rgba(255,255,200,${sa * 0.7})`);

    // Coin peeking from lid (if not too damaged)
    if (dmg < 0.5) {
      ctx.fillStyle = '#FFD700';
      this.circ(ctx, cx - ts * 0.08, y + ts * 0.16, p * 1.2, '#FFD700');
      this.circ(ctx, cx + ts * 0.1, y + ts * 0.14, p, '#FFC107');
    }

    // HP bar
    this.drawHpBar(ctx, x + ts * 0.1, y - p * 2, ts * 0.8, p * 2.5, cell.hp / cell.maxHp, '#4CAF50', '#F44336');
  }

  private drawHpBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, ratio: number, goodColor: string, badColor: string) {
    const r = Math.max(0, Math.min(1, ratio));
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
    ctx.fillStyle = r > 0.5 ? goodColor : r > 0.25 ? '#FF9800' : badColor;
    if (r > 0) {
      ctx.beginPath(); ctx.roundRect(x + 1, y + 1, (w - 2) * r, h - 2, (h - 2) / 2); ctx.fill();
    }
  }

  // ─── BOMBS ───
  private drawBombs(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    for (const bomb of state.bombs) {
      const bx = bomb.x * ts + ts / 2, by = bomb.y * ts + ts / 2;
      const pulse = 1 + Math.sin(bomb.animTimer * 10) * 0.06;
      const r = ts * 0.28 * pulse;
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(bx, by + r, r * 0.8, r * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      // Body
      this.circ(ctx, bx, by, r, '#2a2a2a');
      this.circ(ctx, bx - r * 0.2, by - r * 0.2, r * 0.35, 'rgba(255,255,255,0.1)');
      // Fuse
      ctx.strokeStyle = '#8B6914'; ctx.lineWidth = this.p;
      ctx.beginPath(); ctx.moveTo(bx, by - r);
      ctx.quadraticCurveTo(bx + r * 0.4, by - r * 1.5, bx + r * 0.6, by - r * 1.2); ctx.stroke();
      if (Math.sin(bomb.animTimer * 18) > -0.3) {
        this.circ(ctx, bx + r * 0.6, by - r * 1.2, this.p * 2, '#FF8800');
        this.circ(ctx, bx + r * 0.6, by - r * 1.2, this.p, '#FFEE44');
      }
    }
  }

  // ─── EXPLOSIONS (SUPER LIGHT!) ───
  private drawExplosions(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    const prevComp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';
    for (const exp of state.explosions) {
      const a = Math.max(0, exp.timer / exp.maxTimer);
      for (const cell of exp.cells) {
        const cx = cell.x * ts + ts / 2, cy = cell.y * ts + ts / 2;
        // Big soft glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, ts * 0.8);
        grd.addColorStop(0, `rgba(255,240,200,${a * 0.9})`);
        grd.addColorStop(0.25, `rgba(255,220,100,${a * 0.7})`);
        grd.addColorStop(0.5, `rgba(255,180,50,${a * 0.45})`);
        grd.addColorStop(0.75, `rgba(255,120,20,${a * 0.2})`);
        grd.addColorStop(1, `rgba(255,60,0,0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(cx - ts, cy - ts, ts * 2, ts * 2);
        // White hot center
        this.circ(ctx, cx, cy, ts * 0.18, `rgba(255,255,255,${a * 0.95})`);
        this.circ(ctx, cx, cy, ts * 0.1, `rgba(255,255,255,${a})`);
      }
    }
    ctx.globalCompositeOperation = prevComp;
  }

  // ─── HEROES ───
  private drawHeroes(ctx: CanvasRenderingContext2D, state: GameState) {
    const sorted = [...state.heroes].sort((a, b) => a.y - b.y);
    for (const hero of sorted) this.drawHero(ctx, hero);
    // Draw hero drops (cages)
    for (const drop of state.heroDrops) {
      if (!drop.collected) this.drawCage(ctx, drop);
    }
  }

  private drawCage(ctx: CanvasRenderingContext2D, drop: { x: number; y: number; timer: number; maxTimer: number; hero: { headType: HeadType; rarity: Rarity }; hp: number; maxHp: number }) {
    const { ts, p } = this;
    const cx = drop.x * ts + ts / 2;
    const cy = drop.y * ts + ts / 2;
    const r = ts * 0.5;
    const alpha = 1;

    // Mystery glow (white/silver - no rarity hint)
    const t = Date.now() * 0.003;
    const glowAlpha = 0.15 + Math.sin(t) * 0.08;
    ctx.fillStyle = `rgba(200,200,255,${glowAlpha})`;
    ctx.beginPath(); ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2); ctx.fill();

    // Cage dome (thick metal ring)
    ctx.strokeStyle = `rgba(140,140,160,0.95)`;
    ctx.lineWidth = p * 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    // Inner ring
    ctx.strokeStyle = `rgba(100,100,120,0.8)`;
    ctx.lineWidth = p;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2); ctx.stroke();

    // Cage bars (vertical)
    ctx.strokeStyle = `rgba(180,180,200,0.7)`;
    ctx.lineWidth = p * 0.8;
    for (let i = -4; i <= 4; i++) {
      const angle = (i / 4) * (Math.PI * 0.42);
      const bx = cx + Math.sin(angle) * r * 0.88;
      ctx.beginPath(); ctx.moveTo(bx, cy - r * 0.82); ctx.lineTo(bx, cy + r * 0.82); ctx.stroke();
    }
    // Horizontal bars
    for (let j = -2; j <= 2; j++) {
      ctx.beginPath(); ctx.moveTo(cx - r * 0.88, cy + j * r * 0.33); ctx.lineTo(cx + r * 0.88, cy + j * r * 0.33); ctx.stroke();
    }

    // Mystery silhouette inside (dark shadow)
    ctx.fillStyle = `rgba(30,20,40,0.5)`;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill();

    // Big ??? in center
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${r * 0.9}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255,255,255,0.85)`;
    ctx.strokeStyle = `rgba(0,0,0,0.5)`;
    ctx.lineWidth = 2;
    ctx.strokeText('?', cx, cy - r * 0.15);
    ctx.fillText('?', cx, cy - r * 0.15);
    ctx.font = `bold ${r * 0.6}px monospace`;
    ctx.strokeText('?', cx - r * 0.45, cy + r * 0.35);
    ctx.fillText('?', cx - r * 0.45, cy + r * 0.35);
    ctx.strokeText('?', cx + r * 0.45, cy + r * 0.25);
    ctx.fillText('?', cx + r * 0.45, cy + r * 0.25);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = 1;

    // HP bar above cage
    this.drawHpBar(ctx, cx - r * 1.1, cy - r - p * 5, r * 2.2, p * 2.5, drop.hp / drop.maxHp, '#60A5FA', '#F44336');

    // HP text
    ctx.font = `bold ${p * 2.5}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`${drop.hp}/${drop.maxHp}`, cx, cy - r - p * 5.5);

    // Pulsing "Jaula!" text
    const pulseA = 0.6 + Math.sin(Date.now() * 0.005) * 0.3;
    ctx.font = `bold ${p * 2.5}px monospace`;
    ctx.fillStyle = `rgba(150,200,255,${pulseA})`;
    ctx.strokeStyle = `rgba(0,0,0,0.5)`;
    ctx.lineWidth = 2;
    ctx.strokeText('🔒 JAULA', cx, cy + r + p * 5);
    ctx.fillText('🔒 JAULA', cx, cy + r + p * 5);
    ctx.textAlign = 'start';
  }

  private drawHero(ctx: CanvasRenderingContext2D, hero: RuntimeHero) {
    const { ts, p } = this;
    const pal = PALETTES[hero.rarity];
    const cx = hero.x * ts + ts / 2, cy = hero.y * ts + ts / 2;
    const isMoving = hero.state === 'moving' || hero.state === 'fleeing';
    const isBombing = hero.state === 'bombing';
    const isFleeing = hero.state === 'fleeing';
    const isResting = hero.state === 'resting';
    const walkSpeed = isFleeing ? 14 : 10;
    const walkFrame = isMoving ? Math.floor(hero.animTimer * walkSpeed) % 4 : 0;
    const walkPhase = [0, 1, 0, -1][walkFrame];
    const bob = isMoving ? Math.abs(Math.sin(hero.animTimer * walkSpeed)) * p * 1.5 : Math.sin(hero.animTimer * 3) * p * 0.5;
    const ox = cx - 5 * p, oy = cy - 9 * p + bob;

    // ─── RARITY AURA ───
    const auraColors: Record<Rarity, { inner: string; outer: string }> = {
      common: { inner: 'rgba(180,180,170,0.12)', outer: 'rgba(180,180,170,0)' },
      rare: { inner: 'rgba(80,130,255,0.22)', outer: 'rgba(80,130,255,0)' },
      super_rare: { inner: 'rgba(160,60,240,0.25)', outer: 'rgba(160,60,240,0)' },
      epic: { inner: 'rgba(255,120,20,0.28)', outer: 'rgba(255,120,20,0)' },
      super_epic: { inner: 'rgba(255,40,40,0.32)', outer: 'rgba(255,40,40,0)' },
      legendary: { inner: 'rgba(255,200,40,0.35)', outer: 'rgba(255,200,40,0)' },
      super_legendary: { inner: 'rgba(200,180,255,0.4)', outer: 'rgba(200,180,255,0)' },
    };
    const aura = auraColors[hero.rarity];
    const auraPulse = 1 + Math.sin(hero.animTimer * 3) * 0.15;
    const auraR = ts * 0.65 * auraPulse;
    const grd = ctx.createRadialGradient(cx, cy - p * 2, ts * 0.15, cx, cy - p * 2, auraR);
    grd.addColorStop(0, aura.inner);
    grd.addColorStop(1, aura.outer);
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy - p * 2, auraR, 0, Math.PI * 2); ctx.fill();
    // Second glow layer for rare+
    if (hero.rarity !== 'common') {
      const pulse2 = 0.6 + Math.sin(hero.animTimer * 5 + 1) * 0.3;
      const r2Col = hero.rarity === 'rare' ? `rgba(100,150,255,${pulse2 * 0.12})` :
                    hero.rarity === 'super_rare' ? `rgba(180,80,255,${pulse2 * 0.14})` :
                    hero.rarity === 'epic' ? `rgba(255,140,30,${pulse2 * 0.16})` :
                    hero.rarity === 'super_epic' ? `rgba(255,50,50,${pulse2 * 0.18})` :
                    hero.rarity === 'legendary' ? `rgba(255,220,60,${pulse2 * 0.2})` :
                    `rgba(200,180,255,${pulse2 * 0.25})`;
      this.circ(ctx, cx, cy - p * 2, ts * 0.45 * auraPulse, r2Col);
    }
    // Sparkle particles for legendary
    if (hero.rarity === 'legendary') {
      for (let i = 0; i < 3; i++) {
        const angle = hero.animTimer * 2 + i * Math.PI * 2 / 3;
        const dist = ts * 0.35 + Math.sin(hero.animTimer * 4 + i) * p * 2;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy - p * 2 + Math.sin(angle) * dist;
        const sa = 0.4 + Math.sin(hero.animTimer * 6 + i * 2) * 0.3;
        this.circ(ctx, sx, sy, p * 0.8, `rgba(255,255,180,${sa})`);
      }
    }

    // Speed lines
    if (isFleeing) {
      const la = 0.3 + Math.sin(hero.animTimer * 15) * 0.2;
      ctx.strokeStyle = `rgba(255,255,255,${la})`; ctx.lineWidth = p;
      for (let i = 0; i < 3; i++) {
        const o = (i - 1) * p * 3;
        if (hero.direction === 'right') { ctx.beginPath(); ctx.moveTo(ox - p * 3, oy + 5 * p + o); ctx.lineTo(ox - p, oy + 5 * p + o); ctx.stroke(); }
        else if (hero.direction === 'left') { ctx.beginPath(); ctx.moveTo(ox + 11 * p, oy + 5 * p + o); ctx.lineTo(ox + 13 * p, oy + 5 * p + o); ctx.stroke(); }
      }
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, cy + 5 * p + p, 5 * p, 2 * p, 0, 0, Math.PI * 2); ctx.fill();

    // LEGS
    const ls = walkPhase * p * 2;
    const legW = p * 2, legH = p * 4 - Math.abs(ls);
    ctx.fillStyle = pal.bodyDark;
    ctx.beginPath();
    ctx.roundRect(ox + 2 * p, oy + 10 * p + ls, legW, legH, p);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ox + 6 * p, oy + 10 * p - ls, legW, legH, p);
    ctx.fill();
    // Shoes
    ctx.fillStyle = '#5a4a3a';
    this.circ(ctx, ox + 3 * p, oy + 13.5 * p + ls, p * 1.5, '#5a4a3a');
    this.circ(ctx, ox + 7 * p, oy + 13.5 * p - ls, p * 1.5, '#5a4a3a');

    // BODY (rounded)
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.roundRect(ox + p, oy + 3 * p, 8 * p, 7 * p, p * 2);
    ctx.fill();
    // Body highlight
    ctx.fillStyle = pal.bodyLight;
    ctx.beginPath();
    ctx.roundRect(ox + p * 2, oy + 3 * p, 6 * p, p * 1.5, p);
    ctx.fill();
    // Belt
    ctx.fillStyle = pal.bodyDark;
    ctx.fillRect(ox + p, oy + 7 * p, 8 * p, p);
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(ox + 4 * p, oy + 7 * p, 2 * p, p);

    // ARMS
    const as = walkPhase * p * 2;
    const bl = isBombing ? -p * 3 : 0;
    ctx.fillStyle = pal.body;
    ctx.beginPath(); ctx.roundRect(ox - p, oy + 4 * p + as + bl, p * 2.5, p * 5, p); ctx.fill();
    ctx.beginPath(); ctx.roundRect(ox + 8.5 * p, oy + 4 * p - as, p * 2.5, p * 5, p); ctx.fill();
    // Hands
    this.circ(ctx, ox + p * 0.25, oy + 9 * p + as + bl, p, '#FFDAB9');
    this.circ(ctx, ox + 9.75 * p, oy + 9 * p - as, p, '#FFDAB9');

    // Bomb in hand
    if (isBombing) {
      this.circ(ctx, ox - p, oy + 2.5 * p + bl, p * 1.5, '#333');
      ctx.fillStyle = '#FF8800';
      ctx.fillRect(ox - p * 0.5, oy + p + bl, p, p);
    }

    // ─── HEAD (ORGANIC ANIMAL) ───
    this.drawHead(ctx, cx, oy, p, hero.headType, hero.animTimer, isMoving, isBombing, isResting, hero.direction, hero.rarity);

    // SLEEPING ZZZ
    if (isResting) {
      const zt = hero.animTimer * 3;
      ctx.font = `bold ${p * 2.5}px monospace`;
      ctx.fillStyle = `rgba(135,206,235,${0.5 + Math.sin(zt) * 0.3})`;
      ctx.fillText('Z', cx + 7 * p, oy - p + Math.sin(zt) * p * 2);
      ctx.font = `bold ${p * 2}px monospace`;
      ctx.fillText('z', cx + 10 * p, oy - 4 * p + Math.sin(zt + 1) * p * 1.5);
    }

    // STAMINA BAR
    const bw = 10 * p, bh = p * 1.5, bx = cx - bw / 2, by = oy + 15 * p;
    const sr = hero.stamina / hero.maxStamina;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(bx - p * 0.5, by - p * 0.5, bw + p, bh + p, p); ctx.fill();
    const sCol = sr > 0.5 ? '#4CAF50' : sr > 0.25 ? '#FF9800' : '#F44336';
    ctx.fillStyle = sCol;
    ctx.beginPath(); ctx.roundRect(bx, by, bw * Math.max(0, sr), bh, p * 0.5); ctx.fill();

    // NO NAME TAG on map - names shown in sidebar only
  }

  // ─── HEAD DRAWING (ORGANIC/ROUNDED) ───
  private drawHead(ctx: CanvasRenderingContext2D, cx: number, oy: number, p: number, head: HeadType, anim: number, _moving: boolean, bombing: boolean, resting: boolean, dir: Direction, rarity: Rarity) {
    const blink = Math.sin(anim * 2.5) > 0.93 || resting;
    const headCy = oy - 1 * p;
    const headR = p * 5.5;
    const pdx = dir === 'left' ? -p * 0.3 : dir === 'right' ? p * 0.3 : 0;
    const pdy = dir === 'up' ? -p * 0.3 : dir === 'down' ? p * 0.3 : 0;

    const drawEyes = (leftX: number, rightX: number, ey: number, er: number, pupilColor: string) => {
      if (!blink) {
        this.circ(ctx, leftX, ey, er, '#FFF');
        this.circ(ctx, leftX + pdx * 0.4, ey + pdy * 0.3, er * 0.5, pupilColor);
        this.circ(ctx, rightX, ey, er, '#FFF');
        this.circ(ctx, rightX + pdx * 0.4, ey + pdy * 0.3, er * 0.5, pupilColor);
      } else {
        ctx.strokeStyle = '#333'; ctx.lineWidth = p * 0.5;
        ctx.beginPath(); ctx.moveTo(leftX - er, ey); ctx.lineTo(leftX + er, ey); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rightX - er, ey); ctx.lineTo(rightX + er, ey); ctx.stroke();
      }
    };

    switch (head) {
      case 'frog': {
        // Wide round green head
        this.circ(ctx, cx, headCy, headR * 1.15, '#4a9a2a');
        this.circ(ctx, cx, headCy - p, headR * 1.1, '#5aaa3a');
        // Eye bumps (protruding)
        this.circ(ctx, cx - p * 3.5, headCy - p * 4, p * 2.8, '#5aaa3a');
        this.circ(ctx, cx + p * 3.5, headCy - p * 4, p * 2.8, '#5aaa3a');
        // Eyes
        this.circ(ctx, cx - p * 3.5, headCy - p * 4, p * 2, '#FFF');
        this.circ(ctx, cx + p * 3.5, headCy - p * 4, p * 2, '#FFF');
        if (!blink) {
          this.circ(ctx, cx - p * 3.5 + pdx, headCy - p * 4 + pdy, p, '#111');
          this.circ(ctx, cx + p * 3.5 + pdx, headCy - p * 4 + pdy, p, '#111');
        } else {
          ctx.strokeStyle = '#333'; ctx.lineWidth = p;
          ctx.beginPath(); ctx.moveTo(cx - p * 5, headCy - p * 4); ctx.lineTo(cx - p * 2, headCy - p * 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + p * 2, headCy - p * 4); ctx.lineTo(cx + p * 5, headCy - p * 4); ctx.stroke();
        }
        // Wide mouth
        ctx.strokeStyle = '#2a7a0a'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 1.5, p * 4, 0.1, Math.PI - 0.1); ctx.stroke();
        // Nostrils
        this.circ(ctx, cx - p * 1.5, headCy - p * 0.5, p * 0.6, '#2a7a0a');
        this.circ(ctx, cx + p * 1.5, headCy - p * 0.5, p * 0.6, '#2a7a0a');
        break;
      }
      case 'ninja': {
        // Dark round head
        this.circ(ctx, cx, headCy, headR, '#1a1a2a');
        // Red headband with tail
        ctx.fillStyle = '#cc2222';
        ctx.beginPath();
        ctx.ellipse(cx, headCy - p * 1.5, p * 6.5, p * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Headband tail flowing
        ctx.strokeStyle = '#cc2222'; ctx.lineWidth = p * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - p * 6, headCy - p * 1.5);
        ctx.quadraticCurveTo(cx - p * 8, headCy - p * 0.5 + Math.sin(anim * 4) * p, cx - p * 9, headCy - p * 2 + Math.sin(anim * 3) * p * 1.5);
        ctx.stroke();
        // Eyes only
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy + p, p * 1.2, bombing ? '#c00' : '#222');
        break;
      }
      case 'cowboy': {
        // Skin face
        this.circ(ctx, cx, headCy, headR * 0.9, '#FFDAB9');
        this.circ(ctx, cx, headCy - p, headR * 0.85, '#FFE8CC');
        // Hat brim (wide ellipse)
        ctx.fillStyle = '#8B5A2B';
        ctx.beginPath();
        ctx.ellipse(cx, headCy - p * 4, p * 8, p * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Hat crown
        ctx.fillStyle = '#A0722B';
        ctx.beginPath();
        ctx.roundRect(cx - p * 4, headCy - p * 9, p * 8, p * 5, p * 2);
        ctx.fill();
        ctx.fillStyle = '#8B5A2B';
        ctx.fillRect(cx - p * 4.5, headCy - p * 5, p * 9, p);
        // Hat band
        ctx.fillStyle = '#6a4020';
        ctx.fillRect(cx - p * 4, headCy - p * 5, p * 8, p);
        // Eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy, p * 1.2, '#333');
        // Mustache
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 2.5, p * 3.5, p, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'vampire': {
        // Pale face
        this.circ(ctx, cx, headCy, headR, '#E8D8D8');
        this.circ(ctx, cx, headCy - p, headR * 0.95, '#F0E8E8');
        // Widow's peak hair
        ctx.fillStyle = '#1a1020';
        ctx.beginPath();
        ctx.arc(cx, headCy - p * 2, p * 6, Math.PI + 0.3, -0.3);
        ctx.quadraticCurveTo(cx, headCy - p * 5, cx, headCy + p * 2);
        ctx.lineTo(cx - p * 5, headCy - p * 1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1a1020';
        ctx.beginPath();
        ctx.arc(cx, headCy - p * 2, p * 6, Math.PI + 0.3, -0.3, true);
        ctx.quadraticCurveTo(cx, headCy - p * 5, cx, headCy + p * 2);
        ctx.lineTo(cx + p * 5, headCy - p * 1);
        ctx.closePath();
        ctx.fill();
        // Ears (pointy)
        ctx.fillStyle = '#E8D8D8';
        ctx.beginPath(); ctx.moveTo(cx - p * 5, headCy - p * 2); ctx.lineTo(cx - p * 7, headCy - p * 5); ctx.lineTo(cx - p * 4, headCy - p * 0.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 5, headCy - p * 2); ctx.lineTo(cx + p * 7, headCy - p * 5); ctx.lineTo(cx + p * 4, headCy - p * 0.5); ctx.closePath(); ctx.fill();
        // Red eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 0.5, p * 1.3, '#cc0000');
        // Fangs
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 2); ctx.lineTo(cx - p, headCy + p * 4); ctx.lineTo(cx - p * 0.5, headCy + p * 2); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 0.5, headCy + p * 2); ctx.lineTo(cx + p, headCy + p * 4); ctx.lineTo(cx + p * 1.5, headCy + p * 2); ctx.closePath(); ctx.fill();
        // Mouth line
        ctx.strokeStyle = '#8a4040'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.moveTo(cx - p * 2, headCy + p * 2); ctx.lineTo(cx + p * 2, headCy + p * 2); ctx.stroke();
        break;
      }
      case 'werewolf': {
        // Fur head (slightly elongated)
        ctx.fillStyle = '#7a6a50';
        ctx.beginPath();
        ctx.ellipse(cx, headCy, p * 5.5, p * 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Darker bottom
        ctx.fillStyle = '#5a4a30';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 2, p * 5, p * 4, 0, 0, Math.PI);
        ctx.fill();
        // Pointy ears
        ctx.fillStyle = '#7a6a50';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 3.5, headCy - p * 7); ctx.lineTo(cx - p * 2, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 3.5, headCy - p * 7); ctx.lineTo(cx + p * 2, headCy - p * 3); ctx.closePath(); ctx.fill();
        // Inner ears
        ctx.fillStyle = '#9a8a70';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 2.5); ctx.lineTo(cx - p * 3.2, headCy - p * 5.5); ctx.lineTo(cx - p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 2.5); ctx.lineTo(cx + p * 3.2, headCy - p * 5.5); ctx.lineTo(cx + p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        // Snout
        ctx.fillStyle = '#9a8a70';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 1.5, p * 3, p * 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        this.circ(ctx, cx, headCy + p * 0.5, p * 1.2, '#333');
        this.circ(ctx, cx - p * 0.5, headCy + p * 0.3, p * 0.4, 'rgba(255,255,255,0.2)');
        // Eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 1, p * 1.2, bombing ? '#cc0' : '#442200');
        // Mouth
        ctx.strokeStyle = '#4a3a1a'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2.5, p * 2, 0.2, Math.PI - 0.2); ctx.stroke();
        break;
      }
      case 'wizard': {
        // Face
        this.circ(ctx, cx, headCy + p, headR * 0.75, '#FFDAB9');
        // Pointy hat
        ctx.fillStyle = '#4a2a8a';
        ctx.beginPath();
        ctx.moveTo(cx - p * 5.5, headCy - p * 3);
        ctx.lineTo(cx, headCy - p * 11);
        ctx.lineTo(cx + p * 5.5, headCy - p * 3);
        ctx.closePath();
        ctx.fill();
        // Hat brim
        ctx.fillStyle = '#3a1a7a';
        ctx.beginPath();
        ctx.ellipse(cx, headCy - p * 3, p * 7, p * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Star on hat
        this.circ(ctx, cx + p * 0.5, headCy - p * 7, p, '#FFD700');
        // Beard
        ctx.fillStyle = '#DDD';
        ctx.beginPath();
        ctx.moveTo(cx - p * 3, headCy + p * 3);
        ctx.quadraticCurveTo(cx - p * 3.5, headCy + p * 7, cx, headCy + p * 9);
        ctx.quadraticCurveTo(cx + p * 3.5, headCy + p * 7, cx + p * 3, headCy + p * 3);
        ctx.closePath();
        ctx.fill();
        // Eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy, p * 1, '#339');
        // Eyebrows
        ctx.fillStyle = '#888';
        ctx.beginPath(); ctx.ellipse(cx - p * 2.5, headCy - p * 1.5, p * 2, p * 0.6, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + p * 2.5, headCy - p * 1.5, p * 2, p * 0.6, 0.2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'dragon': {
        // Scales head
        ctx.fillStyle = '#2a8a3a';
        ctx.beginPath();
        ctx.ellipse(cx, headCy, p * 6, p * 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Belly scales
        ctx.fillStyle = '#5aaa5a';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p, p * 3.5, p * 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Horns
        ctx.fillStyle = '#8a7a40';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 5, headCy - p * 6); ctx.lineTo(cx - p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 5, headCy - p * 6); ctx.lineTo(cx + p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        // Snout
        ctx.fillStyle = '#3a9a4a';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 2, p * 3, p * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Nostrils
        this.circ(ctx, cx - p * 1, headCy + p * 1.5, p * 0.7, '#1a5a2a');
        this.circ(ctx, cx + p * 1, headCy + p * 1.5, p * 0.7, '#1a5a2a');
        // Smoke from nostrils
        if (bombing) {
          this.circ(ctx, cx - p * 1.5, headCy + p * 0.5 + Math.sin(anim * 6) * p, p * 0.5, 'rgba(200,200,200,0.4)');
          this.circ(ctx, cx + p * 1.5, headCy + p * 0.5 + Math.cos(anim * 6) * p, p * 0.5, 'rgba(200,200,200,0.4)');
        }
        // Eyes (reptilian)
        if (!blink) {
          this.circ(ctx, cx - p * 2.5, headCy - p * 1, p * 1.5, '#FF0');
          this.circ(ctx, cx - p * 2.5 + pdx, headCy - p * 1 + pdy, p * 0.4, '#111');
          this.circ(ctx, cx + p * 2.5, headCy - p * 1, p * 1.5, '#FF0');
          this.circ(ctx, cx + p * 2.5 + pdx, headCy - p * 1 + pdy, p * 0.4, '#111');
        }
        // Mouth
        ctx.strokeStyle = '#c44'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 3, p * 2, 0.2, Math.PI - 0.2); ctx.stroke();
        break;
      }
      case 'fox': {
        // Orange fur
        ctx.fillStyle = '#E87830';
        ctx.beginPath();
        ctx.ellipse(cx, headCy, p * 5, p * 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Big pointy ears
        ctx.fillStyle = '#E87830';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 2); ctx.lineTo(cx - p * 3, headCy - p * 8); ctx.lineTo(cx - p * 1, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 2); ctx.lineTo(cx + p * 3, headCy - p * 8); ctx.lineTo(cx + p * 1, headCy - p * 3); ctx.closePath(); ctx.fill();
        // Inner ears
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.moveTo(cx - p * 3, headCy - p * 2.5); ctx.lineTo(cx - p * 2.8, headCy - p * 6.5); ctx.lineTo(cx - p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3, headCy - p * 2.5); ctx.lineTo(cx + p * 2.8, headCy - p * 6.5); ctx.lineTo(cx + p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        // White cheeks
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 1, p * 3.5, p * 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Pointy snout
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 2, p * 1.5, p * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        this.circ(ctx, cx, headCy + p * 1.5, p * 0.8, '#222');
        // Eyes
        drawEyes(cx - p * 2, cx + p * 2, headCy - p * 1, p * 1, '#222');
        break;
      }
      case 'bear': {
        // Brown round head
        this.circ(ctx, cx, headCy, headR * 1.1, '#8a6a40');
        // Round ears
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 2.5, '#8a6a40');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 2.5, '#8a6a40');
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 1.5, '#6a4a20');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 1.5, '#6a4a20');
        // Light muzzle
        ctx.fillStyle = '#C8A878';
        ctx.beginPath();
        ctx.ellipse(cx, headCy + p * 1.5, p * 3.5, p * 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        this.circ(ctx, cx, headCy + p * 0.5, p * 1.3, '#333');
        this.circ(ctx, cx - p * 0.4, headCy + p * 0.2, p * 0.4, 'rgba(255,255,255,0.15)');
        // Eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 1, p * 1, '#222');
        // Mouth
        ctx.strokeStyle = '#6a4030'; ctx.lineWidth = p * 0.8;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2.5, p * 1.5, 0.3, Math.PI - 0.3); ctx.stroke();
        break;
      }
      case 'cat': {
        // Orange round head
        this.circ(ctx, cx, headCy, headR, '#F4A460');
        this.circ(ctx, cx, headCy - p, headR * 0.95, '#F5B870');
        // Pointy ears
        ctx.fillStyle = '#F4A460';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 3); ctx.lineTo(cx - p * 3, headCy - p * 7); ctx.lineTo(cx - p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 3); ctx.lineTo(cx + p * 3, headCy - p * 7); ctx.lineTo(cx + p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        // Inner ears pink
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 3.5); ctx.lineTo(cx - p * 3, headCy - p * 6); ctx.lineTo(cx - p * 2, headCy - p * 3.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 3.5); ctx.lineTo(cx + p * 3, headCy - p * 6); ctx.lineTo(cx + p * 2, headCy - p * 3.5); ctx.closePath(); ctx.fill();
        // Eyes
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 0.5, p * 1.2, '#222');
        // Nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(cx, headCy + p * 0.5); ctx.lineTo(cx - p * 0.8, headCy + p * 1.2); ctx.lineTo(cx + p * 0.8, headCy + p * 1.2);
        ctx.closePath(); ctx.fill();
        // Whiskers
        ctx.strokeStyle = '#777'; ctx.lineWidth = p * 0.4;
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 1); ctx.lineTo(cx - p * 5, headCy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + p * 1.5, headCy + p * 1); ctx.lineTo(cx + p * 5, headCy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 1.5); ctx.lineTo(cx - p * 5, headCy + p * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + p * 1.5, headCy + p * 1.5); ctx.lineTo(cx + p * 5, headCy + p * 2); ctx.stroke();
        break;
      }
      case 'panda': {
        // White round head
        this.circ(ctx, cx, headCy, headR * 1.15, '#F5F5F5');
        // Black eye patches
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.ellipse(cx - p * 2.5, headCy - p * 0.5, p * 2.2, p * 1.8, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + p * 2.5, headCy - p * 0.5, p * 2.2, p * 1.8, 0.2, 0, Math.PI * 2); ctx.fill();
        // Eyes inside patches
        this.circ(ctx, cx - p * 2.5, headCy - p * 0.5, p * 0.8, '#FFF');
        this.circ(ctx, cx + p * 2.5, headCy - p * 0.5, p * 0.8, '#FFF');
        if (!blink) {
          this.circ(ctx, cx - p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.35, '#111');
          this.circ(ctx, cx + p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.35, '#111');
        }
        // Round ears
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 2, '#222');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 2, '#222');
        // Black nose
        this.circ(ctx, cx, headCy + p * 1, p * 1, '#333');
        // Mouth
        ctx.strokeStyle = '#555'; ctx.lineWidth = p * 0.5;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2, p * 1, 0.3, Math.PI - 0.3); ctx.stroke();
        break;
      }
      case 'skeleton': {
        // White skull
        this.circ(ctx, cx, headCy, headR * 1.05, '#E8E8E8');
        this.circ(ctx, cx, headCy - p, headR, '#F4F4F4');
        // Jaw
        ctx.fillStyle = '#DDD';
        ctx.beginPath();
        ctx.moveTo(cx - p * 3.5, headCy + p * 2);
        ctx.lineTo(cx - p * 2.5, headCy + p * 5);
        ctx.lineTo(cx + p * 2.5, headCy + p * 5);
        ctx.lineTo(cx + p * 3.5, headCy + p * 2);
        ctx.closePath();
        ctx.fill();
        // Teeth
        ctx.fillStyle = '#FFF';
        for (let i = -2; i <= 2; i++) {
          ctx.fillRect(cx + i * p * 1.2 - p * 0.4, headCy + p * 2.5, p * 0.8, p);
        }
        // Eye sockets (dark holes)
        this.circ(ctx, cx - p * 2.5, headCy - p * 0.5, p * 1.8, '#111');
        this.circ(ctx, cx + p * 2.5, headCy - p * 0.5, p * 1.8, '#111');
        // Glowing pupils
        if (!blink) {
          this.circ(ctx, cx - p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.6, '#4F4');
          this.circ(ctx, cx + p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.6, '#4F4');
        }
        // Nose hole
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(cx, headCy + p * 1.5);
        ctx.lineTo(cx - p * 0.8, headCy + p * 0.5);
        ctx.lineTo(cx + p * 0.8, headCy + p * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    // Rarity overlay accessories
    if (rarity === 'legendary') {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.ellipse(cx, headCy - p * 5, p * 5, p * 1, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = -2; i <= 2; i++) {
        const px2 = cx + i * p * 2;
        ctx.beginPath(); ctx.moveTo(px2 - p, headCy - p * 5);
        ctx.lineTo(px2, headCy - p * 7 - Math.abs(i) * p * 0.3);
        ctx.lineTo(px2 + p, headCy - p * 5); ctx.closePath(); ctx.fill();
      }
      this.circ(ctx, cx, headCy - p * 5.5, p * 0.6, '#F44');
    }
    if (rarity === 'super_epic') {
      // Double flame aura
      const flicker = Math.sin(anim * 8) * p;
      ctx.fillStyle = `rgba(255,30,30,${0.2 + Math.sin(anim * 4) * 0.08})`;
      ctx.beginPath(); ctx.arc(cx, headCy, headR * 1.4 + flicker, 0, Math.PI * 2); ctx.fill();
      // Small horns
      ctx.fillStyle = '#CC0000';
      ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 3, headCy - p * 6); ctx.lineTo(cx - p * 2, headCy - p * 2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 3, headCy - p * 6); ctx.lineTo(cx + p * 2, headCy - p * 2); ctx.closePath(); ctx.fill();
    }
    if (rarity === 'super_legendary') {
      // Divine glow
      const glowT = Math.sin(anim * 3) * 0.1 + 0.25;
      ctx.fillStyle = `rgba(220,200,255,${glowT})`;
      ctx.beginPath(); ctx.arc(cx, headCy, headR * 1.6, 0, Math.PI * 2); ctx.fill();
      // Grand crown
      ctx.fillStyle = '#E0E7FF';
      ctx.beginPath(); ctx.ellipse(cx, headCy - p * 5, p * 6, p * 1.2, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = -3; i <= 3; i++) {
        const px2 = cx + i * p * 1.8;
        const h = p * 9 - Math.abs(i) * p * 0.5;
        ctx.beginPath(); ctx.moveTo(px2 - p, headCy - p * 5); ctx.lineTo(px2, headCy - h); ctx.lineTo(px2 + p, headCy - p * 5); ctx.closePath(); ctx.fill();
      }
      // Jewels
      this.circ(ctx, cx, headCy - p * 6, p * 0.8, '#FF4444');
      this.circ(ctx, cx - p * 3, headCy - p * 5.5, p * 0.5, '#44FF44');
      this.circ(ctx, cx + p * 3, headCy - p * 5.5, p * 0.5, '#4444FF');
      // Orbiting stars
      for (let i = 0; i < 3; i++) {
        const angle = anim * 2 + i * Math.PI * 2 / 3;
        const dist = headR * 1.3;
        const sx = cx + Math.cos(angle) * dist;
        const sy = headCy + Math.sin(angle) * dist * 0.6;
        const starA = 0.4 + Math.sin(anim * 5 + i) * 0.3;
        this.circ(ctx, sx, sy, p * 0.8, `rgba(255,255,200,${starA})`);
      }
    }
    if (rarity === 'epic') {
      const flicker = Math.sin(anim * 8) * p;
      ctx.fillStyle = `rgba(255,100,0,${0.15 + Math.sin(anim * 4) * 0.05})`;
      ctx.beginPath(); ctx.arc(cx, headCy, headR * 1.3 + flicker, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ─── PARTICLES ───
  private drawParticles(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    for (const pt of state.particles) {
      const px = pt.x * ts, py = pt.y * ts;
      const alpha = Math.max(0, pt.life / pt.maxLife);
      ctx.globalAlpha = alpha;
      switch (pt.type) {
        case 'coin':
          this.circ(ctx, px, py, pt.size, '#FFD700');
          this.circ(ctx, px, py, pt.size * 0.5, '#FFED4A');
          break;
        case 'spark':
          ctx.fillStyle = pt.color;
          ctx.fillRect(px - pt.size / 2, py - pt.size / 2, pt.size, pt.size);
          break;
        case 'smoke':
          ctx.fillStyle = `rgba(150,150,150,${alpha * 0.35})`;
          ctx.beginPath(); ctx.arc(px, py, pt.size, 0, Math.PI * 2); ctx.fill();
          break;
        case 'text':
          if (pt.text) {
            ctx.font = `bold ${pt.size}px monospace`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 3;
            ctx.strokeText(pt.text, px, py);
            ctx.fillStyle = pt.color;
            ctx.fillText(pt.text, px, py);
            ctx.textAlign = 'start';
          }
          break;
      }
      ctx.globalAlpha = 1;
    }
  }
}
