import {
  MAP_COLS, MAP_ROWS, BOMB_TIMER, EXPLOSION_DURATION, STAMINA_DRAIN, STAMINA_RECOVERY,
  type Cell, type RuntimeHero, type HeroData, type Bomb, type GameState, type Point,
  THEME_ORDER, rollBlockHeroDrop,
} from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GameEngine {
  state: GameState;
  onUpdate: (() => void) | null = null;

  constructor(heroes: HeroData[]) {
    this.state = this.initState(heroes);
  }

  private initState(heroes: HeroData[]): GameState {
    const map = this.generateMap();
    const positions = this.getRandomSpawnPositions(map, heroes.length);
    const runtimeHeroes = heroes.map((h, i) => this.createRuntimeHero(h, positions[i] || { x: 1, y: MAP_ROWS - 2 }));

    let totalChests = 0, totalBlocks = 0;
    for (let y = 0; y < MAP_ROWS; y++)
      for (let x = 0; x < MAP_COLS; x++) {
        if (map[y][x].type === 'chest') totalChests++;
        if (map[y][x].type === 'block') totalBlocks++;
      }

    return {
      map, heroes: runtimeHeroes, bombs: [], explosions: [], particles: [], heroDrops: [],
      bcoinCollected: 0, totalChests, chestsOpened: 0, totalBlocks, blocksDestroyed: 0,
      gameTime: 0, running: true, complete: false, mapNumber: 1,
      theme: THEME_ORDER[0],
    };
  }

  private createRuntimeHero(data: HeroData, pos: Point): RuntimeHero {
    return {
      ...data, x: pos.x, y: pos.y, tileX: pos.x, tileY: pos.y,
      direction: 'down', state: 'idle', stamina: data.currentStamina || data.maxStamina,
      activeBombs: 0, path: [], pathIndex: 0, animTimer: Math.random() * 10,
      waitTimer: 0.5, movingToX: pos.x, movingToY: pos.y,
      hasDoubleCoins: data.abilities.includes('Moedas Duplas'),
      staminaRecoveryMult: data.abilities.includes('Recuperação de Stamina') ? 1.5 : 1,
      fleeingFrom: null,
    };
  }

  private generateMap(): Cell[][] {
    const map: Cell[][] = [];
    for (let y = 0; y < MAP_ROWS; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_COLS; x++) {
        if (y === 0 || y === MAP_ROWS - 1 || x === 0 || x === MAP_COLS - 1) {
          map[y][x] = { type: 'wall', hp: 999, maxHp: 999, bcoinValue: 0 };
        } else if (y % 2 === 0 && x % 2 === 0) {
          map[y][x] = { type: 'wall', hp: 999, maxHp: 999, bcoinValue: 0 };
        } else {
          const r = Math.random();
          if (r < 0.55) {
            const isChest = Math.random() < 0.08;
            if (isChest) {
              map[y][x] = { type: 'chest', hp: 5, maxHp: 5, bcoinValue: randomInt(1, 3) };
            } else {
              map[y][x] = { type: 'block', hp: 1 + Math.floor(Math.random() * 2), maxHp: 1 + Math.floor(Math.random() * 2), bcoinValue: randomInt(0, 1) };
            }
          } else {
            map[y][x] = { type: 'empty', hp: 0, maxHp: 0, bcoinValue: 0 };
          }
        }
      }
    }
    // Clear spawn areas
    for (let dy = 0; dy < 3; dy++)
      for (let dx = 0; dx < 3; dx++) {
        const clearCell = (x: number, y: number) => {
          if (x > 0 && x < MAP_COLS - 1 && y > 0 && y < MAP_ROWS - 1)
            map[y][x] = { type: 'empty', hp: 0, maxHp: 0, bcoinValue: 0 };
        };
        clearCell(1 + dx, 1 + dy);
        clearCell(MAP_COLS - 2 - dx, 1 + dy);
        clearCell(1 + dx, MAP_ROWS - 2 - dy);
        clearCell(MAP_COLS - 2 - dx, MAP_ROWS - 2 - dy);
      }
    return map;
  }

  private getRandomSpawnPositions(map: Cell[][], count: number): Point[] {
    const emptyTiles: Point[] = [];
    for (let y = 1; y < MAP_ROWS - 1; y++)
      for (let x = 1; x < MAP_COLS - 1; x++)
        if (map[y][x].type === 'empty') emptyTiles.push({ x, y });
    // Shuffle
    for (let i = emptyTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyTiles[i], emptyTiles[j]] = [emptyTiles[j], emptyTiles[i]];
    }
    const step = Math.max(1, Math.floor(emptyTiles.length / (count + 1)));
    return emptyTiles.filter((_, i) => i % step === 0).slice(0, count);
  }

  generateNewMap() {
    const map = this.generateMap();
    const positions = this.getRandomSpawnPositions(map, this.state.heroes.length);
    let totalChests = 0, totalBlocks = 0;
    for (let y = 0; y < MAP_ROWS; y++)
      for (let x = 0; x < MAP_COLS; x++) {
        if (map[y][x].type === 'chest') totalChests++;
        if (map[y][x].type === 'block') totalBlocks++;
      }
    this.state.map = map;
    this.state.bombs = [];
    this.state.explosions = [];
    this.state.particles = [];
    this.state.totalChests = totalChests;
    this.state.chestsOpened = 0;
    this.state.totalBlocks = totalBlocks;
    this.state.blocksDestroyed = 0;
    this.state.complete = false;
    this.state.gameTime = 0;
    this.state.mapNumber++;
    this.state.theme = THEME_ORDER[(this.state.mapNumber - 1) % THEME_ORDER.length];
    this.state.heroDrops = [];
    for (let i = 0; i < this.state.heroes.length; i++) {
      const pos = positions[i] || { x: 1, y: MAP_ROWS - 2 };
      const h = this.state.heroes[i];
      h.x = pos.x; h.y = pos.y; h.tileX = pos.x; h.tileY = pos.y;
      h.state = 'idle'; h.path = []; h.pathIndex = 0; h.waitTimer = 0.5;
      h.activeBombs = 0; h.fleeingFrom = null;
    }
  }

  update(dt: number) {
    if (!this.state.running || this.state.complete) return;
    this.state.gameTime += dt;
    // Recover stamina for resting heroes
    for (const hero of this.state.heroes) {
      hero.animTimer += dt;
      if (hero.state === 'resting') {
        hero.stamina += STAMINA_RECOVERY * hero.staminaRecoveryMult * dt;
        if (hero.stamina >= hero.maxStamina * 0.5) {
          hero.state = 'idle'; hero.waitTimer = 0.3;
        }
        continue;
      }
      hero.stamina -= STAMINA_DRAIN * dt;
      switch (hero.state) {
        case 'idle': this.handleIdle(hero, dt); break;
        case 'moving': this.handleMoving(hero, dt); break;
        case 'bombing': this.handleBombing(hero, dt); break;
        case 'fleeing': this.handleFleeing(hero, dt); break;
        case 'waiting':
          hero.waitTimer -= dt;
          if (hero.waitTimer <= 0) hero.state = 'idle';
          break;
      }
      if (hero.stamina <= 0) { hero.stamina = 0; hero.state = 'resting'; }
    }
    this.updateBombs(dt);
    this.updateExplosions(dt);
    this.updateParticles(dt);
    this.checkHeroDrops();
    this.checkCompletion();
  }

  private handleIdle(hero: RuntimeHero, dt: number) {
    hero.waitTimer -= dt;
    if (hero.waitTimer > 0) return;
    const target = this.findTarget(hero);
    if (target) {
      hero.path = target.path; hero.pathIndex = 0;
      hero.movingToX = target.standX; hero.movingToY = target.standY;
      hero.state = 'moving';
    } else {
      hero.waitTimer = 0.5;
    }
  }

  private handleMoving(hero: RuntimeHero, dt: number) {
    if (hero.path.length === 0 || hero.pathIndex >= hero.path.length) {
      hero.state = 'idle'; hero.waitTimer = 0.1; return;
    }
    const target = hero.path[hero.pathIndex];
    const dx = target.x - hero.x, dy = target.y - hero.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.05) {
      hero.x = target.x; hero.y = target.y;
      hero.tileX = Math.round(hero.x); hero.tileY = Math.round(hero.y);
      hero.pathIndex++;
      if (hero.pathIndex >= hero.path.length) {
        hero.state = 'bombing'; hero.waitTimer = 0.15;
      }
      return;
    }
    const move = Math.min(hero.speed * dt, dist);
    hero.x += (dx / dist) * move; hero.y += (dy / dist) * move;
    hero.tileX = Math.round(hero.x); hero.tileY = Math.round(hero.y);
    hero.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  private handleBombing(hero: RuntimeHero, dt: number) {
    hero.waitTimer -= dt;
    if (hero.waitTimer > 0) return;
    if (hero.stamina < 5) { hero.state = 'idle'; hero.waitTimer = 0.3; return; }
    const bx = hero.tileX, by = hero.tileY;
    if (this.state.bombs.some(b => b.x === bx && b.y === by)) { hero.state = 'idle'; hero.waitTimer = 0.3; return; }
    if (this.state.heroes.some(h => h.id !== hero.id && h.tileX === bx && h.tileY === by && h.state !== 'resting')) {
      hero.state = 'idle'; hero.waitTimer = 0.4; return;
    }
    if (this.state.bombs.filter(b => b.heroId === hero.id).length >= hero.bombNum) {
      hero.state = 'idle'; hero.waitTimer = 0.5; return;
    }
    this.state.bombs.push({ x: bx, y: by, timer: BOMB_TIMER, range: hero.bombRange, power: hero.power, heroId: hero.id, animTimer: 0 });
    hero.activeBombs++;
    const safe = this.findSafePath(hero, bx, by, hero.bombRange);
    if (safe && safe.length > 0) {
      hero.path = safe; hero.pathIndex = 0; hero.state = 'fleeing'; hero.fleeingFrom = { x: bx, y: by };
    } else {
      hero.state = 'waiting'; hero.waitTimer = BOMB_TIMER + EXPLOSION_DURATION + 0.3;
    }
  }

  private handleFleeing(hero: RuntimeHero, dt: number) {
    if (hero.path.length === 0 || hero.pathIndex >= hero.path.length) {
      hero.state = 'waiting'; hero.waitTimer = BOMB_TIMER + EXPLOSION_DURATION + 0.2; return;
    }
    const target = hero.path[hero.pathIndex];
    const dx = target.x - hero.x, dy = target.y - hero.y, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.05) {
      hero.x = target.x; hero.y = target.y; hero.tileX = Math.round(hero.x); hero.tileY = Math.round(hero.y);
      hero.pathIndex++; return;
    }
    const move = Math.min(hero.speed * 1.2 * dt, dist);
    hero.x += (dx / dist) * move; hero.y += (dy / dist) * move;
    hero.tileX = Math.round(hero.x); hero.tileY = Math.round(hero.y);
    hero.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  private isWalkable(x: number, y: number): boolean {
    if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return false;
    const cell = this.state.map[y][x];
    if (cell.type === 'wall' || cell.type === 'block' || cell.type === 'chest') return false;
    if (this.state.heroDrops.some(d => !d.collected && d.x === x && d.y === y)) return false;
    return true;
  }

  private findTarget(hero: RuntimeHero): { path: Point[]; standX: number; standY: number } | null {
    const sx = Math.round(hero.x), sy = Math.round(hero.y);
    const visited = new Set<string>();
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const queue: { x: number; y: number; path: Point[] }[] = [{ x: sx, y: sy, path: [] }];
    visited.add(`${sx},${sy}`);
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (const [dx, dy] of dirs) {
        const nx = cur.x + dx, ny = cur.y + dy;
        if (nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) continue;
        const cell = this.state.map[ny][nx];
        const isCage = this.state.heroDrops.some(d => !d.collected && d.x === nx && d.y === ny);
        if (cell.type === 'block' || cell.type === 'chest' || isCage) {
          const standOccupied = this.state.heroes.some(h => h.id !== hero.id && h.tileX === cur.x && h.tileY === cur.y && (h.state === 'bombing' || h.state === 'waiting' || h.state === 'fleeing'));
          if (!standOccupied) return { path: [...cur.path, { x: cur.x, y: cur.y }], standX: cur.x, standY: cur.y };
        }
      }
      for (const [dx, dy] of dirs) {
        const nx = cur.x + dx, ny = cur.y + dy;
        const key = `${nx},${ny}`;
        if (visited.has(key)) continue;
        if (!this.isWalkable(nx, ny)) continue;
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...cur.path, { x: nx, y: ny }] });
      }
    }
    return null;
  }

  private findSafePath(hero: RuntimeHero, bombX: number, bombY: number, range: number): Point[] | null {
    const blast = new Set(this.getBlastCells(bombX, bombY, range));
    blast.add(`${bombX},${bombY}`);
    const sx = Math.round(hero.x), sy = Math.round(hero.y);
    const visited = new Set<string>();
    const queue: { x: number; y: number; path: Point[] }[] = [{ x: sx, y: sy, path: [] }];
    visited.add(`${sx},${sy}`);
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (!blast.has(`${cur.x},${cur.y}`)) return cur.path;
      for (const [dx, dy] of dirs) {
        const nx = cur.x + dx, ny = cur.y + dy;
        const key = `${nx},${ny}`;
        if (visited.has(key) || nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) continue;
        if (!this.isWalkable(nx, ny) || this.state.bombs.some(b => b.x === nx && b.y === ny)) continue;
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...cur.path, { x: nx, y: ny }] });
      }
    }
    return null;
  }

  private getBlastCells(x: number, y: number, range: number): Set<string> {
    const cells = new Set<string>();
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (const [dx, dy] of dirs) {
      for (let i = 1; i <= range; i++) {
        const nx = x + dx * i, ny = y + dy * i;
        if (nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) break;
        const cell = this.state.map[ny][nx];
        if (cell.type === 'wall') break;
        const isCage = this.state.heroDrops.some(d => !d.collected && d.x === nx && d.y === ny);
        cells.add(`${nx},${ny}`);
        if (cell.type === 'block' || cell.type === 'chest' || isCage) break;
      }
    }
    return cells;
  }

  private updateBombs(dt: number) {
    const toExplode: Bomb[] = [];
    for (const b of this.state.bombs) {
      b.timer -= dt; b.animTimer += dt;
      if (b.timer <= 0) toExplode.push(b);
    }
    for (const bomb of toExplode) {
      this.explodeBomb(bomb);
      this.state.bombs = this.state.bombs.filter(b => b !== bomb);
      for (const h of this.state.heroes) if (bomb.heroId === h.id) h.activeBombs = Math.max(0, h.activeBombs - 1);
    }
  }

  private explodeBomb(bomb: Bomb) {
    const cellSet = this.getBlastCells(bomb.x, bomb.y, bomb.range);
    cellSet.add(`${bomb.x},${bomb.y}`);
    const cells = [...cellSet].map(k => { const [x, y] = k.split(',').map(Number); return { x, y }; });
    this.state.explosions.push({ cells, timer: EXPLOSION_DURATION, maxTimer: EXPLOSION_DURATION, power: bomb.power, heroId: bomb.heroId });
    for (const cell of cells) {
      for (let i = 0; i < 3; i++) {
        this.state.particles.push({
          x: cell.x + 0.3 + Math.random() * 0.4, y: cell.y + 0.3 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 2,
          life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
          color: Math.random() > 0.5 ? '#FF6600' : '#FFAA00', size: 2 + Math.random() * 2, type: 'spark',
        });
      }
    }
    const hero = this.state.heroes.find(h => h.id === bomb.heroId);
    for (const cell of cells) {
      const mapCell = this.state.map[cell.y]?.[cell.x];
      if (!mapCell) continue;
      if (mapCell.type === 'block' || mapCell.type === 'chest') {
        mapCell.hp -= bomb.power;
        if (mapCell.hp <= 0) {
          const mult = hero?.hasDoubleCoins ? 2 : 1;
          // Random chance to get BCOIN: chest 55%, block 20%
          const dropChance = mapCell.type === 'chest' ? 0.55 : 0.20;
          const amount = Math.random() < dropChance ? mapCell.bcoinValue * mult : 0;
          this.state.bcoinCollected += amount;
          if (mapCell.type === 'chest') this.state.chestsOpened++;
          else this.state.blocksDestroyed++;
          // Coin particles
          if (amount > 0) {
            this.state.particles.push({
              x: cell.x + 0.5, y: cell.y + 0.2, vx: 0, vy: -1.5, life: 1.5, maxLife: 1.5,
              color: '#FFD700', size: 14, type: 'text', text: `+${amount}`,
            });
            for (let i = 0; i < 4; i++) {
              this.state.particles.push({
                x: cell.x + 0.5, y: cell.y + 0.5,
                vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3 - 1,
                life: 0.6 + Math.random() * 0.4, maxLife: 1, color: '#FFD700', size: 3, type: 'coin',
              });
            }
          }
          // Smoke
          for (let i = 0; i < 3; i++) {
            this.state.particles.push({
              x: cell.x + 0.5, y: cell.y + 0.5, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2,
              life: 0.8 + Math.random() * 0.5, maxLife: 1.3, color: '#888', size: 5 + Math.random() * 3, type: 'smoke',
            });
          }
          // Hero drop chance
          const drop = rollBlockHeroDrop();
          if (drop) {
            this.state.heroDrops.push({
              x: cell.x, y: cell.y, hero: drop, timer: 30, maxTimer: 30,
              hp: 15, maxHp: 15, collected: false,
            });
          }
          mapCell.type = 'empty'; mapCell.hp = 0; mapCell.maxHp = 0;
        }
      }
      // Check hero drops (cages)
      for (const drop of this.state.heroDrops) {
        if (!drop.collected && drop.x === cell.x && drop.y === cell.y) {
          drop.hp -= bomb.power;
          if (drop.hp <= 0) {
            drop.collected = true;
            this.state.particles.push({
              x: cell.x + 0.5, y: cell.y + 0.2, vx: 0, vy: -1.5, life: 2, maxLife: 2,
              color: '#FF69B4', size: 16, type: 'text', text: '🎉 Novo Herói!',
            });
          }
        }
      }
      // Damage heroes caught in blast
      for (const h of this.state.heroes) {
        if (h.tileX === cell.x && h.tileY === cell.y) {
          h.stamina -= 15;
          this.state.particles.push({
            x: h.x + 0.5, y: h.y + 0.3, vx: 0, vy: -2, life: 0.5, maxLife: 0.5,
            color: '#FF0000', size: 5, type: 'damage',
          });
        }
      }
    }
  }

  private updateExplosions(dt: number) {
    for (let i = this.state.explosions.length - 1; i >= 0; i--) {
      this.state.explosions[i].timer -= dt;
      if (this.state.explosions[i].timer <= 0) this.state.explosions.splice(i, 1);
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const p = this.state.particles[i];
      if (p.type === 'text') { p.y += p.vy * dt; }
      else { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 4 * dt; }
      p.life -= dt;
      if (p.life <= 0) this.state.particles.splice(i, 1);
    }
  }

  private checkHeroDrops() {
    for (const d of this.state.heroDrops) {
      if (!d.collected) d.timer -= 0.016;
    }
    this.state.heroDrops = this.state.heroDrops.filter(d => d.collected || d.timer > 0);
  }

  private checkCompletion() {
    if (this.state.complete) return;
    // Map is only complete when ALL blocks and chests have been destroyed/opened
    if (this.state.blocksDestroyed < this.state.totalBlocks) return;
    if (this.state.chestsOpened < this.state.totalChests) return;
    // All hero drops (cages) must have been collected
    if (this.state.heroDrops.some(d => !d.collected)) return;
    // No active bombs or explosions
    if (this.state.bombs.length > 0 || this.state.explosions.length > 0) return;
    this.state.complete = true;
  }

  getHeroStaminaMap(): Map<string, number> {
    const m = new Map<string, number>();
    for (const h of this.state.heroes) m.set(h.id, Math.max(0, h.stamina));
    return m;
  }

  collectHeroDrops(): HeroData[] {
    const heroes: HeroData[] = [];
    for (const d of this.state.heroDrops) if (d.collected) heroes.push(d.hero);
    this.state.heroDrops = this.state.heroDrops.filter(d => !d.collected);
    return heroes;
  }

  removeHero(heroId: string): number {
    const idx = this.state.heroes.findIndex(h => h.id === heroId);
    if (idx === -1) return 0;
    const st = this.state.heroes[idx].stamina;
    this.state.heroes.splice(idx, 1);
    return st;
  }

  addHero(heroData: HeroData) {
    const empty: Point[] = [];
    for (let y = 1; y < MAP_ROWS - 1; y++)
      for (let x = 1; x < MAP_COLS - 1; x++)
        if (this.state.map[y][x].type === 'empty' &&
          !this.state.heroes.some(h => h.tileX === x && h.tileY === y) &&
          !this.state.bombs.some(b => b.x === x && b.y === y) &&
          !this.state.heroDrops.some(d => !d.collected && d.x === x && d.y === y))
          empty.push({ x, y });
    if (empty.length === 0) return;
    const pos = empty[Math.floor(Math.random() * empty.length)];
    const rt = this.createRuntimeHero(heroData, pos);
    rt.waitTimer = 0.3;
    this.state.heroes.push(rt);
  }
}
