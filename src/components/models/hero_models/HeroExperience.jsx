import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" }); // below Tailwind's md breakpoint

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      gl={{ powerPreference: 'high-performance', antialias: false }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
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
        {!isMobile && <Particles count={100} />} {/* Remove particles on mobile */}
        <group
          scale={isMobile ? 1.1 : 1} // Larger on mobile so the room fills the screen width
          position={[0, isMobile ? -3.2 : -3.5, 0]} // Adjusted position for better view
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
