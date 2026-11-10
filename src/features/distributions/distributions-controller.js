import {
  calculateBinomial,
  calculateGeometric,
  calculateHypergeometric,
  calculateMultinomial,
  calculateNegativeBinomial,
  calculatePoisson,
  getDistributionSeries,
  getHypergeometricPopulation,
  getTrialPattern,
} from './distribution-math.js';
import { DISTRIBUTIONS, DISTRIBUTION_BY_ID } from './distributions-data.js';

const root = document.querySelector('#distributions-content');
const tabsHost = document.querySelector('#distribution-tabs');
if (!root || !tabsHost) {
  console.error('Fitur Distribusi Diskrit tidak dapat dimulai: elemen halaman tidak ditemukan.');
} else {
  initializeDistributionPage(root, tabsHost);
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function fieldMarkup({ id, label, value, helper, min, max, step = '1', required = true }) {
  return `
    <label class="distribution-field" for="${id}">
      <span>${label}</span>
      <input id="${id}" data-field="${id}" type="text" inputmode="${step === '1' ? 'numeric' : 'decimal'}"
        value="${escapeAttribute(value)}" ${min !== undefined ? `data-min="${min}"` : ''}
        ${max !== undefined ? `data-max="${max}"` : ''} data-step="${step}" ${required ? 'required' : ''}>
      <small>${helper}</small>
      <span class="distribution-field-error" data-error-for="${id}" aria-live="polite"></span>
    </label>`;
}

function eventMarkup(options) {
  return `
    <label class="distribution-field" for="distribution-event">
      <span>Jenis kejadian</span>
      <select id="distribution-event" data-field="eventType">
        ${options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
      </select>
      <small>Pilih bentuk kejadian peluang yang ingin dihitung.</small>
      <span class="distribution-field-error" data-error-for="eventType" aria-live="polite"></span>
    </label>`;
}

function standardEvents({ includeAtLeast = true, includeBetween = true, cumulativeLabel = 'Paling banyak' } = {}) {
  const options = [['exact', 'Tepat']];
  options.push(['atMost', cumulativeLabel]);
  if (includeAtLeast) options.push(['atLeast', 'Paling sedikit']);
  if (includeBetween) options.push(['between', 'Antara dua batas']);
  if (!includeAtLeast && !includeBetween) options.push(['after', 'Setelah']);
  return options;
}

function renderInputs(id) {
  const exactCount = (label = 'Jumlah sukses (x)', value = 2, helper = 'Masukkan bilangan bulat yang ingin dihitung.') =>
    fieldMarkup({ id: 'value-x', label, value, helper, min: 0 });

  if (id === 'binomial') {
    return `
      ${fieldMarkup({ id: 'value-n', label: 'Jumlah percobaan (n)', value: 8, helper: 'Jumlah percobaan harus bilangan bulat positif.', min: 1, max: 1000 })}
      ${fieldMarkup({ id: 'value-p', label: 'Peluang sukses (p)', value: '0.10', helper: 'Nilai antara 0 dan 1; contoh 0,10 berarti 10%.', min: 0, max: 1, step: 'any' })}
      ${exactCount()}
      ${eventMarkup(standardEvents())}
      <div class="distribution-range-fields" data-range-fields hidden>
        ${fieldMarkup({ id: 'value-lower', label: 'Batas bawah (a)', value: 1, helper: 'Nilai awal rentang, dari 0 sampai n.', min: 0 })}
        ${fieldMarkup({ id: 'value-upper', label: 'Batas atas (b)', value: 3, helper: 'Nilai akhir rentang, tidak lebih dari n.', min: 0 })}
      </div>`;
  }
  if (id === 'multinomial') {
    return `
      ${fieldMarkup({ id: 'value-n', label: 'Jumlah percobaan (n)', value: 6, helper: 'Jumlah frekuensi kategori harus sama dengan n.', min: 1, max: 1000 })}
      <div class="distribution-category-heading">
        <div><h4>Kategori hasil</h4><p>Jumlah peluang harus 1 dan jumlah frekuensi harus n.</p></div>
        <button class="distribution-button secondary" type="button" data-add-category>＋ Tambah kategori</button>
      </div>
      <div class="distribution-category-list" data-category-list>
        ${categoryRow(0, 'Motor', 0.5, 3)}
        ${categoryRow(1, 'Mobil', 0.2, 2)}
        ${categoryRow(2, 'Angkutan umum', 0.3, 1)}
      </div>
      <p class="distribution-category-totals" data-category-totals aria-live="polite"></p>
      <span class="distribution-field-error" data-error-for="categories" aria-live="polite"></span>`;
  }
  if (id === 'hypergeometric') {
    return `
      ${fieldMarkup({ id: 'value-N', label: 'Jumlah populasi (N)', value: 10, helper: 'Jumlah seluruh objek yang tersedia.', min: 1, max: 1000 })}
      ${fieldMarkup({ id: 'value-K', label: 'Jumlah objek sukses (K)', value: 4, helper: 'Jumlah objek dengan karakteristik yang dicari.', min: 0 })}
      ${fieldMarkup({ id: 'value-n', label: 'Jumlah sampel (n)', value: 3, helper: 'Jumlah objek yang diambil tanpa pengembalian.', min: 0 })}
      ${exactCount()}
      <p class="distribution-note"><b>Tanpa pengembalian.</b> Komposisi kelompok berubah setiap objek yang diambil.</p>
      ${eventMarkup(standardEvents())}
      <div class="distribution-range-fields" data-range-fields hidden>
        ${fieldMarkup({ id: 'value-lower', label: 'Batas bawah (a)', value: 1, helper: 'Masukkan jumlah sukses awal yang dicari.', min: 0 })}
        ${fieldMarkup({ id: 'value-upper', label: 'Batas atas (b)', value: 3, helper: 'Masukkan jumlah sukses akhir yang dicari.', min: 0 })}
      </div>`;
  }
  if (id === 'geometric') {
    return `
      ${fieldMarkup({ id: 'value-p', label: 'Peluang sukses (p)', value: '0.20', helper: 'Harus lebih dari 0 dan paling besar 1.', min: 0, max: 1, step: 'any' })}
      ${fieldMarkup({ id: 'value-x', label: 'Nomor percobaan (x)', value: 4, helper: 'Nomor percobaan sukses pertama; minimal 1.', min: 1 })}
      ${eventMarkup(standardEvents({ includeAtLeast: false, includeBetween: false, cumulativeLabel: 'Paling lambat' }))}`;
  }
  if (id === 'negative-binomial') {
    return `
      ${fieldMarkup({ id: 'value-p', label: 'Peluang sukses (p)', value: '0.40', helper: 'Harus lebih dari 0 dan paling besar 1.', min: 0, max: 1, step: 'any' })}
      ${fieldMarkup({ id: 'value-k', label: 'Target jumlah sukses (k)', value: 3, helper: 'Jumlah sukses yang ditunggu; minimal 1.', min: 1 })}
      ${fieldMarkup({ id: 'value-x', label: 'Nomor percobaan (x)', value: 7, helper: 'Nomor percobaan saat sukses ke-k terjadi; x ≥ k.', min: 1 })}
      ${eventMarkup(standardEvents({ includeAtLeast: false, includeBetween: false, cumulativeLabel: 'Paling lambat' }))}`;
  }
  return `
    ${fieldMarkup({ id: 'value-lambda', label: 'Rata-rata kejadian (λ)', value: 3, helper: 'Rata-rata untuk interval yang sedang dihitung; nilai minimal 0.', min: 0, max: 1000, step: 'any' })}
    ${fieldMarkup({ id: 'value-x', label: 'Jumlah kejadian (x)', value: 2, helper: 'Jumlah kejadian yang ingin dihitung; bilangan bulat mulai dari 0.', min: 0 })}
    ${fieldMarkup({ id: 'value-interval', label: 'Keterangan interval', value: '10 menit', helper: 'Contoh: per menit, per 10 menit, per jam, atau per hari.', step: 'text' })}
    <p class="distribution-note">Pastikan λ sesuai dengan interval yang dimasukkan. Rata-rata 3 kejadian per 10 menit berbeda dari 3 kejadian per 20 menit.</p>
    ${eventMarkup(standardEvents())}
    <div class="distribution-range-fields" data-range-fields hidden>
      ${fieldMarkup({ id: 'value-lower', label: 'Batas bawah (a)', value: 1, helper: 'Jumlah kejadian minimum yang dicari.', min: 0 })}
      ${fieldMarkup({ id: 'value-upper', label: 'Batas atas (b)', value: 3, helper: 'Jumlah kejadian maksimum yang dicari.', min: 0 })}
    </div>`;
}

function categoryRow(index, name, probability, count) {
  return `
    <div class="distribution-category-row" data-category-row>
      <label class="distribution-field" for="category-name-${index}">
        <span>Nama kategori</span>
        <input id="category-name-${index}" data-category-name type="text" value="${escapeAttribute(name)}" required>
      </label>
      <label class="distribution-field" for="category-p-${index}">
        <span>Peluang (pᵢ)</span>
        <input id="category-p-${index}" data-category-p type="text" inputmode="decimal" value="${probability}" required>
      </label>
      <label class="distribution-field" for="category-x-${index}">
        <span>Frekuensi (xᵢ)</span>
        <input id="category-x-${index}" data-category-x type="text" inputmode="numeric" value="${count}" required>
      </label>
      <button class="distribution-remove-category" type="button" data-remove-category aria-label="Hapus kategori ${escapeAttribute(name)}">Hapus</button>
    </div>`;
}

function initializeDistributionPage(rootElement, tabsElement) {
  let activeId = DISTRIBUTIONS[0].id;
  let lastResult = null;
  let categoryCounter = 3;

  function renderTabs() {
    tabsElement.replaceChildren();
    for (const distribution of DISTRIBUTIONS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'distribution-tab';
      button.textContent = distribution.name;
      button.id = `distribution-tab-${distribution.id}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(distribution.id === activeId));
      button.setAttribute('aria-controls', 'distributions-content');
      button.addEventListener('click', () => {
        activeId = distribution.id;
        lastResult = null;
        render();
      });
      tabsElement.appendChild(button);
    }
  }

  function render() {
    const data = DISTRIBUTION_BY_ID[activeId];
    renderTabs();
    rootElement.setAttribute('role', 'tabpanel');
    rootElement.setAttribute('aria-labelledby', `distribution-tab-${activeId}`);
    rootElement.innerHTML = `
      <div class="distribution-intro">
        <span class="section-kicker">MATERI DISTRIBUSI DISKRIT</span>
        <h3>${data.name}</h3>
        <p>${data.tagline} ${data.when}</p>
        <div class="distribution-info-grid">
          <article><b>Kapan digunakan?</b><p>${data.when}</p></article>
          <article><b>Contoh situasi</b><p>${data.examples}</p></article>
        </div>
        <div class="distribution-conditions"><b>Syarat penggunaan</b><ul>${data.conditions.map((condition) => `<li>${condition}</li>`).join('')}</ul></div>
      </div>
      <div class="distribution-formula-card">
        <span class="section-kicker">RUMUS DAN KOMPONEN</span>
        <div class="distribution-formula" aria-label="Rumus ${data.name}">${data.formula}</div>
        <div class="distribution-symbol-grid">${data.symbols.map(([symbol, meaning, example]) => `
          <article><code>${symbol}</code><p>${meaning}</p><small>Contoh: ${example}</small></article>`).join('')}
        </div>
      </div>
      <form class="distribution-calculator" id="distribution-calculator" novalidate>
        <div class="distribution-calculator-heading">
          <div><span class="section-kicker">KALKULATOR INTERAKTIF</span><h4>Kalkulator ${data.name}</h4></div>
          <span class="distribution-live-tag">NILAI DAPAT DIUBAH</span>
        </div>
        <div class="distribution-input-grid">${renderInputs(activeId)}</div>
        <div class="distribution-form-error" data-form-error role="alert" aria-live="assertive"></div>
        <div class="distribution-actions">
          <button type="submit" class="distribution-button primary">Hitung Peluang</button>
          <button type="button" class="distribution-button secondary" data-reset>Reset ke contoh</button>
        </div>
      </form>
      <div class="distribution-result" data-result hidden></div>`;

    bindCalculator();
    if (lastResult) renderResult(lastResult);
  }

  function readField(id, { integer = false, text = false } = {}) {
    const input = rootElement.querySelector(`[data-field="${id}"]`);
    if (!input) return undefined;
    const raw = input.value.trim();
    const label = input.closest('label').querySelector('span').textContent;
    if (!raw) throw new RangeError(`${label} wajib diisi.`);
    if (text) return raw;
    const value = Number(raw.replace(',', '.'));
    if (!Number.isFinite(value)) throw new RangeError(`${label}: masukkan nilai angka yang valid.`);
    if (integer && !Number.isInteger(value)) throw new RangeError(`${label} harus berupa bilangan bulat.`);
    return value;
  }

  function readParameters() {
    const eventType = rootElement.querySelector('[data-field="eventType"]')?.value ?? 'exact';
    const values = { eventType };
    const read = (field, options) => {
      const value = readField(`value-${field}`, options);
      if (value !== undefined) values[field] = value;
    };

    if (activeId === 'binomial') {
      read('n', { integer: true }); read('p');
      if (eventType !== 'between') read('x', { integer: true });
    } else if (activeId === 'multinomial') {
      read('n', { integer: true });
      values.categories = [...rootElement.querySelectorAll('[data-category-row]')].map((row) => {
        const name = row.querySelector('[data-category-name]').value.trim();
        const pRaw = row.querySelector('[data-category-p]').value.trim();
        const xRaw = row.querySelector('[data-category-x]').value.trim();
        if (!pRaw || !xRaw) throw new RangeError(`Lengkapi peluang dan frekuensi untuk kategori ${name || 'tanpa nama'}.`);
        return { name, p: Number(pRaw.replace(',', '.')), x: Number(xRaw) };
      });
    } else if (activeId === 'hypergeometric') {
      read('N', { integer: true }); read('K', { integer: true });
      read('n', { integer: true });
      if (eventType !== 'between') read('x', { integer: true });
    } else if (activeId === 'geometric') {
      read('p'); read('x', { integer: true });
    } else if (activeId === 'negative-binomial') {
      read('p'); read('k', { integer: true }); read('x', { integer: true });
    } else {
      read('lambda');
      if (eventType !== 'between') read('x', { integer: true });
      read('interval', { text: true });
    }

    if (eventType === 'between') {
      read('lower', { integer: true }); read('upper', { integer: true });
    }
    return values;
  }

  function errorFieldId(message) {
    const text = message.toLowerCase();
    if (text.includes('peluang') || text.includes(' p ')) return 'value-p';
    if (text.includes('lambda') || text.includes('rata-rata') || text.includes('λ')) return 'value-lambda';
    if (text.includes('populasi') || text.includes('n =')) return 'value-N';
    if (activeId === 'hypergeometric' && text.includes('sukses k')) return 'value-K';
    if (text.includes('target sukses') || text.includes('jumlah sukses k')) return 'value-k';
    if (text.includes('sampel n')) return 'value-n';
    if (text.includes('percobaan n')) return 'value-n';
    if (text.includes('batas bawah')) return 'value-lower';
    if (text.includes('batas atas')) return 'value-upper';
    if (text.includes('jumlah sukses (x)')) return 'value-x';
    if (text.includes('jumlah kejadian (x)')) return 'value-x';
    if (text.includes('nomor percobaan (x)')) return 'value-x';
    if (text.includes('keterangan interval')) return 'value-interval';
    if (text.includes('nilai x') || text.includes('nomor percobaan')) return 'value-x';
    if (text.includes('frekuensi kategori') || text.includes('total frekuensi') || text.includes('total peluang') || text.includes('nama kategori')) return 'categories';
    return null;
  }

  function showError(message) {
    const formError = rootElement.querySelector('[data-form-error]');
    formError.textContent = message;
    const field = errorFieldId(message);
    const fieldError = field && rootElement.querySelector(`[data-error-for="${field}"]`);
    if (fieldError) fieldError.textContent = message;
    const input = field && rootElement.querySelector(`[data-field="${field}"]`);
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearErrors() {
    rootElement.querySelectorAll('[data-form-error], .distribution-field-error').forEach((element) => {
      element.textContent = '';
    });
    rootElement.querySelectorAll('[aria-invalid="true"]').forEach((element) => element.removeAttribute('aria-invalid'));
  }

  function validateFieldImmediately(input) {
    const field = input.dataset.field;
    if (!field || field === 'eventType') return;
    const error = rootElement.querySelector(`[data-error-for="${field}"]`);
    if (!error) return;
    const raw = input.value.trim();
    let message = '';
    if (!raw) {
      message = 'Nilai ini wajib diisi.';
    } else if (input.dataset.step !== 'text') {
      const value = Number(raw.replace(',', '.'));
      if (!Number.isFinite(value)) message = 'Masukkan nilai angka yang valid.';
      else if (input.dataset.step === '1' && !Number.isInteger(value)) message = 'Nilai ini harus berupa bilangan bulat.';
      else if (input.dataset.min !== undefined && value < Number(input.dataset.min)) message = `Nilai minimal adalah ${input.dataset.min}.`;
      else if (input.dataset.max !== undefined && value > Number(input.dataset.max)) message = `Nilai maksimal adalah ${input.dataset.max}.`;
      else if (field === 'value-p' && (activeId === 'geometric' || activeId === 'negative-binomial') && value === 0) message = 'Peluang sukses harus lebih dari 0.';
    }
    error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (!message) input.removeAttribute('aria-invalid');
  }

  function setLiveFieldError(field, message) {
    const input = rootElement.querySelector(`[data-field="${field}"]`);
    const error = rootElement.querySelector(`[data-error-for="${field}"]`);
    if (!input || !error) return;
    if (message) {
      error.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }
  }

  function validateRelatedFields() {
    const getNumber = (field) => {
      const input = rootElement.querySelector(`[data-field="${field}"]`);
      const value = input?.value.trim();
      if (!value || !Number.isFinite(Number(value.replace(',', '.')))) return null;
      return Number(value.replace(',', '.'));
    };
    const eventType = rootElement.querySelector('[data-field="eventType"]')?.value;

    if (activeId === 'binomial') {
      const n = getNumber('value-n');
      const x = getNumber('value-x');
      if (eventType !== 'between' && n !== null && x !== null && x > n) {
        setLiveFieldError('value-x', 'Jumlah sukses x tidak boleh melebihi jumlah percobaan n.');
      }
      if (eventType === 'between') {
        const upper = getNumber('value-upper');
        if (n !== null && upper !== null && upper > n) setLiveFieldError('value-upper', 'Batas atas tidak boleh melebihi n.');
      }
    } else if (activeId === 'hypergeometric') {
      const N = getNumber('value-N');
      const K = getNumber('value-K');
      const n = getNumber('value-n');
      if (N !== null && K !== null && K > N) setLiveFieldError('value-K', 'Jumlah objek sukses K tidak boleh melebihi populasi N.');
      if (N !== null && n !== null && n > N) setLiveFieldError('value-n', 'Jumlah sampel n tidak boleh melebihi populasi N.');
      if (N !== null && K !== null && n !== null && K <= N && n <= N) {
        const minimum = Math.max(0, n - (N - K));
        const maximum = Math.min(n, K);
        const x = getNumber('value-x');
        const lower = getNumber('value-lower');
        const upper = getNumber('value-upper');
        if (eventType === 'between') {
          if (lower !== null && lower < minimum) setLiveFieldError('value-lower', `Batas bawah minimal ${minimum} untuk komposisi populasi ini.`);
          if (upper !== null && upper > maximum) setLiveFieldError('value-upper', `Batas atas maksimal ${maximum} untuk komposisi populasi ini.`);
          if (lower !== null && upper !== null && lower > upper) setLiveFieldError('value-lower', 'Batas bawah harus lebih kecil atau sama dengan batas atas.');
        } else if (x !== null && (x < minimum || x > maximum)) {
          setLiveFieldError('value-x', `Jumlah sukses harus berada pada rentang yang mungkin, ${minimum}–${maximum}.`);
        }
      }
    } else if (activeId === 'negative-binomial') {
      const k = getNumber('value-k');
      const x = getNumber('value-x');
      if (k !== null && x !== null && x < k) setLiveFieldError('value-x', 'Nomor percobaan x harus sama dengan atau lebih besar dari target sukses k.');
    }

    if (eventType === 'between' && activeId !== 'hypergeometric') {
      const lower = getNumber('value-lower');
      const upper = getNumber('value-upper');
      if (lower !== null && upper !== null && lower > upper) {
        setLiveFieldError('value-lower', 'Batas bawah harus lebih kecil atau sama dengan batas atas.');
      }
    }
  }

  function updateRangeVisibility() {
    const eventType = rootElement.querySelector('[data-field="eventType"]')?.value;
    const range = rootElement.querySelector('[data-range-fields]');
    if (range) range.hidden = eventType !== 'between';
    const x = rootElement.querySelector('[data-field="value-x"]');
    if (x) x.closest('.distribution-field').hidden = eventType === 'between';
  }

  function updateCategoryTotals() {
    const rows = [...rootElement.querySelectorAll('[data-category-row]')];
    const probability = rows.reduce((sum, row) => sum + (Number(row.querySelector('[data-category-p]').value.replace(',', '.')) || 0), 0);
    const frequency = rows.reduce((sum, row) => sum + (Number(row.querySelector('[data-category-x]').value) || 0), 0);
    const n = Number(rootElement.querySelector('[data-field="value-n"]')?.value) || 0;
    const totals = rootElement.querySelector('[data-category-totals]');
    if (totals) {
      totals.textContent = `Σ peluang = ${probability.toFixed(4)} (harus 1) · Σ frekuensi = ${frequency} (harus n = ${n})`;
      totals.classList.toggle('is-valid', Math.abs(probability - 1) <= 1e-9 && frequency === n);
    }
    rows.forEach((row) => {
      row.querySelector('[data-remove-category]').disabled = rows.length <= 2;
    });
  }

  function bindCalculator() {
    const form = rootElement.querySelector('#distribution-calculator');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors();
      try {
        const parameters = readParameters();
        const calculate = {
          binomial: calculateBinomial,
          multinomial: calculateMultinomial,
          hypergeometric: calculateHypergeometric,
          geometric: calculateGeometric,
          'negative-binomial': calculateNegativeBinomial,
          poisson: calculatePoisson,
        }[activeId];
        lastResult = calculate(parameters);
        renderResult(lastResult);
      } catch (error) {
        if (!(error instanceof Error)) throw error;
        showError(error.message);
        rootElement.querySelector('[data-result]').hidden = true;
      }
    });

    rootElement.querySelector('[data-reset]').addEventListener('click', () => {
      lastResult = null;
      categoryCounter = 3;
      render();
    });

    rootElement.querySelector('[data-field="eventType"]')?.addEventListener('change', () => {
      clearErrors();
      lastResult = null;
      rootElement.querySelector('[data-result]').hidden = true;
      updateRangeVisibility();
      validateRelatedFields();
    });
    rootElement.querySelectorAll('[data-field]').forEach((input) => {
      input.addEventListener('input', () => {
        clearErrors();
        validateFieldImmediately(input);
        validateRelatedFields();
        lastResult = null;
        rootElement.querySelector('[data-result]').hidden = true;
        if (input.dataset.field === 'value-n' && activeId === 'multinomial') updateCategoryTotals();
      });
    });
    rootElement.querySelector('[data-add-category]')?.addEventListener('click', () => {
      const list = rootElement.querySelector('[data-category-list]');
      list.insertAdjacentHTML('beforeend', categoryRow(categoryCounter, `Kategori ${categoryCounter + 1}`, 0, 0));
      categoryCounter += 1;
      bindCategoryRowEvents();
      updateCategoryTotals();
    });
    bindCategoryRowEvents();
    updateRangeVisibility();
    updateCategoryTotals();
  }

  function bindCategoryRowEvents() {
    rootElement.querySelectorAll('[data-remove-category]').forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        if (rootElement.querySelectorAll('[data-category-row]').length <= 2) return;
        button.closest('[data-category-row]').remove();
        updateCategoryTotals();
        clearErrors();
      });
    });
    rootElement.querySelectorAll('[data-category-p], [data-category-x], [data-category-name]').forEach((input) => {
      if (input.dataset.bound) return;
      input.dataset.bound = 'true';
      input.addEventListener('input', () => {
        clearErrors();
        validateFieldImmediately(input);
        lastResult = null;
        rootElement.querySelector('[data-result]').hidden = true;
        updateCategoryTotals();
      });
    });
  }

  function renderResult(result) {
    const host = rootElement.querySelector('[data-result]');
    host.replaceChildren();
    host.hidden = false;

    const heading = document.createElement('div');
    heading.className = 'distribution-result-heading';
    heading.innerHTML = '<span class="section-kicker">HASIL PERHITUNGAN</span><span class="distribution-result-badge"></span>';
    heading.querySelector('.distribution-result-badge').textContent = result.distribution;
    host.appendChild(heading);

    const event = document.createElement('p');
    event.className = 'distribution-result-event';
    event.textContent = result.event;
    host.appendChild(event);

    const primary = document.createElement('div');
    primary.className = 'distribution-result-primary';
    primary.innerHTML = '<span>Peluang desimal</span><strong></strong><span>Persentase</span><b></b>';
    primary.querySelector('strong').textContent = formatDecimal(result.probability);
    primary.querySelector('b').textContent = `${result.percentage.toFixed(2).replace('.', ',')}%`;
    host.appendChild(primary);

    const parameters = document.createElement('details');
    parameters.className = 'distribution-result-parameters';
    const summary = document.createElement('summary');
    summary.textContent = 'Lihat parameter dan bentuk rumus';
    parameters.appendChild(summary);
    const parameterText = document.createElement('p');
    parameterText.textContent = `Parameter: ${formatParameters(result.parameters)}. Rumus: ${result.formula}`;
    parameters.appendChild(parameterText);
    host.appendChild(parameters);

    const stepsSection = document.createElement('section');
    stepsSection.className = 'distribution-steps';
    const stepsTitle = document.createElement('h4');
    stepsTitle.textContent = 'Pembahasan langkah demi langkah';
    stepsSection.appendChild(stepsTitle);
    const steps = document.createElement('ol');
    result.steps.forEach((step) => {
      const item = document.createElement('li');
      const title = document.createElement('b');
      title.textContent = step.title;
      const explanation = document.createElement('p');
      explanation.textContent = step.explanation;
      item.append(title, explanation);
      steps.appendChild(item);
    });
    stepsSection.appendChild(steps);
    host.appendChild(stepsSection);

    renderVisualization(host, result);
  }

  render();
}

function formatDecimal(value) {
  return value.toFixed(6).replace('.', ',');
}

function formatParameters(parameters) {
  return Object.entries(parameters).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: ${value.map((category) => `${category.name} (p=${category.p}, x=${category.x})`).join('; ')}`;
    }
    return `${key} = ${value}`;
  }).join(', ');
}

function renderVisualization(host, result) {
  const section = document.createElement('section');
  section.className = 'distribution-visualization';
  const heading = document.createElement('div');
  heading.innerHTML = '<span class="section-kicker">VISUALISASI PENDUKUNG</span><h4>Grafik peluang distribusi</h4><p>Grafik mengikuti parameter dan kejadian yang dihitung. Nilai peluang berasal dari fungsi matematika.</p>';
  section.appendChild(heading);

  if (result.distribution === 'Hipergeometrik') {
    const population = getHypergeometricPopulation(result.parameters);
    const group = document.createElement('div');
    group.className = 'distribution-population';
    group.setAttribute('role', 'img');
    group.setAttribute('aria-label', `Ilustrasi populasi ${result.parameters.N} objek, terdiri dari ${result.parameters.K} objek sukses dan ${result.parameters.N - result.parameters.K} objek bukan sukses.`);
    population.forEach((item) => {
      const object = document.createElement('i');
      object.className = item.success ? 'is-success' : 'is-other';
      object.title = item.label;
      group.appendChild(object);
    });
    section.appendChild(group);
    if (population.length < result.parameters.N) {
      const note = document.createElement('small');
      note.textContent = `Ilustrasi menampilkan ${population.length} objek sebagai sampel proporsional dari ${result.parameters.N}; perhitungan memakai jumlah populasi penuh.`;
      section.appendChild(note);
    }
    const legend = document.createElement('div');
    legend.className = 'distribution-legend';
    legend.innerHTML = '<span><i class="is-success"></i> Sukses</span><span><i class="is-other"></i> Bukan sukses</span>';
    section.appendChild(legend);
  }

  if (result.distribution === 'Geometrik' || result.distribution === 'Binomial Negatif') {
    const pattern = getTrialPattern(result.distribution, result.parameters);
    const sequence = document.createElement('div');
    sequence.className = 'distribution-trial-sequence';
    sequence.setAttribute('role', 'img');
    sequence.setAttribute('aria-label', 'Satu pola percobaan yang sesuai dengan kejadian, bukan hasil acak simulasi.');
    pattern.values.forEach(({ trial, success }) => {
      const cell = document.createElement('span');
      cell.className = success ? 'is-success' : 'is-failure';
      cell.innerHTML = `<b>${success ? 'S' : 'G'}</b><small>${trial}</small>`;
      cell.title = `Percobaan ${trial}: ${success ? 'sukses' : 'gagal'}`;
      sequence.appendChild(cell);
    });
    section.appendChild(sequence);
    const note = document.createElement('small');
    note.textContent = `S = sukses, G = gagal. Ini salah satu pola yang sesuai, bukan simulasi acak.${pattern.truncated ? ` Ditampilkan ${pattern.values.length} dari ${pattern.total} percobaan.` : ''}`;
    section.appendChild(note);
  }

  const series = getDistributionSeries(result.distribution, result.parameters);
  const maxProbability = Math.max(...series.map((item) => item.probability), 1e-12);
  const chart = document.createElement('div');
  chart.className = 'distribution-chart';
  chart.setAttribute('role', 'img');
  chart.setAttribute('aria-label', `Grafik batang peluang ${result.distribution}; batang berwarna hijau termasuk kejadian yang dipilih.`);
  series.forEach((item) => {
    const column = document.createElement('div');
    column.className = `distribution-chart-column${item.highlight ? ' is-highlighted' : ''}`;
    column.title = `${item.value}: peluang ${item.probability.toPrecision(5)}${item.detail ? `; ${item.detail}` : ''}`;
    const value = document.createElement('small');
    value.textContent = `${(item.probability * 100).toFixed(1)}%`;
    const track = document.createElement('div');
    track.className = 'distribution-chart-track';
    const bar = document.createElement('i');
    bar.style.height = `${Math.max(item.probability === 0 ? 0 : 2, (item.probability / maxProbability) * 100)}%`;
    track.appendChild(bar);
    const label = document.createElement('b');
    label.textContent = String(item.value);
    column.append(value, track, label);
    chart.appendChild(column);
  });
  section.appendChild(chart);
  if (series.length === 80) {
    const note = document.createElement('small');
    note.textContent = 'Grafik menampilkan rentang nilai di sekitar kejadian yang dipilih agar tetap terbaca.';
    section.appendChild(note);
  }
  if (result.distribution === 'Multinomial') {
    const table = document.createElement('div');
    table.className = 'distribution-category-result';
    table.innerHTML = '<h5>Ringkasan kategori</h5><div class="distribution-category-result-head"><span>Kategori</span><span>pᵢ</span><span>xᵢ</span><span>pᵢˣⁱ</span></div>';
    result.parameters.categories.forEach((category) => {
      const row = document.createElement('div');
      row.className = 'distribution-category-result-row';
      const values = [
        category.name,
        String(category.p),
        String(category.x),
        String(Math.pow(category.p, category.x)),
      ];
      values.forEach((value) => {
        const cell = document.createElement('span');
        cell.textContent = value;
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
    section.appendChild(table);
  }
  host.appendChild(section);
}
