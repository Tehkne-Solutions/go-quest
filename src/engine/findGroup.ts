import type { Board, PlayerColor, Position, StoneGroup } from "../types/game";
import { getNeighbors } from "./getNeighbors";

function key(position: Position): string {
  return `${position.x},${position.y}`;
}

export function findGroup(board: Board, start: Position): StoneGroup {
  const startCell = board[start.y][start.x];

  if (startCell.state === "EMPTY") {
    throw new Error("Não existe unidade nessa posição.");
  }

  const color = startCell.state as PlayerColor;
  const visited = new Set<string>();
  const stones: Position[] = [];
  const libertiesMap = new Map<string, Position>();
  const stack: Position[] = [start];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const currentKey = key(current);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const cell = board[current.y][current.x];
    if (cell.state !== color) continue;

    stones.push(current);

    for (const neighbor of getNeighbors(board, current)) {
      const neighborCell = board[neighbor.y][neighbor.x];
      const neighborKey = key(neighbor);

      if (neighborCell.state === "EMPTY") libertiesMap.set(neighborKey, neighbor);
      if (neighborCell.state === color && !visited.has(neighborKey)) stack.push(neighbor);
    }
  }

  return { color, stones, liberties: Array.from(libertiesMap.values()) };
}
