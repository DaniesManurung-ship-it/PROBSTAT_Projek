import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PIP_LAYOUTS = {
  1: [[0, 0]],
  2: [[-1, 1], [1, -1]],
  3: [[-1, 1], [0, 0], [1, -1]],
  4: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
  5: [[-1, 1], [1, 1], [0, 0], [-1, -1], [1, -1]],
  6: [[-1, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [1, -1]],
};

const FACE_DEFINITIONS = [
  { value: 1, normal: new THREE.Vector3(0, 1, 0), right: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 0, -1) },
  { value: 6, normal: new THREE.Vector3(0, -1, 0), right: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 0, 1) },
  { value: 3, normal: new THREE.Vector3(1, 0, 0), right: new THREE.Vector3(0, 0, -1), up: new THREE.Vector3(0, 1, 0) },
  { value: 4, normal: new THREE.Vector3(-1, 0, 0), right: new THREE.Vector3(0, 0, 1), up: new THREE.Vector3(0, 1, 0) },
  { value: 2, normal: new THREE.Vector3(0, 0, 1), right: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 1, 0) },
  { value: 5, normal: new THREE.Vector3(0, 0, -1), right: new THREE.Vector3(-1, 0, 0), up: new THREE.Vector3(0, 1, 0) },
];

export function createDie() {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf2efe3, roughness: 0.38, metalness: 0.02 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 5, 0.105), bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const pipMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2820, roughness: 0.38 });
  const pipGeometry = new THREE.SphereGeometry(0.067, 18, 14);
  const halfSize = 0.505;
  const spacing = 0.205;

  for (const face of FACE_DEFINITIONS) {
    for (const [x, y] of PIP_LAYOUTS[face.value]) {
      const pip = new THREE.Mesh(pipGeometry, pipMaterial);
      const position = face.normal.clone().multiplyScalar(halfSize)
        .add(face.right.clone().multiplyScalar(x * spacing))
        .add(face.up.clone().multiplyScalar(y * spacing));
      pip.position.copy(position);
      pip.castShadow = true;
      group.add(pip);
    }
  }

  group.userData.faceDefinitions = FACE_DEFINITIONS;
  return group;
}
