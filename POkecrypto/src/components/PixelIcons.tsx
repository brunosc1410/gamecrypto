/* ═══════════════════════════════════════════════════
   Pixel Art Inline SVG Icons — all embedded, never disappear
   ═══════════════════════════════════════════════════ */

/* ── 🔮 CryptoBall — pokeball capsule ── */
export function CryptoBallIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* top half */}
      <rect x="5" y="1" width="6" height="1" fill="#7c3aed" />
      <rect x="3" y="2" width="10" height="1" fill="#7c3aed" />
      <rect x="2" y="3" width="12" height="1" fill="#8b5cf6" />
      <rect x="2" y="4" width="12" height="1" fill="#8b5cf6" />
      <rect x="1" y="5" width="14" height="1" fill="#a78bfa" />
      <rect x="1" y="6" width="14" height="1" fill="#a78bfa" />
      <rect x="1" y="7" width="14" height="1" fill="#7c3aed" />
      {/* shine */}
      <rect x="4" y="3" width="2" height="1" fill="#c4b5fd" />
      <rect x="3" y="4" width="1" height="1" fill="#c4b5fd" />
      <rect x="4" y="4" width="1" height="1" fill="#ddd6fe" />
      {/* center band */}
      <rect x="1" y="8" width="14" height="1" fill="#1e1b4b" />
      {/* center button */}
      <rect x="6" y="7" width="4" height="3" fill="#1e1b4b" />
      <rect x="7" y="7" width="2" height="1" fill="#e0e7ff" />
      <rect x="7" y="8" width="2" height="1" fill="#c7d2fe" />
      <rect x="7" y="9" width="2" height="1" fill="#e0e7ff" />
      <rect x="7" y="7" width="1" height="1" fill="#f8fafc" />
      {/* bottom half */}
      <rect x="1" y="9" width="14" height="1" fill="#4c1d95" />
      <rect x="1" y="10" width="14" height="1" fill="#3b0764" />
      <rect x="2" y="11" width="12" height="1" fill="#3b0764" />
      <rect x="2" y="12" width="12" height="1" fill="#2e1065" />
      <rect x="3" y="13" width="10" height="1" fill="#2e1065" />
      <rect x="5" y="14" width="6" height="1" fill="#1e1b4b" />
    </svg>
  );
}

/* ── 🎁 Capsule / Gacha ── */
export function CapsuleIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 24" width={size * 0.833} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* top dome — shiny red */}
      <rect x="7" y="0" width="6" height="1" fill="#dc2626" />
      <rect x="5" y="1" width="10" height="1" fill="#ef4444" />
      <rect x="4" y="2" width="12" height="1" fill="#ef4444" />
      <rect x="3" y="3" width="14" height="1" fill="#f87171" />
      <rect x="2" y="4" width="16" height="1" fill="#f87171" />
      <rect x="2" y="5" width="16" height="1" fill="#ef4444" />
      <rect x="1" y="6" width="18" height="1" fill="#ef4444" />
      <rect x="1" y="7" width="18" height="1" fill="#dc2626" />
      <rect x="1" y="8" width="18" height="1" fill="#dc2626" />
      <rect x="1" y="9" width="18" height="1" fill="#b91c1c" />
      {/* dome shine */}
      <rect x="6" y="2" width="3" height="1" fill="#fca5a5" />
      <rect x="5" y="3" width="2" height="1" fill="#fca5a5" />
      <rect x="4" y="4" width="1" height="2" fill="#fecaca" />
      <rect x="5" y="4" width="1" height="1" fill="#fecaca" />
      {/* star sparkle on dome */}
      <rect x="13" y="4" width="1" height="1" fill="#fef08a" />
      <rect x="12" y="5" width="1" height="1" fill="#fde68a" />
      <rect x="14" y="5" width="1" height="1" fill="#fde68a" />
      <rect x="13" y="6" width="1" height="1" fill="#fef08a" />
      {/* center band */}
      <rect x="0" y="10" width="20" height="1" fill="#fbbf24" />
      <rect x="0" y="11" width="20" height="1" fill="#f59e0b" />
      {/* band button */}
      <rect x="8" y="9" width="4" height="4" fill="#1e1b4b" />
      <rect x="9" y="10" width="2" height="2" fill="#e0e7ff" />
      <rect x="9" y="10" width="1" height="1" fill="#f8fafc" />
      {/* bottom half — white/silver */}
      <rect x="1" y="12" width="18" height="1" fill="#e5e7eb" />
      <rect x="1" y="13" width="18" height="1" fill="#f3f4f6" />
      <rect x="1" y="14" width="18" height="1" fill="#f9fafb" />
      <rect x="1" y="15" width="18" height="1" fill="#f3f4f6" />
      <rect x="1" y="16" width="18" height="1" fill="#e5e7eb" />
      <rect x="2" y="17" width="16" height="1" fill="#d1d5db" />
      <rect x="2" y="18" width="16" height="1" fill="#d1d5db" />
      <rect x="3" y="19" width="14" height="1" fill="#9ca3af" />
      <rect x="4" y="20" width="12" height="1" fill="#9ca3af" />
      <rect x="5" y="21" width="10" height="1" fill="#6b7280" />
      <rect x="7" y="22" width="6" height="1" fill="#6b7280" />
      {/* bottom shine */}
      <rect x="4" y="14" width="1" height="2" fill="white" opacity="0.5" />
      {/* question mark — mystery! */}
      <rect x="8" y="15" width="4" height="1" fill="#6b7280" />
      <rect x="11" y="16" width="1" height="2" fill="#6b7280" />
      <rect x="8" y="17" width="4" height="1" fill="#6b7280" />
      <rect x="8" y="17" width="1" height="1" fill="#6b7280" />
      <rect x="9" y="19" width="2" height="1" fill="#6b7280" />
    </svg>
  );
}

/* ── 👑 VIP Crown ── */
export function VipCrownIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 14" width={size} height={size * 0.875} style={{ imageRendering: 'pixelated' }}>
      {/* crown points */}
      <rect x="1" y="2" width="1" height="1" fill="#ffd700" />
      <rect x="0" y="3" width="1" height="1" fill="#ffd700" />
      <rect x="7" y="0" width="2" height="1" fill="#ffd700" />
      <rect x="7" y="1" width="2" height="1" fill="#ffd700" />
      <rect x="14" y="2" width="1" height="1" fill="#ffd700" />
      <rect x="15" y="3" width="1" height="1" fill="#ffd700" />
      {/* crown body */}
      <rect x="1" y="3" width="1" height="1" fill="#ffb300" />
      <rect x="2" y="4" width="1" height="1" fill="#ffb300" />
      <rect x="3" y="5" width="1" height="1" fill="#ffd700" />
      <rect x="4" y="4" width="1" height="1" fill="#ffd700" />
      <rect x="5" y="3" width="1" height="1" fill="#ffd700" />
      <rect x="6" y="2" width="1" height="1" fill="#ffb300" />
      <rect x="9" y="2" width="1" height="1" fill="#ffb300" />
      <rect x="10" y="3" width="1" height="1" fill="#ffd700" />
      <rect x="11" y="4" width="1" height="1" fill="#ffd700" />
      <rect x="12" y="5" width="1" height="1" fill="#ffd700" />
      <rect x="13" y="4" width="1" height="1" fill="#ffb300" />
      <rect x="14" y="3" width="1" height="1" fill="#ffb300" />
      <rect x="1" y="4" width="14" height="1" fill="#ffd700" />
      <rect x="2" y="5" width="12" height="1" fill="#ffd700" />
      <rect x="1" y="6" width="14" height="1" fill="#ffb300" />
      <rect x="1" y="7" width="14" height="1" fill="#ffb300" />
      {/* band */}
      <rect x="1" y="8" width="14" height="2" fill="#e69500" />
      <rect x="1" y="10" width="14" height="2" fill="#d4a017" />
      {/* jewels */}
      <rect x="4" y="6" width="2" height="2" fill="#dc2626" />
      <rect x="4" y="6" width="1" height="1" fill="#ef4444" />
      <rect x="10" y="6" width="2" height="2" fill="#2563eb" />
      <rect x="10" y="6" width="1" height="1" fill="#3b82f6" />
      <rect x="7" y="5" width="2" height="2" fill="#dc2626" />
      <rect x="7" y="5" width="1" height="1" fill="#f87171" />
      {/* VIP text */}
      <rect x="3" y="9" width="1" height="2" fill="#5a3a00" />
      <rect x="4" y="11" width="1" height="1" fill="#5a3a00" />
      <rect x="5" y="9" width="1" height="2" fill="#5a3a00" />
      <rect x="7" y="9" width="1" height="3" fill="#5a3a00" />
      <rect x="9" y="9" width="1" height="3" fill="#5a3a00" />
      <rect x="10" y="9" width="1" height="1" fill="#5a3a00" />
      <rect x="11" y="9" width="1" height="2" fill="#5a3a00" />
      <rect x="10" y="10" width="1" height="1" fill="#5a3a00" />
      {/* top gems */}
      <rect x="1" y="2" width="1" height="1" fill="#fef08a" />
      <rect x="7" y="0" width="1" height="1" fill="#fef08a" />
      <rect x="14" y="2" width="1" height="1" fill="#fef08a" />
      <rect x="2" y="5" width="2" height="1" fill="#ffe066" opacity="0.5" />
    </svg>
  );
}

/* ── ❤️ Poção de Vida — pote com coração vermelho ── */
export function PotionHpIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size * 0.8} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* cork */}
      <rect x="5" y="0" width="6" height="2" fill="#8B6914" />
      <rect x="5" y="0" width="3" height="1" fill="#a0801a" />
      {/* neck */}
      <rect x="5" y="2" width="6" height="2" fill="#d1d5db" />
      <rect x="5" y="2" width="2" height="2" fill="#e5e7eb" />
      {/* body */}
      <rect x="3" y="4" width="10" height="1" fill="#c8e6c9" />
      <rect x="2" y="5" width="12" height="12" fill="#4caf50" />
      <rect x="3" y="17" width="10" height="1" fill="#388e3c" />
      {/* glass shine */}
      <rect x="3" y="5" width="1" height="8" fill="#81c784" opacity="0.5" />
      <rect x="4" y="5" width="1" height="5" fill="#a5d6a7" opacity="0.3" />
      <rect x="12" y="6" width="1" height="4" fill="white" opacity="0.15" />
      {/* heart — big & centered */}
      <rect x="5" y="8" width="2" height="1" fill="#f44336" />
      <rect x="9" y="8" width="2" height="1" fill="#f44336" />
      <rect x="4" y="9" width="8" height="1" fill="#e53935" />
      <rect x="4" y="10" width="8" height="1" fill="#e53935" />
      <rect x="5" y="11" width="6" height="1" fill="#d32f2f" />
      <rect x="6" y="12" width="4" height="1" fill="#c62828" />
      <rect x="7" y="13" width="2" height="1" fill="#b71c1c" />
      {/* heart shine */}
      <rect x="5" y="8" width="1" height="1" fill="#ef9a9a" />
      <rect x="5" y="9" width="1" height="1" fill="#ef9a9a" />
    </svg>
  );
}

/* ── 💪 Elixir Força — pote com braço forte ── */
export function PotionAtkIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size * 0.8} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* cork */}
      <rect x="5" y="0" width="6" height="2" fill="#8B6914" />
      <rect x="5" y="0" width="3" height="1" fill="#a0801a" />
      {/* neck */}
      <rect x="5" y="2" width="6" height="2" fill="#d1d5db" />
      <rect x="5" y="2" width="2" height="2" fill="#e5e7eb" />
      {/* body */}
      <rect x="3" y="4" width="10" height="1" fill="#ffcdd2" />
      <rect x="2" y="5" width="12" height="12" fill="#e53935" />
      <rect x="3" y="17" width="10" height="1" fill="#c62828" />
      {/* glass shine */}
      <rect x="3" y="5" width="1" height="8" fill="#ef5350" opacity="0.5" />
      <rect x="4" y="5" width="1" height="5" fill="#ef9a9a" opacity="0.3" />
      <rect x="12" y="6" width="1" height="4" fill="white" opacity="0.15" />
      {/* arm / bicep — flexing */}
      {/* upper arm */}
      <rect x="5" y="10" width="2" height="4" fill="#ffb74d" />
      <rect x="5" y="10" width="1" height="1" fill="#ffe0b2" />
      {/* forearm going up */}
      <rect x="7" y="8" width="2" height="3" fill="#ffb74d" />
      {/* bicep bulge */}
      <rect x="7" y="7" width="3" height="1" fill="#ffa726" />
      <rect x="8" y="6" width="2" height="1" fill="#ffa726" />
      <rect x="9" y="7" width="1" height="1" fill="#ff9800" />
      {/* fist */}
      <rect x="7" y="8" width="1" height="1" fill="#ffe0b2" />
      <rect x="9" y="8" width="2" height="2" fill="#ffcc80" />
      {/* muscle line */}
      <rect x="6" y="11" width="1" height="2" fill="#ff8f00" opacity="0.5" />
    </svg>
  );
}

/* ── 🛡️ Escudo Mágico — pote com escudo ── */
export function PotionDefIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size * 0.8} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* cork */}
      <rect x="5" y="0" width="6" height="2" fill="#8B6914" />
      <rect x="5" y="0" width="3" height="1" fill="#a0801a" />
      {/* neck */}
      <rect x="5" y="2" width="6" height="2" fill="#d1d5db" />
      <rect x="5" y="2" width="2" height="2" fill="#e5e7eb" />
      {/* body */}
      <rect x="3" y="4" width="10" height="1" fill="#bbdefb" />
      <rect x="2" y="5" width="12" height="12" fill="#1e88e5" />
      <rect x="3" y="17" width="10" height="1" fill="#1565c0" />
      {/* glass shine */}
      <rect x="3" y="5" width="1" height="8" fill="#42a5f5" opacity="0.5" />
      <rect x="4" y="5" width="1" height="5" fill="#90caf9" opacity="0.3" />
      <rect x="12" y="6" width="1" height="4" fill="white" opacity="0.15" />
      {/* shield */}
      <rect x="5" y="7" width="6" height="1" fill="#e0e0e0" />
      <rect x="4" y="8" width="8" height="1" fill="#bdbdbd" />
      <rect x="4" y="9" width="8" height="1" fill="#e0e0e0" />
      <rect x="4" y="10" width="8" height="1" fill="#bdbdbd" />
      <rect x="5" y="11" width="6" height="1" fill="#9e9e9e" />
      <rect x="6" y="12" width="4" height="1" fill="#757575" />
      <rect x="7" y="13" width="2" height="1" fill="#616161" />
      {/* shield cross */}
      <rect x="7" y="8" width="2" height="4" fill="#42a5f5" />
      <rect x="5" y="9" width="6" height="1" fill="#42a5f5" />
      {/* shield shine */}
      <rect x="5" y="7" width="2" height="1" fill="#f5f5f5" />
      <rect x="5" y="8" width="1" height="1" fill="#f5f5f5" />
    </svg>
  );
}

/* ── 👢 Botas de Vento — bota com asas ── */
export function PotionSpdIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} style={{ imageRendering: 'pixelated' }}>
      {/* wing — top feathers */}
      <rect x="10" y="0" width="2" height="1" fill="#93c5fd" />
      <rect x="11" y="1" width="3" height="1" fill="#60a5fa" />
      <rect x="12" y="2" width="4" height="1" fill="#93c5fd" />
      <rect x="13" y="3" width="4" height="1" fill="#60a5fa" />
      <rect x="12" y="4" width="5" height="1" fill="#bfdbfe" />
      <rect x="11" y="5" width="5" height="1" fill="#93c5fd" />
      <rect x="10" y="6" width="5" height="1" fill="#60a5fa" />
      <rect x="9" y="7" width="4" height="1" fill="#3b82f6" />
      {/* wing highlight */}
      <rect x="12" y="2" width="1" height="1" fill="#dbeafe" />
      <rect x="13" y="3" width="1" height="1" fill="#dbeafe" />
      <rect x="12" y="4" width="1" height="1" fill="#eff6ff" />
      {/* wing feather tips */}
      <rect x="16" y="3" width="1" height="1" fill="#bfdbfe" />
      <rect x="17" y="4" width="1" height="1" fill="#93c5fd" opacity="0.6" />
      <rect x="16" y="5" width="1" height="1" fill="#60a5fa" opacity="0.5" />
      {/* boot — leg part */}
      <rect x="5" y="3" width="4" height="1" fill="#92400e" />
      <rect x="4" y="4" width="6" height="1" fill="#78350f" />
      <rect x="4" y="5" width="6" height="1" fill="#92400e" />
      <rect x="4" y="6" width="6" height="1" fill="#92400e" />
      <rect x="4" y="7" width="6" height="1" fill="#78350f" />
      {/* boot — ankle cuff */}
      <rect x="3" y="8" width="8" height="1" fill="#a16207" />
      <rect x="3" y="8" width="2" height="1" fill="#ca8a04" />
      {/* boot — foot */}
      <rect x="3" y="9" width="8" height="1" fill="#78350f" />
      <rect x="2" y="10" width="9" height="1" fill="#92400e" />
      <rect x="2" y="11" width="10" height="1" fill="#78350f" />
      <rect x="1" y="12" width="11" height="1" fill="#78350f" />
      {/* boot — sole */}
      <rect x="0" y="13" width="12" height="1" fill="#451a03" />
      <rect x="1" y="14" width="11" height="1" fill="#3b1a00" />
      {/* boot — toe */}
      <rect x="0" y="12" width="2" height="1" fill="#92400e" />
      {/* boot shine */}
      <rect x="5" y="4" width="1" height="3" fill="#a16207" opacity="0.5" />
      <rect x="3" y="10" width="1" height="2" fill="#a16207" opacity="0.3" />
      {/* boot buckle */}
      <rect x="6" y="8" width="2" height="1" fill="#fbbf24" />
      <rect x="6" y="8" width="1" height="1" fill="#fde68a" />
      {/* speed lines behind */}
      <rect x="0" y="6" width="3" height="1" fill="#93c5fd" opacity="0.5" />
      <rect x="0" y="8" width="2" height="1" fill="#60a5fa" opacity="0.4" />
      <rect x="0" y="10" width="1" height="1" fill="#93c5fd" opacity="0.3" />
    </svg>
  );
}

/* ── 💎 Gem ── */
export function GemIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 14 12" width={size} height={size * 0.857} style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="6" height="1" fill="#c084fc" />
      <rect x="2" y="1" width="10" height="1" fill="#a855f7" />
      <rect x="1" y="2" width="12" height="1" fill="#9333ea" />
      <rect x="4" y="0" width="2" height="1" fill="#e9d5ff" />
      <rect x="3" y="1" width="2" height="1" fill="#d8b4fe" />
      <rect x="0" y="3" width="14" height="1" fill="#7e22ce" />
      <rect x="1" y="4" width="12" height="1" fill="#9333ea" />
      <rect x="2" y="5" width="10" height="1" fill="#7e22ce" />
      <rect x="3" y="6" width="8" height="1" fill="#6b21a8" />
      <rect x="4" y="7" width="6" height="1" fill="#581c87" />
      <rect x="5" y="8" width="4" height="1" fill="#4c1d95" />
      <rect x="6" y="9" width="2" height="1" fill="#3b0764" />
      <rect x="2" y="4" width="1" height="2" fill="#c084fc" opacity="0.4" />
      <rect x="10" y="2" width="1" height="1" fill="#e9d5ff" opacity="0.3" />
    </svg>
  );
}

/* ── 💰 Coin ── */
export function CoinIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 14 14" width={size} height={size} style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="6" height="1" fill="#d4a017" />
      <rect x="2" y="1" width="10" height="1" fill="#d4a017" />
      <rect x="1" y="2" width="12" height="1" fill="#eab308" />
      <rect x="0" y="3" width="14" height="1" fill="#eab308" />
      <rect x="0" y="4" width="14" height="6" fill="#fbbf24" />
      <rect x="0" y="10" width="14" height="1" fill="#eab308" />
      <rect x="1" y="11" width="12" height="1" fill="#eab308" />
      <rect x="2" y="12" width="10" height="1" fill="#d4a017" />
      <rect x="4" y="13" width="6" height="1" fill="#d4a017" />
      <rect x="6" y="3" width="2" height="1" fill="#92400e" />
      <rect x="5" y="4" width="4" height="1" fill="#92400e" />
      <rect x="5" y="5" width="1" height="1" fill="#92400e" />
      <rect x="5" y="6" width="4" height="1" fill="#92400e" />
      <rect x="8" y="7" width="1" height="1" fill="#92400e" />
      <rect x="8" y="8" width="1" height="1" fill="#92400e" />
      <rect x="5" y="8" width="4" height="1" fill="#92400e" />
      <rect x="6" y="9" width="2" height="1" fill="#92400e" />
      <rect x="2" y="3" width="2" height="3" fill="#fde68a" opacity="0.4" />
      <rect x="1" y="4" width="1" height="2" fill="#fef9c3" opacity="0.3" />
    </svg>
  );
}
