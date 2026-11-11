import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProbability, getDiceSumOutcomes } from '../src/features/probability/dice-probability.js';

test('dua dadu menghasilkan 36 pasangan ruang sampel', () => {
  assert.equal(getDiceSumOutcomes().length, 36);
});

test('ada enam pasangan yang jumlahnya tujuh', () => {
  assert.equal(getDiceSumOutcomes(7).filter((item) => item.favorable).length, 6);
});

test('ruang sampel mendukung satu, dua, dan tiga dadu serta mempertahankan urutan', () => {
  assert.equal(getDiceSumOutcomes(4, 1).length, 6);
  const twoDice = getDiceSumOutcomes(7, 2).filter((item) => item.favorable);
  assert.deepEqual(twoDice[0].values, [1, 6]);
  assert.deepEqual(twoDice[5].values, [6, 1]);
  assert.equal(getDiceSumOutcomes(10, 3).length, 216);
  assert.equal(getDiceSumOutcomes(10, 3).filter((item) => item.favorable).length, 27);
});

test('jumlah dadu yang tidak didukung dan target bukan bilangan bulat ditolak', () => {
  assert.throws(() => getDiceSumOutcomes(7, 0), RangeError);
  assert.throws(() => getDiceSumOutcomes(7, 4), RangeError);
  assert.throws(() => getDiceSumOutcomes(7.5, 2), TypeError);
});

test('target yang tidak mungkin dicapai memiliki nol hasil yang cocok', () => {
  const outcomes = getDiceSumOutcomes(7, 1);
  assert.equal(outcomes.length, 6);
  assert.equal(outcomes.filter((outcome) => outcome.favorable).length, 0);
  assert.equal(calculateProbability(0, outcomes.length).percentage, 0);
});

test('peluang jumlah tujuh adalah 1/6', () => {
  const result = calculateProbability(6, 36);
  assert.equal(result.numerator, 6);
  assert.equal(result.denominator, 36);
  assert.ok(Math.abs(result.percentage - (100 / 6)) < 1e-10);
});
