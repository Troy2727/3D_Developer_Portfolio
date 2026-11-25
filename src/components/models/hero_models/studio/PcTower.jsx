import { RoundedBox } from "@react-three/drei";

import { useRgbMaterial } from "./rgb";

// Mid-tower gaming PC, 21 x 46 x 44 cm, glass side panel facing -x (toward the camera).
// Origin = floor under the center of the case.
const W = 0.21;
const H = 0.46;
const D = 0.44;

const Shell = () => <meshStandardMaterial color="#111214" roughness={0.45} metalness={0.5} />;
const Part = ({ color = "#1d1f24" }) => <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />;

const Fan = ({ position, rotation, ring }) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <circleGeometry args={[0.05, 32]} />
      <meshStandardMaterial color="#0c0c0e" roughness={0.6} />
    </mesh>
    <mesh position-z={0.002}>
      <circleGeometry args={[0.014, 20]} />
      <Part color="#2a2c31" />
    </mesh>
    <mesh position-z={0.003} material={ring}>
      <torusGeometry args={[0.052, 0.005, 8, 40]} />
    </mesh>
  </group>
);

const PcTower = (props) => {
  const fans = useRgbMaterial(0.15, 0.55);
  const accents = useRgbMaterial(0.45, 0.6);

  return (
    <group {...props}>
      {/* Case: back side panel, top, front, rear and the PSU shroud; feet under it */}
      <mesh position={[W / 2 - 0.003, H / 2 + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.006, H, D]} />
        <Shell />
      </mesh>
      <mesh position={[0, H + 0.017, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.006, D]} />
        <Shell />
      </mesh>
      <mesh position={[0, H / 2 + 0.02, D / 2 - 0.003]} castShadow receiveShadow>
        <boxGeometry args={[W, H, 0.006]} />
        <Shell />
      </mesh>
      <mesh position={[0, H / 2 + 0.02, -D / 2 + 0.003]} castShadow receiveShadow>
        <boxGeometry args={[W, H, 0.006]} />
        <Shell />
      </mesh>
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.01, D]} />
        <Shell />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[W - 0.012, 0.1, D - 0.012]} />
        <Part color="#16171b" />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (W / 2 - 0.02), 0.01, sz * (D / 2 - 0.03)]}>
            <cylinderGeometry args={[0.012, 0.014, 0.02, 12]} />
            <Part color="#0a0a0b" />
          </mesh>
        ))
      )}

      {/* Motherboard, GPU, CPU cooler and RAM */}
      <mesh position={[W / 2 - 0.012, 0.3, -0.03]} receiveShadow>
        <boxGeometry args={[0.004, 0.3, 0.3]} />
        <Part color="#1a1d22" />
      </mesh>
      <group position={[0.03, 0.2, 0.01]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.045, 0.3]} />
          <Part color="#2a2c31" />
        </mesh>
        <mesh position={[-0.0605, 0.012, 0]} material={accents}>
          <boxGeometry args={[0.002, 0.006, 0.26]} />
        </mesh>
      </group>
      <group position={[0.055, 0.35, -0.07]} rotation-z={Math.PI / 2}>
        <mesh castShadow>
          <cylinderGeometry args={[0.042, 0.042, 0.06, 32]} />
          <Part color="#24262b" />
        </mesh>
        <mesh position-y={0.031} rotation-x={Math.PI / 2} material={fans}>
          <torusGeometry args={[0.034, 0.004, 8, 40]} />
        </mesh>
      </group>
      {[0.035, 0.05].map((z) => (
        <group key={z} position={[0.075, 0.36, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.03, 0.11, 0.007]} />
            <Part color="#202227" />
          </mesh>
          <mesh position-x={-0.0155} material={accents}>
            <boxGeometry args={[0.002, 0.1, 0.007]} />
          </mesh>
        </group>
      ))}

      {/* Three front intake fans behind the front mesh, and one rear exhaust */}
      {[0.17, 0.29, 0.41].map((y) => (
        <Fan key={y} position={[0, y, D / 2 + 0.0005]} rotation={[0, 0, 0]} ring={fans} />
      ))}
      <Fan position={[0.01, 0.38, -D / 2 + 0.008]} rotation={[0, 0, 0]} ring={fans} />

      {/* Tinted glass side panel in a thin frame */}
      <mesh position={[-W / 2 + 0.002, H / 2 + 0.02, 0]}>
        <boxGeometry args={[0.003, H - 0.02, D - 0.02]} />
        <meshPhysicalMaterial color="#20242b" transparent opacity={0.22} roughness={0.05} metalness={0.1} clearcoat={1} />
      </mesh>
      <RoundedBox args={[0.006, 0.012, D]} radius={0.002} position={[-W / 2 + 0.003, H + 0.014, 0]}>
        <Shell />
      </RoundedBox>
      {/* Power button glow on the top front edge */}
      <mesh position={[-0.05, H + 0.0205, D / 2 - 0.03]} rotation-x={-Math.PI / 2} material={accents}>
        <circleGeometry args={[0.006, 16]} />
      </mesh>
    </group>
  );
};

export default PcTower;
