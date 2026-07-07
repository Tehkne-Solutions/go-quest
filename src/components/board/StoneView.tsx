import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
};

export function StoneView({ color }: StoneViewProps) {
  return (
    <span
      className={`stone stone--${color.toLowerCase()}`}
      aria-label={`Pedra ${color === "BLACK" ? "preta" : "branca"}`}
    />
  );
}
