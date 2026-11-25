import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { isPhone } from "./device";
import { reducedMotion } from "./rgb";
import { createClaudeScreen, createCodeScreen } from "./screenTextures";
import { makeCanvas, toTexture } from "./surfaceTextures";

// HP 27" curved (16:9): 597 x 336 mm panel, thin bezels on three sides, a chin with the logo
const PANEL = [0.597, 0.336];
const BODY = [0.613, 0.372, 0.016];
const PANEL_Y = 0.012; // panel sits above center because of the chin
const DESK_TOP = 0.85; // monitors stand on the walnut riser (desk 0.75 + 0.10)
const CENTER_Y = 1.136; // body center: 10 cm of stand under the chin

// Curved 1000R panel: every point wraps around a vertical axis 1 m in front of the
// screen, so the edges come ~4.5 cm toward you. Body, screen and rear housing all bend.
const CURVE_R = 1.0;
const bend = (geometry) => {
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / CURVE_R;
    const r = CURVE_R - p.getZ(i);
    p.setX(i, Math.sin(a) * r);
    p.setZ(i, CURVE_R - Math.cos(a) * r);
  }
  geometry.computeVertexNormals();
  return geometry;
};
const curvedBox = (w, h, d, y = 0, z = 0) => bend(new THREE.BoxGeometry(w, h, d, 48, 1, 1).translate(0, y, z));

const BODY_GEOMETRY = curvedBox(...BODY);
const SCREEN_GEOMETRY = bend(new THREE.PlaneGeometry(...PANEL, 48, 1).translate(0, PANEL_Y, BODY[2] / 2 + 0.0006));
const HOUSING_GEOMETRY = curvedBox(0.32, 0.2, 0.03, -0.04, -0.022);

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
    <mesh geometry={BODY_GEOMETRY} castShadow receiveShadow>
      <Plastic />
    </mesh>

    {/* Screen is unlit so it glows like a real panel */}
    <mesh geometry={SCREEN_GEOMETRY}>
      <meshBasicMaterial map={screen} toneMapped={false} />
    </mesh>

    <mesh position={[0, -BODY[1] / 2 + 0.015, BODY[2] / 2 + 0.0006]}>
      <circleGeometry args={[0.0075, 32]} />
      <meshBasicMaterial map={logo} transparent />
    </mesh>

    {/* Rear housing, neck and base */}
    <mesh geometry={HOUSING_GEOMETRY} castShadow>
      <Plastic color="#1d1e22" />
    </mesh>
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

// 1080p webcam (94 x 29 x 24 mm) on a fold-out clip that hooks over the back of the monitor
const Webcam = () => (
  <group position={[0, BODY[1] / 2, 0]}>
    {/* Clip: foot on the top edge, hinge, and the leg down the back */}
    <mesh position={[0, 0.003, -0.002]} castShadow>
      <boxGeometry args={[0.03, 0.006, 0.024]} />
      <Plastic color="#111214" />
    </mesh>
    <mesh position={[0, -0.028, -0.0125]} rotation-x={-0.12} castShadow>
      <boxGeometry args={[0.028, 0.062, 0.005]} />
      <Plastic color="#111214" />
    </mesh>
    <mesh position={[0, 0.009, 0]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.005, 0.005, 0.034, 12]} />
      <Plastic color="#1e1f23" />
    </mesh>

    <group position={[0, 0.0285, 0.002]}>
      <RoundedBox args={[0.094, 0.029, 0.024]} radius={0.0115} smoothness={4} castShadow>
        <Plastic color="#101114" />
      </RoundedBox>
      {/* Glossy front with lens, glass ring, mics and activity light */}
      <mesh position-z={0.0121}>
        <planeGeometry args={[0.07, 0.019]} />
        <meshPhysicalMaterial color="#050506" roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position-z={0.0124}>
        <ringGeometry args={[0.0062, 0.0085, 32]} />
        <meshStandardMaterial color="#9a9ca3" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position-z={0.0125}>
        <circleGeometry args={[0.0062, 32]} />
        <meshPhysicalMaterial color="#0b1020" roughness={0.02} metalness={0.3} clearcoat={1} />
      </mesh>
      {[-0.028, 0.028].map((x) => (
        <mesh key={x} position={[x, 0, 0.0124]}>
          <circleGeometry args={[0.0018, 12]} />
          <meshStandardMaterial color="#2a2b30" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.016, 0.004, 0.0125]}>
        <circleGeometry args={[0.0013, 12]} />
        <meshBasicMaterial color="#3dff7a" toneMapped={false} />
      </mesh>
    </group>
  </group>
);

// The screens play their typing animations; phones redraw them less often, and visitors
// who prefer reduced motion see the finished frame.
const SCREEN_FPS = isPhone ? 6 : 12;
const FINISHED = 20; // seconds into both loops: conversation and code complete

const Monitors = ({ onSelect }) => {
  const claude = useMemo(() => createClaudeScreen(SCREEN_FPS), []);
  const code = useMemo(() => createCodeScreen(SCREEN_FPS), []);
  const logo = useMemo(() => hpLogoTexture(), []);

  const select = (screen) => (e) => {
    e.stopPropagation();
    onSelect?.(screen);
  };

  useFrame(({ clock }) => {
    const t = reducedMotion ? FINISHED : clock.elapsedTime;
    claude.update(t);
    code.update(t);
  });

  return (
    // Clicking a monitor zooms the camera in on its screen (HeroExperience.jsx)
    <group onPointerOver={() => (document.body.style.cursor = "zoom-in")} onPointerOut={() => (document.body.style.cursor = "")}>
      {/* Outer edges angled forward, like a real dual setup */}
      <Monitor screen={claude.texture} logo={logo} position={[-0.325, CENTER_Y, -0.36]} rotation-y={0.14} onClick={select("claude")}>
        <LightBar />
      </Monitor>
      <Monitor screen={code.texture} logo={logo} position={[0.325, CENTER_Y, -0.36]} rotation-y={-0.14} onClick={select("code")}>
        <Webcam />
      </Monitor>
    </group>
  );
};

export default Monitors;
