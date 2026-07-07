import { createDefaultCharacter } from "../data/characters";
import type { Board, CellState, PlayerColor } from "../types/game";

const rowSymbols: Record<string, CellState> = {
  ".": "EMPTY",
  B: "BLACK",
  W: "WHITE"
};

export function boardFromRows(rows: string[]): Board {
  return rows.map((row, y) =>
    row
      .trim()
      .split(/\s+/)
      .map((symbol, x) => {
        const state = rowSymbols[symbol] ?? "EMPTY";
        const position = { x, y };

        return {
          position,
          state,
          character:
            state === "EMPTY"
              ? undefined
              : createDefaultCharacter(state as PlayerColor, position)
        };
      })
  );
}
