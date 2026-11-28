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
// above the riser, the riser top (kept within its 1.2 m width), the desk in front, and
// the monitor's back (facing the wall, so only seen from behind; x and yaw follow the
// monitor in Monitors.jsx). position[0] is the distance from the room's middle.
const POOLS = [
  { position: [0.38, Y + 0.06, -0.598], rotation: [0, 0], size: [0.8, 0.5] },
  { position: [0.38, 0.851, -0.44], rotation: [-Math.PI / 2, 0], size: [0.44, 0.26] },
  { position: [0.38, 0.751, -0.22], rotation: [-Math.PI / 2, 0], size: [0.75, 0.5] },
  { position: [0.325, 1.03, -0.4], rotation: [0, Math.PI], yaw: 0.14, size: [0.62, 0.42] },
];

const glowMaterial = (map) =>
  new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

// side: -1 for the left half, 1 for the right
const GlowPools = ({ material, side }) =>
  POOLS.map(({ position, rotation, yaw = 0, size }) => (
    <mesh
      key={position[1]}
      position={[side * position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1] - side * yaw, 0]}
      material={material}
    >
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
          <GlowPools material={glows[0]} side={-1} />
          <GlowPools material={glows[1]} side={1} />
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
