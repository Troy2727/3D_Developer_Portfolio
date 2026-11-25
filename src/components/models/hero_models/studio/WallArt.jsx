import { useMemo } from "react";
import * as THREE from "three";

import { makeCanvas, mountainPrintTexture, printTexture, shapesPrintTexture, toTexture } from "./surfaceTextures";

// A gallery row on the back wall (face at z = -0.6): three framed prints, centered on
// one line with even 4 cm gaps. Each frame is built like a real one: four moulding bars,
// a backing board, a recessed mat, the print, glass in front, and a soft shadow behind.
const WALL_Z = -0.6;
const GAP = 0.004; // frames hang slightly off the wall
const DEPTH = 0.03;
const ROW_Y = 1.74;

// Soft drop shadow: a blurred dark rectangle
const shadowTexture = () => {
  const [canvas, g] = makeCanvas(128, 128);
  g.filter = "blur(10px)";
  g.fillStyle = "#000";
  g.fillRect(22, 22, 84, 84);
  return toTexture(canvas);
};

const Frame = ({ x, size: [w, h], border, color, art, artSize: [aw, ah], shadow }) => {
  const innerW = w - border * 2;
  const innerH = h - border * 2;
  const front = DEPTH / 2;

  return (
    <group position={[x, ROW_Y, WALL_Z + GAP + DEPTH / 2]}>
      <mesh position={[0.008, -0.012, -front - GAP + 0.0008]}>
        <planeGeometry args={[w * 1.25, h * 1.25]} />
        <meshBasicMaterial map={shadow} transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Moulding: top, bottom, left, right */}
      {[
        [[w, border, DEPTH], [0, h / 2 - border / 2]],
        [[w, border, DEPTH], [0, -h / 2 + border / 2]],
        [[border, innerH, DEPTH], [-w / 2 + border / 2, 0]],
        [[border, innerH, DEPTH], [w / 2 - border / 2, 0]],
      ].map(([args, [bx, by]], i) => (
        <mesh key={i} position={[bx, by, 0]} castShadow receiveShadow>
          <boxGeometry args={args} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
      <mesh position-z={-front + 0.002}>
        <boxGeometry args={[innerW, innerH, 0.004]} />
        <meshStandardMaterial color="#2a2622" roughness={1} />
      </mesh>

      {/* Mat and print, recessed 1 cm behind the moulding's face */}
      <mesh position-z={front - 0.012} receiveShadow>
        <planeGeometry args={[innerW, innerH]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.95} />
      </mesh>
      <mesh position-z={front - 0.0115} receiveShadow>
        <planeGeometry args={[aw, ah]} />
        <meshStandardMaterial map={art} roughness={0.85} />
      </mesh>

      {/* Glass: almost invisible, just a faint reflection */}
      <mesh position-z={front - 0.004}>
        <planeGeometry args={[innerW, innerH]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>
    </group>
  );
};

const WallArt = () => {
  const textures = useMemo(
    () => ({
      build: printTexture(),
      mountains: mountainPrintTexture(),
      shapes: shapesPrintTexture(),
      shadow: shadowTexture(),
    }),
    []
  );

  return (
    <group>
      <Frame x={-0.42} size={[0.46, 0.58]} border={0.024} color="#151515" art={textures.build} artSize={[0.36, 0.45]} shadow={textures.shadow} />
      <Frame x={0.06} size={[0.42, 0.34]} border={0.022} color="#5b3a24" art={textures.mountains} artSize={[0.3, 0.234]} shadow={textures.shadow} />
      <Frame x={0.46} size={[0.3, 0.3]} border={0.02} color="#c8a47a" art={textures.shapes} artSize={[0.2, 0.2]} shadow={textures.shadow} />
    </group>
  );
};

export default WallArt;
