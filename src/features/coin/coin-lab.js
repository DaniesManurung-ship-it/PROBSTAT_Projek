
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);

function faceTexture(label, symbol) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#ffe7a0');
  gradient.addColorStop(1, '#b87919');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#75480f';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(256, 256, 215, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#70430f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 150px Georgia';
  ctx.fillText(symbol, 256, 220);

  ctx.font = 'bold 46px Arial';
  ctx.fillText(label, 256, 375);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function startCoinLab() {
  const ui = {
    host: $('coin-scene'),
    flip: $('flip-coin'),
    reset: $('reset-coin'),
    status: $('coin-status'),
    total: $('coin-total'),
    heads: $('coin-heads'),
    tails: $('coin-tails'),
    headsRate: $('coin-head-percent'),
    tailsRate: $('coin-tail-percent'),
    last: $('coin-last-result'),
    insight: $('coin-insight'),
    bar: $('coin-bar-heads'),
  };

  if (Object.values(ui).some((item) => !item)) {
    console.warn('Coin Lab: elemen HTML belum lengkap.');
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b1424');

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.2, 4.8);

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  ui.host.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3.3;
  controls.maxDistance = 7;

  scene.add(
    new THREE.HemisphereLight(
      0xe5efff,
      0x35425a,
      2.2
    )
  );

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 4);
  scene.add(light);

  const blueLight = new THREE.PointLight(0x438fff, 25, 10);
  blueLight.position.set(-3, 1, -2);
  scene.add(blueLight);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 64),
    new THREE.MeshStandardMaterial({
      color: 0x142640,
      roughness: 0.7
    })
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.05;
  scene.add(floor);

  const geometry = new THREE.CylinderGeometry(
    0.82, 0.82, 0.14, 96
  );

  geometry.rotateX(Math.PI / 2);

  const coin = new THREE.Mesh(geometry, [
    new THREE.MeshStandardMaterial({
      color: 0xc58a2a,
      metalness: 0.9,
      roughness: 0.28
    }),

    new THREE.MeshStandardMaterial({
      map: faceTexture('ANGKA', '1'),
      metalness: 0.7,
      roughness: 0.3
    }),

    new THREE.MeshStandardMaterial({
      map: faceTexture('GAMBAR', '★'),
      metalness: 0.7,
      roughness: 0.3
    })
  ]);

  coin.castShadow = true;

  const coinRoot = new THREE.Group();
  coinRoot.add(coin);
  coinRoot.position.y = 0.12;
  scene.add(coinRoot);

  let total = 0;
  let heads = 0;
  let tails = 0;
  let flip = null;
  let frame = 0;

  function resize() {
    const width = Math.max(ui.host.clientWidth, 280);
    const height = Math.max(ui.host.clientHeight, 260);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  function updateStats() {
    const headPct = total ? heads / total * 100 : 0;
    const tailPct = total ? tails / total * 100 : 0;

    ui.total.textContent = total;
    ui.heads.textContent = heads;
    ui.tails.textContent = tails;

    ui.headsRate.textContent = `${headPct.toFixed(1)}%`;
    ui.tailsRate.textContent = `${tailPct.toFixed(1)}%`;

    ui.bar.style.width = `${headPct}%`;

    ui.insight.textContent = total
      ? `Dari ${total} pelemparan, ANGKA muncul ${heads} kali (${headPct.toFixed(1)}%). Peluang teoritisnya 50%; selisih saat ini ${Math.abs(headPct - 50).toFixed(1)} poin persentase.`
      : 'Mulai melempar koin. Bandingkan frekuensi hasil percobaan dengan peluang teoritis 50%.';
  }

  function finish(result) {
    total++;

    if (result === 'ANGKA') {
      heads++;
    } else {
      tails++;
    }

    ui.last.textContent = result;
    ui.status.textContent =
      `Hasil ${result} tercatat. Lempar lagi untuk menambah percobaan.`;

    ui.flip.disabled = false;
    ui.flip.textContent = '↻ Lempar koin lagi';

    updateStats();
  }

  function toss() {
    if (flip) return;

    const result = Math.random() < 0.5
      ? 'ANGKA'
      : 'GAMBAR';

    const currentParity =
      ((Math.round(coinRoot.rotation.x / Math.PI) % 2) + 2) % 2;

    const targetParity = result === 'ANGKA' ? 0 : 1;
    const parityChange =
      (targetParity - currentParity + 2) % 2;

    const spins = 4 + Math.floor(Math.random() * 3);

    flip = {
      result,
      targetParity,
      start: performance.now(),
      duration: 1600,
      from: coinRoot.rotation.x,
      delta: spins * Math.PI * 2 + parityChange * Math.PI
    };

    ui.flip.disabled = true;
    ui.flip.textContent = 'Koin sedang dilempar…';
    ui.status.textContent =
      'Koin sedang berputar. Perhatikan sisi yang menghadap ke depan.';
  }

  function reset() {
    if (flip) return;

    total = 0;
    heads = 0;
    tails = 0;

    coinRoot.rotation.set(0, 0, 0);
    coinRoot.position.y = 0.12;

    ui.last.textContent = 'Belum ada';
    ui.status.textContent =
      'Statistik direset. Tekan Lempar koin untuk memulai.';

    updateStats();
  }

  function render() {
    frame = requestAnimationFrame(render);

    if (flip) {
      const progress = Math.min(
        (performance.now() - flip.start) / flip.duration,
        1
      );

      const ease = 1 - Math.pow(1 - progress, 3);

      coinRoot.rotation.x =
        flip.from + flip.delta * ease;

      coinRoot.position.y =
        0.12 + Math.sin(Math.PI * progress) * 0.85;

      if (progress >= 1) {
        const result = flip.result;

        coinRoot.rotation.x =
          flip.targetParity * Math.PI;

        coinRoot.position.y = 0.12;
        flip = null;

        finish(result);
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  ui.flip.addEventListener('click', toss);
  ui.reset.addEventListener('click', reset);

  window.addEventListener('resize', resize);

  resize();
  updateStats();
  render();

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    controls.dispose();
    renderer.dispose();

    scene.traverse((object) => {
      object.geometry?.dispose();

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.filter(Boolean).forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    });
  }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startCoinLab,
    { once: true }
  );
} else {
  startCoinLab();
}
