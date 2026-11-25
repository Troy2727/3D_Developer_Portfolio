import { RoundedBox } from "@react-three/drei";

// Ergonomic task chair: five-star base, gas lift, seat, mesh back, armrests
const Fabric = ({ color = "#2a2b2f" }) => <meshStandardMaterial color={color} roughness={0.92} />;
const Metal = () => <meshStandardMaterial color="#9a9ca1" roughness={0.25} metalness={0.9} />;
const Nylon = () => <meshStandardMaterial color="#17181a" roughness={0.55} />;

const LEGS = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);

const Chair = (props) => (
  <group {...props}>
    {LEGS.map((a) => (
      <group key={a} rotation-y={a}>
        <mesh position={[0.15, 0.075, 0]} rotation-z={0.08} castShadow>
          <boxGeometry args={[0.29, 0.03, 0.045]} />
          <Nylon />
        </mesh>
        <mesh position={[0.29, 0.028, 0]} castShadow>
          <sphereGeometry args={[0.028, 16, 12]} />
          <Nylon />
        </mesh>
      </group>
    ))}
    <mesh position-y={0.095} castShadow>
      <cylinderGeometry args={[0.045, 0.05, 0.05, 24]} />
      <Nylon />
    </mesh>
    <mesh position-y={0.27} castShadow>
      <cylinderGeometry args={[0.022, 0.022, 0.32, 20]} />
      <Metal />
    </mesh>

    <RoundedBox args={[0.5, 0.075, 0.48]} radius={0.03} smoothness={3} position-y={0.47} castShadow receiveShadow>
      <Fabric />
    </RoundedBox>

    {/* Spine and mesh back, leaning back slightly; the back faces +z, away from the desk */}
    <mesh position={[0, 0.6, 0.245]} rotation-x={-0.1} castShadow>
      <boxGeometry args={[0.06, 0.26, 0.03]} />
      <Nylon />
    </mesh>
    <RoundedBox args={[0.46, 0.56, 0.045]} radius={0.02} smoothness={3} position={[0, 0.9, 0.27]} rotation-x={-0.12} castShadow receiveShadow>
      <Fabric color="#35373c" />
    </RoundedBox>

    {[-0.27, 0.27].map((x) => (
      <group key={x} position-x={x}>
        <mesh position={[0, 0.58, 0.04]} castShadow>
          <boxGeometry args={[0.03, 0.2, 0.05]} />
          <Nylon />
        </mesh>
        <RoundedBox args={[0.07, 0.025, 0.25]} radius={0.01} position={[0, 0.69, 0.02]} castShadow>
          <Nylon />
        </RoundedBox>
      </group>
    ))}
  </group>
);

export default Chair;
