import { useMemo } from "react";
import * as THREE from "three";

// US duplex outlet on the back wall (face z = -0.6), behind the desk's left corner,
// and the mug warmer's cord ending in a plug pushed into the top socket.
const WALL_Z = -0.6;
const PLATE = { x: -0.79, y: 0.3, w: 0.07, h: 0.115, d: 0.005 };
const SOCKET_DY = 0.022; // top socket at +dy, bottom at -dy
const PLUG = { w: 0.03, h: 0.036, d: 0.024 };
const PLUG_CENTER = new THREE.Vector3(PLATE.x, PLATE.y + SOCKET_DY, WALL_Z + PLATE.d + PLUG.d / 2);

const White = ({ roughness = 0.45 }) => <meshStandardMaterial color="#f2efe9" roughness={roughness} />;

export const WallOutlet = () => (
  <group position={[PLATE.x, PLATE.y, WALL_Z + PLATE.d / 2]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[PLATE.w, PLATE.h, PLATE.d]} />
      <White />
    </mesh>
    {[SOCKET_DY, -SOCKET_DY].map((y) => (
      <group key={y} position={[0, y, PLATE.d / 2 + 0.0004]}>
        <mesh>
          <boxGeometry args={[0.034, 0.03, 0.001]} />
          <White roughness={0.35} />
        </mesh>
        {/* Two slots and the round ground hole */}
        {[-0.006, 0.006].map((x) => (
          <mesh key={x} position={[x, 0.004, 0.0006]}>
            <planeGeometry args={[0.0022, 0.008]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        ))}
        <mesh position={[0, -0.008, 0.0006]}>
          <circleGeometry args={[0.0022, 12]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>
    ))}
    <mesh position-z={PLATE.d / 2 + 0.0004}>
      <circleGeometry args={[0.0025, 12]} />
      <meshStandardMaterial color="#cfcac2" roughness={0.3} metalness={0.6} />
    </mesh>
  </group>
);

// Cord from `from` (world point at the back of the warmer) across the desk, over its
// left edge, down past the outlet, then up into the bottom of the plug.
export const PluggedCord = ({ from }) => {
  const cord = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const plugBottom = PLUG_CENTER.clone().add(new THREE.Vector3(0, -PLUG.h / 2 + 0.002, 0));
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        start,
        new THREE.Vector3(-0.76, start.y - 0.003, -0.25),
        new THREE.Vector3(-0.797, start.y - 0.004, -0.26),
        new THREE.Vector3(-0.808, start.y - 0.03, -0.265),
        new THREE.Vector3(-0.811, 0.6, -0.3),
        new THREE.Vector3(-0.806, 0.4, -0.45),
        new THREE.Vector3(-0.797, 0.2, -0.56),
        new THREE.Vector3(PLATE.x, 0.25, -0.574),
        plugBottom,
      ]),
      96,
      0.0022,
      6
    );
  }, [from]);

  return (
    <group>
      <mesh geometry={cord} castShadow>
        <meshStandardMaterial color="#0d0d0e" roughness={0.7} />
      </mesh>
      {/* Plug body with a strain-relief collar where the cord enters */}
      <mesh position={PLUG_CENTER} castShadow>
        <boxGeometry args={[PLUG.w, PLUG.h, PLUG.d]} />
        <meshStandardMaterial color="#141416" roughness={0.55} />
      </mesh>
      <mesh position={[PLUG_CENTER.x, PLUG_CENTER.y - PLUG.h / 2 - 0.004, PLUG_CENTER.z]} castShadow>
        <cylinderGeometry args={[0.0045, 0.006, 0.01, 12]} />
        <meshStandardMaterial color="#141416" roughness={0.55} />
      </mesh>
    </group>
  );
};
