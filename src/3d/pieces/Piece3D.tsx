import { useEffect, useMemo } from "react";
import { CanvasTexture, LinearFilter, type Intersection, type Object3D, type Raycaster } from "three";
import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";
import type { Piece3DProps } from "../types/render3d";

const passThroughRaycast = (_raycaster: Raycaster, _intersects: Intersection<Object3D>[]) => undefined;

type Paint = {
  body: string;
  trim: string;
  shadow: string;
  metal: string;
  cloth: string;
  skin: string;
  magic: string;
  outline: string;
};

const rolePaint: Record<CharacterRole, { horde: Partial<Paint>; alliance: Partial<Paint> }> = {
  SCOUT: {
    horde: { body: "#25462b", trim: "#c54d3d", cloth: "#351512", magic: "#8df08b" },
    alliance: { body: "#47774b", trim: "#9ae38a", cloth: "#263f73", magic: "#9eefff" }
  },
  HUNTER: {
    horde: { body: "#6a3d22", trim: "#d56446", cloth: "#461a14", magic: "#f0b56a" },
    alliance: { body: "#8f6338", trim: "#e6b66f", cloth: "#263f73", magic: "#9ed4ff" }
  },
  GUARD: {
    horde: { body: "#343945", trim: "#bf4a3d", cloth: "#4a1712", metal: "#6b6259", magic: "#ff755e" },
    alliance: { body: "#cfd4d8", trim: "#dcb967", cloth: "#25427a", metal: "#e0dfd3", magic: "#8fc8ff" }
  },
  LINK: {
    horde: { body: "#3b254a", trim: "#d45cff", cloth: "#461a2b", magic: "#ff70dd" },
    alliance: { body: "#6553aa", trim: "#c69bff", cloth: "#263f73", magic: "#8dc8ff" }
  },
  BUILDER: {
    horde: { body: "#6a3e21", trim: "#c04c39", cloth: "#3a1712", metal: "#a96a32", magic: "#ffc26a" },
    alliance: { body: "#a56f3b", trim: "#e5b766", cloth: "#284170", metal: "#d09a4e", magic: "#8dc8ff" }
  },
  RAIDER: {
    horde: { body: "#597a35", trim: "#e06043", cloth: "#40180f", skin: "#85a94d", magic: "#ff6d55" },
    alliance: { body: "#718259", trim: "#d8b868", cloth: "#263f73", skin: "#9cab6a", magic: "#8dc8ff" }
  }
};

function factionPaint(color: PlayerColor, role: CharacterRole): Paint {
  const base: Paint = color === "BLACK"
    ? {
        body: "#273423",
        trim: "#b94636",
        shadow: "#080607",
        metal: "#5a5149",
        cloth: "#471914",
        skin: role === "RAIDER" ? "#82a64e" : "#c3895d",
        magic: "#ff6d55",
        outline: "#030303"
      }
    : {
        body: "#d8d7cc",
        trim: "#4777bf",
        shadow: "#0b0d12",
        metal: "#c8c2b4",
        cloth: "#263f73",
        skin: role === "RAIDER" ? "#9cab6a" : "#d4a176",
        magic: "#8dc8ff",
        outline: "#05070b"
      };

  return { ...base, ...(color === "BLACK" ? rolePaint[role].horde : rolePaint[role].alliance) };
}

function drawEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBlade(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, color: string, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -length / 2);
  ctx.lineTo(10, length / 2 - 14);
  ctx.lineTo(0, length / 2);
  ctx.lineTo(-10, length / 2 - 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTexturedStroke(ctx: CanvasRenderingContext2D, color: string, trim: string) {
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = trim;
  ctx.lineWidth = 3;
  for (let i = -80; i < 260; i += 22) {
    ctx.beginPath();
    ctx.moveTo(i, 20);
    ctx.lineTo(i + 110, 270);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i < 260; i += 12) {
    ctx.beginPath();
    ctx.moveTo(18, i);
    ctx.quadraticCurveTo(130, i + 20, 238, i - 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function makeCharacterTexture(role: CharacterRole, color: PlayerColor) {
  const paint = factionPaint(color, role);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.75)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 14;
  drawEllipse(ctx, 128, 278, 66, 18, "rgba(0,0,0,.4)");
  ctx.restore();

  // Aura/faction backplate.
  ctx.save();
  const aura = ctx.createRadialGradient(128, 160, 16, 128, 160, 120);
  aura.addColorStop(0, `${paint.magic}88`);
  aura.addColorStop(0.52, `${paint.magic}22`);
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(128, 166, 102, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cape / silhouette mass.
  ctx.fillStyle = paint.outline;
  ctx.beginPath();
  ctx.moveTo(93, 95);
  ctx.quadraticCurveTo(54, 146, 76, 262);
  ctx.lineTo(180, 262);
  ctx.quadraticCurveTo(202, 146, 163, 95);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = paint.cloth;
  ctx.beginPath();
  ctx.moveTo(98, 102);
  ctx.quadraticCurveTo(62, 152, 83, 252);
  ctx.lineTo(173, 252);
  ctx.quadraticCurveTo(194, 152, 158, 102);
  ctx.closePath();
  ctx.fill();
  drawTexturedStroke(ctx, paint.body, paint.trim);

  // Legs.
  ctx.strokeStyle = paint.outline;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(112, 208);
  ctx.lineTo(92, 270);
  ctx.moveTo(144, 208);
  ctx.lineTo(166, 270);
  ctx.stroke();

  ctx.strokeStyle = paint.body;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(112, 208);
  ctx.lineTo(92, 270);
  ctx.moveTo(144, 208);
  ctx.lineTo(166, 270);
  ctx.stroke();

  // Torso.
  ctx.fillStyle = paint.outline;
  ctx.beginPath();
  ctx.roundRect(86, 108, 84, 112, 22);
  ctx.fill();

  ctx.fillStyle = paint.body;
  ctx.beginPath();
  ctx.roundRect(93, 113, 70, 102, 19);
  ctx.fill();

  const armor = ctx.createLinearGradient(96, 116, 160, 210);
  armor.addColorStop(0, "rgba(255,255,255,.28)");
  armor.addColorStop(0.5, "rgba(255,255,255,.03)");
  armor.addColorStop(1, "rgba(0,0,0,.28)");
  ctx.fillStyle = armor;
  ctx.beginPath();
  ctx.roundRect(98, 118, 60, 92, 16);
  ctx.fill();

  // Trim and emblem.
  ctx.strokeStyle = paint.trim;
  ctx.lineWidth = 5;
  ctx.strokeRect(103, 126, 50, 74);
  ctx.fillStyle = paint.trim;
  ctx.beginPath();
  ctx.moveTo(128, 138);
  ctx.lineTo(142, 158);
  ctx.lineTo(128, 178);
  ctx.lineTo(114, 158);
  ctx.closePath();
  ctx.fill();

  // Arms.
  ctx.strokeStyle = paint.outline;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(92, 132);
  ctx.lineTo(55, 192);
  ctx.moveTo(164, 132);
  ctx.lineTo(204, 190);
  ctx.stroke();
  ctx.strokeStyle = paint.body;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(92, 132);
  ctx.lineTo(55, 192);
  ctx.moveTo(164, 132);
  ctx.lineTo(204, 190);
  ctx.stroke();

  // Head/hood.
  drawEllipse(ctx, 128, 82, 32, 35, paint.outline);
  drawEllipse(ctx, 128, 82, 25, 28, paint.skin);
  ctx.fillStyle = paint.cloth;
  ctx.beginPath();
  ctx.moveTo(92, 88);
  ctx.quadraticCurveTo(128, 30, 164, 88);
  ctx.quadraticCurveTo(150, 63, 128, 61);
  ctx.quadraticCurveTo(106, 63, 92, 88);
  ctx.fill();

  // Class-specific silhouette and props.
  if (role === "SCOUT") {
    drawBlade(ctx, 47, 203, 74, paint.metal, -0.62);
    drawBlade(ctx, 211, 201, 74, paint.metal, 0.62);
    ctx.strokeStyle = paint.trim;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(105, 105);
    ctx.lineTo(82, 80);
    ctx.moveTo(151, 105);
    ctx.lineTo(174, 80);
    ctx.stroke();
  } else if (role === "HUNTER") {
    ctx.strokeStyle = paint.trim;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(198, 152, 54, -1.3, 1.3);
    ctx.stroke();
    ctx.strokeStyle = paint.metal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(196, 100);
    ctx.lineTo(196, 205);
    ctx.moveTo(183, 155);
    ctx.lineTo(228, 148);
    ctx.stroke();
    ctx.fillStyle = paint.cloth;
    ctx.fillRect(66, 86, 16, 95);
  } else if (role === "GUARD") {
    ctx.fillStyle = paint.metal;
    ctx.beginPath();
    ctx.roundRect(172, 130, 52, 76, 12);
    ctx.fill();
    ctx.strokeStyle = paint.trim;
    ctx.lineWidth = 5;
    ctx.strokeRect(181, 143, 34, 50);
    drawBlade(ctx, 50, 151, 115, paint.metal, 0.1);
  } else if (role === "LINK") {
    ctx.strokeStyle = paint.metal;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(58, 215);
    ctx.lineTo(58, 85);
    ctx.stroke();
    drawEllipse(ctx, 58, 74, 17, 17, paint.magic);
    drawEllipse(ctx, 205, 168, 20, 20, paint.magic);
    ctx.strokeStyle = paint.magic;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(128, 151, 72, 28, -0.2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (role === "BUILDER") {
    ctx.strokeStyle = paint.metal;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(58, 195);
    ctx.lineTo(89, 118);
    ctx.stroke();
    ctx.fillStyle = paint.trim;
    ctx.beginPath();
    ctx.roundRect(39, 105, 50, 24, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,240,190,.85)";
    ctx.beginPath();
    ctx.roundRect(176, 144, 48, 62, 8);
    ctx.fill();
    ctx.strokeStyle = paint.trim;
    ctx.lineWidth = 2;
    ctx.strokeRect(184, 154, 32, 42);
  } else if (role === "RAIDER") {
    ctx.fillStyle = paint.skin;
    ctx.beginPath();
    ctx.ellipse(99, 80, 12, 22, -0.7, 0, Math.PI * 2);
    ctx.ellipse(157, 80, 12, 22, 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = paint.metal;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(199, 214);
    ctx.lineTo(171, 92);
    ctx.stroke();
    ctx.fillStyle = paint.metal;
    ctx.beginPath();
    ctx.moveTo(158, 78);
    ctx.lineTo(207, 104);
    ctx.lineTo(178, 126);
    ctx.closePath();
    ctx.fill();
  }

  // Highlight and outline pass.
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(106, 119);
  ctx.quadraticCurveTo(128, 105, 151, 119);
  ctx.stroke();

  ctx.globalCompositeOperation = "destination-over";
  ctx.strokeStyle = "rgba(0,0,0,.82)";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.roundRect(80, 50, 96, 216, 34);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";

  const texture = new CanvasTexture(canvas);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function MiniaturePedestal({ color, accent, selected, formation }: { color: PlayerColor; accent: string; selected?: boolean; formation?: boolean }) {
  const faction = factionPaint(color, "SCOUT");
  const stone = color === "BLACK" ? "#181411" : "#d7d0bd";
  const metal = color === "BLACK" ? "#4d4139" : "#c8c2b4";
  const rune = color === "BLACK" ? "#ff6d55" : "#8dc8ff";

  return (
    <group>
      <mesh raycast={passThroughRaycast} castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.16, 48]} />
        <meshStandardMaterial color={stone} roughness={0.86} metalness={0.12} />
      </mesh>
      <mesh raycast={passThroughRaycast} castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.43, 0.49, 0.12, 48]} />
        <meshStandardMaterial color={metal} roughness={0.62} metalness={0.38} />
      </mesh>
      <mesh raycast={passThroughRaycast} castShadow receiveShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.34, 0.39, 0.1, 48]} />
        <meshStandardMaterial color={accent} roughness={0.48} metalness={0.24} emissive={formation ? rune : "#000000"} emissiveIntensity={formation ? 0.22 : 0} />
      </mesh>
      <mesh raycast={passThroughRaycast} position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.39, 0.43, 48]} />
        <meshStandardMaterial color={faction.trim} emissive={rune} emissiveIntensity={0.08} />
      </mesh>
      {selected && (
        <mesh raycast={passThroughRaycast} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.54, 0.63, 56]} />
          <meshStandardMaterial color="#f3d58d" emissive="#f3d58d" emissiveIntensity={0.34} />
        </mesh>
      )}
    </group>
  );
}

function CharacterStandee({ role, color }: { role: CharacterRole; color: PlayerColor }) {
  const texture = useMemo(() => makeCharacterTexture(role, color), [role, color]);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  if (!texture) return null;

  return (
    <sprite raycast={passThroughRaycast} position={[0, 1.12, 0]} scale={[0.92, 1.2, 1]}>
      <spriteMaterial map={texture} transparent alphaTest={0.04} depthWrite={false} />
    </sprite>
  );
}

export function Piece3D({ color, role, worldPosition, selected = false, formation = false }: Piece3DProps) {
  const paint = factionPaint(color, role);
  const [x, , z] = worldPosition;

  return (
    <group position={[x, 0.22, z]}>
      <MiniaturePedestal color={color} accent={paint.trim} selected={selected} formation={formation} />
      <CharacterStandee role={role} color={color} />
      {formation && (
        <mesh raycast={passThroughRaycast} position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.72, 56]} />
          <meshStandardMaterial color={paint.magic} emissive={paint.magic} emissiveIntensity={0.3} transparent opacity={0.86} />
        </mesh>
      )}
    </group>
  );
}
