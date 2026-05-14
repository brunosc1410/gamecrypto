import React from 'react';
import { Pet } from '../types/game';

// Simplified inline SVGs for battle (same designs, animations come from parent)
const SVGS: Record<string, () => React.JSX.Element> = {
  Flamarion: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="62" rx="22" ry="20" fill="#ff6b35"/><ellipse cx="50" cy="60" rx="19" ry="17" fill="#ff8c52"/>
    <ellipse cx="50" cy="66" rx="13" ry="11" fill="#ffe0b2"/>
    <circle cx="50" cy="38" r="18" fill="#ff6b35"/><circle cx="50" cy="37" r="15" fill="#ff8c52"/>
    <circle cx="40" cy="23" r="3.5" fill="#ff4500"/><circle cx="60" cy="23" r="3.5" fill="#ff4500"/>
    <ellipse cx="43" cy="35" rx="4.5" ry="5" fill="white"/><ellipse cx="57" cy="35" rx="4.5" ry="5" fill="white"/>
    <circle cx="44" cy="35" r="3" fill="#1a1a2e"/><circle cx="58" cy="35" r="3" fill="#1a1a2e"/>
    <circle cx="45.5" cy="33.5" r="1.2" fill="white"/><circle cx="59.5" cy="33.5" r="1.2" fill="white"/>
    <path d="M 44 43 Q 50 47 56 43" fill="none" stroke="#cc3300" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M 72 58 Q 84 48 80 32 Q 77 42 82 46 Q 78 38 76 48 Q 80 40 77 54 Z" fill="#ff4500"/>
    <path d="M 74 55 Q 82 46 79 36 Q 78 44 80 40 Z" fill="#ffd700"/>
    <ellipse cx="28" cy="58" rx="7" ry="4.5" fill="#ff6b35" transform="rotate(-20 28 58)"/>
    <ellipse cx="72" cy="58" rx="7" ry="4.5" fill="#ff6b35" transform="rotate(20 72 58)"/>
    <ellipse cx="39" cy="80" rx="8" ry="4.5" fill="#e05520"/><ellipse cx="61" cy="80" rx="8" ry="4.5" fill="#e05520"/>
  </svg>),
  Aqualis: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="58" rx="26" ry="23" fill="#1a5276"/><ellipse cx="50" cy="56" rx="23" ry="20" fill="#2980b9"/>
    <path d="M 34 48 Q 50 36 66 48" fill="none" stroke="#1a5276" strokeWidth="2.5"/>
    <ellipse cx="50" cy="64" rx="15" ry="11" fill="#aed6f1"/>
    <circle cx="50" cy="35" r="17" fill="#4a90d9"/><circle cx="50" cy="34" r="14" fill="#5dade2"/>
    <ellipse cx="42" cy="32" rx="4.5" ry="5" fill="white"/><ellipse cx="58" cy="32" rx="4.5" ry="5" fill="white"/>
    <circle cx="43" cy="32" r="3" fill="#1a1a2e"/><circle cx="59" cy="32" r="3" fill="#1a1a2e"/>
    <circle cx="44.5" cy="30.5" r="1.2" fill="white"/><circle cx="60.5" cy="30.5" r="1.2" fill="white"/>
    <path d="M 45 39 Q 50 43 55 39" fill="none" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="27" cy="54" rx="6" ry="4" fill="#4a90d9" transform="rotate(-15 27 54)"/>
    <ellipse cx="73" cy="54" rx="6" ry="4" fill="#4a90d9" transform="rotate(15 73 54)"/>
    <path d="M 26 64 Q 14 56 10 46 Q 16 53 13 44 Q 18 54 22 60 Z" fill="#5dade2"/>
    <ellipse cx="40" cy="80" rx="8" ry="4" fill="#3a7abd"/><ellipse cx="60" cy="80" rx="8" ry="4" fill="#3a7abd"/>
  </svg>),
  Verdex: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="62" rx="21" ry="19" fill="#27ae60"/><ellipse cx="50" cy="60" rx="18" ry="16" fill="#2ecc71"/>
    <ellipse cx="50" cy="65" rx="12" ry="10" fill="#a9dfbf"/>
    <circle cx="50" cy="38" r="17" fill="#27ae60"/><circle cx="50" cy="37" r="14" fill="#2ecc71"/>
    <path d="M 50 22 Q 40 8 50 2 Q 60 8 50 22 Z" fill="#1e8449"/><line x1="50" y1="4" x2="50" y2="22" stroke="#145a32" strokeWidth="1.2"/>
    <path d="M 54 19 Q 65 6 72 14 Q 62 10 54 19 Z" fill="#27ae60"/>
    <ellipse cx="42" cy="35" rx="4" ry="4.5" fill="white"/><ellipse cx="58" cy="35" rx="4" ry="4.5" fill="white"/>
    <circle cx="43" cy="35" r="2.5" fill="#1a1a2e"/><circle cx="59" cy="35" r="2.5" fill="#1a1a2e"/>
    <circle cx="44.5" cy="33.5" r="1" fill="white"/><circle cx="60.5" cy="33.5" r="1" fill="white"/>
    <path d="M 44 42 Q 50 47 56 42" fill="none" stroke="#1e8449" strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="30" cy="58" rx="6" ry="4" fill="#27ae60" transform="rotate(-20 30 58)"/>
    <ellipse cx="70" cy="58" rx="6" ry="4" fill="#27ae60" transform="rotate(20 70 58)"/>
    <ellipse cx="39" cy="80" rx="7" ry="4.5" fill="#219a52"/><ellipse cx="61" cy="80" rx="7" ry="4.5" fill="#219a52"/>
  </svg>),
  Voltix: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="62" rx="19" ry="17" fill="#f1c40f"/><ellipse cx="50" cy="60" rx="16" ry="14" fill="#f9e154"/>
    <ellipse cx="50" cy="65" rx="10" ry="8" fill="#fef9e7"/>
    <circle cx="50" cy="38" r="17" fill="#f1c40f"/><circle cx="50" cy="37" r="14" fill="#f9e154"/>
    <polygon points="35,28 26,6 42,20" fill="#f1c40f"/><polygon points="37,24 30,10 42,18" fill="#f9e154"/>
    <polygon points="65,28 74,6 58,20" fill="#f1c40f"/><polygon points="63,24 70,10 58,18" fill="#f9e154"/>
    <ellipse cx="43" cy="35" rx="4" ry="4.5" fill="white"/><ellipse cx="57" cy="35" rx="4" ry="4.5" fill="white"/>
    <circle cx="44" cy="35" r="2.5" fill="#1a1a2e"/><circle cx="58" cy="35" r="2.5" fill="#1a1a2e"/>
    <circle cx="35" cy="40" r="4" fill="#ff6b35" opacity="0.5"/><circle cx="65" cy="40" r="4" fill="#ff6b35" opacity="0.5"/>
    <polygon points="73,54 82,42 78,50 88,34 81,46 85,36 76,54" fill="#f1c40f" stroke="#d4ac0d" strokeWidth="0.8"/>
    <ellipse cx="41" cy="78" rx="7" ry="4" fill="#d4ac0d"/><ellipse cx="59" cy="78" rx="7" ry="4" fill="#d4ac0d"/>
  </svg>),
  Umbrix: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="62" rx="21" ry="19" fill="#3d1a52"/><ellipse cx="50" cy="60" rx="18" ry="16" fill="#5b2c6f"/>
    <ellipse cx="50" cy="65" rx="10" ry="8" fill="#9b79af"/>
    <circle cx="50" cy="36" r="18" fill="#3d1a52"/><circle cx="50" cy="35" r="15" fill="#5b2c6f"/>
    <polygon points="33,28 20,4 42,18" fill="#3d1a52"/><polygon points="36,23 24,8 42,16" fill="#5b2c6f"/>
    <polygon points="67,28 80,4 58,18" fill="#3d1a52"/><polygon points="64,23 76,8 58,16" fill="#5b2c6f"/>
    <ellipse cx="42" cy="33" rx="5" ry="4" fill="#0d0015"/><ellipse cx="58" cy="33" rx="5" ry="4" fill="#0d0015"/>
    <circle cx="42" cy="33" r="3" fill="#e74c3c"/><circle cx="58" cy="33" r="3" fill="#e74c3c"/>
    <circle cx="43.5" cy="31.5" r="1.2" fill="#ff9999"/><circle cx="59.5" cy="31.5" r="1.2" fill="#ff9999"/>
    <ellipse cx="50" cy="40" rx="6" ry="3.5" fill="#4a2060"/><ellipse cx="50" cy="39" rx="3" ry="1.8" fill="#1a0a2a"/>
    <polygon points="45,42 46.5,47 48,42" fill="#eee"/><polygon points="52,42 53.5,47 55,42" fill="#eee"/>
    <path d="M 74 56 Q 86 48 90 36 Q 84 46 88 34 Q 82 44 80 54 Z" fill="#5b2c6f" opacity="0.7"/>
    <rect x="36" y="74" width="8" height="9" rx="4" fill="#3d1a52"/><rect x="56" y="74" width="8" height="9" rx="4" fill="#3d1a52"/>
  </svg>),
  Glacius: () => (<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="60" rx="25" ry="23" fill="#6a9fb5"/><ellipse cx="50" cy="58" rx="22" ry="20" fill="#93c5d8"/>
    <ellipse cx="50" cy="64" rx="16" ry="13" fill="#d6eaf8"/>
    <circle cx="50" cy="34" r="19" fill="#6a9fb5"/><circle cx="50" cy="33" r="16" fill="#93c5d8"/>
    <circle cx="34" cy="18" r="8" fill="#6a9fb5"/><circle cx="34" cy="18" r="5" fill="#93c5d8"/>
    <circle cx="66" cy="18" r="8" fill="#6a9fb5"/><circle cx="66" cy="18" r="5" fill="#93c5d8"/>
    <ellipse cx="42" cy="31" rx="4.5" ry="5" fill="white"/><ellipse cx="58" cy="31" rx="4.5" ry="5" fill="white"/>
    <circle cx="43" cy="31" r="3" fill="#1a1a2e"/><circle cx="59" cy="31" r="3" fill="#1a1a2e"/>
    <circle cx="44.5" cy="29.5" r="1.2" fill="white"/><circle cx="60.5" cy="29.5" r="1.2" fill="white"/>
    <ellipse cx="50" cy="37" rx="3.5" ry="2.2" fill="#4a90b8"/>
    <path d="M 46 41 Q 50 44 54 41" fill="none" stroke="#4a90b8" strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="50,8 47,17 53,17" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.8"/>
    <polygon points="40,11 38,18 42,18" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.6"/>
    <polygon points="60,11 58,18 62,18" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.6"/>
    <ellipse cx="27" cy="55" rx="7" ry="5" fill="#6a9fb5" transform="rotate(-10 27 55)"/>
    <ellipse cx="73" cy="55" rx="7" ry="5" fill="#6a9fb5" transform="rotate(10 73 55)"/>
    <ellipse cx="38" cy="82" rx="9" ry="5" fill="#6a9fb5"/><ellipse cx="62" cy="82" rx="9" ry="5" fill="#6a9fb5"/>
  </svg>),
};

export function BattleSprite({ pet, className, style }: {
  pet: Pet; className?: string; style?: React.CSSProperties;
}) {
  const Svg = SVGS[pet.name];
  if (Svg) {
    return (
      <div className={className} style={{ ...style, filter: `drop-shadow(0 0 8px ${pet.colors.primary}60) ${style?.filter||''}` }}>
        <Svg />
      </div>
    );
  }
  return (
    <img src={pet.image} alt={pet.name} className={className}
      style={{ ...style, mixBlendMode: 'screen', filter: `drop-shadow(0 0 8px ${pet.colors.primary}60) saturate(1.3) brightness(1.15) ${style?.filter||''}` }} />
  );
}
