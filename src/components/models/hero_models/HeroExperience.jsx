import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

import Studio from "./studio/Studio";
import StudioLights from "./studio/StudioLights";

// The camera looks at the desk from the front-left; orbiting is limited to that side
// so it can't swing behind the walls or under the floor.
const TARGET = [-0.05, 0.9, 0.0];
// On xl the canvas sits behind the headline, so aim left of the room to push it to the right
const WIDE_TARGET = [-0.3, 1.05, -0.25];

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" }); // below Tailwind's md breakpoint
  const isWide = useMediaQuery({ query: "(min-width: 1280px)" }); // Tailwind's xl, where text and room share the row
  const target = isWide ? WIDE_TARGET : TARGET;
  const [tx, ty, tz] = target;

  return (
    <Canvas
      shadows
      camera={{ position: [tx - 3.85, ty + 1.6, tz + 5.2], fov: 35 }}
      gl={{ powerPreference: 'high-performance', antialias: !isMobile }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      <OrbitControls
        makeDefault
        target={target}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={8}
        minAzimuthAngle={-1.1}
        maxAzimuthAngle={-0.15}
        minPolarAngle={1.0}
        maxPolarAngle={1.45}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        enableDamping={true}
        dampingFactor={0.05}
        touchAction="none"
      />

      <Suspense fallback={null}>
        <StudioLights isMobile={isMobile} />
        <Studio />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
