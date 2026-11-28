import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Each screen's center and which way it faces, in room coordinates (see studio/Monitors.jsx)
const SCREENS = {
  claude: { center: new THREE.Vector3(-0.325, 1.15, -0.35), yaw: 0.14 },
  code: { center: new THREE.Vector3(0.325, 1.15, -0.35), yaw: -0.14 },
};
const FIT = { w: 0.68, h: 0.42 }; // one screen plus a little margin, in meters

// Glides the camera to face one screen straight on (`focus` = "claude" | "code"), and back
// to where it was when `focus` is null. OrbitControls are paused for the whole move so they
// don't fight it. On xl the canvas runs under the headline, so the screen is framed in the
// visible part (about 70% of the canvas) and the film shift is eased to zero.
// `screens` and `fit` default to the hero studio's; the Contact setup passes its own.
const CameraFocus = ({ focus, isWide, screens = SCREENS, fit = FIT }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);
  const get = useThree((state) => state.get);
  const home = useRef(null);
  const goal = useRef(null);

  useEffect(() => {
    if (!controls) return;
    if (focus) {
      home.current ??= { position: camera.position.clone(), target: controls.target.clone(), filmOffset: camera.filmOffset };
      const { center, yaw } = screens[focus];
      const { w, h } = screens[focus].fit ?? fit; // a screen can bring its own fit
      const { width, height } = get().size;
      const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
      const hHalf = Math.atan(Math.tan(vHalf) * (width / height));
      const share = isWide ? 0.7 : 0.95;
      const distance = Math.max(w / share / 2 / Math.tan(hHalf), h / 2 / Math.tan(vHalf));
      const facing = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      goal.current = { position: center.clone().addScaledVector(facing, distance), target: center.clone(), filmOffset: 0 };
      controls.enabled = false;
    } else if (home.current) {
      goal.current = home.current;
      home.current = null;
    }
  }, [focus, isWide, screens, fit, camera, controls, get]);

  useFrame((_, delta) => {
    const target = goal.current;
    if (!target || !controls) return;
    const k = 1 - Math.exp(-delta * 5);
    camera.position.lerp(target.position, k);
    controls.target.lerp(target.target, k);
    camera.filmOffset += (target.filmOffset - camera.filmOffset) * k;
    camera.updateProjectionMatrix();
    camera.lookAt(controls.target);
    // Back home: hand the camera back to OrbitControls
    if (!focus && camera.position.distanceTo(target.position) < 0.01) {
      camera.position.copy(target.position);
      controls.target.copy(target.target);
      camera.filmOffset = target.filmOffset;
      camera.updateProjectionMatrix();
      controls.enabled = true;
      goal.current = null;
    }
  });

  return null;
};

export default CameraFocus;
