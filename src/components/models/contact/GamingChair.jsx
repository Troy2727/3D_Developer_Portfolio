import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Racing-style gaming chair in white leather with two blue stripes down the seat and
// back, a blue head pillow, harness slots, black armrests and a polished five-star base.
// Origin = floor center, the seat faces -z.
const SEAT_Y = 0.49;

const White = () => <meshPhysicalMaterial color="#f3f4f6" roughness={0.42} clearcoat={0.3} clearcoatRoughness={0.45} />;
const Blue = () => <meshPhysicalMaterial color="#1d5fe0" roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.45} />;
const Black = () => <meshStandardMaterial color="#15161a" roughness={0.55} metalness={0.2} />;
const Aluminium = () => <meshStandardMaterial color="#d4d7dc" roughness={0.16} metalness={1} />;

// Back outline (right half, bottom to top): hip bolster, waist, shoulder wings, narrow top
const RIGHT = [
  [0.235, 0.1],
  [0.215, 0.3],
  [0.265, 0.48],
  [0.25, 0.58],
  [0.19, 0.7],
  [0.17, 0.79],
];

const slot = (x) => {
  const hole = new THREE.Path();
  hole.moveTo(x - 0.03, 0.54);
  hole.lineTo(x + 0.03, 0.54);
  hole.lineTo(x + 0.03, 0.65);
  hole.lineTo(x - 0.03, 0.65);
  hole.closePath();
  return hole;
};

const backGeometry = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.2, 0);
  shape.lineTo(0.2, 0);
  shape.splineThru(RIGHT.map(([x, y]) => new THREE.Vector2(x, y)));
  shape.quadraticCurveTo(0.165, 0.83, 0.12, 0.83);
  shape.lineTo(-0.12, 0.83);
  shape.quadraticCurveTo(-0.165, 0.83, -0.17, 0.79);
  shape.splineThru([...RIGHT].reverse().slice(1).map(([x, y]) => new THREE.Vector2(-x, y)).concat(new THREE.Vector2(-0.2, 0)));
  shape.holes.push(slot(-0.135), slot(0.135));
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.015,
    bevelSegments: 5,
    curveSegments: 24,
  });
};

const LEGS = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);
const STRIPES = [-0.06, 0.06];

const GamingChair = (props) => {
  const back = useMemo(() => backGeometry(), []);

  return (
    <group {...props}>
      {/* Five-star base with twin-wheel casters */}
      {LEGS.map((a) => (
        <group key={a} rotation-y={a}>
          <mesh position={[0.17, 0.088, 0]} rotation-z={-0.08} castShadow>
            <boxGeometry args={[0.3, 0.03, 0.05]} />
            <Aluminium />
          </mesh>
          <group position={[0.31, 0.032, 0]}>
            <mesh position-y={0.032} castShadow>
              <boxGeometry args={[0.022, 0.024, 0.022]} />
              <Black />
            </mesh>
            {[-0.014, 0.014].map((z) => (
              <mesh key={z} position-z={z} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.032, 0.032, 0.014, 20]} />
                <Black />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      <mesh position-y={0.11} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.07, 32]} />
        <Aluminium />
      </mesh>
      <mesh position-y={0.2} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.14, 24]} />
        <Black />
      </mesh>
      <mesh position-y={0.33} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 20]} />
        <Aluminium />
      </mesh>
      <mesh position={[0, SEAT_Y - 0.09, 0.02]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.24]} />
        <Black />
      </mesh>

      {/* Bucket seat: shell, cushion, raised side bolsters, stripes */}
      <mesh position={[0, SEAT_Y - 0.05, 0]} castShadow>
        <boxGeometry args={[0.44, 0.03, 0.46]} />
        <Black />
      </mesh>
      <RoundedBox args={[0.4, 0.075, 0.48]} radius={0.03} smoothness={4} position-y={SEAT_Y} castShadow receiveShadow>
        <White />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.075, 0.11, 0.48]} radius={0.035} smoothness={4} position={[side * 0.225, SEAT_Y + 0.018, 0]} castShadow>
          <White />
        </RoundedBox>
      ))}
      {STRIPES.map((x) => (
        <RoundedBox key={x} args={[0.035, 0.012, 0.42]} radius={0.004} position={[x, SEAT_Y + 0.0335, 0]}>
          <Blue />
        </RoundedBox>
      ))}

      {/* Reclined back with side bolsters, stripes and the head pillow */}
      <group position={[0, SEAT_Y - 0.03, 0.22]} rotation-x={0.2}>
        <mesh geometry={back} castShadow receiveShadow>
          <White />
        </mesh>
        {[-1, 1].map((side) => (
          <RoundedBox key={side} args={[0.075, 0.42, 0.09]} radius={0.035} smoothness={4} position={[side * 0.19, 0.25, -0.055]} castShadow>
            <White />
          </RoundedBox>
        ))}
        {STRIPES.map((x) => (
          <RoundedBox key={x} args={[0.035, 0.62, 0.008]} radius={0.003} position={[x, 0.36, -0.033]}>
            <Blue />
          </RoundedBox>
        ))}
        <RoundedBox args={[0.24, 0.1, 0.07]} radius={0.035} smoothness={4} position={[0, 0.69, -0.065]} castShadow>
          <Blue />
        </RoundedBox>
      </group>

      {/* Armrests */}
      {[-1, 1].map((side) => (
        <group key={side} position-x={side * 0.29}>
          <mesh position={[-side * 0.045, SEAT_Y - 0.055, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.025, 0.06]} />
            <Black />
          </mesh>
          <RoundedBox args={[0.04, 0.22, 0.06]} radius={0.012} position={[0, SEAT_Y + 0.07, 0.02]} castShadow>
            <Black />
          </RoundedBox>
          <RoundedBox args={[0.09, 0.03, 0.25]} radius={0.012} smoothness={3} position={[0, SEAT_Y + 0.195, 0]} castShadow>
            <Black />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
};

export default GamingChair;
