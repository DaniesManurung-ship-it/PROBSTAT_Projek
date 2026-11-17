function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function isFavorable(data, values) {
  const first = values[0];
  switch (data.eventType) {
    case 'even':
      return first % 2 === 0;
    case 'odd':
      return first % 2 !== 0;
    case 'face_equals':
      return first === data.target;
    case 'factor_of':
      return data.target > 0 && data.target % first === 0;
    case 'sum_equals':
      return values.reduce((sum, value) => sum + value, 0) === data.target;
    case 'product_equals':
      return values.reduce((product, value) => product * value, 1) === data.target;
    case 'same_faces':
      return values.every((value) => value === first);
    case 'at_least_one_face_equals':
      return values.some((value) => value === data.target);
    case 'at_most_one_face_equals':
      return values.filter((value) => value === data.target).length <= 1;
    default:
      return false;
  }
}

export function solveDiceInterpretation(data) {
  if (data.category !== 'dice' || ![1, 2, 3].includes(data.diceCount)) return null;

  const sides = data.sidesPerDie;
  if (!Number.isSafeInteger(sides) || sides < 1) return null;

  const outcomes = [];
  function collectOutcomes(values) {
    if (values.length === data.diceCount) {
      outcomes.push(data.diceCount === 1
        ? { value: values[0], favorable: isFavorable(data, values) }
        : {
          first: values[0],
          second: values[1],
          values,
          sum: values.reduce((sum, value) => sum + value, 0),
          favorable: isFavorable(data, values)
        });
      return;
    }

    for (let value = 1; value <= sides; value += 1) {
      collectOutcomes([...values, value]);
    }
  }

  collectOutcomes([]);

  const favorable = outcomes.filter((outcome) => outcome.favorable).length;
  const total = outcomes.length;
  const divisor = gcd(favorable, total);
  const fraction = `${favorable / divisor}/${total / divisor}`;
  const dicePhrase = data.diceCount === 2 ? 'kedua dadu' : 'ketiga dadu';
  const diceCountPhrase = ['satu', 'dua', 'tiga'][data.diceCount - 1];
  const eventDescription = {
    even: 'mata dadu bernilai genap',
    odd: 'mata dadu bernilai ganjil',
    face_equals: `satu dadu menunjukkan angka ${data.target}`,
    factor_of: `mata dadu merupakan faktor dari ${data.target}`,
    sum_equals: `jumlah mata ${dicePhrase} sama dengan ${data.target}`,
    product_equals: `hasil kali mata ${dicePhrase} sama dengan ${data.target}`,
    same_faces: 'semua dadu menunjukkan angka yang sama',
    at_least_one_face_equals: `minimal satu dari ${data.diceCount} dadu menunjukkan angka ${data.target}`,
    at_most_one_face_equals: `maksimal satu dari ${data.diceCount} dadu menunjukkan angka ${data.target}`
  }[data.eventType];

  if (!eventDescription) return null;

  return {
    title: `Peluang ${diceCountPhrase} buah dadu`,
    model: data.diceCount === 1 ? 'dice-single' : 'dice',
    diceCount: data.diceCount,
    favorable,
    total,
    sample: outcomes,
    fraction,
    percentage: favorable / total * 100,
    steps: [
      `Setiap dadu memiliki ${sides} sisi, sehingga ruang sampel berjumlah ${Array(data.diceCount).fill(sides).join(' × ')} = ${total} hasil.`,
      `Kejadian yang dicari adalah ${eventDescription}.`,
      `Terdapat ${favorable} hasil yang memenuhi kejadian tersebut.`,
      `Peluang = ${favorable}/${total} = ${fraction}.`
    ],
    description: `Visualisasi ${diceCountPhrase} buah dadu dan hasil yang memenuhi kejadian ${eventDescription}.`,
    summary: `Dari ${total} kemungkinan hasil, ${favorable} memenuhi kejadian ${eventDescription}.`
  };
}
