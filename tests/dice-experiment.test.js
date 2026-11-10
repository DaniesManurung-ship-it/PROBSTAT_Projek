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

test('jumlah percobaan di luar rentang ditolak', () => {
  assert.throws(() => runDiceExperiment(0), RangeError);
  assert.throws(() => runDiceExperiment(10001), RangeError);
});
