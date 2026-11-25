import { useMemo } from "react";
import * as THREE from "three";

// Velvet curtains on a rod, gathered on both sides of the window (opening z -0.35..0.85).
// They hang just inside the window wall (x = 1.3) from the rod down to the floor.
const X = 1.225;
const ROD_Y = 2.37;
const TOP = ROD_Y - 0.03;
const HEIGHT = TOP - 0.02;
const PANELS = [
  { z0: -0.585, z1: -0.36, folds: 5 },
  { z0: 0.87, z1: 1.12, folds: 5 },
];

// A flat panel pleated into folds that open up slightly toward the hem
const pleatedPanel = (width, folds) => {
  const geometry = new THREE.PlaneGeometry(width, HEIGHT, folds * 12, 12);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) / width + 0.5; // 0..1 across
    const v = 0.5 - p.getY(i) / HEIGHT; // 0 at the top, 1 at the hem
    const depth = 0.018 + 0.012 * v;
    p.setZ(i, Math.sin(u * folds * Math.PI * 2) * depth);
  }
  geometry.computeVertexNormals();
  return geometry;
};

const Curtains = () => {
  const panels = useMemo(() => PANELS.map(({ z0, z1, folds }) => pleatedPanel(z1 - z0, folds)), []);

  return (
    <group>
      {/* Rod, finials and wall brackets */}
      <mesh position={[X, ROD_Y, 0.34]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 1.84, 16]} />
        <meshStandardMaterial color="#2b2622" roughness={0.4} metalness={0.7} />
      </mesh>
      {[-0.575, 1.255].map((z) => (
        <mesh key={z} position={[X, ROD_Y, z]} castShadow>
          <sphereGeometry args={[0.02, 16, 12]} />
          <meshStandardMaterial color="#2b2622" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {[-0.45, 1.0].map((z) => (
        <mesh key={z} position={[(X + 1.3) / 2, ROD_Y, z]} castShadow>
          <boxGeometry args={[1.3 - X, 0.014, 0.014]} />
          <meshStandardMaterial color="#2b2622" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {PANELS.map(({ z0, z1 }, i) => (
        // Plane spans local x; turning it -90° lays that along +z and faces it into the room
        <mesh key={i} geometry={panels[i]} position={[X, TOP - HEIGHT / 2, (z0 + z1) / 2]} rotation-y={-Math.PI / 2} castShadow receiveShadow>
          {/* Sage-green velvet: deep color with a soft sheen where the light grazes the folds */}
          <meshPhysicalMaterial
            color="#6e8f6c"
            roughness={0.85}
            sheen={1}
            sheenColor="#b9d1b0"
            sheenRoughness={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Curtains;
