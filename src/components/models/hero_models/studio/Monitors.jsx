import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

import { claudeScreenTexture, codeScreenTexture } from "./screenTextures";
import { makeCanvas, toTexture } from "./surfaceTextures";

// HP 27" (16:9): 597 x 336 mm panel, thin bezels on three sides, a chin with the logo
const PANEL = [0.597, 0.336];
const BODY = [0.613, 0.372, 0.016];
const PANEL_Y = 0.012; // panel sits above center because of the chin
const DESK_TOP = 0.75;
const CENTER_Y = 1.036; // body center: 10 cm of stand under the chin

const hpLogoTexture = () => {
  const [canvas, g] = makeCanvas(128, 128);
  g.strokeStyle = "#c9cbd0";
  g.lineWidth = 7;
  g.beginPath();
  g.arc(64, 64, 54, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#c9cbd0";
  g.font = 'italic 700 64px "Segoe UI", Arial, sans-serif';
  g.textAlign = "center";
  g.fillText("hp", 64, 84);
  return toTexture(canvas);
};

const Plastic = ({ color = "#16171a" }) => (
  <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
);

const Monitor = ({ screen, logo, children, ...props }) => (
  <group {...props}>
    <RoundedBox args={BODY} radius={0.004} smoothness={3} castShadow receiveShadow>
      <Plastic />
    </RoundedBox>

    {/* Screen is unlit so it glows like a real panel */}
    <mesh position={[0, PANEL_Y, BODY[2] / 2 + 0.0006]}>
      <planeGeometry args={PANEL} />
      <meshBasicMaterial map={screen} toneMapped={false} />
    </mesh>

    <mesh position={[0, -BODY[1] / 2 + 0.015, BODY[2] / 2 + 0.0006]}>
      <circleGeometry args={[0.0075, 32]} />
      <meshBasicMaterial map={logo} transparent />
    </mesh>

    {/* Rear housing, neck and base */}
    <RoundedBox args={[0.32, 0.2, 0.03]} radius={0.01} position={[0, -0.04, -0.022]} castShadow>
      <Plastic color="#1d1e22" />
    </RoundedBox>
    <mesh position={[0, -0.17, -0.05]} rotation-x={-0.08} castShadow>
      <boxGeometry args={[0.05, 0.25, 0.018]} />
      <Plastic color="#2a2c31" />
    </mesh>
    <RoundedBox
      args={[0.24, 0.012, 0.17]}
      radius={0.005}
      position={[0, DESK_TOP - CENTER_Y + 0.006, -0.06]}
      castShadow
      receiveShadow
    >
      <Plastic color="#2a2c31" />
    </RoundedBox>

    {children}
  </group>
);

// Bar light clamped on top of the monitor
const LightBar = () => (
  <group position={[0, BODY[1] / 2 + 0.014, 0.004]}>
    <mesh rotation-z={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.011, 0.011, 0.44, 24]} />
      <meshStandardMaterial color="#202124" roughness={0.5} metalness={0.25} />
    </mesh>
    <mesh position={[0, -0.006, 0.0075]} rotation-x={Math.PI / 2.4}>
      <planeGeometry args={[0.42, 0.008]} />
      <meshBasicMaterial color="#fff2dd" toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.016, -0.01]} castShadow>
      <boxGeometry args={[0.03, 0.02, 0.03]} />
      <Plastic color="#202124" />
    </mesh>
  </group>
);

const Webcam = () => (
  <group position={[0, BODY[1] / 2 + 0.018, 0.0]}>
    <RoundedBox args={[0.09, 0.028, 0.028]} radius={0.012} castShadow>
      <Plastic color="#111214" />
    </RoundedBox>
    <mesh position={[0, 0, 0.0142]}>
      <circleGeometry args={[0.008, 24]} />
      <meshStandardMaterial color="#05060a" roughness={0.1} metalness={0.8} />
    </mesh>
  </group>
);

const Monitors = () => {
  const claude = useMemo(() => claudeScreenTexture(), []);
  const code = useMemo(() => codeScreenTexture(), []);
  const logo = useMemo(() => hpLogoTexture(), []);

  return (
    <group>
      {/* Outer edges angled forward, like a real dual setup */}
      <Monitor screen={claude} logo={logo} position={[-0.325, CENTER_Y, -0.36]} rotation-y={0.14}>
        <LightBar />
      </Monitor>
      <Monitor screen={code} logo={logo} position={[0.325, CENTER_Y, -0.36]} rotation-y={-0.14}>
        <Webcam />
      </Monitor>
    </group>
  );
};

export default Monitors;
