import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Pet } from '../types/game';
import { PetCard } from './PetSprite';
import PetDetail from './PetDetail';
import ActivePetBadge from './ActivePetBadge';

export default function Collection() {
  const { pets, selectedPetId, selectPet, setScreen, coins, cryptoBalls } = useGameStore();
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [actionPet, setActionPet] = useState<Pet | null>(null);
  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const orderedPets = [...pets].sort((a, b) => {
    if (a.id === selectedPetId) return -1;
    if (b.id === selectedPetId) return 1;
    return 0;
  });

  const handleViewPet = (pet: Pet) => {
    selectPet(pet.id);
    setActionPet(null);
    setViewMode('detail');
  };

  const handleSetActive = (pet: Pet) => {
    selectPet(pet.id);
    setActionPet(null);
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

      {/* Selected pet spotlight */}
      {selectedPet && (
        <div style={{ padding: '12px 28px 0 28px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(17,17,40,1))',
            border: '1px solid rgba(250,204,21,0.35)',
            borderRadius: 16,
            padding: '8px 10px',
            boxShadow: '0 0 14px rgba(250,204,21,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            maxWidth: 260,
            width: '100%',
            justifyContent: 'center',
          }}>
            <ActivePetBadge size="small" />
            <div style={{
              padding: '4px 8px', borderRadius: 999,
              background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.25)',
              color: '#fde68a', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap'
            }}>
              ATIVO
            </div>
          </div>
        </div>
      )}

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
            {orderedPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                size={168}
                onClick={() => setActionPet(pet)}
                selected={pet.id === selectedPetId}
              />
            ))}
          </div>

          {/* breathing room before footer */}
          <div style={{ height: 28 }} />
        </div>
      </div>

      {/* Pet action modal */}
      {actionPet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 300, background: '#111128', border: '1px solid #252550', borderRadius: 20, padding: 20, textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{actionPet.name}</p>
            <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>O que deseja fazer com este pet?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => handleViewPet(actionPet)} className="active:scale-95 transition-transform" style={{ padding: '12px 0', background: 'linear-gradient(90deg,#16a34a,#22c55e)', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>👁️ Ver</button>
              <button onClick={() => handleSetActive(actionPet)} className="active:scale-95 transition-transform" style={{ padding: '12px 0', background: 'linear-gradient(90deg,#b91c1c,#dc2626)', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>⭐ Selecionar</button>
            </div>
            <button onClick={() => setActionPet(null)} className="active:scale-95 transition-transform" style={{ marginTop: 12, width: '100%', padding: '10px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#9ca3af', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

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
