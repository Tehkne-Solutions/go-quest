import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { boardToWorld } from "../hooks/useBoard3DPositions";
import type { BoardFxEvent, BoardFxType } from "../types/render3d";

const fxPalette: Record<BoardFxType, string> = {
  spawn: "#f3d58d",
  select: "#8fd6ff",
  group: "#7cff9b",
  capture: "#ff6b52",
  mission: "#c79cff"
};

type BoardFx3DProps = {
  events: BoardFxEvent[];
};

function seededParticles(seed: string, count: number) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;

  return Array.from({ length: count }, (_, index) => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const angle = ((hash % 360) / 180) * Math.PI;
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const radius = 0.18 + ((hash % 100) / 100) * 0.62;
    const height = 0.32 + index * 0.025;

    return {
      x: Math.cos(angle) * radius,
      y: height,
      z: Math.sin(angle) * radius,
      scale: 0.035 + ((hash % 30) / 1000)
    };
  });
}

function EventFx({ event }: { event: BoardFxEvent }) {
  const ref = useRef<Group>(null);
  const [x, , z] = boardToWorld(event.position);
  const color = fxPalette[event.type];
  const particles = useMemo(() => seededParticles(event.id, event.type === "capture" ? 18 : 14), [event.id, event.type]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (event.type === "capture" ? -2.4 : 1.7);
    const pulse = 1 + Math.sin(elapsed * 12) * 0.06;
    ref.current.scale.setScalar(pulse);
  });

  const ringSize = event.type === "capture" ? [0.42, 0.62] : event.type === "group" ? [0.5, 0.72] : [0.36, 0.54];
  const particleColor = event.color === "BLACK" && event.type !== "capture" ? "#ff705f" : event.color === "WHITE" ? "#8dc8ff" : color;

  return (
    <group ref={ref} position={[x, 0.32, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ringSize[0], ringSize[1], 44]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} transparent opacity={0.82} />
      </mesh>

      {particles.map((particle, index) => (
        <mesh key={`${event.id}-${index}`} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshStandardMaterial color={particleColor} emissive={particleColor} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {event.type === "group" && (
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.012, 8, 64]} />
          <meshStandardMaterial color="#7cff9b" emissive="#7cff9b" emissiveIntensity={0.48} />
        </mesh>
      )}
    </group>
  );
}

export function BoardFx3D({ events }: BoardFx3DProps) {
  return (
    <>
      {events.map((event) => (
        <EventFx key={event.id} event={event} />
      ))}
    </>
  );
}
