import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBinomialNormal,
  calculateNormal,
  calculateSampleMean,
  calculateUniform,
  normalCdf,
  normalPdf,
  normalQuantile,
  uniformCdf
} from '../src/features/distributions/continuous/continuous-math.js';

const closeTo = (actual, expected, tolerance = 1e-4) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
};

test('uniform examples, moments, clamping, and exact point probability', () => {
  const moduleExample = calculateUniform({ a: 10, b: 20, eventType: 'between', c: 12, d: 16 });
  closeTo(moduleExample.probability, 0.4);
  assert.equal(moduleExample.mean, 15);
  closeTo(moduleExample.variance, 100 / 12);
  closeTo(calculateUniform({ a: 5, b: 17, eventType: 'greaterThan', c: 14 }).probability, 0.25);
  closeTo(calculateUniform({ a: 4, b: 10, eventType: 'lessThan', c: 7 }).probability, 0.5);
  closeTo(calculateUniform({ a: 10, b: 20, eventType: 'between', c: -5, d: 25 }).probability, 1);
  assert.equal(calculateUniform({ a: 10, b: 20, eventType: 'exact', c: 12 }).probability, 0);
  assert.equal(uniformCdf(0, 10, 20), 0);
  assert.throws(() => calculateUniform({ a: 2, b: 2 }), RangeError);
});

test('normal CDF and inverse are accurate and symmetric', () => {
  closeTo(normalCdf(0), 0.5, 1e-7);
  closeTo(normalCdf(1.5), 0.9331928, 1e-7);
  closeTo(normalCdf(-1.5), 1 - normalCdf(1.5), 1e-7);
  for (const q of [0.01, 0.05, 0.5, 0.95, 0.99]) {
    closeTo(normalCdf(normalQuantile(q)), q, 1e-7);
  }
  assert.equal(normalCdf(-9), 0);
  assert.equal(normalCdf(9), 1);
  closeTo(normalPdf(0), 1 / Math.sqrt(2 * Math.PI));
});

test('normal probability and quantile examples', () => {
  closeTo(calculateNormal({ mu: 70, sigma: 10, eventType: 'greaterThan', c: 85 }).probability, 0.0668072);
  closeTo(calculateNormal({ mu: 500, sigma: 20, eventType: 'between', c: 480, d: 530 }).probability, 0.7745375);
  closeTo(calculateNormal({ mu: 20, sigma: 0.5, eventType: 'between', c: 19.5, d: 20.8 }).probability, 0.7865);
  const quantile = calculateNormal({ mode: 'quantile', mu: 60, sigma: 8, q: 0.95, tail: 'left' });
  closeTo(quantile.intermediate.x, 73.1588);
  closeTo(calculateNormal({ mode: 'quantile', mu: 60, sigma: 8, q: 0.95, tail: 'right' }).intermediate.x, 46.8412);
  assert.throws(() => calculateNormal({ mu: 0, sigma: 0, c: 1 }), RangeError);
  assert.throws(() => calculateNormal({ mode: 'quantile', mu: 0, sigma: 1, q: 1 }), RangeError);
  assert.throws(() => calculateNormal({ mu: 0, sigma: 1, eventType: 'between', c: 2, d: 1 }), RangeError);
});

test('sample mean uses standard error and symmetric interval', () => {
  closeTo(calculateSampleMean({ mu: 50, sigma: 2, n: 16, eventType: 'greaterThan', c: 50.75 }).probability, 0.0668072);
  closeTo(calculateSampleMean({ mu: 10, sigma: 0.8, n: 64, eventType: 'between', c: 9.8, d: 10.2 }).probability, 0.9544997);
  const interval = calculateSampleMean({ mode: 'symmetricInterval', mu: 50, sigma: 5, n: 25, q: 0.95 });
  closeTo(interval.intermediate.standardError, 1);
  closeTo(interval.intermediate.lower, 48.040036, 1e-3);
  closeTo(interval.intermediate.upper, 51.959964, 1e-3);
  assert.throws(() => calculateSampleMean({ mu: 0, sigma: 1, n: 0 }), RangeError);
  assert.equal(calculateSampleMean({ mu: 0, sigma: 1, n: 1, c: 0, assumption: 'normalPopulation' }).warnings.length, 1);
  assert.equal(calculateSampleMean({ mu: 0, sigma: 1, n: 10, c: 0, assumption: 'clt' }).warnings.length, 1);
});

test('binomial-normal approximation uses continuity corrections and warnings', () => {
  closeTo(calculateBinomialNormal({ n: 200, p: 0.1, eventType: 'atLeast', k: 25 }).probability, 0.1444);
  closeTo(calculateBinomialNormal({ n: 500, p: 0.04, eventType: 'integerBetween', a: 15, b: 25 }).probability, 0.7906);
  closeTo(calculateBinomialNormal({ n: 250, p: 0.2, eventType: 'strictLessThan', k: 45 }).probability, 0.1923);
  const corrected = calculateBinomialNormal({ n: 200, p: 0.1, eventType: 'atLeast', k: 25 });
  const uncorrected = calculateBinomialNormal({ n: 200, p: 0.1, eventType: 'atLeast', k: 25, continuityCorrection: false });
  assert.notEqual(corrected.probability, uncorrected.probability);
  assert.equal(calculateBinomialNormal({ n: 10, p: 0.1, eventType: 'atLeast', k: 4 }).warnings.length, 1);
  assert.throws(() => calculateBinomialNormal({ n: 5, p: 0, k: 2 }), RangeError);
  assert.throws(() => calculateBinomialNormal({ n: 10, p: 0.5, eventType: 'integerBetween', a: 8, b: 2 }), RangeError);
});
