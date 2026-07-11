import type { Board, Position } from "../../types/game";
import { boardToWorld } from "../hooks/useBoard3DPositions";
import { Piece3D } from "./Piece3D";
type BoardPieces3DProps={board:Board;selectedPosition?:Position};
function samePosition(a?:Position,b?:Position){return Boolean(a&&b&&a.x===b.x&&a.y===b.y)}
function hasConnectedAlly(board:Board,position:Position){const cell=board[position.y][position.x];if(cell.state==="EMPTY")return false;return [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}].some(d=>board[position.y+d.y]?.[position.x+d.x]?.state===cell.state)}
export function BoardPieces3D({board,selectedPosition}:BoardPieces3DProps){return <>{board.flatMap(row=>row.map(cell=>{if(cell.state==="EMPTY")return null;return <Piece3D key={`piece-${cell.position.x}-${cell.position.y}`} color={cell.state} role={cell.character?.role??"SCOUT"} character={cell.character} position={cell.position} worldPosition={boardToWorld(cell.position)} selected={samePosition(cell.position,selectedPosition)} formation={hasConnectedAlly(board,cell.position)}/>;}))}</>}
