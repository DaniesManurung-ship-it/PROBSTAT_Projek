const MAX_TRIALS = 1000;
const MAX_COUNT = 10000;
const PROBABILITY_TOLERANCE = 1e-12;

const LANCZOS_COEFFICIENTS = [
  676.5203681218851,
  -1259.1392167224028,
  771.3234287776531,
  -176.6150291621406,
  12.507343278686905,
  -0.13857109526572012,
  9.984369578019572e-6,
  1.5056327351493116e-7,
];

function assertInteger(value, name, minimum = 0, maximum = MAX_COUNT) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} harus berupa bilangan bulat ${minimum}-${maximum}.`);
  }
}

function assertProbability(value, name, allowZero = true) {
  if (!Number.isFinite(value) || value > 1 || (allowZero ? value < 0 : value <= 0)) {
    throw new RangeError(`${name} harus ${allowZero ? 'berada antara 0 dan 1' : 'lebih dari 0 dan paling besar 1'}.`);
  }
}

function logGamma(value) {
  if (value < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  }

  const shifted = value - 1;
  let sum = 0.9999999999998099;
  for (let index = 0; index < LANCZOS_COEFFICIENTS.length; index += 1) {
    sum += LANCZOS_COEFFICIENTS[index] / (shifted + index + 1);
  }
  const t = shifted + LANCZOS_COEFFICIENTS.length - 0.5;
  return 0.9189385332046727 + (shifted + 0.5) * Math.log(t) - t + Math.log(sum);
}

function logCombination(n, r) {
  if (r < 0 || r > n) return Number.NEGATIVE_INFINITY;
  const selected = Math.min(r, n - r);
  let result = 0;
  for (let index = 1; index <= selected; index += 1) {
    result += Math.log(n - selected + index) - Math.log(index);
  }
  return result;
}

function expLogProbability(logValue) {
  if (logValue === Number.NEGATIVE_INFINITY) return 0;
  if (!Number.isFinite(logValue)) throw new RangeError('Perhitungan terlalu besar untuk direpresentasikan dengan aman.');
  const probability = Math.exp(logValue);
  if (!Number.isFinite(probability) || probability < -PROBABILITY_TOLERANCE || probability > 1 + PROBABILITY_TOLERANCE) {
    throw new RangeError('Hasil berada di luar rentang peluang. Periksa kembali nilai yang dimasukkan.');
  }
  return Math.max(0, Math.min(1, probability));
}

function sumProbabilities(values) {
  let sum = 0;
  let compensation = 0;
  for (const value of values) {
    const adjusted = value - compensation;
    const next = sum + adjusted;
    compensation = (next - sum) - adjusted;
    sum = next;
  }
  return Math.max(0, Math.min(1, sum));
}

function binomialPmf(n, p, x) {
  if (x < 0 || x > n) return 0;
  if (p === 0) return x === 0 ? 1 : 0;
  if (p === 1) return x === n ? 1 : 0;
  return expLogProbability(
    logCombination(n, x) + x * Math.log(p) + (n - x) * Math.log1p(-p),
  );
}

function hypergeometricRange(N, K, n) {
  return {
    minimum: Math.max(0, n - (N - K)),
    maximum: Math.min(n, K),
  };
}

function hypergeometricPmf(N, K, n, x) {
  const { minimum, maximum } = hypergeometricRange(N, K, n);
  if (x < minimum || x > maximum) return 0;
  return expLogProbability(
    logCombination(K, x) +
    logCombination(N - K, n - x) -
    logCombination(N, n),
  );
}

function geometricPmf(p, x) {
  if (p === 1) return x === 1 ? 1 : 0;
  return expLogProbability((x - 1) * Math.log1p(-p) + Math.log(p));
}

function negativeBinomialPmf(p, k, x) {
  if (p === 1) return x === k ? 1 : 0;
  return expLogProbability(
    logCombination(x - 1, k - 1) +
    k * Math.log(p) +
    (x - k) * Math.log1p(-p),
  );
}

function poissonPmf(lambda, x) {
  if (lambda === 0) return x === 0 ? 1 : 0;
  return expLogProbability(-lambda + x * Math.log(lambda) - logGamma(x + 1));
}

function rangeValues(from, to) {
  const values = [];
  for (let value = from; value <= to; value += 1) values.push(value);
  return values;
}

function eventRange({ eventType, x, lower, upper, minimum, maximum, distribution }) {
  const supported = {
    exact: 'tepat',
    atMost: distribution === 'Geometrik' || distribution === 'Binomial Negatif' ? 'paling lambat' : 'paling banyak',
    atLeast: 'paling sedikit',
    after: 'setelah',
    between: 'antara',
  };
  if (!Object.hasOwn(supported, eventType)) {
    throw new RangeError('Pilih jenis kejadian yang tersedia.');
  }

  if (eventType === 'between') {
    assertInteger(lower, 'Batas bawah', minimum, MAX_COUNT);
    assertInteger(upper, 'Batas atas', minimum, MAX_COUNT);
    if (lower > upper) throw new RangeError('Batas bawah harus lebih kecil atau sama dengan batas atas.');
    if (upper > maximum) throw new RangeError(`Batas atas tidak boleh melebihi ${maximum}.`);
    return { label: `P(${lower} ≤ X ≤ ${upper})`, from: lower, to: upper };
  }

  assertInteger(x, 'Nilai x', minimum, MAX_COUNT);
  if (x > maximum) throw new RangeError(`Nilai x tidak boleh melebihi ${maximum}.`);

  switch (eventType) {
    case 'exact': return { label: `P(X = ${x})`, from: x, to: x };
    case 'atMost': return { label: `P(X ≤ ${x})`, from: minimum, to: x };
    case 'atLeast': return { label: `P(X ≥ ${x})`, from: x, to: maximum };
    case 'after': return { label: `P(X > ${x})`, from: x + 1, to: maximum };
    default: throw new RangeError('Jenis kejadian tidak sesuai dengan distribusi ini.');
  }
}

function makeResult({ distribution, event, probability, parameters, formula, substitution, calculation, identification, parameterSummary, interpretation }) {
  const checkedProbability = Math.max(0, Math.min(1, probability));
  if (!Number.isFinite(checkedProbability)) {
    throw new RangeError('Hasil perhitungan tidak dapat direpresentasikan. Coba nilai yang lebih kecil.');
  }

  return {
    distribution,
    event,
    probability: checkedProbability,
    percentage: checkedProbability * 100,
    parameters,
    formula,
    steps: [
      { title: 'Identifikasi distribusi', explanation: identification },
      { title: 'Nilai yang diketahui', explanation: parameterSummary },
      { title: 'Pilih rumus', explanation: formula },
      { title: 'Substitusi nilai', explanation: substitution },
      { title: 'Perhitungan', explanation: calculation },
      {
        title: 'Hasil akhir',
        explanation: `${event} = ${checkedProbability.toPrecision(8)} atau ${(checkedProbability * 100).toFixed(4)}%.`,
      },
      { title: 'Interpretasi', explanation: interpretation },
    ],
  };
}

function summarizeEvent(eventType, event) {
  return { ...event, eventType };
}

function sumRange(pmf, from, to) {
  if (from > to) return 0;
  const values = [];
  for (let value = from; value <= to; value += 1) values.push(pmf(value));
  return sumProbabilities(values);
}

function displayNumber(value) {
  return Number.isFinite(value) ? value.toPrecision(8) : 'terlalu besar untuk ditampilkan';
}

export function calculateBinomial({ n, p, eventType = 'exact', x, lower, upper }) {
  assertInteger(n, 'Jumlah percobaan n', 1, MAX_TRIALS);
  assertProbability(p, 'Peluang sukses p');
  const event = summarizeEvent(eventType, eventRange({
    eventType, x, lower, upper, minimum: 0, maximum: n, distribution: 'Binomial',
  }));
  const probability = sumRange((value) => binomialPmf(n, p, value), event.from, event.to);
  const pmf = binomialPmf(n, p, x ?? lower);
  const combination = eventType === 'exact' ? Math.exp(logCombination(n, x)) : null;
  const formula = eventType === 'exact'
    ? 'P(X = x) = C(n, x) × pˣ × (1 − p)ⁿ⁻ˣ'
    : `P(X dalam rentang kejadian) = Σ P(X = i), untuk i = ${event.from} sampai ${event.to}`;

  return makeResult({
    distribution: 'Binomial',
    event: event.label,
    probability,
    parameters: { n, p, ...(eventType === 'between' ? { lower, upper } : { x }), eventType },
    formula,
    substitution: eventType === 'exact'
      ? `P(X = ${x}) = C(${n}, ${x}) × (${p})^${x} × (${1 - p})^${n - x}`
      : `Jumlahkan peluang binomial untuk setiap nilai X dari ${event.from} sampai ${event.to}.`,
    calculation: eventType === 'exact'
      ? `C(${n}, ${x}) = ${displayNumber(combination)}; (${p})^${x} = ${displayNumber(Math.pow(p, x))}; (${1 - p})^${n - x} = ${displayNumber(Math.pow(1 - p, n - x))}; hasil perkalian = ${displayNumber(pmf)}.`
      : `${event.to - event.from + 1} peluang dijumlahkan tanpa pembulatan pada tiap suku.`,
    identification: 'Jumlah percobaan tetap, setiap percobaan memiliki dua hasil, peluang sukses konstan, dan percobaan dianggap independen.',
    parameterSummary: `n = ${n} percobaan; p = ${p} (${(p * 100).toFixed(2)}%) peluang sukses pada satu percobaan; q = 1 − p = ${(1 - p).toPrecision(6)} peluang gagal.`,
    interpretation: `Dalam ${n} percobaan dengan peluang sukses ${(p * 100).toFixed(2)}% pada tiap percobaan, peluang kejadian ${event.label} adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

export function calculateMultinomial({ n, categories }) {
  assertInteger(n, 'Jumlah percobaan n', 1, MAX_TRIALS);
  if (!Array.isArray(categories) || categories.length < 2) {
    throw new RangeError('Distribusi Multinomial memerlukan sedikitnya dua kategori.');
  }

  const normalized = categories.map((category, index) => {
    const name = String(category.name ?? '').trim();
    if (!name) throw new RangeError(`Nama kategori ke-${index + 1} tidak boleh kosong.`);
    assertProbability(category.p, `Peluang kategori ${name}`);
    assertInteger(category.x, `Frekuensi kategori ${name}`, 0, n);
    return { name, p: category.p, x: category.x };
  });

  const totalProbability = normalized.reduce((sum, item) => sum + item.p, 0);
  const totalFrequency = normalized.reduce((sum, item) => sum + item.x, 0);
  if (Math.abs(totalProbability - 1) > 1e-9) {
    throw new RangeError(`Total peluang kategori harus 1 (saat ini ${totalProbability.toFixed(6)}).`);
  }
  if (totalFrequency !== n) {
    throw new RangeError(`Total frekuensi kategori harus sama dengan n = ${n} (saat ini ${totalFrequency}).`);
  }

  let logProbability = logGamma(n + 1);
  for (const category of normalized) {
    logProbability -= logGamma(category.x + 1);
    if (category.p === 0 && category.x > 0) {
      logProbability = Number.NEGATIVE_INFINITY;
      break;
    }
    if (category.x > 0) logProbability += category.x * Math.log(category.p);
  }
  const probability = expLogProbability(logProbability);
  const logCoefficient = logGamma(n + 1) - normalized.reduce((sum, category) => sum + logGamma(category.x + 1), 0);
  const coefficient = Math.exp(logCoefficient);
  const categoryPowers = normalized.map(({ name, p, x }) => `${name}: (${p})^${x} = ${displayNumber(Math.pow(p, x))}`).join('; ');
  const categorySummary = normalized.map(({ name, p, x }) => `${name} (p=${p}, x=${x})`).join('; ');
  const formula = 'P(X₁=x₁, …, Xₖ=xₖ) = n!/(x₁!…xₖ!) × ∏ pᵢˣⁱ';

  return makeResult({
    distribution: 'Multinomial',
    event: normalized.map(({ name, x }) => `${name} = ${x}`).join(', '),
    probability,
    parameters: { n, categories: normalized },
    formula,
    substitution: `P = ${n}!/(${normalized.map(({ x }) => `${x}!`).join(' × ')}) × ${normalized.map(({ p, x }) => `(${p})^${x}`).join(' × ')}`,
    calculation: `Total peluang = ${totalProbability.toFixed(6)} dan total frekuensi = ${totalFrequency}. Koefisien multinomial n!/(x₁!…xₖ!) = ${displayNumber(coefficient)}. Pangkat peluang tiap kategori: ${categoryPowers}. Hasil kali keseluruhan = ${displayNumber(probability)}.`,
    identification: 'Setiap percobaan masuk ke satu dari dua atau lebih kategori, jumlah percobaan tetap, peluang kategori konstan, dan percobaan independen.',
    parameterSummary: `n = ${n} percobaan; ${categorySummary}.`,
    interpretation: `Peluang memperoleh komposisi kategori tersebut dalam ${n} percobaan adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

export function calculateHypergeometric({ N, K, n, eventType = 'exact', x, lower, upper }) {
  assertInteger(N, 'Jumlah populasi N', 1, MAX_TRIALS);
  assertInteger(K, 'Jumlah sukses K', 0, N);
  assertInteger(n, 'Jumlah sampel n', 0, N);
  const support = hypergeometricRange(N, K, n);
  const event = summarizeEvent(eventType, eventRange({
    eventType, x, lower, upper, minimum: support.minimum, maximum: support.maximum, distribution: 'Hipergeometrik',
  }));
  const probability = sumRange((value) => hypergeometricPmf(N, K, n, value), event.from, event.to);
  const exactSuccessWays = eventType === 'exact' ? Math.exp(logCombination(K, x)) : null;
  const exactOtherWays = eventType === 'exact' ? Math.exp(logCombination(N - K, n - x)) : null;
  const exactSampleWays = eventType === 'exact' ? Math.exp(logCombination(N, n)) : null;
  const formula = eventType === 'exact'
    ? 'P(X = x) = C(K, x) × C(N − K, n − x) / C(N, n)'
    : `P(X dalam rentang kejadian) = Σ P(X = i), untuk i = ${event.from} sampai ${event.to}`;

  return makeResult({
    distribution: 'Hipergeometrik',
    event: event.label,
    probability,
    parameters: { N, K, n, ...(eventType === 'between' ? { lower, upper } : { x }), eventType },
    formula,
    substitution: eventType === 'exact'
      ? `P(X = ${x}) = C(${K}, ${x}) × C(${N - K}, ${n - x}) / C(${N}, ${n})`
      : `Jumlahkan peluang tiap nilai yang mungkin dari ${event.from} sampai ${event.to}, dengan pengambilan tanpa pengembalian.`,
    calculation: eventType === 'exact'
      ? `C(${K}, ${x}) = ${displayNumber(exactSuccessWays)}; C(${N - K}, ${n - x}) = ${displayNumber(exactOtherWays)}; C(${N}, ${n}) = ${displayNumber(exactSampleWays)}. Rentang sukses yang mungkin adalah ${support.minimum}–${support.maximum}; peluangnya ${displayNumber(probability)}.`
      : `Rentang sukses yang mungkin adalah ${support.minimum} sampai ${support.maximum}; ada ${N - K} objek bukan sukses dari total populasi ${N}, dan peluang pada rentang terpilih dijumlahkan.`,
    identification: 'Sampel diambil tanpa pengembalian dari populasi terbatas yang terbagi menjadi kelompok sukses dan bukan sukses.',
    parameterSummary: `N = ${N} objek; K = ${K} objek sukses; N − K = ${N - K} objek bukan sukses; n = ${n} objek diambil; nilai X yang mungkin ${support.minimum}–${support.maximum}.`,
    interpretation: `Peluang memperoleh kejadian ${event.label} saat mengambil ${n} objek tanpa pengembalian adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

export function calculateGeometric({ p, eventType = 'exact', x, lower, upper }) {
  assertProbability(p, 'Peluang sukses p', false);
  if (!['exact', 'atMost', 'after'].includes(eventType)) {
    throw new RangeError('Distribusi Geometrik mendukung kejadian tepat, paling lambat, atau setelah.');
  }
  const event = summarizeEvent(eventType, eventRange({
    eventType, x, lower, upper, minimum: 1, maximum: MAX_COUNT, distribution: 'Geometrik',
  }));
  let probability;
  if (eventType === 'exact') probability = geometricPmf(p, x);
  else if (eventType === 'atMost') probability = p === 1 ? 1 : -Math.expm1(x * Math.log1p(-p));
  else if (eventType === 'after') probability = p === 1 ? 0 : Math.exp(x * Math.log1p(-p));
  else probability = sumRange((value) => geometricPmf(p, value), lower, upper);

  const formula = eventType === 'exact'
    ? 'P(X = x) = (1 − p)ˣ⁻¹ × p'
    : eventType === 'atMost'
      ? 'P(X ≤ x) = 1 − (1 − p)ˣ'
      : eventType === 'after'
        ? 'P(X > x) = (1 − p)ˣ'
        : `P(a ≤ X ≤ b) = Σ P(X = i), untuk i = ${lower} sampai ${upper}`;

  return makeResult({
    distribution: 'Geometrik',
    event: event.label,
    probability,
    parameters: { p, ...(eventType === 'between' ? { lower, upper } : { x }), eventType },
    formula,
    substitution: eventType === 'exact'
      ? `P(X = ${x}) = (1 − ${p})^(${x}−1) × ${p}`
      : `Gunakan p = ${p} dan q = 1 − p = ${(1 - p).toPrecision(6)} untuk menghitung kejadian ${event.label}.`,
    calculation: eventType === 'exact'
      ? `${x - 1} kegagalan harus terjadi sebelum sukses pertama. q^(${x - 1}) = ${displayNumber(Math.pow(1 - p, x - 1))}; dikalikan p = ${p}, hasilnya ${displayNumber(probability)}.`
      : eventType === 'between'
        ? `${upper - lower + 1} nilai nomor percobaan dijumlahkan pada rentang yang dipilih.`
        : `Peluang kumulatif dihitung langsung dari p = ${p}, tanpa membulatkan nilai antara.`,
    identification: 'Percobaan Bernoulli independen dengan peluang sukses tetap dan percobaan berlanjut sampai sukses pertama terjadi.',
    parameterSummary: `p = ${p} (${(p * 100).toFixed(2)}%) peluang sukses setiap percobaan; q = 1 − p = ${(1 - p).toPrecision(6)} peluang gagal.`,
    interpretation: `Peluang sukses pertama memenuhi kejadian ${event.label} adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

export function calculateNegativeBinomial({ p, k, eventType = 'exact', x, lower, upper }) {
  assertProbability(p, 'Peluang sukses p', false);
  if (!['exact', 'atMost', 'after'].includes(eventType)) {
    throw new RangeError('Distribusi Binomial Negatif mendukung kejadian tepat, paling lambat, atau setelah.');
  }
  assertInteger(k, 'Target sukses k', 1, MAX_COUNT);
  const event = summarizeEvent(eventType, eventRange({
    eventType, x, lower, upper, minimum: k, maximum: MAX_COUNT, distribution: 'Binomial Negatif',
  }));
  let probability;
  if (eventType === 'exact') probability = negativeBinomialPmf(p, k, x);
  else if (eventType === 'atMost') probability = sumRange((value) => negativeBinomialPmf(p, k, value), k, x);
  else if (eventType === 'after') {
    const terms = [];
    for (let successes = 0; successes < k; successes += 1) {
      terms.push(binomialPmf(x, p, successes));
    }
    probability = sumProbabilities(terms);
  } else probability = sumRange((value) => negativeBinomialPmf(p, k, value), lower, upper);

  const formula = eventType === 'exact'
    ? 'P(X = x) = C(x − 1, k − 1) × pᵏ × (1 − p)ˣ⁻ᵏ'
    : eventType === 'after'
      ? 'P(X > x) = P(jumlah sukses dalam x percobaan < k)'
      : `P(X dalam rentang kejadian) = Σ P(X = i), dengan i ≥ k`;

  return makeResult({
    distribution: 'Binomial Negatif',
    event: event.label,
    probability,
    parameters: { p, k, ...(eventType === 'between' ? { lower, upper } : { x }), eventType },
    formula,
    substitution: eventType === 'exact'
      ? `P(X = ${x}) = C(${x}−1, ${k}−1) × (${p})^${k} × (${1 - p})^(${x}−${k})`
      : `Gunakan target k = ${k}, peluang sukses p = ${p}, dan hitung semua nomor percobaan yang sesuai.`,
    calculation: eventType === 'exact'
      ? `C(${x - 1}, ${k - 1}) = ${displayNumber(Math.exp(logCombination(x - 1, k - 1)))}; p^k = ${displayNumber(Math.pow(p, k))}; (1 − p)^(x − k) = ${displayNumber(Math.pow(1 - p, x - k))}. Di antara ${x - 1} percobaan pertama terdapat tepat ${k - 1} sukses; hasil akhirnya ${displayNumber(probability)}.`
      : eventType === 'after'
        ? `Jumlahkan peluang memperoleh 0 sampai ${k - 1} sukses dalam ${x} percobaan pertama.`
        : `${event.to - event.from + 1} nilai X yang valid dijumlahkan; X dimulai dari k = ${k}.`,
    identification: 'Percobaan Bernoulli independen dengan peluang sukses tetap dan percobaan berlanjut sampai sukses ke-k tercapai.',
    parameterSummary: `p = ${p} (${(p * 100).toFixed(2)}%) peluang sukses per percobaan; k = ${k} sukses yang ditargetkan; X adalah nomor percobaan saat sukses ke-k terjadi.`,
    interpretation: `Peluang sukses ke-${k} memenuhi kejadian ${event.label} adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

export function calculatePoisson({ lambda, interval = '', eventType = 'exact', x, lower, upper }) {
  if (!Number.isFinite(lambda) || lambda < 0 || lambda > MAX_TRIALS) {
    throw new RangeError(`Rata-rata λ harus berada antara 0 dan ${MAX_TRIALS}.`);
  }
  if (!['exact', 'atMost', 'atLeast', 'between'].includes(eventType)) {
    throw new RangeError('Distribusi Poisson mendukung kejadian tepat, paling banyak, paling sedikit, atau antara.');
  }
  const event = summarizeEvent(eventType, eventRange({
    eventType, x, lower, upper, minimum: 0, maximum: MAX_COUNT, distribution: 'Poisson',
  }));
  let probability;
  if (eventType === 'atLeast') {
    const upperTail = Math.max(x, Math.ceil(lambda + 12 * Math.sqrt(lambda + 1) + 50));
    probability = sumRange((value) => poissonPmf(lambda, value), x, upperTail);
  } else if (eventType === 'exact') probability = poissonPmf(lambda, x);
  else probability = sumRange((value) => poissonPmf(lambda, value), event.from, event.to);

  const formula = eventType === 'exact'
    ? 'P(X = x) = e⁻λ × λˣ / x!'
    : eventType === 'atLeast'
      ? 'P(X ≥ x) = Σ P(X = i), i = x, x+1, …'
      : `P(X dalam rentang kejadian) = Σ P(X = i), untuk i = ${event.from} sampai ${event.to}`;

  return makeResult({
    distribution: 'Poisson',
    event: event.label,
    probability,
    parameters: { lambda, interval: String(interval).trim(), ...(eventType === 'between' ? { lower, upper } : { x }), eventType },
    formula,
    substitution: eventType === 'exact'
      ? `P(X = ${x}) = e^(-${lambda}) × (${lambda})^${x} / ${x}!`
      : `Gunakan λ = ${lambda}${interval ? ` kejadian per ${String(interval).trim()}` : ''} dan jumlahkan nilai PMF yang termasuk dalam kejadian.`,
    calculation: eventType === 'exact'
      ? `e^(-λ) = ${displayNumber(Math.exp(-lambda))}; λ^x = ${displayNumber(Math.pow(lambda, x))}; ${x}! = ${x <= 170 ? displayNumber(Math.exp(logGamma(x + 1))) : 'terlalu besar untuk ditampilkan, dihitung menggunakan log-faktorial'}.`
      : eventType === 'between'
        ? `${upper - lower + 1} peluang jumlah kejadian dijumlahkan pada interval X yang dipilih.`
        : eventType === 'atLeast'
          ? `Peluang ekor kanan dijumlahkan mulai X = ${x}; λ = 0 ditangani sebagai kasus khusus.`
          : `${event.to - event.from + 1} peluang untuk nilai X dari ${event.from} sampai ${event.to} dijumlahkan.`,
    identification: 'Soal menghitung banyak kejadian dalam interval waktu atau ruang tertentu dan rata-rata kejadian λ untuk interval tersebut diketahui.',
    parameterSummary: `λ = ${lambda} kejadian rata-rata${interval ? ` per ${String(interval).trim()}` : ' pada interval yang ditentukan'}; e ≈ 2,71828.`,
    interpretation: `Pada interval ${interval ? `per ${String(interval).trim()}` : 'yang ditentukan'}, peluang terjadi kejadian ${event.label} dengan rata-rata λ = ${lambda} adalah ${(probability * 100).toFixed(2)}%.`,
  });
}

function visualizationWindow(minimum, maximum, focusFrom, focusTo) {
  const size = maximum - minimum + 1;
  if (size <= 80) return rangeValues(minimum, maximum);
  const focusCenter = Math.floor((focusFrom + focusTo) / 2);
  const start = Math.max(minimum, Math.min(maximum - 79, focusCenter - 39));
  return rangeValues(start, start + 79);
}

export function getDistributionSeries(distribution, parameters) {
  const { eventType } = parameters;
  let minimum;
  let maximum;
  let pmf;

  if (distribution === 'Binomial') {
    minimum = 0;
    maximum = parameters.n;
    pmf = (value) => binomialPmf(parameters.n, parameters.p, value);
  } else if (distribution === 'Hipergeometrik') {
    const support = hypergeometricRange(parameters.N, parameters.K, parameters.n);
    minimum = support.minimum;
    maximum = support.maximum;
    pmf = (value) => hypergeometricPmf(parameters.N, parameters.K, parameters.n, value);
  } else if (distribution === 'Geometrik') {
    minimum = 1;
    maximum = Math.max(20, parameters.x ?? parameters.upper ?? 1);
    maximum = Math.min(MAX_COUNT, maximum);
    pmf = (value) => geometricPmf(parameters.p, value);
  } else if (distribution === 'Binomial Negatif') {
    minimum = parameters.k;
    maximum = Math.max(parameters.k + 19, parameters.x ?? parameters.upper ?? parameters.k);
    maximum = Math.min(MAX_COUNT, maximum);
    pmf = (value) => negativeBinomialPmf(parameters.p, parameters.k, value);
  } else if (distribution === 'Poisson') {
    minimum = 0;
    maximum = Math.max(20, Math.ceil(parameters.lambda + 4 * Math.sqrt(parameters.lambda + 1)));
    maximum = Math.min(MAX_COUNT, maximum);
    pmf = (value) => poissonPmf(parameters.lambda, value);
  } else {
    return parameters.categories.map((category) => ({
      value: category.name,
      probability: category.p,
      highlight: true,
      detail: `p = ${category.p}; x = ${category.x}`,
    }));
  }

  const focusFrom = eventType === 'between' ? parameters.lower : parameters.x;
  const focusTo = eventType === 'between' ? parameters.upper : parameters.x;
  const values = visualizationWindow(minimum, maximum, focusFrom ?? minimum, focusTo ?? minimum);
  const highlighted = (value) => {
    if (eventType === 'exact') return value === parameters.x;
    if (eventType === 'between') return value >= parameters.lower && value <= parameters.upper;
    if (eventType === 'atMost') return value <= parameters.x;
    if (eventType === 'atLeast') return value >= parameters.x;
    if (eventType === 'after') return value > parameters.x;
    return false;
  };

  return values.map((value) => ({ value, probability: pmf(value), highlight: highlighted(value) }));
}

export function getHypergeometricPopulation(parameters, limit = 80) {
  const { N, K } = parameters;
  const displayed = Math.min(N, limit);
  const successCount = K === 0
    ? 0
    : K === N
      ? displayed
      : Math.max(1, Math.min(displayed - 1, Math.round((K / N) * displayed)));
  return Array.from({ length: displayed }, (_, index) => ({
    success: index < successCount,
    label: index < successCount ? 'Objek sukses' : 'Objek bukan sukses',
  }));
}

export function getTrialPattern(distribution, parameters) {
  let count;
  let successes;
  let successAtEnd = false;
  const afterBoundary = parameters.eventType === 'after';
  if (distribution === 'Geometrik') {
    count = parameters.x ?? parameters.upper;
    successes = 1;
    successAtEnd = true;
  } else {
    count = parameters.x ?? parameters.upper;
    successes = parameters.k;
    successAtEnd = true;
  }

  const boundary = count;
  if (afterBoundary) count += successes;
  else if (successAtEnd) count = Math.max(count, successes);
  const shown = Math.min(count, 100);
  const firstSuccesses = afterBoundary
    ? 0
    : Math.min(successes - (successAtEnd ? 1 : 0), shown);
  const values = Array.from({ length: shown }, (_, index) => ({
    trial: index + 1,
    success: afterBoundary
      ? index >= boundary
      : successAtEnd
        ? index < firstSuccesses || index === shown - 1
        : index < successes,
  }));
  return { values, truncated: count > shown, total: count };
}
