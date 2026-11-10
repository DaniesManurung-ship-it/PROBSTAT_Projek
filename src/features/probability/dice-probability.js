/** Pure probability helpers. Keep mathematical truth separate from rendering. */
export function getDiceSumOutcomes(targetSum = 7) {
  const outcomes = [];
  for (let dieA = 1; dieA <= 6; dieA += 1) {
    for (let dieB = 1; dieB <= 6; dieB += 1) {
      outcomes.push({ dieA, dieB, sum: dieA + dieB, favorable: dieA + dieB === targetSum });
    }
  }
  return outcomes;
}

export function calculateProbability(favorableCount, totalCount) {
  if (!Number.isInteger(favorableCount) || !Number.isInteger(totalCount)) {
    throw new TypeError('Jumlah kejadian harus berupa bilangan bulat.');
  }
  if (totalCount <= 0 || favorableCount < 0 || favorableCount > totalCount) {
    throw new RangeError('Jumlah kejadian atau ruang sampel tidak valid.');
  }
  return {
    numerator: favorableCount,
    denominator: totalCount,
    decimal: favorableCount / totalCount,
    percentage: (favorableCount / totalCount) * 100,
  };
}

export function getRandomDieValue(random = Math.random) {
  return Math.floor(random() * 6) + 1;
}
