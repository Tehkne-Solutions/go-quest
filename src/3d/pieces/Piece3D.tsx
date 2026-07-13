import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";
import type { Piece3DProps } from "../types/render3d";

type RolePalette = {
  horde: string;
  alliance: string;
  accent: string;
  glow: string;
  metal: string;
};

const rolePalette: Record<CharacterRole, RolePalette> = {
  SCOUT: { horde: "#234426", alliance: "#3f6b43", accent: "#82d66f", glow: "#86f28d", metal: "#8c6b3d" },
  HUNTER: { horde: "#56341f", alliance: "#8a6138", accent: "#e2a75d", glow: "#f0c47a", metal: "#9f7447" },
  GUARD: { horde: "#2e3441", alliance: "#d8d7cc", accent: "#d8b868", glow: "#f3d58d", metal: "#a9b2bd" },
  LINK: { horde: "#382447", alliance: "#6553a5", accent: "#b887ff", glow: "#c69bff", metal: "#c2a26b" },
  BUILDER: { horde: "#563520", alliance: "#9a6a38", accent: "#e0a85c", glow: "#ffc26a", metal: "#b77332" },
  RAIDER: { horde: "#324226", alliance: "#6f7e55", accent: "#d76343", glow: "#f1785e", metal: "#6f6256" }
};

function factionMeta(color: PlayerColor) {
  return color === "BLACK"
    ? {
        faction: "horde",
        trim: "#b94636",
        cloth: "#471914",
        stone: "#181411",
        metal: "#4d4139",
        rune: "#ff6d55"
      }
    : {
        faction: "alliance",
        trim: "#4777bf",
        cloth: "#263f73",
        stone: "#d7d0bd",
        metal: "#c8c2b4",
        rune: "#8dc8ff"
      };
}

function MiniaturePedestal({ color, accent, selected, formation }: { color: PlayerColor; accent: string; selected?: boolean; formation?: boolean }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.16, 48]} />
        <meshStandardMaterial color={faction.stone} roughness={0.86} metalness={0.12} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.43, 0.49, 0.12, 48]} />
        <meshStandardMaterial color={faction.metal} roughness={0.62} metalness={0.38} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.34, 0.39, 0.1, 48]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.48}
          metalness={0.24}
          emissive={formation ? faction.rune : "#000000"}
          emissiveIntensity={formation ? 0.22 : 0}
        />
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

function ScoutStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.16, 0.23, 0.62, 16]} />
        <meshStandardMaterial color={body} roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.14, 0]}>
        <coneGeometry args={[0.22, 0.28, 20]} />
        <meshStandardMaterial color={body} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.86, -0.1]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.34, 0.74, 24]} />
        <meshStandardMaterial color={faction.cloth} roughness={0.84} />
      </mesh>
      <mesh castShadow position={[-0.28, 0.66, 0.02]} rotation={[0, 0, 0.95]}>
        <coneGeometry args={[0.035, 0.48, 10]} />
        <meshStandardMaterial color={accent} roughness={0.38} metalness={0.48} />
      </mesh>
      <mesh castShadow position={[0.28, 0.66, 0.02]} rotation={[0, 0, -0.95]}>
        <coneGeometry args={[0.035, 0.48, 10]} />
        <meshStandardMaterial color={accent} roughness={0.38} metalness={0.48} />
      </mesh>
    </group>
  );
}

function HunterStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.17, 0.25, 0.58, 18]} />
        <meshStandardMaterial color={body} roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.06, 0]}>
        <sphereGeometry args={[0.17, 18, 18]} />
        <meshStandardMaterial color="#b88a5d" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[-0.18, 0.96, -0.08]} rotation={[0.42, 0, -0.35]}>
        <cylinderGeometry args={[0.055, 0.055, 0.72, 12]} />
        <meshStandardMaterial color={faction.cloth} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0.34, 0.74, 0.02]} rotation={[0, 0, -0.42]}>
        <torusGeometry args={[0.28, 0.014, 8, 36, Math.PI]} />
        <meshStandardMaterial color={accent} roughness={0.5} metalness={0.24} />
      </mesh>
      <mesh castShadow position={[0.38, 0.74, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.58, 8]} />
        <meshStandardMaterial color="#ded4bb" roughness={0.4} />
      </mesh>
    </group>
  );
}

function GuardStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.24, 0.32, 0.7, 20]} />
        <meshStandardMaterial color={body} roughness={0.48} metalness={0.46} />
      </mesh>
      <mesh castShadow position={[0, 1.19, 0]}>
        <boxGeometry args={[0.34, 0.28, 0.28]} />
        <meshStandardMaterial color={faction.metal} roughness={0.42} metalness={0.46} />
      </mesh>
      <mesh castShadow position={[0.36, 0.78, 0.04]}>
        <boxGeometry args={[0.26, 0.62, 0.1]} />
        <meshStandardMaterial color={faction.trim} roughness={0.52} metalness={0.28} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.68, 0.03]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.045, 0.72, 12]} />
        <meshStandardMaterial color={accent} roughness={0.34} metalness={0.52} />
      </mesh>
      <mesh castShadow position={[0, 0.92, 0.18]}>
        <boxGeometry args={[0.46, 0.08, 0.12]} />
        <meshStandardMaterial color={accent} roughness={0.42} metalness={0.48} />
      </mesh>
    </group>
  );
}

function LinkStatue({ body, accent, glow, color }: { body: string; accent: string; glow: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.18, 0.29, 0.74, 22]} />
        <meshStandardMaterial color={body} roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, 1.21, 0]}>
        <sphereGeometry args={[0.17, 22, 22]} />
        <meshStandardMaterial color="#d1a17c" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.68, -0.12]} rotation={[0.1, 0, 0]}>
        <coneGeometry args={[0.38, 0.82, 28]} />
        <meshStandardMaterial color={faction.cloth} roughness={0.78} />
      </mesh>
      <mesh position={[-0.35, 1.05, 0]}>
        <sphereGeometry args={[0.09, 22, 22]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.35, 1.02, 0]}>
        <sphereGeometry args={[0.09, 22, 22]} />
        <meshStandardMaterial color={faction.rune} emissive={faction.rune} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0.98, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.008, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.24} />
      </mesh>
    </group>
  );
}

function BuilderStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.24, 0.34, 0.48, 20]} />
        <meshStandardMaterial color={body} roughness={0.7} metalness={0.16} />
      </mesh>
      <mesh castShadow position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.2, 22, 22]} />
        <meshStandardMaterial color="#b67445" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0.02]}>
        <sphereGeometry args={[0.24, 18, 18]} />
        <meshStandardMaterial color="#8d512d" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.72, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 10]} />
        <meshStandardMaterial color={faction.metal} roughness={0.42} metalness={0.42} />
      </mesh>
      <mesh castShadow position={[-0.48, 0.92, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.22, 0.14, 0.14]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.36} />
      </mesh>
      <mesh castShadow position={[0.34, 0.68, 0.02]} rotation={[0.2, 0, -0.2]}>
        <boxGeometry args={[0.22, 0.3, 0.04]} />
        <meshStandardMaterial color={faction.trim} roughness={0.62} />
      </mesh>
    </group>
  );
}

function RaiderStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.26, 0.36, 0.7, 18]} />
        <meshStandardMaterial color={body} roughness={0.68} />
      </mesh>
      <mesh castShadow position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.21, 22, 22]} />
        <meshStandardMaterial color={color === "BLACK" ? "#6e8f42" : "#89995d"} roughness={0.74} />
      </mesh>
      <mesh castShadow position={[-0.22, 1.28, 0]} rotation={[0, 0, -0.55]}>
        <coneGeometry args={[0.06, 0.28, 10]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh castShadow position={[0.22, 1.28, 0]} rotation={[0, 0, 0.55]}>
        <coneGeometry args={[0.06, 0.28, 10]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh castShadow position={[0.34, 0.78, 0.04]} rotation={[0, 0, -0.56]}>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 10]} />
        <meshStandardMaterial color="#4f301d" />
      </mesh>
      <mesh castShadow position={[0.48, 1.02, 0.04]} rotation={[0, 0, -0.56]}>
        <coneGeometry args={[0.18, 0.32, 4]} />
        <meshStandardMaterial color={faction.metal} roughness={0.38} metalness={0.44} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.82, 0.03]}>
        <boxGeometry args={[0.2, 0.48, 0.08]} />
        <meshStandardMaterial color={faction.trim} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

function ClassSculpture({ role, color, body, accent, glow }: { role: CharacterRole; color: PlayerColor; body: string; accent: string; glow: string }) {
  if (role === "HUNTER") return <HunterStatue body={body} accent={accent} color={color} />;
  if (role === "GUARD") return <GuardStatue body={body} accent={accent} color={color} />;
  if (role === "LINK") return <LinkStatue body={body} accent={accent} glow={glow} color={color} />;
  if (role === "BUILDER") return <BuilderStatue body={body} accent={accent} color={color} />;
  if (role === "RAIDER") return <RaiderStatue body={body} accent={accent} color={color} />;
  return <ScoutStatue body={body} accent={accent} color={color} />;
}

export function Piece3D({ color, role, worldPosition, selected = false, formation = false }: Piece3DProps) {
  const palette = rolePalette[role];
  const faction = factionMeta(color);
  const [x, , z] = worldPosition;
  const body = color === "BLACK" ? palette.horde : palette.alliance;
  const accent = color === "BLACK" ? faction.trim : palette.accent;

  return (
    <group position={[x, 0.26, z]} rotation={[0, Math.PI / 4, 0]}>
      <MiniaturePedestal color={color} accent={accent} selected={selected} formation={formation} />
      <group position={[0, 0.18, 0]}>
        <ClassSculpture role={role} color={color} body={body} accent={accent} glow={palette.glow} />
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
