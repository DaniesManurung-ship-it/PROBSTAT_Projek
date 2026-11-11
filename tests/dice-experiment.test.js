import test from 'node:test';
import assert from 'node:assert/strict';
import { runDiceExperiment } from '../src/features/experiment/dice-experiment.js';

test('simulasi mencatat jumlah percobaan dan distribusi 2 sampai 12', () => {
  const result = runDiceExperiment(10, () => 0);
  assert.equal(result.trialCount, 10);
  assert.equal(result.distribution.length, 11);
  assert.equal(result.distribution.reduce((sum, item) => sum + item.count, 0), 10);
});

test('dua dadu bernilai satu menghasilkan jumlah 2 dan bukan kejadian target', () => {
  const result = runDiceExperiment(5, () => 0);
  assert.equal(result.distribution[0].count, 5);
  assert.equal(result.favorableCount, 0);
  assert.equal(result.experimentalPercentage, 0);
});

test('fungsi menyimpan maksimal delapan contoh untuk animasi 3D', () => {
  const result = runDiceExperiment(100, () => 0.5);
  assert.equal(result.preview.length, 8);
  assert.ok(Math.abs(result.theoreticalPercentage - (100 / 6)) < 1e-10);
});

test('simulasi mengikuti tiga dadu dan target yang ditentukan', () => {
  const values = [0, 0.2, 0.4];
  let index = 0;
  const result = runDiceExperiment(3, () => values[index++ % values.length], {
    diceCount: 3,
    targetSum: 6,
  });
  assert.equal(result.distribution.length, 16);
  assert.equal(result.distribution[3].count, 3);
  assert.equal(result.favorableCount, 3);
  assert.deepEqual(result.preview[0].values, [1, 2, 3]);
  assert.equal(result.theoreticalPercentage, (10 / 216) * 100);
});

test('simulasi mengikuti satu dadu dan target batas', () => {
  const result = runDiceExperiment(2, () => 0.99, { diceCount: 1, targetSum: 6 });
  assert.equal(result.distribution.length, 6);
  assert.equal(result.favorableCount, 2);
  assert.ok(Math.abs(result.theoreticalPercentage - (100 / 6)) < 1e-10);
});

test('simulasi menerima target di luar jangkauan dengan peluang teoritis nol', () => {
  const result = runDiceExperiment(10, () => 0, { diceCount: 1, targetSum: 7 });
  assert.equal(result.favorableCount, 0);
  assert.equal(result.theoreticalPercentage, 0);
  assert.equal(result.distribution.length, 6);
});

test('jumlah percobaan di luar rentang ditolak', () => {
  assert.throws(() => runDiceExperiment(0), RangeError);
  assert.throws(() => runDiceExperiment(10001), RangeError);
});
