import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

// Venetian blinds inside the window opening of the right wall (x = 1.3).
// The tilted slats are what cast the light stripes across the room.
const WINDOW = { z0: -0.35, z1: 0.85, y0: 0.85, y1: 2.25 };
const SLAT = { depth: 0.025, gap: 0.026, tilt: -0.35 };
const X = 1.265;
const LENGTH = WINDOW.z1 - WINDOW.z0 - 0.03;
const Z = (WINDOW.z0 + WINDOW.z1) / 2;
const COUNT = Math.floor((WINDOW.y1 - WINDOW.y0 - 0.1) / SLAT.gap);

const White = () => <meshStandardMaterial color="#f1ede6" roughness={0.6} />;

const Blinds = () => {
  const slats = useRef();

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, SLAT.tilt));
    for (let i = 0; i < COUNT; i++) {
      m.compose(new THREE.Vector3(X, WINDOW.y1 - 0.07 - i * SLAT.gap, Z), q, new THREE.Vector3(1, 1, 1));
      slats.current.setMatrixAt(i, m);
    }
    slats.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* Window frame and sill */}
      {[
        [[0.1, 0.04, 1.2], [1.35, WINDOW.y1 - 0.02, Z]],
        [[0.1, 1.4, 0.04], [1.35, 1.55, WINDOW.z0 + 0.02]],
        [[0.1, 1.4, 0.04], [1.35, 1.55, WINDOW.z1 - 0.02]],
        [[0.1, 1.4, 0.03], [1.35, 1.55, Z]],
        [[0.2, 0.03, 1.28], [1.31, WINDOW.y0 - 0.005, Z]],
      ].map(([args, position], i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <boxGeometry args={args} />
          <White />
        </mesh>
      ))}

      <mesh position={[X, WINDOW.y1 - 0.03, Z]} castShadow>
        <boxGeometry args={[0.05, 0.045, LENGTH + 0.02]} />
        <White />
      </mesh>
      <instancedMesh ref={slats} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
        <boxGeometry args={[SLAT.depth, 0.0012, LENGTH]} />
        <White />
      </instancedMesh>
      <mesh position={[X, WINDOW.y1 - 0.08 - COUNT * SLAT.gap, Z]} castShadow>
        <boxGeometry args={[0.03, 0.012, LENGTH]} />
        <White />
      </mesh>
      {/* Ladder cords */}
      {[Z - 0.4, Z + 0.4].map((z) => (
        <mesh key={z} position={[X, (WINDOW.y1 + WINDOW.y0) / 2, z]}>
          <boxGeometry args={[0.028, WINDOW.y1 - WINDOW.y0 - 0.06, 0.002]} />
          <meshStandardMaterial color="#e6e0d6" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

export default Blinds;
