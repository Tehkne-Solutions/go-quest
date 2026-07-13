import { BOARD_3D_HALF, BOARD_3D_SPACING } from "../hooks/useBoard3DPositions";

const gridLength = BOARD_3D_HALF * 2;
const boardLength = gridLength + 1.7;

function ArenaCorner({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0.18, z]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.28, 6]} />
        <meshStandardMaterial color="#18120f" roughness={0.82} metalness={0.16} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.36} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function BoardGround() {
  const lines = Array.from({ length: 5 }, (_, index) => index * BOARD_3D_SPACING - BOARD_3D_HALF);

  return (
    <group>
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[boardLength + 1.0, 0.42, boardLength + 1.0]} />
        <meshStandardMaterial color="#17100d" roughness={0.92} metalness={0.04} />
      </mesh>

      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[boardLength, 0.24, boardLength]} />
        <meshStandardMaterial color="#3a332d" roughness={0.88} metalness={0.06} />
      </mesh>

      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[boardLength - 0.42, 0.14, boardLength - 0.42]} />
        <meshStandardMaterial color="#5b5248" roughness={0.95} metalness={0.03} />
      </mesh>

      <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[boardLength - 0.62, boardLength - 0.62, 10, 10]} />
        <meshStandardMaterial color="#71675b" roughness={0.96} metalness={0.02} />
      </mesh>

      {lines.map((x) => (
        <mesh key={`v-${x}`} position={[x, 0.232, 0]} receiveShadow>
          <boxGeometry args={[0.028, 0.02, gridLength]} />
          <meshStandardMaterial color="#c89445" roughness={0.55} metalness={0.28} emissive="#4f3413" emissiveIntensity={0.04} />
        </mesh>
      ))}

      {lines.map((z) => (
        <mesh key={`h-${z}`} position={[0, 0.236, z]} receiveShadow>
          <boxGeometry args={[gridLength, 0.02, 0.028]} />
          <meshStandardMaterial color="#c89445" roughness={0.55} metalness={0.28} emissive="#4f3413" emissiveIntensity={0.04} />
        </mesh>
      ))}

      <mesh position={[0, 0.16, -boardLength / 2 - 0.03]} receiveShadow>
        <boxGeometry args={[boardLength + 0.16, 0.28, 0.18]} />
        <meshStandardMaterial color="#1f1713" roughness={0.78} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.16, boardLength / 2 + 0.03]} receiveShadow>
        <boxGeometry args={[boardLength + 0.16, 0.28, 0.18]} />
        <meshStandardMaterial color="#1f1713" roughness={0.78} metalness={0.2} />
      </mesh>
      <mesh position={[-boardLength / 2 - 0.03, 0.16, 0]} receiveShadow>
        <boxGeometry args={[0.18, 0.28, boardLength + 0.16]} />
        <meshStandardMaterial color="#1f1713" roughness={0.78} metalness={0.2} />
      </mesh>
      <mesh position={[boardLength / 2 + 0.03, 0.16, 0]} receiveShadow>
        <boxGeometry args={[0.18, 0.28, boardLength + 0.16]} />
        <meshStandardMaterial color="#1f1713" roughness={0.78} metalness={0.2} />
      </mesh>

      <ArenaCorner x={-boardLength / 2 + 0.3} z={-boardLength / 2 + 0.3} color="#ff725f" />
      <ArenaCorner x={boardLength / 2 - 0.3} z={boardLength / 2 - 0.3} color="#ff725f" />
      <ArenaCorner x={boardLength / 2 - 0.3} z={-boardLength / 2 + 0.3} color="#8dc8ff" />
      <ArenaCorner x={-boardLength / 2 + 0.3} z={boardLength / 2 - 0.3} color="#8dc8ff" />
    </group>
  );
}
