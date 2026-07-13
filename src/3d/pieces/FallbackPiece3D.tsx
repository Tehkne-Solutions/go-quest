import { useEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";

const palette: Record<CharacterRole, { horde: string; alliance: string; accent: string }> = {
  SCOUT: { horde: "#26351f", alliance: "#3f6b43", accent: "#82d66f" },
  HUNTER: { horde: "#56341f", alliance: "#8a6138", accent: "#e2a75d" },
  GUARD: { horde: "#2e3441", alliance: "#d8d7cc", accent: "#d8b868" },
  LINK: { horde: "#382447", alliance: "#6553a5", accent: "#b887ff" },
  BUILDER: { horde: "#563520", alliance: "#9a6a38", accent: "#e0a85c" },
  RAIDER: { horde: "#304522", alliance: "#6f7e55", accent: "#d76343" }
};

type FallbackPiece3DProps = {
  color: PlayerColor;
  role: CharacterRole;
};

export function FallbackPiece3D({ color, role }: FallbackPiece3DProps) {
  const ref = useRef<Group>(null);
  const body = color === "BLACK" ? palette[role].horde : palette[role].alliance;
  const accent = palette[role].accent;
  const trim = color === "BLACK" ? "#b94636" : "#4777bf";

  useEffect(() => {
    ref.current?.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) mesh.raycast = () => null;
    });
  }, []);

  return (
    <group ref={ref} position={[0, 0.35, 0]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[role === "RAIDER" || role === "GUARD" ? 0.26 : 0.19, role === "BUILDER" ? 0.32 : 0.24, role === "BUILDER" ? 0.52 : 0.68, 18]} />
        <meshStandardMaterial color={body} roughness={0.72} metalness={role === "GUARD" ? 0.36 : 0.12} />
      </mesh>
      <mesh castShadow position={[0, 0.84, 0]}>
        <sphereGeometry args={[role === "RAIDER" ? 0.21 : 0.17, 18, 18]} />
        <meshStandardMaterial color={role === "RAIDER" ? "#7d9f55" : "#c08d66"} roughness={0.78} />
      </mesh>
      {role === "SCOUT" && <mesh castShadow position={[0, 0.94, 0]}><coneGeometry args={[0.22, 0.26, 18]} /><meshStandardMaterial color={body} /></mesh>}
      {role === "GUARD" && <mesh castShadow position={[0.34, 0.46, 0.03]}><boxGeometry args={[0.25, 0.58, 0.08]} /><meshStandardMaterial color={trim} /></mesh>}
      {role === "HUNTER" && <mesh castShadow position={[0.34, 0.5, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.04, 0.74, 0.04]} /><meshStandardMaterial color={accent} /></mesh>}
      {role === "LINK" && <mesh castShadow position={[0.34, 0.98, 0]}><sphereGeometry args={[0.1, 18, 18]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.55} /></mesh>}
      {role === "BUILDER" && <mesh castShadow position={[-0.36, 0.6, 0]} rotation={[0, 0, 0.65]}><boxGeometry args={[0.12, 0.62, 0.12]} /><meshStandardMaterial color={accent} /></mesh>}
      {role === "RAIDER" && <mesh castShadow position={[0.42, 0.58, 0]} rotation={[0, 0, -0.62]}><boxGeometry args={[0.1, 0.82, 0.1]} /><meshStandardMaterial color={accent} /></mesh>}
    </group>
  );
}
