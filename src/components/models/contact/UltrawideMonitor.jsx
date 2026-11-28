import * as THREE from "three";

// 45" 21:9 curved gaming monitor: 1051 x 450 mm panel, 800R curve, slim bezels.
// Origin = body center, screen faces +z. The edges wrap ~17 cm toward the viewer.
export const PANEL = [1.051, 0.45];
const BODY = [1.067, 0.47, 0.02];
const CURVE_R = 0.8;

// Wrap every vertex around a vertical axis CURVE_R in front of the screen
const bend = (geometry) => {
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / CURVE_R;
    const r = CURVE_R - p.getZ(i);
    p.setX(i, Math.sin(a) * r);
    p.setZ(i, CURVE_R - Math.cos(a) * r);
  }
  geometry.computeVertexNormals();
  return geometry;
};

// Where a point on the flat panel ends up after bending (x across, z depth)
export const bent = (x, z = 0) => [Math.sin(x / CURVE_R) * (CURVE_R - z), CURVE_R - Math.cos(x / CURVE_R) * (CURVE_R - z)];

const BODY_GEOMETRY = bend(new THREE.BoxGeometry(...BODY, 64, 1, 1));
const SCREEN_GEOMETRY = bend(new THREE.PlaneGeometry(...PANEL, 64, 1).translate(0, 0.004, BODY[2] / 2 + 0.0006));
const HOUSING_GEOMETRY = bend(new THREE.BoxGeometry(0.56, 0.26, 0.05, 32, 1, 1).translate(0, -0.02, -0.03));
// Thin blue light line across the back, for a bit of glow behind the setup
const BACK_LIGHT_GEOMETRY = bend(new THREE.PlaneGeometry(0.5, 0.008, 32, 1).rotateY(Math.PI).translate(0, 0.06, -0.0556));

const UltrawideMonitor = ({ screen, ...props }) => (
  <group {...props}>
    <mesh geometry={BODY_GEOMETRY} castShadow receiveShadow>
      <meshStandardMaterial color="#141519" roughness={0.4} metalness={0.2} />
    </mesh>
    {/* Unlit so it glows like a real panel */}
    <mesh geometry={SCREEN_GEOMETRY}>
      <meshBasicMaterial map={screen} toneMapped={false} />
    </mesh>
    <mesh geometry={HOUSING_GEOMETRY} castShadow>
      <meshStandardMaterial color="#1c1d22" roughness={0.45} metalness={0.25} />
    </mesh>
    <mesh geometry={BACK_LIGHT_GEOMETRY}>
      <meshBasicMaterial color="#3b82f6" toneMapped={false} />
    </mesh>
  </group>
);

export default UltrawideMonitor;
