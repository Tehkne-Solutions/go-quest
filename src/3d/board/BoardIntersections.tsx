import { useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Intersection3DProps } from "../types/render3d";

export function BoardIntersection3D({
  position,
  worldPosition,
  isExpected,
  isSelected,
  onClick
}: Intersection3DProps) {
  const [hovered, setHovered] = useState(false);
  const [x, , z] = worldPosition;

  const color = isSelected
    ? "#f3d58d"
    : isExpected
      ? "#70d07c"
      : hovered
        ? "#f2c76e"
        : "#9c7644";

  const emissive = isExpected ? "#70d07c" : hovered ? "#f2c76e" : "#000000";

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onClick(position);
  }

  return (
    <group position={[x, 0.245, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
      >
        <circleGeometry args={[0.48, 44]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.12, 36]} />
        <meshStandardMaterial color="#372d26" roughness={0.88} metalness={0.12} />
      </mesh>

      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.21, 0.25, 0.08, 36]} />
        <meshStandardMaterial color="#6c6052" roughness={0.94} metalness={0.04} />
      </mesh>

      <mesh position={[0, 0.135, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, isExpected || hovered || isSelected ? 0.32 : 0.26, 40]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={isExpected || hovered ? 0.32 : 0.08} />
      </mesh>

      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[isExpected || hovered || isSelected ? 0.08 : 0.052, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isExpected || hovered ? 0.45 : 0.1} />
      </mesh>
    </group>
  );
}
