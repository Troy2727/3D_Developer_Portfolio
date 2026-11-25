import { useMemo } from "react";

import { mountainPrintTexture, printTexture, shapesPrintTexture } from "./surfaceTextures";

// A small gallery on the back wall (face at z = -0.6): three framed prints with mats
const WALL_Z = -0.6;
const DEPTH = 0.025;

const Frame = ({ position, size: [w, h], border, frameColor, art, artSize: [aw, ah] }) => (
  <group position={[position[0], position[1], WALL_Z + DEPTH / 2]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[w, h, DEPTH]} />
      <meshStandardMaterial color={frameColor} roughness={0.55} />
    </mesh>
    {/* Mat, then the print */}
    <mesh position-z={DEPTH / 2 + 0.0005}>
      <planeGeometry args={[w - border * 2, h - border * 2]} />
      <meshStandardMaterial color="#f4f0e8" roughness={0.9} />
    </mesh>
    <mesh position-z={DEPTH / 2 + 0.001}>
      <planeGeometry args={[aw, ah]} />
      <meshStandardMaterial map={art} roughness={0.8} />
    </mesh>
  </group>
);

const WallArt = () => {
  const build = useMemo(() => printTexture(), []);
  const mountains = useMemo(() => mountainPrintTexture(), []);
  const shapes = useMemo(() => shapesPrintTexture(), []);

  return (
    <group>
      <Frame position={[-0.42, 1.74]} size={[0.46, 0.58]} border={0.02} frameColor="#1a1a1a" art={build} artSize={[0.4, 0.5]} />
      <Frame position={[0.08, 1.84]} size={[0.42, 0.34]} border={0.018} frameColor="#9a6a3e" art={mountains} artSize={[0.32, 0.25]} />
      <Frame position={[0.08, 1.48]} size={[0.26, 0.26]} border={0.012} frameColor="#f2efe9" art={shapes} artSize={[0.19, 0.19]} />
    </group>
  );
};

export default WallArt;
