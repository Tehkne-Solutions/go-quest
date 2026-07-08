import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";

type UnitSpriteProps = {
  role: CharacterRole;
  color: PlayerColor;
};

function palette(role: CharacterRole, color: PlayerColor) {
  const dark = color === "BLACK";

  const roleColors: Record<CharacterRole, { main: string; accent: string; glow: string; skin: string }> = {
    SCOUT: { main: dark ? "#203a2d" : "#2f6b3c", accent: "#76d66f", glow: "#69ff8a", skin: "#d7a36f" },
    HUNTER: { main: dark ? "#3b2b1e" : "#6b4a2c", accent: "#d89b4a", glow: "#ffb15d", skin: "#c98b62" },
    GUARD: { main: dark ? "#263044" : "#8790a0", accent: "#f3c76c", glow: "#8dbdff", skin: "#d8b17a" },
    LINK: { main: dark ? "#2d2548" : "#5d3d8f", accent: "#b987ff", glow: "#b66cff", skin: "#d8a782" },
    BUILDER: { main: dark ? "#4a2e1f" : "#996532", accent: "#ffcd70", glow: "#ffba4c", skin: "#c8865f" },
    RAIDER: { main: dark ? "#27351f" : "#5e7a35", accent: "#ff7045", glow: "#ff4a3d", skin: "#7aa84d" }
  };

  return roleColors[role];
}

export function UnitSprite({ role, color }: UnitSpriteProps) {
  const p = palette(role, color);
  const stroke = color === "BLACK" ? "#07080b" : "#2b241c";

  return (
    <svg className="unit-sprite" viewBox="0 0 96 128" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${role}-${color}`} cx="50%" cy="70%" r="48%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.56" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`armor-${role}-${color}`} x1="20%" x2="82%" y1="8%" y2="96%">
          <stop offset="0%" stopColor={p.accent} />
          <stop offset="42%" stopColor={p.main} />
          <stop offset="100%" stopColor="#0b0d11" />
        </linearGradient>
      </defs>

      <ellipse cx="48" cy="112" rx="32" ry="10" fill="#000" opacity="0.42" />
      <ellipse cx="48" cy="73" rx="41" ry="38" fill={`url(#glow-${role}-${color})`} />

      {role === "SCOUT" && (
        <g className="sprite-role sprite-scout">
          <path d="M24 62 C18 70 18 91 30 101 L40 95 C34 84 34 74 39 64 Z" fill="#162418" stroke={stroke} strokeWidth="2" />
          <path d="M72 62 C78 70 78 91 66 101 L56 95 C62 84 62 74 57 64 Z" fill="#162418" stroke={stroke} strokeWidth="2" />
          <path d="M29 41 C34 21 61 21 68 42 L60 56 H36 Z" fill={p.main} stroke={stroke} strokeWidth="2" />
          <path d="M35 38 L23 47 L39 50 Z" fill={p.accent} stroke={stroke} strokeWidth="2" />
          <path d="M61 38 L73 47 L57 50 Z" fill={p.accent} stroke={stroke} strokeWidth="2" />
          <circle cx="48" cy="43" r="13" fill={p.skin} stroke={stroke} strokeWidth="2" />
          <path d="M34 39 C43 31 55 31 64 39 C58 35 40 35 34 39 Z" fill="#111" opacity="0.55" />
          <path d="M31 59 C37 52 59 52 66 59 L61 92 C52 100 43 100 35 92 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M20 74 L5 93" stroke="#c8d6a0" strokeWidth="5" strokeLinecap="round" />
          <path d="M76 70 L91 58" stroke="#c8d6a0" strokeWidth="5" strokeLinecap="round" />
          <path d="M58 78 L83 35" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {role === "HUNTER" && (
        <g className="sprite-role sprite-hunter">
          <path d="M26 58 C18 70 20 91 32 103" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
          <path d="M70 58 C78 70 76 91 64 103" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
          <circle cx="48" cy="38" r="13" fill={p.skin} stroke={stroke} strokeWidth="2" />
          <path d="M34 34 C41 22 60 24 66 36 C55 31 45 31 34 34 Z" fill="#2a2018" stroke={stroke} strokeWidth="2" />
          <path d="M30 56 C39 48 58 48 67 56 L62 92 C53 101 42 101 34 92 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M21 44 C6 61 6 84 21 101" fill="none" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M22 45 L22 100" stroke="#f2d8a7" strokeWidth="1.5" />
          <path d="M60 58 L88 42" stroke="#d8bf77" strokeWidth="4" strokeLinecap="round" />
          <path d="M86 42 L78 38 L81 47 Z" fill={p.accent} />
          <path d="M35 76 L19 91" stroke="#5c3b22" strokeWidth="7" strokeLinecap="round" />
        </g>
      )}

      {role === "GUARD" && (
        <g className="sprite-role sprite-guard">
          <path d="M28 82 L20 106" stroke="#1d2028" strokeWidth="9" strokeLinecap="round" />
          <path d="M68 82 L76 106" stroke="#1d2028" strokeWidth="9" strokeLinecap="round" />
          <circle cx="48" cy="34" r="14" fill="#c9c7bc" stroke={stroke} strokeWidth="2" />
          <path d="M35 31 C38 17 58 17 62 31 L59 44 H38 Z" fill="#e4e1d2" stroke={stroke} strokeWidth="2" />
          <path d="M29 53 C37 43 59 43 68 53 L67 91 C58 101 39 101 29 91 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M66 55 C84 58 88 70 83 93 C77 102 68 107 61 109 C60 90 60 70 66 55 Z" fill="#d4d7dc" stroke={stroke} strokeWidth="3" />
          <path d="M70 67 L77 75 L69 84" fill="none" stroke={p.accent} strokeWidth="3" />
          <path d="M31 63 L13 83" stroke="#d9d1b2" strokeWidth="6" strokeLinecap="round" />
          <path d="M13 83 L8 104" stroke="#c7c7c7" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {role === "LINK" && (
        <g className="sprite-role sprite-link">
          <path d="M25 70 C16 84 17 99 31 109" fill="none" stroke="#251d3b" strokeWidth="8" strokeLinecap="round" />
          <path d="M71 70 C80 84 79 99 65 109" fill="none" stroke="#251d3b" strokeWidth="8" strokeLinecap="round" />
          <circle cx="48" cy="34" r="13" fill={p.skin} stroke={stroke} strokeWidth="2" />
          <path d="M33 37 C42 19 60 22 68 39 C58 31 44 31 33 37 Z" fill="#241630" stroke={stroke} strokeWidth="2" />
          <path d="M28 56 C38 43 58 43 68 56 L72 96 C59 106 38 106 25 96 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M21 61 C32 51 41 52 48 65 C56 80 66 82 78 72" fill="none" stroke={p.glow} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <circle cx="19" cy="59" r="8" fill={p.glow} opacity="0.9" />
          <circle cx="80" cy="71" r="8" fill="#69b9ff" opacity="0.9" />
          <path d="M48 62 L48 94" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {role === "BUILDER" && (
        <g className="sprite-role sprite-builder">
          <path d="M27 79 L20 106" stroke="#3a2418" strokeWidth="10" strokeLinecap="round" />
          <path d="M69 79 L76 106" stroke="#3a2418" strokeWidth="10" strokeLinecap="round" />
          <circle cx="48" cy="38" r="14" fill={p.skin} stroke={stroke} strokeWidth="2" />
          <path d="M33 32 C41 20 58 20 65 32 L62 42 H35 Z" fill="#7a4a25" stroke={stroke} strokeWidth="2" />
          <path d="M29 58 C37 49 59 49 67 58 L65 93 C55 102 41 102 31 93 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M70 63 L88 82" stroke="#8a542a" strokeWidth="8" strokeLinecap="round" />
          <path d="M84 71 L93 80 L83 91 L74 82 Z" fill={p.accent} stroke={stroke} strokeWidth="2" />
          <rect x="8" y="74" width="24" height="20" rx="4" fill="#7a4a25" stroke={stroke} strokeWidth="2" />
          <path d="M13 80 H27 M13 88 H27" stroke="#c99a52" strokeWidth="2" />
          <path d="M39 50 C45 58 54 58 60 50" stroke="#3a2418" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {role === "RAIDER" && (
        <g className="sprite-role sprite-raider">
          <path d="M26 80 L18 106" stroke="#27351f" strokeWidth="11" strokeLinecap="round" />
          <path d="M70 80 L78 106" stroke="#27351f" strokeWidth="11" strokeLinecap="round" />
          <circle cx="48" cy="38" r="15" fill={p.skin} stroke={stroke} strokeWidth="2" />
          <path d="M31 31 L19 18 M65 31 L77 18" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M31 44 C38 50 58 50 65 44" stroke="#1c2217" strokeWidth="4" strokeLinecap="round" />
          <path d="M25 58 C36 46 60 46 72 58 L70 94 C58 106 37 106 25 94 Z" fill={`url(#armor-${role}-${color})`} stroke={stroke} strokeWidth="2" />
          <path d="M73 62 L91 77" stroke="#5a3424" strokeWidth="8" strokeLinecap="round" />
          <path d="M87 70 L95 78 L83 91 L75 82 Z" fill="#c7c7c7" stroke={stroke} strokeWidth="2" />
          <path d="M24 63 L7 81" stroke="#5a3424" strokeWidth="8" strokeLinecap="round" />
          <path d="M6 77 L18 89" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
