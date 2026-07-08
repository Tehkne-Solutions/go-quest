import type { Board, StoneGroup } from "../types/game";

export function removeGroup(board: Board, group: StoneGroup): Board {
  const nextBoard = structuredClone(board) as Board;

  for (const stone of group.stones) {
    nextBoard[stone.y][stone.x] = { position: stone, state: "EMPTY" };
  }

  return nextBoard;
}
