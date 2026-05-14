import React from 'react';
import { Pet } from '../types/game';

const STARTERS = ['Flamarion','Aqualis','Verdex','Voltix','Umbrix','Glacius'];

// ===== ANIMATED SVG STARTERS — Gen5-style multi-part animation =====

function FlamarionSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .fl-body { animation: fl-breathe 2s ease-in-out infinite; transform-origin: 50% 70%; }
        .fl-tail { animation: fl-flicker 0.6s ease-in-out infinite alternate; transform-origin: 72% 60%; }
        .fl-arm-l { animation: fl-arm 2.5s ease-in-out infinite; transform-origin: 30% 60%; }
        .fl-arm-r { animation: fl-arm 2.5s ease-in-out infinite 0.3s; transform-origin: 70% 60%; }
        .fl-eye { animation: fl-blink 4s ease-in-out infinite; transform-origin: center; }
        .fl-flame-inner { animation: fl-glow 0.4s ease-in-out infinite alternate; }
        @keyframes fl-breathe { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.04) translateY(-2px)} }
        @keyframes fl-flicker { 0%{transform:rotate(-5deg) scaleY(1)} 100%{transform:rotate(8deg) scaleY(1.15)} }
        @keyframes fl-arm { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-8deg)} }
        @keyframes fl-blink { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
        @keyframes fl-glow { 0%{opacity:0.7} 100%{opacity:1} }
      `}</style>
      <g className="fl-body">
        <ellipse cx="50" cy="62" rx="22" ry="20" fill="#ff6b35"/>
        <ellipse cx="50" cy="60" rx="19" ry="17" fill="#ff8c52"/>
        <ellipse cx="50" cy="66" rx="13" ry="11" fill="#ffe0b2"/>
        {/* Head */}
        <circle cx="50" cy="38" r="18" fill="#ff6b35"/>
        <circle cx="50" cy="37" r="15" fill="#ff8c52"/>
        <circle cx="40" cy="23" r="3.5" fill="#ff4500"/>
        <circle cx="60" cy="23" r="3.5" fill="#ff4500"/>
        {/* Eyes */}
        <g className="fl-eye">
          <ellipse cx="43" cy="35" rx="4.5" ry="5" fill="white"/>
          <ellipse cx="57" cy="35" rx="4.5" ry="5" fill="white"/>
          <circle cx="44" cy="35" r="3" fill="#1a1a2e"/>
          <circle cx="58" cy="35" r="3" fill="#1a1a2e"/>
          <circle cx="45.5" cy="33.5" r="1.2" fill="white"/>
          <circle cx="59.5" cy="33.5" r="1.2" fill="white"/>
        </g>
        <path d="M 44 43 Q 50 47 56 43" fill="none" stroke="#cc3300" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Feet */}
        <ellipse cx="39" cy="80" rx="8" ry="4.5" fill="#e05520"/>
        <ellipse cx="61" cy="80" rx="8" ry="4.5" fill="#e05520"/>
      </g>
      {/* Arms */}
      <g className="fl-arm-l"><ellipse cx="28" cy="58" rx="7" ry="4.5" fill="#ff6b35" transform="rotate(-20 28 58)"/></g>
      <g className="fl-arm-r"><ellipse cx="72" cy="58" rx="7" ry="4.5" fill="#ff6b35" transform="rotate(20 72 58)"/></g>
      {/* Tail flame */}
      <g className="fl-tail">
        <path d="M 72 58 Q 84 48 80 32 Q 77 42 82 46 Q 78 38 76 48 Q 80 40 77 54 Z" fill="#ff4500"/>
        <path className="fl-flame-inner" d="M 74 55 Q 82 46 79 36 Q 78 44 80 40 Z" fill="#ffd700"/>
      </g>
    </svg>
  );
}

function AqualisSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .aq-body { animation: aq-bob 2.5s ease-in-out infinite; transform-origin: 50% 65%; }
        .aq-tail { animation: aq-wag 1.8s ease-in-out infinite; transform-origin: 28% 62%; }
        .aq-eye { animation: aq-blink 5s ease-in-out infinite; transform-origin: center; }
        .aq-shell { animation: aq-gleam 3s ease-in-out infinite; }
        @keyframes aq-bob { 0%,100%{transform:translateY(0) rotate(0)} 30%{transform:translateY(-3px) rotate(1deg)} 70%{transform:translateY(-1px) rotate(-1deg)} }
        @keyframes aq-wag { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-12deg) scaleX(1.1)} }
        @keyframes aq-blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.1)} }
        @keyframes aq-gleam { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
      `}</style>
      <g className="aq-body">
        {/* Shell */}
        <ellipse cx="50" cy="58" rx="26" ry="23" fill="#1a5276"/>
        <ellipse cx="50" cy="56" rx="23" ry="20" fill="#2980b9"/>
        <path d="M 34 48 Q 50 36 66 48" fill="none" stroke="#1a5276" strokeWidth="2.5"/>
        <path d="M 38 54 Q 50 44 62 54" fill="none" stroke="#1a5276" strokeWidth="1.8"/>
        <ellipse className="aq-shell" cx="50" cy="48" rx="8" ry="5" fill="white" opacity="0.3"/>
        {/* Belly */}
        <ellipse cx="50" cy="64" rx="15" ry="11" fill="#aed6f1"/>
        {/* Head */}
        <circle cx="50" cy="35" r="17" fill="#4a90d9"/>
        <circle cx="50" cy="34" r="14" fill="#5dade2"/>
        {/* Eyes */}
        <g className="aq-eye">
          <ellipse cx="42" cy="32" rx="4.5" ry="5" fill="white"/>
          <ellipse cx="58" cy="32" rx="4.5" ry="5" fill="white"/>
          <circle cx="43" cy="32" r="3" fill="#1a1a2e"/>
          <circle cx="59" cy="32" r="3" fill="#1a1a2e"/>
          <circle cx="44.5" cy="30.5" r="1.2" fill="white"/>
          <circle cx="60.5" cy="30.5" r="1.2" fill="white"/>
        </g>
        <path d="M 45 39 Q 50 43 55 39" fill="none" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Arms */}
        <ellipse cx="27" cy="54" rx="6" ry="4" fill="#4a90d9" transform="rotate(-15 27 54)"/>
        <ellipse cx="73" cy="54" rx="6" ry="4" fill="#4a90d9" transform="rotate(15 73 54)"/>
        {/* Feet */}
        <ellipse cx="40" cy="80" rx="8" ry="4" fill="#3a7abd"/>
        <ellipse cx="60" cy="80" rx="8" ry="4" fill="#3a7abd"/>
      </g>
      {/* Tail */}
      <g className="aq-tail">
        <path d="M 26 64 Q 14 56 10 46 Q 16 53 13 44 Q 18 54 22 60 Z" fill="#5dade2"/>
      </g>
    </svg>
  );
}

function VerdexSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .vd-body { animation: vd-sway 3s ease-in-out infinite; transform-origin: 50% 75%; }
        .vd-leaf1 { animation: vd-leaf 2s ease-in-out infinite; transform-origin: 50% 22%; }
        .vd-leaf2 { animation: vd-leaf 2s ease-in-out infinite 0.5s; transform-origin: 55% 18%; }
        .vd-eye { animation: vd-blink 4.5s ease-in-out infinite; transform-origin: center; }
        .vd-arm-l { animation: vd-wave 3s ease-in-out infinite; transform-origin: 32% 58%; }
        .vd-arm-r { animation: vd-wave 3s ease-in-out infinite 1s; transform-origin: 68% 58%; }
        @keyframes vd-sway { 0%,100%{transform:rotate(0) translateY(0)} 25%{transform:rotate(-1.5deg) translateY(-2px)} 75%{transform:rotate(1.5deg) translateY(-1px)} }
        @keyframes vd-leaf { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-15deg)} }
        @keyframes vd-blink { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.1)} }
        @keyframes vd-wave { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-12deg)} }
      `}</style>
      <g className="vd-body">
        <ellipse cx="50" cy="62" rx="21" ry="19" fill="#27ae60"/>
        <ellipse cx="50" cy="60" rx="18" ry="16" fill="#2ecc71"/>
        <ellipse cx="50" cy="65" rx="12" ry="10" fill="#a9dfbf"/>
        <circle cx="42" cy="61" r="2.5" fill="#1e8449" opacity="0.35"/>
        <circle cx="58" cy="64" r="2" fill="#1e8449" opacity="0.35"/>
        {/* Head */}
        <circle cx="50" cy="38" r="17" fill="#27ae60"/>
        <circle cx="50" cy="37" r="14" fill="#2ecc71"/>
        <g className="vd-eye">
          <ellipse cx="42" cy="35" rx="4" ry="4.5" fill="white"/>
          <ellipse cx="58" cy="35" rx="4" ry="4.5" fill="white"/>
          <circle cx="43" cy="35" r="2.5" fill="#1a1a2e"/>
          <circle cx="59" cy="35" r="2.5" fill="#1a1a2e"/>
          <circle cx="44.5" cy="33.5" r="1" fill="white"/>
          <circle cx="60.5" cy="33.5" r="1" fill="white"/>
        </g>
        <path d="M 44 42 Q 50 47 56 42" fill="none" stroke="#1e8449" strokeWidth="1.8" strokeLinecap="round"/>
        <ellipse cx="39" cy="80" rx="7" ry="4.5" fill="#219a52"/>
        <ellipse cx="61" cy="80" rx="7" ry="4.5" fill="#219a52"/>
      </g>
      {/* Leaves */}
      <g className="vd-leaf1"><path d="M 50 22 Q 40 8 50 2 Q 60 8 50 22 Z" fill="#1e8449"/><line x1="50" y1="4" x2="50" y2="22" stroke="#145a32" strokeWidth="1.2"/></g>
      <g className="vd-leaf2"><path d="M 54 19 Q 65 6 72 14 Q 62 10 54 19 Z" fill="#27ae60"/></g>
      {/* Arms */}
      <g className="vd-arm-l"><ellipse cx="30" cy="58" rx="6" ry="4" fill="#27ae60" transform="rotate(-20 30 58)"/></g>
      <g className="vd-arm-r"><ellipse cx="70" cy="58" rx="6" ry="4" fill="#27ae60" transform="rotate(20 70 58)"/></g>
    </svg>
  );
}

function VoltixSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .vt-body { animation: vt-jolt 1.5s steps(2) infinite; transform-origin: 50% 65%; }
        .vt-ear-l { animation: vt-ear 1.2s ease-in-out infinite; transform-origin: 36% 28%; }
        .vt-ear-r { animation: vt-ear 1.2s ease-in-out infinite 0.2s; transform-origin: 64% 28%; }
        .vt-tail { animation: vt-zap 0.8s ease-in-out infinite alternate; transform-origin: 72% 55%; }
        .vt-eye { animation: vt-blink 3s ease-in-out infinite; transform-origin: center; }
        .vt-cheek { animation: vt-glow 1s ease-in-out infinite alternate; }
        @keyframes vt-jolt { 0%{transform:translate(0,0)} 50%{transform:translate(1px,-2px)} }
        @keyframes vt-ear { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-6deg)} }
        @keyframes vt-zap { 0%{transform:rotate(-3deg) scaleY(1)} 100%{transform:rotate(5deg) scaleY(1.1)} }
        @keyframes vt-blink { 0%,85%,100%{transform:scaleY(1)} 90%{transform:scaleY(0.1)} }
        @keyframes vt-glow { 0%{opacity:0.35} 100%{opacity:0.7} }
      `}</style>
      <g className="vt-body">
        <ellipse cx="50" cy="62" rx="19" ry="17" fill="#f1c40f"/>
        <ellipse cx="50" cy="60" rx="16" ry="14" fill="#f9e154"/>
        <ellipse cx="50" cy="65" rx="10" ry="8" fill="#fef9e7"/>
        <circle cx="50" cy="38" r="17" fill="#f1c40f"/>
        <circle cx="50" cy="37" r="14" fill="#f9e154"/>
        <g className="vt-eye">
          <ellipse cx="43" cy="35" rx="4" ry="4.5" fill="white"/>
          <ellipse cx="57" cy="35" rx="4" ry="4.5" fill="white"/>
          <circle cx="44" cy="35" r="2.5" fill="#1a1a2e"/>
          <circle cx="58" cy="35" r="2.5" fill="#1a1a2e"/>
          <circle cx="45" cy="33.5" r="1" fill="white"/>
          <circle cx="59" cy="33.5" r="1" fill="white"/>
        </g>
        <circle className="vt-cheek" cx="35" cy="40" r="4" fill="#ff6b35" opacity="0.5"/>
        <circle className="vt-cheek" cx="65" cy="40" r="4" fill="#ff6b35" opacity="0.5"/>
        <path d="M 46 42 Q 50 44 54 42" fill="none" stroke="#d4ac0d" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="33" cy="58" rx="5.5" ry="3.5" fill="#f1c40f" transform="rotate(-15 33 58)"/>
        <ellipse cx="67" cy="58" rx="5.5" ry="3.5" fill="#f1c40f" transform="rotate(15 67 58)"/>
        <ellipse cx="41" cy="78" rx="7" ry="4" fill="#d4ac0d"/>
        <ellipse cx="59" cy="78" rx="7" ry="4" fill="#d4ac0d"/>
      </g>
      <g className="vt-ear-l"><polygon points="35,28 26,6 42,20" fill="#f1c40f"/><polygon points="37,24 30,10 42,18" fill="#f9e154"/></g>
      <g className="vt-ear-r"><polygon points="65,28 74,6 58,20" fill="#f1c40f"/><polygon points="63,24 70,10 58,18" fill="#f9e154"/></g>
      <g className="vt-tail"><polygon points="73,54 82,42 78,50 88,34 81,46 85,36 76,54" fill="#f1c40f" stroke="#d4ac0d" strokeWidth="0.8"/></g>
    </svg>
  );
}

function UmbrixSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .um-body { animation: um-hover 3s ease-in-out infinite; transform-origin: 50% 70%; }
        .um-eye-glow { animation: um-glow 2s ease-in-out infinite; }
        .um-tail { animation: um-drift 2.5s ease-in-out infinite; transform-origin: 74% 56%; }
        .um-ear-l { animation: um-ear 3s ease-in-out infinite; transform-origin: 36% 25%; }
        .um-ear-r { animation: um-ear 3s ease-in-out infinite 0.4s; transform-origin: 64% 25%; }
        .um-fang { animation: um-chomp 5s ease-in-out infinite; transform-origin: 50% 42%; }
        @keyframes um-hover { 0%,100%{transform:translateY(0) scale(1);opacity:1} 30%{transform:translateY(-5px) scale(1.02);opacity:0.9} 60%{transform:translateY(-2px) scale(1.01);opacity:0.95} }
        @keyframes um-glow { 0%,100%{opacity:0.7;filter:blur(0)} 50%{opacity:1;filter:blur(1px)} }
        @keyframes um-drift { 0%,100%{transform:rotate(0) translateX(0)} 50%{transform:rotate(-8deg) translateX(-3px)} }
        @keyframes um-ear { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-5deg)} }
        @keyframes um-chomp { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.5)} }
      `}</style>
      <g className="um-body">
        <ellipse cx="50" cy="62" rx="21" ry="19" fill="#3d1a52"/>
        <ellipse cx="50" cy="60" rx="18" ry="16" fill="#5b2c6f"/>
        <ellipse cx="50" cy="65" rx="10" ry="8" fill="#9b79af"/>
        {/* Head */}
        <circle cx="50" cy="36" r="18" fill="#3d1a52"/>
        <circle cx="50" cy="35" r="15" fill="#5b2c6f"/>
        {/* Eyes — glowing */}
        <ellipse cx="42" cy="33" rx="5" ry="4" fill="#0d0015"/>
        <ellipse cx="58" cy="33" rx="5" ry="4" fill="#0d0015"/>
        <circle className="um-eye-glow" cx="42" cy="33" r="3" fill="#e74c3c"/>
        <circle className="um-eye-glow" cx="58" cy="33" r="3" fill="#e74c3c"/>
        <circle cx="43.5" cy="31.5" r="1.2" fill="#ff9999"/>
        <circle cx="59.5" cy="31.5" r="1.2" fill="#ff9999"/>
        {/* Snout + Fangs */}
        <ellipse cx="50" cy="40" rx="6" ry="3.5" fill="#4a2060"/>
        <ellipse cx="50" cy="39" rx="3" ry="1.8" fill="#1a0a2a"/>
        <g className="um-fang">
          <polygon points="45,42 46.5,47 48,42" fill="#eee"/>
          <polygon points="52,42 53.5,47 55,42" fill="#eee"/>
        </g>
        {/* Legs */}
        <rect x="36" y="74" width="8" height="9" rx="4" fill="#3d1a52"/>
        <rect x="56" y="74" width="8" height="9" rx="4" fill="#3d1a52"/>
        <circle cx="38" cy="83" r="2" fill="#222"/><circle cx="42" cy="83" r="2" fill="#222"/>
        <circle cx="58" cy="83" r="2" fill="#222"/><circle cx="62" cy="83" r="2" fill="#222"/>
      </g>
      <g className="um-ear-l"><polygon points="33,28 20,4 42,18" fill="#3d1a52"/><polygon points="36,23 24,8 42,16" fill="#5b2c6f"/></g>
      <g className="um-ear-r"><polygon points="67,28 80,4 58,18" fill="#3d1a52"/><polygon points="64,23 76,8 58,16" fill="#5b2c6f"/></g>
      <g className="um-tail"><path d="M 74 56 Q 86 48 90 36 Q 84 46 88 34 Q 82 44 80 54 Z" fill="#5b2c6f" opacity="0.7"/></g>
    </svg>
  );
}

function GlaciusSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <style>{`
        .gl-body { animation: gl-breathe 3.5s ease-in-out infinite; transform-origin: 50% 68%; }
        .gl-arm-l { animation: gl-paw 3s ease-in-out infinite; transform-origin: 28% 56%; }
        .gl-arm-r { animation: gl-paw 3s ease-in-out infinite 0.8s; transform-origin: 72% 56%; }
        .gl-ear-l { animation: gl-wiggle 4s ease-in-out infinite; transform-origin: 34% 20%; }
        .gl-ear-r { animation: gl-wiggle 4s ease-in-out infinite 0.5s; transform-origin: 66% 20%; }
        .gl-eye { animation: gl-blink 5s ease-in-out infinite; transform-origin: center; }
        .gl-crystal { animation: gl-sparkle 2s ease-in-out infinite; }
        @keyframes gl-breathe { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.03) translateY(-3px)} }
        @keyframes gl-paw { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-10deg)} }
        @keyframes gl-wiggle { 0%,100%{transform:rotate(0)} 50%{transform:rotate(5deg)} }
        @keyframes gl-blink { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.1)} }
        @keyframes gl-sparkle { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
      <g className="gl-body">
        <ellipse cx="50" cy="60" rx="25" ry="23" fill="#6a9fb5"/>
        <ellipse cx="50" cy="58" rx="22" ry="20" fill="#93c5d8"/>
        <ellipse cx="50" cy="64" rx="16" ry="13" fill="#d6eaf8"/>
        {/* Head */}
        <circle cx="50" cy="34" r="19" fill="#6a9fb5"/>
        <circle cx="50" cy="33" r="16" fill="#93c5d8"/>
        {/* Eyes */}
        <g className="gl-eye">
          <ellipse cx="42" cy="31" rx="4.5" ry="5" fill="white"/>
          <ellipse cx="58" cy="31" rx="4.5" ry="5" fill="white"/>
          <circle cx="43" cy="31" r="3" fill="#1a1a2e"/>
          <circle cx="59" cy="31" r="3" fill="#1a1a2e"/>
          <circle cx="44.5" cy="29.5" r="1.2" fill="white"/>
          <circle cx="60.5" cy="29.5" r="1.2" fill="white"/>
        </g>
        <ellipse cx="50" cy="37" rx="3.5" ry="2.2" fill="#4a90b8"/>
        <path d="M 46 41 Q 50 44 54 41" fill="none" stroke="#4a90b8" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Feet */}
        <ellipse cx="38" cy="82" rx="9" ry="5" fill="#6a9fb5"/>
        <ellipse cx="62" cy="82" rx="9" ry="5" fill="#6a9fb5"/>
      </g>
      {/* Ears */}
      <g className="gl-ear-l"><circle cx="34" cy="18" r="8" fill="#6a9fb5"/><circle cx="34" cy="18" r="5" fill="#93c5d8"/></g>
      <g className="gl-ear-r"><circle cx="66" cy="18" r="8" fill="#6a9fb5"/><circle cx="66" cy="18" r="5" fill="#93c5d8"/></g>
      {/* Arms */}
      <g className="gl-arm-l"><ellipse cx="27" cy="55" rx="7" ry="5" fill="#6a9fb5" transform="rotate(-10 27 55)"/></g>
      <g className="gl-arm-r"><ellipse cx="73" cy="55" rx="7" ry="5" fill="#6a9fb5" transform="rotate(10 73 55)"/></g>
      {/* Ice crystals */}
      <g className="gl-crystal">
        <polygon points="50,8 47,17 53,17" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.8"/>
        <polygon points="40,11 38,18 42,18" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.6"/>
        <polygon points="60,11 58,18 62,18" fill="#d6eaf8" stroke="#85c1e9" strokeWidth="0.6"/>
      </g>
    </svg>
  );
}

const SVG_MAP: Record<string, () => React.JSX.Element> = {
  Flamarion: FlamarionSVG, Aqualis: AqualisSVG, Verdex: VerdexSVG,
  Voltix: VoltixSVG, Umbrix: UmbrixSVG, Glacius: GlaciusSVG,
};

// ===== PARTICLES =====
function Particles({ element, size }: { element: string; size: number }) {
  if (element === 'fire') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2,3,4,5].map(i=>(<div key={i} className="absolute rounded-full anim-fire-ember" style={{width:3+(i%3)*2,height:5+(i%3)*3,left:`${18+(i*10)%64}%`,bottom:'8%',background:i%3===0?'#ff4500':i%3===1?'#ff8c00':'#ffd700',borderRadius:'50% 50% 50% 50%/60% 60% 40% 40%',animationDelay:`${i*0.25}s`,animationDuration:`${0.8+i*0.25}s`}}/>))}<div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{width:size*0.7,height:size*0.12,background:'radial-gradient(ellipse,#ff450040,transparent)',filter:'blur(5px)'}}/></div>);
  if (element === 'water') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2,3,4].map(i=>(<div key={i} className="absolute anim-water-drop rounded-full" style={{width:4+(i%3)*2,height:4+(i%3)*2,left:`${12+(i*16)%76}%`,bottom:'5%',background:'radial-gradient(circle at 30% 30%,#b0d4f1,#4a90d9)',animationDelay:`${i*0.5}s`,animationDuration:`${2+(i%3)*0.5}s`}}/>))}</div>);
  if (element === 'grass') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2,3].map(i=>(<div key={i} className="absolute anim-leaf-float" style={{left:`${10+(i*22)%84}%`,top:`${8+(i*14)%35}%`,fontSize:9+(i%3)*3,animationDelay:`${i*0.8}s`,animationDuration:`${3.5+(i%3)*0.8}s`}}>🍃</div>))}</div>);
  if (element === 'electric') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2].map(i=>(<div key={i} className="absolute anim-zap" style={{left:`${15+(i*25)%70}%`,top:`${18+(i*20)%50}%`,fontSize:10+(i%2)*5,animationDelay:`${i*0.5}s`,animationDuration:`${0.6+i*0.3}s`}}>⚡</div>))}</div>);
  if (element === 'dark') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2,3].map(i=>(<div key={i} className="absolute rounded-full anim-shadow-orb" style={{width:8+(i%3)*4,height:8+(i%3)*4,left:`${10+(i*20)%80}%`,top:`${25+(i*15)%45}%`,background:'radial-gradient(circle,#9b59b680,#4a235a40,transparent)',animationDelay:`${i*0.5}s`,animationDuration:`${3+(i%3)*0.7}s`}}/>))}<div className="absolute bottom-0 left-0 right-0 h-[25%] anim-dark-mist" style={{background:'linear-gradient(to top,#4a235a30,transparent)'}}/></div>);
  if (element === 'ice') return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{[0,1,2,3,4,5].map(i=>(<div key={i} className="absolute anim-snow" style={{left:`${5+(i*16)%90}%`,top:'-5%',fontSize:6+(i%3)*3,animationDelay:`${i*0.5}s`,animationDuration:`${2.5+(i%3)*0.6}s`,opacity:0.5+(i%3)*0.15}}>❄</div>))}</div>);
  return null;
}

// ===== EXPORTED COMPONENTS =====

interface Props { pet: Pet; size?: number; animate?: boolean; showParticles?: boolean; }

export default function PetSprite({ pet, size = 120, animate = true, showParticles = true }: Props) {
  const isStarter = STARTERS.includes(pet.name);
  const s = size;
  const Svg = SVG_MAP[pet.name];

  return (
    <div className="relative" style={{ width: s, height: s }}>
      {isStarter && showParticles && <Particles element={pet.element} size={s} />}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-full" style={{ width:s*0.6,height:s*0.6, background:`radial-gradient(circle,${pet.colors.primary}30,transparent 70%)`, filter:'blur(10px)' }}/>
      </div>
      {Svg ? (
        <div className={`w-full h-full relative z-10 ${!animate?'':''.trim()}`} style={{ filter:`drop-shadow(0 0 8px ${pet.colors.primary}50)` }}>
          <Svg />
        </div>
      ) : (
        <img src={pet.image} alt={pet.name} className={`w-full h-full object-contain relative z-10 anim-generic-idle`}
          style={{ mixBlendMode:'screen', filter:`drop-shadow(0 0 5px ${pet.colors.primary}50) saturate(1.3) brightness(1.15)` }}/>
      )}
    </div>
  );
}

// Element background gradients for art area
const ELEM_BG: Record<string, string> = {
  fire:     'linear-gradient(180deg, #4a1a0a 0%, #2a0a00 40%, #1a0500 100%)',
  water:    'linear-gradient(180deg, #0a2a4a 0%, #051a2a 40%, #030f1a 100%)',
  grass:    'linear-gradient(180deg, #0a3a1a 0%, #051f0d 40%, #030f08 100%)',
  electric: 'linear-gradient(180deg, #3a3a0a 0%, #1f1f05 40%, #0f0f03 100%)',
  dark:     'linear-gradient(180deg, #2a0a3a 0%, #15051f 40%, #0a030f 100%)',
  ice:      'linear-gradient(180deg, #0a2a3a 0%, #05151f 40%, #030a0f 100%)',
};
const ELEM_EMOJI: Record<string,string> = { fire:'🔥', water:'💧', grass:'🌿', electric:'⚡', dark:'🌑', ice:'❄️' };
const RARITY_BORDER: Record<string,string> = { common:'#8a8a8a', rare:'#4a9eff', epic:'#c06eff', legendary:'#ffb830' };
const RARITY_GLOW: Record<string,string> = { common:'none', rare:'0 0 8px #4a9eff40', epic:'0 0 12px #c06eff50', legendary:'0 0 16px #ffb83060' };

export function PetCard({ pet, size=160, onClick, selected=false }: { pet:Pet; size?:number; onClick?:()=>void; selected?:boolean; }) {
  const Svg = SVG_MAP[pet.name];
  const isStarter = STARTERS.includes(pet.name);
  const bdr = RARITY_BORDER[pet.rarity] ?? '#8a8a8a';
  const w = size;
  const h = size * 1.4;

  return (
    <div onClick={onClick}
      className={`relative cursor-pointer transition-all active:scale-[0.96] hover:scale-[1.02] ${selected ? 'scale-[1.03]' : ''}`}
      style={{
        width: w, height: h,
        borderRadius: 12,
        background: `linear-gradient(160deg, #2a2a4a, #181830)`,
        border: `3px solid ${selected ? '#facc15' : bdr}`,
        boxShadow: selected ? '0 0 20px #facc1540' : RARITY_GLOW[pet.rarity],
        overflow: 'hidden',
      }}
    >
      {/* === TOP BAR: Name + HP === */}
      <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white font-bold text-[11px] truncate">{pet.name}</span>
          <span className="text-gray-400 text-[9px] font-semibold flex-shrink-0">Lv.{pet.stats.level}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-red-400 font-black text-sm">{pet.stats.maxHp}</span>
          <span className="text-red-400 text-[9px]">HP</span>
          <span className="text-lg ml-0.5">{ELEM_EMOJI[pet.element]}</span>
        </div>
      </div>

      {/* === ART FRAME === */}
      <div className="mx-2 relative rounded-lg overflow-hidden" style={{
        height: h * 0.42,
        border: `2px solid ${bdr}50`,
        background: ELEM_BG[pet.element],
      }}>
        {/* Particles behind pet */}
        {isStarter && <Particles element={pet.element} size={h * 0.42} />}
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full" style={{ width:'60%',height:'60%', background:`radial-gradient(circle,${pet.colors.primary}25,transparent 70%)`, filter:'blur(8px)' }}/>
        </div>
        {/* Pet */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Svg ? (
            <div style={{ width: h*0.32, height: h*0.32, filter:`drop-shadow(0 0 6px ${pet.colors.primary}50)` }}><Svg/></div>
          ) : (
            <img src={pet.image} alt={pet.name} className="anim-generic-idle" style={{ width:h*0.3, height:h*0.3, objectFit:'contain', mixBlendMode:'screen', filter:`drop-shadow(0 0 6px ${pet.colors.primary}50) saturate(1.3) brightness(1.15)` }}/>
          )}
        </div>
        {/* NFT badge */}
        {pet.isNFT && <span className="absolute top-1 left-1 text-cyan-400 text-[7px] font-bold bg-cyan-900/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm">NFT</span>}
      </div>

      {/* === RARITY + TYPE BAR === */}
      <div className="flex items-center justify-between px-2.5 mt-1.5">
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{
          color: bdr, backgroundColor: bdr + '18', border: `1px solid ${bdr}30`,
        }}>{pet.rarity.toUpperCase()}</span>
        <span className="text-gray-500 text-[8px]">{pet.wins}W / {pet.losses}L</span>
      </div>

      {/* === ATTACKS / STATS === */}
      <div className="px-2.5 mt-1.5 space-y-1">
        {/* Attack 1 */}
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{ELEM_EMOJI[pet.element]}</span>
            <span className="text-white text-[9px] font-semibold">Ataque</span>
          </div>
          <span className="text-orange-400 text-[10px] font-bold">{pet.stats.attack}</span>
        </div>
        {/* Defense */}
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🛡️</span>
            <span className="text-white text-[9px] font-semibold">Defesa</span>
          </div>
          <span className="text-blue-400 text-[10px] font-bold">{pet.stats.defense}</span>
        </div>
      </div>

      {/* === BOTTOM: Speed + EXP bar === */}
      <div className="px-2.5 mt-1.5 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-[9px]">💨</span>
          <span className="text-yellow-400 text-[9px] font-bold">{pet.stats.speed}</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{
            width: `${(pet.stats.hp / pet.stats.maxHp) * 100}%`,
            background: `linear-gradient(90deg, ${pet.colors.primary}, ${pet.colors.accent})`,
          }}/>
        </div>
      </div>

      {/* Holographic shine for rare+ */}
      {pet.rarity !== 'common' && (
        <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
          <div className="absolute inset-0 anim-holo-shine" style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}/>
        </div>
      )}
    </div>
  );
}
