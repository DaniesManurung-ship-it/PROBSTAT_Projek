import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCoinEventProbability,
  runCoinExperiment
} from '../src/features/coin/coin-probability.js';

test('one coin has two equally likely outcomes', () => {
  const result = getCoinEventProbability(1, 1);
  assert.equal(result.totalOutcomes, 2);
  assert.equal(result.favorableCount, 1);
  assert.equal(result.probability, 0.5);
  assert.deepEqual(result.favorableOutcomes, [['ANGKA']]);
});

test('exactly two ANGKA from three coins has probability 3/8', () => {
  const result = getCoinEventProbability(3, 2);
  assert.equal(result.totalOutcomes, 8);
  assert.equal(result.favorableCount, 3);
  assert.equal(result.probability, 3 / 8);
  assert.deepEqual(result.favorableOutcomes, [
    ['ANGKA', 'ANGKA', 'GAMBAR'],
    ['ANGKA', 'GAMBAR', 'ANGKA'],
    ['GAMBAR', 'ANGKA', 'ANGKA']
  ]);
});

test('zero or all ANGKA are each one outcome', () => {
  assert.equal(getCoinEventProbability(3, 0).favorableCount, 1);
  assert.equal(getCoinEventProbability(3, 3).favorableCount, 1);
});

test('rejects invalid coin counts and target events', () => {
  assert.throws(() => getCoinEventProbability(0, 0), RangeError);
  assert.throws(() => getCoinEventProbability(4, 2), RangeError);
  assert.throws(() => getCoinEventProbability(2, 3), RangeError);
});

test('simulation supports 10, 50, and 100 tosses with an exact outcome distribution', () => {
  for (const trialCount of [10, 50, 100]) {
    const result = runCoinExperiment(trialCount, 3, 3, () => 0);
    assert.equal(result.trialCount, trialCount);
    assert.equal(result.favorableCount, trialCount);
    assert.equal(result.distribution.length, 4);
    assert.equal(result.distribution[3].count, trialCount);
    assert.equal(result.distribution.reduce((sum, item) => sum + item.count, 0), trialCount);
    assert.equal(result.theoreticalPercentage, 12.5);
    assert.equal(result.experimentalPercentage, 100);
    assert.equal(result.preview.length, 8);
  }
});

test('simulation marks only the selected number of ANGKA as a favorable event', () => {
  const values = [0, 0, 0.9, 0, 0.9, 0.9];
  let index = 0;
  const result = runCoinExperiment(10, 3, 2, () => values[index++ % values.length]);
  assert.equal(result.distribution.reduce((sum, item) => sum + item.count, 0), 10);
  assert.equal(result.favorableCount, 5);
  assert.equal(result.distribution[2].count, 5);
  assert.equal(result.experimentalPercentage, 50);
  assert.equal(result.theoreticalPercentage, 37.5);
});

test('simulation rejects unsupported trial counts and random sources', () => {
  assert.throws(() => runCoinExperiment(25, 2, 1), RangeError);
  assert.throws(() => runCoinExperiment(10, 2, 1, 1), TypeError);
});
