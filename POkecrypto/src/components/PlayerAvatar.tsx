import { AvatarClass, AvatarGender } from '../types/game';
import { getAvatarConfig } from '../data/avatars';

interface Props {
  gender: AvatarGender;
  avatarClass: AvatarClass;
  size?: number;
  direction?: 'down' | 'up' | 'left' | 'right';
}

export default function PlayerAvatar({ gender, avatarClass, size = 48, direction = 'down' }: Props) {
  const cfg = getAvatarConfig(avatarClass);
  const c = cfg.colors;
  const isFemale = gender === 'female';
  const s = size;

  return (
    <svg viewBox="0 0 32 40" width={s} height={s * 1.25} style={{ display: 'block' }}>
      {/* Hair */}
      <ellipse cx="16" cy="8" rx="8" ry="7" fill={c.hair} />
      {isFemale && (
        <>
          <ellipse cx="8" cy="12" rx="3" ry="6" fill={c.hair} />
          <ellipse cx="24" cy="12" rx="3" ry="6" fill={c.hair} />
        </>
      )}
      {/* Head */}
      <ellipse cx="16" cy="10" rx="6.5" ry="6" fill={c.skin} />
      {/* Eyes */}
      {direction !== 'up' && (
        <>
          <circle cx="13" cy="10" r="1.5" fill="#1a1a2e" />
          <circle cx="19" cy="10" r="1.5" fill="#1a1a2e" />
          <circle cx="13.5" cy="9.5" r="0.5" fill="white" />
          <circle cx="19.5" cy="9.5" r="0.5" fill="white" />
        </>
      )}
      {/* Mouth */}
      {direction === 'down' && (
        <ellipse cx="16" cy="13" rx="2" ry="0.8" fill={c.hair} opacity="0.4" />
      )}
      {/* Body */}
      <rect x="8" y="16" width="16" height="12" rx="3" fill={c.outfit} />
      <rect x="10" y="17" width="12" height="4" rx="2" fill={c.accent} opacity="0.4" />
      {/* Arms */}
      <rect x="4" y="17" width="4" height="9" rx="2" fill={c.skin} />
      <rect x="24" y="17" width="4" height="9" rx="2" fill={c.skin} />
      {/* Legs */}
      <rect x="10" y="28" width="5" height="8" rx="2" fill={c.outfit} />
      <rect x="17" y="28" width="5" height="8" rx="2" fill={c.outfit} />
      {/* Shoes */}
      <rect x="9" y="34" width="6" height="4" rx="2" fill="#2c2c54" />
      <rect x="17" y="34" width="6" height="4" rx="2" fill="#2c2c54" />
      {/* Class-specific accessories */}
      {avatarClass === 'warrior' && (
        <rect x="26" y="14" width="3" height="14" rx="1" fill="#999" />
      )}
      {avatarClass === 'mage' && (
        <circle cx="28" cy="14" r="3" fill={c.accent} opacity="0.7" />
      )}
      {avatarClass === 'viking' && (
        <>
          <ellipse cx="8" cy="6" rx="3" ry="2" fill={c.accent} />
          <ellipse cx="24" cy="6" rx="3" ry="2" fill={c.accent} />
        </>
      )}
    </svg>
  );
}
