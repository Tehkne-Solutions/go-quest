import type { Board, CellState } from "../types/game";

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
      .map((symbol, x) => ({
        position: { x, y },
        state: rowSymbols[symbol] ?? "EMPTY"
      }))
  );
}
