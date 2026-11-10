import { getDiceSumOutcomes, getRandomDieValue } from '../probability/dice-probability.js';

const STEPS = [
  {
    label: 'LANGKAH 1',
    title: 'Kenali seluruh kemungkinan',
    description: 'Setiap dadu memiliki 6 sisi. Karena ada dua dadu, setiap hasil dadu pertama dapat dipasangkan dengan 6 hasil dadu kedua.',
    math: '6 × 6 = <b>36 kemungkinan</b>',
  },
  {
    label: 'LANGKAH 2',
    title: 'Temukan kejadian yang dicari',
    description: 'Sekarang cari pasangan angka yang jika dijumlahkan menghasilkan 7. Pilih kotak berwarna hijau pada ruang sampel untuk melihatnya di dadu 3D.',
    math: 'Kejadian yang diinginkan = <b>jumlah 7</b>',
  },
  {
    label: 'LANGKAH 3',
    title: 'Hitung hasil yang sesuai',
    description: 'Ada enam pasangan yang menghasilkan jumlah 7: (1,6), (2,5), (3,4), (4,3), (5,2), dan (6,1).',
    math: 'n(A) = <b>6 kejadian</b>',
  },
  {
    label: 'LANGKAH 4',
    title: 'Bandingkan dan dapatkan peluang',
    description: 'Peluang adalah jumlah kejadian yang diinginkan dibagi seluruh kemungkinan. Jadi, 6 dari 36 kemungkinan menghasilkan jumlah 7.',
    math: 'P(A) = 6/36 = <b>1/6 = 16,67%</b>',
  },
];

/* ======================================
   MATH HELPERS
====================================== */

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifyFraction(num, den) {
  if (den === 0) return '-';
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num / g}/${den / g}`;
}

export function createDiceController({ scene, elements }) {
  let currentStep = 0;
  let selectedOutcome = { dieA: 1, dieB: 1, sum: 2 };
  const outcomes = getDiceSumOutcomes(7);

  /* LIVE PROBABILITY STATE */
  let liveHistory = [];
  let liveUI      = null;

  /* Total rolls and hits tracking */
  let totalRolls  = 0;
  let targetHits  = 0;
  const TARGET_SUM = 7;
  const TOTAL_OUTCOMES = 36;
  const FAVORABLE     = 6;
  const THEORETICAL   = (FAVORABLE / TOTAL_OUTCOMES) * 100;

  /* ======================================
     LIVE PROBABILITY PANEL
  ====================================== */

  function buildLivePanel() {
    const panel = document.createElement('div');
    panel.className = 'live-prob-panel';
    panel.id = 'dice-live-panel';

    panel.innerHTML = `
      <div class="live-prob-header">
        <div class="live-prob-header-left">
          <span class="live-prob-kicker">FREKUENSI RELATIF KUMULATIF</span>
          <p class="live-prob-title">Peluang dan frekuensi setiap lempar dadu</p>
        </div>
        <span class="live-prob-badge">AUTO UPDATE</span>
      </div>
      <div class="live-prob-body">

        <div class="live-prob-current">
          <div class="live-prob-box highlight">
            <span class="live-prob-box-label">PELUANG TEORITIS (TETAP)</span>
            <span class="live-prob-box-value">16.67%</span>
            <span class="live-prob-box-sub">6/36 — setiap lempar</span>
          </div>
          <div class="live-prob-box success-box">
            <span class="live-prob-box-label">FREKUENSI JUMLAH 7</span>
            <span class="live-prob-box-value" id="lpd-freq">0.00%</span>
            <span class="live-prob-box-sub" id="lpd-freq-sub">0 dari 0 lempar</span>
          </div>
        </div>

        <div class="live-prob-formula">
          <span class="live-prob-formula-label">RUMUS FREKUENSI RELATIF</span>
          <span class="live-prob-formula-expr" id="lpd-formula-expr">f(jumlah=7) = 0 / 0</span>
          <span class="live-prob-formula-result" id="lpd-formula-result">= 0% (peluang teoritis: 16.67%)</span>
        </div>

        <div class="live-prob-compare">
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Peluang teoritis</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill theoretical" style="width:16.67%"></div>
            </div>
            <span class="live-prob-compare-pct">16.67%</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Frekuensi jumlah 7</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill empirical" id="lpd-bar-hits" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpd-pct-hits">-</span>
          </div>
          <div class="live-prob-compare-row">
            <span class="live-prob-compare-label">Frekuensi bukan 7</span>
            <div class="live-prob-compare-track">
              <div class="live-prob-compare-fill conditional" id="lpd-bar-miss" style="width:0%"></div>
            </div>
            <span class="live-prob-compare-pct" id="lpd-pct-miss">-</span>
          </div>
        </div>

        <div class="live-prob-history">
          <div class="live-prob-history-title">
            RIWAYAT LEMPAR DADU — frekuensi kumulatif jumlah 7
          </div>
          <div class="live-prob-log" id="lpd-log">
            <div class="live-prob-empty">
              Belum ada lemparan. Lempar dadu untuk melihat frekuensi relatif kumulatif.
            </div>
          </div>
        </div>

      </div>
    `;

    /* Inject after the answer-card */
    const answerCard = document.querySelector('.answer-card');
    if (answerCard) answerCard.insertAdjacentElement('afterend', panel);

    return {
      freq:          document.getElementById('lpd-freq'),
      freqSub:       document.getElementById('lpd-freq-sub'),
      formulaExpr:   document.getElementById('lpd-formula-expr'),
      formulaResult: document.getElementById('lpd-formula-result'),
      barHits:       document.getElementById('lpd-bar-hits'),
      pctHits:       document.getElementById('lpd-pct-hits'),
      barMiss:       document.getElementById('lpd-bar-miss'),
      pctMiss:       document.getElementById('lpd-pct-miss'),
      log:           document.getElementById('lpd-log')
    };
  }

  function updateLivePanel() {
    if (!liveUI) return;

    const hitPct  = totalRolls > 0 ? (targetHits  / totalRolls) * 100 : 0;
    const missPct = totalRolls > 0 ? ((totalRolls - targetHits) / totalRolls) * 100 : 0;

    liveUI.freq.textContent =
      totalRolls > 0 ? `${hitPct.toFixed(2)}%` : '0.00%';
    liveUI.freqSub.textContent =
      `${targetHits} dari ${totalRolls} lemparan`;

    liveUI.formulaExpr.textContent =
      `f(jumlah=${TARGET_SUM}) = ${targetHits} / ${totalRolls}`;
    liveUI.formulaResult.textContent = totalRolls > 0
      ? `= ${simplifyFraction(targetHits, totalRolls)} ≈ ${hitPct.toFixed(2)}% (teori: ${THEORETICAL.toFixed(2)}%)`
      : `= 0% (peluang teoritis: ${THEORETICAL.toFixed(2)}%)`;

    liveUI.barHits.style.width = `${hitPct}%`;
    liveUI.pctHits.textContent = totalRolls > 0 ? `${hitPct.toFixed(2)}%` : '-';

    liveUI.barMiss.style.width = `${missPct}%`;
    liveUI.pctMiss.textContent = totalRolls > 0 ? `${missPct.toFixed(2)}%` : '-';

    /* Log */
    if (liveHistory.length === 0) {
      liveUI.log.innerHTML =
        '<div class="live-prob-empty">Belum ada lemparan. Lempar dadu untuk melihat frekuensi relatif kumulatif.</div>';
      return;
    }

    liveUI.log.innerHTML = '';
    for (let i = liveHistory.length - 1; i >= 0; i--) {
      const e   = liveHistory[i];
      const row = document.createElement('div');
      row.className = `live-prob-log-entry${e.isHit ? ' is-hit' : ''}`;
      row.innerHTML = `
        <span class="log-num">${e.num}</span>
        <span class="log-result${e.isHit ? ' hit' : ''}">
          ${e.dieA}+${e.dieB}=${e.sum}${e.isHit ? ' ✓' : ''}
        </span>
        <span class="log-formula">${e.hitsAfter}/${e.totalAfter}</span>
        <span class="log-pct${e.isHit ? ' hit' : ''}">${e.freqPct.toFixed(2)}%</span>
      `;
      liveUI.log.appendChild(row);
    }
  }

  /* ======================================
     RECORD A ROLL IN HISTORY
  ====================================== */

  function recordRoll(dieA, dieB) {
    totalRolls++;
    const sum   = dieA + dieB;
    const isHit = sum === TARGET_SUM;
    if (isHit) targetHits++;

    const freqPct = (targetHits / totalRolls) * 100;

    liveHistory.push({
      num:        liveHistory.length + 1,
      dieA, dieB, sum, isHit,
      hitsAfter:  targetHits,
      totalAfter: totalRolls,
      freqPct
    });

    updateLivePanel();
  }

  /* ======================================
     READOUT + GRID
  ====================================== */

  function updateReadout(dieA, dieB) {
    selectedOutcome = { dieA, dieB, sum: dieA + dieB };
    elements.dieAValue.textContent = String(dieA);
    elements.dieBValue.textContent = String(dieB);
    elements.sumValue.textContent  = String(dieA + dieB);
    elements.sampleGrid.querySelectorAll('.outcome').forEach((button) => {
      const isSelected =
        Number(button.dataset.a) === dieA &&
        Number(button.dataset.b) === dieB;
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function renderSampleGrid() {
    elements.sampleGrid.innerHTML = '';
    for (const outcome of outcomes) {
      const button = document.createElement('button');
      button.type      = 'button';
      button.className = `outcome${outcome.favorable ? ' favorable' : ''}`;
      button.dataset.a = String(outcome.dieA);
      button.dataset.b = String(outcome.dieB);
      button.setAttribute('aria-label',
        `Dadu ${outcome.dieA} dan ${outcome.dieB}, jumlah ${outcome.sum}`);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `<span>${outcome.dieA}</span><i>+</i><span>${outcome.dieB}</span>`;
      button.addEventListener('click', async () => {
        updateReadout(outcome.dieA, outcome.dieB);
        await scene.rollTo(outcome.dieA, outcome.dieB, 0.9);
      });
      elements.sampleGrid.appendChild(button);
    }
  }

  function renderStep() {
    const step = STEPS[currentStep];
    elements.stepLabel.textContent       = step.label;
    elements.stepTitle.textContent       = step.title;
    elements.stepDescription.textContent = step.description;
    elements.stepMath.innerHTML          = step.math;
    elements.stepCounter.textContent =
      `${String(currentStep + 1).padStart(2, '0')} / 04`;
    [...elements.stepProgress.children].forEach((node, index) =>
      node.classList.toggle('active', index <= currentStep)
    );
    elements.prevStep.disabled = currentStep === 0;
    elements.nextStep.innerHTML =
      currentStep === STEPS.length - 1
        ? 'Ulangi penjelasan <span>↻</span>'
        : 'Langkah berikutnya <span>→</span>';
  }

  /* ======================================
     ROLL WITH HISTORY RECORDING
  ====================================== */

  async function rollRandom() {
    const dieA = getRandomDieValue();
    const dieB = getRandomDieValue();
    updateReadout(dieA, dieB);
    elements.rollDice.disabled = true;
    try {
      await scene.rollTo(dieA, dieB);
      recordRoll(dieA, dieB); /* ← record AFTER animation */
    } finally {
      elements.rollDice.disabled = false;
    }
  }

  async function showFavorableOutcomes() {
    elements.showFavorable.disabled = true;
    try {
      for (const outcome of outcomes.filter((item) => item.favorable)) {
        updateReadout(outcome.dieA, outcome.dieB);
        await scene.rollTo(outcome.dieA, outcome.dieB, 0.58);
        recordRoll(outcome.dieA, outcome.dieB); /* ← record each */
      }
    } finally {
      elements.showFavorable.disabled = false;
    }
  }

  /* ======================================
     EVENT LISTENERS
  ====================================== */

  elements.rollDice.addEventListener('click', rollRandom);
  elements.showFavorable.addEventListener('click', showFavorableOutcomes);

  elements.prevStep.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    renderStep();
  });

  elements.nextStep.addEventListener('click', () => {
    currentStep =
      currentStep === STEPS.length - 1 ? 0 : currentStep + 1;
    renderStep();
  });

  /* ======================================
     INIT
  ====================================== */

  renderSampleGrid();
  renderStep();
  updateReadout(selectedOutcome.dieA, selectedOutcome.dieB);
  scene.rollTo(1, 1, 0.25);

  /* Build live panel after DOM is ready */
  liveUI = buildLivePanel();
  updateLivePanel();
}
