import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { leafGeometry, leafMatrix } from "./leafGeometry";
import { seeded } from "./surfaceTextures";

// Trailing pothos in a ceramic pot. Origin = the shelf surface under the pot; its vines
// drape over a shelf edge about 19 cm in front of the pot's center.
// Vines leave the pot, cross the board and drape over its front edge (local z ≈ 0.19)
const VINES = [
  [[-0.03, 0.13, 0.02], [-0.05, 0.155, 0.085], [-0.06, 0.03, 0.16], [-0.07, -0.02, 0.205], [-0.09, -0.16, 0.215], [-0.06, -0.36, 0.21]],
  [[0.03, 0.13, 0.02], [0.05, 0.155, 0.085], [0.07, 0.03, 0.17], [0.09, -0.02, 0.205], [0.1, -0.12, 0.215], [0.14, -0.26, 0.21]],
  [[0.0, 0.13, 0.02], [0.0, 0.155, 0.085], [0.0, 0.03, 0.17], [0.01, -0.02, 0.205], [-0.01, -0.09, 0.212]],
].map((points) => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))));
const CROWN_LEAVES = 12;
const LEAVES_PER_VINE = 9;
const POTHOS_LEAVES = CROWN_LEAVES + VINES.length * LEAVES_PER_VINE;

const Pothos = (props) => {
  const leaves = useRef();
  const vines = useMemo(() => VINES.map((curve) => new THREE.TubeGeometry(curve, 24, 0.0025, 5)), []);

  useLayoutEffect(() => {
    const r = seeded(3);
    const color = new THREE.Color();
    let i = 0;
    const add = (pos, dir, size) => {
      leaves.current.setMatrixAt(i, leafMatrix(pos, dir, r() * 2, size));
      leaves.current.setColorAt(i, color.set(i % 3 ? "#4f7d3a" : "#6c9a45"));
      i++;
    };
    // Crown: leaves rising out of the pot
    for (let k = 0; k < CROWN_LEAVES; k++) {
      const a = (k / CROWN_LEAVES) * Math.PI * 2;
      add(new THREE.Vector3(Math.cos(a) * 0.03, 0.13, Math.sin(a) * 0.03), new THREE.Vector3(Math.cos(a), 0.9, Math.sin(a)), 0.06 + r() * 0.02);
    }
    // Trailing: each leaf grows from a point on its vine, facing out from the shelf
    for (const curve of VINES) {
      for (let k = 0; k < LEAVES_PER_VINE; k++) {
        const t = 0.15 + (k / LEAVES_PER_VINE) * 0.85;
        const side = k % 2 ? 1 : -1;
        add(curve.getPoint(t), new THREE.Vector3(side * 0.8, -0.35, 1), 0.04 + r() * 0.025);
      }
    }
    leaves.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group {...props}>
      <mesh position-y={0.07} castShadow>
        <cylinderGeometry args={[0.075, 0.06, 0.14, 28]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.7} />
      </mesh>
      {vines.map((geometry, k) => (
        <mesh key={k} geometry={geometry} castShadow>
          <meshStandardMaterial color="#5b7a35" roughness={0.7} />
        </mesh>
      ))}
      <instancedMesh ref={leaves} args={[leafGeometry, undefined, POTHOS_LEAVES]} castShadow>
        <meshStandardMaterial roughness={0.55} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};

export default Pothos;
