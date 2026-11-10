import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBinomial,
  calculateGeometric,
  calculateHypergeometric,
  calculateMultinomial,
  calculateNegativeBinomial,
  calculatePoisson,
  getDistributionSeries,
} from '../src/features/distributions/distribution-math.js';

const closeTo = (actual, expected, tolerance = 1e-4) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
};

test('binomial menghitung contoh acuan dan kejadian kumulatif', () => {
  closeTo(calculateBinomial({ n: 8, p: 0.1, x: 2 }).probability, 0.14880348);
  closeTo(calculateBinomial({ n: 10, p: 0.25, x: 3 }).probability, 0.25028229);
  closeTo(calculateBinomial({ n: 8, p: 0.1, eventType: 'atMost', x: 2 }).probability, 0.961908);
  closeTo(calculateBinomial({ n: 8, p: 0.1, eventType: 'atLeast', x: 2 }).probability, 0.186895);
  closeTo(calculateBinomial({ n: 8, p: 0.1, eventType: 'between', lower: 1, upper: 3 }).probability, 0.56450844);
});

test('binomial menangani peluang sukses yang pasti dan batas jumlah sukses', () => {
  assert.equal(calculateBinomial({ n: 5, p: 0, x: 0 }).probability, 1);
  assert.equal(calculateBinomial({ n: 5, p: 0, x: 1 }).probability, 0);
  assert.equal(calculateBinomial({ n: 5, p: 1, x: 5 }).probability, 1);
  assert.throws(() => calculateBinomial({ n: 5, p: 0.5, x: 6 }), RangeError);
  assert.throws(() => calculateBinomial({ n: 5, p: 0.5, eventType: 'between', lower: 4, upper: 2 }), RangeError);
});

test('multinomial menghitung contoh acuan dan menolak total yang tidak sesuai', () => {
  closeTo(calculateMultinomial({
    n: 6,
    categories: [
      { name: 'Motor', p: 0.5, x: 3 },
      { name: 'Mobil', p: 0.2, x: 2 },
      { name: 'Umum', p: 0.3, x: 1 },
    ],
  }).probability, 0.09);
  closeTo(calculateMultinomial({
    n: 5,
    categories: [
      { name: 'A', p: 0.4, x: 2 },
      { name: 'B', p: 0.35, x: 2 },
      { name: 'C', p: 0.25, x: 1 },
    ],
  }).probability, 0.147);
  assert.throws(() => calculateMultinomial({
    n: 2,
    categories: [{ name: 'A', p: 0.4, x: 1 }, { name: 'B', p: 0.4, x: 1 }],
  }), /total peluang/i);
  assert.throws(() => calculateMultinomial({
    n: 3,
    categories: [{ name: 'A', p: 0.5, x: 1 }, { name: 'B', p: 0.5, x: 1 }],
  }), /total frekuensi/i);
});

test('hipergeometrik menghitung contoh dan kejadian pada support yang valid', () => {
  closeTo(calculateHypergeometric({ N: 10, K: 4, n: 3, x: 2 }).probability, 0.3);
  closeTo(calculateHypergeometric({ N: 12, K: 5, n: 4, x: 3 }).probability, 0.14141414);
  closeTo(calculateHypergeometric({ N: 10, K: 4, n: 3, eventType: 'atMost', x: 1 }).probability, 0.66666667);
  assert.throws(() => calculateHypergeometric({ N: 10, K: 2, n: 8, x: 3 }), RangeError);
  assert.throws(() => calculateHypergeometric({ N: 10, K: 11, n: 2, x: 1 }), RangeError);
});

test('geometrik menghitung peluang tepat, kumulatif, dan setelah batas', () => {
  closeTo(calculateGeometric({ p: 0.2, x: 4 }).probability, 0.1024);
  closeTo(calculateGeometric({ p: 0.7, x: 3 }).probability, 0.063);
  closeTo(calculateGeometric({ p: 0.2, eventType: 'atMost', x: 4 }).probability, 0.5904);
  closeTo(calculateGeometric({ p: 0.2, eventType: 'after', x: 4 }).probability, 0.4096);
  assert.equal(calculateGeometric({ p: 1, x: 1 }).probability, 1);
  assert.throws(() => calculateGeometric({ p: 0, x: 1 }), RangeError);
});

test('binomial negatif menghitung contoh dan peluang sukses setelah batas', () => {
  closeTo(calculateNegativeBinomial({ p: 0.4, k: 3, x: 7 }).probability, 0.124416);
  closeTo(calculateNegativeBinomial({ p: 0.3, k: 2, x: 5 }).probability, 0.12348);
  closeTo(calculateNegativeBinomial({ p: 0.4, k: 3, eventType: 'atMost', x: 7 }).probability, 0.580096);
  closeTo(calculateNegativeBinomial({ p: 0.4, k: 3, eventType: 'after', x: 7 }).probability, 0.419904);
  assert.throws(() => calculateNegativeBinomial({ p: 0.4, k: 3, eventType: 'between', lower: 3, upper: 7 }), RangeError);
  assert.throws(() => calculateNegativeBinomial({ p: 0.4, k: 3, x: 2 }), RangeError);
  assert.throws(() => calculateNegativeBinomial({ p: 0, k: 1, x: 1 }), RangeError);
});

test('Poisson menghitung contoh acuan dan λ nol', () => {
  closeTo(calculatePoisson({ lambda: 3, x: 2 }).probability, 0.22404181);
  closeTo(calculatePoisson({ lambda: 5, x: 7 }).probability, 0.10444486);
  closeTo(calculatePoisson({ lambda: 3, eventType: 'atMost', x: 2 }).probability, 0.42319008);
  closeTo(calculatePoisson({ lambda: 3, eventType: 'atLeast', x: 2 }).probability, 0.80085173);
  closeTo(calculatePoisson({ lambda: 3, eventType: 'between', lower: 1, upper: 3 }).probability, 0.59744482);
  assert.equal(calculatePoisson({ lambda: 0, x: 0 }).probability, 1);
  assert.equal(calculatePoisson({ lambda: 0, x: 3 }).probability, 0);
  assert.throws(() => calculatePoisson({ lambda: 2, eventType: 'after', x: 1 }), RangeError);
});

test('seri visual mencakup nilai fokus dan penanda kejadian', () => {
  const result = calculateBinomial({ n: 8, p: 0.1, x: 2 });
  const series = getDistributionSeries('Binomial', result.parameters);
  assert.equal(series.length, 9);
  assert.equal(series.find((item) => item.value === 2).highlight, true);
});
