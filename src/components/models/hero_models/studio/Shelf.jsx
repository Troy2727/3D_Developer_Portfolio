import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { PeaceLily, TulipBouquet } from "./Flowers";
import { DevBoard, FilmCamera, GameController, Robot, Succulent } from "./ShelfDecor";
import { makeCanvas, oakTexture, seeded, toTexture } from "./surfaceTextures";

// Modern shelving on the back wall: a low black sideboard with fluted oak doors, and three
// floating oak shelves above it, each with a warm LED strip underneath that washes the wall.
// Origin = floor at the wall face (z = 0 is the wall, +z comes into the room), x centered.
const W = 0.72;
const SIDEBOARD = { h: 0.48, d: 0.36, legs: 0.06 };
const SIDEBOARD_TOP = SIDEBOARD.legs + SIDEBOARD.h + 0.025;
const SHELF = { t: 0.035, d: 0.25 };
const SHELVES = [1.12, 1.48, 1.84]; // board centers
const top = (i) => SHELVES[i] + SHELF.t / 2;

const BOOK_COLORS = ["#2f3e46", "#8d6e63", "#c9b79c", "#3a5a40", "#bc6c25", "#1d3557", "#e9e4d4", "#6d597a"];

// Warm light fading down the wall under a shelf
const washTexture = () => {
  const [canvas, g] = makeCanvas(8, 128);
  const fade = g.createLinearGradient(0, 0, 0, 128);
  fade.addColorStop(0, "rgba(255,196,128,0.75)");
  fade.addColorStop(0.35, "rgba(255,180,110,0.25)");
  fade.addColorStop(1, "rgba(255,170,100,0)");
  g.fillStyle = fade;
  g.fillRect(0, 0, 8, 128);
  return toTexture(canvas);
};

const Books = () => {
  const mesh = useRef();
  const books = useMemo(() => {
    const r = seeded(11);
    const list = [];
    // Standing on the lowest floating shelf, up to the bookend
    let x = -0.32;
    for (;;) {
      const w = 0.022 + r() * 0.022;
      if (x + w > -0.12) break; // the bookend's plate is at x = -0.115
      const h = 0.17 + r() * 0.07;
      list.push({ x: x + w / 2, y: top(0) + h / 2, z: 0.12, w, h, d: 0.16 + r() * 0.04 });
      x += w + 0.002;
    }
    // A short stack lying on the sideboard
    for (let i = 0; i < 3; i++) {
      const h = 0.03 + r() * 0.012;
      list.push({ x: -0.15, y: SIDEBOARD_TOP + i * 0.042 + h / 2, z: 0.18, w: 0.24 - i * 0.02, h, d: 0.17 });
    }
    return list.map((b) => ({ ...b, c: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)] }));
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    books.forEach((b, i) => {
      m.compose(new THREE.Vector3(b.x, b.y, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d));
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

// Vertical oak ribs across both doors, with a gap where the doors meet
const FLUTE_PITCH = 0.014;
const FLUTES = Array.from({ length: Math.floor((W - 0.03) / FLUTE_PITCH) }, (_, i) => -W / 2 + 0.02 + i * FLUTE_PITCH).filter((x) => Math.abs(x) > 0.006);

const Sideboard = ({ oak }) => {
  const flutes = useRef();
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    FLUTES.forEach((x, i) => {
      m.makeTranslation(x, SIDEBOARD.legs + SIDEBOARD.h / 2, SIDEBOARD.d + 0.001);
      flutes.current.setMatrixAt(i, m);
    });
    flutes.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {[-1, 1].flatMap((sx) =>
        [0.05, SIDEBOARD.d - 0.05].map((z) => (
          <mesh key={`${sx}${z}`} position={[sx * (W / 2 - 0.05), SIDEBOARD.legs / 2, z]} castShadow>
            <cylinderGeometry args={[0.012, 0.008, SIDEBOARD.legs, 12]} />
            <meshStandardMaterial color="#b08d57" roughness={0.3} metalness={1} />
          </mesh>
        ))
      )}
      <mesh position={[0, SIDEBOARD.legs + SIDEBOARD.h / 2, SIDEBOARD.d / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, SIDEBOARD.h, SIDEBOARD.d]} />
        <meshStandardMaterial color="#17181b" roughness={0.6} />
      </mesh>
      <instancedMesh ref={flutes} args={[undefined, undefined, FLUTES.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.0062, 0.0062, SIDEBOARD.h - 0.04, 10]} />
        <meshStandardMaterial color="#b98552" roughness={0.55} />
      </instancedMesh>
      {[-0.03, 0.03].map((x) => (
        <mesh key={x} position={[x, SIDEBOARD.legs + SIDEBOARD.h * 0.55, SIDEBOARD.d + 0.012]}>
          <sphereGeometry args={[0.009, 16, 12]} />
          <meshStandardMaterial color="#b08d57" roughness={0.3} metalness={1} />
        </mesh>
      ))}
      <mesh position={[0, SIDEBOARD_TOP - 0.0125, SIDEBOARD.d / 2 + 0.005]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.02, 0.025, SIDEBOARD.d + 0.01]} />
        <meshStandardMaterial map={oak} roughness={0.5} />
      </mesh>
    </group>
  );
};

const FloatingShelf = ({ y, oak, wash }) => (
  <group position-y={y}>
    <mesh position-z={SHELF.d / 2} castShadow receiveShadow>
      <boxGeometry args={[W, SHELF.t, SHELF.d]} />
      <meshStandardMaterial map={oak} roughness={0.5} />
    </mesh>
    {/* LED strip tucked under the front edge, and its glow on the wall below */}
    <mesh position={[0, -SHELF.t / 2 - 0.002, SHELF.d - 0.03]}>
      <boxGeometry args={[W - 0.06, 0.004, 0.008]} />
      <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
    </mesh>
    <mesh position={[0, -SHELF.t / 2 - 0.16, 0.0015]}>
      <planeGeometry args={[W + 0.04, 0.32]} />
      <meshBasicMaterial map={wash} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  </group>
);

const Shelf = (props) => {
  const oak = useMemo(() => oakTexture(), []);
  const wash = useMemo(() => washTexture(), []);

  return (
    <group {...props}>
      <Sideboard oak={oak} />
      {SHELVES.map((y) => (
        <FloatingShelf key={y} y={y} oak={oak} wash={wash} />
      ))}
      {/* One warm light for the whole column, standing in for the three LED strips */}
      <pointLight position={[0, 1.35, 0.3]} intensity={0.5} distance={1.2} decay={2} color="#ffc98a" />

      <Books />
      {/* Bookend holding the books on the lowest shelf */}
      <group position={[-0.115, top(0), 0.12]}>
        <mesh position-y={0.065} castShadow>
          <boxGeometry args={[0.004, 0.13, 0.1]} />
          <meshStandardMaterial color="#1b1b1d" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0.028, 0.0015, 0]}>
          <boxGeometry args={[0.06, 0.003, 0.1]} />
          <meshStandardMaterial color="#1b1b1d" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
      <Succulent position={[0.2, top(0), 0.12]} />

      <Robot position={[-0.22, top(1), 0.12]} rotation-y={0.35} />
      <GameController position={[0.03, top(1), 0.13]} rotation-y={-0.25} />
      <DevBoard position={[0.23, top(1), 0.12]} rotation-y={0.4} />

      {/* The lily stays right of the </> frame above, so its leaves clear it */}
      <FilmCamera position={[-0.2, top(2), 0.12]} rotation-y={0.4} />
      <PeaceLily position={[0.24, top(2), 0.12]} />

      <TulipBouquet position={[0.2, SIDEBOARD_TOP, 0.18]} />
    </group>
  );
};

export default Shelf;
