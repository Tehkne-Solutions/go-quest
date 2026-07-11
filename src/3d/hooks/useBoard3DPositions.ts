import { useMemo } from "react";
import type { Position } from "../../types/game";
import type { Vector3Tuple } from "../types/render3d";
export const BOARD_3D_SIZE = 5;
export const BOARD_3D_SPACING = 1.42;
export const BOARD_3D_HALF = ((BOARD_3D_SIZE - 1) * BOARD_3D_SPACING) / 2;
export function boardToWorld(position: Position): Vector3Tuple { return [position.x * BOARD_3D_SPACING - BOARD_3D_HALF, 0, position.y * BOARD_3D_SPACING - BOARD_3D_HALF]; }
export function useBoard3DPositions() { return useMemo(() => Array.from({length: BOARD_3D_SIZE * BOARD_3D_SIZE}, (_, i) => { const board={x:i%BOARD_3D_SIZE,y:Math.floor(i/BOARD_3D_SIZE)}; return {board, world: boardToWorld(board)}; }), []); }
