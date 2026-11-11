
import {
  analyzeAdvancedProblem,
  analyzeConditionalProblem
} from './advanced-probability.js';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getSceneThemeColors, subscribeToThemeChange } from '../../app/theme.js';

/* ==========================================
   PROBABILITY 3D - SMART SOLVER ENGINE
   Versi prototipe berbasis pola soal lokal
========================================== */

const $ = (id) => document.getElementById(id);

const ui = {
  question: $('solver-question'),
  submit: $('solver-submit'),
  status: $('solver-status'),
  output: $('solver-output'),
  answer: $('solver-answer'),
  percentage: $('solver-percentage'),
  fraction: $('solver-fraction'),
  steps: $('solver-steps'),
  summary: $('solver-summary'),
  scene: $('solver-scene'),
  visualDescription: $('solver-visual-description'),
  sample: $('solver-sample-space')
};

/* ==========================================
   MATHEMATICAL UTILITIES
========================================== */

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);

  return `${numerator / divisor}/${denominator / divisor}`;
}

function createResult(data) {
  const percentage =
    (data.favorable / data.total) * 100;

  return {
    ...data,
    fraction: simplifyFraction(
      data.favorable,
      data.total
    ),
    percentage
  };
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/[,.!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ==========================================
   1. TWO DICE PROBLEM
========================================== */

function solveTwoDice(text) {
  const targetMatch =
    text.match(
      /jumlah(?:\s+mata)?(?:\s+kedua)?\s+dadu\s*(?:adalah\s*)?(?:=)?\s*(\d+)/
    ) ||
    text.match(/jumlahnya\s*(?:adalah\s*)?(\d+)/) ||
    text.match(/jumlah.*?(\d+)/);

  if (!targetMatch) {
    return null;
  }

  const target = Number(targetMatch[1]);

  if (
    !Number.isInteger(target) ||
    target < 2 ||
    target > 12
  ) {
    return null;
  }

  const outcomes = [];

  for (let die1 = 1; die1 <= 6; die1++) {
    for (let die2 = 1; die2 <= 6; die2++) {
      outcomes.push({
        first: die1,
        second: die2,
        sum: die1 + die2,
        favorable: die1 + die2 === target
      });
    }
  }

  const favorable = outcomes.filter(
    (item) => item.favorable
  );

  return createResult({
    title: 'Peluang dua buah dadu',
    model: 'dice',
    favorable: favorable.length,
    total: outcomes.length,
    sample: outcomes,
    steps: [
      'Setiap dadu memiliki 6 sisi. Karena dua dadu dilempar bersamaan, ruang sampelnya adalah 6 × 6 = 36 kemungkinan.',
      `Kejadian yang dicari adalah jumlah kedua dadu sama dengan ${target}.`,
      `Ditemukan ${favorable.length} pasangan yang memenuhi kondisi tersebut.`,
      `Peluang dihitung dengan ${favorable.length}/36 = ${simplifyFraction(favorable.length, 36)}.`
    ],
    description:
      `Visualisasi dua dadu dan 36 pasangan hasil. Kombinasi berwarna hijau merupakan hasil yang jumlahnya ${target}.`,
    summary:
      `Dari 36 kemungkinan hasil, terdapat ${favorable.length} pasangan yang menghasilkan jumlah ${target}.`
  });
}

/* ==========================================
   2. SINGLE DIE PROBLEM
========================================== */

function solveSingleDie(text) {
  let favorableValues = [];

  if (/\bgenap\b/.test(text)) {
    favorableValues = [2, 4, 6];
  } else if (/\bganjil\b/.test(text)) {
    favorableValues = [1, 3, 5];
  } else {
    const match =
      text.match(/(?:angka|mata)(?:\s+dadu)?\s*(?:adalah\s*)?(?:=)?\s*(\d+)/) ||
      text.match(/muncul(?:nya)?\s*(?:angka\s*)?(\d+)/);

    if (!match) return null;

    const value = Number(match[1]);

    if (value < 1 || value > 6) return null;

    favorableValues = [value];
  }

  const outcomes = [1, 2, 3, 4, 5, 6].map((value) => ({
    value,
    favorable: favorableValues.includes(value)
  }));

  return createResult({
    title: 'Peluang satu buah dadu',
    model: 'dice-single',
    favorable: favorableValues.length,
    total: 6,
    sample: outcomes,
    steps: [
      'Sebuah dadu mempunyai enam kemungkinan hasil, yaitu 1, 2, 3, 4, 5, dan 6.',
      `Kejadian yang diinginkan memiliki ${favorableValues.length} hasil yang memenuhi kondisi.`,
      `Peluang = ${favorableValues.length}/6 = ${simplifyFraction(favorableValues.length, 6)}.`
    ],
    description:
      'Dadu 3D dan enam kemungkinan sisi. Sisi berwarna hijau merupakan kejadian yang dicari.',
    summary:
      `Terdapat ${favorableValues.length} hasil yang memenuhi kondisi dari enam kemungkinan.`
  });
}

/* ==========================================
   3. COIN PROBLEM
========================================== */

function solveCoin(text) {
  const multipleCoins =
    /\bdua\s+(?:buah\s+)?koin\b/.test(text) ||
    /\b2\s+(?:buah\s+)?koin\b/.test(text);

  if (multipleCoins) {
    return {
      error:
        'Versi prototipe saat ini mendukung satu koin. Dukungan dua atau lebih koin akan kita tambahkan berikutnya.'
    };
  }

  const isHeads = /\bangka\b/.test(text);
  const isTails = /\bgambar\b/.test(text);

  if (!isHeads && !isTails) return null;

  const event = isHeads ? 'ANGKA' : 'GAMBAR';

  return createResult({
    title: 'Peluang pelemparan koin',
    model: 'coin',
    favorable: 1,
    total: 2,
    sample: [
      { value: 'ANGKA', favorable: isHeads },
      { value: 'GAMBAR', favorable: isTails }
    ],
    steps: [
      'Satu koin mempunyai dua kemungkinan sisi, yaitu ANGKA dan GAMBAR.',
      `Kejadian yang dicari adalah muncul sisi ${event}.`,
      'Hanya ada satu sisi yang memenuhi kondisi dari dua kemungkinan.',
      'Peluang = 1/2 = 50%.'
    ],
    description:
      'Koin 3D dengan dua sisi. Sisi yang menjadi kejadian yang dicari ditandai dengan warna hijau.',
    summary:
      `Peluang muncul sisi ${event.toLowerCase()} adalah 1 dari 2 kemungkinan.`
  });
}

/* ==========================================
   4. CARD PROBLEM
========================================== */

function solveCard(text) {
  let label = '';
  let favorable = 0;

  if (/\bmerah\b/.test(text)) {
    label = 'kartu merah';
    favorable = 26;
  } else if (/\bhitam\b/.test(text)) {
    label = 'kartu hitam';
    favorable = 26;
  } else if (/\bsekop\b/.test(text)) {
    label = 'kartu sekop';
    favorable = 13;
  } else if (/\b(as|ace)\b/.test(text)) {
    label = 'kartu As';
    favorable = 4;
  } else if (/\b(bergambar|wajah|face card)\b/.test(text)) {
    label = 'kartu bergambar';
    favorable = 12;
  } else {
    return null;
  }

  const suits = [
    { name: 'Hati', symbol: '♥', red: true },
    { name: 'Wajik', symbol: '♦', red: true },
    { name: 'Keriting', symbol: '♣', red: false },
    { name: 'Sekop', symbol: '♠', red: false }
  ];

  const ranks = [
    'A', '2', '3', '4', '5', '6', '7',
    '8', '9', '10', 'J', 'Q', 'K'
  ];

  const cards = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      let matched = false;

      if (label === 'kartu merah') matched = suit.red;
      if (label === 'kartu hitam') matched = !suit.red;
      if (label === 'kartu sekop') matched = suit.name === 'Sekop';
      if (label === 'kartu As') matched = rank === 'A';
      if (label === 'kartu bergambar') {
        matched = ['J', 'Q', 'K'].includes(rank);
      }

      cards.push({
        value: `${rank}${suit.symbol}`,
        favorable: matched
      });
    }
  }

  return createResult({
    title: 'Peluang pengambilan kartu',
    model: 'cards',
    favorable,
    total: 52,
    sample: cards,
    steps: [
      'Satu dek kartu remi standar mempunyai 52 kartu.',
      `Kejadian yang dicari adalah mendapatkan ${label}.`,
      `Terdapat ${favorable} kartu yang memenuhi kondisi.`,
      `Peluang = ${favorable}/52 = ${simplifyFraction(favorable, 52)}.`
    ],
    description:
      'Visualisasi dek kartu remi dengan satu kartu yang mewakili kejadian yang sedang dipelajari.',
    summary:
      `Terdapat ${favorable} ${label} dari 52 kartu dalam satu dek standar.`
  });
}

/* ==========================================
   5. BALL PROBLEM
========================================== */

function solveBalls(text) {
  const counts = {
    merah: Number(
      text.match(/(\d+)\s*(?:buah\s*)?bola\s*merah/)?.[1] || 0
    ),
    biru: Number(
      text.match(/(\d+)\s*(?:buah\s*)?bola\s*biru/)?.[1] || 0
    ),
    kuning: Number(
      text.match(/(\d+)\s*(?:buah\s*)?bola\s*kuning/)?.[1] || 0
    )
  };

  const total = Object.values(counts).reduce(
    (sum, number) => sum + number,
    0
  );

  if (total === 0 || total > 30) return null;

  const targetMatch =
    text.match(/keduanya\s+(merah|biru|kuning)/) ||
    text.match(/peluang.{0,65}(?:bola\s+)?(merah|biru|kuning)/);

  if (!targetMatch) return null;

  const target = targetMatch[1];

  const targetCount = counts[target];

  const twoDraws =
    /\bdua\s+(?:buah\s+)?bola\b/.test(text) ||
    /\b2\s+(?:buah\s+)?bola\b/.test(text) ||
    /\bkeduanya\b/.test(text);

  const withoutReplacement =
    /tanpa\s+pengembalian/.test(text) ||
    /tidak\s+dikembalikan/.test(text);

  const withReplacement =
    /dengan\s+pengembalian/.test(text);

  if (withoutReplacement && withReplacement) {
    return {
      error: 'Metode pengambilan dalam soal belum jelas.'
    };
  }

  if (twoDraws && !withoutReplacement && !withReplacement) {
    return {
      error:
        'Soal menyebut dua pengambilan, tetapi belum menjelaskan apakah bola dikembalikan. Tambahkan "dengan pengembalian" atau "tanpa pengembalian".'
    };
  }

  if (twoDraws && targetCount < 2 && withoutReplacement) {
    return {
      error:
        `Hanya ada ${targetCount} bola ${target}. Tidak mungkin mengambil dua bola ${target} tanpa pengembalian.`
    };
  }

  let favorable;
  let denominator;
  let steps;

  if (twoDraws) {
    if (withoutReplacement) {
      favorable = targetCount * (targetCount - 1);
      denominator = total * (total - 1);

      steps = [
        `Awalnya terdapat ${targetCount} bola ${target} dari ${total} bola.`,
        'Pengambilan pertama tidak diikuti pengembalian bola.',
        `Peluang pertama = ${targetCount}/${total}.`,
        `Peluang kedua = ${targetCount - 1}/${total - 1}.`,
        `Peluang kedua bola ${target} = (${targetCount}/${total}) × (${targetCount - 1}/${total - 1}) = ${favorable}/${denominator}.`
      ];
    } else {
      favorable = targetCount * targetCount;
      denominator = total * total;

      steps = [
        `Awalnya terdapat ${targetCount} bola ${target} dari ${total} bola.`,
        'Bola pertama dikembalikan sehingga komposisi kotak tidak berubah.',
        `Peluang setiap pengambilan = ${targetCount}/${total}.`,
        `Peluang kedua bola ${target} = (${targetCount}/${total}) × (${targetCount}/${total}) = ${favorable}/${denominator}.`
      ];
    }
  } else {
    favorable = targetCount;
    denominator = total;

    steps = [
      `Jumlah bola ${target} adalah ${targetCount}.`,
      `Jumlah seluruh bola adalah ${total}.`,
      `Peluang mengambil bola ${target} = ${targetCount}/${total} = ${simplifyFraction(targetCount, total)}.`
    ];
  }

  return createResult({
    title: 'Peluang pengambilan bola',
    model: 'balls',
    favorable,
    total: denominator,
    sample: Object.entries(counts).map(
      ([color, count]) => ({
        value: `${color}: ${count}`,
        favorable: color === target
      })
    ),
    counts,
    target,
    steps,
    description:
      'Wadah 3D menampilkan komposisi bola sesuai soal. Warna yang dicari ditandai dalam penjelasan.',
    summary: twoDraws
      ? `Peluang mendapatkan dua bola ${target} adalah ${simplifyFraction(favorable, denominator)}.`
      : `Peluang mengambil satu bola ${target} adalah ${simplifyFraction(favorable, denominator)}.`
  });
}

/* ==========================================
   MAIN PROBLEM ANALYZER
========================================== */

function analyzeProblem(rawText) {
  const text = normalizeText(rawText);

  // Analisis soal permutasi dan kombinasi
const advancedResult =
  analyzeAdvancedProblem(text);

if (advancedResult) {
  return advancedResult;
}


// Analisis peluang bersyarat
const conditionalResult =
  analyzeConditionalProblem(text);

if (conditionalResult) {
  return conditionalResult;
}

  if (!text) {
    return {
      error: 'Masukkan soal terlebih dahulu.'
    };
  }

  if (text.includes('dadu')) {
    const twoDice =
      /\bdua\s+(?:buah\s+)?dadu\b/.test(text) ||
      /\b2\s+(?:buah\s+)?dadu\b/.test(text) ||
      /\bkedua\s+dadu\b/.test(text);

    const result = twoDice
      ? solveTwoDice(text)
      : solveSingleDie(text);

    return result || {
      error:
        'Soal dadu belum dapat dikenali. Gunakan pertanyaan tentang jumlah dua dadu, angka tertentu, ganjil, atau genap.'
    };
  }

  if (text.includes('bola')) {
    return solveBalls(text) || {
      error:
        'Informasi bola belum lengkap. Cantumkan jumlah bola merah, biru, kuning, dan warna yang ingin dicari.'
    };
  }

  if (text.includes('kartu')) {
    return solveCard(text) || {
      error:
        'Jenis kartu belum dikenali. Coba gunakan kartu merah, hitam, As, sekop, atau kartu bergambar.'
    };
  }

  if (text.includes('koin')) {
    return solveCoin(text) || {
      error:
        'Soal koin belum dikenali. Coba tanyakan peluang muncul sisi angka atau gambar dari satu koin.'
    };
  }

  return {
    error:
      'Jenis soal belum dikenali. Prototipe ini mendukung soal dadu, koin, kartu remi, dan pengambilan bola dengan pola tertentu.'
  };
}

/* ==========================================
   THREE.JS SOLVER VISUALIZATION
========================================== */

let scene;
let camera;
let renderer;
let controls;
let visualizationGroup;
let animationFrame;
let resizeObserver;
let unsubscribeTheme;

function createTexture(label, background, foreground) {
  const canvas = document.createElement('canvas');

  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = foreground;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 190px Arial';

  ctx.fillText(label, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createDie(number) {
  const layouts = {
    1: [[256, 256]],
    2: [[130, 130], [382, 382]],
    3: [[130, 130], [256, 256], [382, 382]],
    4: [[130, 130], [382, 130], [130, 382], [382, 382]],
    5: [[130, 130], [382, 130], [256, 256], [130, 382], [382, 382]],
    6: [[130, 110], [382, 110], [130, 256], [382, 256], [130, 402], [382, 402]]
  };

  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = 512;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f6f3e9';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#172a42';

  for (const [x, y] of layouts[number]) {
    ctx.beginPath();
    ctx.arc(x, y, 43, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function makeDie() {
  const materials = [1, 2, 3, 4, 5, 6].map(
    (number) =>
      new THREE.MeshStandardMaterial({
        map: createDie(number),
        roughness: 0.45
      })
  );

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    materials
  );

  mesh.castShadow = true;

  return mesh;
}

function clearVisualization() {
  if (!visualizationGroup) return;

  scene.remove(visualizationGroup);

  visualizationGroup.traverse((object) => {
    object.geometry?.dispose();

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.filter(Boolean).forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
  });

  visualizationGroup = null;
}

function addDice() {
  const group = new THREE.Group();

  const first = makeDie();
  first.position.x = -0.6;
  first.rotation.set(0.4, 0.5, 0.2);

  const second = makeDie();
  second.position.x = 0.6;
  second.rotation.set(0.7, 0.2, 0.5);

  group.add(first, second);

  return group;
}

function addSingleDie() {
  const die = makeDie();

  die.scale.setScalar(1.2);
  die.rotation.set(0.5, 0.5, 0.3);

  return die;
}

function addCoin() {
  const edge = new THREE.MeshStandardMaterial({
    color: 0xc58a2a,
    metalness: 0.85,
    roughness: 0.25
  });

  const front = new THREE.MeshStandardMaterial({
    map: createTexture('1', '#f7df9c', '#74420e'),
    metalness: 0.6
  });

  const back = new THREE.MeshStandardMaterial({
    map: createTexture('★', '#eed08b', '#70420f'),
    metalness: 0.6
  });

  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.75, 0.75, 0.13, 64
    ),
    [edge, front, back]
  );

  coin.rotation.x = Math.PI / 2;

  return coin;
}

function addCards() {
  const group = new THREE.Group();

  const back = createTexture('#', '#17365b', '#d9c58e');
  const front = createTexture('A', '#fffaf0', '#bd3547');

  for (let i = 0; i < 5; i++) {
    const materials = [
      new THREE.MeshStandardMaterial({ color: '#e7ddc9' }),
      new THREE.MeshStandardMaterial({ color: '#e7ddc9' }),
      new THREE.MeshStandardMaterial({ color: '#e7ddc9' }),
      new THREE.MeshStandardMaterial({ color: '#e7ddc9' }),
      new THREE.MeshStandardMaterial({ map: front }),
      new THREE.MeshStandardMaterial({ map: back })
    ];

    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1, 0.035),
      materials
    );

    card.position.x = i * 0.08 - 0.15;
    card.position.y = i * 0.025;
    card.rotation.y = -0.15 + i * 0.08;

    group.add(card);
  }

  return group;
}


function addCounting(problem) {
  const group = new THREE.Group();

  const total = Math.min(problem.n, 12);

  const selected = Math.min(problem.r, total);

  for (let i = 0; i < total; i++) {

    const material = new THREE.MeshStandardMaterial({
      color: i < selected ? '#42c995' : '#398bd5',
      roughness: 0.35
    });

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12, 0.17, 0.55, 20
      ),
      material
    );

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.17, 20, 16
      ),
      new THREE.MeshStandardMaterial({
        color: i < selected ? '#8aebc1' : '#8fc9ff'
      })
    );

    const x = (i - (total - 1) / 2) * 0.42;

    body.position.set(x, -0.12, 0);

    head.position.set(x, 0.27, 0);

    group.add(body, head);
  }

  return group;
}


function addBalls(problem) {

  const group = new THREE.Group();

  const colors = {
    merah: '#e75059',
    biru: '#368ce8',
    kuning: '#f2c94c'
  };

  const counts = problem.counts || {
    merah: 5,
    biru: 3,
    kuning: 2
  };

  // Wadah transparan
  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.15, 1.15, 2.15, 48, 1, true
    ),
    new THREE.MeshPhysicalMaterial({
      color: '#8bbbf0',
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );

  group.add(glass);

  let index = 0;

  for (const [color, amount] of Object.entries(counts)) {
    for (let i = 0; i < amount; i++) {
      const angle = index * 2.399;
      const layer = Math.floor(index / 5);

      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 24),
        new THREE.MeshStandardMaterial({
          color: colors[color],
          roughness: 0.25,
          metalness: 0.04
        })
      );

      const radius = 0.35 + (index % 3) * 0.13;

      ball.position.set(
        Math.cos(angle) * radius,
        -0.65 + layer * 0.37,
        Math.sin(angle) * radius
      );

      // Simpan informasi setiap bola
      ball.userData.ballColor = color;
      ball.userData.originalPosition = ball.position.clone();
      ball.userData.isBall = true;

      ball.castShadow = true;

      group.add(ball);

      index++;
    }
  }

  return group;
}


/* ==========================================
   3D VENN DIAGRAM VISUALIZATION
========================================== */


function addVenn(problem) {

  const group = new THREE.Group();

  const regions = problem.regions;

  // MATERIAL DUA LINGKARAN
  const materialA = new THREE.MeshBasicMaterial({
    color: 0x348be0,
    transparent: true,
    opacity: 0.58,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const materialB = new THREE.MeshBasicMaterial({
    color: 0x20b889,
    transparent: true,
    opacity: 0.58,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  // MEMBUAT LINGKARAN
  function createCircle(x, material, borderColor) {

    const circle = new THREE.Mesh(
      new THREE.CircleGeometry(1.15, 96),
      material
    );

    circle.position.set(x, 0, 0);

    group.add(circle);

    const border = new THREE.Mesh(
      new THREE.TorusGeometry(
        1.15,
        0.025,
        12,
        96
      ),
      new THREE.MeshBasicMaterial({
        color: borderColor
      })
    );

    border.position.set(x, 0, 0.04);

    group.add(border);
  }

  createCircle(-0.55, materialA, 0x65b6ff);
  createCircle(0.55, materialB, 0x55e0b0);

  // MEMBUAT LABEL JUMLAH WILAYAH
  function createLabel(title, value, x, y) {

    const canvas = document.createElement('canvas');

    canvas.width = 512;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#10243c';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#78baff';
    ctx.lineWidth = 6;
    ctx.strokeRect(5, 5, 502, 246);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#b7d9fa';
    ctx.font = 'bold 39px Arial';
    ctx.fillText(title, 256, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 85px Arial';
    ctx.fillText(String(value), 256, 174);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.76, 0.38),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
        depthTest: false
      })
    );

    label.position.set(x, y, 0.12);
    label.renderOrder = 10;

    group.add(label);
  }

  // A SAJA
  createLabel(
    `${problem.eventA} saja`,
    regions.aOnly,
    -1.05,
    0
  );

  // IRISAN A DAN B
  createLabel(
    'Keduanya',
    regions.intersection,
    0,
    0.04
  );

  // B SAJA
  createLabel(
    `${problem.eventB} saja`,
    regions.bOnly,
    1.05,
    0
  );

  // TIDAK KEDUANYA
  createLabel(
    'Di luar A dan B',
    regions.neither,
    0,
    -1.43
  );

  // POSISI KAMERA AGAR DIAGRAM TERLIHAT JELAS
  camera.position.set(0, 0.2, 5.5);

  camera.lookAt(0, 0, 0);

  return group;
}



function showVisualization(problem) {

  // Bersihkan visualisasi sebelumnya
  clearVisualization();

  // Daftar seluruh mesin visualisasi
  const builders = {

    dice: addDice,

    'dice-single': addSingleDie,

    coin: addCoin,

    cards: addCards,

    balls: addBalls,

    counting: addCounting,

    conditional: addVenn

  };

  // Ambil mesin sesuai jenis soal
  const builder = builders[problem.model];

  // Jika jenis visualisasi belum tersedia
  if (typeof builder !== 'function') {

    ui.visualDescription.textContent =
      'Visualisasi untuk jenis soal ini belum tersedia.';

    return;
  }

  try {

    // PENTING:
    // Kirim data soal ke seluruh fungsi visualisasi.
    // Ini memperbaiki objek counting, conditional, dan balls.

    visualizationGroup = builder(problem);

    // Masukkan objek ke dalam scene
    scene.add(visualizationGroup);

    // Tampilkan penjelasan visual
    ui.visualDescription.textContent =
      problem.description;

  } catch (error) {

    console.error(
      'Gagal membuat visualisasi 3D:',
      error
    );

    ui.visualDescription.textContent =
      'Visualisasi gagal dibuat. Periksa Console browser untuk detail error.';

  }
}


/* ==========================================
   INTERACTIVE BALL DRAW ENGINE
========================================== */

let ballLearningPanel = null;
let ballTrials = 0;
let ballSuccesses = 0;
let ballAnimating = false;

let ballAnimationFrame = null;

function setupBallLearning(problem) {

  // Hapus panel sebelumnya
  if (ballLearningPanel) {
    ballLearningPanel.remove();
    ballLearningPanel = null;
  }

  if (problem.model !== 'balls') return;

  ballTrials = 0;
  ballSuccesses = 0;
  ballAnimating = false;

  const target = problem.target;

  const panel = document.createElement('div');
  panel.dataset.target = target;

  panel.className = 'ball-learning-panel';

  panel.innerHTML = `
    <div class="ball-learning-heading">
      <span>INTERACTIVE EXPERIMENT</span>
      <h3>🎯 Coba ambil bola sendiri!</h3>
      <p>
        Tekan tombol untuk mengambil satu bola secara acak
        dari dalam wadah.
      </p>
    </div>

    <div class="ball-learning-stats">

      <div>
        <span>Total percobaan</span>
        <strong id="ball-trials">0</strong>
      </div>

      <div>
        <span>Berhasil mendapat ${target}</span>
        <strong id="ball-successes">0</strong>
      </div>

      <div>
        <span>Frekuensi relatif</span>
        <strong id="ball-frequency">0%</strong>
      </div>

    </div>

    <button
      type="button"
      class="ball-draw-button"
      id="ball-draw-button"
    >
      🎲 Ambil bola secara acak
    </button>

    <button
      type="button"
      class="ball-reset-button"
      id="ball-reset-button"
    >
      ↻ Ulangi percobaan
    </button>

    <div
      id="ball-draw-result"
      class="ball-draw-result"
      aria-live="polite"
    >
      Belum ada percobaan. Yuk, mulai!
    </div>

    <div class="ball-learning-explanation">

      <h4>🧠 Mengapa hasilnya demikian?</h4>

      <p id="ball-explanation">
        Di dalam wadah terdapat
        ${problem.total} kemungkinan bola.
        Ada ${problem.favorable} bola yang menjadi
        kejadian yang kita cari.
      </p>

      <div class="ball-formula">
        P(A) = ${problem.favorable}/${problem.total}
        = ${problem.percentage.toFixed(2)}%
      </div>

      <small>
        Setiap percobaan mengembalikan bola ke wadah
        sebelum percobaan selanjutnya.
      </small>

    </div>
  `;

  ui.scene.insertAdjacentElement('afterend', panel);

  ballLearningPanel = panel;

  const drawButton = panel.querySelector('#ball-draw-button');
  const resetButton = panel.querySelector('#ball-reset-button');

  drawButton.addEventListener('click', () => {
    performBallDraw(problem);
  });

  resetButton.addEventListener('click', () => {
    resetBallExperiment();
    updateBallStatistics();
  });
}

function performBallDraw(problem) {

  if (ballAnimating || !visualizationGroup) return;

  const balls = visualizationGroup.children.filter(
    object => object.userData.isBall
  );

  if (!balls.length) return;

  ballAnimating = true;

  const button = ballLearningPanel.querySelector(
    '#ball-draw-button'
  );

  const result = ballLearningPanel.querySelector(
    '#ball-draw-result'
  );

  button.disabled = true;

  // Pilih satu bola secara acak
  const randomIndex = Math.floor(
    Math.random() * balls.length
  );

  const selectedBall = balls[randomIndex];

  const selectedColor = selectedBall.userData.ballColor;

  const originalPosition =
    selectedBall.userData.originalPosition.clone();

  const isSuccess = selectedColor === problem.target;

  // Hitung percobaan
  ballTrials++;

  if (isSuccess) {
    ballSuccesses++;
  }

  result.textContent = isSuccess
    ? `🎉 Berhasil! Kamu mendapatkan bola ${selectedColor}.`
    : `Bola yang terambil adalah ${selectedColor}. Belum sesuai dengan target ${problem.target}.`;

  // Posisi tujuan animasi
  const startPosition = selectedBall.position.clone();

  const endPosition = startPosition.clone();

  endPosition.y += 2.2;
  endPosition.x += 1.5;

  const duration = 700;
  const startTime = performance.now();

  function animateDraw(now) {

    const progress = Math.min(
      (now - startTime) / duration,
      1
    );

    // Gerakan halus
    const eased = 1 - Math.pow(1 - progress, 3);

    selectedBall.position.lerpVectors(
      startPosition,
      endPosition,
      eased
    );

    selectedBall.scale.setScalar(
      1 + Math.sin(progress * Math.PI) * 0.35
    );

    if (progress < 1) {

      ballAnimationFrame =
        requestAnimationFrame(animateDraw);

    } else {

      // Kembalikan bola ke posisi awal
      selectedBall.position.copy(originalPosition);

      selectedBall.scale.setScalar(1);

      ballAnimating = false;

      button.disabled = false;

      updateBallStatistics();
    }
  }

  ballAnimationFrame =
    requestAnimationFrame(animateDraw);

  updateBallStatistics();
}

function updateBallStatistics() {

  if (!ballLearningPanel) return;

  const percentage = ballTrials > 0
    ? (ballSuccesses / ballTrials) * 100
    : 0;

  ballLearningPanel.querySelector(
    '#ball-trials'
  ).textContent = ballTrials;

  ballLearningPanel.querySelector(
    '#ball-successes'
  ).textContent = ballSuccesses;

  ballLearningPanel.querySelector(
    '#ball-frequency'
  ).textContent = percentage.toFixed(2) + '%';

  const explanation = ballLearningPanel.querySelector(
    '#ball-explanation'
  );

  if (ballTrials === 0) {
    explanation.textContent =
      'Belum ada percobaan. Cobalah mengambil bola untuk melihat bagaimana hasil peluang bekerja.';
    return;
  }

  explanation.textContent =
    `Dari ${ballTrials} percobaan, kamu mendapatkan ` +
    `${ballSuccesses} bola ${problemTargetColor()}. ` +
    `Frekuensi relatifnya adalah ${ballSuccesses}/${ballTrials} ` +
    `atau ${percentage.toFixed(2)}%.`;
}

function problemTargetColor() {
  return ballLearningPanel?.dataset.target || 'merah';
}

function resetBallExperiment() {

  cancelAnimationFrame(ballAnimationFrame);

  ballAnimating = false;

  ballTrials = 0;
  ballSuccesses = 0;

  if (!visualizationGroup) return;

  visualizationGroup.children.forEach(object => {

    if (!object.userData.isBall) return;

    object.position.copy(
      object.userData.originalPosition
    );

    object.scale.setScalar(1);
  });

  const button = ballLearningPanel?.querySelector(
    '#ball-draw-button'
  );

  if (button) button.disabled = false;

  const result = ballLearningPanel?.querySelector(
    '#ball-draw-result'
  );

  if (result) {
    result.textContent =
      'Percobaan direset. Silakan mulai kembali!';
  }
}


/* ==========================================
   SAMPLE SPACE RENDERING
========================================== */

function renderSamples(problem) {
  ui.sample.replaceChildren();

  for (const item of problem.sample) {
    const chip = document.createElement('span');

    chip.className =
      `solver-sample-item${item.favorable ? ' favorable' : ''}`;

    if (problem.model === 'dice') {
      chip.textContent =
        `${item.first}+${item.second}`;

      chip.title = `Jumlah ${item.sum}`;
    } else {
      chip.textContent = item.value;
    }

    ui.sample.appendChild(chip);
  }
}

/* ==========================================
   SHOW SOLUTION
========================================== */

function showSolution(problem) {
  ui.output.hidden = false;

if (problem.kind === 'counting') {

  ui.answer.textContent =
    problem.answerValue;

  ui.percentage.textContent =
    `${problem.answerLabel} yang mungkin`;

  ui.fraction.textContent =
    `${problem.formula} = ${problem.answerValue}`;

} else {

  ui.answer.textContent =
    problem.fraction;

  ui.percentage.textContent =
    `${problem.percentage.toFixed(2)}%`;

  ui.fraction.textContent =
    `${problem.favorable}/${problem.total} = ${problem.fraction}`;
}

  ui.steps.replaceChildren();

  problem.steps.forEach((step) => {
    const li = document.createElement('li');

    li.textContent = step;

    ui.steps.appendChild(li);
  });

  ui.summary.textContent =
    problem.summary;

  renderSamples(problem);

  showVisualization(problem);

  // Kirim hasil analisis ke Step-by-Step Learning Engine
window.dispatchEvent(
  new CustomEvent('probability:solution-ready', {
    detail: problem
  })
);

  ui.output.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/* ==========================================
   INITIALIZE THREE.JS
========================================== */

function initializeScene() {
  if (!ui.scene) return;

  try {
    scene = new THREE.Scene();

    const themeColors = getSceneThemeColors();
    scene.background =
      new THREE.Color(themeColors.background || '#edf7ef');

    camera = new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      100
    );

    camera.position.set(3, 2.5, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    ui.scene.appendChild(renderer.domElement);

    controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 9;

    scene.add(
      new THREE.HemisphereLight(
        0xf4fff6,
        0x829584,
        2.3
      )
    );

    const light = new THREE.DirectionalLight(
      0xffffff,
      3
    );

    light.position.set(4, 5, 5);

    scene.add(light);

    const platformMaterial = new THREE.MeshStandardMaterial({
      color: themeColors.platform || 0xc6decc,
      roughness: 0.6
    });
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(
        1.6, 1.6, 0.1, 48
      ),
      platformMaterial
    );

    platform.position.y = -1.05;

    scene.add(platform);
    unsubscribeTheme = subscribeToThemeChange((theme, colors) => {
      scene.background.set(colors.background);
      platformMaterial.color.set(colors.platform);
    });

    resizeScene();

    resizeObserver = new ResizeObserver(resizeScene);

    resizeObserver.observe(ui.scene);

    function render() {
      animationFrame =
        requestAnimationFrame(render);

      if (visualizationGroup) {
        visualizationGroup.rotation.y += 0.0015;
      }

      controls.update();

      renderer.render(scene, camera);
    }

    render();

  } catch (error) {
    console.error('Solver 3D initialization error:', error);

    ui.visualDescription.textContent =
      'Visualisasi 3D tidak dapat dijalankan. Periksa dukungan WebGL di browser.';
  }
}

function resizeScene() {
  if (!renderer || !camera || !ui.scene) return;

  const width = Math.max(ui.scene.clientWidth, 280);
  const height = Math.max(ui.scene.clientHeight, 220);

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);
}

/* ==========================================
   RUN ANALYSIS
========================================== */

function runAnalysis() {
  const rawText = ui.question.value;

  ui.status.classList.remove('error');

  const problem = analyzeProblem(rawText);

  if (problem.error) {
    ui.output.hidden = true;

    ui.status.textContent = problem.error;

    ui.status.classList.add('error');

    return;
  }

  ui.status.textContent =
    'Analisis berhasil. Hasil perhitungan dan visualisasi telah dibuat.';

  showSolution(problem);
}

/* ==========================================
   EXAMPLE BUTTONS
========================================== */

document.querySelectorAll(
  '[data-solver-example]'
).forEach((button) => {
  button.addEventListener('click', () => {
    ui.question.value =
      button.dataset.solverExample;

    runAnalysis();
  });
});

/* ==========================================
   SUBMIT
========================================== */

ui.submit.addEventListener(
  'click',
  runAnalysis
);

ui.question.addEventListener(
  'keydown',
  (event) => {
    if (
      event.key === 'Enter' &&
      (event.ctrlKey || event.metaKey)
    ) {
      runAnalysis();
    }
  }
);

/* ==========================================
   INITIALIZATION
========================================== */

initializeScene();

window.addEventListener(
  'pagehide',
  () => {
    cancelAnimationFrame(animationFrame);

    resizeObserver?.disconnect();
    unsubscribeTheme?.();

    controls?.dispose();

    clearVisualization();

    renderer?.dispose();
  },
  { once: true }
);
