import type { Board, Position } from "../types/game";
import { getNeighbors } from "./getNeighbors";

export function getStoneLiberties(board: Board, position: Position): Position[] {
  return getNeighbors(board, position).filter((neighbor) => {
    const cell = board[neighbor.y][neighbor.x];
    return cell.state === "EMPTY";
  });
}
