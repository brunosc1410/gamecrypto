// Dragon-style starter sprites — stronger outlines, horns, wings and claws

function eyePair(iris: string) {
  return (
    <>
      <ellipse cx="41" cy="36" rx="4.5" ry="5" fill="white" />
      <ellipse cx="59" cy="36" rx="4.5" ry="5" fill="white" />
      <ellipse cx="42" cy="36" rx="2.4" ry="3.2" fill={iris} />
      <ellipse cx="60" cy="36" rx="2.4" ry="3.2" fill={iris} />
      <ellipse cx="42.3" cy="36" rx="0.8" ry="2" fill="#0b0b10" />
      <ellipse cx="60.3" cy="36" rx="0.8" ry="2" fill="#0b0b10" />
      <circle cx="43.2" cy="34.5" r="0.9" fill="white" />
      <circle cx="61.2" cy="34.5" r="0.9" fill="white" />
    </>
  );
}

function shadow() {
  return <ellipse cx="50" cy="92" rx="18" ry="4" fill="rgba(0,0,0,0.15)" />;
}

export function FlamarionDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      {/* Tail flame */}
      <path d="M73 59 Q88 52 88 38 Q82 46 86 50 Q80 45 77 53 Q83 49 79 62 Z" fill="#ff4500" stroke="#b62500" strokeWidth="2" strokeLinejoin="round" />
      <path d="M77 55 Q84 48 82 42 Q80 47 81 44 Z" fill="#ffd700" />
      {/* Wings */}
      <path d="M24 50 Q10 42 12 32 Q19 38 28 42" fill="#c74a25" stroke="#8d2d12" strokeWidth="2" strokeLinecap="round" />
      <path d="M76 50 Q90 42 88 32 Q81 38 72 42" fill="#c74a25" stroke="#8d2d12" strokeWidth="2" strokeLinecap="round" />
      {/* Body */}
      <path d="M24 63 Q23 50 32 45 L68 45 Q77 50 76 63 Q74 80 50 82 Q26 80 24 63 Z" fill="#ff6b35" stroke="#b83a15" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#ffe0b2" />
      {/* Legs */}
      <path d="M31 77 Q26 82 27 88" fill="none" stroke="#b83a15" strokeWidth="7" strokeLinecap="round" />
      <path d="M69 77 Q74 82 73 88" fill="none" stroke="#b83a15" strokeWidth="7" strokeLinecap="round" />
      {/* Arms */}
      <path d="M25 55 Q18 57 16 63" fill="none" stroke="#d85b2c" strokeWidth="6" strokeLinecap="round" />
      <path d="M75 55 Q82 57 84 63" fill="none" stroke="#d85b2c" strokeWidth="6" strokeLinecap="round" />
      {/* Head */}
      <path d="M29 31 Q30 18 42 14 L58 14 Q70 18 71 31 Q70 45 50 47 Q30 45 29 31 Z" fill="#ff6b35" stroke="#b83a15" strokeWidth="3" />
      {/* Snout */}
      <ellipse cx="50" cy="41" rx="7" ry="4.5" fill="#ff9c73" stroke="#b83a15" strokeWidth="1.6" />
      <circle cx="47" cy="40" r="1" fill="#8d2d12" />
      <circle cx="53" cy="40" r="1" fill="#8d2d12" />
      {/* Horns / crest */}
      <path d="M35 18 L30 7 L39 13 Z" fill="#cf2d1d" stroke="#8d1408" strokeWidth="1.5" />
      <path d="M65 18 L70 7 L61 13 Z" fill="#cf2d1d" stroke="#8d1408" strokeWidth="1.5" />
      <path d="M50 14 L47 4 L53 4 Z" fill="#ff4500" />
      {eyePair('#6b220f')}
      <path d="M44 47 Q50 51 56 47" fill="none" stroke="#8d2d12" strokeWidth="2" strokeLinecap="round" />
      <polygon points="47,47 48,50 49,47" fill="white" />
      <polygon points="51,47 52,50 53,47" fill="white" />
    </svg>
  );
}

export function AqualisDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      {/* Tail fin */}
      <path d="M24 60 Q8 56 10 44 Q17 50 24 52" fill="#7fd8ff" stroke="#2d7ba6" strokeWidth="2" strokeLinecap="round" />
      {/* Wings/fins */}
      <path d="M24 49 Q12 44 14 34 Q20 39 28 42" fill="#9bdfff" stroke="#3e8fba" strokeWidth="2" />
      <path d="M76 49 Q88 44 86 34 Q80 39 72 42" fill="#9bdfff" stroke="#3e8fba" strokeWidth="2" />
      {/* Body */}
      <path d="M24 62 Q24 50 32 45 L68 45 Q76 49 76 62 Q74 79 50 81 Q26 79 24 62 Z" fill="#4a90d9" stroke="#245f98" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#d8f3ff" />
      {/* Legs */}
      <path d="M33 77 Q28 82 29 88" fill="none" stroke="#3d7fc0" strokeWidth="7" strokeLinecap="round" />
      <path d="M67 77 Q72 82 71 88" fill="none" stroke="#3d7fc0" strokeWidth="7" strokeLinecap="round" />
      {/* Head */}
      <path d="M30 31 Q31 18 43 14 L57 14 Q69 18 70 31 Q69 44 50 46 Q31 44 30 31 Z" fill="#5dade2" stroke="#2d7ba6" strokeWidth="3" />
      {/* Fins */}
      <path d="M30 22 Q20 16 18 8 Q24 12 31 15" fill="#9bdfff" stroke="#5dade2" strokeWidth="1.2" />
      <path d="M70 22 Q80 16 82 8 Q76 12 69 15" fill="#9bdfff" stroke="#5dade2" strokeWidth="1.2" />
      {/* Snout */}
      <ellipse cx="50" cy="41" rx="7" ry="4.5" fill="#bde9ff" stroke="#2d7ba6" strokeWidth="1.5" />
      <circle cx="47" cy="40" r="1" fill="#245f98" />
      <circle cx="53" cy="40" r="1" fill="#245f98" />
      {eyePair('#155a8a')}
      <path d="M45 47 Q50 50 55 47" fill="none" stroke="#2d7ba6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function VerdexDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      <path d="M24 60 Q10 55 12 43 Q18 49 25 51" fill="#2f934c" stroke="#1c6331" strokeWidth="2" />
      <path d="M24 49 Q12 44 14 35 Q20 40 28 43" fill="#3fb75f" stroke="#1c6331" strokeWidth="2" />
      <path d="M76 49 Q88 44 86 35 Q80 40 72 43" fill="#3fb75f" stroke="#1c6331" strokeWidth="2" />
      <path d="M24 62 Q24 50 32 45 L68 45 Q76 49 76 62 Q74 79 50 81 Q26 79 24 62 Z" fill="#27ae60" stroke="#1c6331" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#d1f3d7" />
      <path d="M33 77 Q28 82 29 88" fill="none" stroke="#22844a" strokeWidth="7" strokeLinecap="round" />
      <path d="M67 77 Q72 82 71 88" fill="none" stroke="#22844a" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 31 Q31 18 43 14 L57 14 Q69 18 70 31 Q69 44 50 46 Q31 44 30 31 Z" fill="#2ecc71" stroke="#1c6331" strokeWidth="3" />
      <path d="M50 15 Q43 4 50 0 Q57 4 50 15 Z" fill="#1e8449" stroke="#145a32" strokeWidth="1.3" />
      <path d="M43 18 Q34 10 30 14 Q37 14 43 19 Z" fill="#2a9d53" />
      <path d="M57 18 Q66 10 70 14 Q63 14 57 19 Z" fill="#2a9d53" />
      <ellipse cx="50" cy="41" rx="7" ry="4.5" fill="#bcebc5" stroke="#1c6331" strokeWidth="1.5" />
      <circle cx="47" cy="40" r="1" fill="#145a32" />
      <circle cx="53" cy="40" r="1" fill="#145a32" />
      {eyePair('#1c6331')}
      <path d="M44 47 Q50 51 56 47" fill="none" stroke="#1c6331" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function VoltixDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      <path d="M24 49 Q11 43 14 33 Q21 39 29 42" fill="#ffd84f" stroke="#c89b12" strokeWidth="2" />
      <path d="M76 49 Q89 43 86 33 Q79 39 71 42" fill="#ffd84f" stroke="#c89b12" strokeWidth="2" />
      <path d="M24 62 Q24 50 32 45 L68 45 Q76 49 76 62 Q74 79 50 81 Q26 79 24 62 Z" fill="#f1c40f" stroke="#b58a0d" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#fff4c4" />
      <path d="M33 77 Q28 82 29 88" fill="none" stroke="#c89b12" strokeWidth="7" strokeLinecap="round" />
      <path d="M67 77 Q72 82 71 88" fill="none" stroke="#c89b12" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 31 Q31 18 43 14 L57 14 Q69 18 70 31 Q69 44 50 46 Q31 44 30 31 Z" fill="#f9e154" stroke="#b58a0d" strokeWidth="3" />
      <path d="M35 18 L28 4 L41 15 Z" fill="#f1c40f" stroke="#b58a0d" strokeWidth="1.2" />
      <path d="M65 18 L72 4 L59 15 Z" fill="#f1c40f" stroke="#b58a0d" strokeWidth="1.2" />
      <circle cx="25" cy="41" r="3.5" fill="#ff7043" opacity="0.65" />
      <circle cx="75" cy="41" r="3.5" fill="#ff7043" opacity="0.65" />
      <ellipse cx="50" cy="41" rx="7" ry="4.5" fill="#fff1b0" stroke="#b58a0d" strokeWidth="1.5" />
      {eyePair('#7a4e00')}
      <path d="M46 47 Q50 50 54 47" fill="none" stroke="#b58a0d" strokeWidth="2" strokeLinecap="round" />
      <path d="M77 58 L86 50 L82 56 L91 47 L84 57 L88 54 L80 61 Z" fill="#f1c40f" stroke="#b58a0d" strokeWidth="1.2" />
    </svg>
  );
}

export function UmbrixDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      <path d="M24 49 Q12 42 14 33 Q21 38 29 42" fill="#5b2c6f" stroke="#2a0f36" strokeWidth="2" />
      <path d="M76 49 Q88 42 86 33 Q79 38 71 42" fill="#5b2c6f" stroke="#2a0f36" strokeWidth="2" />
      <path d="M24 62 Q24 50 32 45 L68 45 Q76 49 76 62 Q74 79 50 81 Q26 79 24 62 Z" fill="#4a235a" stroke="#2a0f36" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#bb8fce" />
      <path d="M33 77 Q28 82 29 88" fill="none" stroke="#341244" strokeWidth="7" strokeLinecap="round" />
      <path d="M67 77 Q72 82 71 88" fill="none" stroke="#341244" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 31 Q31 17 43 13 L57 13 Q69 17 70 31 Q69 44 50 46 Q31 44 30 31 Z" fill="#5b2c6f" stroke="#2a0f36" strokeWidth="3" />
      <path d="M35 18 L27 4 L40 15 Z" fill="#3d1a52" stroke="#250d2f" strokeWidth="1.2" />
      <path d="M65 18 L73 4 L60 15 Z" fill="#3d1a52" stroke="#250d2f" strokeWidth="1.2" />
      <ellipse cx="50" cy="41" rx="7" ry="4.5" fill="#74438a" stroke="#2a0f36" strokeWidth="1.5" />
      <ellipse cx="40" cy="34" rx="5" ry="4" fill="#120018" />
      <ellipse cx="60" cy="34" rx="5" ry="4" fill="#120018" />
      <circle cx="41" cy="34" r="3" fill="#e74c3c" />
      <circle cx="61" cy="34" r="3" fill="#e74c3c" />
      <circle cx="42.5" cy="32.5" r="1" fill="#ffb3ab" />
      <circle cx="62.5" cy="32.5" r="1" fill="#ffb3ab" />
      <path d="M46 47 Q50 49 54 47" fill="none" stroke="#2a0f36" strokeWidth="2" strokeLinecap="round" />
      <polygon points="45,47 46,50 47,47" fill="white" />
      <polygon points="53,47 54,50 55,47" fill="white" />
      <path d="M76 58 Q88 52 90 42 Q84 50 78 50 Z" fill="#5b2c6f" opacity="0.85" />
    </svg>
  );
}

export function GlaciusDragon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {shadow()}
      <path d="M24 49 Q12 42 14 33 Q21 38 29 42" fill="#aed6f1" stroke="#4f7b90" strokeWidth="2" />
      <path d="M76 49 Q88 42 86 33 Q79 38 71 42" fill="#aed6f1" stroke="#4f7b90" strokeWidth="2" />
      <path d="M24 62 Q24 50 32 45 L68 45 Q76 49 76 62 Q74 79 50 81 Q26 79 24 62 Z" fill="#7aa9bc" stroke="#4f7b90" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="13" ry="11" fill="#e6f4fa" />
      <path d="M33 77 Q28 82 29 88" fill="none" stroke="#5a8ea0" strokeWidth="7" strokeLinecap="round" />
      <path d="M67 77 Q72 82 71 88" fill="none" stroke="#5a8ea0" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 31 Q31 17 43 13 L57 13 Q69 17 70 31 Q69 44 50 46 Q31 44 30 31 Z" fill="#9fcde0" stroke="#4f7b90" strokeWidth="3" />
      <path d="M50 15 L47 4 L53 4 Z" fill="#d6f1ff" stroke="#85c1e9" strokeWidth="1" />
      <path d="M42 17 L40 8 L44 8 Z" fill="#d6f1ff" stroke="#85c1e9" strokeWidth="1" />
      <path d="M58 17 L56 8 L60 8 Z" fill="#d6f1ff" stroke="#85c1e9" strokeWidth="1" />
      {eyePair('#2f5f77')}
      <ellipse cx="50" cy="41" rx="5.5" ry="3.5" fill="#d9f4ff" stroke="#4f7b90" strokeWidth="1.4" />
      <path d="M46 47 Q50 50 54 47" fill="none" stroke="#4f7b90" strokeWidth="2" strokeLinecap="round" />
      <path d="M76 58 Q88 54 88 44 Q82 50 76 50 Z" fill="#d6f1ff" opacity="0.8" />
    </svg>
  );
}
