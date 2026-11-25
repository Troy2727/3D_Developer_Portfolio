import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { makeCanvas, toTexture } from "./surfaceTextures";

// Electric mug warmer: black base, brushed-steel heating plate with a warm glow ring,
// touch buttons and a temperature display with auto shut-off. Origin = desk surface;
// the plate is centered on the origin, the controls sit in front of it (+z).
export const WARMER_TOP = 0.023;
const BASE = { w: 0.112, h: 0.02, d: 0.15, z: 0.022 };

const displayTexture = () => {
  const [canvas, g] = makeCanvas(160, 64);
  g.fillStyle = "#050505";
  g.fillRect(0, 0, 160, 64);
  g.fillStyle = "#ffb347";
  g.font = 'bold 34px Consolas, "Courier New", monospace';
  g.textAlign = "center";
  g.fillText("131°F", 80, 36);
  g.font = 'bold 13px "Segoe UI", Arial, sans-serif';
  g.fillStyle = "#c98a3a";
  g.fillText("AUTO OFF · 4H", 80, 56);
  return toTexture(canvas);
};

const MugWarmer = (props) => {
  const display = useMemo(() => displayTexture(), []);
  // Power cord: out the back, along to the desk's left edge, then down over it
  const cord = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.02, 0.006, BASE.z - BASE.d / 2),
          new THREE.Vector3(-0.06, 0.003, -0.07),
          new THREE.Vector3(-0.098, 0.002, -0.05),
          new THREE.Vector3(-0.106, -0.03, -0.04),
          new THREE.Vector3(-0.107, -0.3, -0.03),
        ]),
        40,
        0.0022,
        6
      ),
    []
  );

  return (
    <group {...props}>
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.008} smoothness={3} position={[0, BASE.h / 2, BASE.z]} castShadow receiveShadow>
        <meshStandardMaterial color="#121214" roughness={0.4} metalness={0.3} />
      </RoundedBox>

      {/* Heating plate and the glow that says it's on */}
      <mesh position-y={BASE.h + 0.0015} castShadow receiveShadow>
        <cylinderGeometry args={[0.046, 0.046, 0.003, 48]} />
        <meshStandardMaterial color="#b8bcc2" roughness={0.3} metalness={1} />
      </mesh>
      <mesh position-y={BASE.h + 0.0012} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.049, 0.0016, 8, 64]} />
        <meshBasicMaterial color="#ff8a2a" toneMapped={false} />
      </mesh>

      {/* Display and touch buttons on the front strip */}
      <mesh position={[0, BASE.h + 0.0002, BASE.z + 0.052]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.04, 0.016]} />
        <meshBasicMaterial map={display} toneMapped={false} />
      </mesh>
      {[
        [-0.036, "#ff5a3c"],
        [0.032, "#8a8f98"],
        [0.044, "#8a8f98"],
      ].map(([x, color]) => (
        <mesh key={x} position={[x, BASE.h + 0.0002, BASE.z + 0.052]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.0045, 20]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}

      <mesh geometry={cord}>
        <meshStandardMaterial color="#0d0d0e" roughness={0.7} />
      </mesh>
    </group>
  );
};

export default MugWarmer;
