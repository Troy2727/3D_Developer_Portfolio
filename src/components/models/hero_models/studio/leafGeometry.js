import * as THREE from "three";

// One flat, pointed leaf, 1 unit long along +y with its stem at the origin.
// Shared by the pothos and the fiddle-leaf fig.
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.bezierCurveTo(0.5, 0.12, 0.55, 0.72, 0, 1);
shape.bezierCurveTo(-0.55, 0.72, -0.5, 0.12, 0, 0);

export const leafGeometry = new THREE.ShapeGeometry(shape, 10);

const UP = new THREE.Vector3(0, 1, 0);

// Matrix for a leaf pointing along `dir`, rolled around it by `roll`, at `pos`, `size` long
export const leafMatrix = (pos, dir, roll, size) => {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, roll));
  return new THREE.Matrix4().compose(pos, q, new THREE.Vector3(size, size, size));
};
