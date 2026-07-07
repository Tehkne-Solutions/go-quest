export type PlayerColor = "BLACK" | "WHITE";

export type CellState = "EMPTY" | PlayerColor;

export type Position = {
  x: number;
  y: number;
};

export type BoardCell = {
  position: Position;
  state: CellState;
};

export type Board = BoardCell[][];

export type StoneGroup = {
  color: PlayerColor;
  stones: Position[];
  liberties: Position[];
};

export type CaptureCounter = {
  BLACK: number;
  WHITE: number;
};

export type MissionId = "breath" | "capture" | "squad";
