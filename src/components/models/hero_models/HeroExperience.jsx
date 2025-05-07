import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: isMobile ? 60 : 45 }} // Wider FOV on mobile
      gl={{ powerPreference: 'high-performance', antialias: false }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 2]} // Lower resolution on mobile
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      {/* deep blue ambient */}
      <ambientLight intensity={0.2} color="#1a1a40" />
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
        dampingFactor={0.05} // Keep the same damping factor
        touchAction="none"
      />

      <Suspense fallback={null}>
        <HeroLights />
        {!isMobile && <Particles count={isMobile ? 30 : 100} />} {/* Remove particles on mobile */}
        <group
          scale={isMobile ? 0.8 : 1} // Increased scale on mobile for better visibility
          position={[0, isMobile ? -2.5 : -3.5, 0]} // Adjusted position for better view
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
