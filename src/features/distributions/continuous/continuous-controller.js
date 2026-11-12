import {
  calculateBinomialNormal,
  calculateNormal,
  calculateSampleMean,
  calculateUniform,
  normalPdf
} from './continuous-math.js';

const root = document.querySelector('#continuous-content');
const tabsHost = document.querySelector('#continuous-tabs');

const MATERIALS = [
  { id: 'concepts', label: 'Konsep Dasar', title: 'Konsep Dasar Distribusi Kontinu' },
  { id: 'uniform', label: 'Uniform', title: 'Seragam Kontinu (Uniform)' },
  { id: 'normal', label: 'Normal', title: 'Distribusi Normal' },
  { id: 'sample', label: 'Rata-Rata Sampel', title: 'Distribusi Rata-Rata Sampel (X̄)' },
  { id: 'binomial-normal', label: 'Binomial → Normal', title: 'Pendekatan Binomial dengan Normal' }
];

const PRESETS = {
  uniform: [
    { label: 'Modul: P(12 ≤ X ≤ 16), Uniform(10, 20)', values: { a: 10, b: 20, eventType: 'between', c: 12, d: 16 } },
    { label: 'Modul: Mean & varians, Uniform(5, 17)', values: { a: 5, b: 17, eventType: 'greaterThan', c: 14, d: 16 } },
    { label: 'Modul: P(X > 14), Uniform(5, 17)', values: { a: 5, b: 17, eventType: 'greaterThan', c: 14 } },
    { label: 'Modul: P(X < 7), Uniform(4, 10)', values: { a: 4, b: 10, eventType: 'lessThan', c: 7 } },
    { label: 'Latihan: P(15 ≤ X ≤ 42), Uniform(0, 60)', values: { a: 0, b: 60, eventType: 'between', c: 15, d: 42 } },
    { label: 'Latihan: P(X < 27), Uniform(20, 50)', values: { a: 20, b: 50, eventType: 'lessThan', c: 27 } },
    { label: 'Latihan: P(30 ≤ X ≤ 45), Uniform(20, 50)', values: { a: 20, b: 50, eventType: 'between', c: 30, d: 45 } },
    { label: 'Latihan: P(35 < X < 44), Uniform(30, 50)', values: { a: 30, b: 50, eventType: 'between', c: 35, d: 44 } },
    { label: 'Latihan komprehensif: P(7 ≤ X ≤ 12), Uniform(5, 15)', values: { a: 5, b: 15, eventType: 'between', c: 7, d: 12 } }
  ],
  normal: [
    { label: 'Modul: P(X > 85), μ=70, σ=10', values: { mode: 'probability', mu: 70, sigma: 10, eventType: 'greaterThan', c: 85 } },
    { label: 'Modul: P(480 ≤ X ≤ 530), μ=500, σ=20', values: { mode: 'probability', mu: 500, sigma: 20, eventType: 'between', c: 480, d: 530 } },
    { label: 'Modul: P(19,5 ≤ X ≤ 20,8), μ=20, σ=0,5', values: { mode: 'probability', mu: 20, sigma: 0.5, eventType: 'between', c: 19.5, d: 20.8 } },
    { label: 'Modul: cari x untuk P(X ≤ x)=0,95', values: { mode: 'quantile', mu: 60, sigma: 8, q: 0.95, tail: 'left' } },
    { label: 'Latihan: P(X ≤ 92), μ=80, σ=12', values: { mode: 'probability', mu: 80, sigma: 12, eventType: 'lessThan', c: 92 } },
    { label: 'Latihan: P(85 ≤ X ≤ 125), μ=100, σ=15', values: { mode: 'probability', mu: 100, sigma: 15, eventType: 'between', c: 85, d: 125 } },
    { label: 'Latihan: P(X > 49), μ=40, σ=6', values: { mode: 'probability', mu: 40, sigma: 6, eventType: 'greaterThan', c: 49 } },
    { label: 'Komprehensif: P(60 ≤ X ≤ 85), μ=72, σ=8', values: { mode: 'probability', mu: 72, sigma: 8, eventType: 'between', c: 60, d: 85 } }
  ],
  sample: [
    { label: 'Modul: P(X̄ > 50,75), μ=50, σ=2, n=16', values: { mode: 'probability', mu: 50, sigma: 2, n: 16, eventType: 'greaterThan', c: 50.75, assumption: 'normalPopulation' } },
    { label: 'Modul: P(9,8 ≤ X̄ ≤ 10,2), μ=10, σ=0,8, n=64', values: { mode: 'probability', mu: 10, sigma: 0.8, n: 64, eventType: 'between', c: 9.8, d: 10.2, assumption: 'normalPopulation' } },
    { label: 'Latihan: P(X̄ > 78), μ=75, σ=12, n=36', values: { mode: 'probability', mu: 75, sigma: 12, n: 36, eventType: 'greaterThan', c: 78, assumption: 'normalPopulation' } },
    { label: 'Latihan: P(198 ≤ X̄ ≤ 204), μ=200, σ=20, n=100', values: { mode: 'probability', mu: 200, sigma: 20, n: 100, eventType: 'between', c: 198, d: 204, assumption: 'normalPopulation' } },
    { label: 'Modul: interval 95%, μ=50, σ=5, n=25', values: { mode: 'symmetricInterval', mu: 50, sigma: 5, n: 25, q: 0.95, assumption: 'normalPopulation' } },
    { label: 'Komprehensif: P(48 ≤ X̄ ≤ 53), μ=50, σ=10, n=25', values: { mode: 'probability', mu: 50, sigma: 10, n: 25, eventType: 'between', c: 48, d: 53, assumption: 'normalPopulation' } }
  ],
  'binomial-normal': [
    { label: 'Modul: P(X ≥ 25), n=200, p=0,10', values: { n: 200, p: 0.1, eventType: 'atLeast', k: 25, continuityCorrection: true } },
    { label: 'Modul: P(15 ≤ X ≤ 25), n=500, p=0,04', values: { n: 500, p: 0.04, eventType: 'integerBetween', a: 15, b: 25, continuityCorrection: true } },
    { label: 'Latihan: P(X ≥ 35), n=100, p=0,30', values: { n: 100, p: 0.3, eventType: 'atLeast', k: 35, continuityCorrection: true } },
    { label: 'Latihan: P(15 ≤ X ≤ 25), n=400, p=0,05', values: { n: 400, p: 0.05, eventType: 'integerBetween', a: 15, b: 25, continuityCorrection: true } },
    { label: 'Latihan: P(X < 45), n=250, p=0,20', values: { n: 250, p: 0.2, eventType: 'strictLessThan', k: 45, continuityCorrection: true } },
    { label: 'Komprehensif: P(X ≥ 30), n=300, p=0,08', values: { n: 300, p: 0.08, eventType: 'atLeast', k: 30, continuityCorrection: true } }
  ]
};

const FIELD_CONFIG = {
  uniform: [
    ['a', 'Batas bawah (a)', '10', 'Nilai minimum interval Uniform.'],
    ['b', 'Batas atas (b)', '20', 'Harus lebih besar dari a.'],
    ['eventType', 'Jenis kejadian', 'between', '', [['lessThan', 'Kurang dari c'], ['greaterThan', 'Lebih dari c'], ['between', 'Antara c dan d'], ['exact', 'Tepat pada x']]],
    ['c', 'Batas c / nilai x', '12', 'Nilai yang ditanyakan; boleh di luar interval.'],
    ['d', 'Batas atas (d)', '16', 'Batas akhir untuk kejadian antara.']
  ],
  normal: [
    ['mode', 'Mode kalkulator', 'probability', '', [['probability', 'Hitung peluang'], ['quantile', 'Cari nilai batas (kuantil)']]],
    ['mu', 'Mean (μ)', '70', 'Pusat distribusi; gunakan satuan data.'],
    ['sigma', 'Simpangan baku (σ)', '10', 'Harus lebih dari 0. Jika punya varians, masukkan akar varians.'],
    ['eventType', 'Jenis kejadian', 'greaterThan', '', [['lessOrEqual', 'Kurang dari atau sama dengan c'], ['greaterThan', 'Lebih dari atau sama dengan c'], ['between', 'Antara c dan d']]],
    ['c', 'Batas c', '85', 'Batas nilai yang ditanyakan.'],
    ['d', 'Batas atas (d)', '100', 'Batas akhir untuk kejadian antara.'],
    ['q', 'Peluang diketahui (q)', '0.95', '0,95 berarti 95%; harus di antara 0 dan 1.'],
    ['tail', 'Sisi peluang', 'left', '', [['left', 'Kiri: P(X ≤ x) = q'], ['right', 'Kanan: P(X ≥ x) = q']]]
  ],
  sample: [
    ['mode', 'Mode kalkulator', 'probability', '', [['probability', 'Hitung peluang X̄'], ['symmetricInterval', 'Interval simetris di sekitar μ']]],
    ['mu', 'Mean populasi (μ)', '50', 'Mean satu pengamatan dan juga mean X̄.'],
    ['sigma', 'Simpangan baku populasi (σ)', '2', 'Harus lebih dari 0; simpangan baku satu pengamatan.'],
    ['n', 'Ukuran sampel (n)', '16', 'Bilangan bulat minimal 1.'],
    ['assumption', 'Asumsi populasi', 'normalPopulation', '', [['normalPopulation', 'Populasi normal'], ['clt', 'Populasi tidak diketahui (Teorema Limit Pusat)']]],
    ['eventType', 'Jenis kejadian', 'greaterThan', '', [['lessOrEqual', 'Kurang dari atau sama dengan c'], ['greaterThan', 'Lebih dari atau sama dengan c'], ['between', 'Antara c dan d']]],
    ['c', 'Batas c', '50.75', 'Nilai rata-rata sampel yang ditanyakan.'],
    ['d', 'Batas atas (d)', '52', 'Batas akhir untuk kejadian antara.'],
    ['q', 'Peluang tercakup (q)', '0.95', 'Peluang tengah interval; harus di antara 0 dan 1.']
  ],
  'binomial-normal': [
    ['n', 'Jumlah percobaan Binomial (n)', '200', 'Bilangan bulat minimal 1.'],
    ['p', 'Peluang sukses (p)', '0.10', 'Harus di antara 0 dan 1; 0,10 berarti 10%.'],
    ['eventType', 'Jenis kejadian', 'atLeast', '', [['atLeast', 'Paling sedikit k: X ≥ k'], ['atMost', 'Paling banyak k: X ≤ k'], ['strictLessThan', 'Kurang dari k: X < k'], ['strictGreaterThan', 'Lebih dari k: X > k'], ['integerBetween', 'Antara a dan b']]],
    ['k', 'Batas bilangan bulat (k)', '25', 'Bilangan bulat dari 0 sampai n.'],
    ['a', 'Batas bawah (a)', '15', 'Untuk kejadian antara; bilangan bulat.'],
    ['b', 'Batas atas (b)', '25', 'Untuk kejadian antara; bilangan bulat.'],
    ['continuityCorrection', 'Koreksi kontinuitas', 'true', 'Aktif secara bawaan; gunakan untuk hasil pendekatan yang lebih baik.', [['true', 'Aktif'], ['false', 'Nonaktif']]]
  ]
};

const SYMBOLS = {
  uniform: [['a, b', 'Batas terkecil dan terbesar yang mungkin.', 'Untuk Uniform(10, 20), panjang totalnya 10.'], ['f(x)', 'PDF atau tinggi kepadatan peluang.', 'Pada Uniform(10, 20), f(x)=1/10.'], ['F(x)', 'CDF: peluang sampai dengan x.', 'F(15)=0,50 pada Uniform(10, 20).'], ['E(X)', 'Mean atau titik tengah interval.', 'E(X)=(a+b)/2.'], ['Var(X)', 'Varians yang mengukur sebaran.', 'Var(X)=(b−a)²/12.']],
  normal: [['μ', 'Mean; pusat kurva Normal.', 'μ=70 adalah nilai pusat.'], ['σ', 'Simpangan baku; lebar sebaran.', 'σ=10 berarti satu unit Z setara 10 satuan X.'], ['Z', 'Skor baku: jarak dari μ dalam satuan σ.', 'Z=1 berarti satu σ di atas mean.'], ['Φ(z)', 'CDF Normal baku, luas di kiri z.', 'Φ(1,5)≈0,9332.']],
  sample: [['X̄', 'Rata-rata sampel yang peluangnya dihitung.', 'Rata-rata panjang 16 baut.'], ['n', 'Jumlah pengamatan dalam satu sampel.', 'n=16.'], ['SE', 'Standard error σ/√n; sebaran rata-rata.', 'σ=2 dan n=16 memberi SE=0,5.'], ['Z', 'Skor baku rata-rata sampel; pembaginya SE.', 'Z=(X̄−μ)/SE.']],
  'binomial-normal': [['n', 'Jumlah percobaan Binomial.', 'n=200 transaksi.'], ['p', 'Peluang sukses per percobaan.', 'p=0,10.'], ['μ=np', 'Mean dari Binomial dan Normal pendekatan.', '200×0,10=20.'], ['σ=√np(1−p)', 'Simpangan baku pendekatan Normal.', 'Untuk n=200,p=0,10, σ=√18.'], ['±0,5', 'Koreksi kontinuitas untuk batas bilangan bulat.', 'P(X≥25) menjadi P(Y>24,5).']]
};

let activeId = 'concepts';

if (!root || !tabsHost) {
  console.error('Fitur Distribusi Peluang Kontinu tidak dapat dimulai: elemen halaman tidak ditemukan.');
} else {
  renderPage();
}

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function formatNumber(value, digits = 4) {
  return Number(value).toFixed(digits).replace('.', ',');
}

function renderPage() {
  tabsHost.replaceChildren();
  for (const material of MATERIALS) {
    const button = document.createElement('button');
    button.className = 'distribution-tab';
    button.type = 'button';
    button.id = `continuous-tab-${material.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(activeId === material.id));
    button.setAttribute('aria-controls', 'continuous-content');
    button.textContent = material.label;
    button.addEventListener('click', () => {
      activeId = material.id;
      renderPage();
    });
    tabsHost.appendChild(button);
  }
  root.setAttribute('role', 'tabpanel');
  root.setAttribute('aria-labelledby', `continuous-tab-${activeId}`);
  if (activeId === 'concepts') {
    renderConcepts();
    return;
  }
  renderCalculator();
}

function renderConcepts() {
  root.innerHTML = `
    <article class="continuous-intro">
      <span class="section-kicker">MATERI DASAR</span>
      <h3>Distribusi kontinu: peluang adalah luas</h3>
      <p>Variabel acak kontinu dapat mengambil nilai di sepanjang interval. Kita tidak menghitung peluang satu nilai tepat; peluang dihitung sebagai luas di bawah kurva PDF.</p>
      <div class="continuous-info-grid">
        <article><b>PDF — fungsi densitas</b><p>f(x) ≥ 0. Tinggi kurva menunjukkan kepadatan, bukan peluang titik. Luas total di bawah kurva adalah 1.</p></article>
        <article><b>CDF — fungsi kumulatif</b><p>F(x) = P(X ≤ x), yaitu luas dari sisi paling kiri kurva sampai x.</p></article>
        <article><b>Peluang satu titik</b><p>P(X = x) = 0. Karena itu, pada distribusi kontinu, P(X &lt; c) sama dengan P(X ≤ c).</p></article>
        <article><b>Pilih model dengan tepat</b><p>Gunakan bentuk data dan asumsi proses. Exponential, Gamma, dan Weibull adalah contoh distribusi kontinu lain, tetapi tidak dihitung pada kalkulator ini.</p></article>
      </div>
      <div class="continuous-formula">F(x) = P(X ≤ x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt</div>
      <div class="continuous-info-grid">
        <article><b>Seragam Kontinu</b><p>Nilai berada di [a,b] dengan kepadatan yang sama.</p></article>
        <article><b>Normal</b><p>Pengukuran membentuk kurva lonceng dengan mean μ dan simpangan baku σ.</p></article>
        <article><b>Rata-rata Sampel (X̄)</b><p>Menghitung peluang rata-rata n pengamatan; gunakan SE = σ/√n.</p></article>
        <article><b>Pendekatan Binomial–Normal</b><p>Memperkirakan peluang Binomial saat np dan n(1−p) cukup besar; pertimbangkan koreksi kontinuitas.</p></article>
      </div>
      <p class="continuous-note"><b>Ingat:</b> kenali variabelnya kontinu atau diskret terlebih dahulu. Binomial tetap diskrit; di sini Normal hanya digunakan untuk menghampirinya. Konvensi pendekatan dapat berbeda antar buku, jadi ikuti ketentuan dosen.</p>
      <div class="continuous-flow">
        <h4>Alur Penyelesaian Soal</h4>
        <ol>
          <li>Kenali jenis variabel: kontinu atau diskret.</li><li>Pilih distribusi sesuai asumsi: Uniform, Normal, atau Binomial.</li>
          <li>Tulis parameternya: (a,b), (μ,σ), atau (n,p).</li><li>Ubah pertanyaan menjadi kejadian peluang.</li>
          <li>Uniform: hitung luas atau rasio interval.</li><li>Normal: standardisasi ke Z lalu gunakan CDF Φ.</li>
          <li>Rata-rata sampel: gunakan SE = σ/√n.</li><li>Binomial: jika layak, gunakan Normal dengan μ=np dan σ=√np(1−p).</li>
          <li>Pada Binomial–Normal, pertimbangkan koreksi kontinuitas.</li><li>Pastikan jawaban masuk akal dan 0 ≤ P ≤ 1.</li>
        </ol>
      </div>
      <div class="continuous-visual-concept" role="img" aria-label="Kurva PDF dengan daerah peluang diarsir">
        <b>Peluang sebagai luas di bawah PDF</b>
        ${createConceptSvg()}
        <small>Area berwarna adalah peluang P(c ≤ X ≤ d), bukan tinggi kurva pada satu titik.</small>
      </div>
    </article>`;
}

function createConceptSvg() {
  return `<svg viewBox="0 0 640 220" role="presentation" aria-hidden="true">
    <path d="M40 190H610M50 190C130 190 150 178 190 132C235 80 265 35 330 35C395 35 425 80 470 132C510 178 535 190 610 190" fill="none" stroke="#62b8ff" stroke-width="4"/>
    <path d="M230 190C250 130 275 45 330 35C385 45 410 130 430 190Z" fill="#58d8a4" fill-opacity=".42"/>
    <path d="M230 190V135M430 190V135" stroke="#f2ca75" stroke-width="2" stroke-dasharray="5 5"/>
    <text x="220" y="212" fill="currentColor">c</text><text x="425" y="212" fill="currentColor">d</text>
    <text x="580" y="212" fill="currentColor">x</text></svg>`;
}

function renderCalculator() {
  const title = MATERIALS.find((item) => item.id === activeId).title;
  const presets = PRESETS[activeId];
  const fields = FIELD_CONFIG[activeId];
  root.innerHTML = `
    <article class="continuous-intro">
      <span class="section-kicker">MATERI DISTRIBUSI PELUANG KONTINU</span>
      <h3>${title}</h3>
      <p>${getIntroduction(activeId)}</p>
      <div class="continuous-info-grid">${SYMBOLS[activeId].map(([symbol, meaning, example]) => `
        <article><code>${symbol}</code><p>${meaning}</p><small>Contoh: ${example}</small></article>`).join('')}</div>
      <details class="continuous-conditions"><summary>Syarat penggunaan</summary><ul>${getConditions(activeId).map((text) => `<li>${text}</li>`).join('')}</ul></details>
      <div class="continuous-formula">${getFormula(activeId)}</div>
      ${flowPanel()}
    </article>
    <form class="continuous-calculator" novalidate>
      <div class="continuous-calculator-heading"><div><span class="section-kicker">KALKULATOR INTERAKTIF</span><h4>Isi nilai, lalu hitung peluang</h4></div>
        <label class="continuous-preset">Contoh dari Modul
          <select data-preset>${presets.map((preset, index) => `<option value="${index}">${esc(preset.label)}</option>`).join('')}</select>
        </label>
      </div>
      <div class="continuous-fields">${fields.map((field) => fieldMarkup(field)).join('')}</div>
      ${activeId === 'binomial-normal' ? '<div class="continuous-condition-check" data-condition-check></div>' : ''}
      <p class="continuous-form-error" data-error role="alert" aria-live="assertive"></p>
      <div class="continuous-actions"><button class="distribution-button primary" type="submit">Hitung Peluang</button><button class="distribution-button secondary" type="button" data-reset>Reset ke contoh</button></div>
    </form>
    <div data-result class="continuous-result" hidden></div>`;

  const form = root.querySelector('form');
  const applyPreset = (index) => {
    const values = presets[index].values;
    for (const [key, value] of Object.entries(values)) {
      const field = form.querySelector(`[data-field="${key}"]`);
      if (field) field.value = String(value);
    }
    updateVisibility();
    updateConditionCheck();
    root.querySelector('[data-error]').textContent = '';
    root.querySelectorAll('[data-field]').forEach((field) => field.removeAttribute('aria-invalid'));
    root.querySelectorAll('[data-field-error]').forEach((error) => { error.textContent = ''; });
    clearResult();
  };
  root.querySelector('[data-preset]').addEventListener('change', (event) => applyPreset(Number(event.target.value)));
  form.addEventListener('change', (event) => {
    if (event.target.matches('[data-field]')) {
      updateVisibility();
      updateConditionCheck();
      clearResult();
    }
  });
  form.addEventListener('input', (event) => {
    if (event.target.matches('[data-field]')) {
      event.target.removeAttribute('aria-invalid');
      const fieldError = root.querySelector(`[data-field-error="${event.target.dataset.field}"]`);
      if (fieldError) fieldError.textContent = '';
      root.querySelector('[data-error]').textContent = '';
      updateConditionCheck();
      clearResult();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });
  root.querySelector('[data-reset]').addEventListener('click', () => {
    root.querySelector('[data-preset]').value = '0';
    applyPreset(0);
    root.querySelector('[data-error]').textContent = '';
  });
  updateVisibility();
  updateConditionCheck();
}

function fieldMarkup([key, label, value, helper, options]) {
  const select = options
    ? `<select data-field="${key}">${options.map(([optionValue, optionLabel]) => `<option value="${optionValue}" ${String(optionValue) === value ? 'selected' : ''}>${optionLabel}</option>`).join('')}</select>`
    : `<input data-field="${key}" type="text" inputmode="decimal" value="${value}" aria-describedby="hint-${key}">`;
  return `<label class="continuous-field" data-field-wrap="${key}"><span>${label}</span>${select}
    ${helper ? `<small id="hint-${key}">${helper}</small>` : ''}<span class="continuous-field-error" data-field-error="${key}"></span></label>`;
}

function updateVisibility() {
  const value = (key) => root.querySelector(`[data-field="${key}"]`)?.value;
  const mode = value('mode');
  const eventType = value('eventType');
  const set = (key, visible) => {
    const field = root.querySelector(`[data-field-wrap="${key}"]`);
    if (field) field.hidden = !visible;
  };
  if (activeId === 'uniform') {
    set('c', eventType !== 'between');
    set('d', eventType === 'between');
  } else if (activeId === 'normal') {
    const quantile = mode === 'quantile';
    set('eventType', !quantile); set('c', !quantile); set('d', !quantile && eventType === 'between');
    set('q', quantile); set('tail', quantile);
  } else if (activeId === 'sample') {
    const symmetric = mode === 'symmetricInterval';
    set('assumption', !symmetric);
    set('eventType', !symmetric); set('c', !symmetric); set('d', !symmetric && eventType === 'between');
    set('q', symmetric);
  } else if (activeId === 'binomial-normal') {
    set('k', eventType !== 'integerBetween');
    set('a', eventType === 'integerBetween'); set('b', eventType === 'integerBetween');
  }
}

function readValues() {
  const values = {};
  root.querySelectorAll('[data-field]').forEach((field) => {
    if (field.closest('[hidden]')) return;
    if (field.type === 'checkbox') {
      values[field.dataset.field] = field.checked;
      return;
    }
    const raw = field.value.trim();
    const key = field.dataset.field;
    if (!raw) throw new RangeError(`${field.closest('label').querySelector('span').textContent} wajib diisi.`);
    const isSelect = field.tagName === 'SELECT';
    if (isSelect && (key === 'mode' || key === 'eventType' || key === 'tail' || key === 'assumption')) {
      values[key] = raw;
      return;
    }
    if (key === 'continuityCorrection') {
      values[key] = raw === 'true';
      return;
    }
    const parsed = Number(raw.replace(',', '.'));
    if (!Number.isFinite(parsed)) throw new RangeError(`${field.closest('label').querySelector('span').textContent}: masukkan angka yang valid.`);
    values[key] = parsed;
  });
  return values;
}

function calculate() {
  const errorHost = root.querySelector('[data-error]');
  errorHost.textContent = '';
  root.querySelectorAll('[data-field]').forEach((field) => field.removeAttribute('aria-invalid'));
  try {
    const values = readValues();
    let result;
    if (activeId === 'uniform') result = calculateUniform(values);
    else if (activeId === 'normal') result = calculateNormal(values);
    else if (activeId === 'sample') result = calculateSampleMean(values);
    else result = calculateBinomialNormal(values);
    renderResult(result);
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    errorHost.textContent = error.message;
    const key = findErrorField(error.message);
    if (key) {
      root.querySelector(`[data-field="${key}"]`)?.setAttribute('aria-invalid', 'true');
      const fieldError = root.querySelector(`[data-field-error="${key}"]`);
      if (fieldError) fieldError.textContent = error.message;
    }
    root.querySelector('[data-result]').hidden = true;
  }
}

function clearResult() {
  root.querySelector('[data-result]').hidden = true;
}

function updateConditionCheck() {
  if (activeId !== 'binomial-normal') return;
  const n = Number(root.querySelector('[data-field="n"]')?.value.replace(',', '.'));
  const p = Number(root.querySelector('[data-field="p"]')?.value.replace(',', '.'));
  const host = root.querySelector('[data-condition-check]');
  if (!Number.isFinite(n) || !Number.isFinite(p) || n < 1 || p <= 0 || p >= 1) {
    host.innerHTML = '<b>Pemeriksaan syarat</b><p>Masukkan n ≥ 1 dan 0 &lt; p &lt; 1 untuk melihat np dan n(1−p).</p>';
    return;
  }
  const np = n * p;
  const nq = n * (1 - p);
  const valid = np >= 5 && nq >= 5;
  host.innerHTML = `<b>Pemeriksaan syarat pendekatan</b><p class="${np >= 5 ? 'is-valid' : 'is-warning'}">np = ${formatNumber(np, 2)} ${np >= 5 ? '≥' : '<'} 5</p>
    <p class="${nq >= 5 ? 'is-valid' : 'is-warning'}">n(1 − p) = ${formatNumber(nq, 2)} ${nq >= 5 ? '≥' : '<'} 5</p>
    <small class="${valid ? 'is-valid' : 'is-warning'}">${valid ? 'Kedua syarat praktis terpenuhi.' : 'Pendekatan Normal kurang dapat diandalkan, tetapi kalkulator tetap menghitung.'}</small>`;
}

function findErrorField(message) {
  const text = message.toLowerCase();
  const matchingLabel = FIELD_CONFIG[activeId].find(([, label]) => text.includes(label.toLowerCase()));
  if (matchingLabel) return matchingLabel[0];
  if (text.includes('simpangan baku')) return 'sigma';
  if (text.includes('peluang sukses') || text.includes('peluang p')) return 'p';
  if (text.includes('ukuran sampel') || text.includes('jumlah percobaan')) return 'n';
  if (text.includes('peluang harus') || text.includes('peluang yang diketahui')) {
    return activeId === 'binomial-normal' ? 'p' : 'q';
  }
  if (text.includes('batas bawah a')) return 'a';
  if (text.includes('batas atas b')) return 'b';
  if (text.includes('batas bawah') || text.includes('c harus')) return activeId === 'binomial-normal' ? 'a' : 'c';
  if (text.includes('batas atas') || text.includes('d harus')) return activeId === 'binomial-normal' ? 'b' : 'd';
  if (text.includes('mean')) return 'mu';
  return null;
}

function renderResult(result) {
  const host = root.querySelector('[data-result]');
  host.hidden = false;
  host.innerHTML = `<div class="continuous-result-header"><span class="section-kicker">HASIL PERHITUNGAN</span><span class="distribution-result-badge">${result.distribution}</span></div>
    <p class="continuous-result-event">${esc(result.event)}</p>
    <div class="continuous-result-primary"><span>Peluang desimal</span><strong>${result.probability > 0 && result.probability < 0.00005 ? '&lt; 0,0001' : formatNumber(result.probability, 4)}</strong>
      <span>Persentase</span><b>${formatNumber(result.percentage, 2)}%</b></div>
    <div class="continuous-intermediate">${Object.entries(result.intermediate).filter(([, value]) => Number.isFinite(value))
      .map(([key, value]) => `<span><b>${esc(key)}</b> ${formatNumber(value, 4)}</span>`).join('')}
      ${result.mean !== undefined ? `<span><b>E(X)</b> ${formatNumber(result.mean)}</span><span><b>Var(X)</b> ${formatNumber(result.variance)}</span><span><b>σ</b> ${formatNumber(result.standardDeviation)}</span>` : ''}</div>
    ${result.warnings.map((warning) => `<p class="continuous-warning">${esc(warning)}</p>`).join('')}
    ${result.continuityNote ? `<p class="continuous-note"><b>Mengapa koreksi kontinuitas?</b> ${esc(result.continuityNote)}</p>` : ''}
    <section class="continuous-steps"><h4>Pembahasan langkah demi langkah</h4><ol>${result.steps.map((step) => `<li><b>${esc(step.title)}</b><p>${esc(step.explanation)}</p></li>`).join('')}</ol></section>
    ${renderChart(result.chart)}`;
}

function renderChart(chart) {
  const width = 760;
  const height = 300;
  const pad = { left: 52, right: 24, top: 28, bottom: 42 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const defaultLow = chart.type === 'uniform' ? chart.a - (chart.b - chart.a) * 0.18 : chart.mu - chart.sigma * 4;
  const defaultHigh = chart.type === 'uniform' ? chart.b + (chart.b - chart.a) * 0.18 : chart.mu + chart.sigma * 4;
  const lo = chart.type === 'uniform' || !Number.isFinite(chart.lower)
    ? defaultLow : Math.min(defaultLow, chart.lower - chart.sigma * 0.25);
  const hi = chart.type === 'uniform' || !Number.isFinite(chart.upper)
    ? defaultHigh : Math.max(defaultHigh, chart.upper + chart.sigma * 0.25);
  const x = (value) => pad.left + ((value - lo) / (hi - lo)) * plotWidth;
  const pdf = chart.type === 'uniform'
    ? (value) => value >= chart.a && value <= chart.b ? 1 / (chart.b - chart.a) : 0
    : (value) => normalPdf(value, chart.mu, chart.sigma);
  const maxY = Math.max(pdf(chart.mu), chart.type === 'uniform' ? 1 / (chart.b - chart.a) : 0) * 1.22;
  const y = (value) => pad.top + plotHeight - (value / maxY) * plotHeight;
  const samples = Array.from({ length: 181 }, (_, index) => lo + ((hi - lo) * index) / 180);
  const curvePath = samples.map((value, index) => `${index ? 'L' : 'M'}${x(value).toFixed(2)},${y(pdf(value)).toFixed(2)}`).join(' ');
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Kurva kepadatan ${chart.type === 'uniform' ? 'Uniform' : 'Normal'} dengan area peluang diarsir">
    <path d="M${pad.left},${pad.top + plotHeight} H${width - pad.right}" stroke="currentColor" opacity=".45"/>
    <path d="M${pad.left},${pad.top} V${pad.top + plotHeight}" stroke="currentColor" opacity=".25"/>`;
  if (chart.type === 'binomial-normal') {
    const mass = binomialBars(chart, lo, hi);
    const maxMass = Math.max(...mass.map((item) => item.probability), 1e-12);
    const barWidth = Math.max(2, plotWidth / mass.length * Math.max(0.68, mass[0]?.step ?? 1));
    for (const item of mass) {
      const highlighted = item.value >= chart.lower && item.value <= chart.upper;
      const barHeight = (item.probability / maxMass) * plotHeight * 0.8;
      svg += `<rect x="${(x(item.value) - barWidth / 2).toFixed(2)}" y="${(pad.top + plotHeight - barHeight).toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" fill="${highlighted ? '#5ed7a2' : '#508fc7'}" opacity=".55"/>`;
    }
  }
  const shadeFrom = chart.type === 'uniform' && chart.eventType === 'lessThan' ? chart.a : chart.lower;
  const shadeTo = chart.type === 'uniform' && chart.eventType === 'greaterThan' ? chart.b : chart.upper;
  const shadeSamples = samples.filter((value) => value >= shadeFrom && value <= shadeTo);
  if (shadeSamples.length) {
    const areaPath = `M${x(shadeSamples[0]).toFixed(2)},${(pad.top + plotHeight).toFixed(2)} ` +
      shadeSamples.map((value) => `L${x(value).toFixed(2)},${y(pdf(value)).toFixed(2)}`).join(' ') +
      ` L${x(shadeSamples.at(-1)).toFixed(2)},${(pad.top + plotHeight).toFixed(2)} Z`;
    svg += `<path d="${areaPath}" fill="#52d59c" fill-opacity=".38"/>`;
  }
  if (chart.populationSigma) {
    const broad = samples.map((value, index) => `${index ? 'L' : 'M'}${x(value).toFixed(2)},${y(normalPdf(value, chart.mu, chart.populationSigma)).toFixed(2)}`).join(' ');
    svg += `<path d="${broad}" fill="none" stroke="#e4b85e" stroke-width="2" stroke-dasharray="6 5"/>`;
  }
  svg += `<path d="${curvePath}" fill="none" stroke="#64b7ff" stroke-width="3"/>`;
  const markers = new Set([chart.mu, chart.type === 'uniform' ? chart.a : chart.mu - chart.sigma, chart.type === 'uniform' ? chart.b : chart.mu + chart.sigma]);
  if (Number.isFinite(chart.lower)) markers.add(chart.lower);
  if (Number.isFinite(chart.upper)) markers.add(chart.upper);
  for (const marker of markers) {
    if (marker < lo || marker > hi) continue;
    const label = marker === chart.mu ? (chart.type === 'uniform' ? 'E(X)' : 'μ') : formatNumber(marker, 2);
    svg += `<path d="M${x(marker).toFixed(2)},${pad.top + plotHeight} V${pad.top + plotHeight - 8}" stroke="currentColor" opacity=".5"/>
      <text x="${x(marker).toFixed(2)}" y="${height - 13}" text-anchor="middle" fill="currentColor" font-size="10">${label}</text>`;
  }
  svg += `<text x="10" y="19" fill="currentColor" font-size="10">f(x)</text><text x="${width - 13}" y="${height - 5}" fill="currentColor" font-size="10">X</text></svg>
    <div class="continuous-chart-legend"><span><i class="continuous-legend-curve"></i> Kurva PDF</span><span><i class="continuous-legend-area"></i> Daerah peluang</span>
    ${chart.populationSigma ? '<span><i class="continuous-legend-population"></i> Satu pengamatan (σ)</span>' : ''}${chart.type === 'binomial-normal' ? '<span><i class="continuous-legend-bars"></i> Batang Binomial</span>' : ''}</div>`;
  return `<section class="continuous-visualization"><span class="section-kicker">VISUALISASI PENDUKUNG</span><h4>Peluang sebagai luas di bawah kurva</h4><p>Kurva dan arsiran mengikuti parameter. Hasil numerik dihitung oleh fungsi peluang, bukan luas piksel.</p><div class="continuous-chart">${svg}</div></section>`;
}

function binomialBars(chart, low, high) {
  const start = Math.max(0, Math.floor(low));
  const end = Math.min(chart.n, Math.ceil(high));
  if (end < start) return [];
  const step = Math.max(1, Math.ceil((end - start + 1) / 160));
  const values = [];
  let probability = Math.exp(
    logChoose(chart.n, start) +
    start * Math.log(chart.p) + (chart.n - start) * Math.log1p(-chart.p)
  );
  for (let k = start; k <= end; k += 1) {
    if ((k - start) % step === 0 || k === end) values.push({ value: k, probability, step });
    if (k < end) probability *= ((chart.n - k) / (k + 1)) * (chart.p / (1 - chart.p));
  }
  return values;
}

function logChoose(n, k) {
  let result = 0;
  const r = Math.min(k, n - k);
  for (let index = 1; index <= r; index += 1) result += Math.log(n - r + index) - Math.log(index);
  return result;
}

function getIntroduction(id) {
  return ({
    uniform: 'Jika X ~ Uniform(a,b), setiap nilai di dalam interval memiliki kepadatan yang sama. Peluang adalah bagian panjang interval yang ditanyakan dibanding panjang total.',
    normal: 'Distribusi Normal memiliki kurva lonceng yang simetris. μ menentukan pusat dan σ menentukan lebar sebaran. Aplikasi menghitung Φ secara lokal tanpa tabel manual.',
    sample: 'Distribusi ini menghitung rata-rata sampel X̄, bukan satu pengamatan. Sebarannya lebih sempit karena simpangan baku rata-ratanya adalah SE = σ/√n.',
    'binomial-normal': 'Binomial adalah distribusi diskrit. Untuk n cukup besar, peluang Binomial dapat dihampiri oleh kurva Normal dengan parameter μ=np dan σ=√np(1−p).'
  })[id];
}

function getConditions(id) {
  return ({
    uniform: ['X kontinu berada di interval [a,b] dengan a < b.', 'Kepadatan dianggap sama di seluruh interval dan tidak ada nilai di luarnya.'],
    normal: ['Variabel kontinu berbentuk lonceng simetris atau soal menyatakan asumsi Normal.', 'Mean μ dan simpangan baku σ diketahui; σ harus lebih besar dari 0.'],
    sample: ['Populasi normal atau ukuran sampel cukup besar sebagai pendekatan Teorema Limit Pusat.', 'Sampel acak, pengamatan independen, dan n bilangan bulat minimal 1.'],
    'binomial-normal': ['Asalnya Binomial: n percobaan independen dengan dua hasil dan p tetap.', 'Syarat praktis pendekatan: np ≥ 5 dan n(1−p) ≥ 5. Jika tidak terpenuhi, hasil tetap dihitung tetapi kurang dapat diandalkan.']
  })[id];
}

function getFormula(id) {
  return ({
    uniform: 'f(x)=1/(b−a)  ·  F(x)=(x−a)/(b−a)  ·  P(c≤X≤d)=(d−c)/(b−a)  ·  E(X)=(a+b)/2  ·  Var(X)=(b−a)²/12',
    normal: 'f(x)=1/(σ√(2π)) exp(−(x−μ)²/(2σ²))  ·  Z=(X−μ)/σ  ·  P(c≤X≤d)=Φ(z₂)−Φ(z₁)',
    sample: 'X̄ ~ N(μ, σ²/n)  ·  SE=σ/√n  ·  Z=(X̄−μ)/SE',
    'binomial-normal': 'X~Bin(n,p) ≈ Y~N(μ=np, σ²=np(1−p))  ·  terapkan koreksi kontinuitas ±0,5'
  })[id];
}

function flowPanel() {
  return `<details class="continuous-flow">
    <summary>Alur Penyelesaian Soal — buka panduan</summary>
    <ol>
      <li>Kenali jenis variabel: kontinu atau diskrit.</li>
      <li>Pilih distribusi sesuai asumsi: Uniform, Normal, atau Binomial.</li>
      <li>Tulis parameter (a,b), (μ,σ), atau (n,p).</li>
      <li>Ubah pertanyaan menjadi kejadian peluang.</li>
      <li>Uniform: hitung rasio panjang interval.</li>
      <li>Normal: standardisasi ke Z lalu gunakan CDF Φ.</li>
      <li>Rata-rata sampel: gunakan SE = σ/√n.</li>
      <li>Binomial: jika layak, gunakan Normal dengan μ=np dan σ=√np(1−p).</li>
      <li>Binomial–Normal: pertimbangkan koreksi kontinuitas.</li>
      <li>Periksa apakah hasil masuk akal dan 0 ≤ P ≤ 1.</li>
    </ol>
    <p>Notasi dan aturan pendekatan dapat sedikit berbeda antar buku; ikuti konvensi dosen.</p>
  </details>`;
}
