function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function isFavorable(data, first, second) {
  switch (data.eventType) {
    case 'even':
      return first % 2 === 0;
    case 'odd':
      return first % 2 !== 0;
    case 'face_equals':
      return first === data.target;
    case 'sum_equals':
      return first + second === data.target;
    case 'product_equals':
      return first * second === data.target;
    case 'same_faces':
      return first === second;
    case 'at_least_one_face_equals':
      return first === data.target || second === data.target;
    case 'at_most_one_face_equals':
      return Number(first === data.target) + Number(second === data.target) <= 1;
    default:
      return false;
  }
}

export function solveDiceInterpretation(data) {
  if (data.category !== 'dice' || ![1, 2].includes(data.diceCount)) return null;

  const sides = data.sidesPerDie;
  if (!Number.isSafeInteger(sides) || sides < 1) return null;

  const outcomes = [];
  for (let first = 1; first <= sides; first++) {
    const lastSecond = data.diceCount === 2 ? sides : 1;
    for (let second = 1; second <= lastSecond; second++) {
      outcomes.push(data.diceCount === 1
        ? { value: first, favorable: isFavorable(data, first, second) }
        : {
          first,
          second,
          sum: first + second,
          favorable: isFavorable(data, first, second)
        });
    }
  }

  const favorable = outcomes.filter((outcome) => outcome.favorable).length;
  const total = outcomes.length;
  const divisor = gcd(favorable, total);
  const fraction = `${favorable / divisor}/${total / divisor}`;
  const eventDescription = {
    even: 'mata dadu bernilai genap',
    odd: 'mata dadu bernilai ganjil',
    face_equals: `satu dadu menunjukkan angka ${data.target}`,
    sum_equals: `jumlah mata kedua dadu sama dengan ${data.target}`,
    product_equals: `hasil kali mata kedua dadu sama dengan ${data.target}`,
    same_faces: 'kedua dadu menunjukkan angka yang sama',
    at_least_one_face_equals: `minimal satu dadu menunjukkan angka ${data.target}`,
    at_most_one_face_equals: `maksimal satu dadu menunjukkan angka ${data.target}`
  }[data.eventType];

  if (!eventDescription) return null;

  return {
    title: data.diceCount === 1 ? 'Peluang satu buah dadu' : 'Peluang dua buah dadu',
    model: data.diceCount === 1 ? 'dice-single' : 'dice',
    favorable,
    total,
    sample: outcomes,
    fraction,
    percentage: favorable / total * 100,
    steps: [
      `Setiap dadu memiliki ${sides} sisi${data.diceCount === 2 ? `, sehingga ruang sampel berjumlah ${sides} × ${sides} = ${total} hasil` : `, sehingga ruang sampel berjumlah ${total} hasil`}.`,
      `Kejadian yang dicari adalah ${eventDescription}.`,
      `Terdapat ${favorable} hasil yang memenuhi kejadian tersebut.`,
      `Peluang = ${favorable}/${total} = ${fraction}.`
    ],
    description: `Visualisasi ${data.diceCount === 1 ? 'dadu' : 'dua dadu'} dan hasil yang memenuhi kejadian ${eventDescription}.`,
    summary: `Dari ${total} kemungkinan hasil, ${favorable} memenuhi kejadian ${eventDescription}.`
  };
}
