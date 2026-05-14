import { AvatarClass, AvatarGender } from '../types/game';
import { getAvatarConfig } from '../data/avatars';

interface Props {
  gender: AvatarGender;
  avatarClass: AvatarClass;
  size?: number;
}

export default function PlayerAvatar({ gender, avatarClass, size = 80 }: Props) {
  const cfg = getAvatarConfig(avatarClass);
  const c = cfg.colors;
  const f = gender === 'female';

  // Skin shading
  const skinShadow = avatarClass === 'zombie' ? '#8aaa86' : avatarClass === 'vampire' ? '#d0c8be' : '#e8c4a8';
  const skinHi = c.skin;

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`sg-${avatarClass}`} cx="45%" cy="35%">
            <stop offset="0%" stopColor={skinHi} />
            <stop offset="100%" stopColor={skinShadow} />
          </radialGradient>
          <linearGradient id={`og-${avatarClass}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.outfit} />
            <stop offset="100%" stopColor={c.accent} />
          </linearGradient>
        </defs>

        {/* Shadow on ground */}
        <ellipse cx="50" cy="126" rx="20" ry="4" fill="rgba(0,0,0,0.25)" />

        {/* === BODY === */}
        {/* Torso */}
        <path d="M 34 62 Q 32 58 36 56 L 64 56 Q 68 58 66 62 L 66 92 Q 66 96 62 96 L 38 96 Q 34 96 34 92 Z" fill={`url(#og-${avatarClass})`} />
        {/* Chest highlight */}
        <path d="M 40 60 L 60 60 L 58 72 L 42 72 Z" fill="rgba(255,255,255,0.08)" />
        {/* Belt */}
        <rect x="33" y="86" width="34" height="6" rx="2" fill={avatarClass === 'mage' ? c.accent : '#4a3828'} />
        <rect x="46" y="85" width="8" height="8" rx="2" fill={avatarClass === 'mage' ? '#f1c40f' : '#b8860b'} />

        {/* Shoulders / Armor pads */}
        {(avatarClass === 'warrior' || avatarClass === 'viking') && (
          <>
            <ellipse cx="30" cy="60" rx="8" ry="6" fill={c.accent} stroke={c.outfit} strokeWidth="1" />
            <ellipse cx="70" cy="60" rx="8" ry="6" fill={c.accent} stroke={c.outfit} strokeWidth="1" />
          </>
        )}

        {/* Cape for mage */}
        {avatarClass === 'mage' && (
          <path d="M 36 58 Q 24 70 28 100 L 34 96 Z M 64 58 Q 76 70 72 100 L 66 96 Z" fill={c.outfit} opacity="0.5" />
        )}

        {/* === ARMS === */}
        <path d={f ? "M 32 62 Q 22 64 20 80 Q 18 86 22 88" : "M 32 62 Q 20 64 18 78 Q 16 86 22 88"} fill={`url(#og-${avatarClass})`} stroke={c.accent} strokeWidth="0.5" />
        <path d={f ? "M 68 62 Q 78 64 80 80 Q 82 86 78 88" : "M 68 62 Q 80 64 82 78 Q 84 86 78 88"} fill={`url(#og-${avatarClass})`} stroke={c.accent} strokeWidth="0.5" />
        {/* Hands */}
        <circle cx="22" cy="88" r="5" fill={`url(#sg-${avatarClass})`} />
        <circle cx="78" cy="88" r="5" fill={`url(#sg-${avatarClass})`} />

        {/* === LEGS === */}
        <rect x="36" y="94" width="12" height="22" rx="4" fill="#2c3040" />
        <rect x="52" y="94" width="12" height="22" rx="4" fill="#2c3040" />
        {/* Boots */}
        <path d="M 34 112 L 34 120 Q 34 122 36 122 L 50 122 Q 52 122 52 120 L 52 112 Z" fill={c.accent} />
        <path d="M 50 112 L 50 120 Q 50 122 52 122 L 66 122 Q 68 122 68 120 L 68 112 Z" fill={c.accent} />
        {/* Boot detail */}
        <rect x="34" y="112" width="18" height="3" fill="rgba(0,0,0,0.15)" rx="1" />
        <rect x="50" y="112" width="18" height="3" fill="rgba(0,0,0,0.15)" rx="1" />

        {/* === NECK === */}
        <rect x="43" y="50" width="14" height="10" rx="4" fill={`url(#sg-${avatarClass})`} />

        {/* === HEAD === */}
        <circle cx="50" cy="34" r="20" fill={`url(#sg-${avatarClass})`} />
        {/* Face contour shadow */}
        <ellipse cx="50" cy="38" rx="16" ry="12" fill="rgba(0,0,0,0.04)" />

        {/* === HAIR === */}
        {f ? (
          <>
            {/* Female: long flowing hair */}
            <ellipse cx="50" cy="24" rx="22" ry="16" fill={c.hair} />
            {/* Side hair strands */}
            <path d="M 28 24 Q 26 40 24 58 Q 22 64 26 62 Q 28 56 30 40 Z" fill={c.hair} />
            <path d="M 72 24 Q 74 40 76 58 Q 78 64 74 62 Q 72 56 70 40 Z" fill={c.hair} />
            {/* Hair shine */}
            <ellipse cx="42" cy="20" rx="6" ry="3" fill="rgba(255,255,255,0.12)" transform="rotate(-15 42 20)" />
            {/* Bangs */}
            <path d="M 34 26 Q 38 18 44 22 Q 40 16 34 26 Z" fill={c.hair} />
            <path d="M 66 26 Q 62 18 56 22 Q 60 16 66 26 Z" fill={c.hair} />
          </>
        ) : (
          <>
            {/* Male: shorter styled hair */}
            <ellipse cx="50" cy="22" rx="21" ry="14" fill={c.hair} />
            {/* Hair texture lines */}
            <path d="M 34 20 Q 40 14 50 16 Q 60 14 66 20" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            {/* Hair shine */}
            <ellipse cx="44" cy="18" rx="5" ry="2.5" fill="rgba(255,255,255,0.1)" transform="rotate(-10 44 18)" />

            {avatarClass === 'viking' && (
              <>
                {/* Viking braids */}
                <rect x="26" y="28" width="5" height="22" rx="2.5" fill={c.hair} />
                <rect x="69" y="28" width="5" height="22" rx="2.5" fill={c.hair} />
                {/* Beard */}
                <path d="M 38 44 Q 40 56 50 60 Q 60 56 62 44" fill={c.hair} />
                <path d="M 42 48 Q 44 54 50 56 Q 56 54 58 48" fill="rgba(0,0,0,0.08)" />
              </>
            )}
            {avatarClass === 'dwarf' && (
              <>
                {/* Big bushy beard */}
                <path d="M 34 42 Q 32 58 42 64 Q 50 68 58 64 Q 68 58 66 42" fill={c.hair} />
                <path d="M 38 46 Q 36 56 44 60 Q 50 62 56 60 Q 64 56 62 46" fill="rgba(0,0,0,0.06)" />
              </>
            )}
          </>
        )}

        {/* === EYES === */}
        <ellipse cx="42" cy="34" rx="4.5" ry="5" fill="white" />
        <ellipse cx="58" cy="34" rx="4.5" ry="5" fill="white" />
        {/* Iris */}
        <circle cx="43" cy="34" r="3" fill={avatarClass === 'zombie' ? '#6abf40' : avatarClass === 'vampire' ? '#c0392b' : avatarClass === 'elf' ? '#27ae60' : '#3a2818'} />
        <circle cx="59" cy="34" r="3" fill={avatarClass === 'zombie' ? '#6abf40' : avatarClass === 'vampire' ? '#c0392b' : avatarClass === 'elf' ? '#27ae60' : '#3a2818'} />
        {/* Pupil */}
        <circle cx="43.5" cy="34" r="1.5" fill="#0a0a0a" />
        <circle cx="59.5" cy="34" r="1.5" fill="#0a0a0a" />
        {/* Eye shine */}
        <circle cx="44.5" cy="32.5" r="1.2" fill="white" />
        <circle cx="60.5" cy="32.5" r="1.2" fill="white" />
        {/* Eyebrows */}
        <path d="M 37 28 Q 42 26 47 28" fill="none" stroke={c.hair} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 53 28 Q 58 26 63 28" fill="none" stroke={c.hair} strokeWidth="1.8" strokeLinecap="round" />
        {/* Eyelashes for female */}
        {f && (
          <>
            <line x1="37" y1="32" x2="35" y2="30" stroke={c.hair} strokeWidth="0.8" />
            <line x1="63" y1="32" x2="65" y2="30" stroke={c.hair} strokeWidth="0.8" />
          </>
        )}

        {/* Nose */}
        <path d="M 49 38 Q 50 40 51 38" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round" />

        {/* Mouth */}
        {avatarClass === 'vampire' ? (
          <>
            <path d="M 44 44 Q 50 48 56 44" fill="none" stroke="#8B0000" strokeWidth="1.3" strokeLinecap="round" />
            {/* Fangs */}
            <polygon points="44.5,44 45.5,48 46.5,44" fill="white" />
            <polygon points="53.5,44 54.5,48 55.5,44" fill="white" />
          </>
        ) : avatarClass === 'zombie' ? (
          <path d="M 44 44 Q 48 42 50 44 Q 52 42 56 44" fill="none" stroke="#5d4e37" strokeWidth="1.3" />
        ) : (
          <path d="M 44 44 Q 50 48 56 44" fill={f ? '#e88' : 'none'} stroke="#c0887a" strokeWidth="1" strokeLinecap="round" />
        )}

        {/* === CLASS ITEMS === */}
        {avatarClass === 'warrior' && (
          <>
            {/* Sword on back */}
            <rect x="16" y="44" width="4" height="44" rx="2" fill="#bdc3c7" transform="rotate(-10 18 66)" />
            <rect x="14" y="42" width="8" height="6" rx="2" fill="#d4a017" transform="rotate(-10 18 45)" />
          </>
        )}
        {avatarClass === 'archer' && (
          <>
            {/* Bow */}
            <path d="M 80 46 Q 88 66 80 86" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="46" x2="80" y2="86" stroke="#a0a0a0" strokeWidth="0.8" />
            {/* Quiver */}
            <rect x="72" y="56" width="6" height="24" rx="2" fill="#6b4226" />
            <line x1="73" y1="56" x2="73" y2="58" stroke="#bdc3c7" strokeWidth="1.5" />
            <line x1="75" y1="56" x2="75" y2="59" stroke="#bdc3c7" strokeWidth="1.5" />
            <line x1="77" y1="56" x2="77" y2="57" stroke="#bdc3c7" strokeWidth="1.5" />
          </>
        )}
        {avatarClass === 'mage' && (
          <>
            {/* Wizard hat */}
            <polygon points="50,0 32,26 68,26" fill={c.outfit} />
            <ellipse cx="50" cy="26" rx="20" ry="5" fill={c.accent} />
            {/* Star */}
            <polygon points="50,6 48,12 42,12 47,16 45,22 50,18 55,22 53,16 58,12 52,12" fill="#f1c40f" />
            {/* Staff in hand */}
            <rect x="76" y="50" width="3" height="46" rx="1.5" fill="#8B4513" />
            <circle cx="77.5" cy="48" r="6" fill={c.accent} opacity="0.7" />
            <circle cx="77.5" cy="48" r="3" fill="#f1c40f" />
          </>
        )}
        {avatarClass === 'elf' && (
          <>
            {/* Pointed ears */}
            <path d="M 28 30 L 16 18 L 30 34 Z" fill={skinHi} />
            <path d="M 72 30 L 84 18 L 70 34 Z" fill={skinHi} />
            {/* Ear inner */}
            <path d="M 29 31 L 20 22 L 30 33 Z" fill={skinShadow} />
            <path d="M 71 31 L 80 22 L 70 33 Z" fill={skinShadow} />
            {/* Circlet */}
            <path d="M 32 24 Q 50 18 68 24" fill="none" stroke="#f1c40f" strokeWidth="1.5" />
            <circle cx="50" cy="20" r="2.5" fill="#2ecc71" stroke="#f1c40f" strokeWidth="1" />
          </>
        )}
        {avatarClass === 'viking' && (
          <>
            {/* Helmet with horns */}
            <ellipse cx="50" cy="20" rx="22" ry="10" fill="#8a8a8a" />
            <ellipse cx="50" cy="22" rx="20" ry="6" fill="#a0a0a0" />
            {/* Horns */}
            <path d="M 28 20 Q 18 8 14 2" fill="none" stroke="#d4c49a" strokeWidth="4" strokeLinecap="round" />
            <path d="M 72 20 Q 82 8 86 2" fill="none" stroke="#d4c49a" strokeWidth="4" strokeLinecap="round" />
            {/* Shield */}
            <circle cx="18" cy="78" r="12" fill={c.accent} stroke="#5d4e37" strokeWidth="2" />
            <line x1="18" y1="66" x2="18" y2="90" stroke="#5d4e37" strokeWidth="1.5" />
            <line x1="6" y1="78" x2="30" y2="78" stroke="#5d4e37" strokeWidth="1.5" />
          </>
        )}
        {avatarClass === 'zombie' && (
          <>
            {/* Torn clothes patches */}
            <path d="M 34 80 L 32 88 L 36 86 Z" fill="#3a3020" />
            <path d="M 64 75 L 68 82 L 66 78 Z" fill="#3a3020" />
            {/* Stitches on face */}
            <line x1="46" y1="38" x2="46" y2="44" stroke="#4a4a2a" strokeWidth="0.8" />
            <line x1="44" y1="39" x2="48" y2="39" stroke="#4a4a2a" strokeWidth="0.6" />
            <line x1="44" y1="41" x2="48" y2="41" stroke="#4a4a2a" strokeWidth="0.6" />
            <line x1="44" y1="43" x2="48" y2="43" stroke="#4a4a2a" strokeWidth="0.6" />
          </>
        )}
        {avatarClass === 'dwarf' && (
          <>
            {/* Helmet */}
            <ellipse cx="50" cy="20" rx="20" ry="8" fill="#7f8c8d" />
            {/* Axe */}
            <rect x="78" y="54" width="3" height="38" rx="1.5" fill="#6b4226" />
            <path d="M 76 52 Q 72 46 76 40 L 84 40 Q 88 46 84 52 Z" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="1" />
          </>
        )}
      </svg>
    </div>
  );
}
