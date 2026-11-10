
/* =============================================
   PROBABILITY 3D
   QUESTION BANK & DYNAMIC QUESTION GENERATOR
============================================= */

const CATEGORIES = [
  'dice',
  'coin',
  'cards',
  'balls',
  'counting',
  'conditional'
];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (items) =>
  items[Math.floor(Math.random() * items.length)];

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
}

function fraction(numerator, denominator) {
  const d = gcd(numerator, denominator);

  return `${numerator / d}/${denominator / d}`;
}

function factorial(n) {
  let result = 1n;

  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }

  return result;
}

function combination(n, r) {
  return factorial(n) /
    (factorial(r) * factorial(n - r));
}

function permutation(n, r) {
  return factorial(n) / factorial(n - r);
}

function hashString(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

/* =============================================
   QUESTION FACTORY
============================================= */

function makeProbabilityQuestion(data) {
  const percentage =
    data.favorable / data.total * 100;

  return {
    ...data,

    kind: 'probability',

    answerNumeric: percentage,

    fraction: fraction(
      data.favorable,
      data.total
    ),

    answerDisplay:
      `${fraction(data.favorable, data.total)} ` +
      `(${percentage.toFixed(2)}%)`,

    percentage,

    id: hashString(
      data.category +
      data.difficulty +
      data.question +
      data.favorable +
      data.total
    )
  };
}

function makeCountingQuestion(data) {
  const answer = Number(data.answer);

  return {
    ...data,

    kind: 'counting',

    answerNumeric: answer,

    answerDisplay:
      `${answer.toLocaleString('id-ID')} ` +
      data.answerUnit,

    id: hashString(
      data.category +
      data.difficulty +
      data.question +
      answer
    )
  };
}

/* =============================================
   DICE QUESTIONS
============================================= */


function generateDice(difficulty) {


if (difficulty === 'easy') {

if (difficulty === 'medium') {

  const ranks = [
    'As', '2', '3', '4', '5', '6', '7',
    '8', '9', '10', 'Jack', 'Queen', 'King'
  ];

  const rank = pick(ranks);

  return makeProbabilityQuestion({
    category: 'cards',
    difficulty,

    question:
      `Dari satu dek berisi 52 kartu remi, berapa peluang mengambil kartu bernilai ${rank}?`,

    favorable: 4,
    total: 52,

    solverPrompt: rank === 'As'
      ? 'Dari 52 kartu remi, berapa peluang mengambil kartu As?'
      : null,

    steps: [
      'Satu dek kartu remi berisi 52 kartu.',
      `Terdapat empat kartu dengan nilai ${rank}, masing-masing satu pada setiap jenis.`,
      'P(A) = 4/52.',
      'P(A) = 1/13 = 7,69%.'
    ]
  });
}

const ranks = [
  'As', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'Jack', 'Queen', 'King'
];

const rank = pick(ranks);

return makeProbabilityQuestion({
  category: 'cards',
  difficulty,

  question:
    `Dua kartu diambil secara berturut-turut tanpa pengembalian dari satu dek 52 kartu. Berapa peluang keduanya mempunyai nilai ${rank}?`,

  favorable: 4 * 3,
  total: 52 * 51,

  steps: [
    `Awalnya terdapat empat kartu bernilai ${rank} dari 52 kartu.`,
    'Peluang pengambilan pertama = 4/52.',
    'Setelah satu kartu dengan nilai tersebut diambil, tersisa tiga dari 51 kartu.',
    'Peluang pengambilan kedua = 3/51.',
    'P(A) = (4/52) × (3/51) = 1/221 = 0,45%.'
  ]
});

  const events = [
    { label: 'merah', count: 26, solver: 'merah' },
    { label: 'hitam', count: 26, solver: 'hitam' },
    { label: 'hati', count: 13, solver: null },
    { label: 'wajik', count: 13, solver: null },
    { label: 'keriting', count: 13, solver: null },
    { label: 'sekop', count: 13, solver: 'sekop' },
    { label: 'As', count: 4, solver: 'As' },
    { label: 'King', count: 4, solver: null },
    { label: 'Queen', count: 4, solver: null },
    { label: 'Jack', count: 4, solver: null },
    { label: 'kartu bergambar', count: 12, solver: 'bergambar' }
  ];

  const event = pick(events);

  return makeProbabilityQuestion({
    category: 'cards',
    difficulty,

    question:
      `Dari satu dek berisi 52 kartu remi, berapa peluang mengambil kartu ${event.label}?`,

    favorable: event.count,
    total: 52,

    solverPrompt: event.solver
      ? `Dari 52 kartu remi, berapa peluang mengambil kartu ${event.solver}?`
      : null,

    steps: [
      'Satu dek kartu remi mempunyai 52 kartu.',
      `Jumlah kartu ${event.label} adalah ${event.count}.`,
      `P(A) = ${event.count}/52 = ${fraction(event.count, 52)}.`,
      `P(A) = ${(event.count / 52 * 100).toFixed(2)}%.`
    ]
  });
}


  if (difficulty === 'medium') {

    const target = randomInt(2, 12);
    let favorable = 0;

    for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) {
        if (a + b === target) favorable++;
      }
    }

    return makeProbabilityQuestion({
      category: 'dice',
      difficulty,

      question:
        `Dua dadu dilempar bersamaan. Berapa peluang mendapatkan jumlah mata dadu ${target}?`,

      favorable,
      total: 36,

      solverPrompt:
        `Dua buah dadu dilempar bersamaan. Berapa peluang mendapatkan jumlah mata dadu ${target}?`,

      steps: [
        'Setiap dadu mempunyai enam kemungkinan hasil.',
        'Total ruang sampel = 6 × 6 = 36.',
        `Terdapat ${favorable} pasangan yang menghasilkan jumlah ${target}.`,
        `P(A) = ${favorable}/36 = ${fraction(favorable, 36)}.`
      ]
    });
  }

  const operator = pick(['minimal', 'maksimal']);
  const threshold = randomInt(5, 10);

  let favorable = 0;

  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {

      const sum = a + b;

      if (
        operator === 'minimal' &&
        sum >= threshold
      ) favorable++;

      if (
        operator === 'maksimal' &&
        sum <= threshold
      ) favorable++;
    }
  }

  return makeProbabilityQuestion({
    category: 'dice',
    difficulty,

    question:
      `Dua dadu dilempar bersamaan. Berapa peluang jumlah mata kedua dadu ${operator} ${threshold}?`,

    favorable,
    total: 36,

    steps: [
      'Dua dadu mempunyai 6 × 6 = 36 pasangan kemungkinan.',
      `Kita mencari jumlah yang ${operator} ${threshold}.`,
      `Ada ${favorable} pasangan yang memenuhi kondisi.`,
      `P(A) = ${favorable}/36 = ${fraction(favorable, 36)}.`
    ]
  });
}

/* =============================================
   COIN QUESTIONS
============================================= */

function countCoinOutcomes(tosses, target) {
  let count = 0;

  for (let mask = 0; mask < 2 ** tosses; mask++) {
    let heads = 0;

    for (let i = 0; i < tosses; i++) {
      if ((mask >> i) & 1) heads++;
    }

    if (heads === target) count++;
  }

  return count;
}


function generateCoin(difficulty) {

  const tosses =
    difficulty === 'easy'
      ? randomInt(1, 4)
      : difficulty === 'medium'
        ? randomInt(2, 4)
        : randomInt(4, 6);

  const target = difficulty === 'easy'
    ? randomInt(0, tosses)
    : difficulty === 'medium'
      ? randomInt(0, tosses)
      : randomInt(1, tosses - 1);

  const favorable =
    countCoinOutcomes(tosses, target);

  const total = 2 ** tosses;

  const question =
    tosses === 1
      ? `Sebuah koin adil dilempar satu kali. Berapa peluang muncul sisi ${target === 1 ? 'ANGKA' : 'GAMBAR'}?`
      : `${tosses} koin adil dilempar bersamaan. Berapa peluang tepat ${target} sisi ANGKA muncul?`;

  const solverPrompt =
    tosses === 1
      ? `Sebuah koin dilempar. Berapa peluang muncul sisi ${target === 1 ? 'angka' : 'gambar'}?`
      : null;

  return makeProbabilityQuestion({
    category: 'coin',
    difficulty,
    question,
    favorable,
    total,
    solverPrompt,

    steps: [
      `Setiap koin memiliki dua kemungkinan hasil, yaitu ANGKA dan GAMBAR.`,
      `Jumlah seluruh kemungkinan = 2^${tosses} = ${total}.`,
      `Jumlah hasil dengan tepat ${target} sisi ANGKA adalah ${favorable}.`,
      `P(A) = ${favorable}/${total} = ${fraction(favorable, total)} = ${(favorable / total * 100).toFixed(2)}%.`
    ]
  });
}

/* =============================================
   PLAYING CARD QUESTIONS
============================================= */

function generateCards(difficulty) {

  const suits = ['Hati', 'Wajik', 'Keriting', 'Sekop'];


if (difficulty === 'easy') {

  const events = [
    { label: 'merah', count: 26, solver: 'merah' },
    { label: 'hitam', count: 26, solver: 'hitam' },
    { label: 'hati', count: 13, solver: null },
    { label: 'wajik', count: 13, solver: null },
    { label: 'keriting', count: 13, solver: null },
    { label: 'sekop', count: 13, solver: 'sekop' },
    { label: 'As', count: 4, solver: 'As' },
    { label: 'King', count: 4, solver: null },
    { label: 'Queen', count: 4, solver: null },
    { label: 'Jack', count: 4, solver: null },
    { label: 'kartu bergambar', count: 12, solver: 'bergambar' }
  ];

  const event = pick(events);

  return makeProbabilityQuestion({
    category: 'cards',
    difficulty,

    question:
      `Dari satu dek berisi 52 kartu remi, berapa peluang mengambil kartu ${event.label}?`,

    favorable: event.count,
    total: 52,

    solverPrompt: event.solver
      ? `Dari 52 kartu remi, berapa peluang mengambil kartu ${event.solver}?`
      : null,

    steps: [
      'Satu dek kartu remi mempunyai 52 kartu.',
      `Jumlah kartu ${event.label} adalah ${event.count}.`,
      `P(A) = ${event.count}/52 = ${fraction(event.count, 52)}.`,
      `P(A) = ${(event.count / 52 * 100).toFixed(2)}%.`
    ]
  });
}


  if (difficulty === 'medium') {

    const event = pick([
      { label: 'As', favorable: 4, solver: 'As' },
      { label: 'sekop', favorable: 13, solver: 'sekop' },
      { label: 'bergambar (J, Q, K)', favorable: 12, solver: 'bergambar' }
    ]);

    return makeProbabilityQuestion({
      category: 'cards',
      difficulty,

      question:
        `Dari 52 kartu remi, berapa peluang mengambil kartu ${event.label}?`,

      favorable: event.favorable,
      total: 52,

      solverPrompt:
        `Dari 52 kartu remi, berapa peluang mengambil kartu ${event.solver}?`,

      steps: [
        'Satu dek kartu remi mempunyai 52 kartu.',
        `Terdapat ${event.favorable} kartu ${event.label}.`,
        `P(A) = ${event.favorable}/52.`,
        `P(A) = ${fraction(event.favorable, 52)} = ${(event.favorable / 52 * 100).toFixed(2)}%.`
      ]
    });
  }

  const target = pick([
    { label: 'merah', count: 26 },
    { label: 'As', count: 4 }
  ]);

  const first = target.count / 52;
  const second = (target.count - 1) / 51;

  const favorable = target.count * (target.count - 1);
  const total = 52 * 51;

  return makeProbabilityQuestion({
    category: 'cards',
    difficulty,

    question:
      `Dari 52 kartu remi, dua kartu diambil berturut-turut tanpa pengembalian. Berapa peluang keduanya merupakan kartu ${target.label}?`,

    favorable,
    total,

    steps: [
      `Awalnya terdapat ${target.count} kartu ${target.label} dari 52 kartu.`,
      `Peluang pengambilan pertama = ${target.count}/52 = ${first.toFixed(4)}.`,
      `Setelah satu kartu yang sesuai diambil, tersisa ${target.count - 1} dari 51 kartu.`,
      `P(A) = (${target.count}/52) × (${target.count - 1}/51) = ${fraction(favorable, total)}.`
    ]
  });
}

/* =============================================
   BALL QUESTIONS
============================================= */

function generateBalls(difficulty) {

  const counts = {
    merah: randomInt(4, 7),
    biru: randomInt(2, 5),
    kuning: randomInt(1, 4)
  };

  const color = pick(['merah', 'biru', 'kuning']);

  const total =
    Object.values(counts).reduce((a, b) => a + b, 0);

  const amount = counts[color];

  if (difficulty === 'easy') {

    return makeProbabilityQuestion({
      category: 'balls',
      difficulty,

      question:
        `Dalam sebuah kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang mengambil satu bola ${color}?`,

      favorable: amount,
      total,

      solverPrompt:
        `Dalam sebuah kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang mengambil bola ${color}?`,

      steps: [
        `Jumlah seluruh bola = ${counts.merah} + ${counts.biru} + ${counts.kuning} = ${total}.`,
        `Jumlah bola ${color} adalah ${amount}.`,
        `P(A) = ${amount}/${total} = ${fraction(amount, total)}.`,
        `P(A) = ${(amount / total * 100).toFixed(2)}%.`
      ]
    });
  }

  if (difficulty === 'medium') {

    const selectedColor = 'merah';
    const count = counts.merah;

    const favorable = count * (count - 1);
    const denominator = total * (total - 1);

    return makeProbabilityQuestion({
      category: 'balls',
      difficulty,

      question:
        `Dalam sebuah kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang mengambil dua bola merah secara berturut-turut tanpa pengembalian?`,

      favorable,
      total: denominator,

      solverPrompt:
        `Dalam kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang mengambil dua bola merah tanpa pengembalian?`,

      steps: [
        `Jumlah awal bola adalah ${total}, dengan ${count} bola merah.`,
        `Peluang pertama = ${count}/${total}.`,
        `Setelah satu bola merah diambil, tersisa ${count - 1} bola merah dan ${total - 1} seluruh bola.`,
        `Peluang kedua = ${count - 1}/${total - 1}.`,
        `Peluang keduanya merah = (${count}/${total}) × (${count - 1}/${total - 1}) = ${fraction(favorable, denominator)}.`
      ]
    });
  }

  const targetCount = counts.merah;
  const draws = 3;

  const favorable =
    targetCount * (targetCount - 1) * (targetCount - 2);

  const denominator =
    total * (total - 1) * (total - 2);

  return makeProbabilityQuestion({
    category: 'balls',
    difficulty,

    question:
      `Dalam kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang mengambil tiga bola merah berturut-turut tanpa pengembalian?`,

    favorable,
    total: denominator,

    steps: [
      `Awalnya terdapat ${targetCount} bola merah dari ${total} bola.`,
      `Peluang pertama = ${targetCount}/${total}.`,
      `Peluang kedua setelah satu bola merah diambil = ${targetCount - 1}/${total - 1}.`,
      `Peluang ketiga = ${targetCount - 2}/${total - 2}.`,
      `Kalikan ketiganya untuk memperoleh peluang seluruh pengambilan berwarna merah.`
    ]
  });
}

/* =============================================
   PERMUTATION AND COMBINATION QUESTIONS
============================================= */

function generateCounting(difficulty) {

  let n;
  let r;
  let type;

  if (difficulty === 'easy') {
    n = randomInt(5, 9);
    r = randomInt(2, 3);
    type = 'combination';
  } else if (difficulty === 'medium') {
    n = randomInt(7, 11);
    r = randomInt(2, 4);
    type = 'permutation';
  } else {
    n = randomInt(10, 15);
    r = randomInt(4, 6);
    type = pick(['permutation', 'combination']);
  }

  const answer = type === 'permutation'
    ? permutation(n, r)
    : combination(n, r);

  const kindName = type === 'permutation'
    ? 'permutasi'
    : 'kombinasi';

  const question = type === 'permutation'
    ? `${n} orang akan menempati ${r} posisi berbeda. Berapa banyak susunan yang mungkin?`
    : `Dari ${n} orang akan dipilih ${r} orang sebagai satu kelompok. Berapa banyak kelompok yang bisa dibentuk?`;

  const formula = type === 'permutation'
    ? `P(${n},${r}) = ${n}! / (${n}-${r})!`
    : `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`;

  return makeCountingQuestion({
    category: 'counting',
    difficulty,

    question,

    answer: Number(answer),

    answerUnit:
      type === 'permutation'
        ? 'susunan'
        : 'kombinasi',

    solverPrompt: type === 'permutation'
      ? `Permutasi: berapa banyak susunan ${r} orang dari ${n} orang?`
      : `Kombinasi: berapa banyak cara memilih ${r} orang dari ${n} orang?`,

    steps: [
      `Jumlah keseluruhan objek n = ${n}.`,
      `Jumlah objek yang dipilih r = ${r}.`,
      type === 'permutation'
        ? 'Karena urutan posisi berbeda, gunakan permutasi.'
        : 'Karena kelompok tidak memperhatikan urutan, gunakan kombinasi.',
      `Gunakan rumus ${formula}.`,
      `Hasilnya adalah ${Number(answer).toLocaleString('id-ID')} ${type === 'permutation' ? 'susunan' : 'kombinasi'}.`
    ]
  });
}

/* =============================================
   CONDITIONAL PROBABILITY QUESTIONS
============================================= */

function generateConditional(difficulty) {

  const population = randomInt(40, 60);

  const mathCount = randomInt(15, 25);
  const physicsCount = randomInt(12, 22);

  const minimumIntersection =
    Math.max(1, mathCount + physicsCount - population);

  const maximumIntersection =
    Math.min(mathCount, physicsCount);

  const intersection = randomInt(
    minimumIntersection,
    maximumIntersection
  );

  const question =
    `Dalam kelas terdapat ${population} siswa. ` +
    `Sebanyak ${mathCount} siswa menyukai matematika, ` +
    `${physicsCount} siswa menyukai fisika, dan ` +
    `${intersection} siswa menyukai keduanya. ` +
    `Berapa peluang siswa menyukai matematika jika diketahui menyukai fisika?`;

  const favorable = intersection;
  const total = physicsCount;

  return makeProbabilityQuestion({
    category: 'conditional',
    difficulty,
    question,

    favorable,
    total,

    solverPrompt: question,

    steps: [
      `Jumlah siswa yang menyukai fisika adalah ${physicsCount}. Ini menjadi kelompok yang diketahui.`,
      `Jumlah siswa yang menyukai kedua mata pelajaran adalah ${intersection}.`,
      `Rumus peluang bersyarat: P(M|F) = P(M ∩ F) / P(F).`,
      `P(M|F) = ${intersection}/${physicsCount} = ${fraction(intersection, physicsCount)}.`
    ]
  });
}

/* =============================================
   SPECIAL QUESTION: MULTI SELECT
============================================= */

function generateMultiDice() {

  const target = pick([6, 7, 8, 9]);

  const correctPairs = [];

  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      if (a + b === target) {
        correctPairs.push(`${a}-${b}`);
      }
    }
  }

  const distractors = [];

  while (distractors.length < 3) {
    const a = randomInt(1, 6);
    const b = randomInt(1, 6);
    const pair = `${a}-${b}`;

    if (
      a + b !== target &&
      !distractors.includes(pair)
    ) {
      distractors.push(pair);
    }
  }

  const options = shuffle([
    ...correctPairs,
    ...distractors
  ]).map((value, index) => ({
    id: `pair-${index}`,
    text: `(${value.replace('-', ', ')})`,
    pair: value
  }));

  const correctIds = options
    .filter((option) => correctPairs.includes(option.pair))
    .map((option) => option.id);

  return {
    id: hashString(`multi-dice-${target}-${options.map(x => x.pair).join(',')}`),
    category: 'dice',
    difficulty: 'medium',
    type: 'multi',
    question:
      `Dua dadu dilempar bersamaan. Pilih SEMUA pasangan yang menghasilkan jumlah ${target}.`,

    options,
    correctIds,

    answerDisplay:
      `${correctIds.length} pasangan yang benar`,

    solverPrompt:
      `Dua buah dadu dilempar bersamaan. Berapa peluang mendapatkan jumlah mata dadu ${target}?`,

    steps: [
      'Dua dadu mempunyai 36 kemungkinan pasangan.',
      `Cari pasangan angka yang jumlahnya ${target}.`,
      `Pasangan yang benar adalah: ${correctPairs.map(p => `(${p.replace('-', ', ')})`).join(', ')}.`,
      `Terdapat ${correctPairs.length} pasangan yang memenuhi kondisi.`
    ]
  };
}

/* =============================================
   SPECIAL QUESTION: ORDERING
============================================= */

function generateOrderingQuestion() {

  const steps = [
    {
      id: 'sample',
      text: 'Menentukan seluruh ruang sampel.'
    },
    {
      id: 'event',
      text: 'Menentukan kejadian yang diinginkan.'
    },
    {
      id: 'formula',
      text: 'Memasukkan jumlah kejadian dan ruang sampel ke rumus.'
    },
    {
      id: 'result',
      text: 'Menyederhanakan hasil dan menuliskan jawaban akhir.'
    }
  ];

  return {
    id: hashString(
      'ordering-dice-' +
      steps.map(step => step.id).join('-')
    ),

    category: 'dice',
    difficulty: 'medium',
    type: 'ordering',

    question:
      'Urutkan langkah-langkah yang benar dalam menyelesaikan soal peluang dua dadu.',

    orderOptions: shuffle(steps),

    correctOrder: steps.map(step => step.id),

    answerDisplay:
      'Empat langkah disusun secara benar',

    steps: [
      'Pertama, tentukan seluruh kemungkinan hasil.',
      'Kedua, tentukan kejadian yang dicari.',
      'Ketiga, gunakan rumus peluang.',
      'Terakhir, sederhanakan hasil dan tuliskan kesimpulan.'
    ]
  };
}

/* =============================================
   SELECT QUESTION CATEGORY
============================================= */

function createBaseQuestion(category, difficulty) {

  switch (category) {
    case 'dice':
      return generateDice(difficulty);

    case 'coin':
      return generateCoin(difficulty);

    case 'cards':
      return generateCards(difficulty);

    case 'balls':
      return generateBalls(difficulty);

    case 'counting':
      return generateCounting(difficulty);

    case 'conditional':
      return generateConditional(difficulty);

    default:
      return null;
  }
}

/* =============================================
   CONVERT TO MCQ
============================================= */

function decorateQuestion(question, type) {

  if (type === 'multi' || type === 'ordering') {
    return question;
  }

  question.type = type;

  if (type === 'numeric') {

    question.inputHelp =
      question.kind === 'counting'
        ? 'Masukkan jawaban berupa bilangan bulat.'
        : 'Masukkan hasil dalam persen tanpa tanda %. Contoh: 50 atau 22.22';

    question.correctText =
      question.answerDisplay;

    return question;
  }

  const correct = question.answerNumeric;

  const distractorOffsets =
    question.kind === 'counting'
      ? [1, -1, 2, -2, 5]
      : [5, -5, 10, -10, 15, -15, 20];

  const distractors = [];

  for (const offset of distractorOffsets) {

    let value =
      question.kind === 'counting'
        ? Math.max(0, Math.round(correct + offset))
        : Math.max(0, Math.min(100, correct + offset));

    if (
      value !== correct &&
      !distractors.some(item => item.value === value)
    ) {
      distractors.push({
        value,
        text:
          question.kind === 'counting'
            ? `${value.toLocaleString('id-ID')} ${question.answerUnit}`
            : `${value.toFixed(2)}%`
      });
    }
  }

  const choices = shuffle([
    {
      value: correct,
      text: question.answerDisplay,
      correct: true
    },
    ...distractors.slice(0, 3).map(item => ({
      ...item,
      correct: false
    }))
  ]);

  question.options = choices.map((item, index) => ({
    id: `option-${index}`,
    text: item.text,
    correct: item.correct
  }));

  question.correctOptionId =
    question.options.find(item => item.correct).id;

  question.correctText = question.answerDisplay;

  return question;
}

/* =============================================
   GENERATE QUIZ SESSION
============================================= */

export function createQuizQuestions(
  category = 'all',
  difficulty = 'easy',
  count = 10,
  usedIds = []
) {

  const questions = [];

  const usedInSession = new Set();

  const usedBefore = new Set(usedIds);

  const availableCategories =
    category === 'all'
      ? CATEGORIES
      : [category];

  let attempts = 0;

  while (
    questions.length < count &&
    attempts < 1500
  ) {

    attempts++;

    const index = questions.length;

    let question;

    // Untuk kategori campuran, gunakan
    // keempat format pertanyaan.
    if (category === 'all' && index % 4 === 2) {

      question = generateMultiDice();

    } else if (category === 'all' && index % 4 === 3) {

      question = generateOrderingQuestion();

    } else {

      const selectedCategory =
        category === 'all'
          ? pick(availableCategories)
          : category;

      const type = index % 2 === 0
        ? 'mcq'
        : 'numeric';

      question = decorateQuestion(
        createBaseQuestion(
          selectedCategory,
          difficulty
        ),
        type
      );
    }

    if (!question) continue;

    if (usedInSession.has(question.id)) continue;

    // Utamakan soal yang belum pernah dikerjakan.
    if (usedBefore.has(question.id)) continue;

    usedInSession.add(question.id);

    questions.push(question);
  }

  // Jika bank soal lama dan kombinasi parameternya
  // habis, prioritaskan tidak mengulang soal
  // dalam sesi yang sama.

  let wasRecycled = false;


let recycleAttempts = 0;

while (
  questions.length < count &&
  recycleAttempts < 5000
) {

  recycleAttempts++;

  wasRecycled = true;

  const index = questions.length;

  const selectedCategory =
    category === 'all'
      ? pick(availableCategories)
      : category;

  const question = decorateQuestion(
    createBaseQuestion(
      selectedCategory,
      difficulty
    ),
    index % 2 === 0 ? 'mcq' : 'numeric'
  );

  if (
    !question ||
    usedInSession.has(question.id)
  ) {
    continue;
  }

  usedInSession.add(question.id);

  questions.push(question);
}

if (questions.length < count) {
  console.warn(
    `Bank hanya dapat menghasilkan ${questions.length} soal unik untuk kombinasi ini.`
  );

}

return {
  questions,
  wasRecycled
};
}