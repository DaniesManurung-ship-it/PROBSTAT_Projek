
import * as THREE from 'three';
import { OrbitControls } from
  'three/addons/controls/OrbitControls.js';

/* ======================================
   BALL PROBABILITY LABORATORY
====================================== */

const $ = (id) => document.getElementById(id);

const COLORS = {
  red: {
    label: 'MERAH',
    hex: 0xe75059,
    css: '#e75059'
  },
  blue: {
    label: 'BIRU',
    hex: 0x368ce8,
    css: '#368ce8'
  },
  yellow: {
    label: 'KUNING',
    hex: 0xf2c94c,
    css: '#f2c94c'
  }
};

function startBallsLab() {
  const ui = {
    host: $('balls-scene'),

    red: $('ball-red-count'),
    blue: $('ball-blue-count'),
    yellow: $('ball-yellow-count'),

    target: $('ball-target-color'),
    mode: $('ball-mode'),

    apply: $('ball-apply'),
    draw: $('ball-draw'),
    reset: $('ball-reset'),

    status: $('ball-status'),

    total: $('ball-total-draws'),
    remaining: $('ball-remaining'),
    hits: $('ball-hits'),
    theory: $('ball-theory'),

    empirical: $('ball-empirical'),
    nextChance: $('ball-next-chance'),

    last: $('ball-last'),
    bar: $('ball-hit-bar'),
    insight: $('ball-insight')
  };

  if (Object.values(ui).some((element) => !element)) {
    console.warn('Ball Lab: elemen HTML belum lengkap.');
    return;
  }

  /* ======================================
     STATE
  ====================================== */

  let initialCounts = {
    red: 5,
    blue: 3,
    yellow: 2
  };

  let initialTotal = 10;
  let initialTargetCount = 5;

  let allBalls = [];
  let remainingBalls = [];

  let drawCount = 0;
  let hitCount = 0;

  let animation = null;
  let animationFrame = null;

  /* ======================================
     THREE.JS SCENE
  ====================================== */

  const scene = new THREE.Scene();

  scene.background = new THREE.Color('#0a1425');

  const camera = new THREE.PerspectiveCamera(
    38,
    1,
    0.1,
    100
  );

  camera.position.set(3.4, 2.5, 5.7);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
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
  controls.minDistance = 4;
  controls.maxDistance = 9;

  controls.target.set(0, 0, 0);

  /* LIGHTING */

  scene.add(
    new THREE.HemisphereLight(
      0xe8f2ff,
      0x34425c,
      2.5
    )
  );

  const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
  );

  mainLight.position.set(4, 6, 5);
  scene.add(mainLight);

  const blueLight = new THREE.PointLight(
    0x398bff,
    22,
    12
  );

  blueLight.position.set(-3, 1, 2);
  scene.add(blueLight);

  /* ======================================
     LANTAI
  ====================================== */

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 64),
    new THREE.MeshStandardMaterial({
      color: 0x132a49,
      roughness: 0.7
    })
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.35;

  scene.add(floor);

  /* ======================================
     WADAH KACA
  ====================================== */

  const jarWall = new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.25,
      1.25,
      2.55,
      64,
      1,
      true
    ),
    new THREE.MeshPhysicalMaterial({
      color: 0x99cbff,
      transparent: true,
      opacity: 0.17,
      roughness: 0.12,
      metalness: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );

  scene.add(jarWall);

  /* BAGIAN ATAS DAN BAWAH WADAH */

  const glassRimMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x83baff,
      metalness: 0.75,
      roughness: 0.22
    });

  function createRim(y) {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(
        1.25,
        0.035,
        12,
        64
      ),
      glassRimMaterial
    );

    rim.rotation.x = Math.PI / 2;
    rim.position.y = y;

    scene.add(rim);

    return rim;
  }

  createRim(1.25);
  createRim(-1.25);

  const jarBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.25,
      1.25,
      0.06,
      64
    ),
    new THREE.MeshPhysicalMaterial({
      color: 0x6499c7,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2
    })
  );

  jarBottom.position.y = -1.23;
  scene.add(jarBottom);

  /* ======================================
     GROUP BOLA
  ====================================== */

  const ballGroup = new THREE.Group();

  scene.add(ballGroup);

  const sphereGeometry = new THREE.SphereGeometry(
    0.18,
    32,
    24
  );

  function getBallPosition(index) {
    const layer = Math.floor(index / 6);
    const slot = index % 6;

    const angle =
      slot * Math.PI / 3 + layer * 0.18;

    const radius = 0.66;

    return new THREE.Vector3(
      Math.cos(angle) * radius,
      -0.83 + layer * 0.42,
      Math.sin(angle) * radius
    );
  }

  function clearBalls() {
    for (const ball of allBalls) {
      ballGroup.remove(ball.mesh);

      ball.mesh.material.dispose();
    }

    allBalls = [];
    remainingBalls = [];
  }

  /* ======================================
     MEMBUAT BOLA
  ====================================== */

  function createBalls() {
    clearBalls();

    let index = 0;

    for (const color of ['red', 'blue', 'yellow']) {
      const amount = initialCounts[color];

      for (let i = 0; i < amount; i++) {
        const material = new THREE.MeshPhysicalMaterial({
          color: COLORS[color].hex,
          roughness: 0.22,
          metalness: 0.05,
          clearcoat: 0.9,
          clearcoatRoughness: 0.15
        });

        const mesh = new THREE.Mesh(
          sphereGeometry,
          material
        );

        const home = getBallPosition(index);

        mesh.position.copy(home);
        mesh.castShadow = true;

        ballGroup.add(mesh);

        allBalls.push({
          color,
          mesh,
          home: home.clone()
        });

        index++;
      }
    }

    remainingBalls = [...allBalls];

    updateStats();
  }

  /* ======================================
     HITUNG JUMLAH BOLA
  ====================================== */

  function countAvailableColor(color) {
    const available =
      ui.mode.value === 'with'
        ? allBalls
        : remainingBalls;

    return available.filter(
      (ball) => ball.color === color
    ).length;
  }

  /* ======================================
     UPDATE STATISTIK
  ====================================== */

  function updateStats() {
    const target = ui.target.value;

    const favorableRemaining =
      countAvailableColor(target);

    const availableTotal =
      ui.mode.value === 'with'
        ? initialTotal
        : remainingBalls.length;

    const theoretical =
      initialTargetCount / initialTotal * 100;

    const empirical =
      drawCount > 0
        ? hitCount / drawCount * 100
        : 0;

    const nextChance =
      availableTotal > 0
        ? favorableRemaining / availableTotal * 100
        : 0;

    ui.total.textContent = drawCount;

    ui.remaining.textContent = availableTotal;

    ui.hits.textContent = hitCount;

    ui.theory.textContent =
      `${theoretical.toFixed(2)}%`;

    ui.empirical.textContent =
      `${empirical.toFixed(2)}%`;

    ui.nextChance.textContent =
      `${nextChance.toFixed(2)}%`;

    ui.bar.style.width =
      `${empirical}%`;

    const modeName =
      ui.mode.value === 'with'
        ? 'dengan pengembalian'
        : 'tanpa pengembalian';

    if (drawCount === 0) {
      ui.insight.textContent =
        `Terdapat ${initialCounts.red} bola merah, ${initialCounts.blue} bola biru, dan ${initialCounts.yellow} bola kuning. Peluang awal mendapatkan bola ${COLORS[target].label.toLowerCase()} adalah ${theoretical.toFixed(2)}%.`;
    } else {
      ui.insight.textContent =
        `Dari ${drawCount} pengambilan, ${hitCount} bola berwarna ${COLORS[target].label.toLowerCase()}. Frekuensi percobaan adalah ${empirical.toFixed(2)}%. Pengambilan dilakukan ${modeName}. Peluang pengambilan selanjutnya sekarang ${nextChance.toFixed(2)}%.`;
    }

    ui.draw.disabled =
      Boolean(animation) ||
      (
        ui.mode.value === 'without' &&
        remainingBalls.length === 0
      );
  }

  /* ======================================
     KONFIGURASI AWAL
  ====================================== */

  function setSettingsDisabled(disabled) {
    ui.red.disabled = disabled;
    ui.blue.disabled = disabled;
    ui.yellow.disabled = disabled;

    ui.target.disabled = disabled;
    ui.mode.disabled = disabled;

    ui.apply.disabled = disabled;
  }

  function applyConfig() {
    if (animation) return;

    const counts = {
      red: Number(ui.red.value),
      blue: Number(ui.blue.value),
      yellow: Number(ui.yellow.value)
    };

    const valid = Object.values(counts).every(
      (value) =>
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 30
    );

    const total =
      counts.red + counts.blue + counts.yellow;

    if (!valid || total < 1 || total > 30) {
      ui.status.textContent =
        'Jumlah setiap warna harus 0–30 dan total bola harus antara 1–30.';

      return;
    }

    initialCounts = counts;
    initialTotal = total;

    initialTargetCount = counts[ui.target.value];

    drawCount = 0;
    hitCount = 0;

    ui.last.textContent = 'Belum ada';

    setSettingsDisabled(false);

    createBalls();

    ui.status.textContent =
      `Konfigurasi berhasil diterapkan. Terdapat ${total} bola di dalam wadah.`;

    updateStats();
  }

  /* ======================================
     ANIMASI PENGAMBILAN BOLA
  ====================================== */

  function drawBall() {
    if (animation) return;

    const pool =
      ui.mode.value === 'with'
        ? allBalls
        : remainingBalls;

    if (pool.length === 0) {
      ui.status.textContent =
        'Tidak ada bola tersisa. Tekan Reset untuk memulai lagi.';

      return;
    }

    const selected =
      pool[Math.floor(Math.random() * pool.length)];

    animation = {
      phase: 'out',
      selected,

      start: performance.now(),
      duration: 1000,

      from: selected.mesh.position.clone(),

      to: new THREE.Vector3(
        0.25,
        1.65,
        1.35
      )
    };

    setSettingsDisabled(true);

    ui.draw.disabled = true;

    ui.status.textContent =
      'Bola sedang diambil dari wadah. Perhatikan warnanya!';

    updateStats();
  }

  /* ======================================
     SELESAI MENGAMBIL BOLA
  ====================================== */

  function completeDraw(ball, now) {
    drawCount++;

    const favorable =
      ball.color === ui.target.value;

    if (favorable) {
      hitCount++;
    }

    ui.last.textContent =
      COLORS[ball.color].label;

    ui.status.textContent =
      `Hasil pengambilan ke-${drawCount}: bola ${COLORS[ball.color].label.toLowerCase()}.`;

    if (ui.mode.value === 'without') {
      remainingBalls =
        remainingBalls.filter(
          (item) => item !== ball
        );

      ball.mesh.visible = false;
      animation = null;

      if (remainingBalls.length === 0) {
        ui.status.textContent +=
          ' Semua bola telah diambil. Reset untuk eksperimen baru.';
      }

      updateStats();

      return;
    }

    animation = {
      phase: 'return',
      selected: ball,
      start: now,
      duration: 500,

      from: ball.mesh.position.clone(),
      to: ball.home.clone()
    };
  }

  /* ======================================
     RESET EKSPERIMEN
  ====================================== */

  function resetExperiment() {
    if (animation) return;

    drawCount = 0;
    hitCount = 0;

    remainingBalls = [...allBalls];

    for (const ball of allBalls) {
      ball.mesh.visible = true;
      ball.mesh.position.copy(ball.home);
      ball.mesh.scale.setScalar(1);
    }

    ui.last.textContent = 'Belum ada';

    ui.status.textContent =
      'Eksperimen direset. Semua bola telah dikembalikan ke wadah.';

    setSettingsDisabled(false);

    updateStats();
  }

  /* ======================================
     RESIZE
  ====================================== */

  function resizeScene() {
    const width = Math.max(
      ui.host.clientWidth,
      280
    );

    const height = Math.max(
      ui.host.clientHeight,
      260
    );

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height,
      false
    );
  }

  /* ======================================
     RENDER DAN ANIMASI
  ====================================== */

  function animate(now = performance.now()) {
    animationFrame = requestAnimationFrame(animate);

    if (animation) {
      const progress = Math.min(
        (now - animation.start) / animation.duration,
        1
      );

      const ease =
        1 - Math.pow(1 - progress, 3);

      const selected = animation.selected;

      selected.mesh.position.lerpVectors(
        animation.from,
        animation.to,
        ease
      );

      if (animation.phase === 'out') {
        selected.mesh.scale.setScalar(
          1 + 0.25 * Math.sin(progress * Math.PI)
        );

        selected.mesh.rotation.x += 0.04;
        selected.mesh.rotation.z += 0.03;

        if (progress >= 1) {
          selected.mesh.scale.setScalar(1);

          completeDraw(selected, now);
        }
      }

      if (
        animation &&
        animation.phase === 'return'
      ) {
        selected.mesh.scale.setScalar(1);

        if (progress >= 1) {
          selected.mesh.position.copy(
            selected.home
          );

          selected.mesh.rotation.set(0, 0, 0);

          animation = null;

          ui.status.textContent +=
            ' Bola dikembalikan ke wadah.';

          updateStats();
        }
      }
    }

    controls.update();

    renderer.render(scene, camera);
  }

  /* ======================================
     EVENT LISTENERS
  ====================================== */

  ui.apply.addEventListener(
    'click',
    applyConfig
  );

  ui.draw.addEventListener(
    'click',
    drawBall
  );

  ui.reset.addEventListener(
    'click',
    resetExperiment
  );

  ui.target.addEventListener(
    'change',
    () => {
      initialTargetCount =
        initialCounts[ui.target.value];

      updateStats();
    }
  );

  ui.mode.addEventListener(
    'change',
    updateStats
  );

  window.addEventListener(
    'resize',
    resizeScene
  );

  /* ======================================
     START
  ====================================== */

  createBalls();

  resizeScene();

  animate();

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        'resize',
        resizeScene
      );

      controls.dispose();

      renderer.dispose();

      sphereGeometry.dispose();

      for (const ball of allBalls) {
        ball.mesh.material.dispose();
      }

      glassRimMaterial.dispose();

      jarWall.geometry.dispose();
      jarWall.material.dispose();

      floor.geometry.dispose();
      floor.material.dispose();

      jarBottom.geometry.dispose();
      jarBottom.material.dispose();
    },
    { once: true }
  );
}

/* START */

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startBallsLab,
    { once: true }
  );
} else {
  startBallsLab();
}
