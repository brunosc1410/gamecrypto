import { useGameStore } from '../store/gameStore';
import PetSprite from './PetSprite';
import { ELEMENT_EMOJIS } from '../data/pets';

interface Props {
  size?: 'small' | 'medium';
}

export default function ActivePetBadge({ size = 'small' }: Props) {
  const selectedPetId = useGameStore((s) => s.selectedPetId);
  const pets = useGameStore((s) => s.pets);
  const pet = pets.find(p => p.id === selectedPetId);

  if (!pet) return null;

  const isSmall = size === 'small';
  const spriteSize = isSmall ? 28 : 44;
  const expPct = (pet.stats.exp / pet.stats.expToNext) * 100;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: isSmall ? 8 : 12,
      background: '#111128', border: '1px solid #252550',
      borderRadius: isSmall ? 12 : 16, padding: isSmall ? '6px 12px 6px 8px' : '10px 16px 10px 10px',
    }}>
      <div style={{ width: spriteSize, height: spriteSize, flexShrink: 0 }}>
        <PetSprite pet={pet} size={spriteSize} animate={false} showParticles={false} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: isSmall ? 11 : 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pet.name}</span>
          <span style={{ fontSize: isSmall ? 10 : 12 }}>{ELEMENT_EMOJIS[pet.element]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ color: '#facc15', fontWeight: 700, fontSize: isSmall ? 9 : 11 }}>Lv.{pet.stats.level}</span>
          <div style={{ flex: 1, height: isSmall ? 4 : 6, background: '#1f2937', borderRadius: 99, overflow: 'hidden', minWidth: isSmall ? 40 : 60 }}>
            <div style={{ height: '100%', borderRadius: 99, background: '#60a5fa', width: `${expPct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
