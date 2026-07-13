import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, type Group } from "three";
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
  SCOUT: { horde: "#1f3f25", alliance: "#3f6f48", accent: "#82d66f", glow: "#86f28d", metal: "#8c6b3d" },
  HUNTER: { horde: "#56341f", alliance: "#8a6138", accent: "#e2a75d", glow: "#f0c47a", metal: "#9f7447" },
  GUARD: { horde: "#2e3441", alliance: "#d8d7cc", accent: "#d8b868", glow: "#f3d58d", metal: "#a9b2bd" },
  LINK: { horde: "#382447", alliance: "#6553a5", accent: "#b887ff", glow: "#c69bff", metal: "#c2a26b" },
  BUILDER: { horde: "#563520", alliance: "#9a6a38", accent: "#e0a85c", glow: "#ffc26a", metal: "#b77332" },
  RAIDER: { horde: "#304522", alliance: "#6f7e55", accent: "#d76343", glow: "#f1785e", metal: "#6f6256" }
};

function factionMeta(color: PlayerColor) {
  return color === "BLACK"
    ? { trim: "#b94636", cloth: "#4a1712", stone: "#181411", metal: "#4d4139", rune: "#ff6d55" }
    : { trim: "#4777bf", cloth: "#263f73", stone: "#d7d0bd", metal: "#c8c2b4", rune: "#8dc8ff" };
}

function makeTexture(base: string, accent: string, trim: string, variant: CharacterRole | "STONE") {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 96, 96);
  gradient.addColorStop(0, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.48, "rgba(0,0,0,0.05)");
  gradient.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 96);

  ctx.strokeStyle = trim;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 4;

  if (variant === "SCOUT") {
    for (let x = -20; x < 120; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 96);
      ctx.lineTo(x + 56, 0);
      ctx.stroke();
    }
  } else if (variant === "HUNTER") {
    for (let y = 10; y < 96; y += 18) {
      ctx.beginPath();
      ctx.moveTo(6, y);
      ctx.lineTo(90, y + 8);
      ctx.stroke();
    }
  } else if (variant === "GUARD") {
    for (let y = 8; y < 96; y += 20) ctx.strokeRect(8, y, 80, 12);
  } else if (variant === "LINK") {
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.arc(48, 48, 10 + i * 7, 0, Math.PI * 1.4);
      ctx.stroke();
    }
  } else if (variant === "BUILDER") {
    for (let x = 8; x < 96; x += 22) {
      for (let y = 8; y < 96; y += 22) ctx.strokeRect(x, y, 14, 14);
    }
  } else if (variant === "RAIDER") {
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      ctx.moveTo((i * 17) % 96, 0);
      ctx.lineTo((i * 17 + 28) % 96, 96);
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < 140; i += 1) {
      const x = (i * 29) % 96;
      const y = (i * 17) % 96;
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
      ctx.fillRect(x, y, 3, 2);
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  for (let i = 0; i < 9; i += 1) {
    const x = 10 + ((i * 31) % 76);
    const y = 12 + ((i * 19) % 70);
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 3 : 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function usePieceTextures(role: CharacterRole, color: PlayerColor, body: string, accent: string) {
  const faction = factionMeta(color);
  return useMemo(
    () => ({
      body: makeTexture(body, accent, faction.trim, role),
      cloth: makeTexture(faction.cloth, accent, faction.trim, role),
      metal: makeTexture(faction.metal, accent, faction.rune, "GUARD"),
      stone: makeTexture(faction.stone, accent, faction.trim, "STONE")
    }),
    [accent, body, color, role]
  );
}

function MiniaturePedestal({ color, accent, selected, formation, texture }: { color: PlayerColor; accent: string; selected?: boolean; formation?: boolean; texture?: CanvasTexture }) {
  const faction = factionMeta(color);
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}><cylinderGeometry args={[0.54, 0.62, 0.16, 48]} /><meshStandardMaterial map={texture} color={faction.stone} roughness={0.9} metalness={0.08} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}><cylinderGeometry args={[0.44, 0.5, 0.12, 48]} /><meshStandardMaterial color={faction.metal} roughness={0.62} metalness={0.38} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.27, 0]}><cylinderGeometry args={[0.34, 0.4, 0.1, 48]} /><meshStandardMaterial color={accent} roughness={0.48} metalness={0.24} emissive={formation ? faction.rune : "#000000"} emissiveIntensity={formation ? 0.24 : 0} /></mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.39, 0.44, 48]} /><meshStandardMaterial color={faction.trim} emissive={faction.rune} emissiveIntensity={0.1} /></mesh>
      {selected && <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.56, 0.66, 56]} /><meshStandardMaterial color="#f3d58d" emissive="#f3d58d" emissiveIntensity={0.38} /></mesh>}
    </group>
  );
}

function Rivets({ color }: { color: string }) {
  return <group>{[-0.18, 0, 0.18].map((x, index) => <mesh key={index} castShadow position={[x, 0.94, 0.22]}><sphereGeometry args={[0.035, 10, 10]} /><meshStandardMaterial color={color} roughness={0.44} metalness={0.42} /></mesh>)}</group>;
}

function ScoutStatue({ texture, cloth, accent }: { texture?: CanvasTexture; cloth?: CanvasTexture; accent: string }) {
  return <group><mesh castShadow position={[0, 0.74, 0]}><cylinderGeometry args={[0.16, 0.23, 0.62, 16]} /><meshStandardMaterial map={texture} color="#345b34" roughness={0.76} /></mesh><mesh castShadow position={[0, 1.14, 0]}><coneGeometry args={[0.22, 0.28, 20]} /><meshStandardMaterial map={texture} color="#2f4d32" roughness={0.78} /></mesh><mesh castShadow position={[0, 0.86, -0.1]} rotation={[0.2, 0, 0]}><coneGeometry args={[0.35, 0.76, 24]} /><meshStandardMaterial map={cloth} color="#233f2a" roughness={0.84} /></mesh><mesh castShadow position={[-0.3, 0.66, 0.02]} rotation={[0, 0, 0.95]}><coneGeometry args={[0.04, 0.52, 10]} /><meshStandardMaterial color={accent} roughness={0.38} metalness={0.48} /></mesh><mesh castShadow position={[0.3, 0.66, 0.02]} rotation={[0, 0, -0.95]}><coneGeometry args={[0.04, 0.52, 10]} /><meshStandardMaterial color={accent} roughness={0.38} metalness={0.48} /></mesh></group>;
}

function HunterStatue({ texture, cloth, accent }: { texture?: CanvasTexture; cloth?: CanvasTexture; accent: string }) {
  return <group><mesh castShadow position={[0, 0.72, 0]}><cylinderGeometry args={[0.18, 0.27, 0.58, 18]} /><meshStandardMaterial map={texture} color="#7b4e2b" roughness={0.72} /></mesh><mesh castShadow position={[0, 1.07, 0]}><sphereGeometry args={[0.17, 18, 18]} /><meshStandardMaterial color="#b88a5d" roughness={0.76} /></mesh><mesh castShadow position={[-0.18, 0.96, -0.08]} rotation={[0.42, 0, -0.35]}><cylinderGeometry args={[0.055, 0.055, 0.72, 12]} /><meshStandardMaterial map={cloth} color="#51321f" roughness={0.78} /></mesh><mesh castShadow position={[0.36, 0.76, 0.02]} rotation={[0, 0, -0.42]}><torusGeometry args={[0.3, 0.015, 8, 36, Math.PI]} /><meshStandardMaterial color={accent} roughness={0.5} metalness={0.24} /></mesh><mesh castShadow position={[0.4, 0.76, 0.03]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.62, 8]} /><meshStandardMaterial color="#ded4bb" roughness={0.4} /></mesh></group>;
}

function GuardStatue({ texture, metal, accent }: { texture?: CanvasTexture; metal?: CanvasTexture; accent: string }) {
  return <group><mesh castShadow position={[0, 0.76, 0]}><cylinderGeometry args={[0.25, 0.33, 0.7, 20]} /><meshStandardMaterial map={texture} color="#778394" roughness={0.48} metalness={0.46} /></mesh><mesh castShadow position={[0, 1.2, 0]}><boxGeometry args={[0.36, 0.28, 0.28]} /><meshStandardMaterial map={metal} color="#aeb5bd" roughness={0.42} metalness={0.46} /></mesh><mesh castShadow position={[0.38, 0.78, 0.04]}><boxGeometry args={[0.28, 0.64, 0.1]} /><meshStandardMaterial color={accent} roughness={0.52} metalness={0.28} /></mesh><mesh castShadow position={[-0.34, 0.68, 0.03]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.045, 0.74, 12]} /><meshStandardMaterial color={accent} roughness={0.34} metalness={0.52} /></mesh><Rivets color={accent} /></group>;
}

function LinkStatue({ texture, cloth, accent, glow }: { texture?: CanvasTexture; cloth?: CanvasTexture; accent: string; glow: string }) {
  return <group><mesh castShadow position={[0, 0.76, 0]}><cylinderGeometry args={[0.18, 0.29, 0.74, 22]} /><meshStandardMaterial map={texture} color="#60419b" roughness={0.62} /></mesh><mesh castShadow position={[0, 1.21, 0]}><sphereGeometry args={[0.17, 22, 22]} /><meshStandardMaterial color="#d1a17c" roughness={0.7} /></mesh><mesh castShadow position={[0, 0.68, -0.12]} rotation={[0.1, 0, 0]}><coneGeometry args={[0.38, 0.82, 28]} /><meshStandardMaterial map={cloth} color="#2d2350" roughness={0.78} /></mesh><mesh position={[-0.35, 1.05, 0]}><sphereGeometry args={[0.09, 22, 22]} /><meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.75} /></mesh><mesh position={[0.35, 1.02, 0]}><sphereGeometry args={[0.09, 22, 22]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.55} /></mesh><mesh position={[0, 0.98, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.008, 8, 48]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.24} /></mesh></group>;
}

function BuilderStatue({ texture, metal, accent }: { texture?: CanvasTexture; metal?: CanvasTexture; accent: string }) {
  return <group><mesh castShadow position={[0, 0.66, 0]}><cylinderGeometry args={[0.24, 0.34, 0.48, 20]} /><meshStandardMaterial map={texture} color="#8a572f" roughness={0.7} metalness={0.16} /></mesh><mesh castShadow position={[0, 1.0, 0]}><sphereGeometry args={[0.2, 22, 22]} /><meshStandardMaterial color="#b67445" roughness={0.78} /></mesh><mesh castShadow position={[0, 0.95, 0.02]}><sphereGeometry args={[0.24, 18, 18]} /><meshStandardMaterial color="#8d512d" roughness={0.9} /></mesh><mesh castShadow position={[-0.34, 0.72, 0]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.04, 0.04, 0.55, 10]} /><meshStandardMaterial map={metal} color="#a56f38" roughness={0.42} metalness={0.42} /></mesh><mesh castShadow position={[-0.48, 0.92, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.22, 0.14, 0.14]} /><meshStandardMaterial color={accent} roughness={0.48} metalness={0.36} /></mesh><Rivets color={accent} /></group>;
}

function RaiderStatue({ texture, metal, accent, color }: { texture?: CanvasTexture; metal?: CanvasTexture; accent: string; color: PlayerColor }) {
  return <group><mesh castShadow position={[0, 0.76, 0]}><cylinderGeometry args={[0.26, 0.36, 0.7, 18]} /><meshStandardMaterial map={texture} color="#435c2d" roughness={0.68} /></mesh><mesh castShadow position={[0, 1.22, 0]}><sphereGeometry args={[0.21, 22, 22]} /><meshStandardMaterial color={color === "BLACK" ? "#6e8f42" : "#89995d"} roughness={0.74} /></mesh><mesh castShadow position={[-0.22, 1.28, 0]} rotation={[0, 0, -0.55]}><coneGeometry args={[0.06, 0.28, 10]} /><meshStandardMaterial color={accent} /></mesh><mesh castShadow position={[0.22, 1.28, 0]} rotation={[0, 0, 0.55]}><coneGeometry args={[0.06, 0.28, 10]} /><meshStandardMaterial color={accent} /></mesh><mesh castShadow position={[0.34, 0.78, 0.04]} rotation={[0, 0, -0.56]}><cylinderGeometry args={[0.05, 0.05, 0.72, 10]} /><meshStandardMaterial color="#4f301d" /></mesh><mesh castShadow position={[0.48, 1.02, 0.04]} rotation={[0, 0, -0.56]}><coneGeometry args={[0.18, 0.32, 4]} /><meshStandardMaterial map={metal} color="#847b70" roughness={0.38} metalness={0.44} /></mesh><Rivets color={accent} /></group>;
}

function ClassSculpture({ role, color, body, accent, glow, textures }: { role: CharacterRole; color: PlayerColor; body: string; accent: string; glow: string; textures: ReturnType<typeof usePieceTextures> }) {
  if (role === "HUNTER") return <HunterStatue texture={textures.body} cloth={textures.cloth} accent={accent} />;
  if (role === "GUARD") return <GuardStatue texture={textures.body} metal={textures.metal} accent={accent} />;
  if (role === "LINK") return <LinkStatue texture={textures.body} cloth={textures.cloth} accent={accent} glow={glow} />;
  if (role === "BUILDER") return <BuilderStatue texture={textures.body} metal={textures.metal} accent={accent} />;
  if (role === "RAIDER") return <RaiderStatue texture={textures.body} metal={textures.metal} accent={accent} color={color} />;
  return <ScoutStatue texture={textures.body} cloth={textures.cloth} accent={accent} />;
}

export function Piece3D({ color, role, worldPosition, selected = false, formation = false }: Piece3DProps) {
  const groupRef = useRef<Group>(null);
  const palette = rolePalette[role];
  const faction = factionMeta(color);
  const [x, , z] = worldPosition;
  const body = color === "BLACK" ? palette.horde : palette.alliance;
  const accent = color === "BLACK" ? faction.trim : palette.accent;
  const textures = usePieceTextures(role, color, body, accent);

  useEffect(() => {
    groupRef.current?.traverse((object) => {
      object.raycast = () => undefined;
    });
  }, []);

  return (
    <group ref={groupRef} position={[x, 0.26, z]} rotation={[0, Math.PI / 4, 0]}>
      <MiniaturePedestal color={color} accent={accent} selected={selected} formation={formation} texture={textures.stone} />
      <group position={[0, 0.18, 0]}><ClassSculpture role={role} color={color} body={body} accent={accent} glow={palette.glow} textures={textures} /></group>
      {formation && <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.6, 0.72, 56]} /><meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={0.3} transparent opacity={0.86} /></mesh>}
    </group>
  );
}
