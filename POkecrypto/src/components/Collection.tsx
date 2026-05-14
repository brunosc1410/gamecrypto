import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Pet } from '../types/game';
import { PetCard } from './PetSprite';
import PetDetail from './PetDetail';

export default function Collection() {
  const { pets, selectedPetId, selectPet, setScreen, coins, cryptoBalls } = useGameStore();
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const handleSelect = (pet: Pet) => {
    selectPet(pet.id);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedPet) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
        <PetDetail pet={selectedPet} onBack={() => setViewMode('grid')} />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#111128',
          borderBottom: '1px solid #252550',
        }}
      >
        <button
          onClick={() => setScreen('menu')}
          style={{
            color: '#eab308',
            fontWeight: 700,
            fontSize: 14,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1.2,
          }}
        >
          ← Menu
        </button>

        <span style={{ color: '#eab308', fontWeight: 700, fontSize: 17 }}>📋 Coleção</span>

        <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#06b6d4' }}>🔮{cryptoBalls}</span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <style>{`.collection-scroll::-webkit-scrollbar{display:none}`}</style>

        <div className="collection-scroll" style={{ padding: '24px 36px 28px 36px' }}>
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
            {pets.length} pets na coleção
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                size={168}
                onClick={() => handleSelect(pet)}
                selected={pet.id === selectedPetId}
              />
            ))}
          </div>

          {/* breathing room before footer */}
          <div style={{ height: 28 }} />
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          flexShrink: 0,
          background: '#111128',
          borderTop: '1px solid #252550',
          padding: '16px 24px 18px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 -10px 24px rgba(0,0,0,0.28)',
        }}
      >
        {[
          { l: '🗺️ Explorar', bg: 'linear-gradient(90deg,#16a34a,#22c55e)', s: 'menu' as const },
          { l: '📕 Codex', bg: 'linear-gradient(90deg,#b91c1c,#dc2626)', s: 'codex' as const },
          { l: '🛒 Loja', bg: 'linear-gradient(90deg,#7c3aed,#8b5cf6)', s: 'shop' as const },
        ].map((b, i) => (
          <button
            key={i}
            onClick={() => setScreen(b.s)}
            style={{
              padding: '10px 14px',
              background: b.bg,
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Press Start 2P', system-ui",
              lineHeight: 1.2,
            }}
            className="active:scale-95 transition-transform"
          >
            {b.l}
          </button>
        ))}
      </div>
    </div>
  );
}
