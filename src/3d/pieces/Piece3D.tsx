import { useTexture } from "@react-three/drei";
import type { CharacterRole } from "../../types/character";
import type { Piece3DProps } from "../types/render3d";

const roleColors: Record<CharacterRole, { base: string; accent: string; glow: string; file: string }> = {
  SCOUT: { base: "#2d3a25", accent: "#75c66a", glow: "#8be17f", file: "/assets/goquest/pieces-textured/scout.png" },
  HUNTER: { base: "#4b3323", accent: "#d3a15e", glow: "#e6bc75", file: "/assets/goquest/pieces-textured/hunter.png" },
  GUARD: { base: "#273240", accent: "#d6b26d", glow: "#f2d08f", file: "/assets/goquest/pieces-textured/guard.png" },
  LINK: { base: "#332447", accent: "#b384ff", glow: "#c79cff", file: "/assets/goquest/pieces-textured/link.png" },
  BUILDER: { base: "#443323", accent: "#d8a564", glow: "#efc27d", file: "/assets/goquest/pieces-textured/builder.png" },
  RAIDER: { base: "#3a2a24", accent: "#d96d4f", glow: "#ea8a6e", file: "/assets/goquest/pieces-textured/raider.png" }
};

function Pedestal({ base, accent, selected, formation }: { base: string; accent: string; selected?: boolean; formation?: boolean }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.18, 40]} />
        <meshStandardMaterial color="#1b1612" roughness={0.82} metalness={0.18} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.39, 0.43, 0.08, 40]} />
        <meshStandardMaterial color={base} roughness={0.74} metalness={0.16} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.33, 0.39, 0.06, 40]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.22} emissive={formation ? accent : "#000000"} emissiveIntensity={formation ? 0.18 : 0} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.59, 48]} />
          <meshStandardMaterial color="#f3d58d" emissive="#f3d58d" emissiveIntensity={0.26} />
        </mesh>
      )}
    </group>
  );
}

export function Piece3D({ color, role, worldPosition, selected = false, formation = false }: Piece3DProps) {
  const palette = roleColors[role];
  const texture = useTexture(palette.file);
  texture.flipY = false;
  const [x, , z] = worldPosition;
  const y = 0.22;
  const tint = color === "BLACK" ? "#ffffff" : "#e8e0d0";

  return (
    <group position={[x, y, z]}>
      <Pedestal base={palette.base} accent={palette.accent} selected={selected} formation={formation} />

      <group position={[0, 0.28, 0]}>
        <mesh castShadow position={[0, 0.62, 0]}>
          <planeGeometry args={[0.92, 1.24]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.08}
            color={tint}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>

        <mesh castShadow position={[0, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.92, 1.24]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.08}
            color={tint}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      </group>

      {formation && (
        <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.36, 36]} />
          <meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={0.22} transparent opacity={0.95} />
        </mesh>
      )}
    </group>
  );
}
