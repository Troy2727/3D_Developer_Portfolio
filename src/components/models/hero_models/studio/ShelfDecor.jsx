import { RoundedBox } from "@react-three/drei";

// Small curated objects for the shelves. Each one's origin is the surface it stands on.

const Matte = ({ color, roughness = 0.6 }) => <meshStandardMaterial color={color} roughness={roughness} />;
const Glow = ({ color }) => <meshBasicMaterial color={color} toneMapped={false} />;

// Little desk robot with glowing eyes and an antenna
export const Robot = (props) => (
  <group {...props}>
    <RoundedBox args={[0.07, 0.075, 0.05]} radius={0.01} position-y={0.0475} castShadow>
      <Matte color="#e9e5dd" />
    </RoundedBox>
    <mesh position={[0, 0.06, 0.0255]}>
      <circleGeometry args={[0.012, 20]} />
      <Glow color="#ff7a3d" />
    </mesh>
    <RoundedBox args={[0.085, 0.06, 0.06]} radius={0.014} position-y={0.12} castShadow>
      <Matte color="#e9e5dd" />
    </RoundedBox>
    <RoundedBox args={[0.068, 0.036, 0.004]} radius={0.008} position={[0, 0.122, 0.03]}>
      <Matte color="#1b1d22" roughness={0.3} />
    </RoundedBox>
    {[-0.015, 0.015].map((x) => (
      <mesh key={x} position={[x, 0.123, 0.0325]}>
        <circleGeometry args={[0.0055, 16]} />
        <Glow color="#5ee0ff" />
      </mesh>
    ))}
    <mesh position-y={0.165}>
      <cylinderGeometry args={[0.002, 0.002, 0.03, 8]} />
      <Matte color="#8a8f98" />
    </mesh>
    <mesh position-y={0.183}>
      <sphereGeometry args={[0.0055, 12, 10]} />
      <Glow color="#ff4d4d" />
    </mesh>
  </group>
);

// Retro game controller lying on the shelf
export const GameController = (props) => (
  <group {...props}>
    <RoundedBox args={[0.15, 0.022, 0.065]} radius={0.01} position-y={0.011} castShadow>
      <Matte color="#cfccc6" />
    </RoundedBox>
    {/* D-pad */}
    <mesh position={[-0.042, 0.0235, 0.004]}>
      <boxGeometry args={[0.026, 0.004, 0.008]} />
      <Matte color="#1b1b1e" />
    </mesh>
    <mesh position={[-0.042, 0.0235, 0.004]}>
      <boxGeometry args={[0.008, 0.004, 0.026]} />
      <Matte color="#1b1b1e" />
    </mesh>
    {[[0.034, 0.012], [0.054, -0.004]].map(([x, z]) => (
      <mesh key={x} position={[x, 0.023, z]}>
        <cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />
        <Matte color="#c23b3b" roughness={0.4} />
      </mesh>
    ))}
    {[-0.01, 0.008].map((x) => (
      <mesh key={x} position={[x, 0.0225, 0.008]} rotation-y={0.5}>
        <boxGeometry args={[0.012, 0.002, 0.004]} />
        <Matte color="#55575c" />
      </mesh>
    ))}
  </group>
);

// Raspberry Pi-style single-board computer: green board, chip, ports, pin header
export const DevBoard = (props) => (
  <group {...props}>
    <mesh position-y={0.003} castShadow>
      <boxGeometry args={[0.085, 0.0016, 0.056]} />
      <Matte color="#1f7a43" roughness={0.45} />
    </mesh>
    <mesh position={[-0.005, 0.0055, 0.004]}>
      <boxGeometry args={[0.014, 0.0025, 0.014]} />
      <Matte color="#202125" roughness={0.3} />
    </mesh>
    {/* USB and Ethernet ports along one end */}
    {[-0.018, 0, 0.019].map((z) => (
      <mesh key={z} position={[0.034, 0.011, z]} castShadow>
        <boxGeometry args={[0.02, 0.015, 0.015]} />
        <meshStandardMaterial color="#c7cbd1" roughness={0.25} metalness={0.9} />
      </mesh>
    ))}
    <mesh position={[-0.01, 0.0055, -0.024]}>
      <boxGeometry args={[0.052, 0.0045, 0.005]} />
      <Matte color="#111" />
    </mesh>
    <mesh position={[-0.03, 0.0045, 0.018]}>
      <circleGeometry args={[0.0018, 8]} />
      <Glow color="#ff3a3a" />
    </mesh>
  </group>
);

// Small succulent in a concrete cube
export const Succulent = (props) => (
  <group {...props}>
    <RoundedBox args={[0.075, 0.07, 0.075]} radius={0.006} position-y={0.035} castShadow>
      <Matte color="#9d9890" roughness={0.95} />
    </RoundedBox>
    {Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(a) * 0.018, 0.08, Math.sin(a) * 0.018]} rotation={[Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7]} scale={[0.5, 1, 0.5]} castShadow>
          <coneGeometry args={[0.014, 0.04, 8]} />
          <Matte color={i % 2 ? "#7fa37a" : "#94b38c"} roughness={0.5} />
        </mesh>
      );
    })}
  </group>
);

// Compact film camera
export const FilmCamera = (props) => (
  <group {...props}>
    <RoundedBox args={[0.13, 0.075, 0.05]} radius={0.008} position-y={0.0375} castShadow>
      <Matte color="#1c1c1e" roughness={0.5} />
    </RoundedBox>
    <mesh position={[0.015, 0.0375, 0.04]} rotation-x={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.028, 0.028, 0.04, 28]} />
      <meshStandardMaterial color="#2b2b2e" roughness={0.3} metalness={0.6} />
    </mesh>
  </group>
);
