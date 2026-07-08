import type { CharacterRole, StoneCharacter } from "../../types/character";
import type { PlayerColor } from "../../types/game";
import { UnitSprite } from "./UnitSprite";

type StoneViewProps = {
  color: PlayerColor;
  character?: StoneCharacter;
  formation?: boolean;
};

export function StoneView({ color, character, formation = false }: StoneViewProps) {
  const label = character
    ? `${character.name} - ${character.title}`
    : `Unidade ${color === "BLACK" ? "preta" : "branca"}`;
  const role: CharacterRole = character?.role ?? "SCOUT";

  return (
    <span
      className={`stone stone--${color.toLowerCase()} stone--unit unit-role-${role.toLowerCase()} ${formation ? "stone--formation" : ""}`}
      aria-label={label}
      title={label}
    >
      <UnitSprite role={role} color={color} />
    </span>
  );
}
