import { useMemo } from "react";

import { codeTagPrintTexture, gitGraphPrintTexture, stackPrintTexture } from "./printArt";
import { makeCanvas, toTexture } from "./surfaceTextures";

// Three framed prints on the back wall (face at z = -0.6), hung where the sun never
// reaches. The sun stripes' top edge on this wall runs along y = 1.70 + 0.425 x, so the
// two big frames hang top-aligned above it, and the small one sits over the bookshelf.
// Out of the sun that wall is in shade, so each frame has a brass picture light whose
// glow lights the mat and print evenly (as emissive light, no extra lamps to render). Each frame is built like a real one: four moulding bars,
// a backing board, a recessed mat, the print, glass in front, and a soft shadow behind.
const WALL_Z = -0.6;
const GAP = 0.004; // frames hang slightly off the wall
const DEPTH = 0.03;

// Soft drop shadow: a blurred dark rectangle
const shadowTexture = () => {
  const [canvas, g] = makeCanvas(128, 128);
  g.filter = "blur(10px)";
  g.fillStyle = "#000";
  g.fillRect(22, 22, 84, 84);
  return toTexture(canvas);
};

// Brass picture light: wall plate, arm reaching forward, and a bar with a glowing underside
const Brass = () => <meshStandardMaterial color="#b08d57" roughness={0.3} metalness={1} />;
const PictureLight = ({ width, top }) => {
  const back = -DEPTH / 2 - GAP; // the wall, in frame coordinates
  return (
    <group position-y={top + 0.05}>
      <mesh position-z={back + 0.004} castShadow>
        <boxGeometry args={[0.03, 0.05, 0.008]} />
        <Brass />
      </mesh>
      <mesh position={[0, 0.02, back + 0.065]} rotation-x={Math.PI / 2 - 0.35} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.13, 10]} />
        <Brass />
      </mesh>
      <group position={[0, 0.04, back + 0.125]}>
        <mesh rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.014, 0.014, width, 20]} />
          <Brass />
        </mesh>
        <mesh position={[0, -0.0135, 0.004]} rotation-x={Math.PI / 2 + 0.6}>
          <planeGeometry args={[width - 0.01, 0.01]} />
          <meshBasicMaterial color="#fff1d6" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

const Frame = ({ x, y, size: [w, h], border, color, art, artSize: [aw, ah], shadow }) => {
  const innerW = w - border * 2;
  const innerH = h - border * 2;
  const front = DEPTH / 2;

  return (
    <group position={[x, y, WALL_Z + GAP + DEPTH / 2]}>
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

      {/* Mat and print, recessed 1 cm behind the moulding's face, lit by the picture light */}
      <mesh position-z={front - 0.012} receiveShadow>
        <planeGeometry args={[innerW, innerH]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.95} emissive="#fff1dc" emissiveIntensity={0.35} />
      </mesh>
      <mesh position-z={front - 0.0115} receiveShadow>
        <planeGeometry args={[aw, ah]} />
        <meshStandardMaterial map={art} roughness={0.85} emissiveMap={art} emissive="#fff4e6" emissiveIntensity={0.55} />
      </mesh>

      {/* Glass: almost invisible, just a faint reflection */}
      <mesh position-z={front - 0.004}>
        <planeGeometry args={[innerW, innerH]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>

      <PictureLight width={w * 0.6} top={h / 2} />
    </group>
  );
};

const WallArt = () => {
  const textures = useMemo(
    () => ({
      stack: stackPrintTexture(),
      git: gitGraphPrintTexture(),
      codeTag: codeTagPrintTexture(),
      shadow: shadowTexture(),
    }),
    []
  );

  return (
    <group>
      <Frame x={-0.6} y={1.85} size={[0.44, 0.56]} border={0.022} color="#151515" art={textures.stack} artSize={[0.36, 0.45]} shadow={textures.shadow} />
      <Frame x={-0.14} y={1.98} size={[0.38, 0.3]} border={0.02} color="#5b3a24" art={textures.git} artSize={[0.3, 0.234]} shadow={textures.shadow} />
      <Frame x={-1.22} y={2.24} size={[0.3, 0.3]} border={0.02} color="#c8a47a" art={textures.codeTag} artSize={[0.22, 0.22]} shadow={textures.shadow} />
    </group>
  );
};

export default WallArt;
