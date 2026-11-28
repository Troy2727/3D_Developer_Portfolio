import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";

import DeskSetup from "./DeskSetup";
import GamingChair from "./GamingChair";

// Code-built setup in real-world meters (floor at y = 0) on a round dark stage
const TARGET = [0, 0.8, 0];

const ContactExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Canvas
      shadows
      camera={{ position: isMobile ? [1.5, 1.6, 3.7] : [1.4, 1.6, 3.3], fov: isMobile ? 50 : 45 }}
      gl={{ powerPreference: 'high-performance', antialias: false }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      <ambientLight intensity={0.35} color="#cfd8ff" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0005}
      />
      {/* Blue rim light from behind the monitors, and the screens' glow on the desk */}
      <directionalLight position={[-3, 3, -4]} intensity={1.6} color="#3b82f6" />
      <pointLight position={[0, 1.1, 0.35]} intensity={1.2} distance={2.5} decay={2} color="#9ec5ff" />
      {/* Soft reflections for the leather and the monitor plastic */}
      <Environment resolution={128} frames={1} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#93c5fd" position={[-4, 2, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
      </Environment>

      {/* Configure OrbitControls with passive event listeners */}
      <OrbitControls
        target={TARGET}
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

      <mesh position-y={-0.02} receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.04, 96]} />
        <meshStandardMaterial color="#151a26" roughness={0.85} />
      </mesh>

      <DeskSetup />
      {/* Pulled out from the desk and swiveled toward you */}
      <GamingChair position={[-0.6, 0, 0.8]} rotation-y={-1.95} />
    </Canvas>
  );
};

export default ContactExperience;
