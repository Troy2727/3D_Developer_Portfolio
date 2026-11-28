import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isPhone } from "./device";
import { setRgb, useRgbMaterial } from "./rgb";
import { makeCanvas, toTexture } from "./surfaceTextures";

// LED strip hidden under the back edge of the monitor riser, washing the wall in color
const Z = -0.555;
const Y = 0.822; // just under the riser top (its underside is at 0.828)

// Soft round spot that fades to nothing at its edge
const glowTexture = () => {
  const [canvas, g] = makeCanvas(128, 128);
  const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, 128, 128);
  return toTexture(canvas);
};

// Phones: the two colors painted as soft pools where the desktop lights land, instead of
// two point lights that every lit surface would have to compute. Per side: the wall just
// above the riser, the riser top (kept within its 1.2 m width) and the desk in front.
const POOLS = [
  { position: [0, Y + 0.06, -0.598], rotation: 0, size: [0.8, 0.5] },
  { position: [0, 0.851, -0.44], rotation: -Math.PI / 2, size: [0.44, 0.26] },
  { position: [0, 0.751, -0.22], rotation: -Math.PI / 2, size: [0.75, 0.5] },
];

const glowMaterial = (map) =>
  new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

const GlowPools = ({ material, x }) =>
  POOLS.map(({ position, rotation, size }) => (
    <mesh key={position[1]} position={[x + position[0], position[1], position[2]]} rotation-x={rotation} material={material}>
      <planeGeometry args={size} />
    </mesh>
  ));

const LedStrip = () => {
  const strip = useRgbMaterial(0, 0.6);
  // Desktop: two point lights. Phones: two glow materials.
  const left = useRef();
  const right = useRef();
  const glows = useMemo(() => {
    if (!isPhone) return null;
    const map = glowTexture();
    return [glowMaterial(map), glowMaterial(map)];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const [l, r] = glows ?? [left.current, right.current];
    setRgb(l.color, t, 0.12);
    setRgb(r.color, t, -0.12);
  });

  return (
    <group>
      <mesh position={[0, Y, Z]} material={strip}>
        <boxGeometry args={[1.1, 0.006, 0.01]} />
      </mesh>
      {/* The wall wash */}
      {glows ? (
        <>
          <GlowPools material={glows[0]} x={-0.38} />
          <GlowPools material={glows[1]} x={0.38} />
        </>
      ) : (
        <>
          <pointLight ref={left} position={[-0.38, Y + 0.08, Z + 0.02]} intensity={0.9} distance={1.1} decay={2} />
          <pointLight ref={right} position={[0.38, Y + 0.08, Z + 0.02]} intensity={0.9} distance={1.1} decay={2} />
        </>
      )}
    </group>
  );
};

export default LedStrip;
