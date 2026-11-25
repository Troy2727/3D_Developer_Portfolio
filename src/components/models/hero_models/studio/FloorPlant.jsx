import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { leafGeometry, leafMatrix } from "./leafGeometry";
import { seeded } from "./surfaceTextures";

// Fiddle-leaf fig, ~1.4 m tall, in a charcoal planter
const FloorPlant = (props) => {
  const leaves = useRef();
  const LEAF_COUNT = 46;

  const branches = useMemo(() => {
    const r = seeded(17);
    return Array.from({ length: LEAF_COUNT }, (_, i) => {
      const y = 0.55 + (i / LEAF_COUNT) * 0.8 + r() * 0.06;
      // Leaves turn toward the window (+x), like a real plant growing to the light,
      // which also keeps them clear of the desk beside it
      const a = -1.9 + ((i * 2.4 + r() * 0.6) % 3.8);
      const reach = 0.04 + r() * 0.12 * (1 - (y - 0.55) / 1.2);
      return { pos: [Math.cos(a) * reach, y, Math.sin(a) * reach], a, tilt: 0.5 + r() * 0.6, s: 0.8 + r() * 0.5 };
    });
  }, []);

  useLayoutEffect(() => {
    const color = new THREE.Color();
    branches.forEach((b, i) => {
      // Leaves point outward and upward from the stem
      const dir = new THREE.Vector3(Math.cos(b.a), b.tilt, Math.sin(b.a));
      leaves.current.setMatrixAt(i, leafMatrix(new THREE.Vector3(...b.pos), dir, b.a, 0.15 * b.s));
      leaves.current.setColorAt(i, color.set(i % 3 ? "#35602f" : "#4a7a3c"));
    });
    leaves.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceColor.needsUpdate = true;
  }, [branches]);

  return (
    <group {...props}>
      <mesh position-y={0.17} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.14, 0.34, 32]} />
        <meshStandardMaterial color="#2b2a29" roughness={0.85} />
      </mesh>
      <mesh position-y={0.335} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial color="#3a2a1e" roughness={1} />
      </mesh>
      <mesh position-y={0.8} castShadow>
        <cylinderGeometry args={[0.014, 0.02, 0.95, 10]} />
        <meshStandardMaterial color="#6b5440" roughness={0.9} />
      </mesh>
      <instancedMesh ref={leaves} args={[leafGeometry, undefined, LEAF_COUNT]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.5} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};

export default FloorPlant;
