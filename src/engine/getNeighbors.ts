import type { Board, Position } from "../types/game";

export const directions: Position[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];

export function isInsideBoard(board: Board, position: Position): boolean {
  const size = board.length;

  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < size &&
    position.y < size
  );
}

export function getNeighbors(board: Board, position: Position): Position[] {
  return directions
    .map((direction) => ({ x: position.x + direction.x, y: position.y + direction.y }))
    .filter((nextPosition) => isInsideBoard(board, nextPosition));
}
