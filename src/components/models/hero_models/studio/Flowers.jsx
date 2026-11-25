import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { leafGeometry, leafMatrix } from "./leafGeometry";
import { seeded } from "./surfaceTextures";

// Origin of each piece = the surface it stands on.
const UP = new THREE.Vector3(0, 1, 0);

// Plump, egg-shaped tulip head, turned from a profile (radius, height) in meters
const tulipHead = () => {
  const profile = [
    [0, 0], [0.012, 0.003], [0.021, 0.014], [0.026, 0.03], [0.026, 0.045], [0.022, 0.058], [0.014, 0.068], [0.006, 0.072],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(profile, 7); // facets read as overlapping petals
  geometry.computeVertexNormals();
  return geometry;
};

// Classic flared vase: round base, narrow neck, flared lip
const vaseGeometry = () => {
  const profile = [
    [0.03, 0], [0.046, 0.03], [0.05, 0.07], [0.04, 0.12], [0.03, 0.16], [0.034, 0.19], [0.046, 0.215],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(profile, 48);
};

// A rod-like matrix from a to b (for unit-height, unit-radius cylinders)
const between = (a, b, radius) => {
  const dir = new THREE.Vector3().subVectors(b, a);
  return new THREE.Matrix4().compose(
    a.clone().add(b).multiplyScalar(0.5),
    new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
    new THREE.Vector3(radius, dir.length(), radius)
  );
};

// Mixed colors like a classic rainbow tulip bouquet
const TULIP_COLORS = ["#d62839", "#e85d9b", "#f4a7c0", "#f77f00", "#ffd60a", "#8e44ad", "#f5ecd7", "#f6a96b", "#c2185b"];
const TULIPS = 18;
const TULIP_LEAVES = 11;
const NECK_Y = 0.19;
const DOME = { y: 0.28, r: 0.15 }; // heads sit on this sphere above the vase

export const TulipBouquet = (props) => {
  const heads = useRef();
  const stems = useRef();
  const leaves = useRef();
  const head = useMemo(() => tulipHead(), []);
  const vase = useMemo(() => vaseGeometry(), []);

  useLayoutEffect(() => {
    const r = seeded(29);
    const color = new THREE.Color();
    const center = new THREE.Vector3(0, DOME.y, 0);
    for (let i = 0; i < TULIPS; i++) {
      // Spread over a spherical cap; outer heads sit lower and lean outward
      const a = i * 2.39996;
      const polar = ((i + 0.5) / TULIPS) ** 0.6 * 1.2;
      const out = new THREE.Vector3(Math.sin(polar) * Math.cos(a), Math.cos(polar), Math.sin(polar) * Math.sin(a));
      const tip = center.clone().addScaledVector(out, DOME.r * (0.92 + r() * 0.12));
      // Two-part stem: up through the vase's neck, then out to the flower
      const bottom = new THREE.Vector3(Math.cos(a) * 0.01, 0.015, Math.sin(a) * 0.01);
      const neck = new THREE.Vector3(Math.cos(a) * 0.018 * Math.sin(polar), NECK_Y, Math.sin(a) * 0.018 * Math.sin(polar));
      stems.current.setMatrixAt(i * 2, between(bottom, neck, 0.003));
      stems.current.setMatrixAt(i * 2 + 1, between(neck, tip, 0.003));
      const facing = out.clone().add(new THREE.Vector3(0, 0.7, 0)).normalize();
      heads.current.setMatrixAt(i, new THREE.Matrix4().compose(tip, new THREE.Quaternion().setFromUnitVectors(UP, facing), new THREE.Vector3(1, 1, 1)));
      heads.current.setColorAt(i, color.set(TULIP_COLORS[i % TULIP_COLORS.length]));
    }
    // Broad leaves arching out between the flowers
    for (let i = 0; i < TULIP_LEAVES; i++) {
      const a = (i / TULIP_LEAVES) * Math.PI * 2 + 0.3;
      const m = leafMatrix(new THREE.Vector3(Math.cos(a) * 0.015, NECK_Y - 0.02, Math.sin(a) * 0.015), new THREE.Vector3(Math.cos(a), 1.1 + r() * 0.6, Math.sin(a)), a, 1);
      m.multiply(new THREE.Matrix4().makeScale(0.075, 0.2 + r() * 0.05, 0.075));
      leaves.current.setMatrixAt(i, m);
    }
    for (const mesh of [heads, stems, leaves]) mesh.current.instanceMatrix.needsUpdate = true;
    heads.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group {...props}>
      <mesh geometry={vase}>
        <meshPhysicalMaterial color="#e8f3f2" transparent opacity={0.22} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Water up into the neck */}
      <mesh position-y={0.13} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.036, 40]} />
        <meshPhysicalMaterial color="#cfe8e6" transparent opacity={0.4} roughness={0.02} clearcoat={1} />
      </mesh>

      <instancedMesh ref={stems} args={[undefined, undefined, TULIPS * 2]} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#4f7a3a" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[leafGeometry, undefined, TULIP_LEAVES]} castShadow>
        <meshStandardMaterial color="#5a8a46" roughness={0.5} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[head, undefined, TULIPS]} castShadow>
        <meshStandardMaterial roughness={0.42} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};

const LILY_LEAVES = 11;
const LILY_FLOWERS = 3;

// Peace lily in a white ceramic pot: glossy dark leaves and white flowers on tall stalks
export const PeaceLily = (props) => {
  const leaves = useRef();
  const spathes = useRef();
  const stalks = useRef();

  useLayoutEffect(() => {
    const r = seeded(41);
    for (let i = 0; i < LILY_LEAVES; i++) {
      const a = i * 2.39996;
      const dir = new THREE.Vector3(Math.cos(a), 0.45 + r() * 0.6, Math.sin(a));
      leaves.current.setMatrixAt(i, leafMatrix(new THREE.Vector3(Math.cos(a) * 0.015, 0.1, Math.sin(a) * 0.015), dir, a + Math.PI / 2, 0.15 + r() * 0.04));
    }
    for (let i = 0; i < LILY_FLOWERS; i++) {
      const a = (i / LILY_FLOWERS) * Math.PI * 2 + 0.5;
      const base = new THREE.Vector3(Math.cos(a) * 0.01, 0.1, Math.sin(a) * 0.01);
      const top = new THREE.Vector3(Math.cos(a) * 0.035, 0.27 + i * 0.02, Math.sin(a) * 0.035);
      stalks.current.setMatrixAt(i, between(base, top, 0.0022));
      // The white hood stands up behind its stalk tip
      spathes.current.setMatrixAt(i, leafMatrix(top.clone().add(new THREE.Vector3(0, -0.01, 0)), new THREE.Vector3(Math.cos(a) * 0.3, 1, Math.sin(a) * 0.3), a, 0.075));
    }
    for (const mesh of [leaves, spathes, stalks]) mesh.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group {...props}>
      <mesh position-y={0.05} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.048, 0.1, 32]} />
        <meshStandardMaterial color="#f2efea" roughness={0.35} />
      </mesh>
      <mesh position-y={0.098} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.057, 32]} />
        <meshStandardMaterial color="#3a2a1e" roughness={1} />
      </mesh>
      <instancedMesh ref={leaves} args={[leafGeometry, undefined, LILY_LEAVES]} castShadow>
        <meshStandardMaterial color="#1f4d2b" roughness={0.3} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={stalks} args={[undefined, undefined, LILY_FLOWERS]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#3f6b3a" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={spathes} args={[leafGeometry, undefined, LILY_FLOWERS]} castShadow>
        <meshStandardMaterial color="#fbfaf5" roughness={0.5} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};
