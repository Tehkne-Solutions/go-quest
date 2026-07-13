import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";
import type { Piece3DProps } from "../types/render3d";

type RolePalette = {
  horde: string;
  alliance: string;
  hordeAccent: string;
  allianceAccent: string;
  glow: string;
  metal: string;
};

const rolePalette: Record<CharacterRole, RolePalette> = {
  SCOUT: {
    horde: "#26351f",
    alliance: "#3f6b43",
    hordeAccent: "#b94636",
    allianceAccent: "#86d77b",
    glow: "#86f28d",
    metal: "#8c6b3d"
  },
  HUNTER: {
    horde: "#5b321e",
    alliance: "#8a6138",
    hordeAccent: "#c45a36",
    allianceAccent: "#e2a75d",
    glow: "#f0c47a",
    metal: "#9f7447"
  },
  GUARD: {
    horde: "#272b34",
    alliance: "#cfd6dd",
    hordeAccent: "#bd3e35",
    allianceAccent: "#d8b868",
    glow: "#f3d58d",
    metal: "#a9b2bd"
  },
  LINK: {
    horde: "#382447",
    alliance: "#514f9e",
    hordeAccent: "#c74d86",
    allianceAccent: "#8dc8ff",
    glow: "#c69bff",
    metal: "#c2a26b"
  },
  BUILDER: {
    horde: "#563520",
    alliance: "#9a6a38",
    hordeAccent: "#b77332",
    allianceAccent: "#e0a85c",
    glow: "#ffc26a",
    metal: "#b77332"
  },
  RAIDER: {
    horde: "#2f4b27",
    alliance: "#59677c",
    hordeAccent: "#d76343",
    allianceAccent: "#b7c9df",
    glow: "#f1785e",
    metal: "#6f6256"
  }
};

function factionMeta(color: PlayerColor) {
  return color === "BLACK"
    ? {
        label: "Horda",
        trim: "#b94636",
        cloth: "#471914",
        stone: "#181411",
        metal: "#4d4139",
        rune: "#ff6d55",
        skin: "#78a14f"
      }
    : {
        label: "Aliança",
        trim: "#4777bf",
        cloth: "#263f73",
        stone: "#d7d0bd",
        metal: "#c8c2b4",
        rune: "#8dc8ff",
        skin: "#c99a6e"
      };
}

function Rivets({ radius, y, color, count = 10 }: { radius: number; y: number; color: string; count?: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]} castShadow>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.42} metalness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

function MiniaturePedestal({ color, accent, selected, formation }: { color: PlayerColor; accent: string; selected?: boolean; formation?: boolean }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.54, 0.62, 0.16, 56]} />
        <meshStandardMaterial color={faction.stone} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.47, 0.54, 0.12, 56]} />
        <meshStandardMaterial color={faction.metal} roughness={0.58} metalness={0.42} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.36, 0.43, 0.1, 56]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.48}
          metalness={0.24}
          emissive={formation ? faction.rune : "#000000"}
          emissiveIntensity={formation ? 0.22 : 0}
        />
      </mesh>
      <mesh position={[0, 0.335, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.39, 0.44, 56]} />
        <meshStandardMaterial color={faction.trim} emissive={faction.rune} emissiveIntensity={0.08} />
      </mesh>
      <Rivets radius={0.47} y={0.27} color={faction.trim} count={12} />
      {selected && (
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.56, 0.66, 64]} />
          <meshStandardMaterial color="#f3d58d" emissive="#f3d58d" emissiveIntensity={0.34} />
        </mesh>
      )}
    </group>
  );
}

function ShoulderPads({ color, metal }: { color: string; metal: string }) {
  return (
    <group>
      <mesh castShadow position={[-0.18, 0.98, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color={metal} roughness={0.5} metalness={0.34} />
      </mesh>
      <mesh castShadow position={[0.18, 0.98, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.22} />
      </mesh>
    </group>
  );
}

function ScoutStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.73, 0]}>
        <cylinderGeometry args={[0.13, 0.21, 0.58, 16]} />
        <meshStandardMaterial color={body} roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.13, 0]}>
        <coneGeometry args={[0.23, 0.29, 20]} />
        <meshStandardMaterial color={body} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.82, -0.12]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.35, 0.78, 24]} />
        <meshStandardMaterial color={faction.cloth} roughness={0.84} />
      </mesh>
      <ShoulderPads color={accent} metal={faction.metal} />
      <mesh castShadow position={[-0.29, 0.66, 0.02]} rotation={[0, 0, 0.95]}>
        <coneGeometry args={[0.038, 0.52, 10]} />
        <meshStandardMaterial color={accent} roughness={0.34} metalness={0.52} />
      </mesh>
      <mesh castShadow position={[0.29, 0.66, 0.02]} rotation={[0, 0, -0.95]}>
        <coneGeometry args={[0.038, 0.52, 10]} />
        <meshStandardMaterial color={accent} roughness={0.34} metalness={0.52} />
      </mesh>
      <Rivets radius={0.16} y={0.83} color={accent} count={6} />
    </group>
  );
}

function HunterStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.16, 0.25, 0.58, 18]} />
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
        <torusGeometry args={[0.3, 0.016, 8, 42, Math.PI]} />
        <meshStandardMaterial color={accent} roughness={0.5} metalness={0.24} />
      </mesh>
      <mesh castShadow position={[0.39, 0.74, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
        <meshStandardMaterial color="#ded4bb" roughness={0.4} />
      </mesh>
      <Rivets radius={0.18} y={0.8} color={accent} count={7} />
    </group>
  );
}

function GuardStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.24, 0.33, 0.72, 20]} />
        <meshStandardMaterial color={body} roughness={0.48} metalness={0.46} />
      </mesh>
      <mesh castShadow position={[0, 1.19, 0]}>
        <boxGeometry args={[0.34, 0.28, 0.28]} />
        <meshStandardMaterial color={faction.metal} roughness={0.42} metalness={0.46} />
      </mesh>
      <ShoulderPads color={accent} metal={faction.metal} />
      <mesh castShadow position={[0.39, 0.78, 0.04]}>
        <boxGeometry args={[0.29, 0.66, 0.11]} />
        <meshStandardMaterial color={faction.trim} roughness={0.52} metalness={0.28} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.68, 0.03]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.045, 0.74, 12]} />
        <meshStandardMaterial color={accent} roughness={0.34} metalness={0.52} />
      </mesh>
      <mesh castShadow position={[0, 0.92, 0.18]}>
        <boxGeometry args={[0.48, 0.08, 0.12]} />
        <meshStandardMaterial color={accent} roughness={0.42} metalness={0.48} />
      </mesh>
      <Rivets radius={0.22} y={0.83} color={accent} count={8} />
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
        <coneGeometry args={[0.4, 0.86, 28]} />
        <meshStandardMaterial color={faction.cloth} roughness={0.78} />
      </mesh>
      <mesh position={[-0.36, 1.05, 0]}>
        <sphereGeometry args={[0.095, 22, 22]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[0.36, 1.02, 0]}>
        <sphereGeometry args={[0.095, 22, 22]} />
        <meshStandardMaterial color={faction.rune} emissive={faction.rune} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.98, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.009, 8, 54]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.28} />
      </mesh>
      <Rivets radius={0.19} y={0.8} color={accent} count={8} />
    </group>
  );
}

function BuilderStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.5, 20]} />
        <meshStandardMaterial color={body} roughness={0.7} metalness={0.16} />
      </mesh>
      <mesh castShadow position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.2, 22, 22]} />
        <meshStandardMaterial color="#b67445" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0.02]}>
        <sphereGeometry args={[0.25, 18, 18]} />
        <meshStandardMaterial color="#8d512d" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.72, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.58, 10]} />
        <meshStandardMaterial color={faction.metal} roughness={0.42} metalness={0.42} />
      </mesh>
      <mesh castShadow position={[-0.49, 0.92, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.24, 0.15, 0.15]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.36} />
      </mesh>
      <mesh castShadow position={[0.34, 0.68, 0.02]} rotation={[0.2, 0, -0.2]}>
        <boxGeometry args={[0.24, 0.32, 0.045]} />
        <meshStandardMaterial color={faction.trim} roughness={0.62} />
      </mesh>
      <Rivets radius={0.22} y={0.76} color={accent} count={9} />
    </group>
  );
}

function RaiderStatue({ body, accent, color }: { body: string; accent: string; color: PlayerColor }) {
  const faction = factionMeta(color);

  return (
    <group>
      <mesh castShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.27, 0.38, 0.72, 18]} />
        <meshStandardMaterial color={body} roughness={0.68} />
      </mesh>
      <mesh castShadow position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.21, 22, 22]} />
        <meshStandardMaterial color={color === "BLACK" ? "#6e8f42" : "#8d95a1"} roughness={0.74} />
      </mesh>
      <mesh castShadow position={[-0.22, 1.28, 0]} rotation={[0, 0, -0.55]}>
        <coneGeometry args={[0.06, 0.3, 10]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh castShadow position={[0.22, 1.28, 0]} rotation={[0, 0, 0.55]}>
        <coneGeometry args={[0.06, 0.3, 10]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh castShadow position={[0.35, 0.78, 0.04]} rotation={[0, 0, -0.56]}>
        <cylinderGeometry args={[0.052, 0.052, 0.74, 10]} />
        <meshStandardMaterial color="#4f301d" />
      </mesh>
      <mesh castShadow position={[0.5, 1.02, 0.04]} rotation={[0, 0, -0.56]}>
        <coneGeometry args={[0.2, 0.34, 4]} />
        <meshStandardMaterial color={faction.metal} roughness={0.38} metalness={0.44} />
      </mesh>
      <mesh castShadow position={[-0.36, 0.82, 0.03]}>
        <boxGeometry args={[0.22, 0.5, 0.085]} />
        <meshStandardMaterial color={faction.trim} roughness={0.6} metalness={0.2} />
      </mesh>
      <Rivets radius={0.24} y={0.83} color={accent} count={8} />
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
  const [x, , z] = worldPosition;
  const body = color === "BLACK" ? palette.horde : palette.alliance;
  const accent = color === "BLACK" ? palette.hordeAccent : palette.allianceAccent;

  return (
    <group position={[x, 0.26, z]} rotation={[0, Math.PI / 4, 0]}>
      <MiniaturePedestal color={color} accent={accent} selected={selected} formation={formation} />
      <group position={[0, 0.2, 0]}>
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
