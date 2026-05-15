// Verdex — Grass element starter, pixel art Game Boy style
// Small plant dinosaur with leaf on head, bulb on back
export default function VerdexCustomSprite() {
  const p = 2; // pixel size
  return (
    <svg viewBox="0 0 64 64" style={{ width: '100%', height: '100%' }}>
      {/* Leaf on head */}
      <rect x={28*p/2} y={2*p} width={p*2} height={p} fill="#1a6b30" />
      <rect x={26*p/2} y={3*p} width={p*4} height={p} fill="#1a6b30" />
      <rect x={24*p/2} y={4*p} width={p*2} height={p} fill="#22a048" />
      <rect x={28*p/2} y={4*p} width={p*2} height={p} fill="#22a048" />
      <rect x={26*p/2} y={5*p} width={p*4} height={p} fill="#22a048" />

      {/* Head */}
      <rect x={22*p/2} y={6*p} width={p*10} height={p} fill="#2ecc71" />
      <rect x={20*p/2} y={7*p} width={p*14} height={p} fill="#2ecc71" />
      <rect x={18*p/2} y={8*p} width={p*18} height={p*2} fill="#2ecc71" />
      <rect x={18*p/2} y={10*p} width={p*18} height={p*2} fill="#27ae60" />

      {/* Eyes */}
      <rect x={22*p/2} y={8*p} width={p*3} height={p*2} fill="white" />
      <rect x={30*p/2} y={8*p} width={p*3} height={p*2} fill="white" />
      <rect x={23*p/2} y={9*p} width={p*2} height={p} fill="#1a1a2e" />
      <rect x={31*p/2} y={9*p} width={p*2} height={p} fill="#1a1a2e" />

      {/* Mouth */}
      <rect x={26*p/2} y={11*p} width={p*4} height={p} fill="#1e8449" />

      {/* Body */}
      <rect x={16*p/2} y={12*p} width={p*22} height={p} fill="#2ecc71" />
      <rect x={14*p/2} y={13*p} width={p*26} height={p*2} fill="#2ecc71" />
      <rect x={14*p/2} y={15*p} width={p*26} height={p*3} fill="#27ae60" />

      {/* Belly */}
      <rect x={20*p/2} y={14*p} width={p*14} height={p*3} fill="#a9dfbf" />

      {/* Back bulb/seed */}
      <rect x={36*p/2} y={12*p} width={p*4} height={p*3} fill="#1e8449" />
      <rect x={38*p/2} y={11*p} width={p*2} height={p} fill="#1a6b30" />

      {/* Front legs */}
      <rect x={16*p/2} y={18*p} width={p*4} height={p*3} fill="#219a52" />
      <rect x={34*p/2} y={18*p} width={p*4} height={p*3} fill="#219a52" />

      {/* Back legs */}
      <rect x={20*p/2} y={18*p} width={p*4} height={p*2} fill="#219a52" />
      <rect x={30*p/2} y={18*p} width={p*4} height={p*2} fill="#219a52" />

      {/* Feet */}
      <rect x={15*p/2} y={21*p} width={p*6} height={p} fill="#145a32" />
      <rect x={33*p/2} y={21*p} width={p*6} height={p} fill="#145a32" />

      {/* Tail */}
      <rect x={12*p/2} y={16*p} width={p*2} height={p*2} fill="#27ae60" />
      <rect x={10*p/2} y={17*p} width={p*2} height={p*2} fill="#2ecc71" />

      {/* Shadow */}
      <rect x={14*p/2} y={22*p} width={p*26} height={p} fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}
