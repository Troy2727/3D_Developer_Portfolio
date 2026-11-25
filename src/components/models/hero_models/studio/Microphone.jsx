import { useMemo } from "react";
import * as THREE from "three";

import { useRgbMaterial } from "./rgb";

// USB condenser mic on a boom arm clamped to the back edge of the desk.
// Local origin is the top of the desk where the clamp sits.
const P1 = new THREE.Vector3(0, 0.17, 0); // top of the post
const P2 = new THREE.Vector3(-0.02, 0.45, 0.2); // elbow
const P3 = new THREE.Vector3(-0.08, 0.23, 0.43); // mic mount

const Black = ({ roughness = 0.5 }) => <meshStandardMaterial color="#141416" roughness={roughness} metalness={0.4} />;

// A rod from a to b
const Rod = ({ a, b, radius }) => {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a);
    return {
      position: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    };
  }, [a, b]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <Black roughness={0.35} />
    </mesh>
  );
};

const Microphone = (props) => {
  const ring = useRgbMaterial(0.6, 0.55);
  // The cable follows the arm with a little slack
  const cable = useMemo(() => {
    const lift = new THREE.Vector3(0.012, -0.015, 0);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.015, 0.02, -0.01),
      P1.clone().add(lift),
      P2.clone().add(new THREE.Vector3(0.014, -0.03, 0)),
      P3.clone().add(new THREE.Vector3(0.01, -0.06, -0.02)),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.0022, 6);
  }, []);
  const springOffset = new THREE.Vector3(0, 0.018, 0);

  return (
    <group {...props}>
      {/* C-clamp over the back edge of the desk */}
      <mesh position-y={0.02} castShadow>
        <boxGeometry args={[0.05, 0.04, 0.06]} />
        <Black />
      </mesh>
      <mesh position={[0, -0.02, -0.05]} castShadow>
        <boxGeometry args={[0.05, 0.11, 0.008]} />
        <Black />
      </mesh>
      <mesh position={[0, -0.04, -0.01]} castShadow>
        <boxGeometry args={[0.05, 0.012, 0.06]} />
        <Black />
      </mesh>

      <Rod a={new THREE.Vector3(0, 0.04, 0)} b={P1} radius={0.009} />
      <Rod a={P1} b={P2} radius={0.0065} />
      <Rod a={P1.clone().add(springOffset)} b={P2.clone().add(springOffset)} radius={0.003} />
      <Rod a={P2} b={P3} radius={0.0065} />
      {[P1, P2].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.014, 16, 12]} />
          <Black />
        </mesh>
      ))}
      <mesh geometry={cable}>
        <meshStandardMaterial color="#0b0b0c" roughness={0.7} />
      </mesh>

      {/* Shock mount and mic, tilted toward the chair */}
      <group position={P3} rotation-x={0.55}>
        <mesh rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.04, 0.003, 8, 32]} />
          <Black />
        </mesh>
        <mesh position-y={-0.02} castShadow>
          <cylinderGeometry args={[0.026, 0.024, 0.1, 32]} />
          <meshStandardMaterial color="#1a1a1d" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position-y={0.033} material={ring}>
          <cylinderGeometry args={[0.0265, 0.0265, 0.006, 32]} />
        </mesh>
        {/* Grille head */}
        <mesh position-y={0.07} castShadow>
          <cylinderGeometry args={[0.027, 0.027, 0.068, 32]} />
          <meshStandardMaterial color="#2d2e33" roughness={0.35} metalness={0.85} />
        </mesh>
        <mesh position-y={0.104}>
          <sphereGeometry args={[0.027, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2d2e33" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* Red mute light on the front */}
        <mesh position={[0, 0.01, 0.0262]}>
          <circleGeometry args={[0.0035, 16]} />
          <meshBasicMaterial color="#ff3030" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

export default Microphone;
