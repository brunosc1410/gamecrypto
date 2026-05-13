import {
  MAP_COLS, MAP_ROWS, type GameState, type RuntimeHero, type Cell, MAP_THEMES,
  type Rarity, type HeadType, type MapTheme, type Direction,
} from './types';

interface Palette { body: string; bodyDark: string; bodyLight: string; glow: string; }

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
    ctx.save();
    ctx.translate(this.ox, this.oy);
    this.drawFloor(ctx, state.theme);
    this.drawMap(ctx, state);
    // FIX: Draw thick border frame on all 4 sides
    this.drawBorderFrame(ctx, state.theme);
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

  // ─── THICK BORDER FRAME (FIX #3) ───
  private drawBorderFrame(ctx: CanvasRenderingContext2D, theme: MapTheme) {
    const ts = this.ts;
    const p = this.p;
    const t = MAP_THEMES[theme];
    const mapW = MAP_COLS * ts;
    const mapH = MAP_ROWS * ts;
    const borderWidth = ts * 0.55; // Extra thick border

    // Draw 4 thick borders
    // Top border
    const topGrad = ctx.createLinearGradient(0, 0, 0, borderWidth);
    topGrad.addColorStop(0, t.wallDark);
    topGrad.addColorStop(0.4, t.wall);
    topGrad.addColorStop(0.8, t.wallLight);
    topGrad.addColorStop(1, t.wallDark);
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, mapW, borderWidth);
    // Top border inner line
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(0, borderWidth - p, mapW, p);
    // Top border outer line
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, mapW, p * 0.5);

    // Bottom border
    const botGrad = ctx.createLinearGradient(0, mapH - borderWidth, 0, mapH);
    botGrad.addColorStop(0, t.wallDark);
    botGrad.addColorStop(0.2, t.wallLight);
    botGrad.addColorStop(0.6, t.wall);
    botGrad.addColorStop(1, t.wallDark);
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, mapH - borderWidth, mapW, borderWidth);
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(0, mapH - borderWidth, mapW, p);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, mapH - p * 0.5, mapW, p * 0.5);

    // Left border
    const leftGrad = ctx.createLinearGradient(0, 0, borderWidth, 0);
    leftGrad.addColorStop(0, t.wallDark);
    leftGrad.addColorStop(0.4, t.wall);
    leftGrad.addColorStop(0.8, t.wallLight);
    leftGrad.addColorStop(1, t.wallDark);
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, borderWidth, mapH);
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(borderWidth - p, 0, p, mapH);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, p * 0.5, mapH);

    // Right border
    const rightGrad = ctx.createLinearGradient(mapW - borderWidth, 0, mapW, 0);
    rightGrad.addColorStop(0, t.wallDark);
    rightGrad.addColorStop(0.2, t.wallLight);
    rightGrad.addColorStop(0.6, t.wall);
    rightGrad.addColorStop(1, t.wallDark);
    ctx.fillStyle = rightGrad;
    ctx.fillRect(mapW - borderWidth, 0, borderWidth, mapH);
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(mapW - borderWidth, 0, p, mapH);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(mapW - p * 0.5, 0, p * 0.5, mapH);

    // Corner decorations (thicker)
    const cornerSize = borderWidth * 1.2;
    const corners = [
      { x: 0, y: 0 },
      { x: mapW - cornerSize, y: 0 },
      { x: 0, y: mapH - cornerSize },
      { x: mapW - cornerSize, y: mapH - cornerSize },
    ];
    for (const corner of corners) {
      ctx.fillStyle = t.wallLight;
      ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize);
      ctx.fillStyle = t.wall;
      ctx.fillRect(corner.x + p, corner.y + p, cornerSize - p * 2, cornerSize - p * 2);
      ctx.fillStyle = t.wallDark;
      ctx.fillRect(corner.x + p * 2, corner.y + p * 2, cornerSize - p * 4, cornerSize - p * 4);
      // Inner highlight
      ctx.fillStyle = t.wallLight;
      ctx.fillRect(corner.x + p * 3, corner.y + p * 3, cornerSize - p * 6, p);
      ctx.fillRect(corner.x + p * 3, corner.y + p * 3, p, cornerSize - p * 6);
    }

    // Rivets along borders
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    const rivetSpacing = ts * 2;
    // Top and bottom rivets
    for (let x = ts; x < mapW; x += rivetSpacing) {
      this.circ(ctx, x, borderWidth * 0.5, p * 1.5, 'rgba(255,255,255,0.12)');
      this.circ(ctx, x, mapH - borderWidth * 0.5, p * 1.5, 'rgba(255,255,255,0.12)');
    }
    // Left and right rivets
    for (let y = ts; y < mapH; y += rivetSpacing) {
      this.circ(ctx, borderWidth * 0.5, y, p * 1.5, 'rgba(255,255,255,0.12)');
      this.circ(ctx, mapW - borderWidth * 0.5, y, p * 1.5, 'rgba(255,255,255,0.12)');
    }
  }

  // ─── FLOOR ───
  private drawFloor(ctx: CanvasRenderingContext2D, theme: MapTheme) {
    const ts = this.ts;
    const p = this.p;
    const t = MAP_THEMES[theme];
    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) {
        const seed = (x * 7 + y * 13) % 17;
        const px = x * ts, py = y * ts;
        ctx.fillStyle = seed % 2 === 0 ? t.floor1 : t.floor2;
        ctx.fillRect(px, py, ts, ts);
        const cx = px + ts / 2, cy = py + ts / 2;
        switch (theme) {
          case 'stone': {
            // Pebbles and small stones
            if (seed % 4 === 0) {
              this.circ(ctx, cx + (seed % 5 - 2) * p, cy + (seed % 3 - 1) * p, p * (0.8 + seed % 3 * 0.3), 'rgba(80,80,70,0.25)');
              this.circ(ctx, cx + (seed % 3 - 1) * p * 1.5, cy + (seed % 4 - 2) * p * 1.2, p * 0.6, 'rgba(100,100,90,0.2)');
            }
            if (seed % 6 === 0) {
              ctx.strokeStyle = 'rgba(60,60,50,0.15)';
              ctx.lineWidth = p * 0.3;
              ctx.beginPath();
              ctx.moveTo(cx - p * 2, cy + p);
              ctx.lineTo(cx + p * 2, cy - p);
              ctx.stroke();
            }
            // Tiny pebble dots
            if (seed % 5 === 0) this.circ(ctx, cx - p * 2.5, cy + p * 1.5, p * 0.4, 'rgba(90,85,75,0.2)');
            if (seed % 7 === 0) this.circ(ctx, cx + p * 3, cy - p * 2, p * 0.5, 'rgba(85,80,70,0.18)');
            break;
          }
          case 'forest': {
            // Grass tufts
            if (seed % 3 === 0) {
              const gc = seed % 3 === 0 ? '#2d6b1e' : '#3a8a2a';
              ctx.fillStyle = gc;
              ctx.fillRect(cx - p, cy - p * 0.5, p * 0.4, p * 1.5);
              ctx.fillRect(cx - p * 0.2, cy - p, p * 0.4, p * 2);
              ctx.fillRect(cx + p * 0.6, cy - p * 0.3, p * 0.4, p * 1.2);
            }
            // Leaf shapes
            if (seed % 5 === 0) {
              ctx.fillStyle = 'rgba(30,100,15,0.2)';
              ctx.beginPath();
              ctx.ellipse(cx + (seed % 3 - 1) * p * 3, cy + (seed % 2 - 1) * p * 2, p * 1.8, p * 0.8, (seed % 4) * 0.8, 0, Math.PI * 2);
              ctx.fill();
            }
            // Small dark patches
            if (seed % 7 === 0) {
              ctx.fillStyle = 'rgba(20,60,10,0.12)';
              ctx.beginPath();
              ctx.arc(cx, cy, p * 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          }
          case 'fire': {
            // Ember dots
            if (seed % 3 === 0) {
              this.circ(ctx, cx + (seed % 5 - 2) * p * 1.5, cy + (seed % 3 - 1) * p, p * 0.5, `rgba(255,80,0,0.12)`);
            }
            // Crack lines
            if (seed % 5 === 0) {
              ctx.strokeStyle = 'rgba(200,60,0,0.15)';
              ctx.lineWidth = p * 0.4;
              ctx.beginPath();
              ctx.moveTo(cx - p * 2, cy - p);
              ctx.lineTo(cx, cy + p * 0.5);
              ctx.lineTo(cx + p * 2.5, cy - p * 0.5);
              ctx.stroke();
            }
            // Ash spots
            if (seed % 6 === 0) {
              ctx.fillStyle = 'rgba(80,30,0,0.1)';
              ctx.beginPath();
              ctx.arc(cx, cy + p * 2, p * 2, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          }
          case 'water': {
            // Wave lines
            ctx.strokeStyle = `rgba(150,220,255,${0.08 + (seed % 5) * 0.02})`;
            ctx.lineWidth = p * 0.5;
            ctx.beginPath();
            ctx.moveTo(px + ts * 0.15, cy + (seed % 3 - 1) * p);
            ctx.quadraticCurveTo(cx, cy - p * 2.5 + (seed % 3) * p, px + ts * 0.85, cy + (seed % 3 - 1) * p);
            ctx.stroke();
            // Bubbles
            if (seed % 4 === 0) {
              this.circ(ctx, cx + (seed % 3 - 1) * p * 2.5, cy + (seed % 2 - 1) * p * 2, p * 0.6, 'rgba(180,230,255,0.12)');
            }
            // Sparkle
            if (seed % 7 === 0) {
              this.circ(ctx, cx - p * 2, cy - p * 2, p * 0.3, 'rgba(220,240,255,0.15)');
            }
            break;
          }
          case 'wind': {
            // Swirl lines
            ctx.strokeStyle = `rgba(200,230,255,${0.06 + seed % 4 * 0.02})`;
            ctx.lineWidth = p * 0.4;
            ctx.beginPath();
            ctx.arc(cx, cy, p * 2 + seed % 3 * p, 0, Math.PI * 1.2);
            ctx.stroke();
            // Wind streaks
            if (seed % 3 === 0) {
              ctx.strokeStyle = 'rgba(180,215,240,0.1)';
              ctx.lineWidth = p * 0.3;
              ctx.beginPath();
              ctx.moveTo(px + ts * 0.1, cy);
              ctx.quadraticCurveTo(cx, cy - p * 3, px + ts * 0.9, cy + p);
              ctx.stroke();
            }
            break;
          }
          case 'swamp': {
            // Dark puddles
            if (seed % 3 === 0) {
              ctx.fillStyle = 'rgba(30,50,10,0.15)';
              ctx.beginPath();
              ctx.ellipse(cx + (seed % 3 - 1) * p, cy, p * 2.5, p * 1.5, seed * 0.3, 0, Math.PI * 2);
              ctx.fill();
            }
            // Vine tendrils
            if (seed % 5 === 0) {
              ctx.strokeStyle = 'rgba(50,80,20,0.15)';
              ctx.lineWidth = p * 0.4;
              ctx.beginPath();
              ctx.moveTo(cx - p * 3, cy + p * 2);
              ctx.quadraticCurveTo(cx, cy - p * 2, cx + p * 3, cy + p);
              ctx.stroke();
            }
            // Small bubbles
            if (seed % 7 === 0) {
              this.circ(ctx, cx + p, cy + p * 2, p * 0.4, 'rgba(80,110,40,0.15)');
            }
            break;
          }
          case 'cloud': {
            // Fluffy puffs
            if (seed % 2 === 0) {
              ctx.fillStyle = 'rgba(255,255,255,0.08)';
              ctx.beginPath();
              ctx.arc(cx - p, cy, p * 2, 0, Math.PI * 2);
              ctx.arc(cx + p * 1.5, cy - p, p * 1.5, 0, Math.PI * 2);
              ctx.arc(cx + p * 0.5, cy + p, p * 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
            // Soft highlights
            if (seed % 4 === 0) {
              this.circ(ctx, cx, cy, p * 1.5, 'rgba(240,245,255,0.06)');
            }
            break;
          }
          case 'ice': {
            // Crystal patterns
            if (seed % 3 === 0) {
              ctx.strokeStyle = 'rgba(200,240,255,0.12)';
              ctx.lineWidth = p * 0.3;
              const angles = [0, Math.PI / 3, Math.PI * 2 / 3];
              for (const a of angles) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(a) * p * 3, cy + Math.sin(a) * p * 3);
                ctx.stroke();
              }
            }
            // Frost sparkles
            if (seed % 4 === 0) {
              this.circ(ctx, cx + (seed % 3 - 1) * p * 2, cy + (seed % 2 - 1) * p * 2, p * 0.5, 'rgba(200,240,255,0.2)');
            }
            // Ice cracks
            if (seed % 6 === 0) {
              ctx.strokeStyle = 'rgba(160,210,240,0.1)';
              ctx.lineWidth = p * 0.3;
              ctx.beginPath();
              ctx.moveTo(cx - p * 3, cy);
              ctx.lineTo(cx + p * 2, cy + p * 2);
              ctx.stroke();
            }
            break;
          }
        }
      }
    }
  }

  // ─── MAP (WALLS, BLOCKS, CHESTS) ───
  private drawMap(ctx: CanvasRenderingContext2D, state: GameState) {
    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) {
        const cell = state.map[y][x];
        const px = x * this.ts, py = y * this.ts;
        if (cell.type === 'wall') this.drawWall(ctx, px, py, x, y, state.theme);
        else if (cell.type === 'block') this.drawBlock(ctx, px, py, cell, state.theme);
        else if (cell.type === 'chest') this.drawChest(ctx, px, py, cell, state.theme);
      }
    }
  }

  private drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, mx: number, my: number, theme: MapTheme) {
    const { ts, p } = this;
    const t = MAP_THEMES[theme];
    const seed = (mx * 7 + my * 13) % 17;
    ctx.fillStyle = t.wall;
    ctx.fillRect(x, y, ts, ts);
    // Highlight top-left
    ctx.fillStyle = t.wallLight;
    ctx.fillRect(x, y, ts, p);
    ctx.fillRect(x, y, p, ts);
    // Shadow bottom-right
    ctx.fillStyle = t.wallDark;
    ctx.fillRect(x, y + ts - p, ts, p);
    ctx.fillRect(x + ts - p, y, p, ts);
    // Mortar line
    ctx.fillStyle = t.wallMortar;
    ctx.fillRect(x + ts * 0.5 - p * 0.25, y, p * 0.5, ts);
    ctx.fillRect(x, y + ts * 0.5 - p * 0.25, ts, p * 0.5);
    // Stone texture
    if (seed % 3 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(x + p * 2, y + p * 2, ts * 0.3, ts * 0.3);
    }
    if (seed % 5 === 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(x + ts * 0.4, y + ts * 0.4, ts * 0.4, ts * 0.3);
    }
  }

  private drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, cell: Cell, theme: MapTheme) {
    const { ts, p } = this;
    const t = MAP_THEMES[theme];
    const dmg = 1 - cell.hp / cell.maxHp;
    const m = p * 1.5;
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
    ctx.fillStyle = 'rgba(255,215,0,0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy, ts * 0.65, 0, Math.PI * 2);
    ctx.fill();
    const bodyY = y + ts * 0.38, bodyH = ts * 0.48;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, y + ts * 0.92, ts * 0.4, ts * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    const bodyColor = dmg > 0.6 ? '#5a3510' : dmg > 0.3 ? '#6B4226' : '#7B4B2A';
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(x + m, bodyY, ts - m * 2, bodyH, p);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = p * 0.5;
    ctx.beginPath();
    ctx.moveTo(x + m + p, bodyY + bodyH * 0.3);
    ctx.lineTo(x + ts - m - p, bodyY + bodyH * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + m + p, bodyY + bodyH * 0.65);
    ctx.lineTo(x + ts - m - p, bodyY + bodyH * 0.65);
    ctx.stroke();
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(x + m, bodyY, ts - m * 2, p * 1.5);
    ctx.fillRect(x + m, bodyY + bodyH - p * 1.5, ts - m * 2, p * 1.5);
    ctx.fillRect(cx - p * 0.75, bodyY, p * 1.5, bodyH);
    const lidColor = dmg > 0.6 ? '#7a4a20' : dmg > 0.3 ? '#9B6B3F' : '#A8784A';
    ctx.fillStyle = lidColor;
    ctx.beginPath();
    ctx.roundRect(x + m, y + ts * 0.18, ts - m * 2, ts * 0.22, [p, p, 0, 0]);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x + m + p, y + ts * 0.19, ts - m * 2 - p * 2, p * 1.5);
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(x + m, y + ts * 0.38, ts - m * 2, p * 1.2);
    const lockW = ts * 0.16, lockH = ts * 0.14;
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.roundRect(cx - lockW / 2, bodyY + bodyH * 0.2, lockW, lockH, p * 0.5);
    ctx.fill();
    ctx.fillStyle = '#333';
    this.circ(ctx, cx, bodyY + bodyH * 0.2 + lockH * 0.35, p * 0.7, '#333');
    ctx.fillRect(cx - p * 0.3, bodyY + bodyH * 0.2 + lockH * 0.5, p * 0.6, p);
    ctx.fillStyle = '#AA8855';
    this.circ(ctx, x + m + p * 1.5, bodyY + p * 1.5, p, '#AA8855');
    this.circ(ctx, x + ts - m - p * 1.5, bodyY + p * 1.5, p, '#AA8855');
    this.circ(ctx, x + m + p * 1.5, bodyY + bodyH - p * 1.5, p, '#AA8855');
    this.circ(ctx, x + ts - m - p * 1.5, bodyY + bodyH - p * 1.5, p, '#AA8855');
    const st = Date.now() * 0.004;
    const sa = 0.6 + Math.sin(st * 2.5) * 0.3;
    this.circ(ctx, x + ts * 0.2 + Math.sin(st) * ts * 0.1, y + ts * 0.1, p * 1.5, `rgba(255,255,200,${sa})`);
    this.circ(ctx, x + ts * 0.8 + Math.cos(st * 1.3) * ts * 0.08, y + ts * 0.08, p, `rgba(255,255,200,${sa * 0.7})`);
    if (dmg < 0.5) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(cx + p * 2, y + ts * 0.15, p * 1.5, p * 0.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Chest HP bar
    const hpRatio = cell.hp / cell.maxHp;
    if (hpRatio < 1) {
      const hbw = ts * 0.7, hbh = p * 2.5;
      const hbx = cx - hbw / 2, hby = y - p * 1.5;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(hbx, hby, hbw, hbh, p * 0.5);
      ctx.fill();
      ctx.fillStyle = hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FF9800' : '#F44336';
      ctx.beginPath();
      ctx.roundRect(hbx + 1, hby + 1, (hbw - 2) * hpRatio, hbh - 2, p * 0.5);
      ctx.fill();
      // HP text
      ctx.font = `bold ${hbh}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFF';
      ctx.fillText(`${cell.hp}`, cx, hby + hbh / 2);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
  }

  // ─── HEROES ───
  private drawHeroes(ctx: CanvasRenderingContext2D, state: GameState) {
    const sorted = [...state.heroes].sort((a, b) => a.y - b.y);
    for (const hero of sorted) this.drawHero(ctx, hero);
    for (const drop of state.heroDrops) {
      if (!drop.collected) this.drawCage(ctx, drop);
    }
  }

  private drawCage(ctx: CanvasRenderingContext2D, drop: { x: number; y: number; timer: number; maxTimer: number; hero: { headType: HeadType; rarity: Rarity }; hp: number; maxHp: number }) {
    const { ts, p } = this;
    const cx = drop.x * ts + ts / 2;
    const cy = drop.y * ts + ts / 2;
    const r = ts * 0.48;
    const t = Date.now() * 0.003;

    // Large mystery glow (pulsing purple/white)
    const glowAlpha = 0.12 + Math.sin(t) * 0.06;
    const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 2.5);
    glowGrad.addColorStop(0, `rgba(180,150,255,${glowAlpha})`);
    glowGrad.addColorStop(0.5, `rgba(150,120,220,${glowAlpha * 0.5})`);
    glowGrad.addColorStop(1, 'rgba(100,80,180,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Cage background (dark interior)
    ctx.fillStyle = 'rgba(15,10,25,0.7)';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Outer thick metal ring
    ctx.strokeStyle = '#6a6a7a';
    ctx.lineWidth = p * 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.stroke();
    // Inner ring highlight
    ctx.strokeStyle = '#8a8a9a';
    ctx.lineWidth = p * 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
    ctx.stroke();

    // Many vertical bars
    ctx.strokeStyle = 'rgba(160,160,180,0.6)';
    ctx.lineWidth = p * 0.7;
    const barCount = 9;
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const bx = cx + Math.cos(angle) * r * 0.15;
      const topY = cy - r * 0.9;
      const botY = cy + r * 0.9;
      ctx.beginPath();
      ctx.moveTo(bx, topY);
      ctx.lineTo(bx, botY);
      ctx.stroke();
    }

    // Many horizontal bars
    ctx.strokeStyle = 'rgba(150,150,170,0.5)';
    ctx.lineWidth = p * 0.6;
    const hBarCount = 5;
    for (let i = 0; i < hBarCount; i++) {
      const barY = cy - r * 0.8 + (r * 1.6 / (hBarCount - 1)) * i;
      // Calculate width at this y position inside circle
      const dy = barY - cy;
      const halfW = Math.sqrt(Math.max(0, r * r * 0.85 - dy * dy));
      ctx.beginPath();
      ctx.moveTo(cx - halfW, barY);
      ctx.lineTo(cx + halfW, barY);
      ctx.stroke();
    }

    // Cross bars (diagonal)
    ctx.strokeStyle = 'rgba(140,140,160,0.3)';
    ctx.lineWidth = p * 0.4;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.8, cy - r * 0.8);
    ctx.lineTo(cx + r * 0.8, cy + r * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.8, cy - r * 0.8);
    ctx.lineTo(cx - r * 0.8, cy + r * 0.8);
    ctx.stroke();

    // Multiple ??? text scattered
    const qAlpha = 0.4 + Math.sin(t * 2.5) * 0.2;
    const qAlpha2 = 0.3 + Math.sin(t * 3 + 1) * 0.15;
    const qAlpha3 = 0.25 + Math.sin(t * 1.8 + 2) * 0.15;
    ctx.font = `bold ${ts * 0.32}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255,255,255,${qAlpha})`;
    ctx.fillText('???', cx, cy - r * 0.2);
    ctx.font = `bold ${ts * 0.22}px sans-serif`;
    ctx.fillStyle = `rgba(200,180,255,${qAlpha2})`;
    ctx.fillText('???', cx - r * 0.35, cy + r * 0.45);
    ctx.fillStyle = `rgba(220,200,255,${qAlpha3})`;
    ctx.fillText('???', cx + r * 0.35, cy + r * 0.45);
    ctx.font = `bold ${ts * 0.18}px sans-serif`;
    ctx.fillStyle = `rgba(180,160,255,${qAlpha2 * 0.7})`;
    ctx.fillText('?', cx - r * 0.5, cy - r * 0.5);
    ctx.fillText('?', cx + r * 0.5, cy - r * 0.55);
    ctx.fillText('?', cx, cy + r * 0.7);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';

    // Lock icon at bottom
    ctx.fillStyle = '#DAA520';
    const lockSize = p * 2;
    ctx.beginPath();
    ctx.roundRect(cx - lockSize, cy + r * 0.6, lockSize * 2, lockSize * 1.5, p * 0.5);
    ctx.fill();
    ctx.fillStyle = '#333';
    this.circ(ctx, cx, cy + r * 0.6 + lockSize * 0.6, p * 0.6, '#333');
    // Lock shackle
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = p;
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.5, lockSize * 0.7, Math.PI, 0);
    ctx.stroke();

    // Sparkle particles around cage
    for (let i = 0; i < 4; i++) {
      const angle = t * 1.5 + i * Math.PI / 2;
      const dist = r * 1.3 + Math.sin(t * 3 + i) * p * 2;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist * 0.7;
      const spAlpha = 0.3 + Math.sin(t * 4 + i * 1.5) * 0.2;
      this.circ(ctx, sx, sy, p * 0.8, `rgba(200,180,255,${spAlpha})`);
    }

    // HP bar (larger since cage has more HP)
    const hpRatio = drop.hp / drop.maxHp;
    const barW = ts * 0.85;
    const barH = p * 3;
    const barX = cx - barW / 2;
    const barY = cy + r + p * 3;
    // Bar background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, p * 0.5);
    ctx.fill();
    // Bar fill
    const barColor = hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FF9800' : '#F44336';
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(barX + 1, barY + 1, Math.max(0, (barW - 2) * hpRatio), barH - 2, p * 0.5);
    ctx.fill();
    // HP text
    ctx.font = `bold ${barH}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF';
    ctx.fillText(`${drop.hp}/${drop.maxHp}`, cx, barY + barH / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  private drawHero(ctx: CanvasRenderingContext2D, hero: RuntimeHero) {
    const { ts, p } = this;
    const cx = hero.x * ts + ts / 2;
    const cy = hero.y * ts + ts / 2;
    const pal = PALETTES[hero.rarity];
    const bobY = Math.sin(hero.animTimer * 3) * p * 0.5;
    const oy = cy + bobY;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + ts * 0.35, ts * 0.25, ts * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.roundRect(cx - ts * 0.2, oy + ts * 0.02, ts * 0.4, ts * 0.3, p * 2);
    ctx.fill();
    // Body highlight
    ctx.fillStyle = pal.bodyLight;
    ctx.fillRect(cx - ts * 0.15, oy + ts * 0.04, ts * 0.1, ts * 0.12);
    // Feet
    const walking = hero.state === 'moving' || hero.state === 'fleeing';
    const legAnim = walking ? Math.sin(hero.animTimer * 12) * p * 1.5 : 0;
    ctx.fillStyle = pal.bodyDark;
    ctx.fillRect(cx - ts * 0.13, oy + ts * 0.3, ts * 0.1, ts * 0.1 + legAnim);
    ctx.fillRect(cx + ts * 0.03, oy + ts * 0.3, ts * 0.1, ts * 0.1 - legAnim);
    // Head
    const bombing = hero.state === 'bombing';
    const resting = hero.state === 'resting';
    this.drawHead(ctx, cx, oy, p, hero.headType, hero.animTimer, walking, bombing, resting, hero.direction, hero.rarity);
    // Stamina bar
    const sr = hero.stamina / hero.maxStamina;
    const bw = ts * 0.6, bh = p * 2;
    const bx = cx - bw / 2, by = oy - p * 8;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, p * 0.5);
    ctx.fill();
    const goodColor = '#4CAF50', badColor = '#F44336';
    ctx.fillStyle = sr > 0.5 ? goodColor : sr > 0.25 ? '#FF9800' : badColor;
    if (sr > 0) {
      ctx.beginPath();
      ctx.roundRect(bx + 1, by + 1, (bw - 2) * sr, bh - 2, (bh - 2) / 2);
      ctx.fill();
    }
  }

  // ─── HEAD DRAWING ───
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
        this.circ(ctx, cx, headCy, headR * 1.15, '#4a9a2a');
        this.circ(ctx, cx, headCy - p, headR * 1.1, '#5aaa3a');
        this.circ(ctx, cx - p * 3.5, headCy - p * 4, p * 2.8, '#5aaa3a');
        this.circ(ctx, cx + p * 3.5, headCy - p * 4, p * 2.8, '#5aaa3a');
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
        ctx.strokeStyle = '#2a7a0a'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 1.5, p * 4, 0.1, Math.PI - 0.1); ctx.stroke();
        this.circ(ctx, cx - p * 1.5, headCy - p * 0.5, p * 0.6, '#2a7a0a');
        this.circ(ctx, cx + p * 1.5, headCy - p * 0.5, p * 0.6, '#2a7a0a');
        break;
      }
      case 'ninja': {
        this.circ(ctx, cx, headCy, headR, '#1a1a2a');
        ctx.fillStyle = '#cc2222';
        ctx.beginPath(); ctx.ellipse(cx, headCy - p * 1.5, p * 6.5, p * 1.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#cc2222'; ctx.lineWidth = p * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - p * 6, headCy - p * 1.5);
        ctx.quadraticCurveTo(cx - p * 8, headCy - p * 0.5 + Math.sin(anim * 4) * p, cx - p * 9, headCy - p * 2 + Math.sin(anim * 3) * p * 1.5);
        ctx.stroke();
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy + p, p * 1.2, bombing ? '#c00' : '#222');
        break;
      }
      case 'cowboy': {
        this.circ(ctx, cx, headCy, headR * 0.9, '#FFDAB9');
        this.circ(ctx, cx, headCy - p, headR * 0.85, '#FFE8CC');
        ctx.fillStyle = '#8B5A2B';
        ctx.beginPath(); ctx.ellipse(cx, headCy - p * 4, p * 8, p * 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#A0722B';
        ctx.beginPath(); ctx.roundRect(cx - p * 4, headCy - p * 9, p * 8, p * 5, p * 2); ctx.fill();
        ctx.fillStyle = '#8B5A2B'; ctx.fillRect(cx - p * 4.5, headCy - p * 5, p * 9, p);
        ctx.fillStyle = '#6a4020'; ctx.fillRect(cx - p * 4, headCy - p * 5, p * 8, p);
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy, p * 1.2, '#333');
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 2.5, p * 3.5, p, 0, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'vampire': {
        this.circ(ctx, cx, headCy, headR, '#E8D8D8');
        this.circ(ctx, cx, headCy - p, headR * 0.95, '#F0E8E8');
        ctx.fillStyle = '#1a1020';
        ctx.beginPath(); ctx.arc(cx, headCy - p * 2, p * 6, Math.PI + 0.3, -0.3);
        ctx.quadraticCurveTo(cx, headCy - p * 5, cx, headCy + p * 2);
        ctx.lineTo(cx - p * 5, headCy - p * 1); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#1a1020';
        ctx.beginPath(); ctx.arc(cx, headCy - p * 2, p * 6, Math.PI + 0.3, -0.3, true);
        ctx.quadraticCurveTo(cx, headCy - p * 5, cx, headCy + p * 2);
        ctx.lineTo(cx + p * 5, headCy - p * 1); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#E8D8D8';
        ctx.beginPath(); ctx.moveTo(cx - p * 5, headCy - p * 2); ctx.lineTo(cx - p * 7, headCy - p * 5); ctx.lineTo(cx - p * 4, headCy - p * 0.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 5, headCy - p * 2); ctx.lineTo(cx + p * 7, headCy - p * 5); ctx.lineTo(cx + p * 4, headCy - p * 0.5); ctx.closePath(); ctx.fill();
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 0.5, p * 1.3, '#cc0000');
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 2); ctx.lineTo(cx - p, headCy + p * 4); ctx.lineTo(cx - p * 0.5, headCy + p * 2); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 0.5, headCy + p * 2); ctx.lineTo(cx + p, headCy + p * 4); ctx.lineTo(cx + p * 1.5, headCy + p * 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#8a4040'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.moveTo(cx - p * 2, headCy + p * 2); ctx.lineTo(cx + p * 2, headCy + p * 2); ctx.stroke();
        break;
      }
      case 'werewolf': {
        ctx.fillStyle = '#7a6a50';
        ctx.beginPath(); ctx.ellipse(cx, headCy, p * 5.5, p * 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5a4a30';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 2, p * 5, p * 4, 0, 0, Math.PI); ctx.fill();
        ctx.fillStyle = '#7a6a50';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 3.5, headCy - p * 7); ctx.lineTo(cx - p * 2, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 3.5, headCy - p * 7); ctx.lineTo(cx + p * 2, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#9a8a70';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 2.5); ctx.lineTo(cx - p * 3.2, headCy - p * 5.5); ctx.lineTo(cx - p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 2.5); ctx.lineTo(cx + p * 3.2, headCy - p * 5.5); ctx.lineTo(cx + p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#9a8a70';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 1.5, p * 3, p * 2.5, 0, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx, headCy + p * 0.5, p * 1.2, '#333');
        this.circ(ctx, cx - p * 0.5, headCy + p * 0.3, p * 0.4, 'rgba(255,255,255,0.2)');
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 1, p * 1.2, bombing ? '#cc0' : '#442200');
        ctx.strokeStyle = '#4a3a1a'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2.5, p * 2, 0.2, Math.PI - 0.2); ctx.stroke();
        break;
      }
      case 'wizard': {
        this.circ(ctx, cx, headCy + p, headR * 0.75, '#FFDAB9');
        ctx.fillStyle = '#4a2a8a';
        ctx.beginPath(); ctx.moveTo(cx - p * 5.5, headCy - p * 3); ctx.lineTo(cx, headCy - p * 11); ctx.lineTo(cx + p * 5.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3a1a7a';
        ctx.beginPath(); ctx.ellipse(cx, headCy - p * 3, p * 7, p * 1.5, 0, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx + p * 0.5, headCy - p * 7, p, '#FFD700');
        ctx.fillStyle = '#DDD';
        ctx.beginPath(); ctx.moveTo(cx - p * 3, headCy + p * 3);
        ctx.quadraticCurveTo(cx - p * 3.5, headCy + p * 7, cx, headCy + p * 9);
        ctx.quadraticCurveTo(cx + p * 3.5, headCy + p * 7, cx + p * 3, headCy + p * 3);
        ctx.closePath(); ctx.fill();
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy, p * 1, '#339');
        ctx.fillStyle = '#888';
        ctx.beginPath(); ctx.ellipse(cx - p * 2.5, headCy - p * 1.5, p * 2, p * 0.6, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + p * 2.5, headCy - p * 1.5, p * 2, p * 0.6, 0.2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'dragon': {
        ctx.fillStyle = '#2a8a3a';
        ctx.beginPath(); ctx.ellipse(cx, headCy, p * 6, p * 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5aaa5a';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p, p * 3.5, p * 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8a7a40';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 5, headCy - p * 6); ctx.lineTo(cx - p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 5, headCy - p * 6); ctx.lineTo(cx + p * 2.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3a9a4a';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 2, p * 3, p * 2, 0, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx - p * 1, headCy + p * 1.5, p * 0.7, '#1a5a2a');
        this.circ(ctx, cx + p * 1, headCy + p * 1.5, p * 0.7, '#1a5a2a');
        if (bombing) {
          this.circ(ctx, cx - p * 1.5, headCy + p * 0.5 + Math.sin(anim * 6) * p, p * 0.5, 'rgba(200,200,200,0.4)');
          this.circ(ctx, cx + p * 1.5, headCy + p * 0.5 + Math.cos(anim * 6) * p, p * 0.5, 'rgba(200,200,200,0.4)');
        }
        if (!blink) {
          this.circ(ctx, cx - p * 2.5, headCy - p * 1, p * 1.5, '#FF0');
          this.circ(ctx, cx - p * 2.5 + pdx, headCy - p * 1 + pdy, p * 0.4, '#111');
          this.circ(ctx, cx + p * 2.5, headCy - p * 1, p * 1.5, '#FF0');
          this.circ(ctx, cx + p * 2.5 + pdx, headCy - p * 1 + pdy, p * 0.4, '#111');
        }
        ctx.strokeStyle = '#c44'; ctx.lineWidth = p;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 3, p * 2, 0.2, Math.PI - 0.2); ctx.stroke();
        break;
      }
      case 'fox': {
        ctx.fillStyle = '#E87830';
        ctx.beginPath(); ctx.ellipse(cx, headCy, p * 5, p * 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#E87830';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 2); ctx.lineTo(cx - p * 3, headCy - p * 8); ctx.lineTo(cx - p * 1, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 2); ctx.lineTo(cx + p * 3, headCy - p * 8); ctx.lineTo(cx + p * 1, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.moveTo(cx - p * 3, headCy - p * 2.5); ctx.lineTo(cx - p * 2.8, headCy - p * 6.5); ctx.lineTo(cx - p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3, headCy - p * 2.5); ctx.lineTo(cx + p * 2.8, headCy - p * 6.5); ctx.lineTo(cx + p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 1, p * 3.5, p * 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 2, p * 1.5, p * 1.2, 0, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx, headCy + p * 1.5, p * 0.8, '#222');
        drawEyes(cx - p * 2, cx + p * 2, headCy - p * 1, p * 1, '#222');
        break;
      }
      case 'bear': {
        this.circ(ctx, cx, headCy, headR * 1.1, '#8a6a40');
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 2.5, '#8a6a40');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 2.5, '#8a6a40');
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 1.5, '#6a4a20');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 1.5, '#6a4a20');
        ctx.fillStyle = '#C8A878';
        ctx.beginPath(); ctx.ellipse(cx, headCy + p * 1.5, p * 3.5, p * 2.5, 0, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx, headCy + p * 0.5, p * 1.3, '#333');
        this.circ(ctx, cx - p * 0.4, headCy + p * 0.2, p * 0.4, 'rgba(255,255,255,0.15)');
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 1, p * 1, '#222');
        ctx.strokeStyle = '#6a4030'; ctx.lineWidth = p * 0.8;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2.5, p * 1.5, 0.3, Math.PI - 0.3); ctx.stroke();
        break;
      }
      case 'cat': {
        this.circ(ctx, cx, headCy, headR, '#F4A460');
        this.circ(ctx, cx, headCy - p, headR * 0.95, '#F5B870');
        ctx.fillStyle = '#F4A460';
        ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 3); ctx.lineTo(cx - p * 3, headCy - p * 7); ctx.lineTo(cx - p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 3); ctx.lineTo(cx + p * 3, headCy - p * 7); ctx.lineTo(cx + p * 1.5, headCy - p * 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath(); ctx.moveTo(cx - p * 3.5, headCy - p * 3.5); ctx.lineTo(cx - p * 3, headCy - p * 6); ctx.lineTo(cx - p * 2, headCy - p * 3.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + p * 3.5, headCy - p * 3.5); ctx.lineTo(cx + p * 3, headCy - p * 6); ctx.lineTo(cx + p * 2, headCy - p * 3.5); ctx.closePath(); ctx.fill();
        drawEyes(cx - p * 2.5, cx + p * 2.5, headCy - p * 0.5, p * 1.2, '#222');
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath(); ctx.moveTo(cx, headCy + p * 0.5); ctx.lineTo(cx - p * 0.8, headCy + p * 1.2); ctx.lineTo(cx + p * 0.8, headCy + p * 1.2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#777'; ctx.lineWidth = p * 0.4;
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 1); ctx.lineTo(cx - p * 5, headCy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + p * 1.5, headCy + p * 1); ctx.lineTo(cx + p * 5, headCy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - p * 1.5, headCy + p * 1.5); ctx.lineTo(cx - p * 5, headCy + p * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + p * 1.5, headCy + p * 1.5); ctx.lineTo(cx + p * 5, headCy + p * 2); ctx.stroke();
        break;
      }
      case 'panda': {
        this.circ(ctx, cx, headCy, headR * 1.15, '#F5F5F5');
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.ellipse(cx - p * 2.5, headCy - p * 0.5, p * 2.2, p * 1.8, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + p * 2.5, headCy - p * 0.5, p * 2.2, p * 1.8, 0.2, 0, Math.PI * 2); ctx.fill();
        this.circ(ctx, cx - p * 2.5, headCy - p * 0.5, p * 0.8, '#FFF');
        this.circ(ctx, cx + p * 2.5, headCy - p * 0.5, p * 0.8, '#FFF');
        if (!blink) {
          this.circ(ctx, cx - p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.35, '#111');
          this.circ(ctx, cx + p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.35, '#111');
        }
        this.circ(ctx, cx - p * 4.5, headCy - p * 4, p * 2, '#222');
        this.circ(ctx, cx + p * 4.5, headCy - p * 4, p * 2, '#222');
        this.circ(ctx, cx, headCy + p * 1, p * 1, '#333');
        ctx.strokeStyle = '#555'; ctx.lineWidth = p * 0.5;
        ctx.beginPath(); ctx.arc(cx, headCy + p * 2, p * 1, 0.3, Math.PI - 0.3); ctx.stroke();
        break;
      }
      case 'skeleton': {
        this.circ(ctx, cx, headCy, headR * 1.05, '#E8E8E8');
        this.circ(ctx, cx, headCy - p, headR, '#F4F4F4');
        ctx.fillStyle = '#DDD';
        ctx.beginPath();
        ctx.moveTo(cx - p * 3.5, headCy + p * 2);
        ctx.lineTo(cx - p * 2.5, headCy + p * 5);
        ctx.lineTo(cx + p * 2.5, headCy + p * 5);
        ctx.lineTo(cx + p * 3.5, headCy + p * 2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFF';
        for (let i = -2; i <= 2; i++) ctx.fillRect(cx + i * p * 1.2 - p * 0.4, headCy + p * 2.5, p * 0.8, p);
        this.circ(ctx, cx - p * 2.5, headCy - p * 0.5, p * 1.8, '#111');
        this.circ(ctx, cx + p * 2.5, headCy - p * 0.5, p * 1.8, '#111');
        if (!blink) {
          this.circ(ctx, cx - p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.6, '#4F4');
          this.circ(ctx, cx + p * 2.5 + pdx * 0.3, headCy - p * 0.5 + pdy * 0.2, p * 0.6, '#4F4');
        }
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.moveTo(cx, headCy + p * 1.5); ctx.lineTo(cx - p * 0.8, headCy + p * 0.5); ctx.lineTo(cx + p * 0.8, headCy + p * 0.5); ctx.closePath(); ctx.fill();
        break;
      }
    }

    // Rarity overlays
    if (rarity === 'legendary') {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.ellipse(cx, headCy - p * 5, p * 5, p * 1, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = -2; i <= 2; i++) {
        const px2 = cx + i * p * 2;
        ctx.beginPath(); ctx.moveTo(px2 - p, headCy - p * 5); ctx.lineTo(px2, headCy - p * 7 - Math.abs(i) * p * 0.3); ctx.lineTo(px2 + p, headCy - p * 5); ctx.closePath(); ctx.fill();
      }
      this.circ(ctx, cx, headCy - p * 5.5, p * 0.6, '#F44');
    }
    if (rarity === 'super_epic') {
      const flicker = Math.sin(anim * 8) * p;
      ctx.fillStyle = `rgba(255,30,30,${0.2 + Math.sin(anim * 4) * 0.08})`;
      ctx.beginPath(); ctx.arc(cx, headCy, headR * 1.4 + flicker, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#CC0000';
      ctx.beginPath(); ctx.moveTo(cx - p * 4, headCy - p * 2); ctx.lineTo(cx - p * 3, headCy - p * 6); ctx.lineTo(cx - p * 2, headCy - p * 2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx + p * 4, headCy - p * 2); ctx.lineTo(cx + p * 3, headCy - p * 6); ctx.lineTo(cx + p * 2, headCy - p * 2); ctx.closePath(); ctx.fill();
    }
    if (rarity === 'super_legendary') {
      const glowT = Math.sin(anim * 3) * 0.1 + 0.25;
      ctx.fillStyle = `rgba(220,200,255,${glowT})`;
      ctx.beginPath(); ctx.arc(cx, headCy, headR * 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#E0E7FF';
      ctx.beginPath(); ctx.ellipse(cx, headCy - p * 5, p * 6, p * 1.2, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = -3; i <= 3; i++) {
        const px2 = cx + i * p * 1.8;
        const h = p * 9 - Math.abs(i) * p * 0.5;
        ctx.beginPath(); ctx.moveTo(px2 - p, headCy - p * 5); ctx.lineTo(px2, headCy - h); ctx.lineTo(px2 + p, headCy - p * 5); ctx.closePath(); ctx.fill();
      }
      this.circ(ctx, cx, headCy - p * 6, p * 0.8, '#FF4444');
      this.circ(ctx, cx - p * 3, headCy - p * 5.5, p * 0.5, '#44FF44');
      this.circ(ctx, cx + p * 3, headCy - p * 5.5, p * 0.5, '#4444FF');
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

    // Aura
  }

  // ─── BOMBS ───
  private drawBombs(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    for (const bomb of state.bombs) {
      const bx = bomb.x * ts + ts / 2, by = bomb.y * ts + ts / 2;
      const pulse = 1 + Math.sin(bomb.animTimer * 10) * 0.06;
      const r = ts * 0.28 * pulse;
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(bx, by + r, r * 0.8, r * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      this.circ(ctx, bx, by, r, '#2a2a2a');
      this.circ(ctx, bx - r * 0.2, by - r * 0.2, r * 0.35, 'rgba(255,255,255,0.1)');
      ctx.strokeStyle = '#8B6914'; ctx.lineWidth = this.p;
      ctx.beginPath(); ctx.moveTo(bx, by - r);
      ctx.quadraticCurveTo(bx + r * 0.4, by - r * 1.5, bx + r * 0.6, by - r * 1.2); ctx.stroke();
      if (Math.sin(bomb.animTimer * 18) > -0.3) {
        this.circ(ctx, bx + r * 0.6, by - r * 1.2, this.p * 2, '#FF8800');
        this.circ(ctx, bx + r * 0.6, by - r * 1.2, this.p, '#FFEE44');
      }
    }
  }

  // ─── EXPLOSIONS ───
  private drawExplosions(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    const prevComp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';
    for (const exp of state.explosions) {
      const a = Math.max(0, exp.timer / exp.maxTimer);
      for (const cell of exp.cells) {
        const cx = cell.x * ts + ts / 2, cy = cell.y * ts + ts / 2;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, ts * 0.8);
        grd.addColorStop(0, `rgba(255,240,200,${a * 0.9})`);
        grd.addColorStop(0.25, `rgba(255,220,100,${a * 0.7})`);
        grd.addColorStop(0.5, `rgba(255,180,50,${a * 0.45})`);
        grd.addColorStop(0.75, `rgba(255,120,20,${a * 0.2})`);
        grd.addColorStop(1, `rgba(255,60,0,0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(cx - ts, cy - ts, ts * 2, ts * 2);
        this.circ(ctx, cx, cy, ts * 0.18, `rgba(255,255,255,${a * 0.95})`);
        this.circ(ctx, cx, cy, ts * 0.1, `rgba(255,255,255,${a})`);
      }
    }
    ctx.globalCompositeOperation = prevComp;
  }

  // ─── PARTICLES ───
  private drawParticles(ctx: CanvasRenderingContext2D, state: GameState) {
    const { ts } = this;
    for (const pt of state.particles) {
      const px = pt.x * ts, py = pt.y * ts;
      const alpha = Math.max(0, pt.life / pt.maxLife);
      ctx.globalAlpha = alpha;
      switch (pt.type) {
        case 'coin': this.circ(ctx, px, py, pt.size, '#FFD700'); this.circ(ctx, px, py, pt.size * 0.5, '#FFED4A'); break;
        case 'spark': ctx.fillStyle = pt.color; ctx.fillRect(px - pt.size / 2, py - pt.size / 2, pt.size, pt.size); break;
        case 'smoke':
          ctx.fillStyle = `rgba(150,150,150,${alpha * 0.35})`;
          ctx.beginPath(); ctx.arc(px, py, pt.size, 0, Math.PI * 2); ctx.fill();
          break;
        case 'text':
          if (pt.text) {
            ctx.font = `bold ${pt.size}px monospace`; ctx.textAlign = 'center';
            ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 3; ctx.strokeText(pt.text, px, py);
            ctx.fillStyle = pt.color; ctx.fillText(pt.text, px, py); ctx.textAlign = 'start';
          }
          break;
      }
      ctx.globalAlpha = 1;
    }
  }
}
