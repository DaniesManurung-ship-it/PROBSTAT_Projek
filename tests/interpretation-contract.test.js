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

test('rejects a contradictory draw without replacement', () => {
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

  assert.equal(result.valid, false);
  assert.match(result.error, /tidak cukup/);
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
