import { useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import ChairModel from "./ChairModel";

// Drag the chair across the floor. It stays in front of the desk, inside the room,
// and turns to face the keyboard wherever it is put.
const FLOOR = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const FACE = { x: -0.05, z: -0.1 };
const BOUNDS = { x: [-1.2, 0.6], z: [0.48, 1.0] }; // clear of the shelf, desk and fig
const clamp = (v, [lo, hi]) => Math.min(hi, Math.max(lo, v));

const Chair = ({ position, visible = true }) => {
  const chair = useRef();
  const grab = useRef(null);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const get = useThree((state) => state.get);

  const place = (x, z) => {
    x = clamp(x, BOUNDS.x);
    z = clamp(z, BOUNDS.z);
    chair.current.position.set(x, 0, z);
    // The seat faces -z at rotation 0; turn it toward the keyboard
    chair.current.rotation.y = Math.atan2(x - FACE.x, z - FACE.z);
  };

  useLayoutEffect(() => {
    place(position[0], position[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setControls = (enabled) => {
    const { controls } = get();
    if (controls) controls.enabled = enabled;
  };

  return (
    <group
      ref={chair}
      visible={visible}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!e.ray.intersectPlane(FLOOR, hit)) return;
        e.target.setPointerCapture(e.pointerId);
        grab.current = { dx: chair.current.position.x - hit.x, dz: chair.current.position.z - hit.z };
        setControls(false);
        document.body.style.cursor = "grabbing";
      }}
      onPointerMove={(e) => {
        if (!grab.current || !e.ray.intersectPlane(FLOOR, hit)) return;
        place(hit.x + grab.current.dx, hit.z + grab.current.dz);
      }}
      onPointerUp={(e) => {
        if (!grab.current) return;
        e.target.releasePointerCapture(e.pointerId);
        grab.current = null;
        setControls(true);
        document.body.style.cursor = "grab";
      }}
      onPointerOver={() => (document.body.style.cursor = "grab")}
      onPointerOut={() => !grab.current && (document.body.style.cursor = "")}
    >
      <ChairModel />
    </group>
  );
};

export default Chair;
