import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

import CableTray from "./CableTray";
import Coffee from "./Coffee";
import Headphones from "./Headphones";
import LedStrip from "./LedStrip";
import Microphone from "./Microphone";
import MonitorRiser from "./MonitorRiser";
import MugWarmer, { CORD_EXIT_X, CORD_EXIT_Y, CORD_EXIT_Z, WARMER_TOP } from "./MugWarmer";
import { PluggedCord } from "./PowerOutlet";
import { Keyboard, Mouse } from "./Peripherals";
import { oakTexture } from "./surfaceTextures";

// Desk 160 x 75 cm, top at 75 cm, pushed against the back wall (z = -0.6)
const TOP = 0.75;
const DESK = { w: 1.6, d: 0.75, z: -0.2 };
const MAT_TOP = TOP + 0.003;
const WARMER_AT = [-0.7, TOP, -0.18];

const Steel = () => <meshStandardMaterial color="#1b1b1d" roughness={0.5} metalness={0.7} />;

// Snake plant in a concrete pot
const Plant = (props) => {
  const blades = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        a: (i / 9) * Math.PI * 2,
        h: 0.22 + ((i * 37) % 11) / 60,
        lean: 0.08 + ((i * 13) % 5) / 40,
      })),
    []
  );
  return (
    <group {...props}>
      <mesh position-y={0.06} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.056, 0.12, 32]} />
        <meshStandardMaterial color="#b8b2a7" roughness={0.9} />
      </mesh>
      <mesh position-y={0.112} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.064, 32]} />
        <meshStandardMaterial color="#3a2a1e" roughness={1} />
      </mesh>
      {blades.map(({ a, h, lean }, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.025, 0.11 + h / 2, Math.sin(a) * 0.025]}
          rotation={[Math.sin(a) * lean, -a, -Math.cos(a) * lean]}
          scale={[1, 1, 0.18]}
          castShadow
        >
          <coneGeometry args={[0.022, h, 6]} />
          <meshStandardMaterial color={i % 2 ? "#3f6b3a" : "#55804a"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const Desk = () => {
  const oak = useMemo(() => oakTexture(), []);

  return (
    <group>
      {/* Oak top */}
      <mesh position={[0, TOP - 0.015, DESK.z]} castShadow receiveShadow>
        <boxGeometry args={[DESK.w, 0.03, DESK.d]} />
        <meshStandardMaterial map={oak} roughness={0.5} />
      </mesh>

      {/* Steel T-legs and back beam */}
      {[-0.72, 0.72].map((x) => (
        <group key={x} position-x={x}>
          <mesh position={[0, 0.36, DESK.z]} castShadow receiveShadow>
            <boxGeometry args={[0.06, 0.69, 0.06]} />
            <Steel />
          </mesh>
          <mesh position={[0, 0.015, DESK.z]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.03, 0.68]} />
            <Steel />
          </mesh>
          <mesh position={[0, TOP - 0.045, DESK.z]} castShadow>
            <boxGeometry args={[0.07, 0.03, 0.66]} />
            <Steel />
          </mesh>
        </group>
      ))}
      <mesh position={[0, TOP - 0.06, DESK.z - 0.26]} castShadow>
        <boxGeometry args={[1.38, 0.05, 0.03]} />
        <Steel />
      </mesh>

      {/* Felt desk mat, set back 2.5 cm from the front edge */}
      <mesh position={[0.02, TOP + 0.0015, -0.05]} receiveShadow>
        <boxGeometry args={[0.9, 0.003, 0.4]} />
        <meshStandardMaterial color="#2b2d31" roughness={1} />
      </mesh>

      {/* Lifted 3.4 mm so the tilted front edge rests on the mat instead of sinking into it */}
      <Keyboard position={[-0.09, MAT_TOP + 0.0034, 0.0]} rotation-x={0.05} />
      <Mouse position={[0.29, MAT_TOP, 0.0]} rotation-y={0.08} />

      {/* Phone, face down */}
      <RoundedBox args={[0.072, 0.008, 0.147]} radius={0.0035} position={[0.42, MAT_TOP + 0.004, -0.15]} rotation-y={-0.2} castShadow>
        <meshStandardMaterial color="#3b3d42" roughness={0.35} metalness={0.5} />
      </RoundedBox>

      {/* Notebook and pen */}
      <group position={[-0.6, TOP, 0.03]} rotation-y={0.22}>
        <mesh position-y={0.007} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.014, 0.21]} />
          <meshStandardMaterial color="#2f4a3c" roughness={0.8} />
        </mesh>
        <mesh position={[0.03, 0.0175, 0]} rotation={[Math.PI / 2, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.14, 12]} />
          <meshStandardMaterial color="#c9a227" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Hot coffee on its warmer, in front of the left monitor's outer edge so the
          steam rises clear of it and the warmer clears the notebook */}
      <group position={WARMER_AT}>
        <MugWarmer />
        <Coffee position-y={WARMER_TOP} />
      </group>
      <PluggedCord from={[WARMER_AT[0] + CORD_EXIT_X, WARMER_AT[1] + CORD_EXIT_Y, WARMER_AT[2] + CORD_EXIT_Z]} />
      <Plant position={[-0.71, TOP, -0.47]} />
      <Headphones position={[0.66, TOP, 0.07]} />
      <Microphone position={[0.74, TOP, -0.53]} />
      <MonitorRiser position-y={TOP} />
      <LedStrip />
      <CableTray position-y={TOP - 0.03} />
    </group>
  );
};

export default Desk;
