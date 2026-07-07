import type { BoardCell as BoardCellType, Position } from "../../types/game";
import { StoneView } from "./StoneView";

type BoardCellProps = {
  cell: BoardCellType;
  isExpected?: boolean;
  onClick: (position: Position) => void;
};

export function BoardCell({ cell, isExpected = false, onClick }: BoardCellProps) {
  const isEmpty = cell.state === "EMPTY";

  return (
    <button
      className={`board-cell ${isExpected ? "board-cell--target" : ""}`}
      type="button"
      onClick={() => onClick(cell.position)}
      aria-label={`Casa x:${cell.position.x}, y:${cell.position.y}`}
    >
      <span className="intersection" />
      {!isEmpty && <StoneView color={cell.state} character={cell.character} />}
    </button>
  );
}
