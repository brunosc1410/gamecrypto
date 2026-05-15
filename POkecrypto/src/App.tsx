import { useGameStore } from './store/gameStore';
import MainMenu from './components/MainMenu';
import Collection from './components/Collection';
import Battle from './components/Battle';
import Shop from './components/Shop';
import Wallet from './components/Wallet';
import ExploreMap from './components/ExploreMap';
import EncounterScreen from './components/EncounterScreen';
import Codex from './components/Codex';
import Profile from './components/Profile';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const encounterActive = useGameStore((s) => s.encounter.active);
  const battleActive = useGameStore((s) => s.battle.isActive);

  /*
    Safety: if there's an active encounter or battle,
    always show that screen regardless of what screen state says.
    This prevents bugs from navigating away during combat.
  */
  const effectiveScreen = battleActive ? 'battle'
    : encounterActive ? 'encounter'
    : screen;

  return (
    <div
      style={{
        height: '100dvh',
        width: '100%',
        background: '#020208',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        boxSizing: 'border-box',
      }}
    >
      {/* Single game frame */}
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 500,
          maxHeight: 980,
          background: '#0b0b20',
          borderRadius: 18,
          border: '1px solid rgba(42, 42, 90, 0.75)',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
          boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
        }}
      >
        {effectiveScreen === 'menu' && <MainMenu />}
        {effectiveScreen === 'collection' && <Collection />}
        {effectiveScreen === 'battle' && <Battle />}
        {effectiveScreen === 'shop' && <Shop />}
        {effectiveScreen === 'wallet' && <Wallet />}
        {effectiveScreen === 'explore' && <ExploreMap />}
        {effectiveScreen === 'encounter' && <EncounterScreen />}
        {effectiveScreen === 'codex' && <Codex />}
        {effectiveScreen === 'profile' && <Profile />}
      </div>
    </div>
  );
}
