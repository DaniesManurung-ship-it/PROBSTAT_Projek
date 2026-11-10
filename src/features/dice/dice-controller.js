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

export function createDiceController({ scene, elements }) {
  let currentStep = 0;
  let selectedOutcome = { dieA: 1, dieB: 1, sum: 2 };
  const outcomes = getDiceSumOutcomes(7);

  function updateReadout(dieA, dieB) {
    selectedOutcome = { dieA, dieB, sum: dieA + dieB };
    elements.dieAValue.textContent = String(dieA);
    elements.dieBValue.textContent = String(dieB);
    elements.sumValue.textContent = String(dieA + dieB);
    elements.sampleGrid.querySelectorAll('.outcome').forEach((button) => {
      const isSelected = Number(button.dataset.a) === dieA && Number(button.dataset.b) === dieB;
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function renderSampleGrid() {
    elements.sampleGrid.innerHTML = '';
    for (const outcome of outcomes) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `outcome${outcome.favorable ? ' favorable' : ''}`;
      button.dataset.a = String(outcome.dieA);
      button.dataset.b = String(outcome.dieB);
      button.setAttribute('aria-label', `Dadu ${outcome.dieA} dan ${outcome.dieB}, jumlah ${outcome.sum}`);
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
    elements.stepLabel.textContent = step.label;
    elements.stepTitle.textContent = step.title;
    elements.stepDescription.textContent = step.description;
    elements.stepMath.innerHTML = step.math;
    elements.stepCounter.textContent = `${String(currentStep + 1).padStart(2, '0')} / 04`;
    [...elements.stepProgress.children].forEach((node, index) => node.classList.toggle('active', index <= currentStep));
    elements.prevStep.disabled = currentStep === 0;
    elements.nextStep.innerHTML = currentStep === STEPS.length - 1 ? 'Ulangi penjelasan <span>↻</span>' : 'Langkah berikutnya <span>→</span>';
  }

  async function rollRandom() {
    const dieA = getRandomDieValue();
    const dieB = getRandomDieValue();
    updateReadout(dieA, dieB);
    elements.rollDice.disabled = true;
    try {
      await scene.rollTo(dieA, dieB);
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
      }
    } finally {
      elements.showFavorable.disabled = false;
    }
  }

  elements.rollDice.addEventListener('click', rollRandom);
  elements.showFavorable.addEventListener('click', showFavorableOutcomes);
  elements.prevStep.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    renderStep();
  });
  elements.nextStep.addEventListener('click', () => {
    currentStep = currentStep === STEPS.length - 1 ? 0 : currentStep + 1;
    renderStep();
  });

  renderSampleGrid();
  renderStep();
  updateReadout(selectedOutcome.dieA, selectedOutcome.dieB);
  scene.rollTo(1, 1, 0.25);
}
