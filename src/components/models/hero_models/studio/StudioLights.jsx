import { Environment, Lightformer } from "@react-three/drei";

// Late-afternoon sun from the window side. It points at the origin, entering through
// the window at x = 1.3 and falling ~23° onto the desk and back wall.
const SUN = [4.8, 2.04, 1.8];

const StudioLights = ({ isMobile }) => (
  <>
    <directionalLight
      castShadow
      position={SUN}
      intensity={11}
      color="#ffb877"
      shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.012}
      shadow-camera-left={-3.4}
      shadow-camera-right={3.4}
      shadow-camera-top={3.4}
      shadow-camera-bottom={-3.4}
      shadow-camera-near={0.5}
      shadow-camera-far={12}
    />
    {/* Warm room bounce, kept low so the sun stripes stand out */}
    <hemisphereLight args={["#f3e6d6", "#5a4330", 0.6]} />
    {/* Faint glow from the two screens onto the desk */}
    <pointLight position={[0, 1.05, -0.15]} intensity={0.35} distance={1.6} color="#c8d4ff" />

    {/* Reflections only: a soft window, ceiling and room fill, no HDR download */}
    <Environment resolution={256} frames={1} environmentIntensity={0.45}>
      <Lightformer form="rect" intensity={3} color="#ffd9a8" position={[3, 1.6, 0.3]} rotation-y={-Math.PI / 2} scale={[2, 1.5, 1]} />
      <Lightformer form="rect" intensity={0.8} color="#d6e2ff" position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
      <Lightformer form="rect" intensity={0.4} color="#ffffff" position={[-3, 1.5, 2]} rotation-y={Math.PI / 2.5} scale={[3, 2, 1]} />
    </Environment>
  </>
);

export default StudioLights;
