const categories = new Set([
  'dice',
  'coin',
  'cards',
  'balls',
  'counting',
  'conditional',
  'out_of_scope'
]);

const statuses = new Set([
  'success',
  'needs_confirmation',
  'clarification',
  'uncertain',
  'unsupported'
]);

const eventTypes = new Set([
  'even',
  'odd',
  'face_equals',
  'sum_equals',
  'product_equals',
  'same_faces',
  'at_least_one_face_equals',
  'at_most_one_face_equals',
  'coin_side',
  'card_event',
  'color_draw',
  'same_color_draw',
  'counting',
  'conditional',
  'unknown'
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
  'missingInformation',
  'clarification',
  'interpretation'
];

const isIntegerOrNull = (value) => value === null || Number.isSafeInteger(value);
const isCount = (value) => Number.isSafeInteger(value) && value >= 0;

function hasExpectedShape(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);

  return keys.length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function checkProbabilityData(data) {
  const missing = [...data.missingInformation];
  const addMissing = (field) => {
    if (!missing.includes(field)) missing.push(field);
  };

  if (data.category === 'dice') {
    if (![1, 2].includes(data.diceCount)) addMissing('jumlah dadu (1 atau 2)');
    if (data.sidesPerDie === null) addMissing('jumlah sisi setiap dadu');

    if (data.diceCount === 1 && !['even', 'odd', 'face_equals'].includes(data.eventType)) {
      addMissing('kejadian yang ditanyakan pada satu dadu');
    }

    if (data.diceCount === 2 && ![
      'sum_equals',
      'product_equals',
      'same_faces',
      'at_least_one_face_equals',
      'at_most_one_face_equals'
    ].includes(data.eventType)) {
      addMissing('hubungan atau kejadian yang ditanyakan pada dua dadu');
    }

    if (['face_equals', 'at_least_one_face_equals', 'at_most_one_face_equals'].includes(data.eventType) &&
      !Number.isInteger(data.target)) {
      addMissing('angka dadu yang ditanyakan');
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
    if (!['red', 'black', 'spade', 'ace', 'face'].includes(data.cardEvent)) {
      addMissing('jenis kartu yang didukung (merah, hitam, sekop, As, atau bergambar)');
    }
  }

  if (data.category === 'balls') {
    const counts = data.ballCounts;
    const colors = ['merah', 'biru', 'kuning'];
    const hasCounts = counts && colors.every((color) => isCount(counts[color]));
    const total = hasCounts ? colors.reduce((sum, color) => sum + counts[color], 0) : 0;

    if (!hasCounts || total < 1 || total > 30) {
      addMissing('jumlah bola merah, biru, dan kuning (total maksimal 30)');
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
  if (!hasExpectedShape(value) ||
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
    !['red', 'black', 'spade', 'ace', 'face', 'unknown'].includes(value.cardEvent) ||
    !['merah', 'biru', 'kuning', 'unknown'].includes(value.ballTarget) ||
    !['with', 'without', 'unspecified', 'not_applicable'].includes(value.replacement) ||
    !['permutation', 'combination', 'not_applicable'].includes(value.countingType) ||
    !['math_given_physics', 'physics_given_math', 'unknown'].includes(value.conditionalEvent) ||
    !['null', 'object'].includes(value.ballCounts === null ? 'null' :
      typeof value.ballCounts === 'object' && !Array.isArray(value.ballCounts) ? 'object' : 'invalid') ||
    !['diceCount', 'sidesPerDie', 'target', 'drawCount', 'n', 'r', 'population',
      'trialCount', 'mathCount', 'physicsCount', 'bothCount'].every((key) => isIntegerOrNull(value[key]))
  ) {
    return { valid: false, error: 'Respons interpretasi AI tidak sesuai format yang diharapkan.' };
  }

  if (value.ballCounts !== null) {
    const expectedColors = ['merah', 'biru', 'kuning'];
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

  if (value.category === 'out_of_scope' || value.status === 'unsupported') {
    return { valid: true, data: { ...value, status: 'unsupported' } };
  }

  if (value.category === 'dice' &&
    ((value.diceCount !== null && value.diceCount > 2) ||
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
          : data.target;
      return `Sebuah dadu dilempar. Berapa peluang muncul angka ${event}?`;
    }
    const event = {
      sum_equals: `jumlah mata kedua dadu sama dengan ${data.target}`,
      product_equals: `hasil kali mata kedua dadu sama dengan ${data.target}`,
      same_faces: 'kedua dadu menunjukkan angka yang sama',
      at_least_one_face_equals: `minimal satu dadu menunjukkan angka ${data.target}`,
      at_most_one_face_equals: `maksimal satu dadu menunjukkan angka ${data.target}`
    }[data.eventType];
    return `Dua buah dadu dilempar bersamaan. Berapa peluang ${event}?`;
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
      face: 'bergambar'
    }[data.cardEvent];
    return `Dari 52 kartu remi, berapa peluang mengambil kartu ${event}?`;
  }

  if (data.category === 'balls') {
    const counts = data.ballCounts;
    const draw = data.drawCount === 2
      ? `mengambil dua bola ${data.ballTarget} ${data.replacement === 'with' ? 'dengan pengembalian' : 'tanpa pengembalian'}`
      : `mengambil bola ${data.ballTarget}`;
    return `Dalam sebuah kotak terdapat ${counts.merah} bola merah, ${counts.biru} bola biru, dan ${counts.kuning} bola kuning. Berapa peluang ${draw}?`;
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
