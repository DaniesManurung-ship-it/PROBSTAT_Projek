
/* ==========================================
   ADVANCED PROBABILITY ENGINE
   PERMUTATION & COMBINATION
========================================== */

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[,.!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function factorial(n) {
  let result = 1n;

  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }

  return result;
}

function permutation(n, r) {
  let result = 1n;

  for (let i = 0; i < r; i++) {
    result *= BigInt(n - i);
  }

  return result;
}

function combination(n, r) {
  if (r > n) return 0n;

  r = Math.min(r, n - r);

  let result = 1n;

  for (let i = 1; i <= r; i++) {
    result =
      result * BigInt(n - r + i) / BigInt(i);
  }

  return result;
}

export function analyzeAdvancedProblem(rawText) {
  const text = normalize(rawText);

  // Jangan mengambil alih soal yang sudah
  // ditangani oleh laboratorium dasar.
  if (/\b(dadu|koin|kartu|bola)\b/.test(text)) {
    return null;
  }

  const isPermutation =
    /\b(permutasi|susunan|menyusun)\b/.test(text);

  const isCombination =
    /\b(kombinasi|memilih|dipilih)\b/.test(text);

  if (!isPermutation && !isCombination) {
    return null;
  }

  const type = isPermutation
    ? 'permutation'
    : 'combination';

  let n;
  let r;

  // Contoh:
  // Kombinasi memilih 3 dari 8
  // Susunan 3 orang dari 8 orang

  let match = text.match(
    /(?:permutasi|kombinasi|susunan|menyusun|memilih)\s+(?:memilih\s+|menyusun\s+)?(\d+)\s*(?:orang|siswa|benda|objek)?\s+dari\s+(\d+)/
  );

  if (match) {
    r = Number(match[1]);
    n = Number(match[2]);
  }

  // Alternatif:
  // Dari 8 orang dipilih 3 orang.

  if (!match) {
    match = text.match(
      /dari\s+(\d+)\s*(?:orang|siswa|benda|objek)?\s+(?:dipilih|memilih)\s+(\d+)/
    );

    if (match) {
      n = Number(match[1]);
      r = Number(match[2]);
    }
  }

  if (
    !Number.isSafeInteger(n) ||
    !Number.isSafeInteger(r)
  ) {
    return {
      error:
        'Jumlah objek dan jumlah pilihan belum dikenali. Contoh: Kombinasi memilih 3 orang dari 8 orang.'
    };
  }

  if (n < 1 || n > 1000 || r < 0 || r > n) {
    return {
      error:
        'Gunakan jumlah objek antara 1 sampai 1000 dan pilihan antara 0 sampai n.'
    };
  }

  if (type === 'permutation' && n > 170) {
    return {
      error:
        'Untuk permutasi, prototipe ini membatasi jumlah objek maksimal 170.'
    };
  }

  const answer = type === 'permutation'
    ? permutation(n, r)
    : combination(n, r);

  const symbol = type === 'permutation' ? 'P' : 'C';

  const formula = type === 'permutation'
    ? `${n}P${r} = ${n}! / (${n}-${r})!`
    : `${n}C${r} = ${n}! / (${r}! × (${n}-${r})!)`;

  const answerValue = answer.toString();

  return {
    kind: 'counting',
    model: 'counting',

    countType: type,

    n,
    r,

    answerValue,

    answerLabel: type === 'permutation'
      ? 'susunan'
      : 'kombinasi',

    formula,

    favorable: 1,
    total: 1,

    fraction: answerValue,
    percentage: null,

    sample: [
      {
        value: `n = ${n}`,
        favorable: false
      },
      {
        value: `r = ${r}`,
        favorable: false
      },
      {
        value: type === 'permutation'
          ? 'Urutan penting'
          : 'Urutan tidak penting',
        favorable: true
      }
    ],

    steps: [
      `Terdapat ${n} objek secara keseluruhan.`,
      `Kita memilih atau menyusun ${r} objek.`,
      type === 'permutation'
        ? 'Karena urutan diperhatikan, kita menggunakan permutasi.'
        : 'Karena urutan tidak diperhatikan, kita menggunakan kombinasi.',
      `Perhitungan menggunakan rumus ${formula}. Hasilnya adalah ${answerValue}.`
    ],

    description: type === 'permutation'
      ? 'Objek disusun secara berurutan. Perubahan urutan menghasilkan susunan yang berbeda.'
      : 'Objek dipilih sebagai satu kelompok. Perubahan urutan tidak menghasilkan kombinasi baru.',

    summary: `Terdapat ${answerValue} ${type === 'permutation' ? 'susunan' : 'kombinasi'} yang mungkin.`
  };
}


/* ==========================================
   STAGE 10 - CONDITIONAL PROBABILITY
========================================== */

export function analyzeConditionalProblem(rawText) {
  const text = normalize(rawText);

  // Versi awal mendukung contoh konteks
  // matematika dan fisika pada siswa.

  if (!/jika diketahui|dengan syarat|diketahui/.test(text)) {
    return null;
  }

  const totalMatch = text.match(
    /(?:terdapat|ada)\s+(\d+)\s+siswa/
  );

  const mathMatch = text.match(
    /(\d+)\s+siswa\s+(?:yang\s+)?(?:menyukai|suka)\s+matematika/
  );

  const physicsMatch = text.match(
    /(\d+)\s+siswa\s+(?:yang\s+)?(?:menyukai|suka)\s+fisika/
  );

  const bothMatch = text.match(
    /(\d+)\s+siswa\s+(?:yang\s+)?(?:menyukai|suka)\s+keduanya/
  );

  if (!totalMatch || !mathMatch || !physicsMatch || !bothMatch) {
    return {
      error:
        'Data peluang bersyarat belum lengkap. Cantumkan jumlah total, jumlah yang menyukai matematika, fisika, dan jumlah yang menyukai keduanya.'
    };
  }

  const population = Number(totalMatch[1]);
  const mathCount = Number(mathMatch[1]);
  const physicsCount = Number(physicsMatch[1]);
  const intersection = Number(bothMatch[1]);

  const isMathGivenPhysics =
    /matematika.*(?:jika diketahui|dengan syarat|diketahui).*fisika/.test(text);

  const isPhysicsGivenMath =
    /fisika.*(?:jika diketahui|dengan syarat|diketahui).*matematika/.test(text);

  if (isMathGivenPhysics === isPhysicsGivenMath) {
    return {
      error:
        'Kejadian yang ditanyakan belum jelas. Gunakan kalimat: peluang matematika jika diketahui fisika, atau sebaliknya.'
    };
  }

  if (
    !Number.isInteger(population) ||
    !Number.isInteger(mathCount) ||
    !Number.isInteger(physicsCount) ||
    !Number.isInteger(intersection) ||
    population < 1 ||
    mathCount < 0 ||
    physicsCount < 0 ||
    intersection < 0 ||
    mathCount > population ||
    physicsCount > population ||
    intersection > Math.min(mathCount, physicsCount) ||
    mathCount + physicsCount - intersection > population
  ) {
    return {
      error:
        'Data jumlah siswa tidak konsisten. Periksa kembali jumlah total dan jumlah siswa pada setiap kejadian.'
    };
  }

  const eventA = isMathGivenPhysics
    ? 'Matematika'
    : 'Fisika';

  const eventB = isMathGivenPhysics
    ? 'Fisika'
    : 'Matematika';

  const countA = isMathGivenPhysics
    ? mathCount
    : physicsCount;

  const countB = isMathGivenPhysics
    ? physicsCount
    : mathCount;

  const aOnly = countA - intersection;
  const bOnly = countB - intersection;

  const neither =
    population - countA - countB + intersection;

  const favorable = intersection;
  const total = countB;

  const divisor = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const gcd = divisor(favorable, total) || 1;

  const fraction =
    `${favorable / gcd}/${total / gcd}`;

  const percentage =
    favorable / total * 100;

  return {
    kind: 'conditional',
    model: 'conditional',

    population,

    eventA,
    eventB,

    mathCount,
    physicsCount,
    intersection,

    regions: {
      aOnly,
      intersection,
      bOnly,
      neither
    },

    favorable,
    total,

    fraction,
    percentage,

    sample: [
      {
        value: `${eventA} saja: ${aOnly}`,
        favorable: false
      },
      {
        value: `Keduanya: ${intersection}`,
        favorable: true
      },
      {
        value: `${eventB} saja: ${bOnly}`,
        favorable: false
      },
      {
        value: `Tidak keduanya: ${neither}`,
        favorable: false
      }
    ],

    steps: [
      `Total populasi adalah ${population} siswa.`,
      `${countB} siswa menyukai ${eventB.toLowerCase()}. Ini menjadi kelompok yang diketahui.`,
      `${intersection} siswa menyukai ${eventA.toLowerCase()} sekaligus ${eventB.toLowerCase()}.`,
      `P(${eventA}|${eventB}) = ${intersection}/${countB} = ${fraction}.`
    ],

    description:
      'Diagram Venn menunjukkan dua kelompok siswa dan bagian yang menyukai kedua mata pelajaran.',

    summary:
      `Dari ${countB} siswa yang menyukai ${eventB.toLowerCase()}, terdapat ${intersection} siswa yang juga menyukai ${eventA.toLowerCase()}. Peluang bersyaratnya adalah ${percentage.toFixed(2)}%.`
  };
}
