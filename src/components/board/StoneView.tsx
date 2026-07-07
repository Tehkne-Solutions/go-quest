import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
};

export function StoneView({ color }: StoneViewProps) {
  const label = `Unidade ${color === "BLACK" ? "preta" : "branca"}`;

  return (
    <span className={`unit-piece unit-piece--${color.toLowerCase()}`} aria-label={label}>
      <span className="unit-piece__head" />
      <span className="unit-piece__body" />
    </span>
  );
}
