const TARGET_SUM = 7;
const MIN_TRIALS = 1;
const MAX_TRIALS = 10000;
const ANIMATION_PREVIEW_COUNT = 8;

/**
 * Menjalankan percobaan dua dadu secara matematis.
 * Hasil simulasi disimpan terpisah dari Three.js agar mudah diuji.
 */
export function runDiceExperiment(trialCount, random = Math.random) {
  if (!Number.isInteger(trialCount) || trialCount < MIN_TRIALS || trialCount > MAX_TRIALS) {
    throw new RangeError(`Jumlah percobaan harus berupa bilangan bulat ${MIN_TRIALS}-${MAX_TRIALS}.`);
  }
  if (typeof random !== 'function') {
    throw new TypeError('Parameter random harus berupa fungsi.');
  }

  const distribution = Array.from({ length: 11 }, (_, index) => ({
    sum: index + 2,
    count: 0,
  }));
  const preview = [];
  let favorableCount = 0;

  for (let index = 0; index < trialCount; index += 1) {
    const dieA = Math.floor(random() * 6) + 1;
    const dieB = Math.floor(random() * 6) + 1;
    const sum = dieA + dieB;

    distribution[sum - 2].count += 1;
    if (sum === TARGET_SUM) favorableCount += 1;
    if (preview.length < ANIMATION_PREVIEW_COUNT) preview.push({ dieA, dieB, sum });
  }

  return {
    trialCount,
    favorableCount,
    unfavorableCount: trialCount - favorableCount,
    experimentalPercentage: (favorableCount / trialCount) * 100,
    theoreticalPercentage: (1 / 6) * 100,
    distribution,
    preview,
  };
}

function formatPercent(value) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export function createDiceExperiment({ scene, elements }) {
  if (!scene || !elements) throw new TypeError('Scene dan elemen eksperimen wajib tersedia.');

  let currentResult = null;

  function renderDistribution(distribution = []) {
    const maxCount = Math.max(0, ...distribution.map((item) => item.count));
    elements.frequencyChart.innerHTML = distribution.map(({ sum, count }) => {
      const height = maxCount === 0 ? 2 : Math.max(3, (count / maxCount) * 100);
      const isTarget = sum === TARGET_SUM;
      return `
        <div class="frequency-column${isTarget ? ' target' : ''}" title="Jumlah ${sum}: ${count} kali">
          <span class="frequency-count">${count}</span>
          <div class="frequency-track"><i class="frequency-bar" style="height:${height}%"></i></div>
          <b>${sum}</b>
        </div>`;
    }).join('');
  }

  function renderResult(result) {
    elements.trialTotal.textContent = String(result.trialCount);
    elements.hitTotal.textContent = String(result.favorableCount);
    elements.experimentalRate.textContent = formatPercent(result.experimentalPercentage);
    elements.theoreticalRate.textContent = formatPercent(result.theoreticalPercentage);
    elements.experimentBar.style.width = `${result.experimentalPercentage}%`;
    elements.experimentBar.setAttribute('aria-valuenow', result.experimentalPercentage.toFixed(2));
    renderDistribution(result.distribution);

    const difference = Math.abs(result.experimentalPercentage - result.theoreticalPercentage);
    elements.experimentInsight.textContent =
      `Dari ${result.trialCount} percobaan, jumlah 7 muncul ${result.favorableCount} kali. ` +
      `Hasil empiris ${formatPercent(result.experimentalPercentage)}, sedangkan peluang teoritis ` +
      `${formatPercent(result.theoreticalPercentage)}. Selisih keduanya ${difference.toFixed(2).replace('.', ',')} poin persentase. ` +
      'Hasil percobaan dapat berubah-ubah; semakin banyak percobaan, frekuensi relatif cenderung mendekati peluang teoritis.';
  }

  async function run() {
    const trialCount = Number(elements.trialCount.value);
    const result = runDiceExperiment(trialCount);
    currentResult = result;
    renderResult(result);

    elements.runExperiment.disabled = true;
    elements.resetExperiment.disabled = true;
    elements.experimentStatus.textContent = `Menampilkan ${result.preview.length} contoh lemparan pertama di objek 3D. Perhitungan statistik menggunakan seluruh ${trialCount} percobaan.`;

    try {
      for (const outcome of result.preview) {
        await scene.rollTo(outcome.dieA, outcome.dieB, 0.34);
      }
      elements.experimentStatus.textContent = `Selesai: ${trialCount} percobaan dihitung. Animasi 3D menampilkan ${result.preview.length} contoh hasil.`;
    } catch (error) {
      console.error('Animasi eksperimen gagal:', error);
      elements.experimentStatus.textContent = 'Perhitungan selesai, tetapi animasi 3D tidak dapat dijalankan.';
    } finally {
      elements.runExperiment.disabled = false;
      elements.resetExperiment.disabled = false;
    }
  }

  function reset() {
    currentResult = null;
    elements.trialTotal.textContent = '—';
    elements.hitTotal.textContent = '—';
    elements.experimentalRate.textContent = '—';
    elements.theoreticalRate.textContent = formatPercent((1 / 6) * 100);
    elements.experimentBar.style.width = '0%';
    elements.experimentBar.setAttribute('aria-valuenow', '0');
    elements.experimentInsight.textContent = 'Jalankan percobaan untuk membandingkan frekuensi hasil simulasi dengan peluang teoritis.';
    elements.experimentStatus.textContent = 'Belum ada percobaan. Pilih jumlah percobaan, lalu mulai simulasi.';
    renderDistribution(Array.from({ length: 11 }, (_, index) => ({ sum: index + 2, count: 0 })));
  }

  elements.runExperiment.addEventListener('click', run);
  elements.resetExperiment.addEventListener('click', reset);
  renderDistribution(Array.from({ length: 11 }, (_, index) => ({ sum: index + 2, count: 0 })));
  reset();

  return {
    getLastResult: () => currentResult,
    dispose() {
      elements.runExperiment.removeEventListener('click', run);
      elements.resetExperiment.removeEventListener('click', reset);
    },
  };
}
