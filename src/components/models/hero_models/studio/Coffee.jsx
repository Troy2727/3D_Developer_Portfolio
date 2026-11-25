import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { reducedMotion } from "./rgb";
import { cremaTexture, steamTexture } from "./surfaceTextures";

// A mug of hot coffee: ceramic mug, crema on top, steam curling up and fading.
// Origin = desk surface under the mug.
const MUG_H = 0.095;
const PUFFS = 12;
const RISE = 0.22; // how high the steam climbs before it's gone (m)

const Steam = () => {
  const texture = useMemo(() => steamTexture(), []);
  const puffs = useRef([]);

  useFrame(({ clock }) => {
    const t = reducedMotion ? 4 : clock.elapsedTime;
    puffs.current.forEach((sprite, i) => {
      const phase = i / PUFFS;
      const life = (t * 0.22 + phase) % 1; // 0 = leaving the cup, 1 = gone
      const sway = Math.sin(t * 1.3 + i * 1.9) * 0.012 * life;
      sprite.position.set(sway, MUG_H + 0.01 + life * RISE, Math.cos(t * 0.9 + i) * 0.006 * life);
      const size = 0.04 + life * 0.1;
      sprite.scale.set(size, size * 1.4, 1);
      sprite.material.opacity = Math.sin(life * Math.PI) * 0.8;
    });
  });

  return Array.from({ length: PUFFS }, (_, i) => (
    <sprite key={i} ref={(el) => (puffs.current[i] = el)}>
      <spriteMaterial map={texture} color="#fff7ee" transparent depthWrite={false} opacity={0} />
    </sprite>
  ));
};

const Coffee = (props) => {
  const crema = useMemo(() => cremaTexture(), []);

  return (
    <group {...props}>
      <mesh position-y={MUG_H / 2} castShadow receiveShadow>
        <cylinderGeometry args={[0.041, 0.038, MUG_H, 40, 1, true]} />
        <meshStandardMaterial color="#e9e4dc" roughness={0.45} side={2} />
      </mesh>
      {/* Rim, bottom and the coffee itself, a little below the rim */}
      <mesh position-y={MUG_H} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.0395, 0.0018, 8, 48]} />
        <meshStandardMaterial color="#f1ede6" roughness={0.4} />
      </mesh>
      <mesh position-y={0.002} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.038, 40]} />
        <meshStandardMaterial color="#e9e4dc" roughness={0.5} />
      </mesh>
      <mesh position-y={MUG_H - 0.008} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.0398, 40]} />
        <meshPhysicalMaterial map={crema} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Handle: a half ring on the side, both ends meeting the mug wall */}
      <mesh position={[0.041, 0.05, 0]} rotation-z={-Math.PI / 2} castShadow>
        <torusGeometry args={[0.022, 0.006, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#e9e4dc" roughness={0.45} />
      </mesh>
      <Steam />
    </group>
  );
};

export default Coffee;
