import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { OrbitControls } from "@react-three/drei";

import Computer from "./Computer";

const ContactExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 7], fov: 45 }}
      gl={{ powerPreference: 'high-performance', antialias: false }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 2]} // Lower resolution on mobile
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      <ambientLight intensity={0.5} color="#fff4e6" />

      <directionalLight position={[5, 5, 3]} intensity={2.5} color="#ffd9b3" />

      <directionalLight
        position={[5, 9, 1]}
        castShadow
        intensity={2.5}
        color="#ffd9b3"
      />

      {/* Configure OrbitControls with passive event listeners */}
      <OrbitControls
        enableZoom={false}
        enableRotate={!isMobile}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        makeDefault
        enableDamping={false}
        touchAction="none"
      />

      <group scale={[1, 1, 1]}>
        <mesh
          receiveShadow
          position={[0, -1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#a46b2d" />
        </mesh>
      </group>

      <group scale={0.03} position={[0, -1.49, -2]} castShadow>
        <Computer />
      </group>
    </Canvas>
  );
};

export default ContactExperience;
