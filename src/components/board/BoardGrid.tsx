import type { Board, Position } from "../../types/game";
import { BoardCell } from "./BoardCell";
import type { BoardCamera } from "./CameraControls";

type BoardGridProps = {
  board: Board;
  expectedMove?: Position;
  showTarget: boolean;
  camera?: BoardCamera;
  selectedPosition?: Position;
  onCellClick: (position: Position) => void;
};

function samePosition(a?: Position, b?: Position): boolean {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

function hasConnectedAlly(board: Board, position: Position): boolean {
  const cell = board[position.y][position.x];

  if (cell.state === "EMPTY") return false;

  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  return directions.some((direction) => {
    const y = position.y + direction.y;
    const x = position.x + direction.x;
    const neighbor = board[y]?.[x];
    return neighbor?.state === cell.state;
  });
}

export function BoardGrid({
  board,
  expectedMove,
  showTarget,
  camera = "iso",
  selectedPosition,
  onCellClick
}: BoardGridProps) {
  return (
    <div className={`board-stage board-stage--${camera}`}>
      <div className="board-grid" role="grid" aria-label="Tabuleiro 5 por 5">
        {board.flatMap((row) =>
          row.map((cell) => (
            <BoardCell
              key={`${cell.position.x}-${cell.position.y}`}
              cell={cell}
              isExpected={showTarget && samePosition(cell.position, expectedMove)}
              isFormation={hasConnectedAlly(board, cell.position)}
              isSelected={samePosition(cell.position, selectedPosition)}
              onClick={onCellClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
