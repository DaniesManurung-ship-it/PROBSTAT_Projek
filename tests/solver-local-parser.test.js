import test from 'node:test';
import assert from 'node:assert/strict';

const createElementStub = () => ({
  id: '',
  hidden: false,
  value: '',
  textContent: '',
  innerHTML: '',
  dataset: {},
  style: {},
  children: [],
  clientWidth: 600,
  clientHeight: 220,
  classList: {
    add() {},
    remove() {},
    contains() { return false; }
  },
  appendChild(child) { this.children.push(child); return child; },
  replaceChildren() { this.children = []; },
  addEventListener() {},
  removeEventListener() {},
  focus() {},
  scrollIntoView() {},
  setAttribute() {},
  getContext() {
    return {
      fillStyle: '',
      fillRect() {},
      beginPath() {},
      arc() {},
      fill() {},
      textAlign: '',
      textBaseline: '',
      font: '',
      fillText() {},
      clearRect() {}
    };
  },
  dispose() {}
});

globalThis.window = {
  devicePixelRatio: 1,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {}
};
globalThis.CustomEvent = class {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};

globalThis.document = {
  elements: new Map(),
  getElementById(id) {
    if (!this.elements.has(id)) this.elements.set(id, createElementStub());
    return this.elements.get(id);
  },
  querySelectorAll: () => [],
  createElement: () => createElementStub()
};

globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
};

globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { analyzeProblem, runAnalysis } =
  await import('../src/features/solver/probability-solver.js');
const { solveBinomialInterpretation } =
  await import('../src/features/solver/binomial-interpretation-engine.js');

test('parser lokal menangani soal satu dadu dengan nilai di luar rentang sebagai peluang nol', () => {
  const result = analyzeProblem('peluang dapat 7 dari pelemparan 1 dadu');

  assert.equal(result.model, 'dice-single');
  assert.equal(result.favorable, 0);
  assert.equal(result.total, 6);
  assert.equal(result.percentage, 0);
});

test('parser lokal tetap mengenali kejadian angka tertentu pada satu dadu', () => {
  const result = analyzeProblem('peluang muncul angka 4 pada sebuah dadu');

  assert.equal(result.model, 'dice-single');
  assert.equal(result.favorable, 1);
  assert.equal(result.total, 6);
  assert.ok(Math.abs(result.percentage - 100 / 6) < 1e-12);
});

test('mesin lokal menghitung dua bola merah yang diambil sekaligus tanpa pengembalian', () => {
  const result = analyzeProblem(
    'Dalam sebuah kotak terdapat 4 bola merah, 5 bola biru, dan 0 bola kuning. ' +
    'Berapa peluang mengambil dua bola merah tanpa pengembalian?'
  );

  assert.equal(result.model, 'balls');
  assert.equal(result.favorable, 12);
  assert.equal(result.total, 72);
  assert.equal(result.fraction, '1/6');
  assert.ok(Math.abs(result.percentage - 100 / 6) < 1e-12);
});

test('menghitung kartu As merah sebagai irisan As dan kartu merah', () => {
  const result = analyzeProblem('Peluang mengambil kartu As merah dari 52 kartu remi?');

  assert.equal(result.model, 'cards');
  assert.equal(result.favorable, 2);
  assert.equal(result.total, 52);
  assert.equal(result.fraction, '1/26');
});

test('menghitung peluang binomial penjaga sebesar 0.3456, bukan 0.6912', () => {
  const result = solveBinomialInterpretation({
    n: 5,
    target: 3,
    successProbability: 0.6
  });

  assert.equal(result.fraction, '0.3456');
  assert.equal(result.percentage, 34.56);
  assert.match(result.steps.join(' '), /10/);
});

test('menggunakan hasil lokal binomial setelah Gemini menerjemahkan soal', async () => {
  const interpretation = {
    status: 'success',
    category: 'binomial',
    confidence: 0.95,
    diceCount: null,
    sidesPerDie: null,
    trialCount: null,
    eventType: 'binomial_exact',
    target: 3,
    successProbability: 0.6,
    coinSide: 'unknown',
    cardEvent: 'unknown',
    ballCounts: null,
    ballTarget: 'unknown',
    drawCount: null,
    replacement: 'not_applicable',
    countingType: 'not_applicable',
    n: 5,
    r: null,
    population: null,
    mathCount: null,
    physicsCount: null,
    bothCount: null,
    conditionalEvent: 'unknown',
    solution: null,
    missingInformation: [],
    clarification: '',
    interpretation: 'Tepat 3 tangkapan berhasil dari 5 tendangan, dengan peluang sukses 3/5.'
  };
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => JSON.stringify({
      interpretation,
      interpretationSource: 'gemini',
      requestStatus: 'completed'
    })
  });

  try {
    document.getElementById('solver-question').value =
      'Peluang menahan 3 dari 5 tendangan jika peluang menahan satu tendangan adalah 3/5?';
    await runAnalysis();

    assert.equal(document.getElementById('solver-answer').textContent, '0.3456');
    assert.equal(document.getElementById('solver-percentage').textContent, '34.56%');
    assert.match(document.getElementById('solver-fraction').textContent, /C\(5, 3\)/);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('mengirim soal yang dikenali parser lokal ke Gemini sebelum memutuskan hasil', async () => {
  const question = 'peluang muncul angka 4 pada sebuah dadu';
  assert.equal(analyzeProblem(question).model, 'dice-single');

  const interpretation = {
    status: 'clarification',
    category: 'dice',
    confidence: 0.9,
    diceCount: 1,
    sidesPerDie: 6,
    trialCount: null,
    eventType: 'face_equals',
    target: 4,
    successProbability: null,
    coinSide: 'unknown',
    cardEvent: 'unknown',
    ballCounts: null,
    ballTarget: 'unknown',
    drawCount: null,
    replacement: 'not_applicable',
    countingType: 'not_applicable',
    n: null,
    r: null,
    population: null,
    mathCount: null,
    physicsCount: null,
    bothCount: null,
    conditionalEvent: 'unknown',
    missingInformation: ['konteks soal'],
    clarification: 'Apa yang dimaksud dengan soal ini?',
    interpretation: 'Saya perlu memastikan maksud soal.'
  };
  const previousFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (_url, options) => {
    request = JSON.parse(options.body);
    return {
      ok: true,
      text: async () => JSON.stringify({
        interpretation,
        interpretationSource: 'gemini',
        requestStatus: 'completed'
      })
    };
  };

  try {
    document.getElementById('solver-question').value = question;
    await runAnalysis();
    assert.equal(request.question, question);
    assert.equal(document.getElementById('solver-status').dataset.interpretationSource, 'gemini');
    assert.match(document.getElementById('solver-status').textContent, /informasi tambahan/i);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('menampilkan jawaban Gemini bila kategori soal belum tersedia di mesin lokal', async () => {
  const solution = {
    formula: 'P(A) = |A| / |S|',
    answer: '1/2',
    steps: ['Ruang sampel berisi dua hasil yang sama mungkin.', 'Satu hasil memenuhi kejadian.']
  };
  const interpretation = {
    status: 'ai_solved',
    category: 'out_of_scope',
    confidence: 0.9,
    diceCount: null,
    sidesPerDie: null,
    trialCount: null,
    eventType: 'unknown',
    target: null,
    successProbability: null,
    coinSide: 'unknown',
    cardEvent: 'unknown',
    ballCounts: null,
    ballTarget: 'unknown',
    drawCount: null,
    replacement: 'not_applicable',
    countingType: 'not_applicable',
    n: null,
    r: null,
    population: null,
    mathCount: null,
    physicsCount: null,
    bothCount: null,
    conditionalEvent: 'unknown',
    solution,
    missingInformation: [],
    clarification: '',
    interpretation: 'Peluang kejadian A adalah setengah.'
  };
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => JSON.stringify({
      interpretation,
      interpretationSource: 'gemini',
      requestStatus: 'completed'
    })
  });

  try {
    document.getElementById('solver-question').value = 'Soal probabilitas lain.';
    await runAnalysis();
    assert.equal(document.getElementById('solver-output').hidden, false);
    assert.equal(document.getElementById('solver-answer').textContent, '1/2');
    assert.equal(document.getElementById('solver-fraction').textContent, 'P(A) = |A| / |S|');
    assert.equal(document.getElementById('solver-steps').children.length, 2);
    assert.equal(document.getElementById('solver-scene').hidden, true);
    assert.equal(document.getElementById('guided-learning').hidden, true);
    assert.match(document.getElementById('solver-status').textContent, /diselesaikan oleh Gemini/);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
