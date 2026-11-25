import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { leafGeometry, leafMatrix } from "./leafGeometry";
import { seeded } from "./surfaceTextures";

// Origin of each piece = the surface it stands on.
const UP = new THREE.Vector3(0, 1, 0);

// Closed tulip cup, turned from a profile (radius, height) in meters
const tulipHead = () => {
  const profile = [
    [0, 0], [0.01, 0.002], [0.017, 0.012], [0.02, 0.026], [0.019, 0.04], [0.014, 0.05], [0.009, 0.054],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(profile, 6); // six sides read as petals
  geometry.computeVertexNormals();
  return geometry;
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

const TULIP_COLORS = ["#e63946", "#f4845f", "#ffd23f", "#ff70a6", "#9b5de5", "#4cc9f0"];
const TULIPS = 12;
const VASE = { r: 0.045, h: 0.18 };

// Rainbow tulip bouquet in a clear glass vase with water
export const TulipBouquet = (props) => {
  const heads = useRef();
  const stems = useRef();
  const leaves = useRef();
  const head = useMemo(() => tulipHead(), []);

  useLayoutEffect(() => {
    const r = seeded(29);
    const color = new THREE.Color();
    for (let i = 0; i < TULIPS; i++) {
      // Heads spread over a loose dome above the vase
      const a = i * 2.39996;
      const spread = 0.03 + 0.11 * Math.sqrt((i + 0.5) / TULIPS);
      const tip = new THREE.Vector3(Math.cos(a) * spread, 0.36 + r() * 0.07 - spread * 0.4, Math.sin(a) * spread);
      // Two-part stem: up through the vase's mouth, then out to the flower
      const bottom = new THREE.Vector3(Math.cos(a) * 0.008, 0.02, Math.sin(a) * 0.008);
      const mouth = new THREE.Vector3(Math.cos(a) * Math.min(spread, 0.032), VASE.h, Math.sin(a) * Math.min(spread, 0.032));
      stems.current.setMatrixAt(i * 2, between(bottom, mouth, 0.0028));
      stems.current.setMatrixAt(i * 2 + 1, between(mouth, tip, 0.0028));
      const tilt = new THREE.Quaternion().setFromUnitVectors(UP, tip.clone().sub(mouth).normalize());
      heads.current.setMatrixAt(i, new THREE.Matrix4().compose(tip, tilt, new THREE.Vector3(1, 1, 1)));
      heads.current.setColorAt(i, color.set(TULIP_COLORS[i % TULIP_COLORS.length]));
    }
    // Long, narrow tulip leaves rising out of the vase
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.4;
      const m = leafMatrix(new THREE.Vector3(Math.cos(a) * 0.02, VASE.h - 0.01, Math.sin(a) * 0.02), new THREE.Vector3(Math.cos(a), 1.6, Math.sin(a)), a, 1);
      m.multiply(new THREE.Matrix4().makeScale(0.05, 0.17, 0.05));
      leaves.current.setMatrixAt(i, m);
    }
    for (const mesh of [heads, stems, leaves]) mesh.current.instanceMatrix.needsUpdate = true;
    heads.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group {...props}>
      <mesh position-y={VASE.h / 2}>
        <cylinderGeometry args={[VASE.r, VASE.r * 0.85, VASE.h, 40, 1, true]} />
        <meshPhysicalMaterial color="#e8f3f2" transparent opacity={0.22} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position-y={0.002} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[VASE.r * 0.85, 40]} />
        <meshPhysicalMaterial color="#e8f3f2" transparent opacity={0.3} roughness={0.05} />
      </mesh>
      {/* Water, a little over half full */}
      <mesh position-y={VASE.h * 0.55} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[VASE.r * 0.93, 40]} />
        <meshPhysicalMaterial color="#cfe8e6" transparent opacity={0.35} roughness={0.02} clearcoat={1} />
      </mesh>

      <instancedMesh ref={stems} args={[undefined, undefined, TULIPS * 2]} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#4f7a3a" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[leafGeometry, undefined, 6]} castShadow>
        <meshStandardMaterial color="#5a8a46" roughness={0.55} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[head, undefined, TULIPS]} castShadow>
        <meshStandardMaterial roughness={0.45} side={THREE.DoubleSide} />
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
