import { Canvas, useThree } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useLayoutEffect } from "react";
import { OrbitControls } from "@react-three/drei";

import Studio from "./studio/Studio";
import StudioLights from "./studio/StudioLights";

// The camera orbits the middle of the room all the way around; walls between the
// camera and the room cut away (see Studio.jsx). Polar limits keep it above the floor.
const TARGET = [0.0, 1.0, -0.05];

// On xl the canvas sits behind the headline. Shifting the film (not the orbit target)
// moves the room to the right while it still spins around its own center.
const FilmShift = ({ isWide }) => {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.filmOffset = isWide ? -4 : 0;
    camera.updateProjectionMatrix();
  }, [camera, isWide]);
  return null;
};

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" }); // below Tailwind's md breakpoint
  const isWide = useMediaQuery({ query: "(min-width: 1280px)" }); // Tailwind's xl, where text and room share the row

  return (
    <Canvas
      shadows
      camera={{ position: [TARGET[0] - 4.0, TARGET[1] + 1.65, TARGET[2] + 5.0], fov: 35 }}
      gl={{ powerPreference: 'high-performance', antialias: !isMobile }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      <FilmShift isWide={isWide} />
      <OrbitControls
        makeDefault
        target={TARGET}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={8}
        minPolarAngle={0.55}
        maxPolarAngle={1.48}
        rotateSpeed={0.9}
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
