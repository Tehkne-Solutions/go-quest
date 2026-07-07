import type { StoneCharacter } from "../../types/character";
import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
  character?: StoneCharacter;
};

export function StoneView({ color, character }: StoneViewProps) {
  const label = character
    ? `${character.name} - ${character.title}`
    : `Unidade ${color === "BLACK" ? "preta" : "branca"}`;
  const initial = character?.name.slice(0, 1) ?? "";

  return (
    <span className={`stone stone--${color.toLowerCase()} stone--unit`} aria-label={label} title={label}>
      <span className="stone-unit-head" />
      <span className="stone-unit-body" />
      <span className="stone-unit-initial">{initial}</span>
    </span>
  );
}
