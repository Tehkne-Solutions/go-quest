import type { Board } from "../types/game";

export function createBoard(size: number): Board {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      position: { x, y },
      state: "EMPTY"
    }))
  );
}
