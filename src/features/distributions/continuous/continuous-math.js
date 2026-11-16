const PROBABILITY_EPSILON = 1e-12;

function assertFinite(value, label) {
  if (!Number.isFinite(value)) throw new RangeError(`${label} harus berupa angka yang valid.`);
}

function assertProbability(probability, allowEndpoints = true) {
  assertFinite(probability, 'Peluang');
  if (allowEndpoints ? probability < 0 || probability > 1 : probability <= 0 || probability >= 1) {
    throw new RangeError(allowEndpoints ? 'Peluang harus berada antara 0 dan 1.' : 'Peluang harus lebih dari 0 dan kurang dari 1.');
  }
}

function clampProbability(probability) {
  if (!Number.isFinite(probability)) throw new RangeError('Hasil peluang tidak dapat dihitung. Periksa kembali parameter.');
  if (probability < -PROBABILITY_EPSILON || probability > 1 + PROBABILITY_EPSILON) {
    throw new RangeError('Hasil peluang berada di luar 0 sampai 1. Periksa kembali parameter.');
  }
  return Math.max(0, Math.min(1, probability));
}

function standardNormalPdf(z) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

export function normalPdf(x, mu = 0, sigma = 1) {
  if (!(sigma > 0) || !Number.isFinite(sigma)) throw new RangeError('Simpangan baku harus lebih dari 0.');
  return standardNormalPdf((x - mu) / sigma) / sigma;
}

export function normalCdf(z) {
  assertFinite(z, 'Nilai Z');
  if (z <= -8) return 0;
  if (z >= 8) return 1;
  const absolute = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absolute);
  const polynomial = t * (
    0.319381530 + t * (
      -0.356563782 + t * (
        1.781477937 + t * (
          -1.821255978 + t * 1.330274429
        )
      )
    )
  );
  const tail = standardNormalPdf(absolute) * polynomial;
  return z >= 0 ? 1 - tail : tail;
}

export function normalQuantile(probability) {
  assertProbability(probability, false);
  let low = -10;
  let high = 10;
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (normalCdf(midpoint) < probability) low = midpoint;
    else high = midpoint;
  }
  return (low + high) / 2;
}

export function uniformCdf(x, a, b) {
  assertFinite(x, 'Batas x');
  assertFinite(a, 'Batas bawah a');
  assertFinite(b, 'Batas atas b');
  if (!(b > a)) throw new RangeError('Batas atas b harus lebih besar dari batas bawah a.');
  return Math.max(0, Math.min(1, (x - a) / (b - a)));
}

function eventText(variable, eventType, c, d, k, a, b, mode) {
  if (mode === 'quantile') return 'Cari x sehingga peluang yang ditentukan tercapai';
  if (mode === 'symmetricInterval') return 'Interval simetris di sekitar mean';
  if (eventType === 'lessOrEqual') return `P(${variable} ≤ ${c})`;
  if (eventType === 'lessThan') return `P(${variable} < ${c})`;
  if (eventType === 'greaterThan') return `P(${variable} > ${c})`;
  if (eventType === 'between') return `P(${c} ≤ ${variable} ≤ ${d})`;
  if (eventType === 'exact') return `P(${variable} = ${c})`;
  if (eventType === 'atLeast') return `P(${variable} ≥ ${k})`;
  if (eventType === 'atMost') return `P(${variable} ≤ ${k})`;
  if (eventType === 'strictLessThan') return `P(${variable} < ${k})`;
  if (eventType === 'strictGreaterThan') return `P(${variable} > ${k})`;
  if (eventType === 'integerBetween') return `P(${a} ≤ ${variable} ≤ ${b})`;
  return '';
}

function makeStep(title, explanation) {
  return { title, explanation };
}

function makeResult({ distribution, probability, event, parameters, intermediate = {}, formula, steps, chart, warnings = [], extra = {} }) {
  const safeProbability = clampProbability(probability);
  return {
    distribution,
    probability: safeProbability,
    percentage: safeProbability * 100,
    event,
    parameters,
    intermediate,
    formula,
    steps,
    chart,
    warnings,
    ...extra
  };
}

function continuousProbability({ eventType, c, d, mu, sigma, variable, cdf }) {
  if (eventType === 'lessThan' || eventType === 'lessOrEqual') {
    const z = (c - mu) / sigma;
    return { probability: normalCdf(z), z, lower: -Infinity, upper: c };
  }
  if (eventType === 'greaterThan' || eventType === 'greaterOrEqual') {
    const z = (c - mu) / sigma;
    return { probability: normalCdf(-z), z, lower: c, upper: Infinity };
  }
  if (eventType === 'between') {
    if (c > d) throw new RangeError('Batas bawah harus kurang dari atau sama dengan batas atas.');
    const zLower = (c - mu) / sigma;
    const zUpper = (d - mu) / sigma;
    return {
      probability: Math.max(0, cdf(zUpper) - cdf(zLower)),
      zLower, zUpper, lower: c, upper: d
    };
  }
  throw new RangeError(`Jenis kejadian ${variable} tidak dikenal.`);
}

export function calculateUniform({ a, b, eventType = 'between', c = 12, d = 16 }) {
  [a, b, c, d].forEach((value, index) => assertFinite(value, ['a', 'b', 'c', 'd'][index]));
  if (!(a < b)) throw new RangeError('Batas atas b harus lebih besar dari batas bawah a.');
  if (eventType === 'between' && c > d) throw new RangeError('Batas bawah c harus kurang dari atau sama dengan batas atas d.');

  const width = b - a;
  const mean = (a + b) / 2;
  const variance = width ** 2 / 12;
  const standardDeviation = Math.sqrt(variance);
  let probability;
  let lower = null;
  let upper = null;
  let explanation;
  let formula;

  if (eventType === 'exact') {
    probability = 0;
    lower = upper = c;
    formula = 'P(X = x) = 0 untuk setiap titik pada distribusi kontinu';
    explanation = 'Peluang tepat pada satu titik adalah 0 karena sebuah titik tidak memiliki panjang/luas.';
  } else if (eventType === 'lessThan') {
    probability = uniformCdf(c, a, b);
    lower = a;
    upper = Math.min(b, c);
    formula = 'P(X < c) = F(c) = (c − a) / (b − a), dipotong ke [0, 1]';
    explanation = `Peluang adalah panjang bagian di kiri ${c} dibagi panjang seluruh interval.`;
  } else if (eventType === 'greaterThan') {
    probability = 1 - uniformCdf(c, a, b);
    lower = Math.max(a, c);
    upper = b;
    formula = 'P(X > c) = (b − c) / (b − a), dipotong ke [0, 1]';
    explanation = `Peluang adalah panjang bagian di kanan ${c} dibagi panjang seluruh interval.`;
  } else if (eventType === 'between') {
    lower = Math.max(a, c);
    upper = Math.min(b, d);
    probability = lower > upper ? 0 : (upper - lower) / width;
    formula = 'P(c ≤ X ≤ d) = panjang interval yang masuk [a, b] / (b − a)';
    explanation = `Batas pertanyaan dipotong ke interval [${a}, ${b}]. Panjang bagian yang diarsir dibagi panjang total ${width}.`;
  } else {
    throw new RangeError('Pilih jenis kejadian Uniform yang tersedia.');
  }

  const steps = [
    makeStep('Identifikasi distribusi', 'Uniform sesuai jika nilai kontinu tersebar merata di antara batas bawah dan batas atas.'),
    makeStep('Nilai yang diketahui', `a = ${a}, b = ${b}; panjang total = b − a = ${width}. Mean = ${mean}, varians = ${variance}, dan simpangan baku = ${standardDeviation}.`),
    makeStep('Kejadian peluang', eventText('X', eventType, c, d)),
    makeStep('Pilih rumus', formula),
    makeStep('Tentukan daerah yang dihitung', eventType === 'exact'
      ? 'Tidak ada interval dengan panjang positif pada kejadian tepat satu titik.'
      : `${explanation} Batas arsiran yang masuk interval adalah ${lower} sampai ${upper}.`),
    makeStep('Hitung panjang arsiran', `Panjang bagian yang masuk = ${Math.max(0, (upper ?? 0) - (lower ?? 0))}; panjang seluruh interval = ${width}.`),
    makeStep('Hitung peluang', `Peluang = panjang arsiran / panjang total = ${probability.toFixed(4)}.`),
    makeStep('Periksa hasil', 'Peluang harus berada di antara 0 dan 1; batas kejadian di luar [a, b] tidak menambah panjang arsiran.'),
    makeStep('Arti hasil', `Sekitar ${(probability * 100).toFixed(2)}% nilai diperkirakan memenuhi kejadian tersebut.`)
  ];

  return makeResult({
    distribution: 'Uniform Kontinu',
    probability,
    event: eventText('X', eventType, c, d),
    parameters: { a, b, c, d },
    intermediate: { mean, variance, standardDeviation, totalLength: width, shadedLength: Math.max(0, (upper ?? 0) - (lower ?? 0)) },
    formula,
    steps,
    chart: { type: 'uniform', mu: mean, sigma: standardDeviation, a, b, lower, upper, eventType, pdf: 1 / width },
    extra: { mean, variance, standardDeviation }
  });
}

export function calculateNormal({ mode = 'probability', mu, sigma, eventType = 'greaterThan', c = 85, d = 100, q = 0.95, tail = 'left' }) {
  [mu, sigma, c, d, q].forEach((value, index) => assertFinite(value, ['mu', 'sigma', 'c', 'd', 'q'][index]));
  if (!(sigma > 0)) throw new RangeError('Simpangan baku harus lebih dari 0.');
  if (mode === 'quantile') {
    assertProbability(q, false);
    if (!['left', 'right'].includes(tail)) throw new RangeError('Pilih sisi kiri atau sisi kanan.');
    const targetCdf = tail === 'left' ? q : 1 - q;
    const z = normalQuantile(targetCdf);
    const x = mu + z * sigma;
    const probability = q;
    return makeResult({
      distribution: 'Normal',
      probability,
      event: tail === 'left' ? `P(X ≤ ${x.toFixed(4)}) = ${q}` : `P(X ≥ ${x.toFixed(4)}) = ${q}`,
      parameters: { mu, sigma, q, tail },
      intermediate: { z, x, phi: targetCdf },
      formula: 'x = μ + zσ; cari z dengan Φ(z) = q (kiri) atau Φ(z) = 1 − q (kanan)',
      steps: [
        makeStep('Identifikasi distribusi', 'Gunakan Normal karena data kontinu diasumsikan berbentuk lonceng dengan mean dan simpangan baku yang diketahui.'),
        makeStep('Nilai yang diketahui', `μ = ${mu}, σ = ${sigma}, dan peluang q = ${q} (${(q * 100).toFixed(2)}%).`),
        makeStep('Terjemahkan pertanyaan', tail === 'left' ? `Cari x agar P(X ≤ x) = ${q}.` : `Cari x agar P(X ≥ x) = ${q}.`),
        makeStep('Tentukan luas di kiri x', `Luas kumulatif kiri yang diperlukan adalah ${targetCdf}.`),
        makeStep('Cari skor baku', `Φ(z) = ${targetCdf}; dari kuantil Normal baku diperoleh z ≈ ${z.toFixed(2)}.`),
        makeStep('Kembalikan ke skala X', `x = μ + zσ = ${mu} + (${z.toFixed(4)} × ${sigma}) = ${x.toFixed(4)}.`),
        makeStep('Hasil kuantil', `Batas x ≈ ${x.toFixed(4)} untuk peluang ${q}.`),
        makeStep('Periksa hasil', `Peluang masukan berada di antara 0 dan 1; hitungan memakai z tak dibulatkan (${z.toPrecision(7)}).`),
        makeStep('Arti hasil', `Sekitar ${(q * 100).toFixed(2)}% nilai berada pada sisi ${tail === 'left' ? 'kiri (di bawah atau sama dengan x)' : 'kanan (di atas atau sama dengan x)'}.`)
      ],
      chart: { type: 'normal', mu, sigma, lower: tail === 'left' ? -Infinity : x, upper: tail === 'left' ? x : Infinity, eventType: tail === 'left' ? 'lessThan' : 'greaterThan' }
    });
  }

  const outcome = continuousProbability({
    eventType, c, d, mu, sigma, variable: 'X',
    cdf: normalCdf
  });
  const probability = outcome.probability;
  const zDetails = eventType === 'between'
    ? `z₁ = (${c} − ${mu})/${sigma} ≈ ${outcome.zLower.toFixed(2)} dan z₂ = (${d} − ${mu})/${sigma} ≈ ${outcome.zUpper.toFixed(2)}.`
    : `z = (${c} − ${mu})/${sigma} ≈ ${outcome.z.toFixed(2)}.`;
  let formula;
  if (eventType === 'lessThan' || eventType === 'lessOrEqual') formula = 'P(X ≤ c) = Φ((c − μ)/σ)';
  else if (eventType === 'greaterThan') formula = 'P(X ≥ c) = Φ(−(c − μ)/σ)';
  else formula = 'P(c ≤ X ≤ d) = Φ(z₂) − Φ(z₁)';
  const steps = [
    makeStep('Identifikasi distribusi', 'Gunakan Normal untuk variabel kontinu yang berbentuk lonceng, dengan μ sebagai pusat dan σ sebagai ukuran sebaran.'),
    makeStep('Nilai yang diketahui', `μ = ${mu} dan σ = ${sigma}; ${eventType === 'between' ? `batas c = ${c}, d = ${d}.` : `batas c = ${c}.`}`),
    makeStep('Terjemahkan kejadian', eventText('X', eventType, c, d)),
    makeStep('Pilih rumus', formula),
    makeStep('Ubah batas menjadi skor baku', `${zDetails} Perhitungan luas tetap memakai skor baku tak dibulatkan.`),
    makeStep('Cari luas kumulatif', eventType === 'between'
      ? `Φ(z₂) − Φ(z₁) = ${normalCdf(outcome.zUpper).toFixed(4)} − ${normalCdf(outcome.zLower).toFixed(4)}.`
      : `Luas pada sisi yang dipilih = ${probability.toFixed(4)}.`),
    makeStep('Hitung peluang kejadian', `Peluang = ${probability.toFixed(4)} atau ${(probability * 100).toFixed(2)}%.`),
    makeStep('Periksa hasil', 'Nilai peluang berada di antara 0 dan 1; luas ekor yang sangat jauh dari mean dapat mendekati 0 atau 1.'),
    makeStep('Arti hasil', `Sekitar ${(probability * 100).toFixed(2)}% populasi diperkirakan memenuhi kejadian.`)
  ];
  const warning = Math.abs(outcome.z ?? outcome.zLower ?? 0) > 8 ||
    Math.abs(outcome.zUpper ?? outcome.z ?? 0) > 8
    ? ['Ada batas dengan |Z| > 8; luas ekornya sangat kecil dan diperlakukan sebagai 0 atau 1.']
    : [];
  return makeResult({
    distribution: 'Normal',
    probability,
    event: eventText('X', eventType, c, d),
    parameters: { mu, sigma, c, d },
    intermediate: outcome,
    formula,
    steps,
    chart: { type: 'normal', mu, sigma, lower: outcome.lower, upper: outcome.upper, eventType },
    warnings: warning
  });
}

export function calculateSampleMean({ mode = 'probability', mu, sigma, n, eventType = 'greaterThan', c = 50.75, d = 52, q = 0.95, assumption = 'normalPopulation' }) {
  [mu, sigma, c, d, q].forEach((value, index) => assertFinite(value, ['mu', 'sigma', 'c', 'd', 'q'][index]));
  if (!(sigma > 0)) throw new RangeError('Simpangan baku populasi harus lebih dari 0.');
  if (!Number.isInteger(n) || n < 1) throw new RangeError('Ukuran sampel n harus bilangan bulat minimal 1.');
  const standardError = sigma / Math.sqrt(n);
  const warnings = [];
  if (assumption === 'clt' && n < 30) warnings.push('Aturan praktis: populasi tidak diketahui dan n < 30, sehingga pendekatan normal untuk rata-rata sampel kurang dapat diandalkan.');
  if (n === 1) warnings.push('Karena n = 1, rata-rata sampel sama dengan satu pengamatan dan SE = σ.');

  if (mode === 'symmetricInterval') {
    assertProbability(q, false);
    const z = normalQuantile((1 + q) / 2);
    const lower = mu - z * standardError;
    const upper = mu + z * standardError;
    return makeResult({
      distribution: 'Rata-Rata Sampel (X̄)',
      probability: q,
      event: `P(${lower.toFixed(4)} ≤ X̄ ≤ ${upper.toFixed(4)}) = ${q}`,
      parameters: { mu, sigma, n, q, assumption },
      intermediate: { standardError, z, lower, upper },
      formula: 'SE = σ/√n; z = Φ⁻¹((1 + q)/2); interval = μ ± z × SE',
      steps: [
        makeStep('Identifikasi distribusi', 'Yang dihitung adalah rata-rata sampel X̄, sehingga sebarannya menggunakan standard error, bukan σ secara langsung.'),
        makeStep('Nilai yang diketahui', `μ = ${mu}, σ = ${sigma}, n = ${n}, dan peluang tengah q = ${q}.`),
        makeStep('Tentukan asumsi', assumption === 'normalPopulation' ? 'Populasi diasumsikan Normal, sehingga sebaran X̄ juga Normal.' : `Populasi tidak diketahui; pendekatan Teorema Limit Pusat digunakan untuk n = ${n}.`),
        makeStep('Hitung standard error', `SE = σ/√n = ${sigma}/√${n} = ${standardError.toFixed(4)}.`),
        makeStep('Cari z untuk interval tengah', `Φ(z) = (1 + q)/2 = ${(1 + q) / 2}; z ≈ ${z.toFixed(2)}.`),
        makeStep('Tentukan batas interval', `μ ± z × SE = ${mu} ± (${z.toFixed(4)} × ${standardError.toFixed(4)}) = [${lower.toFixed(4)}; ${upper.toFixed(4)}].`),
        makeStep('Hasil interval', `Interval simetris yang diperoleh adalah [${lower.toFixed(4)}; ${upper.toFixed(4)}].`),
        makeStep('Periksa hasil', 'Interval simetris terhadap μ dan peluangnya berada di antara 0 dan 1; batas memakai z tak dibulatkan.'),
        makeStep('Arti hasil', `Dalam pengambilan sampel berulang, sekitar ${(q * 100).toFixed(2)}% rata-rata sampel diperkirakan berada dalam interval tersebut.`)
      ],
      chart: { type: 'normal', mu, sigma: standardError, lower, upper, eventType: 'between', populationSigma: sigma }
    });
  }

  const outcome = continuousProbability({
    eventType, c, d, mu, sigma: standardError, variable: 'X̄',
    cdf: normalCdf
  });
  const probability = outcome.probability;
  const zDetails = eventType === 'between'
    ? `z₁ = (${c} − ${mu})/${standardError.toFixed(4)} ≈ ${outcome.zLower.toFixed(2)}, z₂ = (${d} − ${mu})/${standardError.toFixed(4)} ≈ ${outcome.zUpper.toFixed(2)}.`
    : `z = (${c} − ${mu})/${standardError.toFixed(4)} ≈ ${outcome.z.toFixed(2)}.`;
  return makeResult({
    distribution: 'Rata-Rata Sampel (X̄)',
    probability,
    event: eventText('X̄', eventType, c, d),
    parameters: { mu, sigma, n, assumption, c, d },
    intermediate: { ...outcome, standardError },
    formula: `SE = σ/√n = ${standardError.toFixed(4)}; Z = (X̄ − μ)/SE`,
    steps: [
      makeStep('Identifikasi distribusi', `Peluang ini mengenai rata-rata ${n} pengamatan. ${assumption === 'normalPopulation' ? 'Populasi diasumsikan normal.' : 'Pendekatan normal digunakan dengan Teorema Limit Pusat.'}`),
      makeStep('Nilai yang diketahui', `μ = ${mu}, σ = ${sigma}, n = ${n}${eventType === 'between' ? `, c = ${c}, d = ${d}.` : `, c = ${c}.`}`),
      makeStep('Tentukan distribusi rata-rata', `Rata-rata sampel berpusat di μ = ${mu}; sebarannya menggunakan standard error.`),
      makeStep('Hitung standard error', `SE = σ/√n = ${sigma}/√${n} = ${standardError.toFixed(4)}.`),
      makeStep('Terjemahkan kejadian', eventText('X̄', eventType, c, d)),
      makeStep('Ubah batas menjadi skor baku', `${zDetails} Nilai Z yang belum dibulatkan dipakai untuk hitung.`),
      makeStep('Hitung luas kurva Normal', `Gunakan Φ pada skor baku untuk memperoleh peluang ${probability.toFixed(6)}.`),
      makeStep('Periksa dan nyatakan hasil', `Peluang = ${probability.toFixed(4)} atau ${(probability * 100).toFixed(2)}%; hasil berada di antara 0 dan 1.`),
      makeStep('Arti hasil', 'Ini adalah peluang untuk rata-rata sampel, bukan peluang untuk satu individu.')
    ],
    chart: { type: 'normal', mu, sigma: standardError, lower: outcome.lower, upper: outcome.upper, eventType, populationSigma: sigma },
    warnings
  });
}

export function calculateBinomialNormal({ n, p, eventType = 'atLeast', k = 25, a = 15, b = 25, continuityCorrection = true }) {
  assertFinite(p, 'Peluang sukses p');
  if (!Number.isInteger(n) || n < 1 || n > 1_000_000) throw new RangeError('Jumlah percobaan n harus bilangan bulat dari 1 sampai 1.000.000.');
  if (!(p > 0 && p < 1)) throw new RangeError('Peluang p harus lebih dari 0 dan kurang dari 1.');
  const integerValues = eventType === 'integerBetween' ? [a, b] : [k];
  if (integerValues.some((value) => !Number.isInteger(value) || value < 0 || value > n)) {
    throw new RangeError(`Batas kejadian harus bilangan bulat dari 0 sampai ${n}.`);
  }
  if (eventType === 'integerBetween' && a > b) throw new RangeError('Batas bawah harus kurang dari atau sama dengan batas atas.');

  const mu = n * p;
  const sigma = Math.sqrt(n * p * (1 - p));
  const warnings = [];
  if (mu < 5 || n * (1 - p) < 5) warnings.push('Pendekatan Normal kurang dapat diandalkan karena np atau n(1 − p) kurang dari 5.');
  if (!continuityCorrection) warnings.push('Koreksi kontinuitas dimatikan; hasil pendekatan biasanya kurang akurat.');

  let lower = -Infinity;
  let upper = Infinity;
  if (eventType === 'atMost') upper = k + (continuityCorrection ? 0.5 : 0);
  else if (eventType === 'atLeast') lower = k - (continuityCorrection ? 0.5 : 0);
  else if (eventType === 'strictLessThan') upper = k - (continuityCorrection ? 0.5 : 0);
  else if (eventType === 'strictGreaterThan') lower = k + (continuityCorrection ? 0.5 : 0);
  else if (eventType === 'integerBetween') {
    lower = a - (continuityCorrection ? 0.5 : 0);
    upper = b + (continuityCorrection ? 0.5 : 0);
  } else {
    throw new RangeError('Pilih jenis kejadian Binomial yang tersedia.');
  }

  const zLower = Number.isFinite(lower) ? (lower - mu) / sigma : null;
  const zUpper = Number.isFinite(upper) ? (upper - mu) / sigma : null;
  let probability;
  if (lower === -Infinity) probability = normalCdf(zUpper);
  else if (upper === Infinity) probability = normalCdf(-zLower);
  else probability = normalCdf(zUpper) - normalCdf(zLower);
  const event = eventText('X', eventType, null, null, k, a, b);
  const correctionNote = continuityCorrection
    ? 'Koreksi kontinuitas aktif: bilangan bulat diperluas setengah satuan menuju daerah yang dihitung.'
    : 'Tanpa koreksi kontinuitas, batas bilangan bulat langsung dipakai pada kurva Normal.';
  const normalEvent = eventType === 'atLeast' ? `P(Y > ${lower})`
    : eventType === 'atMost' ? `P(Y < ${upper})`
      : eventType === 'strictLessThan' ? `P(Y < ${upper})`
        : eventType === 'strictGreaterThan' ? `P(Y > ${lower})`
          : `P(${lower} < Y < ${upper})`;
  return makeResult({
    distribution: 'Pendekatan Binomial–Normal',
    probability,
    event,
    parameters: { n, p, k, a, b, continuityCorrection },
    intermediate: { mu, sigma, lower, upper, zLower, zUpper, np: mu, nq: n * (1 - p) },
    formula: `μ = np = ${mu}; σ = √(np(1 − p)) = ${sigma.toFixed(4)}; peluang dihitung dengan CDF Normal setelah koreksi`,
    steps: [
      makeStep('Identifikasi distribusi', `Model asalnya Binomial: ${n} percobaan independen dengan peluang sukses tetap p = ${p}. Normal dipakai sebagai pendekatan, bukan pengganti model asal.`),
      makeStep('Nilai yang diketahui', `n = ${n}, p = ${p}, kejadian yang diminta adalah ${event}.`),
      makeStep('Periksa syarat pendekatan', `np = ${mu} ${mu >= 5 ? '≥' : '<'} 5 dan n(1 − p) = ${n * (1 - p)} ${n * (1 - p) >= 5 ? '≥' : '<'} 5.`),
      makeStep('Hitung parameter Normal', `μ = np = ${n} × ${p} = ${mu}; σ = √(np(1 − p)) = √(${mu} × ${1 - p}) = ${sigma.toFixed(4)}.`),
      makeStep('Terjemahkan kejadian', `${event} diubah menjadi peluang pada variabel Normal Y.`),
      makeStep('Koreksi kontinuitas', `${event} ≈ ${normalEvent}. ${correctionNote}`),
      makeStep('Standardisasi batas', `${zLower !== null ? `z batas bawah ≈ ${zLower.toFixed(3)}. ` : ''}${zUpper !== null ? `z batas atas ≈ ${zUpper.toFixed(3)}.` : ''} Skor baku tak dibulatkan dipakai dalam perhitungan.`),
      makeStep('Hitung dan periksa peluang', `Pendekatan Normal memberi ${probability.toFixed(4)} (${(probability * 100).toFixed(2)}%); peluang berada di antara 0 dan 1.`),
      makeStep('Arti hasil', 'Ini adalah perkiraan peluang untuk Binomial; hasil dapat berbeda dari nilai Binomial eksak karena pendekatan Normal.')
    ],
    chart: { type: 'binomial-normal', mu, sigma, lower, upper, eventType, n, p, continuityCorrection },
    warnings,
    extra: { continuityNote: 'Koreksi kontinuitas diperlukan karena Binomial hanya bernilai bilangan bulat, sedangkan Normal kontinu. Bilangan bulat k mewakili rentang dari k − 0,5 sampai k + 0,5 pada sumbu kontinu.' }
  });
}
