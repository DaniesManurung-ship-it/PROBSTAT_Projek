export function getCoinEventProbability(coinCount, targetHeads) {
  if (!Number.isInteger(coinCount) || coinCount < 1 || coinCount > 3) {
    throw new RangeError('Jumlah koin harus bilangan bulat antara 1 dan 3.');
  }
  if (!Number.isInteger(targetHeads) || targetHeads < 0 || targetHeads > coinCount) {
    throw new RangeError('Jumlah ANGKA yang dicari harus sesuai jumlah koin.');
  }

  const totalOutcomes = 2 ** coinCount;
  const favorableOutcomes = [];

  for (let outcome = 0; outcome < totalOutcomes; outcome++) {
    const result = Array.from({ length: coinCount }, (_, index) =>
      (outcome >> index) & 1 ? 'ANGKA' : 'GAMBAR'
    );
    if (result.filter((side) => side === 'ANGKA').length === targetHeads) {
      favorableOutcomes.push(result);
    }
  }

  return {
    totalOutcomes,
    favorableOutcomes,
    favorableCount: favorableOutcomes.length,
    probability: favorableOutcomes.length / totalOutcomes
  };
}

export function runCoinExperiment(trialCount, coinCount, targetHeads, random = Math.random) {
  if (![10, 50, 100].includes(trialCount)) {
    throw new RangeError('Jumlah simulasi harus 10, 50, atau 100 kali.');
  }
  if (typeof random !== 'function') {
    throw new TypeError('Parameter random harus berupa fungsi.');
  }

  const event = getCoinEventProbability(coinCount, targetHeads);
  const distribution = Array.from({ length: coinCount + 1 }, (_, heads) => {
    const outcome = getCoinEventProbability(coinCount, heads);
    return {
      heads,
      count: 0,
      theoreticalProbability: outcome.probability
    };
  });
  const outcomes = [];
  let favorableCount = 0;

  for (let trial = 0; trial < trialCount; trial += 1) {
    const result = Array.from({ length: coinCount }, () =>
      random() < 0.5 ? 'ANGKA' : 'GAMBAR'
    );
    const heads = result.filter((side) => side === 'ANGKA').length;
    const hit = heads === targetHeads;
    distribution[heads].count += 1;
    if (hit) favorableCount += 1;
    outcomes.push({ result, heads, hit });
  }

  return {
    trialCount,
    coinCount,
    targetHeads,
    favorableCount,
    experimentalPercentage: (favorableCount / trialCount) * 100,
    theoreticalPercentage: event.probability * 100,
    distribution,
    outcomes,
    preview: outcomes.slice(0, 8)
  };
}
