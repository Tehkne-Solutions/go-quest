import type { Board, Position } from "../../types/game";
import { BoardCell } from "./BoardCell";

type BoardGridProps = {
  board: Board;
  expectedMove?: Position;
  showTarget: boolean;
  onCellClick: (position: Position) => void;
};

function samePosition(a?: Position, b?: Position): boolean {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

export function BoardGrid({
  board,
  expectedMove,
  showTarget,
  onCellClick
}: BoardGridProps) {
  return (
    <div className="board-grid" role="grid" aria-label="Tabuleiro 5 por 5">
      {board.flatMap((row) =>
        row.map((cell) => (
          <BoardCell
            key={`${cell.position.x}-${cell.position.y}`}
            cell={cell}
            isExpected={showTarget && samePosition(cell.position, expectedMove)}
            onClick={onCellClick}
          />
        ))
      )}
    </div>
  );
}
