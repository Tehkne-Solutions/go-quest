import type { BoardCell as BoardCellType, Position } from "../../types/game";
import { StoneView } from "./StoneView";

type BoardCellProps = {
  cell: BoardCellType;
  isExpected?: boolean;
  isFormation?: boolean;
  onClick: (position: Position) => void;
};

export function BoardCell({
  cell,
  isExpected = false,
  isFormation = false,
  onClick
}: BoardCellProps) {
  const isEmpty = cell.state === "EMPTY";
  const roleClass = cell.character ? `board-cell--${cell.character.role.toLowerCase()}` : "";

  return (
    <button
      className={`board-cell ${isExpected ? "board-cell--target" : ""} ${isFormation ? "board-cell--formation" : ""} ${roleClass}`}
      type="button"
      onClick={() => onClick(cell.position)}
      aria-label={`Casa x:${cell.position.x}, y:${cell.position.y}`}
    >
      <span className="intersection" />
      {isFormation && <span className="camp-marker" aria-hidden="true" />}
      {!isEmpty && <StoneView color={cell.state} character={cell.character} formation={isFormation} />}
    </button>
  );
}
