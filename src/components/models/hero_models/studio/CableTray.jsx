import { useMemo } from "react";
import * as THREE from "three";

// Cable tray under the back of the desk: a black steel trough with a power strip and the
// cables laid in it, so nothing hangs loose. Origin = underside of the desk top.
const L = 0.9;
const D = 0.08;
const H = 0.045;
const Z = -0.52; // clear of the desk's back beam (z -0.475..-0.445)

const Steel = () => <meshStandardMaterial color="#141416" roughness={0.5} metalness={0.6} />;

const CableTray = (props) => {
  const cables = useMemo(
    () =>
      // In front of the power strip, so they never pass through it
      [0.017, 0.027].map((dz, i) => {
        const pts = [];
        for (let k = 0; k <= 8; k++) {
          const x = -L / 2 + 0.03 + (k / 8) * (L - 0.06);
          pts.push(new THREE.Vector3(x, -H + 0.008 + Math.sin(k * 1.3 + i) * 0.002, Z + dz + Math.sin(k * 0.9 + i * 2) * 0.003));
        }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.003, 6);
      }),
    []
  );

  return (
    <group {...props}>
      {/* Brackets up to the desk */}
      {[-L / 2 + 0.06, L / 2 - 0.06].map((x) => (
        <mesh key={x} position={[x, -0.008, Z]}>
          <boxGeometry args={[0.02, 0.016, D]} />
          <Steel />
        </mesh>
      ))}
      <mesh position={[0, -H, Z]} castShadow receiveShadow>
        <boxGeometry args={[L, 0.003, D]} />
        <Steel />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, -H + 0.018, Z + side * (D / 2)]} castShadow>
          <boxGeometry args={[L, 0.036, 0.003]} />
          <Steel />
        </mesh>
      ))}

      {/* Power strip and cables */}
      <mesh position={[-0.15, -H + 0.013, Z - 0.012]} castShadow>
        <boxGeometry args={[0.28, 0.022, 0.045]} />
        <meshStandardMaterial color="#e9e7e2" roughness={0.5} />
      </mesh>
      <mesh position={[-0.296, -H + 0.019, Z - 0.012]}>
        <boxGeometry args={[0.006, 0.006, 0.01]} />
        <meshBasicMaterial color="#ff5a3c" toneMapped={false} />
      </mesh>
      {cables.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshStandardMaterial color="#0d0d0e" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

export default CableTray;
