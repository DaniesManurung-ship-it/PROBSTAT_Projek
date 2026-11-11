/** Pure probability helpers. Keep mathematical truth separate from rendering. */
export const MAX_DICE_COUNT = 3;

export function getDiceSumOutcomes(targetSum = 7, diceCount = 2) {
  if (!Number.isInteger(diceCount) || diceCount < 1 || diceCount > MAX_DICE_COUNT) {
    throw new RangeError(`Jumlah dadu harus berupa bilangan bulat 1-${MAX_DICE_COUNT}.`);
  }
  if (!Number.isSafeInteger(targetSum)) {
    throw new TypeError('Target jumlah harus berupa bilangan bulat yang aman.');
  }

  const outcomes = [];
  function visit(values, sum) {
    if (values.length === diceCount) {
      outcomes.push({
        values,
        dieA: values[0],
        dieB: values[1],
        sum,
        favorable: sum === targetSum,
      });
      return;
    }

    for (let value = 1; value <= 6; value += 1) {
      visit([...values, value], sum + value);
    }
  }

  visit([], 0);
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
