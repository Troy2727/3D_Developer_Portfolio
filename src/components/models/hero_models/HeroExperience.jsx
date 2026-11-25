import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";

import CameraFocus from "./CameraFocus";
import HeroPoster from "./HeroPoster";
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

// Shared look for the buttons over the 3D, with a visible ring for keyboard focus
const PILL =
  "rounded-full border border-white/20 backdrop-blur transition-colors hover:bg-black/80 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

// Tells the page once the room has actually been drawn a few times, so the still
// picture underneath can fade out without a black flash in between
const FirstFrames = ({ onReady }) => {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
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
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!focus) return;
    const onKeyDown = (e) => e.key === "Escape" && setFocus(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focus]);

  return (
    <>
    <HeroPoster visible={!drawn} />
    <Canvas
      className="hero-canvas" // touch screens: vertical swipes scroll the page (index.css)
      role="img"
      aria-label="3D model of Alex's developer studio: an oak desk with two curved monitors showing Claude and VS Code, an RGB keyboard, a bookshelf with plants, a neon sign reading hello, world, and late-afternoon sun through the blinds."
      shadows
      camera={{ position: [TARGET[0] - 4.0 * pull, TARGET[1] + 1.65 * pull, TARGET[2] + 5.0 * pull], fov: 35 }}
      gl={{ powerPreference: 'high-performance', antialias: !isMobile }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
      onPointerMissed={leave}
    >
      <FilmShift isWide={isWide} />
      {!drawn && <FirstFrames onReady={() => setDrawn(true)} />}
      <CameraFocus focus={focus} isWide={isWide} />
      <OrbitControls
        makeDefault
        target={TARGET}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={9}
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
        <Studio focused={focus !== null} onFocusScreen={(screen) => setFocus((current) => (current === screen ? null : screen))} />
      </Suspense>
    </Canvas>

    {/* While browsing: buttons that zoom onto each screen (so keyboard users can too) and
        a quiet hint. While zoomed in: a clear way back, which takes the focus. */}
    {focus ? (
      <button
        type="button"
        onClick={leave}
        autoFocus
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 text-sm text-white bg-black/60 ${PILL}`}
      >
        ← Back to room
      </button>
    ) : (
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex gap-2">
          <button type="button" onClick={() => setFocus("claude")} className={`px-3 py-1 text-xs text-white/90 bg-black/50 ${PILL}`}>
            View Claude
          </button>
          <button type="button" onClick={() => setFocus("code")} className={`px-3 py-1 text-xs text-white/90 bg-black/50 ${PILL}`}>
            View code
          </button>
        </div>
        <p className="whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
          {isTouch ? "Swipe to look around · pinch to zoom · tap a screen" : "Drag to look around · scroll to zoom · click a screen"}
        </p>
      </div>
    )}
    </>
  );
};

export default HeroExperience;
