import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { setRgb, useRgbMaterial } from "./rgb";

// LED strip along the back edge of the desk, behind the monitors, washing the wall in color
const Z = -0.565;
const Y = 0.756;

const LedStrip = () => {
  const strip = useRgbMaterial(0, 0.6);
  const left = useRef();
  const right = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    setRgb(left.current.color, t, 0.12);
    setRgb(right.current.color, t, -0.12);
  });

  return (
    <group>
      <mesh position={[0, Y, Z]} material={strip}>
        <boxGeometry args={[1.4, 0.006, 0.01]} />
      </mesh>
      <pointLight ref={left} position={[-0.38, Y + 0.08, Z + 0.02]} intensity={0.9} distance={1.1} decay={2} />
      <pointLight ref={right} position={[0.38, Y + 0.08, Z + 0.02]} intensity={0.9} distance={1.1} decay={2} />
    </group>
  );
};

export default LedStrip;
