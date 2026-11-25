import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Blinds from "./Blinds";
import Chair from "./Chair";
import Curtains from "./Curtains";
import Desk from "./Desk";
import FloorPlant from "./FloorPlant";
import Monitors from "./Monitors";
import { WallOutlet } from "./PowerOutlet";
import PcTower from "./PcTower";
import Shelf from "./Shelf";
import NeonSign from "./NeonSign";
import { floorTexture, rugTexture, skyTexture } from "./surfaceTextures";
import WallArt from "./WallArt";

// Real-world meters. Floor at y = 0, back wall face at z = -0.6,
// window wall face at x = 1.3 with a 1.2 x 1.4 m window opening.
const WALL_COLOR = "#e7dfd3";

const Wall = ({ args, position, material }) => (
  <mesh position={position} material={material} castShadow receiveShadow>
    <boxGeometry args={args} />
  </mesh>
);

// Cutaway: a wall between the camera and the room stops drawing (but still casts its
// shadow, so the sun stripes stay right), and comes back when the camera moves away.
const setDrawn = (material, drawn) => {
  material.colorWrite = drawn;
  material.depthWrite = drawn;
};

const Studio = () => {
  const floor = useMemo(() => floorTexture(), []);
  const sky = useMemo(() => skyTexture(), []);
  const rug = useMemo(() => rugTexture(), []);
  const backWall = useMemo(() => new THREE.MeshStandardMaterial({ color: WALL_COLOR, roughness: 0.95 }), []);
  const sideWall = useMemo(() => new THREE.MeshStandardMaterial({ color: WALL_COLOR, roughness: 0.95 }), []);
  const backDecor = useRef();
  const sideDecor = useRef();

  useFrame(({ camera }) => {
    const behindBack = camera.position.z < -0.6;
    const outsideWindow = camera.position.x > 1.3;
    setDrawn(backWall, !behindBack);
    setDrawn(sideWall, !outsideWindow);
    backDecor.current.visible = !behindBack;
    sideDecor.current.visible = !outsideWindow;
  });

  return (
    <group>
      {/* Floor: plank surface on a dark slab, so the cut edge reads as a diorama */}
      <mesh position={[-0.2, -0.05, 0.3]} receiveShadow>
        <boxGeometry args={[3.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#1c1916" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.0005, 0.3]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[3.0, 2.0]} />
        <meshStandardMaterial map={floor} roughness={0.55} />
      </mesh>
      <mesh position={[0.15, 0.004, 0.55]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[1.7, 1.2]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>

      {/* Back wall */}
      <Wall args={[3.1, 2.6, 0.1]} position={[-0.15, 1.3, -0.65]} material={backWall} />
      {/* Window wall, built around the opening (z -0.35..0.85, y 0.85..2.25) */}
      <Wall args={[0.1, 0.85, 2.0]} position={[1.35, 0.425, 0.3]} material={sideWall} />
      <Wall args={[0.1, 0.35, 2.0]} position={[1.35, 2.425, 0.3]} material={sideWall} />
      <Wall args={[0.1, 1.4, 0.35]} position={[1.35, 1.55, -0.525]} material={sideWall} />
      <Wall args={[0.1, 1.4, 0.45]} position={[1.35, 1.55, 1.075]} material={sideWall} />

      {/* Things on the back wall hide with it: baseboard, the framed prints, the outlet and the neon sign */}
      <group ref={backDecor}>
        <mesh position={[-0.2, 0.04, -0.5925]} receiveShadow>
          <boxGeometry args={[3.0, 0.08, 0.015]} />
          <meshStandardMaterial color="#f3efe8" roughness={0.7} />
        </mesh>
        <WallArt />
        <WallOutlet />
        <NeonSign position={[0.58, 2.22, 0]} />
      </group>

      {/* Invisible ceiling and window-wall extension: they cast shadow only, so the
          sun enters through the window and not over the open sides of the diorama */}
      <mesh position={[-0.2, 2.65, 0.3]} castShadow>
        <boxGeometry args={[3.2, 0.1, 2.2]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
      <mesh position={[1.35, 1.3, 2.5]} castShadow>
        <boxGeometry args={[0.1, 2.6, 2.4]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {/* Things on the window wall hide with it: baseboard, the view outside and the curtains.
          The blinds stay, since they cast the light stripes. */}
      <group ref={sideDecor}>
        <mesh position={[1.2925, 0.04, 0.35]} receiveShadow>
          <boxGeometry args={[0.015, 0.08, 1.9]} />
          <meshStandardMaterial color="#f3efe8" roughness={0.7} />
        </mesh>
        {/* Just outside the opening, so it never shows around the wall from the side */}
        <mesh position={[1.405, 1.55, 0.25]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[1.24, 1.44]} />
          <meshBasicMaterial map={sky} toneMapped={false} />
        </mesh>
        <Curtains />
      </group>
      <Blinds />

      <Desk />
      <Monitors />
      <Chair position={[0.2, 0, 0.72]} />
      <Shelf position={[-1.22, 0, -0.6]} />
      <FloorPlant position={[0.95, 0, -0.12]} />
      <PcTower position={[0.5, 0, -0.3]} />
    </group>
  );
};

export default Studio;
