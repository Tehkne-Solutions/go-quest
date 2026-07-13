import { Suspense, useEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";
import type { Piece3DProps } from "../types/render3d";
import { CharacterModel3D } from "./CharacterModel3D";
import { FallbackPiece3D } from "./FallbackPiece3D";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

const rolePalette: Record<CharacterRole, { horde: string; alliance: string; accent: string; glow: string }> = {
  SCOUT: { horde: "#26351f", alliance: "#3f6b43", accent: "#82d66f", glow: "#86f28d" },
  HUNTER: { horde: "#56341f", alliance: "#8a6138", accent: "#e2a75d", glow: "#f0c47a" },
  GUARD: { horde: "#2e3441", alliance: "#d8d7cc", accent: "#d8b868", glow: "#f3d58d" },
  LINK: { horde: "#382447", alliance: "#6553a5", accent: "#b887ff", glow: "#c69bff" },
  BUILDER: { horde: "#563520", alliance: "#9a6a38", accent: "#e0a85c", glow: "#ffc26a" },
  RAIDER: { horde: "#304522", alliance: "#6f7e55", accent: "#d76343", glow: "#f1785e" }
};

function factionMeta(color: PlayerColor) {
  return color === "BLACK"
    ? { stone: "#181411", metal: "#4d4139", trim: "#b94636", rune: "#ff6d55" }
    : { stone: "#d7d0bd", metal: "#c8c2b4", trim: "#4777bf", rune: "#8dc8ff" };
}

function MiniaturePedestal({ color, accent, selected, formation }: { color: PlayerColor; accent: string; selected?: boolean; formation?: boolean }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.16, 48]} />
        <meshStandardMaterial color={faction.stone} roughness={0.88} metalness={0.1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.43, 0.49, 0.12, 48]} />
        <meshStandardMaterial color={faction.metal} roughness={0.62} metalness={0.36} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.34, 0.39, 0.1, 48]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.22} emissive={formation ? faction.rune : "#000000"} emissiveIntensity={formation ? 0.2 : 0} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.39, 0.43, 48]} />
        <meshStandardMaterial color={faction.trim} emissive={faction.rune} emissiveIntensity={0.08} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.54, 0.63, 56]} />
          <meshStandardMaterial color="#f3d58d" emissive="#f3d58d" emissiveIntensity={0.34} />
        </mesh>
      )}
    </group>
  );
}

function PieceFallback({ color, role }: { color: PlayerColor; role: CharacterRole }) {
  return <FallbackPiece3D color={color} role={role} />;
}

export function Piece3D({ color, role, worldPosition, selected = false, formation = false }: Piece3DProps) {
  const ref = useRef<Group>(null);
  const palette = rolePalette[role];
  const faction = factionMeta(color);
  const [x, , z] = worldPosition;
  const accent = color === "BLACK" ? faction.trim : palette.accent;

  useEffect(() => {
    ref.current?.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) mesh.raycast = () => null;
    });
  }, []);

  return (
    <group ref={ref} position={[x, 0.2, z]}>
      <MiniaturePedestal color={color} accent={accent} selected={selected} formation={formation} />
      <group position={[0, 0.08, 0]}>
        <ModelErrorBoundary fallback={<PieceFallback color={color} role={role} />}>
          <Suspense fallback={<PieceFallback color={color} role={role} />}>
            <CharacterModel3D color={color} role={role} />
          </Suspense>
        </ModelErrorBoundary>
      </group>
      {formation && (
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.72, 56]} />
          <meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={0.3} transparent opacity={0.86} />
        </mesh>
      )}
    </group>
  );
}
