import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import PetSprite from './PetSprite';

interface Props {
  compact?: boolean;
}

const ITEMS = [
  { key: 'cryptoBalls', label: 'CryptoBalls', emoji: '🔮', color: '#06b6d4', stat: null },
  { key: 'potionHp', label: 'Poção Vida', emoji: '❤️', color: '#22c55e', stat: 'hp' as const },
  { key: 'potionAtk', label: 'Elixir Força', emoji: '⚔️', color: '#ef4444', stat: 'attack' as const },
  { key: 'potionDef', label: 'Escudo Mágico', emoji: '🛡️', color: '#3b82f6', stat: 'defense' as const },
  { key: 'potionSpd', label: 'Botas Vento', emoji: '💨', color: '#eab308', stat: 'speed' as const },
];

export default function InventoryPanel({ compact = false }: Props) {
  const inventory = useGameStore((s) => s.inventory);
  const cryptoBalls = useGameStore((s) => s.cryptoBalls);
  const pets = useGameStore((s) => s.pets);
  const upgradeStat = useGameStore((s) => s.upgradeStat);
  const addCoins = useGameStore((s) => s.addCoins);

  const [selectingFor, setSelectingFor] = useState<string | null>(null);

  const getQty = (key: string) => {
    if (key === 'cryptoBalls') return cryptoBalls;
    return (inventory as any)[key] || 0;
  };

  const applyItem = (itemKey: string, petId: string) => {
    const inv = { ...useGameStore.getState().inventory };
    const qty = (inv as any)[itemKey] || 0;
    if (qty <= 0) return;
    (inv as any)[itemKey] = qty - 1;

    const item = ITEMS.find(i => i.key === itemKey);
    if (!item) return;

    if (item.stat) {
      upgradeStat(petId, item.stat);
      addCoins(50); // refund the 50 coins upgradeStat deducts
    }

    useGameStore.setState({ inventory: inv });
    setSelectingFor(null);
  };

  // Compact mode for map
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ITEMS.map(item => {
          const qty = getQty(item.key);
          if (qty <= 0) return null;
          return (
            <div key={item.key} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: '4px 10px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ fontSize: 14 }}>{item.emoji}</span>
              <span style={{ color: item.color, fontWeight: 700, fontSize: 12 }}>{qty}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Pet selector overlay
  if (selectingFor) {
    const item = ITEMS.find(i => i.key === selectingFor);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
            {item?.emoji} Usar {item?.label} em:
          </span>
          <button onClick={() => setSelectingFor(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✕ Cancelar</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pets.map(pet => (
            <button key={pet.id} onClick={() => applyItem(selectingFor, pet.id)} className="active:scale-[0.98] transition-transform" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#0a0a1a', border: '1px solid #252550', borderRadius: 14,
              padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                <PetSprite pet={pet} size={36} animate={false} showParticles={false} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{pet.name}</p>
                <p style={{ color: '#6b7280', fontSize: 11 }}>Lv.{pet.stats.level} · HP:{pet.stats.maxHp} ATK:{pet.stats.attack} DEF:{pet.stats.defense} SPD:{pet.stats.speed}</p>
              </div>
              <span style={{ color: item?.color, fontSize: 20 }}>{item?.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Normal grid view
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {ITEMS.map(item => {
        const qty = getQty(item.key);
        const canUse = qty > 0 && item.key !== 'cryptoBalls' && pets.length > 0;
        return (
          <div key={item.key} style={{
            background: qty > 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
            border: `1px solid ${qty > 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`,
            borderRadius: 14, padding: '12px 6px', textAlign: 'center',
            opacity: qty > 0 ? 1 : 0.4,
          }}>
            <div style={{ fontSize: 22 }}>{item.emoji}</div>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 18, marginTop: 4 }}>{qty}</div>
            <div style={{ color: '#9ca3af', fontSize: 9, marginTop: 2, lineHeight: 1.2 }}>{item.label}</div>
            {canUse && (
              <button onClick={() => setSelectingFor(item.key)} className="active:scale-95 transition-transform" style={{
                marginTop: 8, padding: '5px 10px', borderRadius: 8,
                background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)',
                color: '#4ade80', fontSize: 10, fontWeight: 700, cursor: 'pointer',
              }}>
                Usar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
