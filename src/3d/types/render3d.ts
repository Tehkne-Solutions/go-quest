import type { CharacterRole, StoneCharacter } from "../../types/character";
import type { Board, PlayerColor, Position } from "../../types/game";
import type { BoardCamera } from "../../components/board/CameraControls";
export type Vector3Tuple = [number, number, number];
export type Board3DProps = { board: Board; expectedMove?: Position; selectedPosition?: Position; showTarget: boolean; camera: BoardCamera; onIntersectionClick: (position: Position) => void; };
export type Intersection3DProps = { position: Position; worldPosition: Vector3Tuple; isExpected: boolean; isSelected: boolean; onClick: (position: Position) => void; };
export type Piece3DProps = { color: PlayerColor; role: CharacterRole; character?: StoneCharacter; position: Position; worldPosition: Vector3Tuple; selected?: boolean; formation?: boolean; };
