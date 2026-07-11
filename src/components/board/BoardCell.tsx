import type { BoardCell as BoardCellType, PlayerColor, Position } from "../../types/game";
import { FormationCamp } from "./FormationCamp";
import { StoneView } from "./StoneView";

type BoardCellProps = {
  cell: BoardCellType;
  isExpected?: boolean;
  isFormation?: boolean;
  isSelected?: boolean;
  onClick: (position: Position) => void;
};

export function BoardCell({
  cell,
  isExpected = false,
  isFormation = false,
  isSelected = false,
  onClick
}: BoardCellProps) {
  const stoneColor = cell.state === "EMPTY" ? undefined : (cell.state as PlayerColor);

  return (
    <button
      className={[
        "board-cell",
        isExpected ? "board-cell--target" : "",
        isFormation ? "board-cell--formation" : "",
        isSelected ? "board-cell--selected" : ""
      ].join(" ")}
      type="button"
      onClick={() => onClick(cell.position)}
      aria-label={`Casa x:${cell.position.x}, y:${cell.position.y}`}
    >
      <span className="intersection" />
      <FormationCamp active={isFormation} />
      {stoneColor && (
        <StoneView
          color={stoneColor}
          character={cell.character}
          formation={isFormation}
          selected={isSelected}
        />
      )}
    </button>
  );
}
