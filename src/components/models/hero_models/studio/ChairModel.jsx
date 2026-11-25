import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { makeCanvas, toTexture } from "./surfaceTextures";

// Modern ergonomic chair: polished aluminium five-star base with twin-wheel casters,
// waterfall-edge seat, wrapped see-through mesh back with a lumbar curve, headrest,
// aluminium spine and floating armrests. The seat faces -z; origin = floor center.
const SEAT_Y = 0.46;
const BACK = { w: 0.47, h: 0.6, y0: 0.56, z0: 0.24 };

const Aluminium = () => <meshStandardMaterial color="#c9ccd1" roughness={0.18} metalness={1} />;
const Black = () => <meshStandardMaterial color="#141417" roughness={0.5} metalness={0.2} />;
const Fabric = () => <meshStandardMaterial color="#2d2e33" roughness={0.92} />;

// Back shape: wraps toward the sitter, narrows at the bottom, reclines and bulges at the lumbar
const backPoint = (x, yn, z = 0) => {
  const width = 1 - 0.12 * (1 - yn);
  const a = (x * width) / 0.55;
  const recline = 0.11 * yn;
  const lumbar = -0.028 * Math.exp(-(((yn - 0.28) / 0.16) ** 2));
  return new THREE.Vector3(
    Math.sin(a) * (0.55 + z),
    BACK.y0 + yn * BACK.h,
    BACK.z0 + recline + lumbar - (0.55 - Math.cos(a) * (0.55 + z))
  );
};

const backGeometry = () => {
  const geometry = new THREE.PlaneGeometry(BACK.w, 1, 24, 16);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const v = backPoint(p.getX(i), p.getY(i) + 0.5);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
};

const backRim = () => {
  const half = BACK.w / 2;
  const pts = [];
  for (let i = 0; i <= 16; i++) pts.push(backPoint(-half, i / 16));
  for (let i = 0; i <= 12; i++) pts.push(backPoint(-half + (i / 12) * BACK.w, 1));
  for (let i = 16; i >= 0; i--) pts.push(backPoint(half, i / 16));
  for (let i = 12; i >= 0; i--) pts.push(backPoint(-half + (i / 12) * BACK.w, 0));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, 0.009, 8, true);
};

// Waterfall seat: front edge rolls down, top is gently dished, corners rounded in plan
const seatGeometry = () => {
  const geometry = new THREE.BoxGeometry(0.5, 0.07, 0.5, 12, 2, 16);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i);
    let y = p.getY(i);
    const z = p.getZ(i);
    const zn = z / 0.25; // -1 front .. 1 back
    if (zn < -0.4) y -= ((-zn - 0.4) / 0.6) ** 2 * 0.035;
    if (p.getY(i) > 0) y -= 0.012 * (1 - (x / 0.25) ** 2) * (1 - zn ** 2);
    x *= 1 - 0.08 * zn ** 4;
    p.setXYZ(i, x, y, z);
  }
  geometry.computeVertexNormals();
  return geometry;
};

const headrestGeometry = () => {
  const geometry = new THREE.BoxGeometry(0.28, 0.1, 0.04, 16, 2, 1);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / 0.4;
    const r = 0.4 + p.getZ(i);
    p.setX(i, Math.sin(a) * r);
    p.setZ(i, -(0.4 - Math.cos(a) * r));
  }
  geometry.computeVertexNormals();
  return geometry;
};

// Woven mesh: dark threads with see-through gaps
const weaveTexture = () => {
  const [canvas, g] = makeCanvas(32, 32);
  g.strokeStyle = "rgba(48,50,56,1)";
  g.lineWidth = 3;
  for (let i = -32; i <= 64; i += 8) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 32, 32);
    g.moveTo(i + 32, 0);
    g.lineTo(i, 32);
    g.stroke();
  }
  const texture = toTexture(canvas, [16, 20]);
  return texture;
};

const LEGS = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);

const ChairModel = () => {
  const { seat, back, rim, headrest, weave, spine } = useMemo(() => {
    const bottom = backPoint(0, 0.12, 0.02);
    return {
      seat: seatGeometry(),
      back: backGeometry(),
      rim: backRim(),
      headrest: headrestGeometry(),
      weave: weaveTexture(),
      spine: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, SEAT_Y - 0.05, 0.12),
          new THREE.Vector3(0, SEAT_Y - 0.03, 0.24),
          new THREE.Vector3(0, BACK.y0 - 0.02, bottom.z + 0.02),
          bottom,
        ]),
        24,
        0.016,
        10
      ),
    };
  }, []);
  const top = backPoint(0, 1, 0.01);

  return (
    <group>
      {/* Base */}
      {LEGS.map((a) => (
        <group key={a} rotation-y={a}>
          <mesh position={[0.16, 0.085, 0]} rotation-z={-0.07} castShadow>
            <boxGeometry args={[0.3, 0.026, 0.04]} />
            <Aluminium />
          </mesh>
          <group position={[0.3, 0.032, 0]}>
            <mesh position-y={0.03} castShadow>
              <boxGeometry args={[0.02, 0.02, 0.02]} />
              <Black />
            </mesh>
            {[-0.013, 0.013].map((z) => (
              <mesh key={z} position-z={z} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.014, 20]} />
                <Black />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      <mesh position-y={0.11} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.06, 32]} />
        <Aluminium />
      </mesh>
      <mesh position-y={0.2} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 24]} />
        <Black />
      </mesh>
      <mesh position-y={0.33} castShadow>
        <cylinderGeometry args={[0.019, 0.019, 0.13, 20]} />
        <Aluminium />
      </mesh>
      <mesh position={[0, SEAT_Y - 0.065, 0.02]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.24]} />
        <Black />
      </mesh>

      {/* Seat, spine and back */}
      <mesh geometry={seat} position-y={SEAT_Y} castShadow receiveShadow>
        <Fabric />
      </mesh>
      <mesh geometry={spine} castShadow>
        <Aluminium />
      </mesh>
      <mesh geometry={back} castShadow>
        <meshStandardMaterial map={weave} color="#5a5d66" transparent roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rim} castShadow>
        <Black />
      </mesh>

      {/* Headrest on a short stalk above the back */}
      <mesh position={[0, top.y + 0.04, top.z + 0.02]} rotation-x={-0.25} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.09, 12]} />
        <Aluminium />
      </mesh>
      <mesh geometry={headrest} position={[0, top.y + 0.11, top.z + 0.03]} castShadow>
        <Fabric />
      </mesh>

      {/* Floating armrests */}
      {[-1, 1].map((side) => (
        <group key={side} position-x={side * 0.27}>
          <mesh position={[-side * 0.07, SEAT_Y - 0.055, 0.05]} castShadow>
            <boxGeometry args={[0.16, 0.022, 0.05]} />
            <Black />
          </mesh>
          <mesh position={[0, SEAT_Y + 0.09, 0.05]} castShadow>
            <boxGeometry args={[0.028, 0.27, 0.045]} />
            <Black />
          </mesh>
          <RoundedBox args={[0.085, 0.026, 0.26]} radius={0.012} smoothness={3} position={[0, SEAT_Y + 0.235, 0.02]} castShadow>
            <meshStandardMaterial color="#1c1c20" roughness={0.65} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
};

export default ChairModel;
