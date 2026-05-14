import { useGameStore } from './store/gameStore';
import MainMenu from './components/MainMenu';
import Collection from './components/Collection';
import Battle from './components/Battle';
import Shop from './components/Shop';
import Wallet from './components/Wallet';
import ExploreMap from './components/ExploreMap';
import EncounterScreen from './components/EncounterScreen';
import Codex from './components/Codex';

export default function App() {
  const screen = useGameStore((s) => s.screen);

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
        {screen === 'menu' && <MainMenu />}
        {screen === 'collection' && <Collection />}
        {screen === 'battle' && <Battle />}
        {screen === 'shop' && <Shop />}
        {screen === 'wallet' && <Wallet />}
        {screen === 'explore' && <ExploreMap />}
        {screen === 'encounter' && <EncounterScreen />}
        {screen === 'codex' && <Codex />}
      </div>
    </div>
  );
}
