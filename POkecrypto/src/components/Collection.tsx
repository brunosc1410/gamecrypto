import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Pet, PetElement } from '../types/game';
import { PetCard } from './PetSprite';
import PetDetail from './PetDetail';
import ActivePetBadge from './ActivePetBadge';

const RARITY_ORDER: Record<string, number> = { legendary: 4, epic: 3, rare: 2, common: 1 };
function petPower(p: Pet) {
  return p.stats.maxHp + p.stats.attack * 2 + p.stats.defense * 1.5 + p.stats.speed * 1.2 + p.stats.level * 10;
}

type FilterRarity = 'all' | 'common' | 'rare' | 'epic' | 'legendary';
type FilterElement = 'all' | PetElement;

const RARITY_FILTERS: { key: FilterRarity; label: string; color: string }[] = [
  { key: 'all', label: 'Todos', color: '#9ca3af' },
  { key: 'legendary', label: '🌟', color: '#f59e0b' },
  { key: 'epic', label: '💜', color: '#a855f7' },
  { key: 'rare', label: '💙', color: '#3b82f6' },
  { key: 'common', label: '⬜', color: '#6b7280' },
];

const ELEMENT_FILTERS: { key: FilterElement; emoji: string }[] = [
  { key: 'all', emoji: '📖' },
  { key: 'fire', emoji: '🔥' },
  { key: 'water', emoji: '💧' },
  { key: 'grass', emoji: '🌿' },
  { key: 'electric', emoji: '⚡' },
  { key: 'dark', emoji: '🌑' },
  { key: 'ice', emoji: '❄️' },
];

export default function Collection() {
  const { pets, selectedPetId, selectPet, setScreen, coins, cryptoBalls } = useGameStore();
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [actionPet, setActionPet] = useState<Pet | null>(null);
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [filterElement, setFilterElement] = useState<FilterElement>('all');
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  let filtered = [...pets];
  if (filterRarity !== 'all') filtered = filtered.filter(p => p.rarity === filterRarity);
  if (filterElement !== 'all') filtered = filtered.filter(p => p.element === filterElement);

  filtered.sort((a, b) => {
    if (a.id === selectedPetId) return -1;
    if (b.id === selectedPetId) return 1;
    const ra = RARITY_ORDER[a.rarity] ?? 0;
    const rb = RARITY_ORDER[b.rarity] ?? 0;
    if (rb !== ra) return rb - ra;
    return petPower(b) - petPower(a);
  });

  const handleViewPet = (pet: Pet) => { selectPet(pet.id); setActionPet(null); setViewMode('detail'); };
  const handleSetActive = (pet: Pet) => { selectPet(pet.id); setActionPet(null); };

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
      <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#eab308', fontWeight: 700, fontSize: 17 }}>🐾 Meus PETS</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#06b6d4' }}>🔮{cryptoBalls}</span>
        </div>
      </div>

      {/* Active pet */}
      {selectedPet && (
        <div style={{ padding: '10px 28px 0 28px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(17,17,40,1))',
            border: '1px solid rgba(250,204,21,0.35)', borderRadius: 16,
            padding: '8px 10px', boxShadow: '0 0 14px rgba(250,204,21,0.08)',
            display: 'flex', alignItems: 'center', gap: 10, maxWidth: 260, width: '100%', justifyContent: 'center',
          }}>
            <ActivePetBadge size="small" />
            <div style={{ padding: '4px 8px', borderRadius: 999, background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.25)', color: '#fde68a', fontSize: 9, fontWeight: 700 }}>ATIVO</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ padding: '10px 24px 6px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
          {RARITY_FILTERS.map(f => {
            const active = filterRarity === f.key;
            return (
              <button key={f.key} onClick={() => setFilterRarity(f.key)} className="active:scale-90 transition-transform" style={{
                padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: active ? `${f.color}20` : 'rgba(255,255,255,0.03)',
                border: active ? `2px solid ${f.color}50` : '1px solid rgba(255,255,255,0.06)',
                color: active ? f.color : '#6b7280',
              }}>{f.label}</button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
          {ELEMENT_FILTERS.map(f => {
            const active = filterElement === f.key;
            return (
              <button key={f.key} onClick={() => setFilterElement(f.key)} className="active:scale-90 transition-transform" style={{
                padding: '5px 8px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                background: active ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                border: active ? '2px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)',
              }}>{f.emoji}</button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '16px 28px 28px 28px' }}>
          <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', marginBottom: 14 }}>
            {filtered.length} de {pets.length} pets
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            {filtered.map((pet) => (
              <PetCard key={pet.id} pet={pet} size={176} onClick={() => setActionPet(pet)} selected={pet.id === selectedPetId} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p style={{ color: '#4b5563', fontSize: 14, textAlign: 'center', marginTop: 40 }}>Nenhum pet encontrado.</p>
          )}
        </div>
      </div>

      {/* Action modal */}
      {actionPet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 300, background: '#111128', border: '1px solid #252550', borderRadius: 20, padding: 20, textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{actionPet.name}</p>
            <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>O que deseja fazer?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => handleViewPet(actionPet)} className="active:scale-95 transition-transform" style={{
                padding: '12px 0', background: 'linear-gradient(90deg,#16a34a,#22c55e)',
                border: 'none', borderRadius: 12, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>📊 Detalhes</button>
              <button onClick={() => handleSetActive(actionPet)} className="active:scale-95 transition-transform" style={{
                padding: '12px 0', background: actionPet.id === selectedPetId ? '#374151' : 'linear-gradient(90deg,#eab308,#f59e0b)',
                border: 'none', borderRadius: 12, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>{actionPet.id === selectedPetId ? '✓ Ativo' : '⭐ Ativar'}</button>
            </div>
            <button onClick={() => setActionPet(null)} style={{
              marginTop: 12, padding: '10px 0', width: '100%', background: 'none',
              border: '1px solid #374151', borderRadius: 12, color: '#9ca3af', fontSize: 12, cursor: 'pointer',
            }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
