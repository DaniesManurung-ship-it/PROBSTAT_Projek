import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createDie } from './create-die.js';

function getTargetQuaternion(die, value) {
  const face = die.userData.faceDefinitions.find((item) => item.value === value);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(face.normal, new THREE.Vector3(0, 1, 0));
  return quaternion;
}

export function createDiceScene(container) {
  if (!container) throw new Error('Elemen #dice-scene tidak ditemukan.');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#101b2c');
  scene.fog = new THREE.Fog('#101b2c', 9, 18);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(4.8, 7.3, 6.4);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (error) {
    container.innerHTML = '<div class="webgl-fallback">Browser ini belum mendukung WebGL. Coba gunakan Chrome atau Edge versi terbaru.</div>';
    return { rollTo: async () => {}, dispose: () => {} };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xc9e3ff, 0x243047, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(-3, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x4a9dff, 18, 12);
  rimLight.position.set(3, 2, -3);
  scene.add(rimLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x17263b, roughness: 0.88, metalness: 0.08 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.78;
  floor.receiveShadow = true;
  scene.add(floor);

  const stage = new THREE.Mesh(
    new THREE.CylinderGeometry(2.65, 2.85, 0.22, 80),
    new THREE.MeshStandardMaterial({ color: 0x20334d, roughness: 0.45, metalness: 0.45 }),
  );
  stage.position.y = -0.63;
  stage.receiveShadow = true;
  stage.castShadow = true;
  scene.add(stage);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.018, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x3f91d9 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.505;
  scene.add(ring);

  const dieA = createDie();
  const dieB = createDie();
  dieA.position.set(-0.82, 0.12, 0);
  dieB.position.set(0.82, 0.12, 0);
  dieA.scale.setScalar(0.94);
  dieB.scale.setScalar(0.94);
  scene.add(dieA, dieB);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 4.5;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.target.set(0, 0.05, 0);

  let animation = null;
  let previousFrameTime = performance.now();
  let animationFrameId = 0;
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function render(now = performance.now()) {
    const delta = Math.min((now - previousFrameTime) / 1000, 0.05);
    previousFrameTime = now;
    controls.update();

    if (animation) {
      animation.elapsed += delta;
      const progress = Math.min(animation.elapsed / animation.duration, 1);
      const settleStart = 0.64;
      for (const item of animation.items) {
        if (progress < settleStart) {
          item.die.rotation.x += delta * item.speedX;
          item.die.rotation.y += delta * item.speedY;
          item.die.rotation.z += delta * item.speedZ;
          if (progress >= settleStart - 0.04 && !item.settleStart) {
            item.settleStart = item.die.quaternion.clone();
          }
        } else {
          if (!item.settleStart) item.settleStart = item.die.quaternion.clone();
          const settleProgress = (progress - settleStart) / (1 - settleStart);
          const eased = 1 - Math.pow(1 - settleProgress, 3);
          item.die.quaternion.copy(item.settleStart).slerp(item.target, eased);
        }
      }
      if (progress >= 1) {
        for (const item of animation.items) item.die.quaternion.copy(item.target);
        animation.resolve();
        animation = null;
      }
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  }
  resize();
  animationFrameId = requestAnimationFrame(render);

  function rollTo(valueA, valueB, duration = 1.45) {
    if (![valueA, valueB].every((value) => Number.isInteger(value) && value >= 1 && value <= 6)) {
      return Promise.reject(new RangeError('Nilai dadu harus antara 1 dan 6.'));
    }
    if (animation) animation.resolve();
    return new Promise((resolve) => {
      animation = {
        elapsed: 0,
        duration,
        resolve,
        items: [
          { die: dieA, target: getTargetQuaternion(dieA, valueA), speedX: 11, speedY: 13, speedZ: 8, settleStart: null },
          { die: dieB, target: getTargetQuaternion(dieB, valueB), speedX: 12, speedY: 10, speedZ: 9, settleStart: null },
        ],
      };
    });
  }

  return {
    rollTo,
    dispose() {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    },
  };
}
