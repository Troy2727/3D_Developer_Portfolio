import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

import { makeCanvas, toTexture } from "../hero_models/studio/surfaceTextures";
import { codeScreen, welcomeScreen } from "./screenTextures";
import UltrawideMonitor, { bent, PANEL } from "./UltrawideMonitor";

// White 230 x 80 cm desk (top at 75 cm) with two 45" curved ultrawides on a dual arm.
// Real-world meters, floor at y = 0, the screens face +z.
const TOP = 0.75;
const DESK = { w: 2.3, d: 0.8 };
const MON_Y = 1.05;
const MON_Z = -0.2;
const POLE = { z: -0.34, h: 0.4 };

// Each monitor turns its outer edge 17° toward you; the inner edges meet with a 1 cm gap
const TURN = 0.3;
const [innerX, innerZ] = bent(-PANEL[0] / 2 - 0.008);
const MON_X = 0.005 - innerX * Math.cos(TURN) + innerZ * Math.sin(TURN);

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

// Light keycaps with thin gaps, for the low-profile keyboard
const keycapTexture = () => {
  const [canvas, g] = makeCanvas(720, 240);
  g.fillStyle = "#c9ccd2";
  g.fillRect(0, 0, 720, 240);
  g.fillStyle = "#f7f8fa";
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 18; col++) {
      if (row === 5 && col > 5 && col < 12) continue;
      g.beginPath();
      g.roundRect(6 + col * 39.6, 6 + row * 38, 33, 32, 5);
      g.fill();
    }
  }
  g.beginPath();
  g.roundRect(6 + 6 * 39.6, 6 + 5 * 38, 39.6 * 6 - 6.6, 32, 5); // space bar
  g.fill();
  return toTexture(canvas);
};

const DeskSetup = () => {
  const code = useMemo(() => codeScreen(), []);
  const welcome = useMemo(() => welcomeScreen(), []);
  const keycaps = useMemo(() => keycapTexture(), []);

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

      {/* Desk mat, keyboard and mouse */}
      <RoundedBox args={[1.0, 0.004, 0.36]} radius={0.002} position={[0.05, TOP + 0.002, 0.17]} receiveShadow>
        <meshStandardMaterial color="#1e2129" roughness={1} />
      </RoundedBox>
      <group position={[-0.05, TOP + 0.004, 0.17]}>
        <RoundedBox args={[0.36, 0.014, 0.12]} radius={0.006} position-y={0.007} castShadow>
          <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
        </RoundedBox>
        <mesh position-y={0.0141} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.345, 0.105]} />
          <meshStandardMaterial map={keycaps} roughness={0.6} />
        </mesh>
      </group>
      <mesh position={[0.3, TOP + 0.004, 0.18]} scale={[0.032, 0.02, 0.058]} castShadow>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
      </mesh>

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

      <UltrawideMonitor screen={code} position={[-MON_X, MON_Y, MON_Z]} rotation-y={TURN} />
      <UltrawideMonitor screen={welcome} position={[MON_X, MON_Y, MON_Z]} rotation-y={-TURN} />
    </group>
  );
};

export default DeskSetup;
