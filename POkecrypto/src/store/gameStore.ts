import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet, BattleLog, BattleState, ExploreState, EncounterState, GameScreen, MapZone } from '../types/game';
import { STARTER_PETS, ELEMENT_ADVANTAGE } from '../data/pets';

interface GameState {
  screen: GameScreen;
  playerName: string;
  coins: number;
  gems: number;
  pets: Pet[];
  selectedPetId: string | null;
  battle: BattleState;
  explore: ExploreState;
  encounter: EncounterState;
  totalBattles: number;
  totalCaptures: number;
  cryptoBalls: number;
  seenPets: string[];   // names of pets seen in encounters
  walletConnected: boolean;
  walletAddress: string | null;

  setScreen: (screen: GameScreen) => void;
  setPlayerName: (name: string) => void;
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
  // Encounter actions
  startEncounter: (wildPet: Pet) => void;
  throwBall: () => void;
  setEncounterPhase: (phase: EncounterState['phase']) => void;
  resolveCapture: () => 'caught' | 'broke-free' | 'fled';
  finishEncounter: () => void;
  fleeBattle: () => void;
}

let idCounter = 0;
function genId() {
  return `pet-${Date.now()}-${idCounter++}`;
}

function addLog(logs: BattleLog[], message: string, type: BattleLog['type']): BattleLog[] {
  return [
    ...logs,
    { id: `log-${Date.now()}-${Math.random()}`, message, type, timestamp: Date.now() },
  ];
}

const defaultBattle: BattleState = {
  isActive: false, playerPet: null, enemyPet: null,
  playerCurrentHp: 0, enemyCurrentHp: 0, logs: [], turn: 0,
  winner: null, isAutoPlaying: true, battleSpeed: 1200,
  currentAnimation: { type: 'none', duration: 0 },
  showDamage: { player: null, enemy: null },
};

const defaultExplore: ExploreState = {
  isExploring: false, currentZone: 'forest',
  avatarX: 50, avatarY: 50, direction: 'down',
  stepCount: 0, encounterPending: false, encounterFlash: false,
};

const defaultEncounter: EncounterState = {
  active: false, wildPet: null, phase: 'ready',
  shakeCount: 0, ballsLeft: 0, catchChance: 0,
  fleeChance: 0, attempts: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'menu',
      playerName: 'Treinador',
      coins: 500,
      gems: 10,
      pets: [],
      selectedPetId: null,
      battle: { ...defaultBattle },
      explore: { ...defaultExplore },
      encounter: { ...defaultEncounter },
      totalBattles: 0,
      totalCaptures: 0,
      cryptoBalls: 20,
      seenPets: [],
      walletConnected: false,
      walletAddress: null,

      setScreen: (screen) => set({ screen }),
      setPlayerName: (name) => set({ playerName: name }),

      addStarterPets: () => {
        const state = get();
        if (state.pets.length > 0) return;
        const starterPets: Pet[] = STARTER_PETS.map((p) => ({
          ...p, id: genId(),
          colors: { ...p.colors }, defaultColors: { ...p.defaultColors }, stats: { ...p.stats },
        }));
        set({ pets: starterPets, selectedPetId: starterPets[0].id });
      },

      selectPet: (id) => set({ selectedPetId: id }),

      updatePetColors: (petId, colors) => {
        set((s) => ({
          pets: s.pets.map((p) =>
            p.id !== petId ? p : {
              ...p, colors: {
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
            if (stat === 'hp') { ns.hp += 10; ns.maxHp += 10; } else { ns[stat] += 5; }
            return { ...p, stats: ns };
          }),
          coins: state.coins - cost,
        });
      },

      // ===== ENCOUNTER =====
      startEncounter: (wildPet: Pet) => {
        const rarityChance: Record<string, number> = {
          common: 0.55, rare: 0.35, epic: 0.20, legendary: 0.10,
        };
        const fleeChance: Record<string, number> = {
          common: 0.15, rare: 0.25, epic: 0.35, legendary: 0.50,
        };
        // Mark as seen in codex
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
            fleeChance: fleeChance[wildPet.rarity] ?? 0.2,
            attempts: 0,
          },
          screen: 'encounter',
          explore: { ...get().explore, encounterPending: false, encounterFlash: false },
        });
      },

      throwBall: () => {
        const state = get();
        if (state.cryptoBalls <= 0) return;
        set({
          cryptoBalls: state.cryptoBalls - 1,
          encounter: {
            ...state.encounter,
            phase: 'throwing',
            shakeCount: 0,
            ballsLeft: state.cryptoBalls - 1,
            attempts: state.encounter.attempts + 1,
          },
        });
      },

      setEncounterPhase: (phase) => {
        set((s) => ({
          encounter: { ...s.encounter, phase },
        }));
      },

      resolveCapture: () => {
        const state = get();
        const enc = state.encounter;
        const roll = Math.random();
        // Each shake is a partial check. After 3 shakes, final catch check
        if (roll < enc.catchChance) {
          // Caught!
          set((s) => ({ encounter: { ...s.encounter, phase: 'caught' } }));
          return 'caught';
        } else {
          // Broke free - check if pet flees
          const fleeRoll = Math.random();
          // Flee chance increases with each attempt
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
          // Add pet to collection
          const newPet: Pet = {
            ...enc.wildPet,
            id: genId(),
            wins: 0, losses: 0,
          };
          set({
            pets: [...state.pets, newPet],
            totalCaptures: state.totalCaptures + 1,
            coins: state.coins + 50,
            encounter: { ...defaultEncounter },
            screen: state.explore.isExploring ? 'explore' : 'collection',
            explore: state.explore.isExploring
              ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false }
              : state.explore,
          });
        } else {
          // Fled or gave up
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

      // ===== BATTLE =====
      startBattleFromEncounter: (enemy: Pet) => {
        const state = get();
        const playerPet = state.pets.find((p) => p.id === state.selectedPetId);
        if (!playerPet) return;
        const logs = addLog([], `⚔️ Batalha contra ${enemy.name}!`, 'info');
        set({
          battle: {
            isActive: true, playerPet: { ...playerPet }, enemyPet: enemy,
            playerCurrentHp: playerPet.stats.hp, enemyCurrentHp: enemy.stats.hp,
            logs, turn: 0, winner: null, isAutoPlaying: true,
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
          const isCritical = Math.random() < 0.15;
          const isMiss = Math.random() < 0.1;
          let elementBonus = 1;
          if (ELEMENT_ADVANTAGE[attacker.element] === defender.element) elementBonus = 1.5;
          if (isMiss) { logs = addLog(logs, `💨 ${attacker.name} errou!`, 'miss'); return defHp; }
          let damage = Math.floor(baseDamage * (0.85 + Math.random() * 0.3) * elementBonus);
          if (isCritical) { damage = Math.floor(damage * 1.8); logs = addLog(logs, `💥 CRÍTICO! ${attacker.name} → ${damage}!`, 'critical'); }
          else { logs = addLog(logs, `⚔️ ${attacker.name} → ${damage} dano!`, 'attack'); }
          if (elementBonus > 1) logs = addLog(logs, `✨ Super efetivo!`, 'info');
          if (isPlayer) eDmgShow = damage; else pDmgShow = damage;
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
        if (enemyCurrentHp <= 0) { winner = 'player'; logs = addLog(logs, `🏆 ${pPet.name} venceu!`, 'win'); anim = { type: 'faint-enemy', duration: 800 }; }
        else if (playerCurrentHp <= 0) { winner = 'enemy'; logs = addLog(logs, `💀 ${pPet.name} perdeu...`, 'lose'); anim = { type: 'faint-player', duration: 800 }; }

        set({ battle: { ...battle, playerCurrentHp, enemyCurrentHp, logs, turn, winner, currentAnimation: anim, showDamage: { player: pDmgShow, enemy: eDmgShow } } });
      },

      clearBattleAnimation: () => {
        set((s) => ({ battle: { ...s.battle, currentAnimation: { type: 'idle', duration: 0 }, showDamage: { player: null, enemy: null } } }));
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
            if (ns.exp >= ns.expToNext) {
              ns.exp -= ns.expToNext; ns.level += 1;
              ns.expToNext = Math.floor(ns.expToNext * 1.3);
              ns.maxHp += 8; ns.hp = ns.maxHp; ns.attack += 3; ns.defense += 2; ns.speed += 2;
            }
            return { ...p, stats: ns, wins: p.wins + 1 };
          }
          return { ...p, stats: ns, losses: p.losses + 1 };
        });
        if (battle.winner === 'player') { coins += 100 + (battle.enemyPet?.stats.level ?? 1) * 20; gems += Math.random() < 0.3 ? 1 : 0; } else { coins += 20; }
        set({
          pets, coins, gems, totalBattles: state.totalBattles + 1,
          battle: { ...defaultBattle },
          screen: state.explore.isExploring ? 'explore' : 'collection',
          explore: state.explore.isExploring ? { ...state.explore, stepCount: 0, encounterPending: false, encounterFlash: false } : state.explore,
        });
      },

      setBattleSpeed: (speed) => set((s) => ({ battle: { ...s.battle, battleSpeed: speed } })),
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      connectWallet: () => {
        const addr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        set({ walletConnected: true, walletAddress: addr });
      },

      renamePet: (petId, newName) => {
        set((s) => ({ pets: s.pets.map((p) => p.id !== petId ? p : { ...p, name: newName }) }));
      },

      // ===== EXPLORE =====
      startExploring: (zone: MapZone) => {
        set({
          explore: { isExploring: true, currentZone: zone, avatarX: 50, avatarY: 70, direction: 'down', stepCount: 0, encounterPending: false, encounterFlash: false },
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
        playerName: state.playerName, coins: state.coins, gems: state.gems,
        pets: state.pets, selectedPetId: state.selectedPetId,
        totalBattles: state.totalBattles, totalCaptures: state.totalCaptures,
        cryptoBalls: state.cryptoBalls, seenPets: state.seenPets,
        walletConnected: state.walletConnected, walletAddress: state.walletAddress,
      }),
    }
  )
);
