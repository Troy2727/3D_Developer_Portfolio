import { useRgbMaterial } from "./rgb";

// Over-ear headphones resting on an aluminium stand. Origin = desk surface.
const STAND_TOP = 0.262;
const BAND_R = 0.085;
const BAND_Y = STAND_TOP - (BAND_R - 0.011); // inner edge of the band rests on the hanger

const Metal = () => <meshStandardMaterial color="#3a3b40" roughness={0.3} metalness={0.85} />;
const Matte = ({ color = "#16171a" }) => <meshStandardMaterial color={color} roughness={0.7} />;

const Cup = ({ side, ring }) => (
  <group position={[side * BAND_R, BAND_Y - 0.05, 0]}>
    {/* Yoke from the band down to the cup */}
    <mesh position={[side * 0.004, 0.03, 0]} castShadow>
      <boxGeometry args={[0.006, 0.05, 0.012]} />
      <Metal />
    </mesh>
    <mesh rotation-z={Math.PI / 2} castShadow receiveShadow>
      <cylinderGeometry args={[0.045, 0.045, 0.03, 40]} />
      <Matte />
    </mesh>
    {/* Cushion on the inner side */}
    <mesh position-x={-side * 0.019} rotation-y={Math.PI / 2} castShadow>
      <torusGeometry args={[0.03, 0.012, 12, 32]} />
      <Matte color="#0f0f10" />
    </mesh>
    {/* RGB ring on the outer side */}
    <mesh position-x={side * 0.0155} rotation-y={Math.PI / 2} material={ring}>
      <torusGeometry args={[0.03, 0.0025, 8, 40]} />
    </mesh>
  </group>
);

const Headphones = (props) => {
  const ring = useRgbMaterial(0.85, 0.55);

  return (
    <group {...props}>
      <mesh position-y={0.006} castShadow receiveShadow>
        <cylinderGeometry args={[0.055, 0.058, 0.012, 40]} />
        <Metal />
      </mesh>
      <mesh position-y={0.135} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.245, 16]} />
        <Metal />
      </mesh>
      <mesh position-y={STAND_TOP - 0.006} castShadow>
        <boxGeometry args={[0.09, 0.012, 0.03]} />
        <Metal />
      </mesh>

      {/* Headband: half a torus over the hanger */}
      <mesh position-y={BAND_Y} castShadow>
        <torusGeometry args={[BAND_R, 0.011, 12, 48, Math.PI]} />
        <Matte />
      </mesh>
      <Cup side={1} ring={ring} />
      <Cup side={-1} ring={ring} />
    </group>
  );
};

export default Headphones;
