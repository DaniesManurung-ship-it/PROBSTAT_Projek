import { calculateBinomial } from '../distributions/distribution-math.js';

function formatProbability(value) {
  return value.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
}

export function solveBinomialInterpretation(data) {
  const result = calculateBinomial({
    n: data.n,
    p: data.successProbability,
    eventType: 'exact',
    x: data.target
  });
  const probability = formatProbability(result.probability);
  const substitution = `P(X = ${data.target}) = C(${data.n}, ${data.target}) × ` +
    `(${data.successProbability})^${data.target} × ` +
    `(1 − ${data.successProbability})^${data.n - data.target}`;

  return {
    kind: 'binomial',
    model: 'binomial',
    fraction: probability,
    percentage: Number(result.percentage.toFixed(8)),
    formula: `${result.formula} = ${substitution}`,
    sample: [{ value: `X = ${data.target}`, favorable: true }],
    steps: result.steps.map(({ title, explanation }) => `${title}: ${explanation}`),
    description: 'Hasil distribusi binomial dihitung dari jumlah percobaan, peluang sukses, dan jumlah sukses yang ditanyakan.',
    summary: result.interpretation
  };
}
