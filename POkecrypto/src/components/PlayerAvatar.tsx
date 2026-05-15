import { AvatarClass, AvatarGender } from '../types/game';
import { getAvatarConfig } from '../data/avatars';

interface Props {
  gender: AvatarGender;
  avatarClass: AvatarClass;
  size?: number;
  direction?: 'down' | 'up' | 'left' | 'right';
}

export default function PlayerAvatar({ gender, avatarClass, size = 48 }: Props) {
  const cfg = getAvatarConfig(avatarClass);
  const c = cfg.colors;
  const isFem = gender === 'female';

  /* Pixel unit: the SVG is 32x40, each "pixel" is 2x2 for sharper look */
  return (
    <svg viewBox="0 0 32 40" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated', display: 'block' }}>

      {/* ══════════════ WARRIOR ══════════════ */}
      {avatarClass === 'warrior' && (<>
        {/* Helmet */}
        <rect x="10" y="1" width="12" height="2" fill="#888"/>
        <rect x="8" y="3" width="16" height="2" fill="#999"/>
        <rect x="8" y="5" width="16" height="2" fill="#888"/>
        <rect x="13" y="0" width="6" height="2" fill="#c0392b"/>
        <rect x="14" y="0" width="4" height="1" fill="#e74c3c"/>
        {/* Face */}
        <rect x="9" y="7" width="14" height="6" fill={c.skin}/>
        <rect x="10" y="7" width="12" height="1" fill={isFem ? '#f8c4c4' : c.skin}/>
        {/* Eyes */}
        <rect x="11" y="9" width="3" height="2" fill="white"/>
        <rect x="18" y="9" width="3" height="2" fill="white"/>
        <rect x="12" y="9" width="2" height="2" fill="#2c3e50"/>
        <rect x="19" y="9" width="2" height="2" fill="#2c3e50"/>
        <rect x="13" y="9" width="1" height="1" fill="white" opacity="0.7"/>
        <rect x="20" y="9" width="1" height="1" fill="white" opacity="0.7"/>
        {/* Mouth */}
        <rect x="14" y="12" width="4" height="1" fill="#c0846e" opacity="0.5"/>
        {/* Armor body */}
        <rect x="7" y="14" width="18" height="8" fill="#8b0000"/>
        <rect x="9" y="14" width="14" height="2" fill="#a52a2a"/>
        {/* Chest plate */}
        <rect x="11" y="16" width="10" height="4" fill="#bbb"/>
        <rect x="13" y="16" width="6" height="2" fill="#ddd"/>
        <rect x="14" y="17" width="4" height="1" fill="#eee"/>
        {/* Belt */}
        <rect x="7" y="22" width="18" height="2" fill="#5a3a00"/>
        <rect x="14" y="22" width="4" height="2" fill="#d4a017"/>
        <rect x="15" y="22" width="2" height="1" fill="#ffd700"/>
        {/* Legs */}
        <rect x="9" y="24" width="6" height="8" fill="#8b0000"/>
        <rect x="17" y="24" width="6" height="8" fill="#8b0000"/>
        {/* Knee guards */}
        <rect x="10" y="28" width="4" height="2" fill="#999"/>
        <rect x="18" y="28" width="4" height="2" fill="#999"/>
        {/* Boots */}
        <rect x="7" y="32" width="8" height="4" fill="#4a3a2a"/>
        <rect x="17" y="32" width="8" height="4" fill="#4a3a2a"/>
        <rect x="7" y="35" width="8" height="2" fill="#3a2a1a"/>
        <rect x="17" y="35" width="8" height="2" fill="#3a2a1a"/>
        {/* Boot tops */}
        <rect x="7" y="32" width="8" height="1" fill="#5a4a3a"/>
        <rect x="17" y="32" width="8" height="1" fill="#5a4a3a"/>
        {/* SWORD — right */}
        <rect x="26" y="2" width="2" height="14" fill="#ccc"/>
        <rect x="26" y="0" width="2" height="3" fill="#ddd"/>
        <rect x="27" y="1" width="1" height="2" fill="#eee"/>
        <rect x="25" y="14" width="4" height="2" fill="#8B6914"/>
        <rect x="26" y="16" width="2" height="2" fill="#5a3a00"/>
        {/* SHIELD — left */}
        <rect x="1" y="14" width="6" height="8" fill="#2563eb"/>
        <rect x="1" y="14" width="6" height="2" fill="#3b82f6"/>
        <rect x="2" y="15" width="4" height="1" fill="#60a5fa"/>
        <rect x="3" y="17" width="2" height="4" fill="#93c5fd"/>
        <rect x="1" y="22" width="6" height="1" fill="#1d4ed8"/>
        {/* Shield emblem */}
        <rect x="3" y="18" width="2" height="2" fill="#ffd700"/>
        {/* Arms */}
        <rect x="5" y="14" width="3" height="6" fill={c.skin}/>
        <rect x="24" y="14" width="3" height="6" fill={c.skin}/>
      </>)}

      {/* ══════════════ ARCHER ══════════════ */}
      {avatarClass === 'archer' && (<>
        {/* Hood */}
        <rect x="10" y="0" width="12" height="2" fill="#1a5a1a"/>
        <rect x="8" y="2" width="16" height="3" fill="#27ae60"/>
        <rect x="7" y="4" width="2" height="4" fill="#27ae60"/>
        <rect x="23" y="4" width="2" height="4" fill="#27ae60"/>
        <rect x="9" y="5" width="14" height="1" fill="#1e8449"/>
        {/* Face */}
        <rect x="9" y="6" width="14" height="6" fill={c.skin}/>
        {/* Eyes */}
        <rect x="11" y="8" width="3" height="2" fill="white"/>
        <rect x="18" y="8" width="3" height="2" fill="white"/>
        <rect x="12" y="8" width="2" height="2" fill="#2c3e50"/>
        <rect x="19" y="8" width="2" height="2" fill="#2c3e50"/>
        <rect x="13" y="8" width="1" height="1" fill="white" opacity="0.7"/>
        <rect x="20" y="8" width="1" height="1" fill="white" opacity="0.7"/>
        {isFem && <rect x="11" y="7" width="3" height="1" fill="#2c3e50" opacity="0.3"/>}
        <rect x="14" y="11" width="4" height="1" fill="#c0846e" opacity="0.4"/>
        {/* Leather vest */}
        <rect x="8" y="13" width="16" height="8" fill="#27ae60"/>
        <rect x="10" y="13" width="12" height="2" fill="#2ecc71"/>
        <rect x="14" y="15" width="4" height="5" fill="#1e8449"/>
        {/* Quiver strap */}
        <rect x="21" y="13" width="2" height="8" fill="#5a3a00"/>
        {/* Belt */}
        <rect x="8" y="21" width="16" height="2" fill="#5a3a00"/>
        <rect x="14" y="21" width="4" height="2" fill="#8B6914"/>
        {/* Legs */}
        <rect x="9" y="23" width="6" height="8" fill="#1a5a1a"/>
        <rect x="17" y="23" width="6" height="8" fill="#1a5a1a"/>
        {/* Boots */}
        <rect x="8" y="31" width="7" height="4" fill="#4a3a2a"/>
        <rect x="17" y="31" width="7" height="4" fill="#4a3a2a"/>
        <rect x="8" y="34" width="7" height="2" fill="#3a2a1a"/>
        <rect x="17" y="34" width="7" height="2" fill="#3a2a1a"/>
        {/* BOW — right */}
        <rect x="27" y="4" width="2" height="18" fill="#8B6914"/>
        <rect x="28" y="3" width="1" height="1" fill="#6a5010"/>
        <rect x="28" y="22" width="1" height="1" fill="#6a5010"/>
        {/* Bowstring */}
        <rect x="26" y="6" width="1" height="14" fill="#d1d5db" opacity="0.5"/>
        {/* Arrow nocked */}
        <rect x="25" y="10" width="3" height="1" fill="#aaa"/>
        <rect x="24" y="10" width="1" height="1" fill="#ddd"/>
        {/* QUIVER — back */}
        <rect x="23" y="5" width="3" height="8" fill="#5a3a00"/>
        <rect x="24" y="3" width="1" height="3" fill="#ccc"/>
        <rect x="25" y="4" width="1" height="2" fill="#ccc"/>
        <rect x="23" y="3" width="1" height="3" fill="#aaa"/>
        {/* Arms */}
        <rect x="5" y="14" width="4" height="5" fill={c.skin}/>
        <rect x="24" y="14" width="4" height="5" fill={c.skin}/>
      </>)}

      {/* ══════════════ MAGE ══════════════ */}
      {avatarClass === 'mage' && (<>
        {/* Hat tip */}
        <rect x="14" y="0" width="4" height="2" fill="#5b2c6f"/>
        <rect x="12" y="2" width="8" height="2" fill="#6c3483"/>
        <rect x="10" y="4" width="12" height="2" fill="#7d3c98"/>
        {/* Hat brim */}
        <rect x="5" y="6" width="22" height="2" fill="#5b2c6f"/>
        {/* Hat star */}
        <rect x="16" y="2" width="2" height="2" fill="#ffd700"/>
        <rect x="15" y="3" width="1" height="1" fill="#ffd700"/>
        <rect x="18" y="3" width="1" height="1" fill="#ffd700"/>
        {/* Face */}
        <rect x="9" y="8" width="14" height="6" fill={c.skin}/>
        {/* Eyes */}
        <rect x="11" y="10" width="3" height="2" fill="white"/>
        <rect x="18" y="10" width="3" height="2" fill="white"/>
        <rect x="12" y="10" width="2" height="2" fill="#6c3483"/>
        <rect x="19" y="10" width="2" height="2" fill="#6c3483"/>
        <rect x="13" y="10" width="1" height="1" fill="white" opacity="0.7"/>
        <rect x="20" y="10" width="1" height="1" fill="white" opacity="0.7"/>
        {isFem && <rect x="11" y="9" width="3" height="1" fill="#6c3483" opacity="0.3"/>}
        <rect x="14" y="13" width="4" height="1" fill="#c0846e" opacity="0.4"/>
        {/* Robe */}
        <rect x="7" y="15" width="18" height="10" fill="#8e44ad"/>
        <rect x="9" y="15" width="14" height="2" fill="#9b59b6"/>
        {/* Robe center line */}
        <rect x="15" y="17" width="2" height="7" fill="#6c3483"/>
        {/* Gold trim */}
        <rect x="7" y="15" width="1" height="10" fill="#d4a017" opacity="0.5"/>
        <rect x="24" y="15" width="1" height="10" fill="#d4a017" opacity="0.5"/>
        <rect x="7" y="24" width="18" height="1" fill="#d4a017" opacity="0.6"/>
        {/* Robe bottom flowing */}
        <rect x="6" y="25" width="8" height="8" fill="#7b1fa2"/>
        <rect x="18" y="25" width="8" height="8" fill="#7b1fa2"/>
        <rect x="6" y="33" width="20" height="4" fill="#6a1b9a"/>
        <rect x="8" y="36" width="16" height="1" fill="#5b1590"/>
        {/* STAFF — right */}
        <rect x="27" y="4" width="2" height="22" fill="#5a3a00"/>
        <rect x="27" y="3" width="2" height="2" fill="#6a4a10"/>
        {/* Staff orb */}
        <rect x="26" y="0" width="4" height="1" fill="#06b6d4"/>
        <rect x="25" y="1" width="6" height="2" fill="#22d3ee"/>
        <rect x="26" y="3" width="4" height="1" fill="#06b6d4"/>
        <rect x="27" y="1" width="2" height="1" fill="#67e8f9"/>
        {/* Orb glow */}
        <rect x="24" y="0" width="1" height="1" fill="#22d3ee" opacity="0.3"/>
        <rect x="31" y="2" width="1" height="1" fill="#22d3ee" opacity="0.3"/>
        {/* Arms */}
        <rect x="5" y="16" width="3" height="5" fill={c.skin}/>
        <rect x="24" y="16" width="3" height="5" fill={c.skin}/>
      </>)}

      {/* ══════════════ DWARF ══════════════ */}
      {avatarClass === 'dwarf' && (<>
        {/* Helmet */}
        <rect x="8" y="2" width="16" height="4" fill="#7f8c8d"/>
        <rect x="10" y="1" width="12" height="2" fill="#95a5a6"/>
        <rect x="9" y="3" width="14" height="1" fill="#aab5b7"/>
        {/* Helmet horns */}
        <rect x="4" y="0" width="4" height="4" fill="#d4a017"/>
        <rect x="4" y="0" width="2" height="2" fill="#ffd700"/>
        <rect x="24" y="0" width="4" height="4" fill="#d4a017"/>
        <rect x="26" y="0" width="2" height="2" fill="#ffd700"/>
        {/* Face — wider, shorter */}
        <rect x="8" y="6" width="16" height="5" fill={c.skin}/>
        {/* Eyes */}
        <rect x="10" y="7" width="3" height="2" fill="white"/>
        <rect x="19" y="7" width="3" height="2" fill="white"/>
        <rect x="11" y="7" width="2" height="2" fill="#5a3a00"/>
        <rect x="20" y="7" width="2" height="2" fill="#5a3a00"/>
        <rect x="12" y="7" width="1" height="1" fill="white" opacity="0.6"/>
        <rect x="21" y="7" width="1" height="1" fill="white" opacity="0.6"/>
        {/* Nose */}
        <rect x="15" y="9" width="2" height="1" fill="#d4956e"/>
        {/* BIG BEARD */}
        <rect x="7" y="11" width="18" height="2" fill={c.hair}/>
        <rect x="8" y="13" width="16" height="2" fill={c.hair}/>
        <rect x="10" y="15" width="12" height="2" fill={c.hair}/>
        <rect x="12" y="17" width="8" height="1" fill={c.hair}/>
        {/* Armor body */}
        <rect x="6" y="16" width="20" height="6" fill="#7f8c8d"/>
        <rect x="8" y="16" width="16" height="2" fill="#95a5a6"/>
        <rect x="12" y="18" width="8" height="3" fill="#aab5b7"/>
        <rect x="13" y="18" width="6" height="1" fill="#bbb"/>
        {/* Belt */}
        <rect x="6" y="22" width="20" height="2" fill="#5a3a00"/>
        <rect x="14" y="22" width="4" height="2" fill="#d4a017"/>
        <rect x="15" y="22" width="2" height="1" fill="#ffd700"/>
        {/* Short thick legs */}
        <rect x="8" y="24" width="6" height="6" fill="#5a5a5a"/>
        <rect x="18" y="24" width="6" height="6" fill="#5a5a5a"/>
        {/* Huge boots */}
        <rect x="5" y="30" width="9" height="6" fill="#4a3a2a"/>
        <rect x="18" y="30" width="9" height="6" fill="#4a3a2a"/>
        <rect x="5" y="34" width="9" height="2" fill="#3a2a1a"/>
        <rect x="18" y="34" width="9" height="2" fill="#3a2a1a"/>
        <rect x="5" y="30" width="9" height="1" fill="#6a5a4a"/>
        <rect x="18" y="30" width="9" height="1" fill="#6a5a4a"/>
        {/* BIG AXE — right */}
        <rect x="27" y="6" width="2" height="16" fill="#5a3a00"/>
        <rect x="26" y="2" width="6" height="4" fill="#bbb"/>
        <rect x="26" y="2" width="2" height="2" fill="#ddd"/>
        <rect x="30" y="4" width="2" height="2" fill="#999"/>
        <rect x="28" y="1" width="2" height="1" fill="#ccc"/>
        {/* Arms */}
        <rect x="4" y="16" width="3" height="6" fill={c.skin}/>
        <rect x="25" y="16" width="3" height="6" fill={c.skin}/>
      </>)}

      {/* ══════════════ ELF ══════════════ */}
      {avatarClass === 'elf' && (<>
        {/* Hair */}
        <rect x="10" y="1" width="12" height="2" fill={c.hair}/>
        <rect x="8" y="3" width="16" height="3" fill={c.hair}/>
        {isFem && <>
          <rect x="6" y="5" width="2" height="10" fill={c.hair}/>
          <rect x="24" y="5" width="2" height="10" fill={c.hair}/>
        </>}
        {/* Pointed ears */}
        <rect x="4" y="5" width="4" height="2" fill={c.skin}/>
        <rect x="2" y="4" width="3" height="2" fill={c.skin}/>
        <rect x="1" y="3" width="2" height="2" fill={c.skin}/>
        <rect x="24" y="5" width="4" height="2" fill={c.skin}/>
        <rect x="27" y="4" width="3" height="2" fill={c.skin}/>
        <rect x="29" y="3" width="2" height="2" fill={c.skin}/>
        {/* Tiara */}
        <rect x="9" y="4" width="14" height="2" fill="#1abc9c"/>
        <rect x="14" y="3" width="4" height="2" fill="#16a085"/>
        <rect x="15" y="2" width="2" height="2" fill="#ffd700"/>
        {/* Face */}
        <rect x="8" y="6" width="16" height="6" fill={c.skin}/>
        {/* Eyes — elegant */}
        <rect x="10" y="8" width="4" height="2" fill="white"/>
        <rect x="18" y="8" width="4" height="2" fill="white"/>
        <rect x="12" y="8" width="2" height="2" fill="#1abc9c"/>
        <rect x="20" y="8" width="2" height="2" fill="#1abc9c"/>
        <rect x="13" y="8" width="1" height="1" fill="white" opacity="0.7"/>
        <rect x="21" y="8" width="1" height="1" fill="white" opacity="0.7"/>
        <rect x="14" y="11" width="4" height="1" fill="#c0846e" opacity="0.3"/>
        {/* Elegant robe */}
        <rect x="7" y="13" width="18" height="9" fill="#1abc9c"/>
        <rect x="9" y="13" width="14" height="2" fill="#48d1a5"/>
        <rect x="14" y="15" width="4" height="6" fill="#16a085"/>
        {/* Gold trim */}
        <rect x="7" y="13" width="1" height="9" fill="#d4a017"/>
        <rect x="24" y="13" width="1" height="9" fill="#d4a017"/>
        <rect x="7" y="21" width="18" height="1" fill="#d4a017"/>
        {/* Legs */}
        <rect x="10" y="22" width="5" height="8" fill="#138d75"/>
        <rect x="17" y="22" width="5" height="8" fill="#138d75"/>
        {/* Elegant boots */}
        <rect x="8" y="30" width="7" height="5" fill="#0e6655"/>
        <rect x="17" y="30" width="7" height="5" fill="#0e6655"/>
        <rect x="8" y="34" width="7" height="2" fill="#0a5545"/>
        <rect x="17" y="34" width="7" height="2" fill="#0a5545"/>
        <rect x="8" y="30" width="7" height="1" fill="#16a085"/>
        <rect x="17" y="30" width="7" height="1" fill="#16a085"/>
        {/* DUAL DAGGERS */}
        <rect x="2" y="14" width="2" height="8" fill="#ccc"/>
        <rect x="2" y="12" width="2" height="2" fill="#eee"/>
        <rect x="2" y="12" width="1" height="1" fill="white"/>
        <rect x="28" y="14" width="2" height="8" fill="#ccc"/>
        <rect x="28" y="12" width="2" height="2" fill="#eee"/>
        <rect x="29" y="12" width="1" height="1" fill="white"/>
        {/* Arms */}
        <rect x="5" y="14" width="3" height="5" fill={c.skin}/>
        <rect x="24" y="14" width="3" height="5" fill={c.skin}/>
      </>)}

      {/* ══════════════ ZOMBIE ══════════════ */}
      {avatarClass === 'zombie' && (<>
        {/* Messy hair */}
        <rect x="10" y="2" width="8" height="2" fill="#4a4a4a"/>
        <rect x="8" y="3" width="6" height="2" fill="#4a4a4a"/>
        <rect x="19" y="3" width="4" height="2" fill="#4a4a4a"/>
        <rect x="22" y="4" width="2" height="2" fill="#4a4a4a"/>
        {/* Face — green skin */}
        <rect x="8" y="5" width="16" height="7" fill={c.skin}/>
        {/* Different eyes */}
        <rect x="10" y="7" width="3" height="2" fill="#f44336"/>
        <rect x="11" y="7" width="2" height="2" fill="#b71c1c"/>
        <rect x="19" y="7" width="3" height="2" fill="#e8e8e8"/>
        <rect x="20" y="7" width="2" height="2" fill="#666"/>
        {/* Scars */}
        <rect x="14" y="9" width="4" height="1" fill="#7a9c7a"/>
        <rect x="22" y="6" width="2" height="1" fill="#d32f2f"/>
        <rect x="17" y="6" width="1" height="3" fill="#7a9c7a"/>
        {/* Mouth — crooked */}
        <rect x="13" y="11" width="6" height="1" fill="#5a7a5a"/>
        <rect x="14" y="11" width="1" height="1" fill="#ddd"/>
        <rect x="18" y="11" width="1" height="1" fill="#ddd"/>
        {/* Torn shirt */}
        <rect x="7" y="13" width="18" height="8" fill="#5d4e37"/>
        <rect x="9" y="13" width="14" height="2" fill="#6b5b3e"/>
        {/* Exposed ribs */}
        <rect x="12" y="16" width="8" height="1" fill={c.skin}/>
        <rect x="12" y="18" width="8" height="1" fill={c.skin}/>
        <rect x="12" y="20" width="8" height="1" fill={c.skin}/>
        {/* Torn belt */}
        <rect x="7" y="21" width="18" height="1" fill="#3a3a2a"/>
        {/* Torn pants */}
        <rect x="8" y="22" width="6" height="8" fill="#4a3a2a"/>
        <rect x="18" y="22" width="6" height="8" fill="#4a3a2a"/>
        <rect x="10" y="28" width="4" height="2" fill="#5d4e37"/>
        <rect x="19" y="27" width="3" height="2" fill="#5d4e37"/>
        {/* Bare feet */}
        <rect x="7" y="30" width="7" height="4" fill={c.skin}/>
        <rect x="18" y="30" width="7" height="4" fill={c.skin}/>
        <rect x="7" y="33" width="7" height="1" fill="#8aaa86"/>
        <rect x="18" y="33" width="7" height="1" fill="#8aaa86"/>
        {/* BONE weapon — left */}
        <rect x="2" y="10" width="2" height="12" fill="#e8e8d0"/>
        <rect x="1" y="8" width="4" height="2" fill="#d8d8c0"/>
        <rect x="1" y="22" width="4" height="2" fill="#d8d8c0"/>
        <rect x="2" y="14" width="2" height="1" fill="#c8c8b0"/>
        {/* Drooping arm — right */}
        <rect x="26" y="14" width="3" height="8" fill={c.skin}/>
        <rect x="27" y="22" width="2" height="4" fill={c.skin}/>
        <rect x="28" y="24" width="1" height="2" fill="#8aaa86"/>
        {/* Left arm */}
        <rect x="4" y="14" width="4" height="6" fill={c.skin}/>
      </>)}

      {/* ══════════════ VAMPIRE ══════════════ */}
      {avatarClass === 'vampire' && (<>
        {/* Slick hair */}
        <rect x="9" y="1" width="14" height="2" fill="#1a1a2e"/>
        <rect x="8" y="3" width="16" height="3" fill="#1a1a2e"/>
        <rect x="24" y="5" width="2" height="3" fill="#1a1a2e"/>
        <rect x="7" y="5" width="2" height="4" fill="#1a1a2e"/>
        {/* Widow's peak */}
        <rect x="14" y="3" width="4" height="1" fill="#2a2a4e"/>
        {/* Pale face */}
        <rect x="9" y="6" width="14" height="6" fill={c.skin}/>
        {/* Red eyes */}
        <rect x="11" y="8" width="3" height="2" fill="#1a0000"/>
        <rect x="18" y="8" width="3" height="2" fill="#1a0000"/>
        <rect x="12" y="8" width="2" height="2" fill="#e74c3c"/>
        <rect x="19" y="8" width="2" height="2" fill="#e74c3c"/>
        <rect x="12" y="8" width="1" height="1" fill="#ff6b6b"/>
        <rect x="19" y="8" width="1" height="1" fill="#ff6b6b"/>
        {/* Mouth + FANGS */}
        <rect x="13" y="11" width="6" height="1" fill="#8a6060"/>
        <rect x="13" y="11" width="2" height="2" fill="white"/>
        <rect x="17" y="11" width="2" height="2" fill="white"/>
        <rect x="14" y="12" width="1" height="1" fill="#eee"/>
        <rect x="17" y="12" width="1" height="1" fill="#eee"/>
        {/* High collar cape */}
        <rect x="5" y="11" width="4" height="4" fill="#2c2c54"/>
        <rect x="23" y="11" width="4" height="4" fill="#2c2c54"/>
        {/* Cape body */}
        <rect x="4" y="14" width="24" height="10" fill="#2c2c54"/>
        <rect x="6" y="14" width="20" height="2" fill="#3d3d6e"/>
        {/* Vest underneath */}
        <rect x="10" y="16" width="12" height="6" fill="#1a1a2e"/>
        <rect x="14" y="16" width="4" height="6" fill="#c0392b"/>
        <rect x="15" y="16" width="2" height="1" fill="#e74c3c"/>
        {/* Medallion */}
        <rect x="14" y="16" width="4" height="2" fill="#d4a017"/>
        <rect x="15" y="16" width="2" height="1" fill="#ffd700"/>
        {/* Cape draping long */}
        <rect x="3" y="24" width="5" height="12" fill="#2c2c54"/>
        <rect x="24" y="24" width="5" height="12" fill="#2c2c54"/>
        <rect x="3" y="34" width="5" height="2" fill="#1a1a3e"/>
        <rect x="24" y="34" width="5" height="2" fill="#1a1a3e"/>
        {/* Legs */}
        <rect x="10" y="24" width="5" height="8" fill="#1a1a2e"/>
        <rect x="17" y="24" width="5" height="8" fill="#1a1a2e"/>
        {/* Boots */}
        <rect x="8" y="32" width="7" height="4" fill="#0d0d1e"/>
        <rect x="17" y="32" width="7" height="4" fill="#0d0d1e"/>
        <rect x="8" y="32" width="7" height="1" fill="#2c2c54"/>
        <rect x="17" y="32" width="7" height="1" fill="#2c2c54"/>
        {/* Arms (pale) */}
        <rect x="7" y="16" width="3" height="5" fill={c.skin}/>
        <rect x="22" y="16" width="3" height="5" fill={c.skin}/>
      </>)}

      {/* ══════════════ VIKING ══════════════ */}
      {avatarClass === 'viking' && (<>
        {/* Helmet */}
        <rect x="9" y="3" width="14" height="4" fill="#6c5b3e"/>
        <rect x="10" y="2" width="12" height="2" fill="#7a6a4e"/>
        <rect x="11" y="3" width="10" height="1" fill="#8a7a5e"/>
        {/* BIG HORNS */}
        <rect x="3" y="0" width="6" height="2" fill="#e8d8a0"/>
        <rect x="3" y="2" width="4" height="3" fill="#d4c890"/>
        <rect x="1" y="0" width="3" height="2" fill="#f0e8c0"/>
        <rect x="0" y="0" width="2" height="1" fill="#faf0d0"/>
        <rect x="23" y="0" width="6" height="2" fill="#e8d8a0"/>
        <rect x="25" y="2" width="4" height="3" fill="#d4c890"/>
        <rect x="28" y="0" width="3" height="2" fill="#f0e8c0"/>
        <rect x="30" y="0" width="2" height="1" fill="#faf0d0"/>
        {/* Face */}
        <rect x="9" y="7" width="14" height="5" fill={c.skin}/>
        {/* Eyes */}
        <rect x="11" y="8" width="3" height="2" fill="white"/>
        <rect x="18" y="8" width="3" height="2" fill="white"/>
        <rect x="12" y="8" width="2" height="2" fill="#3a6a8a"/>
        <rect x="19" y="8" width="2" height="2" fill="#3a6a8a"/>
        <rect x="13" y="8" width="1" height="1" fill="white" opacity="0.6"/>
        <rect x="20" y="8" width="1" height="1" fill="white" opacity="0.6"/>
        {/* BIG BEARD */}
        <rect x="8" y="11" width="16" height="2" fill={c.hair}/>
        <rect x="9" y="13" width="14" height="2" fill={c.hair}/>
        <rect x="11" y="15" width="10" height="2" fill={c.hair}/>
        <rect x="13" y="17" width="6" height="1" fill={c.hair}/>
        {/* Braided detail */}
        <rect x="14" y="14" width="1" height="3" fill="#b48a36"/>
        <rect x="17" y="14" width="1" height="3" fill="#b48a36"/>
        {/* Fur armor */}
        <rect x="6" y="16" width="20" height="6" fill="#6c5b3e"/>
        <rect x="8" y="16" width="16" height="2" fill="#7a6a4e"/>
        {/* Fur trim top */}
        <rect x="6" y="16" width="20" height="2" fill="#b8a070"/>
        <rect x="7" y="16" width="18" height="1" fill="#c8b080"/>
        {/* Chest cross straps */}
        <rect x="14" y="18" width="4" height="4" fill="#8B6914"/>
        <rect x="15" y="18" width="2" height="2" fill="#a07a1a"/>
        {/* Belt */}
        <rect x="6" y="22" width="20" height="2" fill="#5a3a00"/>
        <rect x="14" y="22" width="4" height="2" fill="#d4a017"/>
        <rect x="15" y="22" width="2" height="1" fill="#ffd700"/>
        {/* Fur kilt */}
        <rect x="8" y="24" width="6" height="6" fill="#5a4a30"/>
        <rect x="18" y="24" width="6" height="6" fill="#5a4a30"/>
        <rect x="8" y="24" width="6" height="1" fill="#6a5a40"/>
        <rect x="18" y="24" width="6" height="1" fill="#6a5a40"/>
        {/* Fur boots */}
        <rect x="6" y="30" width="8" height="6" fill="#4a3a1a"/>
        <rect x="18" y="30" width="8" height="6" fill="#4a3a1a"/>
        <rect x="6" y="30" width="8" height="2" fill="#8a7a5a"/>
        <rect x="18" y="30" width="8" height="2" fill="#8a7a5a"/>
        <rect x="7" y="30" width="6" height="1" fill="#9a8a6a"/>
        <rect x="19" y="30" width="6" height="1" fill="#9a8a6a"/>
        <rect x="6" y="34" width="8" height="2" fill="#3a2a10"/>
        <rect x="18" y="34" width="8" height="2" fill="#3a2a10"/>
        {/* BIG AXE — right */}
        <rect x="27" y="8" width="2" height="16" fill="#5a3a00"/>
        <rect x="26" y="4" width="6" height="4" fill="#aaa"/>
        <rect x="26" y="4" width="2" height="2" fill="#ccc"/>
        <rect x="30" y="6" width="2" height="2" fill="#888"/>
        <rect x="28" y="3" width="2" height="1" fill="#bbb"/>
        {/* ROUND SHIELD — left */}
        <rect x="0" y="14" width="7" height="8" fill="#6c5b3e"/>
        <rect x="1" y="14" width="5" height="2" fill="#8a7a5a"/>
        <rect x="1" y="22" width="5" height="1" fill="#5a4a30"/>
        {/* Shield boss */}
        <rect x="2" y="17" width="3" height="3" fill="#d4a017"/>
        <rect x="3" y="17" width="1" height="1" fill="#ffd700"/>
        {/* Shield rim */}
        <rect x="0" y="14" width="1" height="8" fill="#5a4a30"/>
        <rect x="6" y="14" width="1" height="8" fill="#5a4a30"/>
        {/* Arms */}
        <rect x="4" y="16" width="3" height="6" fill={c.skin}/>
        <rect x="25" y="16" width="3" height="6" fill={c.skin}/>
      </>)}

      {/* ══════════════ FEMININE OVERLAY ══════════════ */}
      {isFem && (<>
        {/* ── LONG FLOWING HAIR — both sides, very visible ── */}
        {/* Left hair — thick, long, flowing */}
        <rect x="5" y="5" width="4" height="2" fill={c.hair}/>
        <rect x="4" y="7" width="4" height="4" fill={c.hair}/>
        <rect x="3" y="11" width="4" height="5" fill={c.hair}/>
        <rect x="4" y="16" width="3" height="4" fill={c.hair}/>
        <rect x="5" y="20" width="2" height="3" fill={c.hair}/>
        <rect x="6" y="23" width="1" height="2" fill={c.hair}/>
        {/* Right hair — thick, long, flowing */}
        <rect x="23" y="5" width="4" height="2" fill={c.hair}/>
        <rect x="24" y="7" width="4" height="4" fill={c.hair}/>
        <rect x="25" y="11" width="4" height="5" fill={c.hair}/>
        <rect x="25" y="16" width="3" height="4" fill={c.hair}/>
        <rect x="25" y="20" width="2" height="3" fill={c.hair}/>
        <rect x="25" y="23" width="1" height="2" fill={c.hair}/>
        {/* Hair highlights / shine streaks */}
        <rect x="5" y="7" width="1" height="6" fill="white" opacity="0.15"/>
        <rect x="6" y="9" width="1" height="4" fill="white" opacity="0.08"/>
        <rect x="26" y="7" width="1" height="6" fill="white" opacity="0.15"/>
        <rect x="25" y="9" width="1" height="4" fill="white" opacity="0.08"/>
        {/* Hair tips — slightly lighter */}
        <rect x="5" y="21" width="2" height="2" fill={c.hair} opacity="0.7"/>
        <rect x="25" y="21" width="2" height="2" fill={c.hair} opacity="0.7"/>

        {/* ── BANGS / FRINGE on forehead ── */}
        <rect x="9" y="6" width="5" height="1" fill={c.hair}/>
        <rect x="18" y="6" width="5" height="1" fill={c.hair}/>
        <rect x="10" y="7" width="3" height="1" fill={c.hair} opacity="0.6"/>
        <rect x="19" y="7" width="3" height="1" fill={c.hair} opacity="0.6"/>

        {/* ── EYELASHES — double thick, curled ── */}
        <rect x="10" y="8" width="4" height="1" fill="#1a1a2e"/>
        <rect x="18" y="8" width="4" height="1" fill="#1a1a2e"/>
        <rect x="10" y="7" width="1" height="1" fill="#1a1a2e" opacity="0.5"/>
        <rect x="21" y="7" width="1" height="1" fill="#1a1a2e" opacity="0.5"/>
        {avatarClass === 'mage' && <>
          <rect x="10" y="9" width="4" height="1" fill="#1a1a2e"/>
          <rect x="18" y="9" width="4" height="1" fill="#1a1a2e"/>
        </>}

        {/* ── LIPS — fuller, pink ── */}
        <rect x="13" y="11" width="6" height="1" fill="#e07a8a" opacity="0.6"/>
        <rect x="14" y="12" width="4" height="1" fill="#d06a7a" opacity="0.35"/>
        {avatarClass === 'mage' && <>
          <rect x="13" y="13" width="6" height="1" fill="#e07a8a" opacity="0.6"/>
        </>}

        {/* ── BLUSH on cheeks ── */}
        <rect x="10" y="10" width="2" height="1" fill="#f9a8d4" opacity="0.3"/>
        <rect x="20" y="10" width="2" height="1" fill="#f9a8d4" opacity="0.3"/>

        {/* ── WAIST CINCH — slimmer body ── */}
        <rect x="8" y="19" width="1" height="3" fill="#0b0b20"/>
        <rect x="23" y="19" width="1" height="3" fill="#0b0b20"/>

        {/* ── HAIR ACCESSORY — depends on class ── */}
        {/* Flower for non-helmet classes */}
        {!['warrior','dwarf','viking'].includes(avatarClass) && (<>
          <rect x="21" y="3" width="4" height="4" fill="#f472b6"/>
          <rect x="22" y="2" width="2" height="1" fill="#f9a8d4"/>
          <rect x="21" y="4" width="1" height="1" fill="#fbcfe8"/>
          <rect x="24" y="4" width="1" height="1" fill="#fbcfe8"/>
          <rect x="22" y="3" width="2" height="2" fill="#fce7f3"/>
          <rect x="22" y="6" width="2" height="1" fill="#f472b6"/>
          {/* Flower center */}
          <rect x="23" y="4" width="1" height="1" fill="#fbbf24"/>
        </>)}
        {/* Ribbon bow for helmet classes */}
        {['warrior','dwarf','viking'].includes(avatarClass) && (<>
          <rect x="12" y="0" width="2" height="1" fill="#f472b6"/>
          <rect x="18" y="0" width="2" height="1" fill="#f472b6"/>
          <rect x="14" y="0" width="4" height="1" fill="#ec4899"/>
        </>)}

        {/* ── EARRINGS ── */}
        {!['warrior','dwarf','viking'].includes(avatarClass) && (<>
          <rect x="8" y="10" width="1" height="2" fill="#fbbf24"/>
          <rect x="23" y="10" width="1" height="2" fill="#fbbf24"/>
          <rect x="8" y="12" width="1" height="1" fill="#ffd700"/>
          <rect x="23" y="12" width="1" height="1" fill="#ffd700"/>
        </>)}
      </>)}

      {/* ══════════════ MASCULINE OVERLAY ══════════════ */}
      {!isFem && (<>
        {/* ── THICK EYEBROWS ── */}
        {!['zombie'].includes(avatarClass) && (<>
          <rect x="10" y="7" width="4" height="1" fill="#2a2a2a" opacity="0.5"/>
          <rect x="18" y="7" width="4" height="1" fill="#2a2a2a" opacity="0.5"/>
          <rect x="11" y="7" width="3" height="1" fill="#1a1a1a" opacity="0.3"/>
          <rect x="19" y="7" width="3" height="1" fill="#1a1a1a" opacity="0.3"/>
          {avatarClass === 'mage' && <>
            <rect x="10" y="9" width="4" height="1" fill="#2a2a2a" opacity="0.5"/>
            <rect x="18" y="9" width="4" height="1" fill="#2a2a2a" opacity="0.5"/>
          </>}
        </>)}

        {/* ── WIDER JAW / STUBBLE for non-bearded, non-helmet ── */}
        {!['warrior','dwarf','viking','zombie'].includes(avatarClass) && (<>
          {/* Stubble dots */}
          <rect x="9" y="11" width="1" height="1" fill="#555" opacity="0.15"/>
          <rect x="11" y="12" width="1" height="1" fill="#555" opacity="0.12"/>
          <rect x="13" y="11" width="1" height="1" fill="#555" opacity="0.1"/>
          <rect x="18" y="11" width="1" height="1" fill="#555" opacity="0.15"/>
          <rect x="20" y="12" width="1" height="1" fill="#555" opacity="0.12"/>
          <rect x="22" y="11" width="1" height="1" fill="#555" opacity="0.1"/>
          {/* Stronger jawline */}
          <rect x="8" y="12" width="2" height="1" fill={c.skin}/>
          <rect x="22" y="12" width="2" height="1" fill={c.skin}/>
        </>)}

        {/* ── SCAR for warrior/viking ── */}
        {['warrior','viking'].includes(avatarClass) && (<>
          <rect x="18" y="9" width="1" height="3" fill="#c0846e" opacity="0.4"/>
          <rect x="19" y="10" width="1" height="1" fill="#c0846e" opacity="0.3"/>
        </>)}

        {/* ── ADAM'S APPLE hint ── */}
        {!['dwarf','zombie'].includes(avatarClass) && (
          <rect x="15" y="12" width="2" height="1" fill={c.skin} opacity="0.8"/>
        )}
      </>)}
    </svg>
  );
}
