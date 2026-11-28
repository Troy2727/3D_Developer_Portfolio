import { RoundedBox } from "@react-three/drei";

// 1080p webcam (94 x 29 x 24 mm) on a fold-out clip hooked over a monitor's top edge.
// Origin = middle of the top edge; the lens faces +z.
const Plastic = ({ color = "#101114" }) => <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />;

const Webcam = (props) => (
  <group {...props}>
    {/* Clip: foot on the top edge, hinge, and the leg down the back */}
    <mesh position={[0, 0.003, -0.002]} castShadow>
      <boxGeometry args={[0.03, 0.006, 0.026]} />
      <Plastic />
    </mesh>
    <mesh position={[0, -0.028, -0.0135]} rotation-x={-0.1} castShadow>
      <boxGeometry args={[0.028, 0.062, 0.005]} />
      <Plastic />
    </mesh>
    <mesh position={[0, 0.009, 0]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.005, 0.005, 0.034, 12]} />
      <Plastic color="#1e1f23" />
    </mesh>

    <group position={[0, 0.0285, 0.002]}>
      <RoundedBox args={[0.094, 0.029, 0.024]} radius={0.0115} smoothness={4} castShadow>
        <Plastic />
      </RoundedBox>
      {/* Glossy front, lens in a metal ring, and the green activity light */}
      <mesh position-z={0.0121}>
        <planeGeometry args={[0.07, 0.019]} />
        <meshPhysicalMaterial color="#050506" roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position-z={0.0124}>
        <ringGeometry args={[0.0062, 0.0085, 32]} />
        <meshStandardMaterial color="#9a9ca3" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position-z={0.0125}>
        <circleGeometry args={[0.0062, 32]} />
        <meshPhysicalMaterial color="#0b1020" roughness={0.02} metalness={0.3} clearcoat={1} />
      </mesh>
      <mesh position={[0.016, 0.004, 0.0125]}>
        <circleGeometry args={[0.0013, 12]} />
        <meshBasicMaterial color="#3dff7a" toneMapped={false} />
      </mesh>
    </group>
  </group>
);

export default Webcam;
