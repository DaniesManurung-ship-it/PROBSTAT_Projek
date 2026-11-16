import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMaterial, getCalculatorDefinition } from '../src/features/learning/materials-math.js';

test('all 26 topics have a working, finite example calculation', () => {
  for (let topic = 1; topic <= 26; topic += 1) {
    const definition = getCalculatorDefinition(topic);
    assert.ok(definition, `Missing calculator for topic ${topic}`);
    const values = Object.fromEntries(definition.fields.map(({ name, value }) => [name, value]));
    const output = calculateMaterial(topic, values);
    assert.ok(output.result, `Missing result for topic ${topic}`);
    assert.ok(output.steps.every((step) => typeof step === 'string' && !/NaN|Infinity|undefined/.test(step)), `Invalid calculation steps for topic ${topic}`);
  }
});

test('basic probability, complement, union, conditional, and independent event examples', () => {
  assert.equal(calculateMaterial(1, { favorable: '1', total: '6' }).probability, 1 / 6);
  assert.equal(calculateMaterial(3, { p: '0.3' }).probability, 0.7);
  assert.equal(calculateMaterial(4, { pA: '0.5', pB: '0.4', pAB: '0.2' }).probability, 0.7);
  assert.equal(calculateMaterial(5, { mode: 'independent', pA: '0.5', pB: '0.4' }).probability, 0.2);
  assert.equal(calculateMaterial(6, { pA: '0.5', pAB: '0.2' }).probability, 0.4);
});

test('room sample and dependent sampling are calculated from their outcomes', () => {
  const sampleSpace = calculateMaterial(2, { experiment: 'twoDice', criterion: '7' });
  assert.equal(sampleSpace.probability, 1 / 6);
  assert.match(sampleSpace.interpretation, /6, 1/);

  const sampling = calculateMaterial(7, { a: '5', b: '5', draws: '2' });
  assert.ok(Math.abs(sampling.chart[0].value - 0.25) < 1e-12);
  assert.ok(Math.abs(sampling.chart[1].value - 2 / 9) < 1e-12);
});

test('counting, binomial, uniform, normal, and approximation match manual examples', () => {
  assert.equal(calculateMaterial(8, { n: '5', r: '3' }).result, '60');
  assert.equal(calculateMaterial(9, { n: '5', r: '2' }).result, '10');
  const binomial = calculateMaterial(11, {
    n: '5', p: '0.5', k: '3', lower: '2', upper: '4', event: 'exact',
  });
  assert.ok(Math.abs(binomial.probability - 0.3125) < 1e-12);
  assert.equal(binomial.table.rows.length, 6);
  assert.ok(binomial.steps.every(Boolean));
  assert.ok(Math.abs(calculateMaterial(13, { a: '10', b: '20', c: '12', d: '16' }).probability - 0.4) < 1e-12);
  assert.ok(Math.abs(calculateMaterial(14, {
    mu: '0', sigma: '1', event: 'less', lower: '0', upper: '1',
  }).probability - 0.5) < 0.001);
  const sampleMean = calculateMaterial(15, {
    mu: '50', sigma: '6', n: '9', population: 'normal', event: 'less', lower: '52', upper: '54',
  });
  assert.equal(sampleMean.details[0][1], 2);
  const normalApproximation = calculateMaterial(16, {
    n: '100', p: '0.5', event: 'atMost', k: '55', lower: '45', upper: '55',
  });
  assert.ok(Math.abs(normalApproximation.probability - 0.8643) < 0.002);
  assert.equal(normalApproximation.warning, false);
  assert.equal(calculateMaterial(11, {
    n: '0', p: '0.5', k: '0', lower: '0', upper: '0', event: 'exact',
  }).probability, 1);
});

test('data calculators summarize values and report invalid sample assumptions', () => {
  assert.equal(calculateMaterial(18, { data: '70, 80, 90' }).result, '80');
  assert.equal(calculateMaterial(19, { data: '3, 5, 7, 9, 11' }).result, '7');
  assert.match(calculateMaterial(20, { data: '1, 3, 3, 5' }).result, /3/);
  assert.ok(calculateMaterial(22, { data: '1,2,3,4,5,6,7,8' }).result.includes('4'));
  assert.throws(() => calculateMaterial(23, { data: '4', scope: 'sample' }), /sedikitnya dua/);
  assert.throws(() => calculateMaterial(25, { data: '1,1,1' }), /varians nol/);
});

test('simulation calculators compare deterministic outcomes with theory', () => {
  const result = calculateMaterial(26, {
    experiment: 'coin', event: 'heads', target: '6', trials: '10',
    targetBalls: '5', otherBalls: '5', draws: '1', replacement: 'with',
  }, () => 0.2);
  assert.equal(result.details[0][1], 0.5);
  assert.equal(result.details[1][1], 1);
  assert.equal(result.details[2][1], 0.5);

  const balls = calculateMaterial(26, {
    experiment: 'balls', event: 'ball', target: '6', trials: '2',
    targetBalls: '5', otherBalls: '5', draws: '2', replacement: 'without',
  }, () => 0.1);
  assert.ok(Math.abs(balls.details[0][1] - 2 / 9) < 1e-12);
  assert.equal(balls.details[1][1], 1);
});

test('invalid inputs are rejected rather than producing invalid probabilities', () => {
  assert.throws(() => calculateMaterial(1, { favorable: '7', total: '6' }), /tidak boleh melebihi/);
  assert.throws(() => calculateMaterial(4, { pA: '0.2', pB: '0.8', pAB: '0.3' }), /tidak boleh melebihi/);
  assert.throws(() => calculateMaterial(6, { pA: '0', pAB: '0' }), /lebih besar dari 0/);
  assert.throws(() => calculateMaterial(12, { pairs: '10, 0.2\n0, 0.2' }), /sama dengan 1/);
  assert.throws(() => calculateMaterial(14, {
    mu: '0', sigma: '0', event: 'less', lower: '1', upper: '2',
  }), /lebih besar dari 0/);
  assert.throws(() => calculateMaterial(1, { favorable: '', total: '6' }), /wajib diisi/);
  assert.throws(() => calculateMaterial(18, { data: '1, 1e99' }), /berada antara/);
  const sampleMeanWarning = calculateMaterial(15, {
    mu: '50', sigma: '6', n: '10', population: 'unknown', event: 'less', lower: '52', upper: '54',
  });
  assert.equal(sampleMeanWarning.warning, true);
  assert.match(sampleMeanWarning.warningText, /bukan jaminan/);
});
