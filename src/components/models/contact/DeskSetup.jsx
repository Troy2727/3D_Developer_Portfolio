import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { isPhone } from "../hero_models/studio/device";
import PcTower from "../hero_models/studio/PcTower";
import { Keyboard, Mouse } from "../hero_models/studio/Peripherals";
import { reducedMotion } from "../hero_models/studio/rgb";
import { createCodeScreen, createGameScreen } from "./screenTextures";
import UltrawideMonitor, { bent, PANEL, TOP_EDGE } from "./UltrawideMonitor";
import Webcam from "./Webcam";

// White 230 x 80 cm desk (top at 75 cm) with two 45" curved ultrawides on a dual arm.
// Real-world meters, floor at y = 0, the screens face +z.
const TOP = 0.75;
const DESK = { w: 2.3, d: 0.8 };
const MON_Y = 1.05;
const MON_Z = -0.2;
const POLE = { z: -0.34, h: 0.4 };
const PERIPHERAL_SCALE = 1.35;

// Each monitor turns its outer edge 17° toward you; the inner edges meet with a 1 cm gap
const TURN = 0.3;
const [innerX, innerZ] = bent(-PANEL[0] / 2 - 0.008);
const MON_X = 0.005 - innerX * Math.cos(TURN) + innerZ * Math.sin(TURN);

// Screen centers and facing, for the camera zoom (hero_models/CameraFocus.jsx)
export const SCREENS = {
  1: { center: new THREE.Vector3(-MON_X, MON_Y, MON_Z), yaw: TURN },
  2: { center: new THREE.Vector3(MON_X, MON_Y, MON_Z), yaw: -TURN },
};
// Wider than the panel: the curved edges come 17 cm closer to the camera and look bigger
export const SCREEN_FIT = { w: 1.35, h: 0.6 };

// Phones redraw the screens less often; reduced motion shows a still frame
const FPS = isPhone ? { code: 8, game: 15 } : { code: 15, game: 30 };

const Frame = () => <meshStandardMaterial color="#dfe2e7" roughness={0.4} metalness={0.4} />;
const ArmMetal = () => <meshStandardMaterial color="#1c1d22" roughness={0.35} metalness={0.6} />;

// Straight bar between two points on the floor plan, at height y
const Bar = ({ from, to, y }) => {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  return (
    <mesh position={[(from[0] + to[0]) / 2, y, (from[1] + to[1]) / 2]} rotation-y={Math.atan2(-dz, dx)} castShadow>
      <boxGeometry args={[length, 0.03, 0.035]} />
      <ArmMetal />
    </mesh>
  );
};

// onSelect(1 | 2): a monitor was clicked
const DeskSetup = ({ onSelect }) => {
  const code = useMemo(() => createCodeScreen(FPS.code, reducedMotion), []);
  const game = useMemo(() => createGameScreen(FPS.game, reducedMotion), []);

  useFrame(({ clock }) => {
    code.update(clock.elapsedTime);
    game.update(clock.elapsedTime);
  });

  const select = (screen) => (e) => {
    e.stopPropagation();
    onSelect?.(screen);
  };

  // Arm attaches to the back of each monitor's housing
  const vesa = (side) => [side * (MON_X + 0.055 * Math.sin(TURN)), MON_Z - 0.055 * Math.cos(TURN)];

  return (
    <group>
      {/* Desk top and white frame */}
      <RoundedBox args={[DESK.w, 0.03, DESK.d]} radius={0.01} position-y={TOP - 0.015} castShadow receiveShadow>
        <meshStandardMaterial color="#eceef2" roughness={0.55} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side} position-x={side * 1.0}>
          <mesh position-y={TOP / 2} castShadow receiveShadow>
            <boxGeometry args={[0.08, TOP - 0.06, 0.06]} />
            <Frame />
          </mesh>
          <mesh position-y={0.015} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.03, 0.7]} />
            <Frame />
          </mesh>
          <mesh position-y={TOP - 0.045} castShadow>
            <boxGeometry args={[0.07, 0.03, 0.66]} />
            <Frame />
          </mesh>
        </group>
      ))}
      <mesh position={[0, TOP - 0.06, -0.1]} castShadow>
        <boxGeometry args={[1.94, 0.05, 0.04]} />
        <Frame />
      </mesh>

      {/* Desk mat with the hero room's RGB keyboard and gaming mouse, scaled up so they
          don't look tiny next to the 45" screens (tilted keyboard lifted so its front
          edge rests on the mat) */}
      <RoundedBox args={[1.1, 0.004, 0.36]} radius={0.002} position={[0.05, TOP + 0.002, 0.17]} receiveShadow>
        <meshStandardMaterial color="#1e2129" roughness={1} />
      </RoundedBox>
      <Keyboard position={[-0.12, TOP + 0.004 + 0.0034 * PERIPHERAL_SCALE, 0.17]} rotation-x={0.05} scale={PERIPHERAL_SCALE} />
      <Mouse position={[0.38, TOP + 0.004, 0.18]} rotation-y={0.08} scale={PERIPHERAL_SCALE} />

      {/* Gaming PC under the right side of the desk, its three lit front fans facing you */}
      <PcTower position={[0.62, 0, -0.02]} rotation-y={0.4} />

      {/* Dual monitor arm: clamp, pole, one bar to each monitor */}
      <mesh position={[0, TOP + 0.015, POLE.z]} castShadow>
        <boxGeometry args={[0.08, 0.03, 0.1]} />
        <ArmMetal />
      </mesh>
      <mesh position={[0, TOP + POLE.h / 2, POLE.z]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, POLE.h, 24]} />
        <ArmMetal />
      </mesh>
      {[-1, 1].map((side) => (
        <Bar key={side} from={[0, POLE.z]} to={vesa(side)} y={MON_Y - 0.02} />
      ))}

      {/* Screen 1 writes the game's code, screen 2 plays it; clicking one zooms in on it */}
      <UltrawideMonitor screen={code.texture} position={[-MON_X, MON_Y, MON_Z]} rotation-y={TURN} onClick={select(1)}>
        <Webcam position-y={TOP_EDGE} />
      </UltrawideMonitor>
      <UltrawideMonitor screen={game.texture} position={[MON_X, MON_Y, MON_Z]} rotation-y={-TURN} onClick={select(2)} />
    </group>
  );
};

export default DeskSetup;
