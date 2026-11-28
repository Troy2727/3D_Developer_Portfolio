import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";

import CameraFocus from "../hero_models/CameraFocus";
import Chair from "../hero_models/studio/Chair";
import DeskSetup, { SCREEN_FIT, SCREENS } from "./DeskSetup";
import GamingChair from "./GamingChair";

// Code-built setup in real-world meters (floor at y = 0) on a round dark stage
const TARGET = [0, 0.8, 0];
const CHAIR_FACE = { x: -0.12, z: 0.17 }; // the keyboard
const CHAIR_BOUNDS = { x: [-1.3, 1.3], z: [0.75, 1.5] }; // in front of the desk, on the stage

// Same look as the hero room's buttons over the 3D, with a visible ring for keyboard focus
const PILL =
  "rounded-full border border-white/20 backdrop-blur transition-colors hover:bg-black/80 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const ContactExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  // Clicking a monitor (or a button) zooms in on screen 1 or 2; clicking it again, Esc,
  // a click elsewhere, or the back button zooms back out
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
      shadows
      camera={{ position: isMobile ? [1.5, 1.6, 3.7] : [1.4, 1.6, 3.3], fov: isMobile ? 50 : 45 }}
      gl={{ powerPreference: 'high-performance', antialias: false }} // Disable antialiasing on mobile for better performance
      dpr={isMobile ? 1 : [1, 1.5]} // Lower resolution on mobile, capped at 1.5x elsewhere
      performance={{ min: 0.5 }} // Allow performance scaling
      onPointerMissed={leave}
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

      <CameraFocus focus={focus} isWide={false} screens={SCREENS} fit={SCREEN_FIT} />
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

      <DeskSetup onSelect={(screen) => setFocus((current) => (current === screen ? null : screen))} />
      {/* Drag it across the floor like the hero room's chair: it stays in front of the desk,
          on the stage, and turns to face the keyboard. Steps aside while zoomed in. */}
      <Chair position={[-0.35, 0, 1.0]} face={CHAIR_FACE} bounds={CHAIR_BOUNDS} visible={focus === null}>
        <GamingChair />
      </Chair>
    </Canvas>

    {focus ? (
      <button
        type="button"
        onClick={leave}
        autoFocus
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-4 py-2 text-sm text-white bg-black/60 ${PILL}`}
      >
        ← Back to desk
      </button>
    ) : (
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex gap-2">
          <button type="button" onClick={() => setFocus(1)} className={`whitespace-nowrap px-3 py-1 text-xs text-white/90 bg-black/50 ${PILL}`}>
            View screen 1 · code
          </button>
          <button type="button" onClick={() => setFocus(2)} className={`whitespace-nowrap px-3 py-1 text-xs text-white/90 bg-black/50 ${PILL}`}>
            View screen 2 · game
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

export default ContactExperience;
