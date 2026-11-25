import { Canvas, useThree } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";

import CameraFocus from "./CameraFocus";
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
  // Phones show the room in a nearly square box, so start the camera farther back
  const pull = isMobile ? 1.18 : 1;
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  // Clicking a monitor zooms in on its screen ("claude" or "code"); clicking it again, Esc,
  // a click elsewhere, or the button zooms back out
  const [focus, setFocus] = useState(null);
  const leave = () => setFocus(null);

  useEffect(() => {
    if (!focus) return;
    const onKeyDown = (e) => e.key === "Escape" && setFocus(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focus]);

  return (
    <>
    <Canvas
      className="hero-canvas" // touch screens: vertical swipes scroll the page (index.css)
      shadows
      camera={{ position: [TARGET[0] - 4.0 * pull, TARGET[1] + 1.65 * pull, TARGET[2] + 5.0 * pull], fov: 35 }}
      gl={{ powerPreference: 'high-performance', antialias: !isMobile }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
      onPointerMissed={leave}
    >
      <FilmShift isWide={isWide} />
      <CameraFocus focus={focus} isWide={isWide} />
      <OrbitControls
        makeDefault
        target={TARGET}
        enablePan={false}
        enableZoom={false} // the wheel scrolls the page; click the screens to zoom in
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={0.55}
        maxPolarAngle={1.48}
        rotateSpeed={0.9}
        enableDamping={true}
        dampingFactor={0.05}
        touchAction="none"
      />

      <Suspense fallback={null}>
        <StudioLights isMobile={isMobile} />
        <Studio focused={focus !== null} onFocusScreen={(screen) => setFocus((current) => (current === screen ? null : screen))} />
      </Suspense>
    </Canvas>

    {/* A quiet hint while browsing; a clear way back while zoomed in */}
    {focus ? (
      <button
        type="button"
        onClick={leave}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/60 border border-white/20 px-4 py-2 text-sm text-white backdrop-blur hover:bg-black/80 transition-colors"
      >
        ← Back to room
      </button>
    ) : (
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
        {isTouch ? "Swipe sideways to look around · tap the screens" : "Drag to look around · click the screens to zoom in"}
      </p>
    )}
    </>
  );
};

export default HeroExperience;
