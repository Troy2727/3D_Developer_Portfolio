import { useMemo } from "react";
import * as THREE from "three";

import { seeded } from "./surfaceTextures";

// Slim open-top bin, 34 cm tall, matte charcoal steel with a brushed rim, a few crumpled
// paper balls inside. Origin = floor under its center.
const H = 0.34;
const R_TOP = 0.125;
const R_BOTTOM = 0.105;

// Crumpled paper: a lumpy low-poly ball
const crumpled = (seed) => {
  const r = seeded(seed);
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = 0.75 + r() * 0.45;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k);
  }
  geometry.computeVertexNormals();
  return geometry;
};

const PAPERS = [
  { seed: 3, pos: [-0.03, H - 0.05, 0.02], r: 0.04 },
  { seed: 7, pos: [0.04, H - 0.06, -0.02], r: 0.036 },
  { seed: 11, pos: [0.0, H - 0.03, -0.045], r: 0.033 },
];

const TrashCan = (props) => {
  const papers = useMemo(() => PAPERS.map((paper) => ({ ...paper, geometry: crumpled(paper.seed) })), []);

  return (
    <group {...props}>
      {/* Body: open at the top so you can see inside */}
      <mesh position-y={H / 2} castShadow receiveShadow>
        <cylinderGeometry args={[R_TOP, R_BOTTOM, H, 40, 1, true]} />
        <meshStandardMaterial color="#26262b" roughness={0.55} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={0.004} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[R_BOTTOM, 40]} />
        <meshStandardMaterial color="#1c1c20" roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh position-y={H} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[R_TOP, 0.005, 8, 48]} />
        <meshStandardMaterial color="#b9bcc2" roughness={0.25} metalness={1} />
      </mesh>

      {/* Crumpled sketches near the top, as if it's nearly full */}
      <mesh position-y={H - 0.09} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[R_TOP - 0.008, 40]} />
        <meshStandardMaterial color="#d9d4ca" roughness={1} />
      </mesh>
      {papers.map(({ seed, pos, r, geometry }) => (
        <mesh key={seed} geometry={geometry} position={pos} scale={r} rotation={[seed, seed * 2, 0]} castShadow>
          <meshStandardMaterial color="#f1ede4" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  );
};

export default TrashCan;
