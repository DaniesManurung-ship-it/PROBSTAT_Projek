import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProbability, getDiceSumOutcomes } from '../src/features/probability/dice-probability.js';

test('dua dadu menghasilkan 36 pasangan ruang sampel', () => {
  assert.equal(getDiceSumOutcomes().length, 36);
});

test('ada enam pasangan yang jumlahnya tujuh', () => {
  assert.equal(getDiceSumOutcomes(7).filter((item) => item.favorable).length, 6);
});

test('peluang jumlah tujuh adalah 1/6', () => {
  const result = calculateProbability(6, 36);
  assert.equal(result.numerator, 6);
  assert.equal(result.denominator, 36);
  assert.ok(Math.abs(result.percentage - (100 / 6)) < 1e-10);
});
