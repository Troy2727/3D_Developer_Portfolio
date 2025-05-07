import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { OrbitControls } from "@react-three/drei";

import Computer from "./Computer";

const ContactExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 8], fov: isMobile ? 50 : 45 }} // Adjusted camera position and FOV for better view
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
        enablePan={false}
        enableZoom={true} // Enable zoom functionality
        enableRotate={true} // Enable rotation on all devices including mobile
        maxDistance={30} // Increased max distance for more zoom out
        minDistance={3} // Decreased minimum distance for closer zoom
        zoomSpeed={1.0} // Faster zoom speed
        rotateSpeed={1.0} // Faster rotation speed
        minPolarAngle={0} // Allow full vertical rotation (up)
        maxPolarAngle={Math.PI} // Allow full vertical rotation (down)
        makeDefault
        enableDamping={true} // Enable damping for smoother controls
        dampingFactor={0.05} // Lower damping for more fluid movement
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

      <group scale={isMobile ? 0.025 : 0.03} position={[0, isMobile ? -1.45 : -1.49, -2]} castShadow rotation={[0, -Math.PI / 8, 0]}>
        <Computer />
      </group>
    </Canvas>
  );
};

export default ContactExperience;
