interface Props {
  direction: 'up' | 'down' | 'left' | 'right';
  walking: boolean;
  frame: number;
  size?: number;
}

export default function PixelAvatar({ direction, walking, frame, size = 3 }: Props) {
  const px = size; // pixel unit size
  
  // Walking leg offsets
  const legFrame = walking ? frame % 4 : 0;
  const leftLegOff = legFrame === 1 ? -px : legFrame === 3 ? px : 0;
  const rightLegOff = legFrame === 1 ? px : legFrame === 3 ? -px : 0;
  
  // Body bob when walking
  const bodyBob = walking ? (frame % 2 === 0 ? -px : 0) : 0;
  
  // Arm swing
  const leftArmOff = walking ? (legFrame === 1 ? px : legFrame === 3 ? -px : 0) : 0;
  const rightArmOff = walking ? (legFrame === 1 ? -px : legFrame === 3 ? px : 0) : 0;
  
  // Flip for left direction
  const scaleX = direction === 'left' ? -1 : 1;
  
  // Slight lean based on direction
  const isBack = direction === 'up';

  return (
    <div
      style={{
        position: 'relative',
        width: px * 10,
        height: px * 16,
        transform: `scaleX(${scaleX})`,
        imageRendering: 'pixelated',
      }}
    >
      {/* Shadow */}
      <div style={{
        position: 'absolute',
        bottom: -px,
        left: px,
        width: px * 8,
        height: px * 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '50%',
      }} />

      {/* Body group with bob */}
      <div style={{ transform: `translateY(${bodyBob}px)` }}>
        
        {/* Hat */}
        <div style={{ position: 'absolute', top: 0, left: px * 2, width: px * 7, height: px * 2, backgroundColor: '#e53e3e' }} />
        <div style={{ position: 'absolute', top: px * 0, left: px * 1, width: px * 1, height: px * 1, backgroundColor: '#e53e3e' }} />
        {/* Hat brim */}
        <div style={{ position: 'absolute', top: px * 2, left: px * 1, width: px * 8, height: px * 1, backgroundColor: '#c53030' }} />
        {/* Hat logo */}
        <div style={{ position: 'absolute', top: px * 0.5, left: px * 4, width: px * 2, height: px * 1, backgroundColor: '#fff', borderRadius: 1 }} />

        {/* Hair (sides) */}
        <div style={{ position: 'absolute', top: px * 3, left: px * 1, width: px * 1, height: px * 2, backgroundColor: '#2d1810' }} />
        <div style={{ position: 'absolute', top: px * 3, left: px * 8, width: px * 1, height: px * 2, backgroundColor: '#2d1810' }} />

        {/* Face / Head */}
        <div style={{ position: 'absolute', top: px * 3, left: px * 2, width: px * 6, height: px * 3, backgroundColor: isBack ? '#2d1810' : '#fdd' }} />
        
        {/* Eyes (only front/side) */}
        {!isBack && (
          <>
            <div style={{ position: 'absolute', top: px * 3.5, left: px * 3, width: px * 1.2, height: px * 1.2, backgroundColor: '#1a1a2e', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: px * 3.5, left: px * 5.5, width: px * 1.2, height: px * 1.2, backgroundColor: '#1a1a2e', borderRadius: '50%' }} />
            {/* Eye shine */}
            <div style={{ position: 'absolute', top: px * 3.5, left: px * 3.3, width: px * 0.4, height: px * 0.4, backgroundColor: '#fff', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: px * 3.5, left: px * 5.8, width: px * 0.4, height: px * 0.4, backgroundColor: '#fff', borderRadius: '50%' }} />
            {/* Mouth */}
            <div style={{ position: 'absolute', top: px * 5, left: px * 4, width: px * 2, height: px * 0.5, backgroundColor: '#e88', borderRadius: 2 }} />
          </>
        )}
        {/* Back of head detail */}
        {isBack && (
          <div style={{ position: 'absolute', top: px * 2.5, left: px * 3, width: px * 4, height: px * 1, backgroundColor: '#e53e3e' }} />
        )}

        {/* Neck */}
        <div style={{ position: 'absolute', top: px * 6, left: px * 3.5, width: px * 3, height: px * 0.5, backgroundColor: '#fcc' }} />

        {/* Jacket body */}
        <div style={{ position: 'absolute', top: px * 6.5, left: px * 2, width: px * 6, height: px * 4, backgroundColor: '#3182ce' }} />
        {/* Jacket detail line */}
        <div style={{ position: 'absolute', top: px * 6.5, left: px * 4.5, width: px * 1, height: px * 4, backgroundColor: '#2b6cb0' }} />
        {/* Collar */}
        <div style={{ position: 'absolute', top: px * 6.5, left: px * 2.5, width: px * 5, height: px * 0.8, backgroundColor: '#2b6cb0' }} />

        {/* Left arm */}
        <div style={{
          position: 'absolute', top: px * 7, left: px * 0.5, width: px * 1.5, height: px * 3.5,
          backgroundColor: '#3182ce', borderRadius: `0 0 ${px}px ${px}px`,
          transform: `translateY(${leftArmOff}px)`,
        }} />
        {/* Left hand */}
        <div style={{
          position: 'absolute', top: px * 10, left: px * 0.5, width: px * 1.5, height: px * 1,
          backgroundColor: '#fdd', borderRadius: `0 0 ${px}px ${px}px`,
          transform: `translateY(${leftArmOff}px)`,
        }} />

        {/* Right arm */}
        <div style={{
          position: 'absolute', top: px * 7, left: px * 8, width: px * 1.5, height: px * 3.5,
          backgroundColor: '#3182ce', borderRadius: `0 0 ${px}px ${px}px`,
          transform: `translateY(${rightArmOff}px)`,
        }} />
        {/* Right hand */}
        <div style={{
          position: 'absolute', top: px * 10, left: px * 8, width: px * 1.5, height: px * 1,
          backgroundColor: '#fdd', borderRadius: `0 0 ${px}px ${px}px`,
          transform: `translateY(${rightArmOff}px)`,
        }} />

        {/* Belt */}
        <div style={{ position: 'absolute', top: px * 10.5, left: px * 2, width: px * 6, height: px * 0.8, backgroundColor: '#744210' }} />
        {/* Belt buckle */}
        <div style={{ position: 'absolute', top: px * 10.3, left: px * 4.2, width: px * 1.5, height: px * 1.2, backgroundColor: '#ecc94b', borderRadius: 1 }} />

        {/* Pants */}
        <div style={{ position: 'absolute', top: px * 11.3, left: px * 2, width: px * 6, height: px * 1.5, backgroundColor: '#2d3748' }} />

        {/* Left leg */}
        <div style={{
          position: 'absolute', top: px * 12.5, left: px * 2, width: px * 2.5, height: px * 2,
          backgroundColor: '#2d3748',
          transform: `translateY(${leftLegOff}px)`,
        }} />
        {/* Left shoe */}
        <div style={{
          position: 'absolute', top: px * 14.2, left: px * 1.5, width: px * 3, height: px * 1.2,
          backgroundColor: '#e53e3e', borderRadius: `${px}px ${px}px ${px * 0.5}px ${px * 0.5}px`,
          transform: `translateY(${leftLegOff}px)`,
        }} />

        {/* Right leg */}
        <div style={{
          position: 'absolute', top: px * 12.5, left: px * 5.5, width: px * 2.5, height: px * 2,
          backgroundColor: '#2d3748',
          transform: `translateY(${rightLegOff}px)`,
        }} />
        {/* Right shoe */}
        <div style={{
          position: 'absolute', top: px * 14.2, left: px * 5.5, width: px * 3, height: px * 1.2,
          backgroundColor: '#e53e3e', borderRadius: `${px}px ${px}px ${px * 0.5}px ${px * 0.5}px`,
          transform: `translateY(${rightLegOff}px)`,
        }} />
      </div>
    </div>
  );
}
