import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { rgbHue, setRgb, useRgbMaterial } from "./rgb";
import { makeCanvas, toTexture } from "./surfaceTextures";

// RedThunder-style full-size keyboard: black, rainbow LED backlight.
// 104 keys: function row, main block (15u), nav cluster, numpad. 1u = 19 mm.
const U = 0.019;
// Numbers are key widths in units, negatives are gaps, [w, h] is a two-row key
const ROWS = [
  [1, -1, 1, 1, 1, 1, -0.5, 1, 1, 1, 1, -0.5, 1, 1, 1, 1, -0.25, 1, 1, 1],
  [...Array(13).fill(1), 2, -0.25, 1, 1, 1, -0.25, 1, 1, 1, 1],
  [1.5, ...Array(12).fill(1), 1.5, -0.25, 1, 1, 1, -0.25, 1, 1, 1, [1, 2]],
  [1.75, ...Array(11).fill(1), 2.25, -3.5, 1, 1, 1],
  [2.25, ...Array(10).fill(1), 2.75, -1.25, 1, -1.25, 1, 1, 1, [1, 2]],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25, -0.25, 1, 1, 1, -0.25, 2, 1],
];
const WIDTH_U = 22.5;
const DEPTH_U = 6.5;

const KEYS = (() => {
  const keys = [];
  let z = 0;
  ROWS.forEach((row, r) => {
    let x = 0;
    for (const key of row) {
      const [w, h] = Array.isArray(key) ? key : [key, 1];
      if (w > 0) keys.push({ x: x + w / 2, z: z + h / 2, w, h });
      x += Math.abs(w);
    }
    z += r === 0 ? 1.5 : 1; // gap under the function row
  });
  return keys;
})();

const CASE = { w: WIDTH_U * U + 0.016, h: 0.014, d: DEPTH_U * U + 0.014 };
const CAP_H = 0.008;

// Full rainbow left to right; scrolled each frame to match the key legends
const rainbowTexture = () => {
  const [canvas, g] = makeCanvas(512, 4);
  for (let x = 0; x < 512; x++) {
    g.fillStyle = `hsl(${360 - (x / 512) * 360}, 100%, 55%)`;
    g.fillRect(x, 0, 1, 4);
  }
  const texture = toTexture(canvas);
  texture.repeat.set(0.5, 1);
  return texture;
};

export const Keyboard = (props) => {
  const caps = useRef();
  const legends = useRef();
  const glow = useMemo(() => rainbowTexture(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    KEYS.forEach((k, i) => {
      const x = (k.x - WIDTH_U / 2) * U;
      const z = (k.z - DEPTH_U / 2) * U;
      m.compose(new THREE.Vector3(x, CASE.h + CAP_H / 2, z), q, new THREE.Vector3(k.w * U - 0.003, CAP_H, k.h * U - 0.003));
      caps.current.setMatrixAt(i, m);
      // Lit legend near the top-left of each cap, like printed key labels
      const lx = k.w > 1.5 ? x : x - 0.002;
      m.compose(new THREE.Vector3(lx, CASE.h + CAP_H + 0.0003, z - 0.002), q, new THREE.Vector3(0.0085, 0.0006, 0.0055));
      legends.current.setMatrixAt(i, m);
      legends.current.setColorAt(i, color.set("#ffffff"));
    });
    caps.current.instanceMatrix.needsUpdate = true;
    legends.current.instanceMatrix.needsUpdate = true;
  }, [color]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    KEYS.forEach((k, i) => legends.current.setColorAt(i, setRgb(color, t, -(k.x / WIDTH_U) * 0.5, 0.62)));
    legends.current.instanceColor.needsUpdate = true;
    glow.offset.x = -rgbHue(t);
  });

  return (
    <group {...props}>
      <RoundedBox args={[CASE.w, CASE.h, CASE.d]} radius={0.004} smoothness={2} position-y={CASE.h / 2} castShadow receiveShadow>
        <meshStandardMaterial color="#121316" roughness={0.45} metalness={0.3} />
      </RoundedBox>
      {/* Backlight showing between the caps */}
      <mesh position-y={CASE.h + 0.0004} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[WIDTH_U * U, DEPTH_U * U]} />
        <meshBasicMaterial map={glow} toneMapped={false} />
      </mesh>
      <instancedMesh ref={caps} args={[undefined, undefined, KEYS.length]} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="#17181c" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={legends} args={[undefined, undefined, KEYS.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

// Gaming mouse: 124 x 66 x 39 mm, black, RGB skirt, scroll wheel and logo
const MOUSE = { w: 0.066, h: 0.039, l: 0.124 };

export const Mouse = (props) => {
  const rgb = useRgbMaterial(0.35, 0.55);

  return (
    <group {...props}>
      {/* Upper half of an ellipsoid: sits on the mat, nothing below the surface */}
      <mesh scale={[MOUSE.w, MOUSE.h * 2, MOUSE.l]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#141518" roughness={0.42} metalness={0.2} />
      </mesh>
      {/* Seam between the two buttons */}
      <mesh position={[0, 0.0315, -0.036]} rotation-x={-0.42}>
        <boxGeometry args={[0.0012, 0.001, 0.045]} />
        <meshBasicMaterial color="#050506" />
      </mesh>
      <mesh position={[0, 0.031, -0.03]} rotation-z={Math.PI / 2} material={rgb}>
        <cylinderGeometry args={[0.0075, 0.0075, 0.006, 20]} />
      </mesh>
      {/* RGB skirt around the base */}
      <mesh position-y={0.004} rotation-x={Math.PI / 2} scale={[MOUSE.w / 2 + 0.0008, MOUSE.l / 2 + 0.0008, 0.045]} material={rgb}>
        <torusGeometry args={[1, 0.035, 6, 64]} />
      </mesh>
      <mesh position={[0, 0.0368, 0.024]} rotation-x={-Math.PI / 2 + 0.26} material={rgb}>
        <circleGeometry args={[0.0055, 6]} />
      </mesh>
    </group>
  );
};

