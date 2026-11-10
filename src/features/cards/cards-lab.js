
import * as THREE from 'three';
import { OrbitControls } from
  'three/addons/controls/OrbitControls.js';

/* ======================================
   PLAYING CARD PROBABILITY LAB
====================================== */

const $ = (id) => document.getElementById(id);

const SUITS = [
  { name: 'hearts', symbol: '♥', label: 'HATI', red: true },
  { name: 'diamonds', symbol: '♦', label: 'WAJIK', red: true },
  { name: 'clubs', symbol: '♣', label: 'KERITING', red: false },
  { name: 'spades', symbol: '♠', label: 'SEKOP', red: false }
];

const RANKS = [
  'A', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K'
];

const EVENTS = {
  red: {
    label: 'Kartu merah',
    favorable: 26
  },
  black: {
    label: 'Kartu hitam',
    favorable: 26
  },
  ace: {
    label: 'Kartu As',
    favorable: 4
  },
  face: {
    label: 'Kartu bergambar',
    favorable: 12
  },
  spade: {
    label: 'Kartu sekop',
    favorable: 13
  }
};

function createDeck() {
  const deck = [];

  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        rank,
        suit: suit.name,
        symbol: suit.symbol,
        label: suit.label,
        red: suit.red
      });
    });
  });

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function isFavorable(card, event) {
  switch (event) {
    case 'red':
      return card.red;

    case 'black':
      return !card.red;

    case 'ace':
      return card.rank === 'A';

    case 'face':
      return ['J', 'Q', 'K'].includes(card.rank);

    case 'spade':
      return card.suit === 'spades';

    default:
      return false;
  }
}

/* ======================================
   TEXTURE KARTU 3D
====================================== */

function createFrontTexture(card) {
  const canvas = document.createElement('canvas');

  canvas.width = 512;
  canvas.height = 720;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(0, 0, 512, 720);

  ctx.strokeStyle = '#d4b779';
  ctx.lineWidth = 15;
  ctx.strokeRect(10, 10, 492, 700);

  const color = card.red ? '#c73545' : '#172d44';

  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.font = 'bold 75px Georgia';
  ctx.fillText(card.rank, 42, 30);

  ctx.font = 'bold 90px Georgia';
  ctx.fillText(card.symbol, 35, 100);

  ctx.font = 'bold 235px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.symbol, 256, 360);

  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.font = 'bold 75px Georgia';
  ctx.fillText(card.rank, 470, 680);

  ctx.font = 'bold 90px Georgia';
  ctx.fillText(card.symbol, 470, 610);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createBackTexture() {
  const canvas = document.createElement('canvas');

  canvas.width = 512;
  canvas.height = 720;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#17365b';
  ctx.fillRect(0, 0, 512, 720);

  ctx.strokeStyle = '#74a9e8';
  ctx.lineWidth = 9;
  ctx.strokeRect(25, 25, 462, 670);

  ctx.strokeStyle = '#aacff4';
  ctx.lineWidth = 3;

  for (let i = -720; i < 800; i += 55) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 720, 720);
    ctx.stroke();
  }

  ctx.strokeStyle = '#f0d58c';
  ctx.lineWidth = 5;
  ctx.strokeRect(75, 100, 362, 520);

  ctx.fillStyle = '#f0d58c';
  ctx.font = 'bold 130px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P3D', 256, 360);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/* ======================================
   INITIALIZE LAB
====================================== */

function startCardsLab() {
  const ui = {
    host: $('cards-scene'),
    draw: $('draw-card'),
    reset: $('reset-cards'),
    event: $('card-event'),
    status: $('cards-status'),
    total: $('cards-total'),
    remaining: $('cards-remaining'),
    hits: $('cards-hits'),
    theory: $('cards-theory'),
    last: $('cards-last'),
    rate: $('cards-hit-rate'),
    bar: $('cards-hit-bar'),
    insight: $('cards-insight')
  };

  if (Object.values(ui).some((element) => !element)) {
    console.warn('Cards Lab: elemen HTML belum lengkap.');
    return;
  }

  let deck = createDeck();
  let drawnCards = [];
  let flip = null;
  let animationFrame = null;

  const scene = new THREE.Scene();

  scene.background = new THREE.Color('#0b1424');

  const camera = new THREE.PerspectiveCamera(
    38,
    1,
    0.1,
    100
  );

  camera.position.set(0, 0.5, 6.5);
  camera.lookAt(0, 0, 0);

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
  controls.minDistance = 4;
  controls.maxDistance = 9;
  controls.target.set(0, 0, 0);

  /* Pencahayaan */

  scene.add(
    new THREE.HemisphereLight(
      0xe5efff,
      0x34415b,
      2
    )
  );

  const light = new THREE.DirectionalLight(
    0xffffff,
    3
  );

  light.position.set(3, 5, 5);
  scene.add(light);

  const blueLight = new THREE.PointLight(
    0x438fff,
    20,
    10
  );

  blueLight.position.set(-3, 1, -2);
  scene.add(blueLight);

  /* Meja virtual */

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.15, 3),
    new THREE.MeshStandardMaterial({
      color: 0x173052,
      roughness: 0.55
    })
  );

  table.position.y = -1.25;

  scene.add(table);

  /* Material kartu */

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7c69f,
    roughness: 0.55
  });

  const backMaterial = new THREE.MeshStandardMaterial({
    map: createBackTexture(),
    roughness: 0.5
  });

  const frontMaterial = new THREE.MeshStandardMaterial({
    map: createFrontTexture({
      rank: 'A',
      symbol: '♥',
      red: true
    }),
    roughness: 0.6
  });

  const cardGeometry = new THREE.BoxGeometry(
    1.5,
    2.1,
    0.045
  );

  const cardMesh = new THREE.Mesh(
    cardGeometry,
    [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial
    ]
  );

  const cardRoot = new THREE.Group();

  cardRoot.add(cardMesh);

  cardRoot.position.set(-1.1, -0.03, 0.25);
  cardRoot.rotation.y = Math.PI;

  scene.add(cardRoot);

  /* Tumpukan kartu */

  const deckGeometry = new THREE.BoxGeometry(
    1.5,
    2.1,
    0.16
  );

  const deckMesh = new THREE.Mesh(
    deckGeometry,
    [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      backMaterial,
      backMaterial
    ]
  );

  const deckGroup = new THREE.Group();

  deckGroup.add(deckMesh);
  deckGroup.position.set(-1.1, -0.03, -0.12);

  scene.add(deckGroup);

  /* ======================================
     STATISTIK
  ====================================== */

  function updateStats() {
    const selectedEvent = ui.event.value;

    const eventInfo = EVENTS[selectedEvent];

    const totalDrawn = drawnCards.length;

    const favorable = drawnCards.filter((card) =>
      isFavorable(card, selectedEvent)
    ).length;

    const empiricalRate = totalDrawn
      ? favorable / totalDrawn * 100
      : 0;

    const theoreticalRate =
      eventInfo.favorable / 52 * 100;

    ui.total.textContent = totalDrawn;

    ui.remaining.textContent = deck.length;

    ui.hits.textContent = favorable;

    ui.theory.textContent =
      `${theoreticalRate.toFixed(2)}%`;

    ui.rate.textContent =
      `${empiricalRate.toFixed(2)}%`;

    ui.bar.style.width =
      `${empiricalRate}%`;

    if (totalDrawn === 0) {
      ui.insight.textContent =
        `Dalam satu dek terdapat ${eventInfo.favorable} ${eventInfo.label.toLowerCase()} dari 52 kartu. Mulai mengambil kartu untuk melihat hasil eksperimen.`;
    } else {
      const difference = Math.abs(
        empiricalRate - theoreticalRate
      );

      ui.insight.textContent =
        `Dari ${totalDrawn} kartu yang diambil, ${favorable} merupakan ${eventInfo.label.toLowerCase()}. Frekuensi percobaan ${empiricalRate.toFixed(2)}%, sedangkan peluang teoritis awal ${theoreticalRate.toFixed(2)}%. Selisihnya ${difference.toFixed(2)} poin persentase.`;
    }

    deckGroup.scale.z = Math.max(
      0.15,
      deck.length / 52
    );

    ui.draw.disabled =
      deck.length === 0 || Boolean(flip);

    ui.reset.disabled = Boolean(flip);

    if (deck.length === 0) {
      ui.status.textContent =
        'Semua 52 kartu sudah diambil. Tekan Reset Dek untuk memulai eksperimen baru.';
    }
  }

  /* ======================================
     AMBIL KARTU
  ====================================== */

  function drawCard() {
    if (flip || deck.length === 0) return;

    const selectedCard = deck.pop();

    drawnCards.push(selectedCard);

    const newTexture = createFrontTexture(
      selectedCard
    );

    frontMaterial.map?.dispose();

    frontMaterial.map = newTexture;
    frontMaterial.needsUpdate = true;

    cardRoot.position.set(-1.1, -0.03, 0.25);

    cardRoot.rotation.set(0, Math.PI, 0);

    flip = {
      card: selectedCard,
      start: performance.now(),
      duration: 1700,
      startY: -0.03,
      startX: -1.1,
      startRotation: Math.PI,
      spins: 2
    };

    ui.draw.disabled = true;
    ui.reset.disabled = true;

    ui.status.textContent =
      'Kartu sedang diambil dan dibalik. Perhatikan simbol yang muncul!';

    updateStats();
  }

  /* ======================================
     RESET
  ====================================== */

  function resetCards() {
    if (flip) return;

    deck = createDeck();
    drawnCards = [];

    cardRoot.rotation.set(0, Math.PI, 0);

    cardRoot.position.set(-1.1, -0.03, 0.25);

    ui.last.textContent = 'Belum ada';

    ui.status.textContent =
      'Dek telah diacak ulang. Silakan mulai eksperimen.';

    updateStats();
  }

  function finishFlip(card) {
    cardRoot.position.set(0.85, -0.03, 0.25);

    cardRoot.rotation.set(
      0,
      Math.PI * 6,
      0
    );

    ui.last.textContent =
      `${card.rank} ${card.symbol}`;

    ui.status.textContent =
      `Kamu mendapatkan ${card.rank} ${card.label}. Kartu ini telah dikeluarkan dari dek dan tidak akan muncul lagi dalam eksperimen ini.`;

    flip = null;

    updateStats();
  }

  /* ======================================
     ANIMASI
  ====================================== */

  function resize() {
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

  function animate() {
    animationFrame = requestAnimationFrame(animate);

    if (flip) {
      const progress = Math.min(
        (performance.now() - flip.start) /
          flip.duration,
        1
      );

      const ease =
        1 - Math.pow(1 - progress, 3);

      cardRoot.position.x =
        flip.startX +
        (0.85 - flip.startX) * ease;

      cardRoot.position.y =
        flip.startY +
        Math.sin(progress * Math.PI) * 0.85;

      cardRoot.rotation.y =
        flip.startRotation +
        (Math.PI + flip.spins * Math.PI * 2) * ease;

      cardRoot.rotation.z =
        Math.sin(progress * Math.PI * 2) * 0.16;

      if (progress >= 1) {
        const card = flip.card;

        finishFlip(card);
      }
    }

    controls.update();

    renderer.render(scene, camera);
  }

  /* EVENT */

  ui.draw.addEventListener(
    'click',
    drawCard
  );

  ui.reset.addEventListener(
    'click',
    resetCards
  );

  ui.event.addEventListener(
    'change',
    updateStats
  );

  window.addEventListener(
    'resize',
    resize
  );

  resize();

  updateStats();

  animate();

  /* Pembersihan ketika halaman ditutup */

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        'resize',
        resize
      );

      controls.dispose();

      renderer.dispose();

      cardGeometry.dispose();
      deckGeometry.dispose();

      frontMaterial.map?.dispose();
      backMaterial.map?.dispose();

      frontMaterial.dispose();
      backMaterial.dispose();
      edgeMaterial.dispose();

      deckMesh.material = [];
      cardMesh.material = [];
    },
    { once: true }
  );
}

/* Jalankan setelah elemen HTML tersedia */

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startCardsLab,
    { once: true }
  );
} else {
  startCardsLab();
}
