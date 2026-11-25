import { useMemo } from "react";

import { oakTexture } from "./surfaceTextures";

// Walnut monitor riser spanning both monitors: a 2.2 cm top on two end panels.
// It lifts the screens 10 cm; the RGB strip (LedStrip.jsx) hides under its back edge.
// Origin = desk surface; it sits against the back of the desk.
export const RISER_HEIGHT = 0.1;
const W = 1.2;
const D = 0.26;
const Z = -0.44; // center: back edge 3 cm in front of the wall
const T = 0.022;

const Walnut = ({ map }) => <meshStandardMaterial map={map} color="#7a5236" roughness={0.45} />;

const MonitorRiser = (props) => {
  const grain = useMemo(() => oakTexture(), []);

  return (
    <group {...props}>
      <mesh position={[0, RISER_HEIGHT - T / 2, Z]} castShadow receiveShadow>
        <boxGeometry args={[W, T, D]} />
        <Walnut map={grain} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (W / 2 - T / 2), (RISER_HEIGHT - T) / 2, Z]} castShadow receiveShadow>
          <boxGeometry args={[T, RISER_HEIGHT - T, D]} />
          <Walnut map={grain} />
        </mesh>
      ))}
    </group>
  );
};

export default MonitorRiser;
