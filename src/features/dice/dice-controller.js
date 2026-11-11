import { calculateProbability, getDiceSumOutcomes, getRandomDieValue, MAX_DICE_COUNT } from '../probability/dice-probability.js';

const MIN_DICE_COUNT = 1;

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifyFraction(num, den) {
  const divisor = gcd(Math.abs(num), Math.abs(den));
  return `${num / divisor}/${den / divisor}`;
}

function formatPercent(value) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

function formatValues(values) {
  return `(${values.join(', ')})`;
}

function createDieFace(value) {
  const face = document.createElement('span');
  face.className = 'mini-die-face';
  face.setAttribute('aria-hidden', 'true');
  const positions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  for (let index = 0; index < 9; index += 1) {
    const pip = document.createElement('i');
    if (positions[value].includes(index)) pip.className = 'pip';
    face.appendChild(pip);
  }
  return face;
}

export function createDiceController({ scene, elements }) {
  if (!scene || !elements) throw new TypeError('Scene dan elemen dadu wajib tersedia.');

  let diceCount = Number(elements.diceCount.value) || 2;
  let targetSum = Number(elements.targetSum.value) || 7;
  let outcomes = [];
  let currentStep = 0;
  let listeners = new Set();
  let busy = false;
  let configurationPending = false;
  let selectedValues = Array(diceCount).fill(1);

  function getConfiguration() {
    return { diceCount, targetSum };
  }

  function currentProbability() {
    return calculateProbability(
      outcomes.filter((outcome) => outcome.favorable).length,
      outcomes.length,
    );
  }

  function updateReadout(values) {
    selectedValues = [...values];
    const sum = values.reduce((total, value) => total + value, 0);
    elements.diceValues.innerHTML = '';
    values.forEach((value, index) => {
      if (index) {
        const plus = document.createElement('span');
        plus.className = 'readout-plus';
        plus.textContent = '+';
        elements.diceValues.appendChild(plus);
      }
      const die = document.createElement('div');
      die.className = 'die-readout';
      die.innerHTML = `<span>DADU ${String.fromCharCode(65 + index)}</span>`;
      const face = document.createElement('b');
      face.textContent = String(value);
      die.appendChild(face);
      elements.diceValues.appendChild(die);
    });
    elements.sumValue.textContent = String(sum);
    elements.sampleGrid.querySelectorAll('.outcome').forEach((button) => {
      const isSelected = button.dataset.values === JSON.stringify(values);
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function renderSampleGrid() {
    elements.sampleGrid.innerHTML = '';
    elements.sampleGrid.style.setProperty('--dice-count', String(diceCount));
    for (const outcome of outcomes) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `outcome${outcome.favorable ? ' favorable' : ''}`;
      button.dataset.values = JSON.stringify(outcome.values);
      button.setAttribute('aria-label', `Dadu ${outcome.values.join(', ')}, jumlah ${outcome.sum}${outcome.favorable ? ', sesuai target' : ''}`);
      button.setAttribute('aria-pressed', 'false');
      const dice = document.createElement('span');
      dice.className = 'outcome-dice';
      outcome.values.forEach((value, index) => {
        if (index) {
          const plus = document.createElement('i');
          plus.className = 'outcome-plus';
          plus.textContent = '+';
          dice.appendChild(plus);
        }
        dice.appendChild(createDieFace(value));
      });
      const sum = document.createElement('b');
      sum.className = 'outcome-sum';
      sum.textContent = `= ${outcome.sum}`;
      button.append(dice, sum);
      button.addEventListener('click', async () => {
        updateReadout(outcome.values);
        try {
          await scene.rollTo(outcome.values, 0.9);
        } catch (error) {
          console.error('Animasi hasil pilihan gagal:', error);
        }
      });
      elements.sampleGrid.appendChild(button);
    }
    const favorableCount = outcomes.filter((outcome) => outcome.favorable).length;
    elements.sampleHeading.textContent = `${favorableCount} dari ${outcomes.length} kemungkinan`;
    elements.sampleCount.textContent = `target jumlah ${targetSum}`;
    elements.sampleGrid.setAttribute('aria-label', `${outcomes.length} kemungkinan hasil untuk ${diceCount} dadu`);
    elements.favorableLegend.textContent = `Jumlah = ${targetSum}`;
    const minimumSum = diceCount;
    const maximumSum = diceCount * 6;
    if (favorableCount === 0) {
      elements.sampleExplanation.textContent =
        `Tidak ada kombinasi yang cocok. Dengan ${diceCount} dadu, jumlah terkecil adalah ${minimumSum} dan terbesar ${maximumSum}. Karena target ${targetSum} berada di luar rentang ${minimumSum}–${maximumSum}, peluangnya 0 dari ${outcomes.length}, yaitu 0%.`;
    } else {
      const combinations = outcomes
        .filter((outcome) => outcome.favorable)
        .map((outcome) => formatValues(outcome.values));
      const shownCombinations = combinations.slice(0, 12).join(', ');
      const remaining = combinations.length > 12
        ? `, dan ${combinations.length - 12} susunan lainnya`
        : '';
      elements.sampleExplanation.textContent =
        `Dari ${outcomes.length} kemungkinan, ${favorableCount} susunan menghasilkan jumlah ${targetSum}: ${shownCombinations}${remaining}. Setiap susunan berurutan dihitung sebagai hasil berbeda. Jadi peluangnya ${favorableCount}/${outcomes.length} = ${formatPercent(currentProbability().percentage)}.`;
    }
    elements.question.textContent = diceCount === 1
      ? `Sebuah dadu dilempar. Berapa peluang mata dadu yang muncul berjumlah ${targetSum}?`
      : `${diceCount} dadu dilempar secara bersamaan. Berapa peluang jumlah mata dadu yang muncul adalah ${targetSum}?`;
    elements.answerFraction.textContent = simplifyFraction(favorableCount, outcomes.length);
    elements.answerPercent.textContent = `= ${formatPercent(currentProbability().percentage)}`;
    elements.answerDescription.textContent = favorableCount
      ? `${favorableCount} dari ${outcomes.length} kemungkinan menghasilkan jumlah mata dadu ${targetSum}.`
      : `Target ${targetSum} tidak dapat dicapai dengan ${diceCount} dadu; jumlah yang mungkin hanya ${minimumSum} sampai ${maximumSum}.`;
    elements.answerCount.textContent = `${favorableCount} dari ${outcomes.length} hasil`;
    elements.answerBar.style.width = `${currentProbability().percentage}%`;
    updateReadout(selectedValues);
  }

  function renderStep() {
    const favorable = outcomes.filter((outcome) => outcome.favorable);
    const probability = currentProbability();
    const combinations = favorable.slice(0, 8).map((outcome) => formatValues(outcome.values)).join(', ');
    const more = favorable.length > 8 ? `, dan ${favorable.length - 8} kombinasi lainnya` : '';
    const orderExplanation = diceCount === 2
      ? 'Contohnya, (6, 1) dan (1, 6) adalah dua hasil berbeda: nilai pertama berasal dari dadu pertama, sedangkan nilai kedua berasal dari dadu kedua.'
      : 'Setiap susunan nilai pada dadu dihitung sebagai satu hasil tersendiri.';
    const steps = [
      {
        title: 'Kenali seluruh kemungkinan',
        description: diceCount === 1
          ? 'Satu dadu memiliki 6 sisi, jadi ada 6 hasil yang mungkin.'
          : `Setiap dadu memiliki 6 sisi. Kalikan 6 untuk setiap dadu: setiap nilai dadu dapat dipasangkan dengan semua nilai dadu lainnya.`,
        math: `6${diceCount > 1 ? `^${diceCount}` : ''} = <b>${outcomes.length} kemungkinan</b>`,
      },
      {
        title: 'Tentukan kejadian yang dicari',
        description: `Kita mencari hasil yang jumlah seluruh mata dadu tepat ${targetSum}. ${orderExplanation}`,
        math: `Jumlah mata dadu = <b>${targetSum}</b>`,
      },
      {
        title: 'Hitung hasil yang sesuai',
        description: favorable.length
          ? `Ada ${favorable.length} susunan yang sesuai: ${combinations}${more}. Kotak berwarna menandai hasil-hasil tersebut.`
          : `Tidak ada susunan dadu yang jumlahnya ${targetSum}. Dengan ${diceCount} dadu, jumlah terkecil adalah ${diceCount} dan terbesar ${diceCount * 6}, sehingga target ini tidak mungkin dicapai.`,
        math: `n(A) = <b>${favorable.length} kejadian</b>`,
      },
      {
        title: 'Bandingkan dan dapatkan peluang',
        description: favorable.length
          ? `Peluang teoritis diperoleh dengan membagi jumlah hasil yang sesuai dengan semua kemungkinan. Hasilnya adalah ${favorable.length} dari ${outcomes.length}.`
          : `Karena tidak ada satu pun hasil yang bisa mencapai target ${targetSum}, pembilangnya 0. Jadi peluangnya 0 dibagi ${outcomes.length}, yaitu 0%.`,
        math: `P(A) = ${favorable.length}/${outcomes.length} = <b>${simplifyFraction(favorable.length, outcomes.length)} = ${formatPercent(probability.percentage)}</b>`,
      },
    ];
    const step = steps[currentStep];
    elements.stepLabel.textContent = `LANGKAH ${currentStep + 1}`;
    elements.stepTitle.textContent = step.title;
    elements.stepDescription.textContent = step.description;
    elements.stepMath.innerHTML = step.math;
    elements.stepCounter.textContent = `${String(currentStep + 1).padStart(2, '0')} / 04`;
    [...elements.stepProgress.children].forEach((node, index) => node.classList.toggle('active', index <= currentStep));
    elements.prevStep.disabled = currentStep === 0;
    elements.nextStep.innerHTML = currentStep === steps.length - 1
      ? 'Ulangi penjelasan <span>↻</span>'
      : 'Langkah berikutnya <span>→</span>';
  }

  function markConfigurationPending() {
    elements.targetSum.setCustomValidity('');
    configurationPending = true;
    elements.applyConfiguration.disabled = busy;
    elements.configurationStatus.textContent = 'Pengaturan belum diterapkan. Tekan Terapkan untuk memperbarui peluang dan ruang sampel.';
  }

  function updateConfiguration() {
    const nextCount = Number(elements.diceCount.value);
    if (!Number.isInteger(nextCount) || nextCount < MIN_DICE_COUNT || nextCount > MAX_DICE_COUNT) {
      throw new RangeError(`Jumlah dadu harus antara ${MIN_DICE_COUNT} dan ${MAX_DICE_COUNT}.`);
    }
    if (!elements.targetSum.reportValidity()) {
      elements.configurationStatus.textContent = 'Masukkan target berupa bilangan bulat, lalu tekan Terapkan.';
      return;
    }
    const nextTarget = Number(elements.targetSum.value);
    if (!Number.isSafeInteger(nextTarget)) {
      elements.targetSum.setCustomValidity('Target harus berupa bilangan bulat yang valid.');
      elements.targetSum.reportValidity();
      elements.configurationStatus.textContent = 'Masukkan target berupa bilangan bulat yang valid.';
      return;
    }
    elements.targetSum.setCustomValidity('');
    diceCount = nextCount;
    targetSum = nextTarget;
    outcomes = getDiceSumOutcomes(targetSum, diceCount);
    selectedValues = Array(diceCount).fill(1);
    currentStep = 0;
    scene.setDiceCount(diceCount);
    scene.rollTo(selectedValues, 0.3).catch((error) => console.error('Animasi penerapan konfigurasi gagal:', error));
    configurationPending = false;
    elements.applyConfiguration.disabled = true;
    const minimumSum = diceCount;
    const maximumSum = diceCount * 6;
    elements.configurationStatus.textContent = targetSum < minimumSum || targetSum > maximumSum
      ? `Pengaturan diterapkan. ${diceCount} dadu hanya dapat menghasilkan jumlah ${minimumSum}–${maximumSum}, jadi target ${targetSum} memiliki peluang 0%.`
      : `Pengaturan diterapkan: ${diceCount} ${diceCount === 1 ? 'dadu' : 'dadu'}, target jumlah ${targetSum}.`;
    renderSampleGrid();
    renderStep();
    for (const listener of listeners) listener(getConfiguration());
  }

  async function rollRandom() {
    if (busy) return;
    const values = Array.from({ length: diceCount }, () => getRandomDieValue());
    updateReadout(values);
    busy = true;
    elements.rollDice.disabled = true;
    elements.diceCount.disabled = true;
    elements.targetSum.disabled = true;
    elements.applyConfiguration.disabled = true;
    try {
      await scene.rollTo(values);
    } finally {
      busy = false;
      elements.rollDice.disabled = false;
      elements.diceCount.disabled = false;
      elements.targetSum.disabled = false;
      elements.applyConfiguration.disabled = !configurationPending;
    }
  }

  function changeStep(direction) {
    currentStep = (currentStep + direction + 4) % 4;
    renderStep();
  }

  elements.rollDice.addEventListener('click', rollRandom);
  elements.diceCount.addEventListener('change', markConfigurationPending);
  elements.targetSum.addEventListener('input', markConfigurationPending);
  elements.applyConfiguration.addEventListener('click', updateConfiguration);
  elements.prevStep.addEventListener('click', () => changeStep(-1));
  elements.nextStep.addEventListener('click', () => changeStep(1));

  outcomes = getDiceSumOutcomes(targetSum, diceCount);
  scene.setDiceCount(diceCount);
  renderSampleGrid();
  renderStep();
  scene.rollTo(selectedValues, 0.25).catch((error) => console.error('Animasi awal dadu gagal:', error));

  return {
    getConfiguration,
    onConfigurationChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      elements.rollDice.removeEventListener('click', rollRandom);
      elements.diceCount.removeEventListener('change', markConfigurationPending);
      elements.targetSum.removeEventListener('input', markConfigurationPending);
      elements.applyConfiguration.removeEventListener('click', updateConfiguration);
      listeners.clear();
    },
  };
}
