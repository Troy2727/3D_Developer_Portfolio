import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { isPhone } from "../hero_models/studio/device";
import { reducedMotion } from "../hero_models/studio/rgb";
import { makeCanvas, toTexture } from "../hero_models/studio/surfaceTextures";
import { createBoardScreen } from "./boardTexture";

// Dark acoustic-slat wall behind the desk with a glowing "How I build" board.
// The wall face is at z = -0.6; the board hangs above the monitors.
const WALL = { w: 3.4, h: 2.7, face: -0.6 };
const BOARD = { w: 1.9, h: 0.814, y: 1.83 };

// Zoom target for the board (hero_models/CameraFocus.jsx); its own fit, it's bigger than a screen
export const BOARD_SCREEN = { center: new THREE.Vector3(0, BOARD.y, WALL.face + 0.03), yaw: 0, fit: { w: 2.1, h: 0.95 } };

// Vertical felt slats with dark gaps, used for both color and bump
const slatTexture = () => {
  const [canvas, g] = makeCanvas(512, 16);
  for (let i = 0; i < 8; i++) {
    g.fillStyle = "#0b0e16";
    g.fillRect(i * 64, 0, 64, 16);
    const slat = g.createLinearGradient(i * 64, 0, i * 64 + 50, 0);
    slat.addColorStop(0, "#1a1f2d");
    slat.addColorStop(0.5, "#232a3b");
    slat.addColorStop(1, "#1a1f2d");
    g.fillStyle = slat;
    g.fillRect(i * 64 + 4, 0, 50, 16);
  }
  return toTexture(canvas, [WALL.w / 0.4, 1]); // 8 slats per 40 cm
};

// Soft purple-blue halo the board throws on the wall
const haloTexture = () => {
  const [canvas, g] = makeCanvas(256, 128);
  const glow = g.createRadialGradient(128, 64, 10, 128, 64, 128);
  glow.addColorStop(0, "rgba(124, 97, 255, 0.55)");
  glow.addColorStop(0.5, "rgba(59, 130, 246, 0.22)");
  glow.addColorStop(1, "rgba(59, 130, 246, 0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, 256, 128);
  return toTexture(canvas);
};

const FPS = isPhone ? 8 : 15;
// The board sits dimmed in the background and brightens when you zoom in on it
const DIM = 0.6;
const DIM_COLOR = [DIM, DIM, DIM]; // one array, so re-renders never reset the fade

// onSelect(3): the board was clicked. focused: the camera is zoomed in on it.
const WallBoard = ({ onSelect, focused = false }) => {
  const group = useRef();
  const screen = useRef();
  const glow = useRef();
  const slats = useMemo(() => slatTexture(), []);
  const halo = useMemo(() => haloTexture(), []);
  const board = useMemo(() => createBoardScreen(FPS, reducedMotion), []);

  useFrame(({ camera }, delta) => {
    board.update(performance.now() / 1000); // wall-clock: the scene clock restarts after a pause
    const k = 1 - Math.exp(-delta * 5);
    const level = screen.current.color.r + ((focused ? 1 : DIM) - screen.current.color.r) * k;
    screen.current.color.setScalar(level);
    glow.current.opacity = level;
    // Cutaway: orbiting behind the wall hides it, so the desk stays in view
    group.current.visible = camera.position.z > WALL.face;
  });

  return (
    <group ref={group}>
      <mesh position={[0, WALL.h / 2, WALL.face - 0.03]} receiveShadow>
        <boxGeometry args={[WALL.w, WALL.h, 0.06]} />
        <meshStandardMaterial map={slats} bumpMap={slats} bumpScale={3} roughness={0.9} />
      </mesh>

      <mesh position={[0, BOARD.y, WALL.face + 0.001]}>
        <planeGeometry args={[BOARD.w * 1.45, BOARD.h * 1.7]} />
        <meshBasicMaterial ref={glow} map={halo} transparent opacity={DIM} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      <group
        position={[0, BOARD.y, WALL.face]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(3);
        }}
      >
        <RoundedBox args={[BOARD.w + 0.06, BOARD.h + 0.06, 0.03]} radius={0.012} position-z={0.015} castShadow>
          <meshStandardMaterial color="#0b0d12" roughness={0.4} metalness={0.4} />
        </RoundedBox>
        {/* Unlit so it glows like a real panel */}
        <mesh position-z={0.0305}>
          <planeGeometry args={[BOARD.w, BOARD.h]} />
          <meshBasicMaterial ref={screen} map={board.texture} color={DIM_COLOR} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

export default WallBoard;
