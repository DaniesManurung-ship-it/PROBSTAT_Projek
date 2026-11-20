const categories = new Set([
  'dice',
  'coin',
  'cards',
  'balls',
  'counting',
  'conditional',
  'binomial',
  'out_of_scope'
]);

const statuses = new Set([
  'success',
  'needs_confirmation',
  'clarification',
  'uncertain',
  'ai_solved',
  'unsupported'
]);

const eventTypes = new Set([
  'even',
  'odd',
  'face_equals',
  'factor_of',
  'sum_equals',
  'product_equals',
  'same_faces',
  'at_least_one_face_equals',
  'at_most_one_face_equals',
  'coin_side',
  'card_event',
  'binomial_exact',
  'color_draw',
  'same_color_draw',
  'counting',
  'conditional',
  'unknown'
]);

const visualizationShapes = new Set(['sphere', 'cube', 'card', 'coin', 'cylinder', 'token']);
const visualizationColors = new Set([
  'red', 'blue', 'yellow', 'white', 'green', 'purple', 'orange', 'black', 'gray', 'gold', 'neutral'
]);

const fields = [
  'status',
  'category',
  'confidence',
  'diceCount',
  'sidesPerDie',
  'trialCount',
  'eventType',
  'target',
  'successProbability',
  'coinSide',
  'cardEvent',
  'ballCounts',
  'ballTarget',
  'drawCount',
  'replacement',
  'countingType',
  'n',
  'r',
  'population',
  'mathCount',
  'physicsCount',
  'bothCount',
  'conditionalEvent',
  'solution',
  'missingInformation',
  'clarification',
  'interpretation'
];

const isIntegerOrNull = (value) => value === null || Number.isSafeInteger(value);
const isCount = (value) => Number.isSafeInteger(value) && value >= 0;

function hasExpectedShape(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  const requiredFields = fields.filter((field) => field !== 'solution');

  return keys.every((key) => fields.includes(key)) &&
    requiredFields.every((field) => Object.hasOwn(value, field));
}

function isValidSolution(solution) {
  if (solution === null) return true;
  if (!solution || typeof solution !== 'object' || Array.isArray(solution)) return false;
  const keys = Object.keys(solution);
  const expectedKeys = [
    'known', 'asked', 'analysis', 'formula', 'answer', 'steps', 'conclusion', 'visualization'
  ];
  const visualization = solution.visualization;
  const items = visualization?.items;
  const itemKeys = ['shape', 'label', 'color', 'count', 'favorable'];
  return keys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.hasOwn(solution, key)) &&
    Array.isArray(solution.known) &&
    solution.known.length > 0 &&
    solution.known.length <= 12 &&
    solution.known.every((item) => typeof item === 'string' && item.trim().length > 0) &&
    ['asked', 'analysis', 'conclusion'].every((key) =>
      typeof solution[key] === 'string' && solution[key].trim().length > 0
    ) &&
    typeof solution.formula === 'string' &&
    solution.formula.trim().length > 0 &&
    typeof solution.answer === 'string' &&
    solution.answer.trim().length > 0 &&
    Array.isArray(solution.steps) &&
    solution.steps.length > 0 &&
    solution.steps.length <= 10 &&
    solution.steps.every((step) => typeof step === 'string' && step.trim().length > 0) &&
    visualization &&
    typeof visualization === 'object' &&
    !Array.isArray(visualization) &&
    Object.keys(visualization).length === 3 &&
    typeof visualization.title === 'string' &&
    visualization.title.trim().length > 0 &&
    typeof visualization.caption === 'string' &&
    visualization.caption.trim().length > 0 &&
    Array.isArray(items) &&
    items.length > 0 &&
    items.length <= 12 &&
    items.every((item) =>
      item && typeof item === 'object' && !Array.isArray(item) &&
      Object.keys(item).length === itemKeys.length &&
      itemKeys.every((key) => Object.hasOwn(item, key)) &&
      visualizationShapes.has(item.shape) &&
      typeof item.label === 'string' && item.label.trim().length > 0 &&
      visualizationColors.has(item.color) &&
      Number.isSafeInteger(item.count) && item.count >= 1 && item.count <= 1000 &&
      typeof item.favorable === 'boolean'
    );
}

function checkProbabilityData(data) {
  const missing = [...data.missingInformation];
  const addMissing = (field) => {
    if (!missing.includes(field)) missing.push(field);
  };

  if (data.category === 'dice') {
    if (![1, 2, 3].includes(data.diceCount)) addMissing('jumlah dadu (satu sampai tiga)');
    if (data.sidesPerDie === null) addMissing('jumlah sisi setiap dadu');

    if (data.diceCount === 1 && !['even', 'odd', 'face_equals', 'factor_of'].includes(data.eventType)) {
      addMissing('kejadian yang ditanyakan pada satu dadu');
    }

    if (data.diceCount >= 2 && ![
      'sum_equals',
      'product_equals',
      'same_faces',
      'at_least_one_face_equals',
      'at_most_one_face_equals'
    ].includes(data.eventType)) {
      addMissing('hubungan atau kejadian yang ditanyakan pada dua atau tiga dadu');
    }

    if (['face_equals', 'factor_of', 'at_least_one_face_equals', 'at_most_one_face_equals'].includes(data.eventType) &&
      !Number.isInteger(data.target)) {
      addMissing(data.eventType === 'factor_of'
        ? 'bilangan yang dicari faktor-faktornya'
        : 'angka dadu yang ditanyakan');
    }

    if (data.eventType === 'factor_of' && Number.isInteger(data.target) && data.target < 1) {
      addMissing('bilangan positif yang dicari faktor-faktornya');
    }

    if (data.eventType === 'sum_equals' && !Number.isInteger(data.target)) {
      addMissing('jumlah mata dadu yang ditanyakan');
    }

    if (data.eventType === 'product_equals' && !Number.isInteger(data.target)) {
      addMissing('hasil kali mata dadu yang ditanyakan');
    }
  }

  if (data.category === 'coin') {
    if (data.eventType !== 'coin_side') addMissing('kejadian sisi koin');
    if (!['angka', 'gambar'].includes(data.coinSide)) {
      addMissing('sisi koin (angka atau gambar)');
    }
  }

  if (data.category === 'cards') {
    if (data.eventType !== 'card_event') addMissing('kejadian kartu');
    if (!['red', 'black', 'spade', 'ace', 'face', 'red_ace'].includes(data.cardEvent)) {
      addMissing('jenis kartu yang didukung (merah, hitam, sekop, As, atau bergambar)');
    }
  }

  if (data.category === 'binomial') {
    if (data.eventType !== 'binomial_exact') addMissing('kejadian sukses tepat pada distribusi binomial');
    if (!Number.isInteger(data.n) || data.n < 1 || data.n > 1000) {
      addMissing('jumlah percobaan binomial (1 sampai 1000)');
    }
    if (!Number.isInteger(data.target) || data.target < 0 || data.target > data.n) {
      addMissing('jumlah sukses yang ditanyakan (0 sampai n)');
    }
    if (!Number.isFinite(data.successProbability) ||
      data.successProbability < 0 || data.successProbability > 1) {
      addMissing('peluang sukses pada setiap percobaan (0 sampai 1)');
    }
  }

  if (data.category === 'balls') {
    const counts = data.ballCounts;
    const colors = ['merah', 'biru', 'kuning', 'putih'];
    const hasCounts = counts && colors.every((color) => isCount(counts[color]));
    const total = hasCounts ? colors.reduce((sum, color) => sum + counts[color], 0) : 0;

    if (!hasCounts || total < 1 || total > 30) {
      addMissing('jumlah bola merah, biru, kuning, dan putih (total maksimal 30)');
    }

    if (!colors.includes(data.ballTarget)) addMissing('warna bola yang dicari');

    if (data.drawCount !== 1 && data.drawCount !== 2) {
      addMissing('jumlah bola yang diambil (satu atau dua)');
    }

    if (data.drawCount === 1 && data.eventType !== 'color_draw') {
      addMissing('kejadian warna bola yang dicari');
    }
    if (data.drawCount === 2 && data.eventType !== 'same_color_draw') {
      addMissing('kejadian dua bola dengan warna yang dicari');
    }

    if (data.drawCount === 2 && !['with', 'without'].includes(data.replacement)) {
      addMissing('pengambilan dengan atau tanpa pengembalian');
    }

    if (data.drawCount === 2 && data.replacement === 'without' && total < 2) {
      addMissing('jumlah bola total minimal dua untuk pengambilan tanpa pengembalian');
    }
  }

  if (data.category === 'counting') {
    if (data.eventType !== 'counting') addMissing('jenis perhitungan');
    if (!['permutation', 'combination'].includes(data.countingType)) {
      addMissing('jenis perhitungan (permutasi atau kombinasi)');
    }
    if (!Number.isInteger(data.n) || data.n < 1 || data.n > 1000) {
      addMissing('jumlah seluruh objek (1 sampai 1000)');
    }
    if (!Number.isInteger(data.r) || data.r < 0 || data.r > data.n) {
      addMissing('jumlah objek yang dipilih (0 sampai n)');
    }
  }

  if (data.category === 'conditional') {
    if (data.eventType !== 'conditional') addMissing('jenis peluang bersyarat');
    const numbers = [data.population, data.mathCount, data.physicsCount, data.bothCount];
    if (!numbers.every(isCount) || data.population < 1 ||
      data.mathCount > data.population ||
      data.physicsCount > data.population ||
      data.bothCount > Math.min(data.mathCount, data.physicsCount) ||
      data.mathCount + data.physicsCount - data.bothCount > data.population) {
      addMissing('data jumlah siswa total, matematika, fisika, dan keduanya yang konsisten');
    }
    if (!['math_given_physics', 'physics_given_math'].includes(data.conditionalEvent)) {
      addMissing('arah peluang bersyarat yang ditanyakan');
    } else {
      const denominator = data.conditionalEvent === 'math_given_physics'
        ? data.physicsCount
        : data.mathCount;
      if (denominator === 0) {
        addMissing('kejadian syarat harus memiliki anggota agar peluang bersyarat terdefinisi');
      }
    }
  }

  return { missing };
}

export function validateInterpretation(value) {
  if (!hasExpectedShape(value)) {
    return { valid: false, error: 'Respons interpretasi AI tidak sesuai format yang diharapkan.' };
  }

  value = { ...value, solution: value.solution ?? null };

  if (
    !statuses.has(value.status) ||
    !categories.has(value.category) ||
    !Number.isFinite(value.confidence) ||
    value.confidence < 0 ||
    value.confidence > 1 ||
    !eventTypes.has(value.eventType) ||
    !Array.isArray(value.missingInformation) ||
    !value.missingInformation.every((item) => typeof item === 'string') ||
    typeof value.clarification !== 'string' ||
    typeof value.interpretation !== 'string' ||
    !['angka', 'gambar', 'unknown'].includes(value.coinSide) ||
    !['red', 'black', 'spade', 'ace', 'face', 'red_ace', 'unknown'].includes(value.cardEvent) ||
    !['merah', 'biru', 'kuning', 'putih', 'unknown'].includes(value.ballTarget) ||
    !['with', 'without', 'unspecified', 'not_applicable'].includes(value.replacement) ||
    !['permutation', 'combination', 'not_applicable'].includes(value.countingType) ||
    !['math_given_physics', 'physics_given_math', 'unknown'].includes(value.conditionalEvent) ||
    !(value.successProbability === null ||
      (Number.isFinite(value.successProbability) &&
        value.successProbability >= 0 && value.successProbability <= 1)) ||
    !isValidSolution(value.solution) ||
    !['null', 'object'].includes(value.ballCounts === null ? 'null' :
      typeof value.ballCounts === 'object' && !Array.isArray(value.ballCounts) ? 'object' : 'invalid') ||
    !['diceCount', 'sidesPerDie', 'target', 'drawCount', 'n', 'r', 'population',
      'trialCount', 'mathCount', 'physicsCount', 'bothCount'].every((key) => isIntegerOrNull(value[key]))
  ) {
    return { valid: false, error: 'Respons interpretasi AI tidak sesuai format yang diharapkan.' };
  }

  if (value.ballCounts !== null) {
    const expectedColors = ['merah', 'biru', 'kuning', 'putih'];
    const keys = Object.keys(value.ballCounts);
    if (keys.length !== expectedColors.length ||
      !expectedColors.every((color) => keys.includes(color)) ||
      !expectedColors.every((color) => isIntegerOrNull(value.ballCounts[color]))) {
      return { valid: false, error: 'Rincian jumlah bola dari AI tidak valid.' };
    }
  }

  if (value.trialCount !== null && value.trialCount < 1) {
    return { valid: false, error: 'Jumlah percobaan harus berupa bilangan bulat positif.' };
  }

  if (value.status === 'ai_solved') {
    if (!value.solution) {
      return { valid: false, error: 'Jawaban AI belum menyertakan rumus dan langkah penyelesaian.' };
    }
    return { valid: true, data: { ...value, missingInformation: [] } };
  }

  if (value.category === 'out_of_scope' || value.status === 'unsupported') {
    return { valid: true, data: { ...value, status: 'unsupported' } };
  }

  if (value.category === 'dice' &&
    ((value.diceCount !== null && value.diceCount > 3) ||
      (value.sidesPerDie !== null && value.sidesPerDie !== 6) ||
      (value.trialCount !== null && value.trialCount > 1))) {
    return {
      valid: true,
      data: {
        ...value,
        status: 'unsupported',
        clarification: value.clarification ||
          'Mesin probabilitas saat ini belum mendukung karakteristik atau pengulangan dadu ini.'
      }
    };
  }

  const checked = checkProbabilityData(value);
  if (checked.error) return { valid: false, error: checked.error };

  const missingInformation = [...new Set(checked.missing)];
  const status = missingInformation.length > 0 || value.status === 'clarification'
    ? 'clarification'
    : value.status === 'needs_confirmation'
      ? 'needs_confirmation'
      : value.status === 'uncertain' || value.confidence < 0.75
        ? 'uncertain'
        : 'success';

  return {
    valid: true,
    data: {
      ...value,
      status,
      missingInformation
    }
  };
}

export function toCanonicalProblem(data) {
  if (data.status !== 'success') return null;

  if (data.category === 'dice') {
    if (data.diceCount === 1) {
      const event = data.eventType === 'even'
        ? 'genap'
        : data.eventType === 'odd'
          ? 'ganjil'
          : data.eventType === 'factor_of'
            ? `faktor dari ${data.target}`
          : data.target;
      return `Sebuah dadu dilempar. Berapa peluang muncul angka ${event}?`;
    }
    const dice = data.diceCount === 2 ? 'kedua dadu' : 'ketiga dadu';
    const diceCount = data.diceCount === 2 ? 'Dua' : 'Tiga';
    const event = {
      sum_equals: `jumlah mata ${dice} sama dengan ${data.target}`,
      product_equals: `hasil kali mata ${dice} sama dengan ${data.target}`,
      same_faces: `semua dadu menunjukkan angka yang sama`,
      at_least_one_face_equals: `minimal satu dari ${data.diceCount} dadu menunjukkan angka ${data.target}`,
      at_most_one_face_equals: `maksimal satu dari ${data.diceCount} dadu menunjukkan angka ${data.target}`
    }[data.eventType];
    return `${diceCount} buah dadu dilempar bersamaan. Berapa peluang ${event}?`;
  }

  if (data.category === 'coin') {
    return `Sebuah koin dilempar. Berapa peluang muncul sisi ${data.coinSide}?`;
  }

  if (data.category === 'cards') {
    const event = {
      red: 'merah',
      black: 'hitam',
      spade: 'sekop',
      ace: 'As',
      red_ace: 'As merah',
      face: 'bergambar'
    }[data.cardEvent];
    return `Dari 52 kartu remi, berapa peluang mengambil kartu ${event}?`;
  }

  if (data.category === 'binomial') {
    return `Distribusi binomial dengan n=${data.n}, p=${data.successProbability}. Berapa peluang tepat ${data.target} sukses?`;
  }

  if (data.category === 'balls') {
    const counts = data.ballCounts;
    const draw = data.drawCount === 2
      ? `mengambil dua bola ${data.ballTarget} ${data.replacement === 'with' ? 'dengan pengembalian' : 'tanpa pengembalian'}`
      : `mengambil bola ${data.ballTarget}`;
    return `Dalam sebuah kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, ${counts.kuning} bola kuning, dan ${counts.putih} bola putih. Berapa peluang ${draw}?`;
  }

  if (data.category === 'counting') {
    const operation = data.countingType === 'permutation' ? 'permutasi' : 'kombinasi';
    const verb = data.countingType === 'permutation' ? 'susunan' : 'cara memilih';
    return `${operation}: berapa banyak ${verb} ${data.r} objek dari ${data.n} objek?`;
  }

  if (data.category === 'conditional') {
    const event = data.conditionalEvent === 'math_given_physics'
      ? 'matematika jika diketahui fisika'
      : 'fisika jika diketahui matematika';
    return `Dalam kelas terdapat ${data.population} siswa. Sebanyak ${data.mathCount} siswa menyukai matematika, ${data.physicsCount} siswa menyukai fisika, dan ${data.bothCount} siswa menyukai keduanya. Berapa peluang ${event}?`;
  }

  return null;
}
