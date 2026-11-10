
import * as THREE from 'three';
import { OrbitControls } from
  'three/addons/controls/OrbitControls.js';

/* ======================================
   PLAYING CARD PROBABILITY LAB
====================================== */

const $ = (id) => document.getElementById(id);

const SUITS = [
  { name: 'hearts',   symbol: '♥', label: 'HATI',     red: true  },
  { name: 'diamonds', symbol: '♦', label: 'WAJIK',    red: true  },
  { name: 'clubs',    symbol: '♣', label: 'KERITING', red: false },
  { name: 'spades',   symbol: '♠', label: 'SEKOP',    red: false }
];

const RANKS = [
  'A', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K'
];

const EVENTS = {
  red:   { label: 'Kartu merah',     favorable: 26 },
  black: { label: 'Kartu hitam',     favorable: 26 },
  ace:   { label: 'Kartu As',        favorable: 4  },
  face:  { label: 'Kartu bergambar', favorable: 12 },
  spade: { label: 'Kartu sekop',     favorable: 13 }
};

/* ======================================
   MATH HELPERS
====================================== */

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifyFraction(num, den) {
  if (den === 0 || num === 0) return `${num}/${den}`;
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num / g}/${den / g}`;
}

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

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function isFavorable(card, event) {
  switch (event) {
    case 'red':   return card.red;
    case 'black': return !card.red;
    case 'ace':   return card.rank === 'A';
    case 'face':  return ['J', 'Q', 'K'].includes(card.rank);
    case 'spade': return card.suit === 'spades';
    default:      return false;
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
    host:      $('cards-scene'),
    draw:      $('draw-card'),
    reset:     $('reset-cards'),
    event:     $('card-event'),
    status:    $('cards-status'),
    total:     $('cards-total'),
    remaining: $('cards-remaining'),
    hits:      $('cards-hits'),
    theory:    $('cards-theory'),
    last:      $('cards-last'),
    rate:      $('cards-hit-rate'),
    bar:       $('cards-hit-bar'),
    insight:   $('cards-insight')
  };

  if (Object.values(ui).some((element) => !element)) {
    console.warn('Cards Lab: elemen HTML belum lengkap.');
    return;
  }

  let deck = createDeck();
  let drawnCards = [];
  let flip = null;
  let animationFrame = null;

  /* LIVE PROBABILITY STATE */
  let liveHistory = [];
  let preDrawInfo = null;
  let liveUI = null;

  /* ======================================
     THREE.JS SCENE
  ====================================== */

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b1424');

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.5, 6.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  ui.host.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 9;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xe5efff, 0x34415b, 2));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 5);
  scene.add(light);

  const blueLight = new THREE.PointLight(0x438fff, 20, 10);
  blueLight.position.set(-3, 1, -2);
  scene.add(blueLight);

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.15, 3),
    new THREE.MeshStandardMaterial({ color: 0x173052, roughness: 0.55 })
  );
  table.position.y = -1.25;
  scene.add(table);

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7c69f, roughness: 0.55
  });
  const backMaterial = new THREE.MeshStandardMaterial({
    map: createBackTexture(), roughness: 0.5
  });
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: createFrontTexture({ rank: 'A', symbol: '♥', red: true }),
    roughness: 0.6
  });

  const cardGeometry = new THREE.BoxGeometry(1.5, 2.1, 0.045);
  const cardMesh = new THREE.Mesh(cardGeometry, [
    edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial,
    frontMaterial, backMaterial
  ]);

  const cardRoot = new THREE.Group();
  cardRoot.add(cardMesh);
  cardRoot.position.set(-1.1, -0.03, 0.25);
  cardRoot.rotation.y = Math.PI;
  scene.add(cardRoot);

  const deckGeometry = new THREE.BoxGeometry(1.5, 2.1, 0.16);
  const deckMesh = new THREE.Mesh(deckGeometry, [
    edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial,
    backMaterial, backMaterial
  ]);

  const deckGroup = new THREE.Group();
  deckGroup.add(deckMesh);
  deckGroup.position.set(-1.1, -0.03, -0.12);
  scene.add(deckGroup);

  /* ======================================
     LIVE PROBABILITY PANEL
  ====================================== */

  function buildLivePanel() {
    const panel = document.createElement('div');
    panel.className = 'live-prob-panel';
    panel.id = 'cards-live-panel';

    panel.innerHTML = `
      <div class="live-prob-header">
        <div class="live-prob-header-left">
          <span class="live-prob-kicker">PERHITUNGAN KONDISIONAL</span>
          <p class="live-prob-title">Peluang berubah setiap pengambilan</p>
        </div>
        <span class="live-prob-badge">AUTO UPDATE</span>
      </div>
      <div class="live-prob-body">

        <div class="live-prob-current">
          <div class="live-prob-box highlight">
            <span class="live-prob-box-label">PELUANG PENGAMBILAN BERIKUTNYA</span>
            <span class="live-prob-box-value" id="lpc-current-pct">-</span>
            <span class="live-prob-box-sub" id="lpc-current-fraction">-</span>
          </div>
          <div class="live-prob-box success-box">
            <span class="live-prob-box-label">KARTU SESUAI TERSISA</span>
            <span class="live-prob-box-value" id="lpc-favorable">-</span>
            <span class="live-prob-box-sub" id="lpc-remaining-text">-</span>
          </div>
        </div>

        <div class="live-prob-formula">
          <span class="live-prob-formula-label">RUMUS KONDISIONAL SAAT INI</span>
          <span class="live-prob-formula-expr" id="lpc-formula-expr">-</span>
          <span class="live-prob-formula-result" id="lpc-formula-result">-</span>
        </div>

        <div class="live-prob-compare">
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Peluang awal (teori)</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill theoretical" id="lpc-bar-theory" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpc-pct-theory">-</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Peluang kondisional</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill conditional" id="lpc-bar-cond" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpc-pct-cond">-</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Frekuensi percobaan</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill empirical" id="lpc-bar-emp" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpc-pct-emp">-</span>
          </div>
        </div>

        <div class="live-prob-history">
          <div class="live-prob-history-title">
            RIWAYAT PENGAMBILAN — peluang ditampilkan sebelum kartu diambil
          </div>
          <div class="live-prob-log" id="lpc-log">
            <div class="live-prob-empty">
              Belum ada pengambilan. Ambil kartu untuk melihat perhitungan kondisional.
            </div>
          </div>
        </div>

      </div>
    `;

    const statsCard = document.querySelector('.cards-stats-card');
    if (statsCard) statsCard.appendChild(panel);

    return {
      currentPct:     document.getElementById('lpc-current-pct'),
      currentFrac:    document.getElementById('lpc-current-fraction'),
      favorableCount: document.getElementById('lpc-favorable'),
      remainingText:  document.getElementById('lpc-remaining-text'),
      formulaExpr:    document.getElementById('lpc-formula-expr'),
      formulaResult:  document.getElementById('lpc-formula-result'),
      barTheory:      document.getElementById('lpc-bar-theory'),
      pctTheory:      document.getElementById('lpc-pct-theory'),
      barCond:        document.getElementById('lpc-bar-cond'),
      pctCond:        document.getElementById('lpc-pct-cond'),
      barEmp:         document.getElementById('lpc-bar-emp'),
      pctEmp:         document.getElementById('lpc-pct-emp'),
      log:            document.getElementById('lpc-log')
    };
  }

  function updateLivePanel() {
    if (!liveUI) return;

    const selectedEvent = ui.event.value;
    const eventInfo = EVENTS[selectedEvent];

    const remainingTotal     = deck.length;
    const remainingFavorable = deck.filter(
      (c) => isFavorable(c, selectedEvent)
    ).length;

    const totalDrawn     = drawnCards.length;
    const favorableDrawn = drawnCards.filter(
      (c) => isFavorable(c, selectedEvent)
    ).length;

    const theoreticalPct = (eventInfo.favorable / 52) * 100;
    const conditionalPct = remainingTotal > 0
      ? (remainingFavorable / remainingTotal) * 100 : 0;
    const empiricalPct = totalDrawn > 0
      ? (favorableDrawn / totalDrawn) * 100 : 0;

    /* Current state boxes */
    if (remainingTotal > 0) {
      liveUI.currentPct.textContent =
        `${conditionalPct.toFixed(2)}%`;
      liveUI.currentFrac.textContent =
        `${simplifyFraction(remainingFavorable, remainingTotal)} kartu`;
    } else {
      liveUI.currentPct.textContent = '0%';
      liveUI.currentFrac.textContent = 'Semua kartu sudah diambil';
    }

    liveUI.favorableCount.textContent = remainingFavorable;
    liveUI.remainingText.textContent =
      `dari ${remainingTotal} kartu tersisa`;

    /* Formula */
    liveUI.formulaExpr.textContent =
      `P(${eventInfo.label}) = ${remainingFavorable} / ${remainingTotal}`;
    liveUI.formulaResult.textContent = remainingTotal > 0
      ? `= ${simplifyFraction(remainingFavorable, remainingTotal)} ≈ ${conditionalPct.toFixed(2)}%`
      : '= 0%';

    /* Comparison bars */
    liveUI.barTheory.style.width = `${theoreticalPct}%`;
    liveUI.pctTheory.textContent = `${theoreticalPct.toFixed(2)}%`;

    liveUI.barCond.style.width = `${conditionalPct}%`;
    liveUI.pctCond.textContent = `${conditionalPct.toFixed(2)}%`;

    liveUI.barEmp.style.width = `${empiricalPct}%`;
    liveUI.pctEmp.textContent =
      totalDrawn > 0 ? `${empiricalPct.toFixed(2)}%` : '-';

    /* History log */
    if (liveHistory.length === 0) {
      liveUI.log.innerHTML =
        '<div class="live-prob-empty">Belum ada pengambilan. Ambil kartu untuk melihat perhitungan kondisional.</div>';
      return;
    }

    liveUI.log.innerHTML = '';

    /* Newest draw at top */
    for (let i = liveHistory.length - 1; i >= 0; i--) {
      const e = liveHistory[i];
      const row = document.createElement('div');
      row.className =
        `live-prob-log-entry${e.isHit ? ' is-hit' : ''}`;
      row.innerHTML = `
        <span class="log-num">${e.num}</span>
        <span class="log-result${e.isHit ? ' hit' : ''}">
          ${e.card}${e.isHit ? ' ✓' : ''}
        </span>
        <span class="log-formula">
          ${e.favorableBefore}/${e.totalBefore}
        </span>
        <span class="log-pct${e.isHit ? ' hit' : ''}">
          ${e.pctBefore.toFixed(2)}%
        </span>
      `;
      liveUI.log.appendChild(row);
    }
  }

  /* ======================================
     STATISTIK
  ====================================== */

  function updateStats() {
    const selectedEvent = ui.event.value;
    const eventInfo = EVENTS[selectedEvent];
    const totalDrawn = drawnCards.length;

    const favorable = drawnCards.filter(
      (card) => isFavorable(card, selectedEvent)
    ).length;

    const empiricalRate = totalDrawn
      ? (favorable / totalDrawn) * 100 : 0;

    const theoreticalRate = (eventInfo.favorable / 52) * 100;

    ui.total.textContent = totalDrawn;
    ui.remaining.textContent = deck.length;
    ui.hits.textContent = favorable;
    ui.theory.textContent = `${theoreticalRate.toFixed(2)}%`;
    ui.rate.textContent   = `${empiricalRate.toFixed(2)}%`;
    ui.bar.style.width    = `${empiricalRate}%`;

    if (totalDrawn === 0) {
      ui.insight.textContent =
        `Dalam satu dek terdapat ${eventInfo.favorable} ${eventInfo.label.toLowerCase()} dari 52 kartu. Mulai mengambil kartu untuk melihat hasil eksperimen.`;
    } else {
      const diff = Math.abs(empiricalRate - theoreticalRate);
      ui.insight.textContent =
        `Dari ${totalDrawn} kartu yang diambil, ${favorable} merupakan ${eventInfo.label.toLowerCase()}. Frekuensi percobaan ${empiricalRate.toFixed(2)}%, peluang teoritis awal ${theoreticalRate.toFixed(2)}%. Selisihnya ${diff.toFixed(2)} poin persentase.`;
    }

    deckGroup.scale.z = Math.max(0.15, deck.length / 52);
    ui.draw.disabled  = deck.length === 0 || Boolean(flip);
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

    /* Capture conditional probability BEFORE this draw */
    const eventKey       = ui.event.value;
    const totalBefore    = deck.length;
    const favorableBefore = deck.filter(
      (c) => isFavorable(c, eventKey)
    ).length;

    preDrawInfo = { totalBefore, favorableBefore, eventKey };

    /* Existing draw logic */
    const selectedCard = deck.pop();
    drawnCards.push(selectedCard);

    const newTexture = createFrontTexture(selectedCard);
    frontMaterial.map?.dispose();
    frontMaterial.map = newTexture;
    frontMaterial.needsUpdate = true;

    cardRoot.position.set(-1.1, -0.03, 0.25);
    cardRoot.rotation.set(0, Math.PI, 0);

    flip = {
      card:          selectedCard,
      start:         performance.now(),
      duration:      1700,
      startY:        -0.03,
      startX:        -1.1,
      startRotation: Math.PI,
      spins:         2
    };

    ui.draw.disabled  = true;
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
    liveHistory = [];
    preDrawInfo = null;

    cardRoot.rotation.set(0, Math.PI, 0);
    cardRoot.position.set(-1.1, -0.03, 0.25);

    ui.last.textContent = 'Belum ada';
    ui.status.textContent =
      'Dek telah diacak ulang. Silakan mulai eksperimen.';

    updateStats();
    if (liveUI) updateLivePanel();
  }

  /* ======================================
     SELESAI BALIK KARTU
  ====================================== */

  function finishFlip(card) {
    cardRoot.position.set(0.85, -0.03, 0.25);
    cardRoot.rotation.set(0, Math.PI * 6, 0);

    ui.last.textContent = `${card.rank} ${card.symbol}`;
    ui.status.textContent =
      `Kamu mendapatkan ${card.rank} ${card.label}. Kartu ini telah dikeluarkan dari dek dan tidak akan muncul lagi dalam eksperimen ini.`;

    /* Log this draw with pre-draw probability */
    if (preDrawInfo) {
      const isHit = isFavorable(card, preDrawInfo.eventKey);
      liveHistory.push({
        num:             liveHistory.length + 1,
        card:            `${card.rank}${card.symbol}`,
        isHit,
        totalBefore:     preDrawInfo.totalBefore,
        favorableBefore: preDrawInfo.favorableBefore,
        pctBefore:
          (preDrawInfo.favorableBefore / preDrawInfo.totalBefore) * 100
      });
      preDrawInfo = null;
    }

    flip = null;
    updateStats();
    if (liveUI) updateLivePanel();
  }

  /* ======================================
     ANIMASI
  ====================================== */

  function resize() {
    const width  = Math.max(ui.host.clientWidth,  280);
    const height = Math.max(ui.host.clientHeight, 260);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function animate() {
    animationFrame = requestAnimationFrame(animate);

    if (flip) {
      const progress = Math.min(
        (performance.now() - flip.start) / flip.duration, 1
      );
      const ease = 1 - Math.pow(1 - progress, 3);

      cardRoot.position.x = flip.startX + (0.85 - flip.startX) * ease;
      cardRoot.position.y = flip.startY + Math.sin(progress * Math.PI) * 0.85;
      cardRoot.rotation.y =
        flip.startRotation + (Math.PI + flip.spins * Math.PI * 2) * ease;
      cardRoot.rotation.z = Math.sin(progress * Math.PI * 2) * 0.16;

      if (progress >= 1) finishFlip(flip.card);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  /* ======================================
     EVENT LISTENERS
  ====================================== */

  ui.draw.addEventListener('click', drawCard);
  ui.reset.addEventListener('click', resetCards);

  /* When event type changes, recalculate — history is still valid
     (it was recorded with that draw's specific event context),
     but the CURRENT panel needs updating with new event counts */
  ui.event.addEventListener('change', () => {
    liveHistory = [];
    preDrawInfo = null;
    updateStats();
    if (liveUI) updateLivePanel();
  });

  window.addEventListener('resize', resize);

  /* ======================================
     START
  ====================================== */

  resize();
  updateStats();
  animate();

  /* Build live panel after animation starts */
  liveUI = buildLivePanel();
  updateLivePanel();

  /* ======================================
     CLEANUP
  ====================================== */

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
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
  }, { once: true });
}

/* ======================================
   BOOT
====================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startCardsLab, { once: true });
} else {
  startCardsLab();
}
