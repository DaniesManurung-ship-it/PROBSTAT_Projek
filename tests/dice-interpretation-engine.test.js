import test from 'node:test';
import assert from 'node:assert/strict';
import { solveDiceInterpretation } from '../src/features/solver/dice-interpretation-engine.js';

function twoDice(eventType, target = null) {
  return {
    category: 'dice',
    diceCount: 2,
    sidesPerDie: 6,
    eventType,
    target
  };
}

test('calculates the confirmed two-dice sum of 12 deterministically', () => {
  const result = solveDiceInterpretation(twoDice('sum_equals', 12));

  assert.equal(result.total, 36);
  assert.equal(result.favorable, 1);
  assert.equal(result.fraction, '1/36');
  assert.equal(result.percentage, 100 / 36);
});

test('calculates the sum of three dice with the complete 216-outcome sample space', () => {
  const result = solveDiceInterpretation({
    category: 'dice',
    diceCount: 3,
    sidesPerDie: 6,
    eventType: 'sum_equals',
    target: 7
  });

  assert.equal(result.diceCount, 3);
  assert.equal(result.total, 216);
  assert.equal(result.favorable, 15);
  assert.equal(result.fraction, '5/72');
  assert.equal(result.sample.length, 216);
});

test('returns zero probability for a clear but impossible sum', () => {
  const result = solveDiceInterpretation(twoDice('sum_equals', 13));

  assert.equal(result.total, 36);
  assert.equal(result.favorable, 0);
  assert.equal(result.fraction, '0/1');
  assert.equal(result.percentage, 0);
});

test('does not conflate sum, product, equal faces, and face-count events', () => {
  assert.equal(solveDiceInterpretation(twoDice('sum_equals', 12)).favorable, 1);
  assert.equal(solveDiceInterpretation(twoDice('product_equals', 12)).favorable, 4);
  assert.equal(solveDiceInterpretation(twoDice('same_faces')).favorable, 6);
  assert.equal(
    solveDiceInterpretation(twoDice('at_least_one_face_equals', 4)).favorable,
    11
  );
  assert.equal(
    solveDiceInterpretation(twoDice('at_most_one_face_equals', 4)).favorable,
    35
  );
});

test('solves a single-die face event and declines unsupported data', () => {
  const result = solveDiceInterpretation({
    category: 'dice',
    diceCount: 1,
    sidesPerDie: 6,
    eventType: 'face_equals',
    target: 4
  });

  assert.equal(result.total, 6);
  assert.equal(result.favorable, 1);
  assert.equal(solveDiceInterpretation({ ...twoDice('unknown'), category: 'coin' }), null);
});

test('calculates the probability that a die face is a factor of six', () => {
  const result = solveDiceInterpretation({
    category: 'dice',
    diceCount: 1,
    sidesPerDie: 6,
    eventType: 'factor_of',
    target: 6
  });

  assert.equal(result.favorable, 4);
  assert.equal(result.total, 6);
  assert.equal(result.fraction, '2/3');
});
