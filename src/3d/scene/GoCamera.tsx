import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { BoardCamera } from "../../components/board/CameraControls";
type GoCameraProps={mode:BoardCamera};
const cameraPositions: Record<BoardCamera,[number,number,number]>={top:[0,8.5,0.01],iso:[5.8,6.2,6.6],cinematic:[6.8,4.25,7.4],rotated:[-6.4,6.1,6.2]};
export function GoCamera({mode}:GoCameraProps){const {camera}=useThree();useEffect(()=>{const [x,y,z]=cameraPositions[mode];camera.position.set(x,y,z);camera.lookAt(0,0,0);camera.updateProjectionMatrix();},[camera,mode]);return null;}
