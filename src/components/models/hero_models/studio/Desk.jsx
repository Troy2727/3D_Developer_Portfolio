import { useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { oakTexture } from "./surfaceTextures";

// Desk 160 x 75 cm, top at 75 cm, pushed against the back wall (z = -0.6)
const TOP = 0.75;
const DESK = { w: 1.6, d: 0.75, z: -0.2 };
const MAT_TOP = TOP + 0.003;

const Steel = () => <meshStandardMaterial color="#1b1b1d" roughness={0.5} metalness={0.7} />;

// Magic Keyboard-sized: 279 x 115 mm, 15 key units wide
const U = 0.0185;
const KEY_ROWS = [
  { w: Array(14).fill(15 / 14), h: 0.5 },
  { w: [...Array(13).fill(1), 2] },
  { w: [1.5, ...Array(12).fill(1), 1.5] },
  { w: [1.75, ...Array(11).fill(1), 2.25] },
  { w: [2.25, ...Array(10).fill(1), 2.75] },
  { w: [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1] },
];

const Keyboard = (props) => {
  const keys = useRef();
  const count = KEY_ROWS.reduce((n, row) => n + row.w.length, 0);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    let z = -0.051;
    for (const row of KEY_ROWS) {
      const depth = (row.h ?? 1) * U;
      let x = -7.5 * U;
      for (const w of row.w) {
        m.compose(
          new THREE.Vector3(x + (w * U) / 2, 0.0055, z + depth / 2),
          new THREE.Quaternion(),
          new THREE.Vector3(w * U - 0.0026, 0.003, depth - 0.0026)
        );
        keys.current.setMatrixAt(i++, m);
        x += w * U;
      }
      z += depth;
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group {...props}>
      <RoundedBox args={[0.279, 0.006, 0.115]} radius={0.0028} smoothness={2} position-y={0.003} castShadow receiveShadow>
        <meshStandardMaterial color="#d9dadd" roughness={0.3} metalness={0.55} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, count]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#f7f7f5" roughness={0.55} />
      </instancedMesh>
    </group>
  );
};

const Mouse = (props) => (
  // Lower half of the ellipsoid sits inside the mat, leaving the Magic Mouse dome
  <mesh {...props} scale={[0.057, 0.043, 0.1135]} castShadow>
    <sphereGeometry args={[0.5, 48, 24]} />
    <meshPhysicalMaterial color="#f4f4f2" roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} />
  </mesh>
);

const Mug = (props) => (
  <group {...props}>
    <mesh position-y={0.0475} castShadow receiveShadow>
      <cylinderGeometry args={[0.041, 0.038, 0.095, 40]} />
      <meshStandardMaterial color="#e9e4dc" roughness={0.6} />
    </mesh>
    <mesh position-y={0.0953} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[0.037, 40]} />
      <meshStandardMaterial color="#2a170c" roughness={0.15} />
    </mesh>
    <mesh position={[0.045, 0.05, 0]} castShadow>
      <torusGeometry args={[0.022, 0.006, 12, 24, Math.PI]} />
      <meshStandardMaterial color="#e9e4dc" roughness={0.6} />
    </mesh>
  </group>
);

// Snake plant in a concrete pot
const Plant = (props) => {
  const blades = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        a: (i / 9) * Math.PI * 2,
        h: 0.22 + ((i * 37) % 11) / 60,
        lean: 0.08 + ((i * 13) % 5) / 40,
      })),
    []
  );
  return (
    <group {...props}>
      <mesh position-y={0.06} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.056, 0.12, 32]} />
        <meshStandardMaterial color="#b8b2a7" roughness={0.9} />
      </mesh>
      <mesh position-y={0.112} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.064, 32]} />
        <meshStandardMaterial color="#3a2a1e" roughness={1} />
      </mesh>
      {blades.map(({ a, h, lean }, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.025, 0.11 + h / 2, Math.sin(a) * 0.025]}
          rotation={[Math.sin(a) * lean, -a, -Math.cos(a) * lean]}
          scale={[1, 1, 0.18]}
          castShadow
        >
          <coneGeometry args={[0.022, h, 6]} />
          <meshStandardMaterial color={i % 2 ? "#3f6b3a" : "#55804a"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const Desk = () => {
  const oak = useMemo(() => oakTexture(), []);

  return (
    <group>
      {/* Oak top */}
      <mesh position={[0, TOP - 0.015, DESK.z]} castShadow receiveShadow>
        <boxGeometry args={[DESK.w, 0.03, DESK.d]} />
        <meshStandardMaterial map={oak} roughness={0.5} />
      </mesh>

      {/* Steel T-legs and back beam */}
      {[-0.72, 0.72].map((x) => (
        <group key={x} position-x={x}>
          <mesh position={[0, 0.36, DESK.z]} castShadow receiveShadow>
            <boxGeometry args={[0.06, 0.69, 0.06]} />
            <Steel />
          </mesh>
          <mesh position={[0, 0.015, DESK.z]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.03, 0.68]} />
            <Steel />
          </mesh>
          <mesh position={[0, TOP - 0.045, DESK.z]} castShadow>
            <boxGeometry args={[0.07, 0.03, 0.66]} />
            <Steel />
          </mesh>
        </group>
      ))}
      <mesh position={[0, TOP - 0.06, DESK.z - 0.26]} castShadow>
        <boxGeometry args={[1.38, 0.05, 0.03]} />
        <Steel />
      </mesh>

      {/* Felt desk mat, set back 2.5 cm from the front edge */}
      <mesh position={[0.02, TOP + 0.0015, -0.05]} receiveShadow>
        <boxGeometry args={[0.9, 0.003, 0.4]} />
        <meshStandardMaterial color="#2b2d31" roughness={1} />
      </mesh>

      <Keyboard position={[-0.04, MAT_TOP, 0.01]} rotation-x={0.035} />
      <Mouse position={[0.23, MAT_TOP, 0.02]} />

      {/* Phone, face down */}
      <RoundedBox args={[0.072, 0.008, 0.147]} radius={0.0035} position={[0.38, MAT_TOP + 0.004, -0.06]} rotation-y={-0.2} castShadow>
        <meshStandardMaterial color="#3b3d42" roughness={0.35} metalness={0.5} />
      </RoundedBox>

      {/* Notebook and pen */}
      <group position={[-0.6, TOP, 0.03]} rotation-y={0.22}>
        <mesh position-y={0.007} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.014, 0.21]} />
          <meshStandardMaterial color="#2f4a3c" roughness={0.8} />
        </mesh>
        <mesh position={[0.03, 0.0175, 0]} rotation={[Math.PI / 2, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.14, 12]} />
          <meshStandardMaterial color="#c9a227" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      <Mug position={[-0.62, TOP, -0.26]} />
      <Plant position={[0.66, TOP, -0.43]} />
    </group>
  );
};

export default Desk;
