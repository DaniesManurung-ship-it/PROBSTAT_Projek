const sampleGrid = document.querySelector('#home-sample-grid');
const targetFilter = document.querySelector('#home-target-filter');

if (!sampleGrid || !targetFilter) {
  throw new Error('Elemen simulasi beranda tidak ditemukan.');
}

const outcomes = [];
let selectedOutcome = [3, 4];

function isTarget(first, second) {
  const sum = first + second;
  switch (targetFilter.value) {
    case 'even':
      return sum % 2 === 0;
    case 'odd':
      return sum % 2 !== 0;
    case 'same':
      return first === second;
    case 'ten-plus':
      return sum >= 10;
    default:
      return sum === 7;
  }
}

function createSampleCells() {
  for (let first = 1; first <= 6; first += 1) {
    for (let second = 1; second <= 6; second += 1) {
      const cell = document.createElement('button');
      cell.className = 'home-sample-cell';
      cell.type = 'button';
      cell.dataset.first = String(first);
      cell.dataset.second = String(second);
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `Dadu pertama ${first}, dadu kedua ${second}, jumlah ${first + second}`);

      const pair = document.createElement('span');
      pair.textContent = `(${first}, ${second})`;
      const sum = document.createElement('small');
      sum.textContent = `Jml: ${first + second}`;
      cell.append(pair, sum);
      sampleGrid.append(cell);
    }
  }
}

function updateDiceDisplay(first, second) {
  document.querySelectorAll('[data-home-die-a]').forEach((die) => {
    die.textContent = String(first);
  });
  document.querySelectorAll('[data-home-die-b]').forEach((die) => {
    die.textContent = String(second);
  });
  document.querySelectorAll('[data-home-sum]').forEach((total) => {
    total.textContent = String(first + second);
  });

  const status = document.querySelector('#home-target-status');
  const matched = isTarget(first, second);
  status.classList.toggle('is-hit', matched);
  status.textContent = matched ? 'COCOK DENGAN TARGET' : 'BUKAN TARGET';
}

function renderStatistics() {
  const favorableCount = Array.from({ length: 36 }, (_, index) => {
    const first = Math.floor(index / 6) + 1;
    const second = (index % 6) + 1;
    return isTarget(first, second);
  }).filter(Boolean).length;
  const hits = outcomes.filter(([first, second]) => isTarget(first, second)).length;
  const theoreticalPercent = (favorableCount / 36) * 100;
  const empiricalPercent = outcomes.length ? (hits / outcomes.length) * 100 : 0;
  const theoreticalText = `${favorableCount} / 36 (${theoreticalPercent.toFixed(2).replace('.', ',')}%)`;
  const empiricalText = outcomes.length
    ? `${hits} / ${outcomes.length} (${empiricalPercent.toFixed(2).replace('.', ',')}%)`
    : '0 / 0 (0%)';

  document.querySelector('#home-roll-count').textContent = `Total Lemparan: ${outcomes.length}`;
  document.querySelector('#home-theory-ratio').textContent = theoreticalText;
  document.querySelector('#home-empirical-ratio').textContent = empiricalText;
  document.querySelector('#home-theory-bar').style.width = `${theoreticalPercent}%`;
  document.querySelector('#home-empirical-bar').style.width = `${Math.min(empiricalPercent, 100)}%`;
  document.querySelector('#home-matrix-target').textContent = `${favorableCount} hasil cocok`;
  document.querySelector('[data-home-probability]').textContent = `P(A) = ${favorableCount}/36 (${theoreticalPercent.toFixed(2).replace('.', ',')}%)`;

  sampleGrid.querySelectorAll('.home-sample-cell').forEach((cell) => {
    const first = Number(cell.dataset.first);
    const second = Number(cell.dataset.second);
    cell.classList.toggle('is-favorable', isTarget(first, second));
    cell.classList.toggle('is-rolled', selectedOutcome?.[0] === first && selectedOutcome?.[1] === second);
    cell.setAttribute('aria-pressed', String(selectedOutcome?.[0] === first && selectedOutcome?.[1] === second));
  });
}

function recordOutcome(first, second) {
  selectedOutcome = [first, second];
  outcomes.push(selectedOutcome);
  updateDiceDisplay(first, second);
  renderStatistics();
}

createSampleCells();
updateDiceDisplay(...selectedOutcome);
renderStatistics();

document.querySelectorAll('[data-home-roll]').forEach((button) => {
  button.addEventListener('click', () => {
    recordOutcome(Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1);
    if (button.hasAttribute('data-home-scroll-lab')) {
      document.querySelector('#home-lab').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelector('[data-home-batch]').addEventListener('click', () => {
  for (let trial = 0; trial < 100; trial += 1) {
    selectedOutcome = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    outcomes.push(selectedOutcome);
  }
  updateDiceDisplay(...selectedOutcome);
  renderStatistics();
});

document.querySelector('[data-home-reset]').addEventListener('click', () => {
  outcomes.length = 0;
  selectedOutcome = [3, 4];
  updateDiceDisplay(...selectedOutcome);
  renderStatistics();
});

targetFilter.addEventListener('change', () => {
  updateDiceDisplay(...selectedOutcome);
  renderStatistics();
});

sampleGrid.addEventListener('click', (event) => {
  const cell = event.target instanceof Element
    ? event.target.closest('.home-sample-cell')
    : null;
  if (!cell) return;

  recordOutcome(Number(cell.dataset.first), Number(cell.dataset.second));
});
