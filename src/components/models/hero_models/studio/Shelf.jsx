import { useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { leafGeometry, leafMatrix } from "./leafGeometry";
import { oakTexture, seeded } from "./surfaceTextures";

// Open bookcase, 72 x 32 x 185 cm, oak boards on a black steel frame
const SHELF = { w: 0.72, d: 0.32, boards: [0.06, 0.48, 0.92, 1.36, 1.82] };
const BOOK_COLORS = ["#2f3e46", "#8d6e63", "#c9b79c", "#6b705c", "#a5a58d", "#3a5a40", "#bc6c25", "#1d3557", "#e9e4d4", "#6d597a", "#b5838d"];

// Books standing on a board, from x0 to x1 (meters, relative to the shelf center)
const BOOK_RUNS = [
  { board: 1, x0: -0.33, x1: 0.08 },
  { board: 2, x0: -0.06, x1: 0.33 },
  { board: 3, x0: -0.33, x1: -0.12 },
];

const Books = () => {
  const mesh = useRef();
  const books = useMemo(() => {
    const r = seeded(11);
    const list = [];
    for (const run of BOOK_RUNS) {
      let x = run.x0;
      while (x < run.x1) {
        const w = 0.018 + r() * 0.03;
        const h = 0.17 + r() * 0.11;
        list.push({ x: x + w / 2, y: SHELF.boards[run.board] + 0.0125 + h / 2, w, h, d: 0.19 + r() * 0.06, c: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)] });
        x += w + 0.002;
      }
    }
    // A short horizontal stack on the top run
    for (let i = 0; i < 4; i++) {
      const h = 0.03 + r() * 0.015;
      list.push({ x: 0.14, y: SHELF.boards[3] + 0.0125 + i * 0.045 + h / 2, w: 0.22 - i * 0.015, h, d: 0.17, c: BOOK_COLORS[(i * 3) % BOOK_COLORS.length], flat: true });
    }
    return list;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    books.forEach((b, i) => {
      m.compose(new THREE.Vector3(b.x, b.y, 0.02), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d));
      mesh.current.setMatrixAt(i, m);
      mesh.current.setColorAt(i, color.set(b.c));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.instanceColor.needsUpdate = true;
  }, [books]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, books.length]} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
};

// Trailing pothos: leaf clusters spilling over the top board
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

const Shelf = (props) => {
  const oak = useMemo(() => oakTexture(), []);
  const half = { w: SHELF.w / 2 - 0.0125, d: SHELF.d / 2 - 0.0125 };

  return (
    <group {...props}>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * half.w, 0.925, sz * half.d]} castShadow receiveShadow>
            <boxGeometry args={[0.025, 1.85, 0.025]} />
            <meshStandardMaterial color="#1b1b1d" roughness={0.5} metalness={0.7} />
          </mesh>
        ))
      )}
      {SHELF.boards.map((y) => (
        <mesh key={y} position-y={y} castShadow receiveShadow>
          <boxGeometry args={[SHELF.w, 0.025, SHELF.d]} />
          <meshStandardMaterial map={oak} roughness={0.55} />
        </mesh>
      ))}

      <Books />

      {/* Storage bin and a film camera */}
      <RoundedBox args={[0.22, 0.17, 0.26]} radius={0.012} position={[0.21, SHELF.boards[1] + 0.098, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#cdbfa8" roughness={1} />
      </RoundedBox>
      <group position={[-0.2, SHELF.boards[2] + 0.05, 0.02]} rotation-y={0.5}>
        <RoundedBox args={[0.13, 0.075, 0.05]} radius={0.008} castShadow>
          <meshStandardMaterial color="#1c1c1e" roughness={0.5} />
        </RoundedBox>
        <mesh position-z={0.04} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.04, 28]} />
          <meshStandardMaterial color="#2b2b2e" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
      {/* Copper pencil cup, in the gap between the books and the flat stack */}
      <mesh position={[-0.07, SHELF.boards[3] + 0.0125 + 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.14, 24]} />
        <meshStandardMaterial color="#c4793f" roughness={0.6} />
      </mesh>

      <Pothos position={[-0.15, SHELF.boards[4] + 0.0125, -0.03]} />
    </group>
  );
};

export default Shelf;
