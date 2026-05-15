import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet, BattleLog, BattleState, ExploreState, EncounterState, GameScreen, MapZone, AvatarGender, AvatarClass } from '../types/game';
import { STARTER_PETS, ELEMENT_ADVANTAGE } from '../data/pets';

export interface Inventory {
  potionHp: number;
  potionAtk: number;
  potionDef: number;
  potionSpd: number;
  megaPack: number;
}

interface GameState {
  screen: GameScreen;
  playerName: string;
  playerGender: AvatarGender;
  playerClass: AvatarClass;
  coins: number;
  gems: number;
  inventory: Inventory;
  pets: Pet[];
  selectedPetId: string | null;
  battle: BattleState;
  explore: ExploreState;
  encounter: EncounterState;
  totalBattles: number;
  totalCaptures: number;
  cryptoBalls: number;
  exploreSpeed: number;
  encounterMode: 'manual' | 'auto-battle' | 'auto-capture' | 'auto-flee';
  isVip: boolean;
  seenPets: string[];
  walletConnected: boolean;
  walletAddress: string | null;

  setScreen: (screen: GameScreen) => void;
  setPlayerName: (name: string) => void;
  setPlayerGender: (g: AvatarGender) => void;
  setPlayerClass: (c: AvatarClass) => void;
  addStarterPets: () => void;
  selectPet: (id: string) => void;
  updatePetColors: (petId: string, colors: { primary?: string; secondary?: string; accent?: string }) => void;
  resetPetColors: (petId: string) => void;
  upgradeStat: (petId: string, stat: 'attack' | 'defense' | 'speed' | 'hp') => void;
  startBattleFromEncounter: (enemy: Pet) => void;
  processBattleTurn: () => void;
  endBattle: () => void;
  setBattleSpeed: (speed: number) => void;
  addCoins: (amount: number) => void;
  connectWallet: () => void;
  renamePet: (petId: string, newName: string) => void;
  startExploring: (zone: MapZone) => void;
  moveAvatar: (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => void;
  triggerEncounter: () => void;
  setEncounterFlash: (v: boolean) => void;
  clearEncounter: () => void;
  stopExploring: () => void;
  clearBattleAnimation: () => void;
  startEncounter: (wildPet: Pet) => void;
  throwBall: () => void;
  setEncounterPhase: (phase: EncounterState['phase']) => void;
  resolveCapture: () => 'caught' | 'broke-free' | 'fled';
  finishEncounter: () => void;
  fleeBattle: () => void;
}

let idCounter = 0;
function genId() { return `pet-${Date.now()}-${idCounter++}`; }

function addLog(logs: BattleLog[], message: string, type: BattleLog['type']): BattleLog[] {
  return [
    ...logs,
    { id: `log-${Date.now()}-${Math.random()}`, message, type, timestamp: Date.now() },
  ];
}

const defaultBattle: BattleState = {
  isActive: false,
  playerPet: null,
  enemyPet: null,
  playerCurrentHp: 0,
  enemyCurrentHp: 0,
  logs: [],
  turn: 0,
  winner: null,
  isAutoPlaying: true,
  battleSpeed: 2000,
  currentAnimation: { type: 'none', duration: 0 },
  showDamage: { player: null, enemy: null },
};

const defaultExplore: ExploreState = {
  isExploring: false,
  currentZone: 'forest',
  avatarX: 50,
  avatarY: 50,
  direction: 'down',
  stepCount: 0,
  encounterPending: false,
  encounterFlash: false,
};

const defaultEncounter: EncounterState = {
  active: false,
  wildPet: null,
  phase: 'ready',
  shakeCount: 0,
  ballsLeft: 0,
  catchChance: 0,
  fleeChance: 0,
  attempts: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'menu',
      playerName: 'Treinador',
      playerGender: 'male' as AvatarGender,
      playerClass: 'warrior' as AvatarClass,
      coins: 500,
      inventory: { potionHp: 0, potionAtk: 0, potionDef: 0, potionSpd: 0, megaPack: 0 },
      gems: 10,
      pets: [],
      selectedPetId: null,
      battle: { ...defaultBattle },
      explore: { ...defaultExplore },
      encounter: { ...defaultEncounter },
      totalBattles: 0,
      totalCaptures: 0,
      cryptoBalls: 20,
      exploreSpeed: 1,
      encounterMode: 'manual' as const,
      isVip: false,
      seenPets: [],
      walletConnected: false,
      walletAddress: null,

      setScreen: (screen) => set({ screen }),
      setPlayerName: (name) => set({ playerName: name }),
      setPlayerGender: (g) => set({ playerGender: g }),
      setPlayerClass: (c) => set({ playerClass: c }),

      addStarterPets: () => {
        const state = get();
        if (state.pets.length > 0) return;
        const starterPets: Pet[] = STARTER_PETS.map((p) => ({
          ...p,
          id: genId(),
          colors: { ...p.colors },
          defaultColors: { ...p.defaultColors },
          stats: { ...p.stats },
        }));
        set({ pets: starterPets, selectedPetId: starterPets[0].id });
      },

      selectPet: (id) => set({ selectedPetId: id }),

      updatePetColors: (petId, colors) => {
        set((s) => ({
          pets: s.pets.map((p) =>
            p.id !== petId ? p : {
              ...p,
              colors: {
                primary: colors.primary ?? p.colors.primary,
                secondary: colors.secondary ?? p.colors.secondary,
                accent: colors.accent ?? p.colors.accent,
              },
            }
          ),
        }));
      },

      resetPetColors: (petId) => {
        set((s) => ({
          pets: s.pets.map((p) => p.id !== petId ? p : { ...p, colors: { ...p.defaultColors } }),
        }));
      },

      upgradeStat: (petId, stat) => {
        const state = get();
        const cost = 50;
        if (state.coins < cost) return;
        set({
          pets: state.pets.map((p) => {
            if (p.id !== petId) return p;
            const ns = { ...p.stats };
            if (stat === 'hp') { ns.hp += 10; ns.maxHp += 10; }
            else { ns[stat] += 5; }
            return { ...p, stats: ns };
          }),
          coins: state.coins - cost,
        });
      },

      // ENCOUNTER
      startEncounter: (wildPet: Pet) => {
        const rarityChance: Record<string, number> = { common: 0.55, rare: 0.35, epic: 0.20, legendary: 0.10 };
        const fleeChanceMap: Record<string, number> = { common: 0.15, rare: 0.25, epic: 0.35, legendary: 0.50 };
        const seen = get().seenPets;
        const newSeen = seen.includes(wildPet.name) ? seen : [...seen, wildPet.name];
        set({
          seenPets: newSeen,
          encounter: {
            active: true,
            wildPet,
            phase: 'appearing',
            shakeCount: 0,
            ballsLeft: get().cryptoBalls,
            catchChance: rarityChance[wildPet.rarity] ?? 0.4,
            fleeChance: fleeChanceMap[wildPet.rarity] ?? 0.2,
            attempts: 0,
          },
          screen: 'encounter',
          explore: { ...get().explore, encounterPending: false, encounterFlash: false },
        });
      },

      throwBall: () => {
        const state = get();
        if (state.cryptoBalls <= 0) return;
        set((s) => ({
          cryptoBalls: s.cryptoBalls - 1,
          encounter: {
            ...s.encounter,
            phase: 'throwing',
            shakeCount: 0,
            attempts: s.encounter.attempts + 1,
            ballsLeft: s.cryptoBalls - 1,
          },
        }));
      },

      setEncounterPhase: (phase) => {
        set((s) => ({ encounter: { ...s.encounter, phase } }));
      },

      resolveCapture: () => {
        const state = get();
        const enc = state.encounter;
        const roll = Math.random();
        const adjustedCatch = enc.catchChance - (enc.attempts * 0.03);
        if (roll < adjustedCatch) {
          set((s) => ({ encounter: { ...s.encounter, phase: 'caught' } }));
          return 'caught';
        } else {
          const fleeRoll = Math.random();
          const adjustedFlee = enc.fleeChance + (enc.attempts * 0.08);
          if (fleeRoll < adjustedFlee) {
            set((s) => ({ encounter: { ...s.encounter, phase: 'fled' } }));
            return 'fled';
          } else {
            set((s) => ({ encounter: { ...s.encounter, phase: 'broke-free' } }));
            return 'broke-free';
          }
        }
      },

      finishEncounter: () => {
        const state = get();
        const enc = state.encounter;
        if (enc.phase === 'caught' && enc.wildPet) {
          const newPet: Pet = { ...enc.wildPet, id: genId(), wins: 0, losses: 0 };
          const rarityReward: Record<string, number> = { common: 30, rare: 80, epic: 200, legendary: 500 };
          const captureCoins = (rarityReward[enc.wildPet.rarity] ?? 30) + (enc.wildPet.stats.level * 10);
          set({
            pets: [...state.pets, newPet],
            totalCaptures: state.totalCaptures + 1,
            coins: state.coins + captureCoins,
            encounter: { ...defaultEncounter },
            screen: state.explore.isExploring ? 'explore' : 'collection',
            explore: state.explore.isExploring
              ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false }
              : state.explore,
          });
        } else {
          set({
            encounter: { ...defaultEncounter },
            screen: state.explore.isExploring ? 'explore' : 'collection',
            explore: state.explore.isExploring
              ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false }
              : state.explore,
          });
        }
      },

      fleeBattle: () => {
        const state = get();
        set({
          encounter: { ...defaultEncounter },
          screen: state.explore.isExploring ? 'explore' : 'collection',
          explore: state.explore.isExploring
            ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false }
            : state.explore,
        });
      },

      // BATTLE
      startBattleFromEncounter: (enemy: Pet) => {
        const state = get();
        const playerPet = state.pets.find((p) => p.id === state.selectedPetId);
        if (!playerPet) return;
        const logs = addLog([], `⚔️ Batalha contra ${enemy.name}!`, 'info');
        set({
          battle: {
            isActive: true,
            playerPet: { ...playerPet },
            enemyPet: enemy,
            playerCurrentHp: playerPet.stats.hp,
            enemyCurrentHp: enemy.stats.hp,
            logs,
            turn: 0,
            winner: null,
            isAutoPlaying: true,
            battleSpeed: state.battle.battleSpeed,
            currentAnimation: { type: 'idle', duration: 0 },
            showDamage: { player: null, enemy: null },
          },
          screen: 'battle',
          encounter: { ...defaultEncounter },
          explore: { ...state.explore, encounterPending: false, encounterFlash: false },
        });
      },

      processBattleTurn: () => {
        const state = get();
        const { battle } = state;
        if (!battle.isActive || battle.winner || !battle.playerPet || !battle.enemyPet) return;

        let { playerCurrentHp, enemyCurrentHp } = battle;
        let logs = [...battle.logs];
        const turn = battle.turn + 1;
        const pPet = battle.playerPet;
        const ePet = battle.enemyPet;
        const playerFirst = pPet.stats.speed >= ePet.stats.speed;
        let pDmgShow: number | null = null;
        let eDmgShow: number | null = null;

        const calcDamage = (attacker: Pet, defender: Pet, defHp: number, isPlayer: boolean) => {
          const baseDamage = Math.max(1, attacker.stats.attack - defender.stats.defense * 0.5);
          const isCritical = Math.random() < 0.12;
          const advantage = ELEMENT_ADVANTAGE[attacker.element] === defender.element;
          let mult = advantage ? 1.4 : 1;
          if (isCritical) mult *= 1.6;
          const variance = 0.85 + Math.random() * 0.3;
          const damage = Math.max(1, Math.floor(baseDamage * mult * variance));

          const who = isPlayer ? pPet.name : ePet.name;
          if (isCritical) {
            logs = addLog(logs, `💥 ${who} — CRÍTICO! -${damage}HP`, 'critical');
          } else {
            logs = addLog(logs, `${isPlayer ? '⚔️' : '🗡️'} ${who} ataca! -${damage}HP`, 'attack');
          }
          if (advantage && mult > 1) logs = addLog(logs, `✨ Super efetivo!`, 'info');
          if (isPlayer) eDmgShow = damage;
          else pDmgShow = damage;
          return Math.max(0, defHp - damage);
        };

        if (playerFirst) {
          enemyCurrentHp = calcDamage(pPet, ePet, enemyCurrentHp, true);
          if (enemyCurrentHp > 0) playerCurrentHp = calcDamage(ePet, pPet, playerCurrentHp, false);
        } else {
          playerCurrentHp = calcDamage(ePet, pPet, playerCurrentHp, false);
          if (playerCurrentHp > 0) enemyCurrentHp = calcDamage(pPet, ePet, enemyCurrentHp, true);
        }

        let winner: 'player' | 'enemy' | null = null;
        let anim: BattleState['currentAnimation'] = { type: 'attack-player', duration: 400 };

        if (enemyCurrentHp <= 0) {
          winner = 'player';
          logs = addLog(logs, `🎉 ${pPet.name} venceu!`, 'win');
          anim = { type: 'faint-enemy', duration: 800 };
        } else if (playerCurrentHp <= 0) {
          winner = 'enemy';
          logs = addLog(logs, `😢 ${pPet.name} foi derrotado...`, 'lose');
          anim = { type: 'faint-player', duration: 800 };
        }

        set({
          battle: {
            ...battle,
            playerCurrentHp,
            enemyCurrentHp,
            logs,
            turn,
            winner,
            currentAnimation: anim,
            showDamage: { player: pDmgShow, enemy: eDmgShow },
          },
          totalBattles: winner ? state.totalBattles + 1 : state.totalBattles,
        });
      },

      clearBattleAnimation: () => {
        set((s) => ({
          battle: {
            ...s.battle,
            currentAnimation: { type: 'idle', duration: 0 },
            showDamage: { player: null, enemy: null },
          },
        }));
      },

      endBattle: () => {
        const state = get();
        const { battle } = state;
        if (!battle.playerPet) return;

        let coins = state.coins;
        let gems = state.gems;
        const petId = battle.playerPet.id;

        const pets = state.pets.map((p) => {
          if (p.id !== petId) return p;
          const ns = { ...p.stats };
          if (battle.winner === 'player') {
            const expGain = 30 + (battle.enemyPet?.stats.level ?? 1) * 10;
            ns.exp += expGain;
            while (ns.exp >= ns.expToNext) {
              ns.exp -= ns.expToNext;
              ns.level += 1;
              ns.expToNext = Math.floor(ns.expToNext * 1.3);
              ns.maxHp += 8;
              ns.hp = ns.maxHp;
              ns.attack += 3;
              ns.defense += 2;
              ns.speed += 2;
            }
            return { ...p, stats: ns, wins: p.wins + 1 };
          }
          const expLoss = 10 + (battle.enemyPet?.stats.level ?? 1) * 3;
          ns.exp += expLoss;
          while (ns.exp >= ns.expToNext) {
            ns.exp -= ns.expToNext;
            ns.level += 1;
            ns.expToNext = Math.floor(ns.expToNext * 1.3);
            ns.maxHp += 8;
            ns.hp = ns.maxHp;
            ns.attack += 3;
            ns.defense += 2;
            ns.speed += 2;
          }
          return { ...p, stats: ns, losses: p.losses + 1 };
        });

        if (battle.winner === 'player') {
          coins += 100 + (battle.enemyPet?.stats.level ?? 1) * 20;
          gems += Math.random() < 0.3 ? 1 : 0;
        }

        set({
          pets,
          coins,
          gems,
          battle: { ...defaultBattle },
          screen: state.explore.isExploring ? 'explore' : 'menu',
          explore: state.explore.isExploring
            ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false }
            : state.explore,
        });
      },

      setBattleSpeed: (speed) => set((s) => ({ battle: { ...s.battle, battleSpeed: speed } })),
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      connectWallet: () => {
        const addr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        set({ walletConnected: true, walletAddress: addr });
      },

      renamePet: (petId, newName) => {
        set((s) => ({
          pets: s.pets.map((p) => p.id !== petId ? p : { ...p, name: newName }),
        }));
      },

      // EXPLORE
      startExploring: (zone: MapZone) => {
        set({
          explore: {
            isExploring: true,
            currentZone: zone,
            avatarX: 50,
            avatarY: 70,
            direction: 'down',
            stepCount: 0,
            encounterPending: false,
            encounterFlash: false,
          },
          screen: 'explore',
        });
      },

      moveAvatar: (dx, dy, dir) => {
        set((s) => ({
          explore: {
            ...s.explore,
            avatarX: Math.max(5, Math.min(95, s.explore.avatarX + dx)),
            avatarY: Math.max(5, Math.min(95, s.explore.avatarY + dy)),
            direction: dir,
            stepCount: s.explore.stepCount + 1,
          },
        }));
      },

      triggerEncounter: () => set((s) => ({ explore: { ...s.explore, encounterPending: true, encounterFlash: true } })),
      setEncounterFlash: (v) => set((s) => ({ explore: { ...s.explore, encounterFlash: v } })),
      clearEncounter: () => set((s) => ({ explore: { ...s.explore, encounterPending: false, encounterFlash: false } })),
      stopExploring: () => set({ explore: { ...defaultExplore }, screen: 'menu' }),
    }),
    {
      name: 'cryptopets-arena-save',
      partialize: (state) => ({
        playerName: state.playerName,
        playerGender: state.playerGender,
        playerClass: state.playerClass,
        coins: state.coins,
        gems: state.gems,
        pets: state.pets,
        selectedPetId: state.selectedPetId,
        totalBattles: state.totalBattles,
        totalCaptures: state.totalCaptures,
        cryptoBalls: state.cryptoBalls,
        exploreSpeed: state.exploreSpeed,
        encounterMode: state.encounterMode,
        isVip: state.isVip,
        inventory: state.inventory,
        seenPets: state.seenPets,
        walletConnected: state.walletConnected,
        walletAddress: state.walletAddress,
      }),
    }
  )
);
