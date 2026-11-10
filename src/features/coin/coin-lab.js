
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { observeRendererSize } from '../../utils/visualization/observe-renderer-size.js';
import { getSceneThemeColors, subscribeToThemeChange } from '../../app/theme.js';

const $ = (id) => document.getElementById(id);

/* ======================================
   MATH HELPERS
====================================== */

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifyFraction(num, den) {
  if (den === 0) return '-';
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num / g}/${den / g}`;
}

function faceTexture(label, symbol) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

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
    host:      $('coin-scene'),
    flip:      $('flip-coin'),
    reset:     $('reset-coin'),
    status:    $('coin-status'),
    total:     $('coin-total'),
    heads:     $('coin-heads'),
    tails:     $('coin-tails'),
    headsRate: $('coin-head-percent'),
    tailsRate: $('coin-tail-percent'),
    last:      $('coin-last-result'),
    insight:   $('coin-insight'),
    bar:       $('coin-bar-heads')
  };

  if (Object.values(ui).some((item) => !item)) {
    console.warn('Coin Lab: elemen HTML belum lengkap.');
    return;
  }

  /* ======================================
     THREE.JS SCENE
  ====================================== */

  const scene = new THREE.Scene();
  const themeColors = getSceneThemeColors();
  scene.background = new THREE.Color(themeColors.background || '#edf7ef');

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.2, 4.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  ui.host.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan     = false;
  controls.minDistance   = 3.3;
  controls.maxDistance   = 7;

  scene.add(new THREE.HemisphereLight(0xf4fff6, 0x829584, 2.2));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 4);
  scene.add(light);

  const blueLight = new THREE.PointLight(0x80bd8b, 14, 10);
  blueLight.position.set(-3, 1, -2);
  scene.add(blueLight);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 64),
    new THREE.MeshStandardMaterial({ color: themeColors.floor || 0xdce9dd, roughness: 0.7 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.05;
  scene.add(floor);
  const unsubscribeTheme = subscribeToThemeChange((theme, colors) => {
    scene.background.set(colors.background);
    floor.material.color.set(colors.floor);
    blueLight.color.set(theme === 'dark' ? 0x438fff : 0x80bd8b);
    blueLight.intensity = theme === 'dark' ? 25 : 14;
  });

  const geometry = new THREE.CylinderGeometry(0.82, 0.82, 0.14, 96);
  geometry.rotateX(Math.PI / 2);

  const coin = new THREE.Mesh(geometry, [
    new THREE.MeshStandardMaterial({ color: 0xc58a2a, metalness: 0.9, roughness: 0.28 }),
    new THREE.MeshStandardMaterial({ map: faceTexture('ANGKA', '1'), metalness: 0.7, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: faceTexture('GAMBAR', '★'), metalness: 0.7, roughness: 0.3 })
  ]);

  coin.castShadow = true;
  const coinRoot = new THREE.Group();
  coinRoot.add(coin);
  coinRoot.position.y = 0.12;
  scene.add(coinRoot);

  /* ======================================
     STATE
  ====================================== */

  let total  = 0;
  let heads  = 0;
  let tails  = 0;
  let flip   = null;
  let frame  = 0;

  /* LIVE PROBABILITY STATE */
  let liveHistory = [];
  let liveUI      = null;

  /* ======================================
     LIVE PROBABILITY PANEL
  ====================================== */

  function buildLivePanel() {
    const panel = document.createElement('div');
    panel.className = 'live-prob-panel';
    panel.id = 'coin-live-panel';

    panel.innerHTML = `
      <div class="live-prob-header">
        <div class="live-prob-header-left">
          <span class="live-prob-kicker">FREKUENSI RELATIF KUMULATIF</span>
          <p class="live-prob-title">Peluang dan frekuensi setiap pelemparan</p>
        </div>
        <span class="live-prob-badge">AUTO UPDATE</span>
      </div>
      <div class="live-prob-body">

        <div class="live-prob-current">
          <div class="live-prob-box highlight">
            <span class="live-prob-box-label">PELUANG TEORITIS (TETAP)</span>
            <span class="live-prob-box-value">50.00%</span>
            <span class="live-prob-box-sub">1/2 — setiap pelemparan</span>
          </div>
          <div class="live-prob-box success-box">
            <span class="live-prob-box-label">FREKUENSI ANGKA TERKINI</span>
            <span class="live-prob-box-value" id="lpcoin-freq">0.00%</span>
            <span class="live-prob-box-sub" id="lpcoin-freq-sub">0 dari 0 pelemparan</span>
          </div>
        </div>

        <div class="live-prob-formula">
          <span class="live-prob-formula-label">RUMUS FREKUENSI RELATIF</span>
          <span class="live-prob-formula-expr" id="lpcoin-formula-expr">f(ANGKA) = 0 / 0</span>
          <span class="live-prob-formula-result" id="lpcoin-formula-result">= 0% (peluang teoritis: 50%)</span>
        </div>

        <div class="live-prob-compare">
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Peluang teoritis</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill theoretical" style="width:50%"></div>
            </div>
            <span class="live-prob-compare-pct">50.00%</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Frekuensi ANGKA</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill empirical" id="lpcoin-bar-heads" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpcoin-pct-heads">-</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Frekuensi GAMBAR</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill conditional" id="lpcoin-bar-tails" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpcoin-pct-tails">-</span>
          </div>
        </div>

        <div class="live-prob-history">
          <div class="live-prob-history-title">
            RIWAYAT PELEMPARAN — frekuensi kumulatif setelah setiap lempar
          </div>
          <div class="live-prob-log" id="lpcoin-log">
            <div class="live-prob-empty">
              Belum ada pelemparan. Lempar koin untuk melihat frekuensi relatif kumulatif.
            </div>
          </div>
        </div>

      </div>
    `;

    const coinSummary = document.querySelector('.coin-summary-card');
    if (coinSummary) coinSummary.appendChild(panel);

    return {
      freq:        document.getElementById('lpcoin-freq'),
      freqSub:     document.getElementById('lpcoin-freq-sub'),
      formulaExpr: document.getElementById('lpcoin-formula-expr'),
      formulaResult: document.getElementById('lpcoin-formula-result'),
      barHeads:    document.getElementById('lpcoin-bar-heads'),
      pctHeads:    document.getElementById('lpcoin-pct-heads'),
      barTails:    document.getElementById('lpcoin-bar-tails'),
      pctTails:    document.getElementById('lpcoin-pct-tails'),
      log:         document.getElementById('lpcoin-log')
    };
  }

  function updateLivePanel() {
    if (!liveUI) return;

    const headPct  = total ? (heads / total) * 100 : 0;
    const tailPct  = total ? (tails / total) * 100 : 0;

    liveUI.freq.textContent =
      total > 0 ? `${headPct.toFixed(2)}%` : '0.00%';
    liveUI.freqSub.textContent =
      `${heads} dari ${total} pelemparan`;

    liveUI.formulaExpr.textContent =
      `f(ANGKA) = ${heads} / ${total}`;
    liveUI.formulaResult.textContent =
      total > 0
        ? `= ${simplifyFraction(heads, total)} ≈ ${headPct.toFixed(2)}% (teori: 50%)`
        : '= 0% (peluang teoritis: 50%)';

    liveUI.barHeads.style.width = `${headPct}%`;
    liveUI.pctHeads.textContent = total > 0 ? `${headPct.toFixed(2)}%` : '-';
    liveUI.barTails.style.width = `${tailPct}%`;
    liveUI.pctTails.textContent = total > 0 ? `${tailPct.toFixed(2)}%` : '-';

    /* Log */
    if (liveHistory.length === 0) {
      liveUI.log.innerHTML =
        '<div class="live-prob-empty">Belum ada pelemparan. Lempar koin untuk melihat frekuensi relatif kumulatif.</div>';
      return;
    }

    liveUI.log.innerHTML = '';
    for (let i = liveHistory.length - 1; i >= 0; i--) {
      const e   = liveHistory[i];
      const row = document.createElement('div');
      row.className = `live-prob-log-entry${e.isHeads ? ' is-hit' : ''}`;
      row.innerHTML = `
        <span class="log-num">${e.num}</span>
        <span class="log-result${e.isHeads ? ' hit' : ''}">${e.result}</span>
        <span class="log-formula">${e.headsAfter}/${e.totalAfter}</span>
        <span class="log-pct${e.isHeads ? ' hit' : ''}">${e.headsPct.toFixed(2)}%</span>
      `;
      liveUI.log.appendChild(row);
    }
  }

  /* ======================================
     STATISTIK
  ====================================== */

  function updateStats() {
    const headPct = total ? (heads / total) * 100 : 0;
    const tailPct = total ? (tails / total) * 100 : 0;

    ui.total.textContent      = total;
    ui.heads.textContent      = heads;
    ui.tails.textContent      = tails;
    ui.headsRate.textContent  = `${headPct.toFixed(1)}%`;
    ui.tailsRate.textContent  = `${tailPct.toFixed(1)}%`;
    ui.bar.style.width        = `${headPct}%`;

    ui.insight.textContent = total
      ? `Dari ${total} pelemparan, ANGKA muncul ${heads} kali (${headPct.toFixed(1)}%). Peluang teoritisnya 50%; selisih saat ini ${Math.abs(headPct - 50).toFixed(1)} poin persentase.`
      : 'Mulai melempar koin. Bandingkan frekuensi hasil percobaan dengan peluang teoritis 50%.';
  }

  /* ======================================
     SELESAI LEMPAR
  ====================================== */

  function finish(result) {
    total++;
    const isHeads = result === 'ANGKA';
    if (isHeads) heads++; else tails++;

    ui.last.textContent = result;
    ui.status.textContent =
      `Hasil ${result} tercatat. Lempar lagi untuk menambah percobaan.`;
    ui.flip.disabled    = false;
    ui.flip.textContent = '↻ Lempar koin lagi';

    /* Log this flip */
    const headsPct = (heads / total) * 100;
    liveHistory.push({
      num:        liveHistory.length + 1,
      result,
      isHeads,
      totalAfter: total,
      headsAfter: heads,
      headsPct
    });

    updateStats();
    if (liveUI) updateLivePanel();
  }

  /* ======================================
     LEMPAR KOIN
  ====================================== */

  function toss() {
    if (flip) return;

    const result = Math.random() < 0.5 ? 'ANGKA' : 'GAMBAR';
    const currentParity = ((Math.round(coinRoot.rotation.x / Math.PI) % 2) + 2) % 2;
    const targetParity  = result === 'ANGKA' ? 0 : 1;
    const parityChange  = (targetParity - currentParity + 2) % 2;
    const spins = 4 + Math.floor(Math.random() * 3);

    flip = {
      result, targetParity,
      start:    performance.now(),
      duration: 1600,
      from:     coinRoot.rotation.x,
      delta:    spins * Math.PI * 2 + parityChange * Math.PI
    };

    ui.flip.disabled    = true;
    ui.flip.textContent = 'Koin sedang dilempar…';
    ui.status.textContent =
      'Koin sedang berputar. Perhatikan sisi yang menghadap ke depan.';
  }

  /* ======================================
     RESET
  ====================================== */

  function reset() {
    if (flip) return;

    total  = 0;
    heads  = 0;
    tails  = 0;
    liveHistory = [];

    coinRoot.rotation.set(0, 0, 0);
    coinRoot.position.y = 0.12;

    ui.last.textContent   = 'Belum ada';
    ui.status.textContent =
      'Statistik direset. Tekan Lempar koin untuk memulai.';

    updateStats();
    if (liveUI) updateLivePanel();
  }

  /* ======================================
     RENDER LOOP
  ====================================== */

  function render() {
    frame = requestAnimationFrame(render);

    if (flip) {
      const progress = Math.min(
        (performance.now() - flip.start) / flip.duration, 1
      );
      const ease = 1 - Math.pow(1 - progress, 3);

      coinRoot.rotation.x  = flip.from + flip.delta * ease;
      coinRoot.position.y  = 0.12 + Math.sin(Math.PI * progress) * 0.85;

      if (progress >= 1) {
        const result = flip.result;
        coinRoot.rotation.x = flip.targetParity * Math.PI;
        coinRoot.position.y = 0.12;
        flip = null;
        finish(result);
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  /* ======================================
     EVENT LISTENERS + START
  ====================================== */

  ui.flip.addEventListener('click', toss);
  ui.reset.addEventListener('click', reset);

  const disposeRendererResize = observeRendererSize(ui.host, renderer, camera);
  updateStats();
  render();

  liveUI = buildLivePanel();
  updateLivePanel();

  /* ======================================
     CLEANUP
  ====================================== */

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    disposeRendererResize();
    unsubscribeTheme();
    controls.dispose();
    renderer.dispose();

    scene.traverse((object) => {
      object.geometry?.dispose();
      const materials = Array.isArray(object.material)
        ? object.material : [object.material];
      materials.filter(Boolean).forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    });
  }, { once: true });
}

/* ======================================
   BOOT
====================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startCoinLab, { once: true });
} else {
  startCoinLab();
}
