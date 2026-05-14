export default function VipIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 90" style={{ width: size, height: size * 0.9 }}>
      <defs>
        <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#e69500" />
        </linearGradient>
        <linearGradient id="crownDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a017" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      {/* Base band */}
      <rect x="12" y="58" width="76" height="22" rx="4" fill="url(#crownDark)" />
      <rect x="14" y="60" width="72" height="18" rx="3" fill="url(#crownGold)" />
      {/* Crown points */}
      <path d="M 12 58 L 5 20 L 28 40 L 50 8 L 72 40 L 95 20 L 88 58 Z" fill="url(#crownGold)" stroke="#b8860b" strokeWidth="2" />
      {/* Inner shadow */}
      <path d="M 18 55 L 12 25 L 30 40 L 50 15 L 70 40 L 88 25 L 82 55 Z" fill="rgba(255,255,255,0.15)" />
      {/* Center jewel */}
      <circle cx="50" cy="40" r="8" fill="#dc2626" stroke="#b8860b" strokeWidth="2" />
      <ellipse cx="48" cy="37" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
      {/* Side jewels */}
      <circle cx="28" cy="48" r="5" fill="#2563eb" stroke="#b8860b" strokeWidth="1.5" />
      <circle cx="72" cy="48" r="5" fill="#2563eb" stroke="#b8860b" strokeWidth="1.5" />
      {/* Top dots */}
      <circle cx="5" cy="18" r="4" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" />
      <circle cx="50" cy="6" r="4" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" />
      <circle cx="95" cy="18" r="4" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" />
      {/* VIP text on band */}
      <text x="50" y="74" textAnchor="middle" fill="#5a3a00" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif">VIP</text>
    </svg>
  );
}
