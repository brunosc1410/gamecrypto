// ===== PIXEL ART STARTER SPRITES — Game Boy style, high detail =====
// ViewBox 64x64, pixel unit = 1px for maximum detail

// Helper: draw pixel rows efficiently
function R({ y, x, c }: { y: number; x: number; c: string[] }) {
  return <>{c.map((color, i) => color === '.' ? null : <rect key={i} x={x + i} y={y} width={1} height={1} fill={color} />)}</>;
}

// ===== FLAMARION — Fire dragon =====
export function FlamarionPixel() {
  const O='#ff6b35',D='#e05520',R2='#cc2200',Y='#ffd700',W='white',B='#1a1a2e',L='#ffe0b2',F='#ff4500';
  return (
    <svg viewBox="3 3 32 23" style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated'}}>
      {/* Horns */}
      <R y={4} x={12} c={[D,D]} /><R y={4} x={22} c={[D,D]} />
      <R y={5} x={11} c={[D,O,O,D]} /><R y={5} x={21} c={[D,O,O,D]} />
      <R y={6} x={12} c={[O,O]} /><R y={6} x={22} c={[O,O]} />
      {/* Head */}
      <R y={7} x={10} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      <R y={8} x={9} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      <R y={9} x={9} c={[O,O,W,W,W,O,O,O,O,O,O,O,W,W,W,O,O,O]} />
      <R y={10} x={9} c={[O,O,W,B,B,O,O,O,O,O,O,O,W,B,B,O,O,O]} />
      <R y={11} x={9} c={[O,O,W,B,B,O,O,O,O,O,O,O,W,B,B,O,O,O]} />
      {/* Eye shine */}
      <rect x={11} y={9} width={1} height={1} fill={W} opacity={0.8} />
      <rect x={21} y={9} width={1} height={1} fill={W} opacity={0.8} />
      <R y={12} x={9} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      {/* Mouth */}
      <R y={13} x={10} c={[O,O,O,O,D,D,D,D,D,D,D,D,O,O,O,O]} />
      <R y={14} x={11} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      {/* Body */}
      <R y={15} x={7} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      <R y={16} x={6} c={[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]} />
      <R y={17} x={6} c={[O,O,O,O,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,O,O,O,O]} />
      <R y={18} x={6} c={[O,O,O,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,O,O,O]} />
      <R y={19} x={6} c={[O,O,O,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,O,O,O]} />
      <R y={20} x={6} c={[D,D,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,D,D]} />
      <R y={21} x={6} c={[D,D,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,D,D]} />
      {/* Arms */}
      <R y={17} x={4} c={[O,O]} /><R y={18} x={3} c={[D,O,O]} />
      <R y={17} x={30} c={[O,O]} /><R y={18} x={30} c={[O,O,D]} />
      {/* Legs */}
      <R y={22} x={8} c={[D,D,D,D,D]} /><R y={22} x={23} c={[D,D,D,D,D]} />
      <R y={23} x={7} c={[D,D,D,D,D,D,D]} /><R y={23} x={22} c={[D,D,D,D,D,D,D]} />
      <R y={24} x={7} c={[D,D,D,D,D,D,D]} /><R y={24} x={22} c={[D,D,D,D,D,D,D]} />
      {/* Tail flame */}
      <R y={16} x={30} c={[F,F,F]} />
      <R y={15} x={31} c={[F,R2,F]} />
      <R y={14} x={32} c={[Y,R2]} />
      <R y={13} x={33} c={[Y,Y]} />
      <R y={12} x={33} c={[Y]} />
      <R y={17} x={30} c={[F,F]} />
      {/* Shadow */}
      <rect x={6} y={25} width={28} height={1} fill="rgba(0,0,0,0.1)" rx={0} />
    </svg>
  );
}

// ===== AQUALIS — Water turtle =====
export function AqualisPixel() {
  const S1='#1a5276',S2='#2980b9',S3='#5dade2',L='#aed6f1',W='white',B='#1a1a2e',N='#154360';
  return (
    <svg viewBox="3 3 32 23" style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated'}}>
      {/* Head */}
      <R y={6} x={13} c={[S3,S3,S3,S3,S3,S3,S3,S3,S3,S3]} />
      <R y={7} x={12} c={[S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3]} />
      <R y={8} x={12} c={[S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3]} />
      <R y={9} x={12} c={[S3,W,W,W,S3,S3,S3,S3,W,W,W,S3]} />
      <R y={10} x={12} c={[S3,W,B,B,S3,S3,S3,S3,W,B,B,S3]} />
      <rect x={13} y={9} width={1} height={1} fill={W} opacity={0.7} />
      <rect x={20} y={9} width={1} height={1} fill={W} opacity={0.7} />
      <R y={11} x={12} c={[S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3]} />
      <R y={12} x={13} c={[S3,S3,S3,S2,S2,S2,S2,S3,S3,S3]} />
      {/* Shell */}
      <R y={13} x={8} c={[S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1]} />
      <R y={14} x={7} c={[S1,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S1,S1]} />
      <R y={15} x={7} c={[S1,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,S1,S1]} />
      <R y={16} x={7} c={[S1,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S1,S1]} />
      <R y={17} x={7} c={[S1,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,N,S2,S1,S1]} />
      <R y={18} x={7} c={[S1,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S1,S1]} />
      <R y={19} x={8} c={[S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1]} />
      {/* Belly */}
      <R y={20} x={12} c={[L,L,L,L,L,L,L,L,L,L,L,L]} />
      <R y={21} x={13} c={[L,L,L,L,L,L,L,L,L,L]} />
      {/* Legs */}
      <R y={22} x={10} c={[S3,S3,S3,S3]} /><R y={22} x={22} c={[S3,S3,S3,S3]} />
      <R y={23} x={9} c={[S3,S3,S3,S3,S3]} /><R y={23} x={22} c={[S3,S3,S3,S3,S3]} />
      <R y={24} x={9} c={[S2,S2,S2,S2,S2]} /><R y={24} x={22} c={[S2,S2,S2,S2,S2]} />
      {/* Tail */}
      <R y={17} x={5} c={[S3,S3]} /><R y={18} x={4} c={[S3,S3,S3]} /><R y={19} x={3} c={[S3,S3]} />
      {/* Shadow */}
      <rect x={8} y={25} width={22} height={1} fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}

// ===== VOLTIX — Electric fox =====
export function VoltixPixel() {
  const Y='#f1c40f',D='#d4ac0d',W='white',B='#1a1a2e',R2='#e74c3c',LY='#fef9e7';
  return (
    <svg viewBox="3 3 32 23" style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated'}}>
      {/* Ears */}
      <R y={3} x={10} c={[Y]} /><R y={4} x={9} c={[Y,Y,Y]} />
      <R y={3} x={25} c={[Y]} /><R y={4} x={24} c={[Y,Y,Y]} />
      <R y={5} x={9} c={[Y,Y,Y,Y]} /><R y={5} x={23} c={[Y,Y,Y,Y]} />
      {/* Head */}
      <R y={6} x={9} c={[Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y]} />
      <R y={7} x={9} c={[Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y]} />
      <R y={8} x={9} c={[Y,Y,W,W,W,Y,Y,Y,Y,Y,Y,Y,Y,W,W,W,Y,Y]} />
      <R y={9} x={9} c={[Y,Y,W,B,B,Y,Y,Y,Y,Y,Y,Y,Y,W,B,B,Y,Y]} />
      <rect x={11} y={8} width={1} height={1} fill={W} opacity={0.7} />
      <rect x={22} y={8} width={1} height={1} fill={W} opacity={0.7} />
      {/* Cheeks */}
      <R y={10} x={9} c={[R2,R2,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,R2,R2]} />
      <R y={11} x={10} c={[Y,Y,Y,Y,Y,D,D,D,D,D,D,Y,Y,Y,Y,Y]} />
      {/* Body */}
      <R y={12} x={9} c={[Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y]} />
      <R y={13} x={8} c={[Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y]} />
      <R y={14} x={8} c={[Y,Y,Y,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,Y,Y,Y]} />
      <R y={15} x={8} c={[Y,Y,Y,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,Y,Y,Y]} />
      <R y={16} x={8} c={[Y,Y,Y,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,LY,Y,Y,Y]} />
      <R y={17} x={8} c={[Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y]} />
      {/* Arms */}
      <R y={14} x={6} c={[Y,Y]} /><R y={14} x={28} c={[Y,Y]} />
      <R y={15} x={5} c={[D,Y,Y]} /><R y={15} x={28} c={[Y,Y,D]} />
      {/* Legs */}
      <R y={18} x={10} c={[D,D,D,D]} /><R y={18} x={22} c={[D,D,D,D]} />
      <R y={19} x={9} c={[D,D,D,D,D]} /><R y={19} x={22} c={[D,D,D,D,D]} />
      <R y={20} x={9} c={[D,D,D,D,D]} /><R y={20} x={22} c={[D,D,D,D,D]} />
      {/* Lightning tail */}
      <R y={13} x={28} c={[Y,Y,Y]} />
      <R y={12} x={30} c={[Y,Y,Y]} />
      <R y={11} x={32} c={[Y,Y]} />
      <R y={12} x={33} c={[Y,Y]} />
      <R y={13} x={34} c={[Y]} />
      {/* Shadow */}
      <rect x={8} y={21} width={22} height={1} fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}

// ===== UMBRIX — Dark wolf =====
export function UmbrixPixel() {
  const P1='#3d1a52',P2='#5b2c6f',P3='#9b79af',RD='#e74c3c',B='#0d0015',RS='#ff6666';
  return (
    <svg viewBox="3 3 32 23" style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated'}}>
      {/* Ears */}
      <R y={3} x={9} c={[P1,P1]} /><R y={4} x={9} c={[P1,P2,P2]} />
      <R y={3} x={25} c={[P1,P1]} /><R y={4} x={24} c={[P2,P2,P1]} />
      <R y={5} x={9} c={[P1,P2,P2,P2]} /><R y={5} x={23} c={[P2,P2,P2,P1]} />
      {/* Head */}
      <R y={6} x={9} c={[P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2]} />
      <R y={7} x={9} c={[P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2]} />
      {/* Eyes — red glow */}
      <R y={8} x={9} c={[P2,P2,B,B,B,P2,P2,P2,P2,P2,P2,P2,B,B,B,P2,P2,P2]} />
      <R y={9} x={9} c={[P2,P2,B,RD,RD,P2,P2,P2,P2,P2,P2,P2,B,RD,RD,P2,P2,P2]} />
      <rect x={13} y={8} width={1} height={1} fill={RS} opacity={0.6} />
      <rect x={23} y={8} width={1} height={1} fill={RS} opacity={0.6} />
      {/* Snout */}
      <R y={10} x={9} c={[P2,P2,P2,P2,P2,P1,P1,P1,P1,P1,P1,P2,P2,P2,P2,P2,P2,P2]} />
      <R y={11} x={12} c={[P2,P2,'white',P2,P1,P1,P1,P1,P2,'white',P2,P2]} />
      <R y={12} x={10} c={[P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2]} />
      {/* Body */}
      <R y={13} x={7} c={[P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2]} />
      <R y={14} x={7} c={[P1,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P1]} />
      <R y={15} x={7} c={[P1,P2,P2,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P2,P2,P1]} />
      <R y={16} x={7} c={[P1,P2,P2,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P3,P2,P2,P1]} />
      <R y={17} x={7} c={[P1,P1,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P2,P1,P1]} />
      {/* Legs */}
      <R y={18} x={9} c={[P1,P1,P1,P1]} /><R y={18} x={23} c={[P1,P1,P1,P1]} />
      <R y={19} x={8} c={[P1,P1,P1,P1,P1]} /><R y={19} x={23} c={[P1,P1,P1,P1,P1]} />
      <R y={20} x={8} c={[P1,P1,P1,P1,P1]} /><R y={20} x={23} c={[P1,P1,P1,P1,P1]} />
      {/* Tail */}
      <R y={15} x={5} c={[P2,P2]} /><R y={14} x={4} c={[P2,P2,P2]} /><R y={13} x={3} c={[P1,P2]} />
      {/* Shadow */}
      <rect x={7} y={21} width={22} height={1} fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}

// ===== GLACIUS — Ice bear =====
export function GlaciusPixel() {
  const I1='#5a8ea0',I2='#7fb3cc',I3='#b8dae8',IC='#d6eaf8',W='white',B='#1a1a2e',N='#4a90b8';
  return (
    <svg viewBox="3 3 32 23" style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated'}}>
      {/* Ice crystal */}
      <R y={3} x={17} c={[IC,IC]} /><R y={2} x={17} c={['.', IC]} /><R y={4} x={16} c={[IC,IC,IC,IC]} />
      {/* Ears */}
      <R y={5} x={9} c={[I1,I1,I2,I2]} /><R y={5} x={23} c={[I2,I2,I1,I1]} />
      <R y={6} x={9} c={[I1,I2,I2,I2]} /><R y={6} x={23} c={[I2,I2,I2,I1]} />
      {/* Head */}
      <R y={7} x={9} c={[I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2]} />
      <R y={8} x={9} c={[I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2]} />
      <R y={9} x={9} c={[I2,I2,W,W,W,I2,I2,I2,I2,I2,I2,I2,I2,W,W,W,I2,I2]} />
      <R y={10} x={9} c={[I2,I2,W,B,B,I2,I2,I2,I2,I2,I2,I2,I2,W,B,B,I2,I2]} />
      <rect x={11} y={9} width={1} height={1} fill={W} opacity={0.7} />
      <rect x={22} y={9} width={1} height={1} fill={W} opacity={0.7} />
      {/* Nose */}
      <R y={11} x={9} c={[I2,I2,I2,I2,I2,I2,I2,N,N,N,N,I2,I2,I2,I2,I2,I2,I2]} />
      {/* Mouth */}
      <R y={12} x={12} c={[I2,I2,I2,N,N,N,N,N,N,I2,I2,I2]} />
      {/* Body */}
      <R y={13} x={7} c={[I1,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I1]} />
      <R y={14} x={6} c={[I1,I1,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I1,I1]} />
      <R y={15} x={6} c={[I1,I1,I2,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I2,I1,I1]} />
      <R y={16} x={6} c={[I1,I1,I2,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,I2,I1,I1]} />
      <R y={17} x={6} c={[I1,I1,I2,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,IC,I2,I1,I1]} />
      <R y={18} x={6} c={[I1,I1,I2,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I3,I2,I1,I1]} />
      <R y={19} x={6} c={[I1,I1,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I2,I1,I1]} />
      {/* Arms */}
      <R y={15} x={4} c={[I1,I2]} /><R y={16} x={3} c={[I1,I1,I2]} />
      <R y={15} x={30} c={[I2,I1]} /><R y={16} x={30} c={[I2,I1,I1]} />
      {/* Legs */}
      <R y={20} x={8} c={[I1,I1,I1,I1,I1]} /><R y={20} x={23} c={[I1,I1,I1,I1,I1]} />
      <R y={21} x={7} c={[I1,I1,I1,I1,I1,I1,I1]} /><R y={21} x={22} c={[I1,I1,I1,I1,I1,I1,I1]} />
      <R y={22} x={7} c={[I1,I1,I1,I1,I1,I1,I1]} /><R y={22} x={22} c={[I1,I1,I1,I1,I1,I1,I1]} />
      {/* Shadow */}
      <rect x={6} y={23} width={26} height={1} fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}
