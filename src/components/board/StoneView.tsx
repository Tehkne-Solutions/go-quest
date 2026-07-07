import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
};

export function StoneView({ color }: StoneViewProps) {
  const label = `Unidade ${color === "BLACK" ? "preta" : "branca"}`;

  return (
    <span className={`stone stone--${color.toLowerCase()} stone--unit`} aria-label={label}>
      <span className="stone-unit-head" />
      <span className="stone-unit-body" />
    </span>
  );
}
