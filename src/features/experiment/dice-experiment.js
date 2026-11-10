import { getDiceSumOutcomes, getRandomDieValue } from '../probability/dice-probability.js';

const MIN_TRIALS = 1;
const MAX_TRIALS = 10000;
const ANIMATION_PREVIEW_COUNT = 8;

export function runDiceExperiment(trialCount, random = Math.random, { diceCount = 2, targetSum = 7 } = {}) {
  if (!Number.isInteger(trialCount) || trialCount < MIN_TRIALS || trialCount > MAX_TRIALS) {
    throw new RangeError(`Jumlah percobaan harus berupa bilangan bulat ${MIN_TRIALS}-${MAX_TRIALS}.`);
  }
  if (typeof random !== 'function') {
    throw new TypeError('Parameter random harus berupa fungsi.');
  }

  const outcomes = getDiceSumOutcomes(targetSum, diceCount);
  const favorableOutcomes = outcomes.filter((outcome) => outcome.favorable).length;
  const minimumSum = diceCount;
  const distribution = Array.from({ length: diceCount * 5 + 1 }, (_, index) => ({
    sum: minimumSum + index,
    count: 0,
  }));
  const preview = [];
  let favorableCount = 0;

  for (let index = 0; index < trialCount; index += 1) {
    const values = Array.from({ length: diceCount }, () => getRandomDieValue(random));
    const sum = values.reduce((total, value) => total + value, 0);
    distribution[sum - minimumSum].count += 1;
    if (sum === targetSum) favorableCount += 1;
    if (preview.length < ANIMATION_PREVIEW_COUNT) {
      preview.push({ values, dieA: values[0], dieB: values[1], sum });
    }
  }

  return {
    trialCount,
    diceCount,
    targetSum,
    favorableCount,
    unfavorableCount: trialCount - favorableCount,
    experimentalPercentage: (favorableCount / trialCount) * 100,
    theoreticalPercentage: (favorableOutcomes / outcomes.length) * 100,
    distribution,
    preview,
  };
}

function formatPercent(value) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export function createDiceExperiment({
  scene,
  elements,
  getDiceConfiguration = () => ({ diceCount: 2, targetSum: 7 }),
  onDiceConfigurationChange = () => () => {},
}) {
  if (!scene || !elements) throw new TypeError('Scene dan elemen eksperimen wajib tersedia.');

  let currentResult = null;
  let executionId = 0;

  function getCurrentConfig() {
    return getDiceConfiguration();
  }

  function renderDistribution(distribution = [], targetSum = getCurrentConfig().targetSum) {
    const maxCount = Math.max(0, ...distribution.map((item) => item.count));
    elements.frequencyChart.style.setProperty('--sum-count', String(distribution.length || 1));
    elements.frequencyChart.innerHTML = distribution.map(({ sum, count }) => {
      const height = maxCount === 0 ? 2 : Math.max(3, (count / maxCount) * 100);
      const isTarget = sum === targetSum;
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
    renderDistribution(result.distribution, result.targetSum);
    const difference = Math.abs(result.experimentalPercentage - result.theoreticalPercentage);
    elements.experimentInsight.textContent =
      `Dari ${result.trialCount} percobaan dengan ${result.diceCount} dadu, jumlah ${result.targetSum} muncul ${result.favorableCount} kali. ` +
      `Hasil empiris ${formatPercent(result.experimentalPercentage)}, sedangkan peluang teoritis ${formatPercent(result.theoreticalPercentage)}. ` +
      `Selisihnya ${difference.toFixed(2).replace('.', ',')} poin persentase. Semakin banyak percobaan, frekuensi relatif cenderung mendekati peluang teoritis.`;
  }

  function reset() {
    executionId += 1;
    currentResult = null;
    const { diceCount, targetSum } = getCurrentConfig();
    const minimumSum = diceCount;
    const emptyDistribution = Array.from({ length: diceCount * 5 + 1 }, (_, index) => ({
      sum: minimumSum + index,
      count: 0,
    }));
    elements.trialTotal.textContent = '—';
    elements.hitTotal.textContent = '—';
    elements.experimentalRate.textContent = '—';
    elements.theoreticalRate.textContent = formatPercent(
      getDiceSumOutcomes(targetSum, diceCount).filter((outcome) => outcome.favorable).length /
      (6 ** diceCount) * 100,
    );
    elements.experimentBar.style.width = '0%';
    elements.experimentBar.setAttribute('aria-valuenow', '0');
    elements.experimentTarget.textContent = `TARGET: ${targetSum}`;
    elements.hitTotalLabel.textContent = `JUMLAH ${targetSum} MUNCUL`;
    elements.experimentInsight.textContent = 'Jalankan percobaan untuk membandingkan frekuensi simulasi dengan peluang teoritis.';
    elements.experimentStatus.textContent = 'Belum ada percobaan. Pilih jumlah percobaan, lalu mulai simulasi.';
    elements.runExperiment.disabled = false;
    elements.resetExperiment.disabled = false;
    renderDistribution(emptyDistribution, targetSum);
  }

  async function run() {
    const config = getCurrentConfig();
    const result = runDiceExperiment(Number(elements.trialCount.value), Math.random, config);
    const runId = ++executionId;
    currentResult = result;
    renderResult(result);
    elements.runExperiment.disabled = true;
    elements.resetExperiment.disabled = true;
    elements.experimentStatus.textContent =
      `Menampilkan ${result.preview.length} contoh lemparan pertama. Statistik dihitung dari seluruh ${result.trialCount} percobaan.`;
    try {
      for (const outcome of result.preview) {
        if (runId !== executionId) return;
        await scene.rollTo(outcome.values, 0.34);
      }
      if (runId === executionId) {
        elements.experimentStatus.textContent =
          `Selesai: ${result.trialCount} percobaan dihitung. Animasi 3D menampilkan ${result.preview.length} contoh hasil.`;
      }
    } catch (error) {
      console.error('Animasi eksperimen gagal:', error);
      elements.experimentStatus.textContent = 'Perhitungan selesai, tetapi animasi 3D tidak dapat dijalankan.';
    } finally {
      if (runId === executionId) {
        elements.runExperiment.disabled = false;
        elements.resetExperiment.disabled = false;
      }
    }
  }

  elements.runExperiment.addEventListener('click', run);
  elements.resetExperiment.addEventListener('click', reset);
  const unsubscribe = onDiceConfigurationChange(reset);
  reset();

  return {
    getLastResult: () => currentResult,
    dispose() {
      executionId += 1;
      unsubscribe();
      elements.runExperiment.removeEventListener('click', run);
      elements.resetExperiment.removeEventListener('click', reset);
    },
  };
}
