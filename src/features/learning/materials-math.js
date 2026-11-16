import { normalCdf } from '../distributions/continuous/continuous-math.js';

const field = (name, label, value, options = {}) => ({ name, label, value, ...options });
const numberField = (name, label, value, options = {}) => field(name, label, value, {
  type: 'number',
  step: options.step ?? 'any',
  ...options,
});
const selectField = (name, label, value, options) => field(name, label, value, { type: 'select', options });
const dataField = field('data', 'Data (pisahkan dengan koma atau baris baru)', '70, 80, 90', {
  type: 'textarea',
  help: 'Pisahkan dengan koma atau baris baru; gunakan titik untuk angka desimal.',
});

const definitions = {
  1: { title: 'Peluang Dasar', fields: [numberField('favorable', 'Banyak hasil yang diinginkan', 2, { min: 0, max: 100000 }), numberField('total', 'Banyak seluruh hasil yang mungkin', 6, { min: 1, max: 100000 })] },
  2: { title: 'Ruang Sampel', fields: [selectField('experiment', 'Percobaan', 'die', [['coin', 'Satu lemparan koin'], ['twoCoins', 'Dua lemparan koin'], ['die', 'Satu lemparan dadu'], ['twoDice', 'Dua lemparan dadu']]), field('criterion', 'Kejadian yang dicari (kosongkan untuk semua hasil)', '7', { type: 'text', help: 'Dadu: isi angka atau jumlah mata dadu. Koin: isi Angka atau Gambar.' })] },
  3: { title: 'Peluang Komplemen', fields: [numberField('p', 'Peluang kejadian P(A)', 0.75, { min: 0, max: 1, step: 0.01 })] },
  4: { title: 'Peluang Gabungan', fields: [numberField('pA', 'Peluang P(A)', 0.5, { min: 0, max: 1, step: 0.01 }), numberField('pB', 'Peluang P(B)', 0.4, { min: 0, max: 1, step: 0.01 }), numberField('pAB', 'Peluang irisan P(A dan B)', 0.2, { min: 0, max: 1, step: 0.01 })] },
  5: { title: 'Peluang Irisan', fields: [selectField('mode', 'Hubungan kejadian', 'independent', [['independent', 'Independen: A dan B saling bebas'], ['conditional', 'Bersyarat: gunakan P(B | A)']]), numberField('pA', 'Peluang P(A)', 0.5, { min: 0, max: 1, step: 0.01 }), numberField('pB', 'P(B) atau P(B | A)', 0.4, { min: 0, max: 1, step: 0.01 })] },
  6: { title: 'Peluang Bersyarat', fields: [numberField('pA', 'Peluang P(A)', 0.5, { min: 0, max: 1, step: 0.01 }), numberField('pAB', 'Peluang irisan P(A dan B)', 0.2, { min: 0, max: 1, step: 0.01 })] },
  7: { title: 'Kejadian Independen dan Dependen', fields: [numberField('a', 'Banyak benda kategori A', 5, { min: 1, max: 10000, step: 1 }), numberField('b', 'Banyak benda kategori lain', 5, { min: 0, max: 10000, step: 1 }), numberField('draws', 'Banyak pengambilan (semua harus kategori A)', 2, { min: 1, max: 100, step: 1 })] },
  8: { title: 'Permutasi', fields: [numberField('n', 'Jumlah objek n', 5, { min: 0, max: 170, step: 1 }), numberField('r', 'Objek yang dipilih r', 3, { min: 0, max: 170, step: 1 })] },
  9: { title: 'Kombinasi', fields: [numberField('n', 'Jumlah objek n', 5, { min: 0, max: 170, step: 1 }), numberField('r', 'Objek yang dipilih r', 2, { min: 0, max: 170, step: 1 })] },
  10: { title: 'Simulasi Variabel Acak', fields: [selectField('experiment', 'Percobaan', 'twoDice', [['coin', 'Satu lemparan koin (X = 1 jika Angka)'], ['die', 'Satu lemparan dadu (X = mata dadu)'], ['twoDice', 'Dua dadu (X = jumlah mata)']]), numberField('trials', 'Jumlah percobaan', 500, { min: 1, max: 10000, step: 1 })] },
  11: { title: 'Distribusi Binomial', fields: [numberField('n', 'Jumlah percobaan n', 5, { min: 0, max: 100, step: 1 }), numberField('p', 'Peluang sukses p', 0.5, { min: 0, max: 1, step: 0.01 }), selectField('event', 'Kejadian', 'exact', [['exact', 'Tepat k'], ['atMost', 'Paling banyak k'], ['atLeast', 'Paling sedikit k'], ['between', 'Di antara batas']]), numberField('k', 'Jumlah sukses k', 3, { min: 0, max: 100, step: 1 }), numberField('lower', 'Batas bawah (untuk interval)', 2, { min: 0, max: 100, step: 1 }), numberField('upper', 'Batas atas (untuk interval)', 4, { min: 0, max: 100, step: 1 })] },
  12: { title: 'Nilai Harapan', fields: [field('pairs', 'Pasangan nilai dan peluang (satu pasangan per baris: nilai; peluang)', '10000; 0,2\n0; 0,8', { type: 'textarea', help: 'Satu pasangan per baris, pisahkan dengan titik koma. Total peluang harus 1.' })] },
  13: { title: 'Distribusi Uniform', fields: [numberField('a', 'Batas interval a', 10), numberField('b', 'Batas interval b', 20), numberField('c', 'Batas bawah kejadian c', 12), numberField('d', 'Batas atas kejadian d', 16)] },
  14: { title: 'Distribusi Normal', fields: [numberField('mu', 'Mean μ', 0), numberField('sigma', 'Simpangan baku σ', 1, { min: 0.000001 }), selectField('event', 'Peluang yang dicari', 'less', [['less', 'P(X ≤ x)'], ['greater', 'P(X ≥ x)'], ['between', 'P(a ≤ X ≤ b)']]), numberField('lower', 'Batas x atau a', 0), numberField('upper', 'Batas b (untuk interval)', 1)] },
  15: { title: 'Rata-Rata Sampel dan Standard Error', fields: [numberField('mu', 'Mean populasi μ', 50), numberField('sigma', 'Simpangan baku populasi σ', 6, { min: 0.000001 }), numberField('n', 'Ukuran sampel n', 9, { min: 1, max: 100000, step: 1 }), selectField('population', 'Bentuk populasi', 'normal', [['normal', 'Populasi Normal'], ['unknown', 'Populasi tidak diketahui / tidak Normal']]), selectField('event', 'Peluang yang dicari', 'less', [['less', 'P(X̄ ≤ x)'], ['greater', 'P(X̄ ≥ x)'], ['between', 'P(a ≤ X̄ ≤ b)']]), numberField('lower', 'Batas x atau a', 52), numberField('upper', 'Batas b (untuk interval)', 54)] },
  16: { title: 'Pendekatan Binomial dengan Normal', fields: [numberField('n', 'Jumlah percobaan n', 100, { min: 1, max: 100000, step: 1 }), numberField('p', 'Peluang sukses p', 0.5, { min: 0, max: 1, step: 0.01 }), selectField('event', 'Kejadian', 'atMost', [['exact', 'Tepat k'], ['atMost', 'Paling banyak k'], ['atLeast', 'Paling sedikit k'], ['between', 'Di antara batas']]), numberField('k', 'Jumlah sukses k', 55, { min: 0, max: 100000, step: 1 }), numberField('lower', 'Batas bawah (untuk interval)', 45, { min: 0, max: 100000, step: 1 }), numberField('upper', 'Batas atas (untuk interval)', 55, { min: 0, max: 100000, step: 1 })] },
  17: { title: 'Ringkasan Data', fields: [dataField] },
  18: { title: 'Mean', fields: [dataField] },
  19: { title: 'Median', fields: [dataField] },
  20: { title: 'Modus', fields: [dataField] },
  21: { title: 'Jangkauan', fields: [dataField] },
  22: { title: 'Kuartil dan IQR', fields: [dataField] },
  23: { title: 'Varians', fields: [dataField, selectField('scope', 'Jenis data', 'population', [['population', 'Populasi lengkap'], ['sample', 'Sampel']])] },
  24: { title: 'Standar Deviasi', fields: [dataField, selectField('scope', 'Jenis data', 'population', [['population', 'Populasi lengkap'], ['sample', 'Sampel']])] },
  25: { title: 'Skewness', fields: [dataField] },
  26: { title: 'Simulasi Percobaan Acak', fields: [selectField('experiment', 'Percobaan', 'coin', [['coin', 'Koin'], ['die', 'Dadu'], ['twoDice', 'Dua dadu'], ['cards', 'Kartu standar 52 lembar'], ['balls', 'Pengambilan bola']]), selectField('event', 'Kejadian yang dihitung', 'target', [['target', 'Angka pada koin / nilai target'], ['heads', 'Sisi Angka pada koin'], ['red', 'Kartu merah'], ['ace', 'Kartu As'], ['spade', 'Kartu sekop'], ['sum7', 'Jumlah dua dadu = 7'], ['ball', 'Semua bola terambil dari kategori target']]), numberField('target', 'Nilai target untuk dadu (mata / jumlah)', 6, { min: 1, max: 12, step: 1 }), numberField('trials', 'Jumlah percobaan', 500, { min: 1, max: 10000, step: 1 }), numberField('targetBalls', 'Bola kategori target', 5, { min: 0, max: 1000, step: 1 }), numberField('otherBalls', 'Bola kategori lain', 5, { min: 0, max: 1000, step: 1 }), numberField('draws', 'Bola yang diambil per percobaan', 1, { min: 1, max: 20, step: 1 }), selectField('replacement', 'Cara pengambilan bola', 'with', [['with', 'Dengan pengembalian'], ['without', 'Tanpa pengembalian']])] },
};

export function getCalculatorDefinition(topicNumber) {
  return definitions[topicNumber] ?? null;
}

function assertNumber(value, label, { min = -1e9, max = 1e9, integer = false } = {}) {
  if (typeof value === 'string' && !value.trim()) throw new RangeError(`${label} wajib diisi.`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new RangeError(`${label} harus berupa angka yang valid.`);
  if (integer && !Number.isInteger(parsed)) throw new RangeError(`${label} harus berupa bilangan bulat.`);
  if (parsed < min) throw new RangeError(`${label} tidak boleh kurang dari ${min}.`);
  if (parsed > max) throw new RangeError(`${label} tidak boleh lebih dari ${max}.`);
  return parsed;
}

function probability(value, label) {
  return assertNumber(value, label, { min: 0, max: 1 });
}

function standardNormalCdf(value) {
  if (value === Number.NEGATIVE_INFINITY) return 0;
  if (value === Number.POSITIVE_INFINITY) return 1;
  return normalCdf(value);
}

function readData(value) {
  const raw = String(value ?? '').trim();
  if (!raw) throw new RangeError('Masukkan setidaknya satu nilai data.');
  const tokens = raw.split(/[,\s;]+/).filter(Boolean);
  if (tokens.length > 2000) throw new RangeError('Masukkan paling banyak 2.000 nilai agar perhitungan tetap mudah dibaca.');
  const data = tokens.map((token, index) => {
    const number = Number(token);
    if (!Number.isFinite(number)) throw new RangeError(`Nilai data ke-${index + 1} bukan angka yang valid.`);
    if (Math.abs(number) > 1e9) throw new RangeError(`Nilai data ke-${index + 1} harus berada antara -1.000.000.000 dan 1.000.000.000.`);
    return number;
  });
  return data;
}

function formatNumber(value, digits = 4) {
  if (!Number.isFinite(value)) return 'tidak terdefinisi';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(value);
}

function makeResult(formula, steps, result, interpretation, options = {}) {
  return { formula, steps, result, interpretation, ...options };
}

function factorial(n) {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

function combination(n, r) {
  let value = 1;
  for (let i = 1; i <= Math.min(r, n - r); i += 1) value = value * (n - i + 1) / i;
  return value;
}

function median(sorted) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function statistics(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((total, value) => total + value, 0);
  const mean = sum / data.length;
  const deviations = data.map((value) => value - mean);
  const sumSquares = deviations.reduce((total, value) => total + value ** 2, 0);
  const frequencies = new Map();
  data.forEach((value) => frequencies.set(value, (frequencies.get(value) ?? 0) + 1));
  const maxFrequency = Math.max(...frequencies.values());
  const modes = [...frequencies].filter(([, count]) => count === maxFrequency).map(([value]) => value).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const lowerHalf = sorted.length % 2 ? sorted.slice(0, middle) : sorted.slice(0, middle);
  const upperHalf = sorted.length % 2 ? sorted.slice(middle + 1) : sorted.slice(middle);
  const q1 = lowerHalf.length ? median(lowerHalf) : sorted[0];
  const q2 = median(sorted);
  const q3 = upperHalf.length ? median(upperHalf) : sorted[sorted.length - 1];
  return { sorted, sum, mean, deviations, sumSquares, frequencies, maxFrequency, modes, min: sorted[0], max: sorted[sorted.length - 1], median: q2, q1, q3, iqr: q3 - q1 };
}

function calculateDataTopic(topic, values) {
  const data = readData(values.data);
  const stats = statistics(data);
  const chart = [...stats.frequencies].sort((a, b) => a[0] - b[0]).slice(0, 40).map(([label, count]) => ({ label: String(label), value: count }));
  const preview = stats.sorted.slice(0, 30).map((value) => formatNumber(value)).join(', ');
  const baseDetails = [
    `Banyak data n = ${data.length}.`,
    `Data terurut: ${preview}${data.length > 30 ? ', …' : ''}.`,
    `Minimum = ${formatNumber(stats.min)}; maksimum = ${formatNumber(stats.max)}.`,
  ];

  if (topic === 17) {
    return makeResult('Ringkasan data = banyak data, data terurut, nilai minimum, dan maksimum.', baseDetails, `${data.length} data`, 'Ringkasan ini membantu memeriksa rentang dan susunan data sebelum memilih ukuran pemusatan atau penyebaran.', { chart, details: [['Minimum', stats.min], ['Maksimum', stats.max], ['Mean', stats.mean], ['Median', stats.median]] });
  }
  if (topic === 18) return makeResult('x̄ = Σxᵢ / n', [`Jumlahkan data: Σxᵢ = ${formatNumber(stats.sum)}.`, `Banyak data: n = ${data.length}.`, `Substitusi: x̄ = ${formatNumber(stats.sum)} / ${data.length}.`], formatNumber(stats.mean), `Rata-rata data adalah ${formatNumber(stats.mean)}; ukuran ini dapat berubah cukup besar jika ada nilai ekstrem.`, { chart });
  if (topic === 19) {
    const middle = Math.floor(data.length / 2);
    const middleText = data.length % 2 ? `Posisi tengah ke-${middle + 1}: ${formatNumber(stats.sorted[middle])}.` : `Dua nilai tengah ${formatNumber(stats.sorted[middle - 1])} dan ${formatNumber(stats.sorted[middle])}; median = (${formatNumber(stats.sorted[middle - 1])} + ${formatNumber(stats.sorted[middle])}) / 2.`;
    return makeResult('Median = nilai tengah data setelah diurutkan.', [...baseDetails, middleText], formatNumber(stats.median), 'Setengah data berada di bawah atau sama dengan median dan setengahnya berada di atas atau sama dengannya.', { chart });
  }
  if (topic === 20) {
    const hasUniqueMode = stats.modes.length === 1 && stats.maxFrequency > 1;
    return makeResult('Modus = nilai dengan frekuensi tertinggi.', [...baseDetails, `Frekuensi tertinggi = ${stats.maxFrequency}.`, ...[...stats.frequencies].sort((a, b) => a[0] - b[0]).map(([value, count]) => `${formatNumber(value)} muncul ${count} kali.`)], hasUniqueMode ? formatNumber(stats.modes[0]) : stats.maxFrequency === 1 ? 'Tidak ada modus tunggal' : stats.modes.map(formatNumber).join(', '), hasUniqueMode ? 'Nilai ini muncul paling sering.' : stats.maxFrequency === 1 ? 'Semua nilai muncul satu kali, sehingga tidak ada modus tunggal.' : 'Terdapat lebih dari satu nilai dengan frekuensi tertinggi.', { chart, table: { headers: ['Nilai', 'Frekuensi'], rows: [...stats.frequencies].sort((a, b) => a[0] - b[0]).map(([value, count]) => [formatNumber(value), count]) } });
  }
  if (topic === 21) return makeResult('R = xₘₐₓ − xₘᵢₙ', [...baseDetails, `Substitusi: R = ${formatNumber(stats.max)} − ${formatNumber(stats.min)}.`], formatNumber(stats.max - stats.min), 'Jangkauan menunjukkan selisih nilai ekstrem; ukuran ini tidak menggambarkan sebaran nilai di antaranya.', { chart });
  if (topic === 22) return makeResult('IQR = Q₃ − Q₁ (metode median dari separuh bawah/atas; median keseluruhan tidak disertakan bila n ganjil).', [...baseDetails, `Q₁ = ${formatNumber(stats.q1)}; Q₂ (median) = ${formatNumber(stats.q2)}; Q₃ = ${formatNumber(stats.q3)}.`, `IQR = ${formatNumber(stats.q3)} − ${formatNumber(stats.q1)} = ${formatNumber(stats.iqr)}.`], `Q₁ ${formatNumber(stats.q1)} · Q₂ ${formatNumber(stats.q2)} · Q₃ ${formatNumber(stats.q3)} · IQR ${formatNumber(stats.iqr)}`, `IQR mengukur rentang 50% data bagian tengah. Untuk sampel kecil, konvensi kuartil lain dapat menghasilkan nilai yang berbeda.`, { chart, box: [stats.min, stats.q1, stats.q2, stats.q3, stats.max] });
  if (topic === 23 || topic === 24) {
    const sample = values.scope === 'sample';
    if (sample && data.length < 2) throw new RangeError('Varians dan simpangan baku sampel memerlukan sedikitnya dua data.');
    const denominator = sample ? data.length - 1 : data.length;
    const variance = stats.sumSquares / denominator;
    const standardDeviation = Math.sqrt(variance);
    const terms = data.slice(0, 30).map((value) => `(${formatNumber(value)} − ${formatNumber(stats.mean)})² = ${formatNumber((value - stats.mean) ** 2)}`);
    const steps = [`Mean ${sample ? 'sampel' : 'populasi'} = ${formatNumber(stats.mean)}.`, `Kuadrat selisih: ${terms.join('; ')}${data.length > 30 ? '; …' : ''}.`, `Jumlah kuadrat selisih = ${formatNumber(stats.sumSquares)}.`, `Penyebut ${sample ? 'n − 1' : 'N'} = ${denominator}${sample ? ' (koreksi Bessel untuk mengurangi bias estimasi varians)' : ''}.`];
    if (topic === 23) return makeResult(sample ? 's² = Σ(xᵢ − x̄)² / (n − 1)' : 'σ² = Σ(xᵢ − μ)² / N', [...steps, `Varians = ${formatNumber(stats.sumSquares)} / ${denominator}.`], formatNumber(variance), `Varians ${sample ? 'sampel' : 'populasi'} adalah ${formatNumber(variance)} dalam satuan kuadrat.`, { chart });
    return makeResult(sample ? 's = √[Σ(xᵢ − x̄)² / (n − 1)]' : 'σ = √[Σ(xᵢ − μ)² / N]', [...steps, `Simpangan baku = √${formatNumber(variance)}.`], formatNumber(standardDeviation), `Nilai tipikal menyimpang sekitar ${formatNumber(standardDeviation)} satuan dari mean.`, { chart, details: [['Varians', variance]] });
  }
  if (topic === 25) {
    if (data.length < 3) throw new RangeError('Skewness sampel memerlukan sedikitnya tiga data.');
    if (stats.sumSquares === 0) throw new RangeError('Skewness tidak terdefinisi karena semua data sama (varians nol).');
    const sampleSd = Math.sqrt(stats.sumSquares / (data.length - 1));
    const cubicSum = data.reduce((total, value) => total + ((value - stats.mean) / sampleSd) ** 3, 0);
    const skewness = data.length / ((data.length - 1) * (data.length - 2)) * cubicSum;
    const interpretation = Math.abs(skewness) < 0.1 ? 'Distribusi relatif simetris.' : skewness > 0 ? 'Kemencengan positif: ekor distribusi cenderung lebih panjang ke kanan.' : 'Kemencengan negatif: ekor distribusi cenderung lebih panjang ke kiri.';
    return makeResult('Skewness sampel Fisher–Pearson terkoreksi: G₁ = n/[(n−1)(n−2)] × Σ[(xᵢ−x̄)/s]³.', [...baseDetails, `Mean = ${formatNumber(stats.mean)}; simpangan baku sampel s = ${formatNumber(sampleSd)}.`, `Skewness G₁ = ${formatNumber(skewness)}.`, `Metode: estimator Fisher–Pearson terkoreksi; histogram frekuensi di bawah dibatasi sampai 40 nilai berbeda.`], formatNumber(skewness), interpretation, { chart });
  }
  throw new RangeError('Topik data tidak dikenali.');
}

function getExperimentOutcomes(experiment) {
  if (experiment === 'coin') return ['Angka', 'Gambar'];
  if (experiment === 'twoCoins') return ['AA', 'AG', 'GA', 'GG'];
  if (experiment === 'die') return [1, 2, 3, 4, 5, 6];
  if (experiment === 'twoDice') return Array.from({ length: 36 }, (_, index) => [Math.floor(index / 6) + 1, (index % 6) + 1]);
  throw new RangeError('Pilih percobaan yang tersedia.');
}

function isTargetOutcome(experiment, outcome, criterion) {
  if (!criterion) return true;
  if (experiment === 'coin' || experiment === 'twoCoins') return String(outcome).toLowerCase().includes(criterion.toLowerCase());
  const target = Number(criterion);
  if (!Number.isFinite(target)) throw new RangeError('Kriteria untuk dadu harus berupa angka.');
  return experiment === 'twoDice' ? outcome[0] + outcome[1] === target : outcome === target;
}

function binomialPmf(n, p, k) {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return combination(n, k) * p ** k * (1 - p) ** (n - k);
}

function simulateExperiment(experiment, trials, random) {
  const deck = [];
  if (experiment === 'cards') {
    for (const suit of ['hearts', 'diamonds', 'clubs', 'spades']) {
      for (let rank = 1; rank <= 13; rank += 1) deck.push({ suit, rank });
    }
  }
  const counts = new Map();
  for (let i = 0; i < trials; i += 1) {
    let value;
    if (experiment === 'coin') value = random() < 0.5 ? 'Angka' : 'Gambar';
    else if (experiment === 'die') value = Math.floor(random() * 6) + 1;
    else if (experiment === 'twoDice') value = Math.floor(random() * 6) + Math.floor(random() * 6) + 2;
    else if (experiment === 'cards') {
      const card = deck[Math.floor(random() * deck.length)];
      value = `${card.rank === 1 ? 'As' : card.rank} ${card.suit}`;
    } else value = 'hasil';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function calculateSimulation(values, random) {
  const trials = assertNumber(values.trials, 'Jumlah percobaan', { min: 1, max: 10000, integer: true });
  const experiment = values.experiment;
  const counts = simulateExperiment(experiment, trials, random);
  let successes = 0;
  let theoretical = null;
  let criterion = '';
  if (experiment === 'coin') {
    criterion = values.event === 'heads' || values.event === 'target' && String(values.target).toLowerCase() === 'angka' ? 'Angka' : 'Gambar';
    successes = counts.get(criterion) ?? 0;
    theoretical = 0.5;
  } else if (experiment === 'die') {
    const target = assertNumber(values.target, 'Nilai mata dadu', { min: 1, max: 6, integer: true });
    criterion = String(target);
    successes = counts.get(target) ?? 0;
    theoretical = 1 / 6;
  } else if (experiment === 'twoDice') {
    if (values.event === 'sum7') {
      criterion = '7';
      successes = counts.get(7) ?? 0;
      theoretical = 6 / 36;
    } else {
      const target = assertNumber(values.target, 'Jumlah mata dadu', { min: 2, max: 12, integer: true });
      criterion = String(target);
      successes = counts.get(target) ?? 0;
      theoretical = (6 - Math.abs(7 - target)) / 36;
    }
  } else if (experiment === 'cards') {
    if (values.event === 'ace') {
      criterion = 'As';
      successes = [...counts].filter(([key]) => key.startsWith('As ')).reduce((sum, [, count]) => sum + count, 0);
      theoretical = 4 / 52;
    } else if (values.event === 'spade') {
      criterion = 'Sekop';
      successes = [...counts].filter(([key]) => key.endsWith('spades')).reduce((sum, [, count]) => sum + count, 0);
      theoretical = 13 / 52;
    } else {
      criterion = 'Merah';
      successes = [...counts].filter(([key]) => key.endsWith('hearts') || key.endsWith('diamonds')).reduce((sum, [, count]) => sum + count, 0);
      theoretical = 26 / 52;
    }
  } else if (experiment === 'balls') {
    const targetBalls = assertNumber(values.targetBalls, 'Bola kategori target', { min: 0, max: 1000, integer: true });
    const otherBalls = assertNumber(values.otherBalls, 'Bola kategori lain', { min: 0, max: 1000, integer: true });
    const draws = assertNumber(values.draws, 'Banyak pengambilan', { min: 1, max: 20, integer: true });
    const total = targetBalls + otherBalls;
    if (!total) throw new RangeError('Kotak harus berisi setidaknya satu bola.');
    if (values.replacement === 'without' && draws > total) throw new RangeError('Tanpa pengembalian, banyak pengambilan tidak boleh melebihi isi kotak.');
    if (values.replacement === 'without' && draws > targetBalls) theoretical = 0;
    else if (values.replacement === 'without') {
      theoretical = 1;
      for (let index = 0; index < draws; index += 1) theoretical *= (targetBalls - index) / (total - index);
    } else theoretical = (targetBalls / total) ** draws;
    successes = 0;
    for (let trial = 0; trial < trials; trial += 1) {
      let success = true;
      let availableTarget = targetBalls;
      let availableOther = otherBalls;
      for (let draw = 0; draw < draws; draw += 1) {
        const remaining = availableTarget + availableOther;
        if (remaining === 0 || random() >= availableTarget / remaining) {
          success = false;
          if (values.replacement === 'without') availableOther -= 1;
        } else if (values.replacement === 'without') availableTarget -= 1;
      }
      if (success) successes += 1;
    }
    criterion = `Semua ${draws} bola kategori target`;
  } else throw new RangeError('Pilih percobaan yang tersedia.');

  const empirical = successes / trials;
  const chart = [
    { label: 'Teoretis', value: theoretical },
    { label: 'Simulasi', value: empirical },
  ];
  return makeResult('Peluang empiris = frekuensi kejadian / jumlah percobaan.', [
    `Kejadian yang dihitung: ${criterion}.`,
    `Frekuensi kejadian = ${successes}; jumlah percobaan = ${trials}.`,
    `Peluang empiris = ${successes} / ${trials} = ${formatNumber(empirical)} (${formatNumber(empirical * 100, 2)}%).`,
    `Peluang teoretis = ${formatNumber(theoretical)} (${formatNumber(theoretical * 100, 2)}%).`,
    'Simulasi bersifat acak; frekuensi relatif dapat berubah dan tidak harus sama persis dengan peluang teoretis.',
  ], `${successes}/${trials} · ${formatNumber(empirical * 100, 2)}% empiris`, `Selisih terhadap teori: ${formatNumber(Math.abs(empirical - theoretical) * 100, 2)} poin persentase.`, { chart, table: { headers: ['Kejadian', 'Frekuensi', 'Frekuensi relatif'], rows: [['Sesuai target', successes, formatNumber(empirical, 4)], ['Tidak sesuai', trials - successes, formatNumber(1 - empirical, 4)]] }, details: [['Peluang teoretis', theoretical], ['Peluang empiris', empirical], ['Selisih', Math.abs(empirical - theoretical)]] });
}

export function calculateMaterial(topicNumber, values, random = Math.random) {
  if (topicNumber >= 17 && topicNumber <= 25) return calculateDataTopic(topicNumber, values);
  if (topicNumber === 10) {
    const trials = assertNumber(values.trials, 'Jumlah percobaan', { min: 1, max: 10000, integer: true });
    const counts = simulateExperiment(values.experiment, trials, random);
    const chart = [...counts].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'id', { numeric: true })).map(([label, count]) => ({ label: String(label), value: count }));
    const mean = [...counts].reduce((sum, [value, count]) => sum + (typeof value === 'number' ? value : value === 'Angka' ? 1 : 0) * count, 0) / trials;
    return makeResult('Frekuensi relatif = frekuensi nilai X / jumlah percobaan.', [`Percobaan diulang sebanyak ${trials} kali.`, `Frekuensi setiap nilai X: ${chart.map(({ label, value }) => `${label}: ${value}`).join('; ')}.`, `Rata-rata nilai X hasil simulasi = ${formatNumber(mean)}.`], `Rata-rata simulasi X = ${formatNumber(mean)}`, 'Hasil acak berubah pada setiap simulasi. Dalam jangka panjang distribusi frekuensi dapat mendekati distribusi teoretis.', { chart, table: { headers: ['Nilai X', 'Frekuensi', 'Frekuensi relatif'], rows: chart.map(({ label, value }) => [label, value, formatNumber(value / trials, 4)]) } });
  }
  if (topicNumber === 26) return calculateSimulation(values, random);
  const n = (name, label, options) => assertNumber(values[name], label, options);
  switch (topicNumber) {
    case 1: {
      const favorable = n('favorable', 'Banyak hasil yang diinginkan', { min: 0, max: 100000, integer: true });
      const total = n('total', 'Banyak seluruh hasil', { min: 1, max: 100000, integer: true });
      if (favorable > total) throw new RangeError('Banyak hasil yang diinginkan tidak boleh melebihi seluruh hasil.');
      const p = favorable / total;
      return makeResult('P(A) = n(A) / n(S)', [`n(A) = ${favorable}; n(S) = ${total}.`, `Substitusi: P(A) = ${favorable} / ${total}.`, `P(A) = ${formatNumber(p)} = ${formatNumber(p * 100, 2)}%.`], `${formatNumber(p)} (${formatNumber(p * 100, 2)}%)`, 'Untuk hasil yang sama mungkin, peluang adalah banyak hasil yang mendukung kejadian dibagi banyak seluruh hasil.', { probability: p, chart: [{ label: 'Peluang', value: p }] });
    }
    case 2: {
      const outcomes = getExperimentOutcomes(values.experiment);
      const criterion = String(values.criterion ?? '').trim();
      const favorable = outcomes.filter((outcome) => isTargetOutcome(values.experiment, outcome, criterion));
      const p = favorable.length / outcomes.length;
      const display = (outcome) => Array.isArray(outcome) ? `(${outcome.join(', ')})` : String(outcome);
      return makeResult('P(A) = banyak hasil pada kejadian A / banyak hasil dalam ruang sampel S.', [`Ruang sampel S = {${outcomes.slice(0, 20).map(display).join(', ')}${outcomes.length > 20 ? ', …' : ''}}.`, `n(S) = ${outcomes.length}; hasil yang memenuhi kejadian = ${favorable.length}.`, `P(A) = ${favorable.length} / ${outcomes.length} = ${formatNumber(p)}.`], `${favorable.length} dari ${outcomes.length} hasil`, `Ruang sampel memuat semua hasil yang mungkin; kejadian yang diminta adalah ${favorable.length ? favorable.map(display).join(', ') : 'tidak ada hasil yang cocok dengan kriteria'}.`, { probability: p, chart: [{ label: 'Mendukung', value: favorable.length }, { label: 'Lainnya', value: outcomes.length - favorable.length }] });
    }
    case 3: {
      const p = probability(values.p, 'P(A)');
      return makeResult('P(Aᶜ) = 1 − P(A)', [`P(A) = ${formatNumber(p)}.`, `P(Aᶜ) = 1 − ${formatNumber(p)} = ${formatNumber(1 - p)}.`], formatNumber(1 - p), 'Komplemen A mencakup semua hasil yang tidak termasuk A.', { probability: 1 - p, chart: [{ label: 'A', value: p }, { label: 'Aᶜ', value: 1 - p }] });
    }
    case 4: {
      const pA = probability(values.pA, 'P(A)');
      const pB = probability(values.pB, 'P(B)');
      const pAB = probability(values.pAB, 'P(A dan B)');
      if (pAB > Math.min(pA, pB)) throw new RangeError('Peluang irisan tidak boleh melebihi P(A) atau P(B).');
      const p = pA + pB - pAB;
      if (p > 1) throw new RangeError('Peluang gabungan tidak boleh melebihi 1; periksa kembali nilai masukan.');
      return makeResult('P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', [`Substitusi: ${formatNumber(pA)} + ${formatNumber(pB)} − ${formatNumber(pAB)}.`, `P(A ∪ B) = ${formatNumber(p)} (${formatNumber(p * 100, 2)}%).`], formatNumber(p), 'Peluang irisan dikurangi agar anggota yang berada di A dan B tidak dihitung dua kali.', { probability: p, chart: [{ label: 'Gabungan A atau B', value: p }] });
    }
    case 5: {
      const pA = probability(values.pA, 'P(A)');
      const pB = probability(values.pB, values.mode === 'conditional' ? 'P(B | A)' : 'P(B)');
      const p = pA * pB;
      const formula = values.mode === 'conditional' ? 'P(A ∩ B) = P(A) × P(B | A)' : 'Untuk kejadian independen: P(A ∩ B) = P(A) × P(B)';
      return makeResult(formula, [`P(A) = ${formatNumber(pA)}; ${values.mode === 'conditional' ? `P(B | A) = ${formatNumber(pB)}.` : `P(B) = ${formatNumber(pB)} dan A, B dianggap independen.`}`, `P(A ∩ B) = ${formatNumber(pA)} × ${formatNumber(pB)} = ${formatNumber(p)}.`], `${formatNumber(p)} (${formatNumber(p * 100, 2)}%)`, 'Gunakan perkalian peluang marginal hanya jika kejadian independen; untuk kejadian dependen gunakan peluang bersyarat.', { probability: p, chart: [{ label: 'Irisan A dan B', value: p }] });
    }
    case 6: {
      const pA = probability(values.pA, 'P(A)');
      const pAB = probability(values.pAB, 'P(A dan B)');
      if (pA === 0) throw new RangeError('P(A) harus lebih besar dari 0 untuk menghitung P(B | A).');
      if (pAB > pA) throw new RangeError('Peluang irisan P(A dan B) tidak boleh melebihi P(A).');
      const p = pAB / pA;
      return makeResult('P(B | A) = P(A ∩ B) / P(A)', [`P(A ∩ B) = ${formatNumber(pAB)}; P(A) = ${formatNumber(pA)}.`, `P(B | A) = ${formatNumber(pAB)} / ${formatNumber(pA)} = ${formatNumber(p)}.`], `${formatNumber(p)} (${formatNumber(p * 100, 2)}%)`, 'Ruang kemungkinan dibatasi pada kondisi A; hasil ini tidak terdefinisi jika P(A) = 0.', { probability: p, chart: [{ label: 'P(B | A)', value: p }] });
    }
    case 7: {
      const a = n('a', 'Banyak benda kategori A', { min: 1, max: 10000, integer: true });
      const b = n('b', 'Banyak benda kategori lain', { min: 0, max: 10000, integer: true });
      const draws = n('draws', 'Banyak pengambilan', { min: 1, max: 100, integer: true });
      if (draws > a + b) throw new RangeError('Banyak pengambilan tidak boleh melebihi isi kotak.');
      if (draws > a) throw new RangeError('Kejadian semua hasil kategori A tidak mungkin karena jumlah kategori A lebih sedikit dari pengambilan.');
      let dependent = 1;
      for (let i = 0; i < draws; i += 1) dependent *= (a - i) / (a + b - i);
      const independent = (a / (a + b)) ** draws;
      return makeResult('Dengan pengembalian (independen): (a/N)ᵈ. Tanpa pengembalian (dependen): ∏(a−i)/(N−i).', [`Peluang satu pengambilan kategori A = ${a}/${a + b} = ${formatNumber(a / (a + b))}.`, `Dengan pengembalian: (${a}/${a + b})^${draws} = ${formatNumber(independent)}.`, `Tanpa pengembalian: ${Array.from({ length: draws }, (_, i) => `(${a - i}/${a + b - i})`).join(' × ')} = ${formatNumber(dependent)}.`], `Dengan: ${formatNumber(independent)} · Tanpa: ${formatNumber(dependent)}`, 'Dengan pengembalian, komposisi kotak tetap. Tanpa pengembalian, peluang setiap tahap berubah.', { chart: [{ label: 'Dengan pengembalian', value: independent }, { label: 'Tanpa pengembalian', value: dependent }] });
    }
    case 8:
    case 9: {
      const total = n('n', 'Jumlah objek n', { min: 0, max: 170, integer: true });
      const selected = n('r', 'Jumlah objek r', { min: 0, max: 170, integer: true });
      if (selected > total) throw new RangeError('r tidak boleh lebih besar daripada n.');
      const answer = topicNumber === 8 ? factorial(total) / factorial(total - selected) : combination(total, selected);
      const formula = topicNumber === 8 ? 'P(n, r) = n! / (n − r)!; urutan diperhatikan.' : 'C(n, r) = n! / [r!(n − r)!]; urutan tidak diperhatikan.';
      return makeResult(formula, [`n = ${total}; r = ${selected}.`, `Substitusi: ${topicNumber === 8 ? `${total}! / (${total} − ${selected})!` : `${total}! / [${selected}!(${total} − ${selected})!]`}.`, `Hasil = ${formatNumber(answer, 6)}.`], formatNumber(answer, 6), topicNumber === 8 ? 'Gunakan permutasi untuk susunan atau pemilihan yang urutannya berbeda dianggap berbeda.' : 'Gunakan kombinasi untuk memilih kelompok ketika urutan tidak membedakan hasil.', { details: [['Urutan', topicNumber === 8 ? 'Diperhatikan' : 'Tidak diperhatikan']] });
    }
    case 11: {
      const total = n('n', 'Jumlah percobaan n', { min: 0, max: 100, integer: true });
      const p = probability(values.p, 'Peluang sukses p');
      const k = n('k', 'Jumlah sukses k', { min: 0, max: total, integer: true });
      const event = values.event;
      const lower = n('lower', 'Batas bawah', { min: 0, max: total, integer: true });
      const upper = n('upper', 'Batas atas', { min: 0, max: total, integer: true });
      if (event === 'between' && lower > upper) throw new RangeError('Batas bawah tidak boleh melebihi batas atas.');
      if (total === 0) {
        return makeResult('X = 0 dengan peluang 1 ketika n = 0.', ['Tidak ada percobaan, sehingga tidak ada keberhasilan maupun kegagalan.', 'Karena n = 0, satu-satunya nilai yang mungkin adalah X = 0; P(X=0) = 1.'], '1 (100%)', 'Tanpa percobaan, jumlah keberhasilan pasti 0.', { probability: 1, chart: [{ label: 'X = 0', value: 1 }], table: { headers: ['x', 'P(X=x)'], rows: [[0, 1]] } });
      }
      const distribution = Array.from({ length: total + 1 }, (_, x) => binomialPmf(total, p, x));
      const from = event === 'atLeast' ? k : event === 'between' ? lower : 0;
      const to = event === 'atMost' ? k : event === 'between' ? upper : event === 'exact' ? k : total;
      const selectedValues = event === 'exact' ? [distribution[k]] : distribution.slice(from, to + 1);
      const chance = selectedValues.reduce((sum, value) => sum + value, 0);
      const eventLabel = event === 'exact' ? `P(X=${k})` : event === 'atMost' ? `P(X≤${k})` : event === 'atLeast' ? `P(X≥${k})` : `P(${lower}≤X≤${upper})`;
      const formula = event === 'exact'
        ? 'P(X=k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ'
        : `P(X dalam rentang) = Σ P(X=x), x=${from} sampai ${to}`;
      const steps = [
        `Tetapkan n=${total}, p=${formatNumber(p)}, dan q=1−p=${formatNumber(1 - p)}. Binomial sesuai jika percobaan independen dan peluang sukses tetap.`,
        event === 'exact'
          ? `Substitusi: P(X=${k}) = C(${total},${k}) × (${formatNumber(p)})^${k} × (${formatNumber(1 - p)})^${total - k}.`
          : `Kejadian ${eventLabel}; jumlahkan peluang setiap nilai x dari ${from} sampai ${to}.`,
        `Hasil perhitungan ${eventLabel} = ${formatNumber(chance)} (${formatNumber(chance * 100, 2)}%).`,
      ];
      return makeResult(formula, steps, `${formatNumber(chance)} (${formatNumber(chance * 100, 2)}%)`, `Dengan n=${total} percobaan dan peluang sukses ${formatNumber(p)} pada setiap percobaan, peluang kejadian ${eventLabel} adalah ${formatNumber(chance)}.`, {
        probability: chance,
        chart: distribution.map((value, x) => ({ label: String(x), value })),
        table: { headers: ['x', 'P(X=x)'], rows: distribution.map((value, x) => [x, formatNumber(value, 6)]) },
      });
    }
    case 12: {
      const lines = String(values.pairs ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (!lines.length) throw new RangeError('Masukkan setidaknya satu pasangan nilai dan peluang.');
      if (lines.length > 100) throw new RangeError('Masukkan paling banyak 100 pasangan hasil.');
      const pairs = lines.map((line, index) => {
        const parts = line.includes(';')
          ? line.split(';').map((part) => part.trim())
          : line.split(',').map((part) => part.trim());
        if (parts.length !== 2) throw new RangeError(`Baris ${index + 1} harus berisi satu pasangan: nilai; peluang.`);
        return {
          value: assertNumber(parts[0].replace(',', '.'), `Nilai hasil baris ${index + 1}`),
          p: probability(parts[1].replace(',', '.'), `Peluang baris ${index + 1}`),
        };
      });
      const totalP = pairs.reduce((sum, pair) => sum + pair.p, 0);
      if (Math.abs(totalP - 1) > 0.001) throw new RangeError(`Total peluang harus sama dengan 1 (saat ini ${formatNumber(totalP)}).`);
      const expected = pairs.reduce((sum, pair) => sum + pair.value * pair.p, 0);
      return makeResult('E(X) = Σ xᵢP(xᵢ)', [`Total peluang = ${pairs.map(({ p }) => formatNumber(p)).join(' + ')} = ${formatNumber(totalP)}.`, ...pairs.map(({ value, p }) => `${formatNumber(value)} × ${formatNumber(p)} = ${formatNumber(value * p)}.`), `E(X) = ${pairs.map(({ value, p }) => `(${formatNumber(value)} × ${formatNumber(p)})`).join(' + ')} = ${formatNumber(expected)}.`], formatNumber(expected), 'Nilai harapan adalah rata-rata teoretis jangka panjang, bukan hasil yang dijamin pada satu percobaan.', { chart: pairs.map(({ value, p }) => ({ label: String(value), value: p })) });
    }
    case 13: {
      const a = n('a', 'Batas a', {});
      const b = n('b', 'Batas b', {});
      const c = n('c', 'Batas bawah c', {});
      const d = n('d', 'Batas atas d', {});
      if (a >= b) throw new RangeError('Batas interval harus memenuhi a < b.');
      if (c > d) throw new RangeError('Batas bawah kejadian tidak boleh melebihi batas atas.');
      const width = Math.max(0, Math.min(d, b) - Math.max(c, a));
      const p = width / (b - a);
      const mean = (a + b) / 2;
      const variance = (b - a) ** 2 / 12;
      return makeResult('P(c ≤ X ≤ d) = panjang irisan interval / (b − a); f(x) = 1/(b−a).', [`Domain [a,b] = [${formatNumber(a)}, ${formatNumber(b)}]; lebar = ${formatNumber(b - a)}.`, `Irisan kejadian dengan domain memiliki lebar ${formatNumber(width)}.`, `Peluang = ${formatNumber(width)} / ${formatNumber(b - a)} = ${formatNumber(p)} (${formatNumber(p * 100, 2)}%).`, `Kepadatan f(x) = ${formatNumber(1 / (b - a))}; mean = ${formatNumber(mean)}; varians = ${formatNumber(variance)}.`], `${formatNumber(p)} (${formatNumber(p * 100, 2)}%)`, 'Bagian kejadian di luar domain [a,b] tidak menambah peluang. Untuk distribusi kontinu, peluang tepat pada satu titik adalah nol.', { probability: p, chart: [{ label: 'Peluang interval', value: p }, { label: 'Di luar interval', value: 1 - p }], curve: { type: 'uniform', a, b, lower: Math.max(c, a), upper: Math.min(d, b) }, details: [['Mean', mean], ['Varians', variance], ['Kepadatan', 1 / (b - a)]] });
    }
    case 14:
    case 15: {
      const mu = n('mu', 'Mean μ', {});
      const sigma = n('sigma', 'Simpangan baku σ', { min: 0 });
      if (sigma === 0) throw new RangeError('Simpangan baku σ harus lebih besar dari 0.');
      const isSampleMean = topicNumber === 15;
      const sampleSize = isSampleMean ? n('n', 'Ukuran sampel n', { min: 1, max: 100000, integer: true }) : 1;
      const se = sigma / Math.sqrt(sampleSize);
      const event = values.event;
      const lower = n('lower', 'Batas bawah', {});
      const upper = n('upper', 'Batas atas', {});
      if (event === 'between' && lower > upper) throw new RangeError('Batas bawah tidak boleh melebihi batas atas.');
      const zLower = (lower - mu) / se;
      const zUpper = (upper - mu) / se;
      const p = event === 'less' ? standardNormalCdf(zLower) : event === 'greater' ? 1 - standardNormalCdf(zLower) : standardNormalCdf(zUpper) - standardNormalCdf(zLower);
      const variable = isSampleMean ? 'X̄' : 'X';
      const eventLabel = event === 'less' ? `P(${variable} ≤ ${formatNumber(lower)})` : event === 'greater' ? `P(${variable} ≥ ${formatNumber(lower)})` : `P(${formatNumber(lower)} ≤ ${variable} ≤ ${formatNumber(upper)})`;
      const steps = [`Mean = ${formatNumber(mu)}; ${isSampleMean ? `standard error SE = σ/√n = ${formatNumber(sigma)}/√${sampleSize} = ${formatNumber(se)}.` : `simpangan baku σ = ${formatNumber(sigma)}.`}`, `z untuk batas bawah = (${formatNumber(lower)} − ${formatNumber(mu)})/${formatNumber(se)} = ${formatNumber(zLower)}.`, ...(event === 'between' ? [`z untuk batas atas = (${formatNumber(upper)} − ${formatNumber(mu)})/${formatNumber(se)} = ${formatNumber(zUpper)}.`] : []), `Peluang untuk ${eventLabel} = ${formatNumber(p)} (${formatNumber(p * 100, 2)}%).`];
      const curveLower = event === 'less' ? Number.NEGATIVE_INFINITY : lower;
      const curveUpper = event === 'greater' ? Number.POSITIVE_INFINITY : event === 'less' ? lower : upper;
      const sampleMeanWarning = isSampleMean && values.population === 'unknown';
      const interpretation = isSampleMean
        ? `Peluang model Normal untuk rata-rata sampel adalah ${formatNumber(p)}. ${sampleMeanWarning ? 'Kelayakan pendekatan CLT perlu dinilai dari bentuk populasi dan pencilan; ukuran sampel saja bukan jaminan.' : 'Populasi Normal membuat distribusi rata-rata sampel Normal.'}`
        : 'Peluang adalah luas di bawah kurva Normal pada daerah kejadian yang dipilih.';
      return makeResult(isSampleMean ? 'SE = σ/√n; Z = (X̄ − μ)/SE' : 'Z = (X − μ)/σ', steps, `${formatNumber(p)} (${formatNumber(p * 100, 2)}%)`, interpretation, { probability: p, warning: sampleMeanWarning, warningText: sampleMeanWarning ? 'Periksa bentuk populasi dan pencilan; ukuran sampel n saja bukan jaminan pendekatan Normal selalu memadai.' : undefined, chart: [{ label: 'Peluang', value: p }], curve: { type: 'normal', mu, sigma: se, lower: curveLower, upper: curveUpper }, details: isSampleMean ? [['Standard error', se]] : [['Z-score', zLower]] });
    }
    case 16: {
      const total = n('n', 'Jumlah percobaan n', { min: 1, max: 100000, integer: true });
      const p = probability(values.p, 'Peluang sukses p');
      const mean = total * p;
      const sigma = Math.sqrt(total * p * (1 - p));
      if (!sigma) throw new RangeError('Pendekatan Normal tidak berlaku jika p = 0 atau p = 1 karena simpangan baku bernilai 0.');
      const conditionMet = mean >= 5 && total * (1 - p) >= 5;
      const k = n('k', 'Nilai k', { min: 0, max: total, integer: true });
      const lower = n('lower', 'Batas bawah', { min: 0, max: total, integer: true });
      const upper = n('upper', 'Batas atas', { min: 0, max: total, integer: true });
      const event = values.event;
      if (event === 'between' && lower > upper) throw new RangeError('Batas bawah tidak boleh melebihi batas atas.');
      let lo = -Infinity;
      let hi = Infinity;
      if (event === 'exact') { lo = k - 0.5; hi = k + 0.5; }
      else if (event === 'atMost') hi = k + 0.5;
      else if (event === 'atLeast') lo = k - 0.5;
      else { lo = lower - 0.5; hi = upper + 0.5; }
      const probabilityResult = standardNormalCdf((hi - mean) / sigma) - standardNormalCdf((lo - mean) / sigma);
      return makeResult('μ = np; σ = √[np(1−p)]; gunakan koreksi kontinuitas ±0,5.', [`μ = ${total} × ${formatNumber(p)} = ${formatNumber(mean)}; σ = √(${total} × ${formatNumber(p)} × ${formatNumber(1 - p)}) = ${formatNumber(sigma)}.`, `Pemeriksaan syarat: np = ${formatNumber(mean)} ${mean >= 5 ? '≥' : '<'} 5; n(1−p) = ${formatNumber(total * (1 - p))} ${total * (1 - p) >= 5 ? '≥' : '<'} 5.`, `Batas setelah koreksi kontinuitas: ${formatNumber(lo)} sampai ${formatNumber(hi)}.`, `Peluang pendekatan = ${formatNumber(probabilityResult)} (${formatNumber(probabilityResult * 100, 2)}%).`, ...(conditionMet ? [] : ['Peringatan: syarat praktis np ≥ 5 dan n(1−p) ≥ 5 tidak terpenuhi; pendekatan mungkin kurang akurat.'])], `${formatNumber(probabilityResult)} (${formatNumber(probabilityResult * 100, 2)}%)`, 'Ini adalah pendekatan Normal untuk distribusi binomial. Koreksi kontinuitas mengubah batas bilangan bulat menjadi batas kontinu.', { probability: probabilityResult, warning: !conditionMet, chart: [{ label: 'Peluang pendekatan', value: probabilityResult }], curve: { type: 'normal', mu: mean, sigma, lower: lo, upper: hi } });
    }
    default:
      throw new RangeError('Kalkulator untuk materi ini belum tersedia.');
  }
}
