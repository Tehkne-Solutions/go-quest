import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Group, Mesh } from "three";
import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";

const roleSlug: Record<CharacterRole, string> = {
  SCOUT: "scout",
  HUNTER: "hunter",
  GUARD: "guard",
  LINK: "link",
  BUILDER: "builder",
  RAIDER: "raider"
};

const roleScale: Record<CharacterRole, number> = {
  SCOUT: 0.78,
  HUNTER: 0.78,
  GUARD: 0.76,
  LINK: 0.76,
  BUILDER: 0.8,
  RAIDER: 0.74
};

type LoadedGltf = {
  scene: Group;
};

type CharacterModel3DProps = {
  color: PlayerColor;
  role: CharacterRole;
};

function modelUrl(color: PlayerColor, role: CharacterRole) {
  const faction = color === "BLACK" ? "horde" : "alliance";
  return `/assets/goquest/models/${faction}/${roleSlug[role]}.gltf`;
}

export function CharacterModel3D({ color, role }: CharacterModel3DProps) {
  const gltf = useLoader(GLTFLoader, modelUrl(color, role)) as LoadedGltf;
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.raycast = () => null;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={roleScale[role]} position={[0, 0.02, 0]} rotation={[0, -Math.PI / 4, 0]} />;
}
