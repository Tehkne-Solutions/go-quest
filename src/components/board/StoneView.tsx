import type { StoneCharacter } from "../../types/character";
import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
  character?: StoneCharacter;
  formation?: boolean;
};

const roleIcon: Record<string, string> = {
  SCOUT: "✦",
  HUNTER: "➶",
  GUARD: "◆",
  LINK: "✧",
  BUILDER: "⚙",
  RAIDER: "▲"
};

export function StoneView({ color, character, formation = false }: StoneViewProps) {
  const label = character
    ? `${character.name} - ${character.title}`
    : `Unidade ${color === "BLACK" ? "preta" : "branca"}`;
  const initial = character?.name.slice(0, 1) ?? "";
  const role = character?.role ?? "SCOUT";

  return (
    <span
      className={`stone stone--${color.toLowerCase()} stone--unit unit-role-${role.toLowerCase()} ${formation ? "stone--formation" : ""}`}
      aria-label={label}
      title={label}
    >
      <span className="unit-shadow" />
      <span className="unit-aura" />
      <span className="stone-unit-head" />
      <span className="stone-unit-body" />
      <span className="stone-unit-weapon">{roleIcon[role]}</span>
      <span className="stone-unit-initial">{initial}</span>
    </span>
  );
}
