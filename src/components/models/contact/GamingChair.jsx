import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { makeCanvas, toTexture } from "../hero_models/studio/surfaceTextures";

// Racing-style gaming chair in white leather with blue racing stripes: tall back with
// shoulder wings and harness slots, padded side bolsters, quilted center panels, blue
// neck pillow, lumbar pillow, bucket seat with thigh bolsters, 4D armrests and a polished
// five-star base. Origin = floor center, the seat faces -z.
const SEAT_Y = 0.49;
const BACK = { y: SEAT_Y - 0.02, z: 0.22, recline: 0.18 };

const WHITE = "#f4f5f7";
const BLUE = "#1d5fe0";

// Quilted diamond stitching: a light pattern for the color, a matching one for the bump
const quilt = (base, line) => {
  const [canvas, g] = makeCanvas(128, 128);
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = line;
  g.lineWidth = 5;
  g.beginPath();
  for (const [x0, x1] of [[-64, 64], [0, 128], [64, 192]]) {
    g.moveTo(x0, 0);
    g.lineTo(x1, 128);
    g.moveTo(x1, 0);
    g.lineTo(x0, 128);
  }
  g.stroke();
  return toTexture(canvas);
};

// Round blue emblem with white chevrons, for the back of the chair
const emblemTexture = () => {
  const [canvas, g] = makeCanvas(256, 256);
  g.fillStyle = BLUE;
  g.beginPath();
  g.arc(128, 128, 120, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 22;
  g.lineJoin = "round";
  g.lineCap = "round";
  for (const y of [92, 150]) {
    g.beginPath();
    g.moveTo(68, y);
    g.lineTo(128, y + 40);
    g.lineTo(188, y);
    g.stroke();
  }
  return toTexture(canvas);
};

// Back silhouette (right half, bottom to top): hip, waist, shoulder wings, tall head section
const RIGHT = [
  [0.235, 0.1],
  [0.215, 0.3],
  [0.27, 0.5],
  [0.255, 0.6],
  [0.19, 0.72],
  [0.17, 0.86],
];

const slot = (x) => {
  const hole = new THREE.Path();
  hole.moveTo(x - 0.03, 0.72);
  hole.lineTo(x + 0.03, 0.72);
  hole.lineTo(x + 0.03, 0.82);
  hole.lineTo(x - 0.03, 0.82);
  hole.closePath();
  return hole;
};

const shellGeometry = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.2, 0);
  shape.lineTo(0.2, 0);
  shape.splineThru(RIGHT.map(([x, y]) => new THREE.Vector2(x, y)));
  shape.quadraticCurveTo(0.165, 0.9, 0.12, 0.9);
  shape.lineTo(-0.12, 0.9);
  shape.quadraticCurveTo(-0.165, 0.9, -0.17, 0.86);
  shape.splineThru([...RIGHT].reverse().slice(1).map(([x, y]) => new THREE.Vector2(-x, y)).concat(new THREE.Vector2(-0.2, 0)));
  shape.holes.push(slot(-0.1), slot(0.1));
  return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 4, curveSegments: 24 });
};

// Quilted center panel of the back: slightly wider at the shoulders
const panelGeometry = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.125, 0.03);
  shape.lineTo(0.125, 0.03);
  shape.quadraticCurveTo(0.12, 0.35, 0.135, 0.5);
  shape.quadraticCurveTo(0.14, 0.6, 0.1, 0.62);
  shape.lineTo(-0.1, 0.62);
  shape.quadraticCurveTo(-0.14, 0.6, -0.135, 0.5);
  shape.quadraticCurveTo(-0.12, 0.35, -0.125, 0.03);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.012, bevelSegments: 4, curveSegments: 16 });
};

// Padded bolster: a tube along the points, closed with round ends
const bolster = (points, radius) => {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  return { tube: new THREE.TubeGeometry(curve, 48, radius, 16, false), ends: [curve.getPoint(0), curve.getPoint(1)], radius };
};

const Bolster = ({ geometry, children }) => (
  <group>
    <mesh geometry={geometry.tube} castShadow receiveShadow>
      {children}
    </mesh>
    {geometry.ends.map((p, i) => (
      <mesh key={i} position={p} castShadow>
        <sphereGeometry args={[geometry.radius, 16, 12]} />
        {children}
      </mesh>
    ))}
  </group>
);

const LEGS = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);
const SIDES = [-1, 1];

const GamingChair = (props) => {
  const parts = useMemo(() => {
    // The back's UVs are in meters (14 diamonds a meter); the seat cushion's run 0..1 per face
    const stitched = (repeat) => {
      const map = quilt("#ffffff", "#c9ced8");
      const bump = quilt("#ffffff", "#606060");
      map.repeat.set(...repeat);
      bump.repeat.set(...repeat);
      return { map, bump };
    };
    return {
      shell: shellGeometry(),
      panel: panelGeometry(),
      backQuilt: stitched([14, 14]),
      seatQuilt: stitched([4, 6]),
      emblem: emblemTexture(),
      backBolsters: SIDES.map((s) =>
        bolster([[s * 0.19, 0.04, -0.045], [s * 0.2, 0.22, -0.07], [s * 0.21, 0.42, -0.07], [s * 0.235, 0.55, -0.045], [s * 0.2, 0.63, -0.01]], 0.048)
      ),
      seatBolsters: SIDES.map((s) => bolster([[s * 0.225, SEAT_Y + 0.015, 0.2], [s * 0.23, SEAT_Y + 0.03, 0], [s * 0.22, SEAT_Y + 0.06, -0.19]], 0.046)),
    };
  }, []);

  const white = <meshPhysicalMaterial color={WHITE} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.35} />;
  const quilted = ({ map, bump }) => (
    <meshPhysicalMaterial color={WHITE} map={map} bumpMap={bump} bumpScale={1.5} roughness={0.55} clearcoat={0.3} clearcoatRoughness={0.4} />
  );
  const blue = <meshPhysicalMaterial color={BLUE} roughness={0.45} clearcoat={0.35} clearcoatRoughness={0.35} />;
  const black = <meshStandardMaterial color="#16171b" roughness={0.55} metalness={0.2} />;
  const aluminium = <meshStandardMaterial color="#d4d7dc" roughness={0.16} metalness={1} />;

  return (
    <group {...props}>
      {/* Five-star base with twin-wheel casters */}
      {LEGS.map((a) => (
        <group key={a} rotation-y={a}>
          <mesh position={[0.17, 0.09, 0]} rotation-z={-0.08} castShadow>
            <boxGeometry args={[0.31, 0.035, 0.055]} />
            {aluminium}
          </mesh>
          <group position={[0.32, 0.034, 0]}>
            <mesh position-y={0.034} castShadow>
              <boxGeometry args={[0.024, 0.026, 0.024]} />
              {black}
            </mesh>
            {[-0.015, 0.015].map((z) => (
              <mesh key={z} position-z={z} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.034, 0.034, 0.016, 20]} />
                {black}
              </mesh>
            ))}
          </group>
        </group>
      ))}
      <mesh position-y={0.11} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.07, 32]} />
        {aluminium}
      </mesh>
      <mesh position-y={0.2} castShadow>
        <cylinderGeometry args={[0.036, 0.036, 0.14, 24]} />
        {black}
      </mesh>
      <mesh position-y={0.33} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 20]} />
        {aluminium}
      </mesh>
      {/* Tilt mechanism with its lever */}
      <mesh position={[0, SEAT_Y - 0.09, 0.02]} castShadow>
        <boxGeometry args={[0.24, 0.05, 0.26]} />
        {black}
      </mesh>
      <mesh position={[0.17, SEAT_Y - 0.1, -0.02]} rotation-z={Math.PI / 2 - 0.2} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.13, 10]} />
        {black}
      </mesh>

      {/* Bucket seat: shell, quilted cushion, blue stripes, thigh bolsters */}
      <RoundedBox args={[0.5, 0.04, 0.48]} radius={0.015} position={[0, SEAT_Y - 0.045, 0]} castShadow>
        {white}
      </RoundedBox>
      <RoundedBox args={[0.3, 0.07, 0.46]} radius={0.03} smoothness={4} position-y={SEAT_Y} castShadow receiveShadow>
        {quilted(parts.seatQuilt)}
      </RoundedBox>
      {SIDES.map((s) => (
        <RoundedBox key={s} args={[0.03, 0.075, 0.45]} radius={0.012} position={[s * 0.163, SEAT_Y + 0.002, 0]}>
          {blue}
        </RoundedBox>
      ))}
      {parts.seatBolsters.map((geometry, i) => (
        <Bolster key={i} geometry={geometry}>
          {white}
        </Bolster>
      ))}

      {/* Back, reclined */}
      <group position={[0, BACK.y, BACK.z]} rotation-x={BACK.recline}>
        <mesh geometry={parts.shell} position-z={0.01} castShadow receiveShadow>
          {white}
        </mesh>
        <mesh geometry={parts.panel} position-z={-0.03} castShadow receiveShadow>
          {quilted(parts.backQuilt)}
        </mesh>
        {/* Racing stripes between the panel and the bolsters, front and back */}
        {SIDES.map((s) => (
          <group key={s}>
            <RoundedBox args={[0.028, 0.58, 0.05]} radius={0.01} position={[s * 0.15, 0.33, -0.03]}>
              {blue}
            </RoundedBox>
            <RoundedBox args={[0.035, 0.66, 0.006]} radius={0.003} position={[s * 0.07, 0.38, 0.0575]}>
              {blue}
            </RoundedBox>
          </group>
        ))}
        {parts.backBolsters.map((geometry, i) => (
          <Bolster key={i} geometry={geometry}>
            {white}
          </Bolster>
        ))}
        {/* Lumbar pillow with a blue band, and the blue neck pillow under the harness slots */}
        <RoundedBox args={[0.24, 0.1, 0.07]} radius={0.04} smoothness={4} position={[0, 0.2, -0.085]} castShadow>
          {white}
        </RoundedBox>
        <RoundedBox args={[0.245, 0.024, 0.072]} radius={0.01} position={[0, 0.2, -0.085]}>
          {blue}
        </RoundedBox>
        <RoundedBox args={[0.22, 0.1, 0.07]} radius={0.04} smoothness={4} position={[0, 0.665, -0.04]} castShadow>
          {blue}
        </RoundedBox>
        {/* Emblem on the back */}
        <mesh position={[0, 0.79, 0.0566]}>
          <circleGeometry args={[0.045, 40]} />
          <meshStandardMaterial map={parts.emblem} transparent roughness={0.5} />
        </mesh>
      </group>

      {/* 4D armrests: bracket, covered post, padded top */}
      {SIDES.map((s) => (
        <group key={s} position-x={s * 0.3}>
          <mesh position={[-s * 0.05, SEAT_Y - 0.06, 0.03]} castShadow>
            <boxGeometry args={[0.1, 0.025, 0.07]} />
            {black}
          </mesh>
          <RoundedBox args={[0.05, 0.22, 0.075]} radius={0.016} smoothness={3} position={[0, SEAT_Y + 0.06, 0.03]} castShadow>
            {black}
          </RoundedBox>
          <RoundedBox args={[0.095, 0.035, 0.27]} radius={0.016} smoothness={4} position={[0, SEAT_Y + 0.185, 0.01]} castShadow>
            <meshStandardMaterial color="#1c1d22" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
};

export default GamingChair;
