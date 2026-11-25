import { useMemo } from "react";
import * as THREE from "three";

import { makeCanvas, toTexture } from "./surfaceTextures";

// "hello, world" neon on a clear acrylic panel, on the back wall (face z = -0.6) above the
// right monitor. It hangs above the sun stripes there (their top edge is y = 1.70 + 0.425x).
const W = 0.62;
const H = 0.22;
const WALL_Z = -0.6;
const STANDOFF = 0.02;

// Neon tubes: thin script letters drawn several times, from a wide soft glow to a hot core.
// Filling (not stroking) keeps each letter a single tube instead of a double outline.
const neonTexture = () => {
  const [canvas, g] = makeCanvas(1024, 364);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = 'italic 400 126px "Segoe Script", "Brush Script MT", "Snell Roundhand", cursive';
  const passes = [
    ["#ff3fae", 42],
    ["#ff5cbc", 22],
    ["#ff8fd2", 10],
    ["#ffe6f5", 3],
  ];
  for (const [color, blur] of passes) {
    g.shadowColor = "#ff3fae";
    g.shadowBlur = blur;
    g.fillStyle = color;
    g.fillText("hello, world", 512, 182);
  }
  const texture = toTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping; // no glow bleeding in from the far edge
  return texture;
};

// The soft pink light the tubes throw on the wall: a blurred rounded patch, not the text
const washTexture = () => {
  const [canvas, g] = makeCanvas(256, 128);
  g.filter = "blur(18px)";
  g.fillStyle = "rgba(255,70,175,0.55)";
  g.beginPath();
  g.roundRect(48, 34, 160, 60, 30);
  g.fill();
  const texture = toTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

const NeonSign = (props) => {
  const neon = useMemo(() => neonTexture(), []);
  const wash = useMemo(() => washTexture(), []);

  return (
    <group {...props}>
      <group position-z={WALL_Z + STANDOFF}>
        {/* Clear acrylic backing with four brushed standoffs to the wall */}
        <mesh>
          <boxGeometry args={[W, H, 0.004]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.1} roughness={0.05} clearcoat={1} depthWrite={false} />
        </mesh>
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => (
            <mesh key={`${sx}${sy}`} position={[sx * (W / 2 - 0.02), sy * (H / 2 - 0.02), -STANDOFF / 2]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.006, 0.006, STANDOFF + 0.004, 12]} />
              <meshStandardMaterial color="#c9ccd1" roughness={0.25} metalness={1} />
            </mesh>
          ))
        )}
        <mesh position-z={0.0025}>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={neon} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      {/* Pink wash the tubes throw onto the wall behind */}
      <mesh position-z={WALL_Z + 0.001}>
        <planeGeometry args={[W * 1.3, H * 1.8]} />
        <meshBasicMaterial map={wash} transparent opacity={0.6} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default NeonSign;
