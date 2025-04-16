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
        enableRotate={!isMobile}
        maxDistance={25} // Increased max distance for zoom out
        minDistance={5} // Minimum zoom distance
        zoomSpeed={0.5} // Control zoom speed
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        makeDefault
        enableDamping={true} // Enable damping for smoother zoom
        dampingFactor={0.05} // Control damping speed
        touchAction="none"
      />

      <Suspense fallback={null}>
        <HeroLights />
        {!isMobile && <Particles count={isMobile ? 30 : 100} />} {/* Remove particles on mobile */}
        <group
          scale={isMobile ? 0.5 : 1} // Smaller scale on mobile
          position={[0, isMobile ? -2 : -3.5, 0]} // Adjust position on mobile
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
