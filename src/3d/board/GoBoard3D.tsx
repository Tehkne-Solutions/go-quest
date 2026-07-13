import { BoardGround } from "./BoardGround";
import { BoardIntersection3D } from "./BoardIntersections";
import { useBoard3DPositions } from "../hooks/useBoard3DPositions";
import type { Board3DProps } from "../types/render3d";
import { BoardPieces3D } from "../pieces/BoardPieces3D";
import { BoardFx3D } from "../fx/BoardFx3D";

function samePosition(a?: { x: number; y: number }, b?: { x: number; y: number }) {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

export function GoBoard3D({
  board,
  expectedMove,
  selectedPosition,
  showTarget,
  fxEvents = [],
  onIntersectionClick
}: Board3DProps) {
  const positions = useBoard3DPositions();

  return (
    <group>
      <BoardGround />

      {positions.map(({ board: position, world }) => (
        <BoardIntersection3D
          key={`intersection-${position.x}-${position.y}`}
          position={position}
          worldPosition={world}
          isExpected={showTarget && samePosition(position, expectedMove)}
          isSelected={samePosition(position, selectedPosition)}
          onClick={onIntersectionClick}
        />
      ))}

      <BoardPieces3D board={board} selectedPosition={selectedPosition} />
      <BoardFx3D events={fxEvents} />
    </group>
  );
}
