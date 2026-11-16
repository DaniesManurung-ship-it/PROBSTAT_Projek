import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toCanonicalProblem,
  validateInterpretation
} from '../src/features/solver/interpretation-contract.js';

function interpretation(overrides = {}) {
  return {
    status: 'success',
    category: 'dice',
    confidence: 0.95,
    diceCount: 1,
    sidesPerDie: 6,
    trialCount: null,
    eventType: 'even',
    target: null,
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
    missingInformation: [],
    clarification: '',
    interpretation: 'Peluang memperoleh angka genap pada satu dadu.',
    ...overrides
  };
}

test('validates a supported dice interpretation and maps it to the local solver', () => {
  const result = validateInterpretation(interpretation());

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'success');
  assert.equal(
    toCanonicalProblem(result.data),
    'Sebuah dadu dilempar. Berapa peluang muncul angka genap?'
  );
});

test('requests clarification when a ball draw omits replacement information', () => {
  const result = validateInterpretation(interpretation({
    category: 'balls',
    eventType: 'same_color_draw',
    diceCount: null,
    sidesPerDie: null,
    ballCounts: { merah: 5, biru: 4, kuning: 0 },
    ballTarget: 'merah',
    drawCount: 2,
    replacement: 'unspecified'
  }));

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'clarification');
  assert.ok(result.data.missingInformation.some((item) => item.includes('pengembalian')));
  assert.equal(toCanonicalProblem(result.data), null);
});

test('keeps an impossible target-color draw calculable as zero probability', () => {
  const result = validateInterpretation(interpretation({
    category: 'balls',
    eventType: 'same_color_draw',
    diceCount: null,
    sidesPerDie: null,
    ballCounts: { merah: 1, biru: 4, kuning: 0 },
    ballTarget: 'merah',
    drawCount: 2,
    replacement: 'without'
  }));

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'success');
  assert.match(toCanonicalProblem(result.data), /tanpa pengembalian/);
});

test('does not pass contradictory conditional counts to the engine', () => {
  const result = validateInterpretation(interpretation({
    category: 'conditional',
    eventType: 'conditional',
    diceCount: null,
    sidesPerDie: null,
    population: 30,
    mathCount: 15,
    physicsCount: 12,
    bothCount: 16,
    conditionalEvent: 'math_given_physics'
  }));

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'clarification');
  assert.ok(result.data.missingInformation.length > 0);
  assert.equal(toCanonicalProblem(result.data), null);
});

test('asks for a valid condition when the conditioned event has zero members', () => {
  const result = validateInterpretation(interpretation({
    category: 'conditional',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'conditional',
    population: 10,
    mathCount: 0,
    physicsCount: 5,
    bothCount: 0,
    conditionalEvent: 'physics_given_math'
  }));

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'clarification');
  assert.match(result.data.missingInformation.join(' '), /syarat harus memiliki anggota/);
});

test('maps supported counting interpretations without calculating in the AI layer', () => {
  const result = validateInterpretation(interpretation({
    category: 'counting',
    eventType: 'counting',
    diceCount: null,
    sidesPerDie: null,
    countingType: 'combination',
    n: 8,
    r: 3
  }));

  assert.equal(result.valid, true);
  assert.equal(
    toCanonicalProblem(result.data),
    'kombinasi: berapa banyak cara memilih 3 objek dari 8 objek?'
  );
});

test('preserves provisional, clarification, and uncertain statuses', () => {
  const provisional = validateInterpretation(interpretation({
    status: 'needs_confirmation',
    diceCount: 2,
    eventType: 'sum_equals',
    target: 12,
    interpretation: 'Jumlah mata kedua dadu sama dengan 12.'
  }));
  assert.equal(provisional.valid, true);
  assert.equal(provisional.data.status, 'needs_confirmation');
  assert.equal(toCanonicalProblem(provisional.data), null);

  const unclear = validateInterpretation(interpretation({
    status: 'uncertain',
    confidence: 0.6
  }));
  assert.equal(unclear.valid, true);
  assert.equal(unclear.data.status, 'uncertain');
});

test('keeps distinct two-dice event semantics in the canonical problem', () => {
  const base = interpretation({
    diceCount: 2,
    eventType: 'product_equals',
    target: 12
  });
  const product = validateInterpretation(base);
  const sum = validateInterpretation({ ...base, eventType: 'sum_equals' });
  const same = validateInterpretation({ ...base, eventType: 'same_faces', target: null });
  const atLeastOne = validateInterpretation({
    ...base,
    eventType: 'at_least_one_face_equals',
    target: 4
  });

  assert.match(toCanonicalProblem(product.data), /hasil kali/);
  assert.match(toCanonicalProblem(sum.data), /jumlah mata/);
  assert.match(toCanonicalProblem(same.data), /angka yang sama/);
  assert.match(toCanonicalProblem(atLeastOne.data), /minimal satu dadu/);
});

test('marks unsupported die characteristics and repeated trials without guessing', () => {
  const nonstandard = validateInterpretation(interpretation({
    diceCount: 1,
    sidesPerDie: 8,
    eventType: 'face_equals',
    target: 8
  }));
  const repeated = validateInterpretation(interpretation({
    trialCount: 5
  }));

  assert.equal(nonstandard.valid, true);
  assert.equal(nonstandard.data.status, 'unsupported');
  assert.equal(repeated.valid, true);
  assert.equal(repeated.data.status, 'unsupported');
  assert.equal(toCanonicalProblem(repeated.data), null);
});

test('accepts a mathematically impossible but unambiguous event as calculable', () => {
  const result = validateInterpretation(interpretation({
    diceCount: 2,
    eventType: 'sum_equals',
    target: 13
  }));

  assert.equal(result.valid, true);
  assert.equal(result.data.status, 'success');
  assert.match(toCanonicalProblem(result.data), /sama dengan 13/);
});

test('validates coin, card, balls, and conditional probability intents', () => {
  const cases = [
    interpretation({
      category: 'coin',
      diceCount: null,
      sidesPerDie: null,
      eventType: 'coin_side',
      coinSide: 'gambar'
    }),
    interpretation({
      category: 'cards',
      diceCount: null,
      sidesPerDie: null,
      eventType: 'card_event',
      cardEvent: 'ace'
    }),
    interpretation({
      category: 'balls',
      diceCount: null,
      sidesPerDie: null,
      eventType: 'color_draw',
      ballCounts: { merah: 5, biru: 3, kuning: 0 },
      ballTarget: 'merah',
      drawCount: 1
    }),
    interpretation({
      category: 'conditional',
      diceCount: null,
      sidesPerDie: null,
      eventType: 'conditional',
      population: 40,
      mathCount: 20,
      physicsCount: 15,
      bothCount: 10,
      conditionalEvent: 'math_given_physics'
    })
  ];

  for (const data of cases) {
    const result = validateInterpretation(data);
    assert.equal(result.valid, true);
    assert.equal(result.data.status, 'success');
  }
});

test('clarifies missing math data and marks outside-scope questions explicitly', () => {
  const incomplete = validateInterpretation(interpretation({
    category: 'balls',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'color_draw',
    ballCounts: null,
    ballTarget: 'merah',
    drawCount: 1
  }));
  const unsupported = validateInterpretation(interpretation({
    status: 'unsupported',
    category: 'out_of_scope'
  }));

  assert.equal(incomplete.valid, true);
  assert.equal(incomplete.data.status, 'clarification');
  assert.equal(unsupported.valid, true);
  assert.equal(unsupported.data.status, 'unsupported');
});
