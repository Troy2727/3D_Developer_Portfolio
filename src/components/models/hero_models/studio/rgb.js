import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// "RGB sync": every lit device cycles through the same slow rainbow.
// Visitors who ask for reduced motion get a still frame instead.
export const RGB_SPEED = 0.08; // hue turns per second

export const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const rgbHue = (t, offset = 0) => ((((reducedMotion ? 0 : t) * RGB_SPEED + offset) % 1) + 1) % 1;

export const setRgb = (color, t, offset = 0, lightness = 0.55) =>
  color.setHSL(rgbHue(t, offset), 1, lightness);

// An unlit material whose color follows the rainbow, for LED strips, rings and logos
export function useRgbMaterial(offset = 0, lightness = 0.55) {
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  useFrame(({ clock }) => setRgb(material.color, clock.elapsedTime, offset, lightness));
  return material;
}
