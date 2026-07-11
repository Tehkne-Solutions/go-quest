import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { GoBoard3D } from "../board/GoBoard3D";
import { GoCamera } from "./GoCamera";
import { GoLights } from "./GoLights";
import type { Board3DProps } from "../types/render3d";
export function GoScene3D(props:Board3DProps){return <div className="go-3d-shell" aria-label="Tabuleiro GoQuest 3D"><Canvas shadows dpr={[1,1.6]} camera={{position:[5.8,6.2,6.6],fov:42,near:0.1,far:100}} gl={{antialias:true,alpha:true}}><Suspense fallback={null}><GoCamera mode={props.camera}/><GoLights/><GoBoard3D {...props}/></Suspense></Canvas><div className="go-3d-hud"><span>Core 3D</span><strong>{props.camera.toUpperCase()}</strong></div></div>}
