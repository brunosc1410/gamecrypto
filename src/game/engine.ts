import {
  MAP_COLS, MAP_ROWS, BOMB_TIMER, EXPLOSION_DURATION,
  STAMINA_DRAIN, STAMINA_RECOVERY,
  type Cell, type RuntimeHero, type HeroData, type Bomb,
  type GameState, type Point,
  BCOIN_BY_RARITY, THEME_ORDER, rollBlockHeroDrop,
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
    for (let y = 0; y < MAP_ROWS; y++) for (let x = 0; x < MAP_COLS; x++) {
      if (map[y][x].type === 'chest') totalChests++;
      if (map[y][x].type === 'block') totalBlocks++;
    }
    return {
      map, heroes: runtimeHeroes, bombs: [], explosions: [], particles: [], heroDrops: [],
      bcoinCollected: 0, totalChests, chestsOpened: 0, totalBlocks, blocksDestroyed: 0,
      gameTime: 0, running: true, complete: false, mapNumber: 1, theme: THEME_ORDER[0],
    };
  }

  private getRandomSpawnPositions(map: Cell[][], count: number): Point[] {
    const emptyTiles: Point[] = [];
    for (let y = 1; y < MAP_ROWS - 1; y++)
      for (let x = 1; x < MAP_COLS - 1; x++)
        if (map[y][x].type === 'empty' && !(x % 2 === 0 && y % 2 === 0))
          emptyTiles.push({ x, y });
    // Shuffle
    for (let i = emptyTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyTiles[i], emptyTiles[j]] = [emptyTiles[j], emptyTiles[i]];
    }
    // Pick spread positions
    const step = Math.max(1, Math.floor(emptyTiles.length / (count + 1)));
    return emptyTiles.filter((_, i) => i % step === 0).slice(0, count);
  }

  generateNewMap() {
    const map = this.generateMap();
    const positions = this.getRandomSpawnPositions(map, this.state.heroes.length);
    let totalChests = 0, totalBlocks = 0;
    for (let y = 0; y < MAP_ROWS; y++) for (let x = 0; x < MAP_COLS; x++) {
      if (map[y][x].type === 'chest') totalChests++;
      if (map[y][x].type === 'block') totalBlocks++;
    }
    this.state.map = map; this.state.bombs = []; this.state.explosions = [];
    this.state.particles = []; this.state.heroDrops = [];
    this.state.totalChests = totalChests; this.state.chestsOpened = 0;
    this.state.totalBlocks = totalBlocks; this.state.blocksDestroyed = 0;
    this.state.complete = false; this.state.running = true; this.state.mapNumber++;
    this.state.theme = THEME_ORDER[(this.state.mapNumber - 1) % THEME_ORDER.length];
    for (let i = 0; i < this.state.heroes.length; i++) {
      const hero = this.state.heroes[i];
      const pos = positions[i] || { x: 1, y: MAP_ROWS - 2 };
      hero.x = pos.x; hero.y = pos.y; hero.tileX = pos.x; hero.tileY = pos.y;
      hero.movingToX = pos.x; hero.movingToY = pos.y;
      hero.path = []; hero.pathIndex = 0; hero.state = 'idle';
      hero.waitTimer = 0.3 + Math.random() * 0.5; hero.activeBombs = 0; hero.fleeingFrom = null;
    }
    if (this.onUpdate) this.onUpdate();
  }

  private generateMap(): Cell[][] {
    const map: Cell[][] = [];
    for (let y = 0; y < MAP_ROWS; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_COLS; x++) {
        if (x === 0 || y === 0 || x === MAP_COLS - 1 || y === MAP_ROWS - 1)
          map[y][x] = { type: 'wall', hp: 999, maxHp: 999, bcoinValue: 0 };
        else if (x % 2 === 0 && y % 2 === 0)
          map[y][x] = { type: 'wall', hp: 999, maxHp: 999, bcoinValue: 0 };
        else {
          const r = Math.random();
          if (r < 0.07) { const hp = randomInt(4, 8); map[y][x] = { type: 'chest', hp, maxHp: hp, bcoinValue: 0 }; }
          else if (r < 0.52) { const hp = randomInt(2, 5); map[y][x] = { type: 'block', hp, maxHp: hp, bcoinValue: 0 }; }
          else map[y][x] = { type: 'empty', hp: 0, maxHp: 0, bcoinValue: 0 };
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      const x = randomInt(3, MAP_COLS - 4), y = randomInt(3, MAP_ROWS - 4);
      if (map[y][x].type === 'empty' && !(x % 2 === 0 && y % 2 === 0)) {
        const hp = randomInt(4, 8);
        map[y][x] = { type: 'chest', hp, maxHp: hp, bcoinValue: 0 };
      }
    }
    return map;
  }

  private createRuntimeHero(data: HeroData, pos: Point): RuntimeHero {
    return {
      ...data, x: pos.x, y: pos.y, tileX: pos.x, tileY: pos.y,
      direction: (['up', 'down', 'left', 'right'] as const)[Math.floor(Math.random() * 4)],
      state: 'idle', stamina: data.currentStamina, activeBombs: 0, path: [], pathIndex: 0,
      animTimer: Math.random() * 10, waitTimer: 0.3 + Math.random() * 0.5,
      movingToX: pos.x, movingToY: pos.y,
      hasDoubleCoins: data.abilities.includes('Moedas Duplas'),
      staminaRecoveryMult: data.abilities.includes('Recuperação de Stamina') ? 1.8 : 1.0,
      fleeingFrom: null,
    };
  }

  update(dt: number) {
    if (!this.state.running || this.state.complete) return;
    this.state.gameTime += dt;
    for (const hero of this.state.heroes) this.updateHero(hero, dt);
    this.updateBombs(dt);
    this.updateExplosions(dt);
    this.updateParticles(dt);
    this.checkCompletion();
    if (this.onUpdate) this.onUpdate();
  }

  private updateHero(hero: RuntimeHero, dt: number) {
    hero.animTimer += dt;
    if (hero.stamina <= 0 && hero.state !== 'resting') {
      hero.state = 'resting'; hero.path = []; hero.pathIndex = 0;
    }
    if (hero.state === 'resting') {
      hero.stamina = Math.min(hero.maxStamina, hero.stamina + STAMINA_RECOVERY * hero.staminaRecoveryMult * dt);
      if (hero.stamina >= hero.maxStamina * 0.5) { hero.state = 'idle'; hero.waitTimer = 0.3; }
      return;
    }
    hero.stamina -= STAMINA_DRAIN * dt;
    switch (hero.state) {
      case 'idle': this.handleIdle(hero, dt); break;
      case 'moving': this.handleMoving(hero, dt); break;
      case 'bombing': this.handleBombing(hero, dt); break;
      case 'fleeing': this.handleFleeing(hero, dt); break;
      case 'waiting':
        hero.waitTimer -= dt;
        if (hero.waitTimer <= 0) { hero.state = 'idle'; hero.waitTimer = 0.2; }
        break;
    }
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
    if (dist < 0.08) {
      hero.x = target.x; hero.y = target.y; hero.tileX = target.x; hero.tileY = target.y;
      hero.pathIndex++;
      if (hero.pathIndex >= hero.path.length) { hero.state = 'bombing'; hero.waitTimer = 0.15; }
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
    // Only stop bombing if stamina is near zero
    if (hero.stamina <= 2) { hero.state = 'idle'; hero.waitTimer = 0.3; return; }
    const bx = hero.tileX, by = hero.tileY;
    // Already a bomb here? Skip
    if (this.state.bombs.some(b => b.x === bx && b.y === by)) { hero.state = 'idle'; hero.waitTimer = 0.3; return; }
    // Another hero here? Skip
    if (this.state.heroes.some(h => h.id !== hero.id && h.tileX === bx && h.tileY === by && h.state !== 'resting'))
      { hero.state = 'idle'; hero.waitTimer = 0.4; return; }
    // Max bombs?
    if (this.state.bombs.filter(b => b.heroId === hero.id).length >= hero.bombNum)
      { hero.state = 'idle'; hero.waitTimer = 0.5; return; }

    // Place bomb
    this.state.bombs.push({ x: bx, y: by, timer: BOMB_TIMER, range: hero.bombRange, power: hero.power, heroId: hero.id, animTimer: 0 });
    hero.activeBombs++;

    // Flee
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
    if (dist < 0.08) {
      hero.x = target.x; hero.y = target.y; hero.tileX = target.x; hero.tileY = target.y; hero.pathIndex++; return;
    }
    const move = Math.min(hero.speed * 1.3 * dt, dist);
    hero.x += (dx / dist) * move; hero.y += (dy / dist) * move;
    hero.tileX = Math.round(hero.x); hero.tileY = Math.round(hero.y);
    hero.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  // ─── WALKABLE CHECK: includes hero drop cages as obstacles ───
  private isWalkable(x: number, y: number): boolean {
    if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return false;
    const cell = this.state.map[y][x];
    if (cell.type === 'wall' || cell.type === 'block' || cell.type === 'chest') return false;
    if (this.state.heroDrops.some(d => !d.collected && d.x === x && d.y === y)) return false;
    return true;
  }

  // ─── TARGET FINDING: targets blocks, chests AND cages ───
  private findTarget(hero: RuntimeHero): { path: Point[]; standX: number; standY: number } | null {
    const sx = Math.round(hero.x), sy = Math.round(hero.y);
    const visited = new Set<string>();
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    // Pure BFS
    const queue: { x: number; y: number; path: Point[] }[] = [{ x: sx, y: sy, path: [] }];
    visited.add(`${sx},${sy}`);

    while (queue.length > 0) {
      const cur = queue.shift()!;

      for (const [dx, dy] of dirs) {
        const nx = cur.x + dx, ny = cur.y + dy;
        if (nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) continue;
        const cell = this.state.map[ny][nx];
        // Found a target: block, chest, or cage
        const isCage = this.state.heroDrops.some(d => !d.collected && d.x === nx && d.y === ny);
        if (cell.type === 'block' || cell.type === 'chest' || isCage) {
          // Check stand tile isn't occupied by another bombing/waiting hero
          const standOccupied = this.state.heroes.some(h => h.id !== hero.id &&
            h.tileX === cur.x && h.tileY === cur.y &&
            (h.state === 'bombing' || h.state === 'waiting' || h.state === 'fleeing'));
          if (!standOccupied) {
            return { path: [...cur.path, { x: cur.x, y: cur.y }], standX: cur.x, standY: cur.y };
          }
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
        // STOP immediately at walls - do NOT add wall cell
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
    for (const b of this.state.bombs) { b.timer -= dt; b.animTimer += dt; if (b.timer <= 0) toExplode.push(b); }
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

    // Spark particles
    for (const cell of cells) {
      for (let i = 0; i < 2; i++)
        this.state.particles.push({
          x: cell.x + 0.5 + (Math.random() - 0.5) * 0.3, y: cell.y + 0.5 + (Math.random() - 0.5) * 0.3,
          vx: (Math.random() - 0.5) * 3, vy: -1 - Math.random() * 2, life: 0.3 + Math.random() * 0.2, maxLife: 0.5,
          color: Math.random() > 0.5 ? '#FF6600' : '#FFAA00', size: 2 + Math.random() * 2, type: 'spark',
        });
    }

    const hero = this.state.heroes.find(h => h.id === bomb.heroId);

    for (const cell of cells) {
      const mapCell = this.state.map[cell.y]?.[cell.x];
      if (!mapCell) continue;

      // Damage blocks and chests
      if (mapCell.type === 'block' || mapCell.type === 'chest') {
        mapCell.hp -= bomb.power;
        if (mapCell.hp <= 0) {
          if (mapCell.type === 'chest') {
            const [minC, maxC] = hero ? BCOIN_BY_RARITY[hero.rarity] : [0, 1];
            const amount = Math.floor(Math.random() * (maxC - minC + 1)) + minC;
            const mult = hero?.hasDoubleCoins ? 2 : 1;
            this.state.bcoinCollected += amount * mult;
            this.state.chestsOpened++;
            if (amount > 0) {
              this.state.particles.push({
                x: cell.x + 0.5, y: cell.y + 0.2, vx: 0, vy: -1.5, life: 1.5, maxLife: 1.5,
                color: '#FFD700', size: 14, type: 'text', text: `+${amount * mult}`,
              });
              for (let i = 0; i < Math.min(amount, 5); i++)
                this.state.particles.push({
                  x: cell.x + 0.5, y: cell.y + 0.5, vx: (Math.random() - 0.5) * 3, vy: -2 - Math.random() * 2,
                  life: 0.8 + Math.random() * 0.4, maxLife: 1.2, color: '#FFD700', size: 3, type: 'coin',
                });
            }
            // Roll hero drop from chest
            const droppedHero = rollBlockHeroDrop();
            if (droppedHero) {
              const cageHp = randomInt(15, 28);
              this.state.heroDrops.push({
                x: cell.x, y: cell.y, hero: droppedHero, timer: 999, maxTimer: 999,
                hp: cageHp, maxHp: cageHp, collected: false,
              });
            }
          } else {
            this.state.blocksDestroyed++;
            // Roll hero drop from block
            const droppedHero = rollBlockHeroDrop();
            if (droppedHero) {
              const cageHp = randomInt(15, 28);
              this.state.heroDrops.push({
                x: cell.x, y: cell.y, hero: droppedHero, timer: 999, maxTimer: 999,
                hp: cageHp, maxHp: cageHp, collected: false,
              });
            }
          }
          // Smoke
          for (let i = 0; i < 3; i++)
            this.state.particles.push({
              x: cell.x + 0.5, y: cell.y + 0.5, vx: (Math.random() - 0.5) * 1, vy: -0.3 - Math.random(),
              life: 0.5, maxLife: 0.8, color: '#888', size: 4, type: 'smoke',
            });
          mapCell.type = 'empty'; mapCell.hp = 0;
        }
      }

      // Damage hero drop cages
      for (const drop of this.state.heroDrops) {
        if (!drop.collected && drop.x === cell.x && drop.y === cell.y) {
          drop.hp -= bomb.power;
          if (drop.hp <= 0 && !drop.collected) {
            drop.collected = true;
            // Burst particles
            for (let i = 0; i < 6; i++)
              this.state.particles.push({
                x: cell.x + 0.5, y: cell.y + 0.3, vx: 0, vy: -1.5, life: 2.0, maxLife: 2.0,
                color: '#00FF88', size: 16, type: 'text',
                text: `🆕 ${drop.hero.name}!`,
              });
          }
        }
      }
    }

    // Damage heroes
    for (const h of this.state.heroes) {
      if (h.state === 'resting') continue;
      if (cells.some(c => c.x === h.tileX && c.y === h.tileY)) {
        h.stamina -= 15;
        this.state.particles.push({
          x: h.x + 0.5, y: h.y + 0.3, vx: 0, vy: -2, life: 0.5, maxLife: 0.5,
          color: '#FF0000', size: 5, type: 'damage',
        });
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
      if (p.type === 'text') { p.y += p.vy * dt; } else { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 4 * dt; }
      p.life -= dt;
      if (p.life <= 0) this.state.particles.splice(i, 1);
    }
  }

  private checkCompletion() {
    for (let y = 0; y < MAP_ROWS; y++) for (let x = 0; x < MAP_COLS; x++) {
      const c = this.state.map[y][x];
      if (c.type === 'block' || c.type === 'chest') return;
    }
    if (this.state.heroDrops.some(d => !d.collected)) return;
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
    for (const d of this.state.heroDrops) if (d.collected) { heroes.push(d.hero); }
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
    for (let y = 1; y < MAP_ROWS - 1; y++) for (let x = 1; x < MAP_COLS - 1; x++) {
      if (this.state.map[y][x].type === 'empty' && !(x % 2 === 0 && y % 2 === 0)
        && !this.state.heroes.some(h => h.tileX === x && h.tileY === y)
        && !this.state.bombs.some(b => b.x === x && b.y === y)
        && !this.state.heroDrops.some(d => !d.collected && d.x === x && d.y === y))
        empty.push({ x, y });
    }
    if (empty.length === 0) return;
    const pos = empty[Math.floor(Math.random() * empty.length)];
    const rt = this.createRuntimeHero(heroData, pos);
    rt.waitTimer = 0.3;
    this.state.heroes.push(rt);
  }
}
