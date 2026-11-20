import materialsMarkdown from '../../../materi.md?raw';
import { calculateMaterial, getCalculatorDefinition } from './materials-math.js';

const STORAGE_KEY = 'probability-3d-learning-progress';
const categories = [
  { id: 'basics', label: 'Probabilitas Dasar', first: 1, last: 7 },
  { id: 'counting', label: 'Teknik Menghitung', first: 8, last: 9 },
  { id: 'distributions', label: 'Distribusi Peluang', first: 10, last: 16 },
  { id: 'statistics', label: 'Statistika Deskriptif', first: 17, last: 25 },
  { id: 'simulation', label: 'Simulasi', first: 26, last: 26 },
];

const summaries = [
  'Memahami peluang sebagai ukuran kemungkinan suatu kejadian.',
  'Menyusun semua hasil yang mungkin dan menentukan kejadian.',
  'Menghitung peluang suatu kejadian tidak terjadi.',
  'Menggabungkan peluang kejadian A atau B tanpa menghitung irisan dua kali.',
  'Menghitung peluang dua kejadian terjadi bersama.',
  'Memperbarui peluang ketika suatu kondisi diketahui.',
  'Membedakan percobaan independen dan dependen.',
  'Menghitung banyak susunan ketika urutan diperhatikan.',
  'Menghitung banyak pilihan ketika urutan tidak diperhatikan.',
  'Menghubungkan hasil percobaan dengan nilai numerik.',
  'Menghitung peluang banyak keberhasilan dalam percobaan berulang.',
  'Menentukan rata-rata teoretis dari hasil dan peluangnya.',
  'Menghitung peluang pada interval kontinu yang seragam.',
  'Mengubah nilai ke skor Z dan menghitung luas kurva Normal.',
  'Memahami distribusi rata-rata sampel dan standard error.',
  'Mendekati peluang Binomial dengan Normal dan koreksi kontinuitas.',
  'Mengenali populasi, sampel, data, dan variabel.',
  'Menghitung mean serta memahami pengaruh nilai ekstrem.',
  'Menentukan nilai tengah dari data yang telah diurutkan.',
  'Menemukan nilai yang paling sering muncul.',
  'Mengukur jarak antara nilai maksimum dan minimum.',
  'Membagi data terurut menjadi kuartil dan mengukur IQR.',
  'Mengukur penyebaran data kuadrat dari mean.',
  'Menafsirkan simpangan baku dalam satuan data asli.',
  'Mengukur arah dan tingkat kemencengan distribusi.',
  'Membandingkan frekuensi relatif simulasi dengan peluang teori.',
];

const enrichment = [
  null,
  { formula: 'P(A) = n(A) / n(S)', components: 'P(A) adalah peluang kejadian A; n(A) adalah banyak hasil yang mendukung A; n(S) adalah banyak semua hasil yang mungkin. Rumus ini berlaku langsung ketika hasil-hasilnya sama mungkin.', application: 'Pada dadu adil, peluang muncul angka lebih dari 4 adalah 2/6 = 1/3, karena hasil yang mendukung adalah {5, 6} dari enam hasil dadu.', links: ['dice', 'coin'] },
  { formula: 'P(A) = n(A) / n(S)', components: 'S adalah ruang sampel, yaitu kumpulan semua hasil percobaan; A adalah kejadian, yaitu bagian dari S. Urutan hasil perlu dipertahankan jika urutan mengubah hasil, seperti pada dua lemparan koin.', application: 'Dua lemparan koin memiliki ruang sampel {AA, AG, GA, GG}. Kejadian tepat satu Angka adalah {AG, GA}, jadi peluangnya 2/4 = 1/2.', links: ['dice', 'coin'] },
  { formula: 'P(Aᶜ) = 1 − P(A)', components: 'Aᶜ dibaca komplemen A, yaitu kejadian bahwa A tidak terjadi. Angka 1 menyatakan seluruh peluang pada ruang sampel.', application: 'Jika peluang bus datang terlambat adalah 0,2, peluang bus tidak terlambat adalah 1 − 0,2 = 0,8.', links: ['dice', 'coin', 'cards'] },
  { formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', components: 'A ∪ B berarti A atau B (termasuk keduanya). P(A ∩ B) dikurangi agar hasil yang masuk ke A dan B tidak dihitung dua kali.', application: 'Dari satu set kartu, peluang mendapat kartu merah atau As = 26/52 + 4/52 − 2/52 = 28/52, karena ada dua As merah.', links: ['cards', 'balls'] },
  { formula: 'P(A ∩ B) = P(A) × P(B) untuk kejadian independen; P(A ∩ B) = P(A) × P(B|A) untuk kejadian dependen.', components: 'A ∩ B berarti kedua kejadian terjadi. P(B|A) adalah peluang B setelah diketahui A terjadi. Pastikan apakah kejadian independen sebelum memakai perkalian P(A)P(B).', application: 'Peluang koin menunjukkan Angka dan dadu menunjukkan 6 adalah 1/2 × 1/6 = 1/12 karena hasil kedua percobaan independen.', links: ['coin', 'dice'] },
  { formula: 'P(B|A) = P(A ∩ B) / P(A), dengan P(A) > 0', components: 'P(B|A) adalah peluang B pada kondisi A; P(A ∩ B) menghitung hasil yang memenuhi A dan B sekaligus; P(A) membatasi ruang kemungkinan pada A.', application: 'Jika dari 12 kartu bergambar (Jack, Queen, King) terdapat 4 kartu hati, maka peluang kartu hati dengan syarat kartu bergambar adalah 4/12 = 1/3.', links: ['cards', 'balls'] },
  { formula: 'Dengan pengembalian: P(A berulang) = pᵈ. Tanpa pengembalian: P(A berulang) = (a/N)((a−1)/(N−1))…', components: 'p adalah peluang A pada satu tahap; d adalah banyak tahap; a adalah banyak objek kategori A; N adalah seluruh objek. Pengembalian menjaga peluang tetap, sedangkan tanpa pengembalian mengubah komposisi.', application: 'Kotak berisi 5 bola merah dan 5 biru. Dua bola merah tanpa pengembalian memiliki peluang 5/10 × 4/9 = 2/9; dengan pengembalian peluangnya (5/10)² = 1/4.', links: ['balls', 'cards'] },
  { formula: 'P(n,r) = n! / (n−r)!', components: 'n adalah jumlah objek tersedia; r adalah objek yang dipilih; tanda ! (faktorial) berarti perkalian bilangan bulat positif sampai bilangan itu. Permutasi dipakai saat urutan/peran berbeda dihitung berbeda.', application: 'Dari 5 finalis, memilih ketua, wakil, dan sekretaris memberi 5 × 4 × 3 = 60 susunan karena jabatan berbeda.', links: ['cards', 'solver'] },
  { formula: 'C(n,r) = n! / [r!(n−r)!]', components: 'n adalah jumlah objek tersedia; r adalah jumlah yang dipilih. Pembagian dengan r! menghapus susunan ulang kelompok yang sama, sehingga kombinasi dipakai ketika urutan tidak penting.', application: 'Memilih 3 siswa dari 10 untuk menjadi tim memberi C(10,3) = 120 tim; tim yang sama tidak menjadi berbeda hanya karena urutan nama berubah.', links: ['cards', 'solver'] },
  { formula: 'X: S → ℝ; E(X) = Σ x·P(X=x)', components: 'X adalah variabel acak yang memberi angka pada setiap hasil; x adalah nilai yang mungkin; P(X=x) adalah peluang nilainya. Daftar nilai dan peluangnya membentuk distribusi X.', application: 'Saat dua koin dilempar, jika X adalah banyak sisi Angka, nilai X adalah 0, 1, atau 2 dengan peluang 1/4, 1/2, dan 1/4.', links: ['coin', 'dice'] },
  { formula: 'P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ', components: 'n adalah banyak percobaan tetap; k adalah banyak sukses; p adalah peluang sukses tiap percobaan; 1−p adalah peluang gagal. Model ini mensyaratkan dua hasil, p tetap, dan percobaan independen.', application: 'Koin adil dilempar 5 kali. Peluang tepat 3 kali Angka = C(5,3)(0,5)³(0,5)² = 0,3125.', links: ['distributions'] },
  { formula: 'E(X) = Σ xᵢP(xᵢ)', components: 'xᵢ adalah nilai hasil ke-i; P(xᵢ) adalah peluang hasil tersebut. Semua peluang harus berjumlah 1; hasil E(X) adalah rata-rata teoretis jangka panjang.', application: 'Hadiah Rp10.000 dengan peluang 0,2 dan hadiah Rp0 dengan peluang 0,8 memiliki nilai harapan Rp10.000×0,2 + Rp0×0,8 = Rp2.000.', links: ['distributions'] },
  { formula: 'f(x) = 1/(b−a); P(c≤X≤d) = panjang([c,d] ∩ [a,b])/(b−a)', components: 'a dan b adalah batas domain dengan a<b; c dan d adalah batas kejadian; f(x) adalah kepadatan konstan. Untuk variabel kontinu, peluang pada satu titik sama dengan 0.', application: 'Waktu tunggu seragam antara 10–20 menit. Peluang menunggu 12–16 menit = (16−12)/(20−10) = 0,4.', links: ['continuous'] },
  { formula: 'Z = (X−μ)/σ; P(X≤x) = Φ((x−μ)/σ)', components: 'X atau x adalah nilai yang ditinjau; μ adalah mean populasi; σ>0 adalah simpangan baku; Z menyatakan jarak dari mean dalam satuan simpangan baku; Φ adalah CDF Normal baku.', application: 'Nilai ujian Normal dengan μ=70 dan σ=10. Nilai 80 memiliki Z=(80−70)/10=1, yaitu satu simpangan baku di atas mean.', links: ['continuous'] },
  { formula: 'SE = σ/√n; X̄ berdistribusi sekitar N(μ, SE²)', components: 'σ adalah simpangan baku populasi; n adalah ukuran sampel; SE adalah simpangan baku distribusi rata-rata sampel; X̄ adalah mean sampel. Bentuk Normal berlaku jika populasi Normal atau pendekatan CLT memadai.', application: 'Jika σ=6 dan sampel berukuran 9, SE=6/√9=2. Rata-rata dari sampel-sampel akan lebih rapat daripada nilai individu.', links: ['continuous'] },
  { formula: 'μ = np; σ = √[np(1−p)]', components: 'n adalah banyak percobaan; p adalah peluang sukses; μ dan σ adalah mean dan simpangan baku Normal pendekatan. Syarat praktis np≥5 dan n(1−p)≥5 perlu diperiksa; koreksi kontinuitas menambah/mengurangi 0,5 pada batas.', application: 'Jika 100 produk masing-masing cacat dengan peluang 0,5 (contoh matematis), untuk P(X≤55) gunakan batas 55,5: z=(55,5−50)/5=1,1 sehingga peluang pendekatannya sekitar 0,8643.', links: ['distributions'] },
  { formula: 'Ringkasan awal: n = banyak pengamatan; xₘᵢₙ = nilai terkecil; xₘₐₓ = nilai terbesar.', components: 'Populasi adalah seluruh sasaran pengamatan; sampel adalah sebagian dari populasi; variabel adalah sifat yang diukur; data adalah nilai hasil pengukuran. Bedakan data kategorik dan numerik sebelum memilih perhitungan.', application: 'Untuk menilai waktu perjalanan siswa, populasi dapat berupa seluruh siswa sekolah, sampelnya 30 siswa, variabelnya waktu perjalanan dalam menit, dan datanya angka yang dikumpulkan.', links: ['solver', 'quiz'] },
  { formula: 'x̄ = (x₁+x₂+…+xₙ)/n = Σxᵢ/n', components: 'xᵢ adalah nilai data ke-i; n adalah banyak data; Σxᵢ adalah jumlah semua nilai; x̄ adalah mean. Mean peka terhadap pencilan karena semua nilai ikut dijumlahkan.', application: 'Nilai 70, 80, 90 memiliki jumlah 240 dan n=3, sehingga mean = 240/3 = 80.', links: ['solver', 'quiz'] },
  { formula: 'n ganjil: median = x((n+1)/2); n genap: median = [x(n/2)+x(n/2+1)]/2', components: 'Data harus diurutkan dahulu; n adalah jumlah data; x(j) adalah nilai pada posisi ke-j. Median membagi data menjadi dua bagian dan lebih tahan terhadap nilai ekstrem.', application: 'Pendapatan 3, 5, 7, 9, 100 memiliki median 7, meskipun mean-nya jauh lebih besar karena nilai ekstrem 100.', links: ['solver', 'quiz'] },
  { formula: 'Modus = nilai dengan frekuensi terbesar', components: 'Frekuensi adalah banyak kemunculan suatu nilai. Data dapat memiliki satu modus, beberapa modus, atau tidak mempunyai modus tunggal jika semua frekuensi sama.', application: 'Ukuran sepatu 38, 39, 39, 40, 41 memiliki modus 39; toko dapat menggunakannya sebagai petunjuk ukuran yang paling banyak diminati.', links: ['solver', 'quiz'] },
  { formula: 'R = xₘₐₓ − xₘᵢₙ', components: 'xₘₐₓ adalah nilai paling besar dan xₘᵢₙ nilai paling kecil. Range mudah dihitung, tetapi hanya bergantung pada dua nilai ekstrem.', application: 'Suhu harian minimum 24°C dan maksimum 32°C menghasilkan range 32−24=8°C.', links: ['solver', 'quiz'] },
  { formula: 'IQR = Q₃ − Q₁', components: 'Q₁ adalah median separuh bawah; Q₂ adalah median seluruh data; Q₃ adalah median separuh atas. Metode kalkulator ini memisahkan median keseluruhan saat n ganjil; konvensi lain dapat berbeda.', application: 'Untuk 1,2,3,4,5,6,7,8, Q₁=2,5 dan Q₃=6,5 sehingga IQR=4; rentang ini mewakili 50% data bagian tengah.', links: ['solver', 'quiz'] },
  { formula: 'Populasi: σ²=Σ(xᵢ−μ)²/N; sampel: s²=Σ(xᵢ−x̄)²/(n−1)', components: 'xᵢ adalah pengamatan; μ atau x̄ adalah mean; N adalah ukuran populasi; n adalah ukuran sampel. Untuk sampel digunakan n−1 (koreksi Bessel) agar estimasi varians populasi tidak cenderung terlalu kecil.', application: 'Data 2,4,6 memiliki mean 4 dan jumlah kuadrat selisih 8. Varians populasi = 8/3; jika data dianggap sampel, varians sampel = 8/2 = 4.', links: ['solver', 'quiz'] },
  { formula: 'Populasi: σ=√σ²; sampel: s=√s²', components: 'Varians mengukur penyebaran dalam satuan kuadrat; akar kuadratnya, simpangan baku, kembali ke satuan asli data. Pilih rumus populasi atau sampel sesuai cakupan data.', application: 'Jika standar deviasi waktu perjalanan adalah 5 menit, jarak tipikal data dari mean sekitar 5 menit; ini bukan batas mutlak untuk setiap perjalanan.', links: ['solver', 'quiz'] },
  { formula: 'G₁ = n/[(n−1)(n−2)] × Σ[(xᵢ−x̄)/s]³', components: 'xᵢ adalah data; x̄ adalah mean; s adalah simpangan baku sampel; n≥3. Rumus di kalkulator adalah estimator Fisher–Pearson terkoreksi; nilai positif mengarah ke ekor kanan, negatif ke ekor kiri.', application: 'Waktu penyelesaian tugas yang kebanyakan singkat tetapi beberapa sangat lama biasanya memiliki ekor panjang di kanan dan skewness positif.', links: ['solver', 'quiz'] },
  { formula: 'Peluang empiris = frekuensi kejadian / jumlah percobaan', components: 'Frekuensi kejadian adalah jumlah keberhasilan yang teramati; jumlah percobaan adalah banyak simulasi. Peluang teoretis dihitung dari model, sedangkan empiris berubah-ubah antar simulasi.', application: 'Lempar dadu 600 kali dan catat kemunculan angka 6. Frekuensi relatifnya dibandingkan dengan peluang teoretis 1/6; hasil simulasi tidak harus tepat 100 kali.', links: ['dice', 'coin', 'cards', 'balls'] },
];

const interactiveFeatures = {
  dice: { label: 'Dadu & simulasi', route: 'dice' },
  coin: { label: 'Laboratorium koin', route: 'coin' },
  cards: { label: 'Laboratorium kartu', route: 'cards' },
  balls: { label: 'Laboratorium bola', route: 'balls' },
  distributions: { label: 'Kalkulator distribusi diskrit (termasuk Binomial)', route: 'distributions' },
  continuous: { label: 'Kalkulator distribusi kontinu', route: 'continuous' },
  solver: { label: 'AI Solver', route: 'solver' },
  quiz: { label: 'Quiz & evaluasi', route: 'quiz' },
};

const practice = [
  { question: 'Satu dari enam hasil dadu memenuhi kejadian. Berapa peluangnya dalam desimal?', answer: 1 / 6, explain: 'P(A) = 1/6 ≈ 0,1667.' },
  { question: 'Berapa banyak hasil dalam ruang sampel untuk satu kali lempar koin?', answer: 2, explain: 'Ruang sampelnya {Angka, Gambar}, jadi ada 2 hasil.' },
  { question: 'Jika P(A) = 0,3, berapa P(Aᶜ)?', answer: 0.7, explain: 'P(Aᶜ) = 1 − 0,3 = 0,7.' },
  { question: 'P(A)=0,5, P(B)=0,4, dan P(A∩B)=0,2. Berapa P(A∪B)?', answer: 0.7, explain: '0,5 + 0,4 − 0,2 = 0,7.' },
  { question: 'Jika A dan B independen dengan peluang 0,5 dan 0,4, berapa peluang irisan?', answer: 0.2, explain: 'P(A∩B) = 0,5 × 0,4 = 0,2.' },
  { question: 'P(A∩B)=0,2 dan P(A)=0,5. Berapa P(B|A)?', answer: 0.4, explain: 'P(B|A) = 0,2 / 0,5 = 0,4.' },
  { question: 'Ada 5 bola target dan 5 bola lain. Diambil dua tanpa pengembalian. Berapa peluang keduanya bola target?', answer: 2 / 9, explain: '(5/10) × (4/9) = 2/9 ≈ 0,2222.' },
  { question: 'Berapa banyak susunan memilih dan mengurutkan 3 dari 5 objek?', answer: 60, explain: 'P(5,3) = 5 × 4 × 3 = 60.' },
  { question: 'Berapa cara memilih 2 objek dari 5 jika urutan tidak penting?', answer: 10, explain: 'C(5,2) = 5! / (2!3!) = 10.' },
  { question: 'Untuk satu lemparan koin, X=1 jika Angka dan X=0 jika Gambar. Apa nilai X yang mungkin? (pisahkan koma)', answer: '0,1', explain: 'Nilai X yang mungkin adalah 0 dan 1.' },
  { question: 'Koin seimbang dilempar 5 kali. Berapa peluang tepat 3 kali Angka?', answer: 0.3125, explain: 'C(5,3)(0,5)³(0,5)² = 0,3125.' },
  { question: 'Hadiah Rp10.000 berpeluang 0,2 dan Rp0 berpeluang 0,8. Berapa nilai harapannya?', answer: 2000, explain: 'E(X) = 10.000×0,2 + 0×0,8 = Rp2.000.' },
  { question: 'X uniform pada [10,20]. Berapa P(12≤X≤16)?', answer: 0.4, explain: '(16−12)/(20−10) = 0,4.' },
  { question: 'Untuk Normal baku, berapa P(Z≤0)?', answer: 0.5, explain: 'Kurva Normal baku simetris di sekitar 0, sehingga luas di kiri 0 adalah 0,5.' },
  { question: 'Jika σ=6 dan n=9, berapa standard error rata-rata sampel?', answer: 2, explain: 'SE = 6/√9 = 2.' },
  { question: 'Untuk n=100 dan p=0,5, pendekatan Normal memberi P(X≤55) kira-kira berapa?', answer: 0.8643, tolerance: 0.015, explain: 'Dengan koreksi kontinuitas, z=(55,5−50)/5=1,1 dan Φ(1,1)≈0,8643.' },
  { question: 'Pada data 3, 5, 7, berapa nilai minimum?', answer: 3, explain: 'Data terurut 3, 5, 7; nilai minimum adalah 3.' },
  { question: 'Berapa mean data 70, 80, 90?', answer: 80, explain: '(70+80+90)/3 = 80.' },
  { question: 'Berapa median data 3, 5, 7, 9, 11?', answer: 7, explain: 'Nilai tengah setelah diurutkan adalah 7.' },
  { question: 'Berapa modus data 1, 3, 3, 5?', answer: 3, explain: 'Nilai 3 muncul paling sering, yaitu dua kali.' },
  { question: 'Berapa range data 5, 7, 8, 10, 15?', answer: 10, explain: 'Range = 15 − 5 = 10.' },
  { question: 'Dengan metode median separuh data, berapa IQR data 1,2,3,4,5,6,7,8?', answer: 4, explain: 'Q1=2,5 dan Q3=6,5, sehingga IQR=6,5−2,5=4.' },
  { question: 'Berapa varians populasi data 2, 4, 6? (desimal)', answer: 8 / 3, tolerance: 0.01, explain: 'Mean=4; jumlah kuadrat selisih=8; varians populasi=8/3≈2,6667.' },
  { question: 'Berapa standar deviasi populasi data 2, 4, 6? (desimal)', answer: Math.sqrt(8 / 3), tolerance: 0.01, explain: 'Standar deviasi = √(8/3) ≈ 1,633.' },
  { question: 'Apakah data 1, 2, 3, 4, 5 simetris atau menceng? (jawab: simetris)', answer: 'simetris', explain: 'Data tersusun simetris di sekitar mean 3; skewness-nya 0.' },
  { question: 'Jika jumlah percobaan makin besar, apakah frekuensi relatif pasti sama persis dengan peluang teori? (jawab: tidak)', answer: 'tidak', explain: 'Frekuensi relatif cenderung mendekati peluang teoretis, tetapi hasil acak tidak harus sama persis.' },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function formatFormula(value) {
  return value
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, 'C($1, $2)')
    .replace(/\\binom\s+n\s*k/g, 'C(n, k)')
    .replace(/\\binom\s*(\d+)\s*(\d+)/g, 'C($1, $2)')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\sqrt/g, '√')
    .replace(/\\leq|\\le/g, '≤')
    .replace(/\\geq|\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\bar\{x\}/g, 'x̄')
    .replace(/\\cap/g, '∩')
    .replace(/\\cup/g, '∪')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\quad|\\,/g, ' ');
}

function renderInline(text) {
  let html = formatFormula(escapeHtml(text));
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html;
}

function renderMarkdown(markdown) {
  const lines = markdown
    .split(/\r?\n/)
    .filter((line) => !/^\s*(?:\*\*(?:Kalkulator|Simulasi)\s*[—-]|Tombol:)/i.test(line));
  const output = [];
  let paragraph = [];
  let listType = '';
  let formula = [];

  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listType) output.push(`</${listType}>`);
    listType = '';
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }
    if (line === '\\[' || line.startsWith('\\[')) {
      flushParagraph();
      closeList();
      formula = [line.replace(/^\\\[/, '').replace(/\\\]$/, '')];
      if (line.endsWith('\\]')) {
        output.push(`<div class="lesson-formula">${renderInline(formula.join(' '))}</div>`);
        formula = [];
      }
      continue;
    }
    if (formula.length) {
      if (line.endsWith('\\]')) {
        formula.push(line.replace(/\\\]$/, ''));
        output.push(`<div class="lesson-formula">${renderInline(formula.join(' '))}</div>`);
        formula = [];
      } else formula.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(4, Number(heading[1].length) + 1);
      output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const nextListType = bullet ? 'ul' : 'ol';
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        output.push(`<${listType}>`);
      }
      output.push(`<li>${renderInline((bullet ?? numbered)[1])}</li>`);
      continue;
    }
    closeList();
    paragraph.push(line);
  }
  flushParagraph();
  closeList();
  if (formula.length) output.push(`<div class="lesson-formula">${renderInline(formula.join(' '))}</div>`);
  return output.join('');
}

function parseLessons(source) {
  const headingPattern = /^##\s+(\d+)\.\s+(.+)$/gm;
  const matches = [...source.matchAll(headingPattern)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    let end = matches[index + 1]?.index ?? source.indexOf('\n# Standar kalkulator interaktif', start);
    if (end < 0) end = source.length;
    const number = Number(match[1]);
    const category = categories.find((item) => number >= item.first && number <= item.last);
    return {
      number,
      title: match[2].trim(),
      category,
      summary: summaries[number - 1],
      markdown: source.slice(start, end).trim(),
      practice: practice[number - 1],
      details: enrichment[number],
    };
  });
}

const lessons = parseLessons(materialsMarkdown);

function readProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []);
  } catch (error) {
    console.warn('Progres belajar lokal tidak dapat dibaca.', error);
    return new Set();
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
  } catch (error) {
    console.warn('Progres belajar tidak dapat disimpan di browser ini.', error);
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getNumericAnswer(value) {
  const normalized = value.trim().replace(',', '.');
  if (/^-?\d+(?:\.\d+)?\s*\/\s*-?\d+(?:\.\d+)?$/.test(normalized)) {
    const [numerator, denominator] = normalized.split('/').map(Number);
    return denominator === 0 ? NaN : numerator / denominator;
  }
  return Number(normalized);
}

function isCorrectAnswer(value, expected, tolerance = 0.005) {
  if (typeof expected === 'number') {
    const answer = getNumericAnswer(value);
    return Number.isFinite(answer) && Math.abs(answer - expected) <= tolerance;
  }
  return value.trim().toLocaleLowerCase('id-ID').replace(/[\s.,!?]/g, '') === expected.toLocaleLowerCase('id-ID').replace(/[\s.,!?]/g, '');
}

export function initMaterialsPage() {
  const root = document.querySelector('#materials-app');
  if (!root || lessons.length !== 26) {
    if (root) console.error(`Materi pembelajaran tidak lengkap: ditemukan ${lessons.length} dari 26 topik.`);
    return;
  }

  let progress = readProgress();
  let activeCategory = 'all';
  let activeLessonIndex = 0;
  let previousFocus = null;
  root.innerHTML = `
    <div class="materials-learning">
      <header class="materials-learning__intro">
        <div class="materials-learning__progress" aria-live="polite">
          <strong data-course-progress>0 dari 26 selesai</strong>
        </div>
      </header>
      <div class="materials-learning__tools">
        <label class="materials-search">
          <span class="sr-only">Cari materi</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" data-material-search placeholder="Cari topik atau konsep…" autocomplete="off">
        </label>
        <div class="materials-categories" role="group" aria-label="Filter kategori"></div>
      </div>
      <div class="materials-learning__results" aria-live="polite">
        <p class="materials-result-count" data-result-count></p>
        <div class="materials-lesson-grid" data-lesson-grid></div>
      </div>
      <dialog class="lesson-dialog" aria-labelledby="lesson-dialog-title">
        <header class="lesson-dialog__header">
          <div><span class="lesson-dialog__eyebrow"></span><h2 id="lesson-dialog-title"></h2></div>
          <button class="lesson-dialog__close" type="button" aria-label="Tutup materi">×</button>
        </header>
        <div class="lesson-dialog__layout">
          <nav class="lesson-toc" aria-label="Daftar isi materi">
            <strong>Daftar isi</strong>
            <button type="button" data-jump="lesson-objective">Tujuan belajar</button>
            <button type="button" data-jump="lesson-theory">Penjelasan</button>
            <button type="button" data-jump="lesson-formula">Rumus</button>
            <button type="button" data-jump="lesson-application">Penerapan</button>
            <button type="button" data-jump="lesson-interactive">Fitur interaktif</button>
            <button type="button" data-jump="lesson-calculator">Kalkulator materi</button>
            <button type="button" data-jump="lesson-practice">Latihan</button>
          </nav>
          <article class="lesson-dialog__body" tabindex="0">
            <div class="lesson-article" data-lesson-content></div>
          </article>
        </div>
        <footer class="lesson-dialog__footer">
          <button class="btn btn-ghost" type="button" data-lesson-prev>Sebelumnya</button>
          <button class="btn btn-primary" type="button" data-lesson-next>Materi berikutnya →</button>
        </footer>
      </dialog>
    </div>
  `;

  const grid = root.querySelector('[data-lesson-grid]');
  const dialog = root.querySelector('.lesson-dialog');
  const article = root.querySelector('[data-lesson-content]');
  const body = root.querySelector('.lesson-dialog__body');
  const closeButton = root.querySelector('.lesson-dialog__close');
  const search = root.querySelector('[data-material-search]');

  function renderProgress() {
    const completed = lessons.filter(({ number }) => progress.has(number)).length;
    root.querySelector('[data-course-progress]').textContent = `${completed} dari 26 selesai`;
  }

  function renderCategories() {
    const container = root.querySelector('.materials-categories');
    container.replaceChildren();
    const items = [{ id: 'all', label: 'Semua materi' }, ...categories];
    items.forEach(({ id, label }) => {
      const button = createElement('button', `category-filter${activeCategory === id ? ' is-active' : ''}`, label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(activeCategory === id));
      button.addEventListener('click', () => {
        activeCategory = id;
        renderCategories();
        renderLessons();
      });
      container.append(button);
    });
  }

  function renderLessons() {
    const query = search.value.trim().toLocaleLowerCase('id-ID');
    const filtered = lessons.filter((lesson) => {
      const matchesCategory = activeCategory === 'all' || lesson.category.id === activeCategory;
      const matchesQuery = !query || `${lesson.title} ${lesson.summary} ${lesson.category.label} ${lesson.markdown}`.toLocaleLowerCase('id-ID').includes(query);
      return matchesCategory && matchesQuery;
    });
    root.querySelector('[data-result-count]').textContent = `${filtered.length} materi`;
    grid.replaceChildren();
    if (!filtered.length) {
      grid.append(createElement('p', 'materials-empty', 'Tidak ada materi yang cocok. Coba kata kunci atau kategori lain.'));
      return;
    }
    filtered.forEach((lesson) => {
      const card = createElement('button', `lesson-card${progress.has(lesson.number) ? ' is-complete' : ''}`);
      card.type = 'button';
      card.setAttribute('aria-label', `Buka materi ${lesson.number}: ${lesson.title}${progress.has(lesson.number) ? ', selesai dibaca' : ''}`);
      const number = createElement('span', 'lesson-card__number', String(lesson.number).padStart(2, '0'));
      const category = createElement('span', 'lesson-card__category', lesson.category.label);
      const title = createElement('strong', 'lesson-card__title', lesson.title);
      const summary = createElement('span', 'lesson-card__summary', lesson.summary);
      const status = createElement('span', 'lesson-card__status', progress.has(lesson.number) ? '✓ Selesai dibaca' : 'Mulai belajar →');
      card.append(number, category, title, summary, status);
      card.addEventListener('click', () => openLesson(lesson.number));
      grid.append(card);
    });
  }

  function calculatorMarkup(topicNumber) {
    const definition = getCalculatorDefinition(topicNumber);
    if (!definition) return '';
    const fields = definition.fields.map((item) => {
      const id = `calc-${topicNumber}-${item.name}`;
      const help = item.help ? `<small>${escapeHtml(item.help)}</small>` : '';
      if (item.type === 'select') {
        const options = item.options.map(([value, label]) => `<option value="${escapeHtml(value)}"${value === item.value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');
        return `<label class="calculator-field" for="${id}"><span>${escapeHtml(item.label)}</span><select id="${id}" name="${escapeHtml(item.name)}" required>${options}</select>${help}</label>`;
      }
      if (item.type === 'textarea') {
        return `<label class="calculator-field calculator-field--wide" for="${id}"><span>${escapeHtml(item.label)}</span><textarea id="${id}" name="${escapeHtml(item.name)}" rows="3" required>${escapeHtml(item.value)}</textarea>${help}</label>`;
      }
      const min = Number.isFinite(item.min) ? ` min="${item.min}"` : '';
      const max = Number.isFinite(item.max) ? ` max="${item.max}"` : '';
      return `<label class="calculator-field" for="${id}"><span>${escapeHtml(item.label)}</span><input id="${id}" name="${escapeHtml(item.name)}" type="${item.type ?? 'text'}" value="${escapeHtml(item.value)}"${min}${max}${item.step ? ` step="${item.step}"` : ''} required>${help}</label>`;
    }).join('');
    return `
      <section class="lesson-calculator" id="lesson-calculator" aria-labelledby="calculator-title-${topicNumber}">
        <button type="button" class="calculator-toggle" aria-expanded="false" aria-controls="calculator-panel-${topicNumber}">
          <span><small>KALKULATOR INTERAKTIF</small><strong id="calculator-title-${topicNumber}">${escapeHtml(definition.title)}</strong></span>
          <span class="calculator-toggle__icon" aria-hidden="true">＋</span>
        </button>
        <div class="calculator-panel" id="calculator-panel-${topicNumber}" hidden>
          <form class="calculator-form" data-calculator="${topicNumber}">
            <div class="calculator-fields">${fields}</div>
            <div class="calculator-actions">
              <button class="btn btn-primary" type="submit">Hitung</button>
              <button class="btn btn-ghost" type="reset">Reset</button>
            </div>
            <p class="calculator-error" role="alert" hidden></p>
            <div class="calculator-output" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  function openLesson(number) {
    const index = lessons.findIndex((lesson) => lesson.number === number);
    if (index < 0) return;
    activeLessonIndex = index;
    previousFocus = document.activeElement;
    renderLesson();
    dialog.showModal();
    closeButton.focus();
  }

  function renderLesson() {
    const lesson = lessons[activeLessonIndex];
    root.querySelector('.lesson-dialog__eyebrow').textContent = `${String(lesson.number).padStart(2, '0')} · ${lesson.category.label}`;
    root.querySelector('#lesson-dialog-title').textContent = lesson.title;
    root.querySelector('[data-lesson-prev]').disabled = activeLessonIndex === 0;
    root.querySelector('[data-lesson-next]').disabled = activeLessonIndex === lessons.length - 1;
    body.scrollTop = 0;
    const calculator = calculatorMarkup(lesson.number);
    article.innerHTML = `
      <section id="lesson-objective" class="lesson-objective">
        <span class="lesson-section-label">TUJUAN BELAJAR</span>
        <p>${escapeHtml(lesson.summary)}</p>
      </section>
      <section id="lesson-theory" class="lesson-theory">
        <span class="lesson-section-label">PENJELASAN MATERI</span>
        ${renderMarkdown(lesson.markdown)}
      </section>
      <section id="lesson-formula" class="lesson-detail-section">
        <span class="lesson-section-label">RUMUS DAN KOMPONEN</span>
        <div class="lesson-formula">${escapeHtml(lesson.details.formula)}</div>
        <p>${escapeHtml(lesson.details.components)}</p>
      </section>
      <section id="lesson-application" class="lesson-detail-section">
        <span class="lesson-section-label">CONTOH PENERAPAN</span>
        <p>${escapeHtml(lesson.details.application)}</p>
      </section>
      <section id="lesson-interactive" class="lesson-detail-section lesson-feature-links">
        <span class="lesson-section-label">COBA FITUR INTERAKTIF</span>
        <h3>Eksplorasi langsung</h3>
        <p>Coba simulasi atau kalkulator pada halaman interaktif yang berhubungan dengan materi ini.</p>
        <div>${lesson.details.links.map((key) => {
    const feature = interactiveFeatures[key];
    return `<a class="btn learning-feature-link" href="#page-${feature.route}">${escapeHtml(feature.label)} <span aria-hidden="true">→</span></a>`;
  }).join('')}</div>
      </section>
      ${calculator}
      <section id="lesson-practice" class="lesson-practice">
        <span class="lesson-section-label">CEK PEMAHAMAN</span>
        <h3>Latihan singkat</h3>
        <p>${escapeHtml(lesson.practice.question)}</p>
        <form class="practice-form" data-practice="${lesson.number}">
          <label for="practice-answer-${lesson.number}">Jawaban</label>
          <div><input id="practice-answer-${lesson.number}" name="answer" type="text" autocomplete="off" required><button class="btn btn-primary" type="submit">Periksa</button></div>
          <p class="practice-feedback" role="status" hidden></p>
        </form>
      </section>
    `;
  }

  function updateReadingProgress() {
    const lesson = lessons[activeLessonIndex];
    const remaining = body.scrollHeight - body.clientHeight;
    const fraction = remaining <= 0 ? 1 : Math.min(1, Math.max(0, body.scrollTop / remaining));
    if (fraction >= 0.98 && !progress.has(lesson.number)) {
      progress.add(lesson.number);
      saveProgress(progress);
      renderProgress();
      renderLessons();
    }
  }

  function renderCalculatorResult(container, output) {
    const result = createElement('div', 'calculator-result');
    const primary = createElement('div', 'calculator-result__primary');
    primary.append(createElement('span', '', 'HASIL'), createElement('strong', '', output.result));
    result.append(primary);
    const formula = createElement('p', 'calculator-result__formula', output.formula);
    result.append(formula);
    if (output.warning) result.append(createElement('p', 'calculator-warning', output.warningText ?? 'Perhatian: syarat pendekatan belum terpenuhi; hasil dapat kurang akurat.'));
    const steps = createElement('ol', 'calculator-steps');
    output.steps.forEach((step) => steps.append(createElement('li', '', step)));
    result.append(steps, createElement('p', 'calculator-interpretation', output.interpretation));
    if (output.details?.length) {
      const details = createElement('dl', 'calculator-details');
      output.details.forEach(([label, value]) => {
        details.append(createElement('dt', '', label), createElement('dd', '', typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 4 }) : String(value)));
      });
      result.append(details);
    }
    if (output.table) {
      const wrapper = createElement('div', 'calculator-table-wrap');
      const table = createElement('table', 'calculator-table');
      table.setAttribute('aria-label', 'Tabel hasil perhitungan');
      const head = createElement('thead');
      const headerRow = createElement('tr');
      output.table.headers.forEach((label) => headerRow.append(createElement('th', '', label)));
      head.append(headerRow);
      const body = createElement('tbody');
      output.table.rows.forEach((values) => {
        const row = createElement('tr');
        values.forEach((value) => row.append(createElement('td', '', String(value))));
        body.append(row);
      });
      table.append(head, body);
      wrapper.append(table);
      result.append(wrapper);
    }
    if (output.chart?.length) {
      const chart = createElement('div', 'calculator-chart');
      chart.setAttribute('role', 'img');
      chart.setAttribute('aria-label', output.chart.map((item) => `${item.label}: ${item.value}`).join('; '));
      const maximum = Math.max(1e-12, ...output.chart.map((item) => item.value));
      output.chart.forEach((item) => {
        const row = createElement('div', 'calculator-chart__row');
        const label = createElement('span', '', item.label);
        const track = createElement('span', 'calculator-chart__track');
        const bar = createElement('i');
        bar.style.width = `${Math.max(1, item.value / maximum * 100)}%`;
        track.append(bar);
        row.append(label, track, createElement('b', '', Number(item.value).toLocaleString('id-ID', { maximumFractionDigits: 3 })));
        chart.append(row);
      });
      result.append(chart);
    }
    if (output.curve) {
      const { type, mu, sigma, a, b } = output.curve;
      const xMin = type === 'uniform' ? a : mu - 4 * sigma;
      const xMax = type === 'uniform' ? b : mu + 4 * sigma;
      const lower = Math.max(xMin, output.curve.lower);
      const upper = Math.min(xMax, output.curve.upper);
      const left = 28;
      const right = 472;
      const baseline = 148;
      const top = 18;
      const density = (x) => type === 'uniform'
        ? 1 / (b - a)
        : Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
      const peak = type === 'uniform' ? density(a) : density(mu);
      const xPosition = (x) => left + (x - xMin) / (xMax - xMin) * (right - left);
      const yPosition = (x) => baseline - density(x) / peak * (baseline - top) * 0.9;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 500 170');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', type === 'normal' ? 'Kurva Normal dengan daerah peluang yang diarsir' : 'Kepadatan Uniform dan interval yang ditanyakan');
      svg.classList.add('calculator-curve');
      const axis = document.createElementNS(svg.namespaceURI, 'path');
      axis.setAttribute('d', `M${left} ${baseline}H${right}`);
      axis.setAttribute('class', 'calculator-curve__axis');
      svg.append(axis);
      if (lower <= upper) {
        const areaXs = [lower];
        for (let index = 1; index < 120; index += 1) {
          const x = xMin + (xMax - xMin) * index / 120;
          if (x > lower && x < upper) areaXs.push(x);
        }
        if (upper > lower) areaXs.push(upper);
        const area = document.createElementNS(svg.namespaceURI, 'path');
        const areaPoints = areaXs.map((x) => `${xPosition(x)} ${yPosition(x)}`).join(' L');
        area.setAttribute('d', `M${xPosition(lower)} ${baseline} L${areaPoints} L${xPosition(upper)} ${baseline} Z`);
        area.setAttribute('class', 'calculator-curve__area');
        svg.append(area);
      }
      const curveXs = Array.from({ length: 121 }, (_, index) => xMin + (xMax - xMin) * index / 120);
      const curvePath = document.createElementNS(svg.namespaceURI, 'path');
      curvePath.setAttribute('d', curveXs.map((x, index) => `${index ? 'L' : 'M'}${xPosition(x)} ${yPosition(x)}`).join(' '));
      curvePath.setAttribute('class', 'calculator-curve__line');
      svg.append(curvePath);
      const figure = createElement('figure', 'calculator-curve-figure');
      figure.append(svg, createElement('figcaption', '', type === 'normal' ? 'Daerah berwarna menunjukkan peluang yang dihitung.' : `Domain [${a}, ${b}]; bagian berwarna adalah irisan dengan interval kejadian.`));
      result.append(figure);
    }
    if (output.box) {
      const [minimum, q1, median, q3, maximum] = output.box;
      const range = maximum - minimum || 1;
      const plot = createElement('div', 'calculator-boxplot');
      const line = createElement('span', 'calculator-boxplot__line');
      const box = createElement('span', 'calculator-boxplot__box');
      box.style.left = `${(q1 - minimum) / range * 100}%`;
      box.style.width = `${Math.max(1, (q3 - q1) / range * 100)}%`;
      const medianMarker = createElement('i', 'calculator-boxplot__median');
      medianMarker.style.left = `${(median - minimum) / range * 100}%`;
      line.append(box, medianMarker);
      plot.append(line, createElement('small', '', `${minimum} · ${q1} · ${median} · ${q3} · ${maximum}`));
      result.append(plot);
    }
    container.replaceChildren(result);
  }

  root.addEventListener('submit', (event) => {
    const calculatorForm = event.target.closest('[data-calculator]');
    if (calculatorForm) {
      event.preventDefault();
      const errorElement = calculatorForm.querySelector('.calculator-error');
      const outputElement = calculatorForm.querySelector('.calculator-output');
      errorElement.hidden = true;
      outputElement.replaceChildren();
      try {
        const values = Object.fromEntries(new FormData(calculatorForm).entries());
        const output = calculateMaterial(Number(calculatorForm.dataset.calculator), values);
        renderCalculatorResult(outputElement, output);
      } catch (error) {
        errorElement.textContent = error instanceof Error ? error.message : 'Perhitungan tidak dapat dilakukan. Periksa kembali masukan.';
        errorElement.hidden = false;
      }
      return;
    }
    const practiceForm = event.target.closest('[data-practice]');
    if (practiceForm) {
      event.preventDefault();
      const lessonNumber = Number(practiceForm.dataset.practice);
      const lesson = lessons.find((item) => item.number === lessonNumber);
      const answer = new FormData(practiceForm).get('answer');
      const feedback = practiceForm.querySelector('.practice-feedback');
      const correct = isCorrectAnswer(String(answer ?? ''), lesson.practice.answer, lesson.practice.tolerance);
      feedback.className = `practice-feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
      feedback.textContent = `${correct ? 'Benar! ' : 'Belum tepat. '}${lesson.practice.explain}`;
      feedback.hidden = false;
    }
  });

  root.addEventListener('click', (event) => {
    if (event.target.closest('.learning-feature-link')) {
      dialog.close();
      return;
    }
    const toggle = event.target.closest('.calculator-toggle');
    if (toggle) {
      const panel = root.querySelector(`#${CSS.escape(toggle.getAttribute('aria-controls'))}`);
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      toggle.querySelector('.calculator-toggle__icon').textContent = isExpanded ? '＋' : '−';
      panel.hidden = isExpanded;
      if (!isExpanded) panel.querySelector('input, select, textarea')?.focus({ preventScroll: true });
      return;
    }
    const jump = event.target.closest('[data-jump]');
    if (jump) {
      article.querySelector(`#${CSS.escape(jump.dataset.jump)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (event.target.closest('[data-lesson-prev]')) {
      if (activeLessonIndex > 0) {
        activeLessonIndex -= 1;
        renderLesson();
      }
      return;
    }
    if (event.target.closest('[data-lesson-next]')) {
      if (activeLessonIndex < lessons.length - 1) {
        activeLessonIndex += 1;
        renderLesson();
      }
      return;
    }
    if (event.target.closest('.lesson-dialog__close')) dialog.close();
  });

  root.addEventListener('reset', (event) => {
    if (!event.target.matches('[data-calculator]')) return;
    const form = event.target;
    setTimeout(() => {
      form.querySelector('.calculator-error').hidden = true;
      form.querySelector('.calculator-output').replaceChildren();
    });
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    previousFocus?.focus?.();
    previousFocus = null;
  });
  body.addEventListener('scroll', updateReadingProgress, { passive: true });
  search.addEventListener('input', renderLessons);

  renderProgress();
  renderCategories();
  renderLessons();
}
