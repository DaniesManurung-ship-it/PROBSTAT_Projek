
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { observeRendererSize } from '../../utils/visualization/observe-renderer-size.js';
import { getSceneThemeColors, subscribeToThemeChange } from '../../app/theme.js';
import { getCoinEventProbability, runCoinExperiment } from './coin-probability.js';

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

function formatPercent(probability) {
  return `${(probability * 100).toFixed(2)}%`;
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
    trialCount: $('coin-trial-count'),
    runSimulation: $('run-coin-simulation'),
    coinCount: $('coin-count'),
    target:    $('coin-target'),
    status:    $('coin-status'),
    total:     $('coin-total'),
    hits:      $('coin-hits'),
    hitRate:   $('coin-hit-percent'),
    theory:    $('coin-theory'),
    frequency: $('coin-frequency'),
    last:      $('coin-last-result'),
    insight:   $('coin-insight'),
    bar:       $('coin-hit-bar'),
    chart:     $('coin-frequency-chart'),
    chartTotal: $('coin-chart-total'),
    theoryMarker: $('coin-theory-marker'),
    progressTheory: $('coin-progress-theory'),
    explanationTitle: $('coin-explanation-title'),
    explanationFormula: $('coin-explanation-formula'),
    explanationSteps: $('coin-explanation-steps'),
    favorableOutcomes: $('coin-favorable-outcomes')
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

  const coinMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xc58a2a, metalness: 0.9, roughness: 0.28 }),
    new THREE.MeshStandardMaterial({ map: faceTexture('ANGKA', '1'), metalness: 0.7, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: faceTexture('GAMBAR', '★'), metalness: 0.7, roughness: 0.3 })
  ];
  const coinRoots = Array.from({ length: 3 }, () => {
    const coin = new THREE.Mesh(geometry, coinMaterials);
    coin.castShadow = true;
    const root = new THREE.Group();
    root.add(coin);
    scene.add(root);
    return root;
  });

  /* ======================================
     STATE
  ====================================== */

  let total = 0;
  let hits = 0;
  let flip = null;
  let frame = 0;
  let history = [];
  let liveUI = null;
  let simulationRunning = false;

  function coinCount() { return Number(ui.coinCount.value); }
  function targetHeads() { return Number(ui.target.value); }
  function eventProbability() {
    return getCoinEventProbability(coinCount(), targetHeads());
  }

  function layoutCoins() {
    const count = coinCount();
    const positions = count === 1 ? [0] : count === 2 ? [-0.62, 0.62] : [-1.12, 0, 1.12];
    coinRoots.forEach((root, index) => {
      root.visible = index < count;
      root.position.set(positions[index] ?? 0, 0.12, 0);
      root.scale.setScalar(count === 3 ? 0.68 : count === 2 ? 0.78 : 1);
      root.rotation.set(0, 0, 0);
    });
  }

  function setBusy(busy) {
    ui.flip.disabled = busy;
    ui.reset.disabled = busy;
    ui.runSimulation.disabled = busy;
    ui.coinCount.disabled = busy;
    ui.target.disabled = busy;
    ui.trialCount.disabled = busy;
  }

  function updateTargetOptions() {
    const previousValue = ui.target.value === '' ? 1 : Number(ui.target.value);
    const count = coinCount();
    ui.target.replaceChildren();
    for (let headsCount = 0; headsCount <= count; headsCount++) {
      const option = document.createElement('option');
      option.value = String(headsCount);
      option.textContent = `Tepat ${headsCount} ANGKA`;
      ui.target.appendChild(option);
    }
    ui.target.value = String(Math.min(previousValue, count));
  }

  function buildLivePanel() {
    const panel = document.createElement('div');
    panel.className = 'live-prob-panel';
    panel.id = 'coin-live-panel';
    panel.innerHTML = `
      <div class="live-prob-header">
        <div class="live-prob-header-left">
          <span class="live-prob-kicker">HASIL DAN PELUANG</span>
          <p class="live-prob-title">Bagaimana hasil percobaan mendekati teori?</p>
        </div>
        <span class="live-prob-badge">OTOMATIS</span>
      </div>
      <div class="live-prob-body">
        <div class="live-prob-current">
          <div class="live-prob-box highlight">
            <span class="live-prob-box-label">PELUANG TEORITIS</span>
            <span class="live-prob-box-value" id="lpcoin-theory">0%</span>
            <span class="live-prob-box-sub" id="lpcoin-theory-sub"></span>
          </div>
          <div class="live-prob-box success-box">
            <span class="live-prob-box-label">FREKUENSI HASIL</span>
            <span class="live-prob-box-value" id="lpcoin-frequency">0%</span>
            <span class="live-prob-box-sub" id="lpcoin-frequency-sub">0 kejadian dari 0 lemparan</span>
          </div>
        </div>
        <div class="live-prob-formula">
          <span class="live-prob-formula-label">FREKUENSI RELATIF</span>
          <span class="live-prob-formula-expr" id="lpcoin-formula"></span>
          <span class="live-prob-formula-result" id="lpcoin-result"></span>
        </div>
        <div class="live-prob-history">
          <div class="live-prob-history-title">RIWAYAT PELEMPARAN</div>
          <div class="live-prob-log" id="lpcoin-log"></div>
        </div>
      </div>`;
    document.querySelector('.coin-summary-card').appendChild(panel);
    return {
      theory: panel.querySelector('#lpcoin-theory'),
      theorySub: panel.querySelector('#lpcoin-theory-sub'),
      frequency: panel.querySelector('#lpcoin-frequency'),
      frequencySub: panel.querySelector('#lpcoin-frequency-sub'),
      formula: panel.querySelector('#lpcoin-formula'),
      result: panel.querySelector('#lpcoin-result'),
      log: panel.querySelector('#lpcoin-log')
    };
  }

  function updateExplanation(probability) {
    const n = coinCount();
    const k = targetHeads();
    const denominator = probability.totalOutcomes;
    const fraction = simplifyFraction(probability.favorableCount, denominator);
    const percent = formatPercent(probability.probability);
    const favorable = probability.favorableOutcomes
      .map((outcome) => outcome.join(' + '))
      .join('; ');
    const rawFraction = `${probability.favorableCount}/${denominator}`;

    ui.theory.textContent = percent;
    ui.progressTheory.textContent = `Teori: ${percent}`;
    ui.theoryMarker.style.left = `${probability.probability * 100}%`;
    ui.explanationTitle.textContent = `Peluang tepat ${k} ANGKA dari ${n} koin`;
    ui.explanationFormula.textContent =
      `Rumus: C(${n}, ${k}) = ${probability.favorableCount} hasil yang cocok. Jadi P = hasil yang cocok / semua hasil = ${rawFraction}${fraction === rawFraction ? '' : ` = ${fraction}`} ≈ ${percent}.`;
    ui.explanationSteps.textContent =
      `Langkah mudah: anggap semua koin seimbang, sehingga setiap sisi sama mungkin. Setiap koin punya 2 sisi, jadi ${n} koin memiliki ${denominator} kemungkinan yang sama peluangnya. Dari semua kemungkinan itu, ${probability.favorableCount} hasil memiliki tepat ${k} sisi ANGKA. Maka peluangnya adalah ${probability.favorableCount} dibagi ${denominator}.`;
    ui.favorableOutcomes.textContent =
      `Hasil yang cocok: ${favorable || 'tidak ada'}.`;
  }

  function renderDistribution() {
    const count = coinCount();
    const target = targetHeads();
    const distribution = Array.from({ length: count + 1 }, (_, heads) => {
      const observed = history.filter((entry) => entry.heads === heads).length;
      return {
        heads,
        count: observed,
        probability: getCoinEventProbability(count, heads).probability
      };
    });
    const maxCount = Math.max(0, ...distribution.map((item) => item.count));
    ui.chart.style.setProperty('--sum-count', String(distribution.length));
    ui.chart.style.gridTemplateColumns = `repeat(${distribution.length}, minmax(0, 1fr))`;
    ui.chart.setAttribute(
      'aria-label',
      `Grafik hasil ${total} percobaan: frekuensi jumlah sisi ANGKA dari 0 sampai ${count}. Kejadian yang dicari adalah tepat ${target} ANGKA.`
    );
    ui.chart.innerHTML = distribution.map(({ heads, count: observed, probability }) => {
      const height = maxCount === 0 ? 2 : Math.max(3, (observed / maxCount) * 100);
      const theoretical = formatPercent(probability);
      const isTarget = heads === target;
      return `
        <div class="frequency-column${isTarget ? ' target' : ''}"
          title="${heads} ANGKA: ${observed} kali; peluang teori ${theoretical}">
          <span class="frequency-count">${theoretical}</span>
          <div class="frequency-track"><i class="frequency-bar" style="height:${height}%"></i></div>
          <b>${heads}</b>
        </div>`;
    }).join('');
    ui.chartTotal.textContent = total
      ? `${total} percobaan terkumpul`
      : 'Belum ada simulasi';
  }

  function updateStats() {
    const probability = eventProbability();
    const frequency = total ? hits / total : 0;
    const pct = formatPercent(frequency);

    ui.total.textContent = total;
    ui.hits.textContent = hits;
    ui.hitRate.textContent = pct;
    ui.frequency.textContent = pct;
    ui.bar.style.width = `${frequency * 100}%`;
    renderDistribution();
    ui.insight.textContent = total
      ? `Dari ${total} pelemparan, kejadian “tepat ${targetHeads()} ANGKA” terjadi ${hits} kali. Frekuensi percobaannya ${pct}, sedangkan peluang teori ${formatPercent(probability.probability)}. Perbedaan ini wajar pada percobaan acak, terutama jika jumlah lemparan masih sedikit.`
      : 'Belum ada percobaan. Tekan “Lempar koin” untuk membandingkan hasil nyata dengan peluang teori.';
    updateExplanation(probability);
    if (liveUI) updateLivePanel(probability);
  }

  function updateLivePanel(probability = eventProbability()) {
    const frequency = total ? hits / total : 0;
    liveUI.theory.textContent = formatPercent(probability.probability);
    liveUI.theorySub.textContent =
      `${probability.favorableCount} dari ${probability.totalOutcomes} kemungkinan`;
    liveUI.frequency.textContent = formatPercent(frequency);
    liveUI.frequencySub.textContent = `${hits} kejadian dari ${total} lemparan`;
    liveUI.formula.textContent = `Frekuensi = ${hits} / ${total}`;
    liveUI.result.textContent = total
      ? `= ${simplifyFraction(hits, total)} ≈ ${formatPercent(frequency)}`
      : '= belum ada data percobaan';

    liveUI.log.replaceChildren();
    if (!history.length) {
      const empty = document.createElement('div');
      empty.className = 'live-prob-empty';
      empty.textContent = 'Riwayat hasil akan muncul setelah koin dilempar.';
      liveUI.log.appendChild(empty);
      return;
    }
    history.slice().reverse().forEach((entry) => {
      const row = document.createElement('div');
      row.className = `live-prob-log-entry${entry.hit ? ' is-hit' : ''}`;
      const number = document.createElement('span');
      number.className = 'log-num';
      number.textContent = String(entry.number);
      const result = document.createElement('span');
      result.className = `log-result${entry.hit ? ' hit' : ''}`;
      result.textContent = entry.results.join(' + ');
      const fraction = document.createElement('span');
      fraction.className = 'log-formula';
      fraction.textContent = `${entry.hitsAfter}/${entry.number}`;
      const rate = document.createElement('span');
      rate.className = `log-pct${entry.hit ? ' hit' : ''}`;
      rate.textContent = formatPercent(entry.hitsAfter / entry.number);
      row.append(number, result, fraction, rate);
      liveUI.log.appendChild(row);
    });
  }

  function finish(results) {
    total++;
    const hit = results.filter((side) => side === 'ANGKA').length === targetHeads();
    if (hit) hits++;

    ui.last.textContent = results.join(' + ');
    ui.status.textContent = `Hasil pelemparan ke-${total} tercatat. ${hit ? 'Kejadian yang dicari ditemukan!' : 'Kejadian yang dicari belum muncul.'}`;
    ui.flip.disabled = false;
    ui.flip.textContent = '↻ Lempar lagi';
    history.push({
      number: total,
      results,
      heads: results.filter((side) => side === 'ANGKA').length,
      hit,
      hitsAfter: hits
    });
    updateStats();
  }

  function animateOutcome(results, duration = 420) {
    return new Promise((resolve) => {
      const activeRoots = coinRoots.slice(0, results.length);
      const from = activeRoots.map((root) => root.rotation.x);
      const targetParity = results.map((result) => result === 'ANGKA' ? 0 : 1);
      const delta = activeRoots.map((_, index) => {
        const currentParity = ((Math.round(from[index] / Math.PI) % 2) + 2) % 2;
        const parityChange = (targetParity[index] - currentParity + 2) % 2;
        const spins = 2 + Math.floor(Math.random() * 2);
        return spins * Math.PI * 2 + parityChange * Math.PI;
      });
      flip = {
        results, targetParity, from, delta, start: performance.now(), duration,
        onComplete: resolve
      };
    });
  }

  async function runSimulation() {
    if (flip || simulationRunning) return;

    const result = runCoinExperiment(
      Number(ui.trialCount.value),
      coinCount(),
      targetHeads()
    );
    let updatedHits = hits;
    for (const outcome of result.outcomes) {
      if (outcome.hit) updatedHits += 1;
      history.push({
        number: history.length + 1,
        results: outcome.result,
        heads: outcome.heads,
        hit: outcome.hit,
        hitsAfter: updatedHits
      });
    }
    total += result.trialCount;
    hits = updatedHits;
    ui.last.textContent = result.outcomes.at(-1).result.join(' + ');
    updateStats();
    simulationRunning = true;
    setBusy(true);
    ui.status.textContent =
      `Dihitung ${result.trialCount} pelemparan. Animasi menampilkan ${result.preview.length} hasil contoh pertama.`;

    try {
      for (const outcome of result.preview) {
        await animateOutcome(outcome.result);
      }
      ui.status.textContent =
        `Simulasi selesai: ${result.trialCount} pelemparan ditambahkan. Grafik dan frekuensi diperbarui dari ${total} percobaan seluruhnya.`;
    } catch (error) {
      console.error('Animasi simulasi koin gagal:', error);
      ui.status.textContent =
        'Perhitungan simulasi selesai, tetapi animasi 3D tidak dapat ditampilkan.';
    } finally {
      simulationRunning = false;
      setBusy(false);
    }
  }

  function toss() {
    if (flip || simulationRunning) return;
    const results = Array.from({ length: coinCount() }, () =>
      Math.random() < 0.5 ? 'ANGKA' : 'GAMBAR'
    );
    const activeRoots = coinRoots.slice(0, results.length);
    const from = activeRoots.map((root) => root.rotation.x);
    const targetParity = results.map((result) => result === 'ANGKA' ? 0 : 1);
    const delta = activeRoots.map((_, index) => {
      const currentParity = ((Math.round(from[index] / Math.PI) % 2) + 2) % 2;
      const parityChange = (targetParity[index] - currentParity + 2) % 2;
      return (4 + Math.floor(Math.random() * 3)) * Math.PI * 2 + parityChange * Math.PI;
    });
    flip = { results, targetParity, from, delta, start: performance.now(), duration: 1600 };
    ui.flip.disabled = true;
    setBusy(true);
    ui.flip.textContent = 'Koin sedang dilempar…';
    ui.status.textContent = `Sedang melempar ${results.length} koin. Perhatikan hasil setiap koin.`;
  }

  function reset(message = 'Statistik direset. Atur kejadian lalu lempar koin untuk memulai.') {
    if (flip || simulationRunning) return;
    total = 0;
    hits = 0;
    history = [];
    layoutCoins();
    ui.last.textContent = 'Belum ada';
    ui.status.textContent = message;
    updateStats();
  }

  function render() {
    frame = requestAnimationFrame(render);
    if (flip) {
      const progress = Math.min((performance.now() - flip.start) / flip.duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const activeRoots = coinRoots.slice(0, flip.results.length);
      activeRoots.forEach((root, index) => {
        root.rotation.x = flip.from[index] + flip.delta[index] * ease;
        root.position.y = 0.12 + Math.sin(Math.PI * progress) * 0.85;
      });

      if (progress >= 1) {
        activeRoots.forEach((root, index) => {
          root.rotation.x = flip.targetParity[index] * Math.PI;
          root.position.y = 0.12;
        });
        const { results } = flip;
        const onComplete = flip.onComplete;
        flip = null;
        if (onComplete) {
          onComplete();
        } else {
          setBusy(false);
          ui.flip.textContent = '↻ Lempar koin lagi';
          finish(results);
        }
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }

  /* ======================================
     EVENT LISTENERS + START
  ====================================== */

  ui.flip.addEventListener('click', toss);
  ui.reset.addEventListener('click', () => reset());
  ui.runSimulation.addEventListener('click', runSimulation);
  ui.coinCount.addEventListener('change', () => {
    updateTargetOptions();
    reset('Jumlah koin berubah. Statistik direset agar hasilnya tetap sebanding.');
  });
  ui.target.addEventListener('change', () => {
    reset('Kejadian yang dicari berubah. Statistik direset untuk kejadian baru.');
  });

  const disposeRendererResize = observeRendererSize(ui.host, renderer, camera);
  updateTargetOptions();
  layoutCoins();
  liveUI = buildLivePanel();
  updateStats();
  render();

  /* ======================================
     CLEANUP
  ====================================== */

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    if (flip?.onComplete) flip.onComplete();
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
