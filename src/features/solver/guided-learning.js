const $ = (id) => document.getElementById(id);

const ui = {
  host: $('guided-scene'),
  count: $('guided-step-count'),
  percent: $('guided-progress-percent'),
  bar: $('guided-progress-bar'),
  title: $('guided-step-title'),
  description: $('guided-step-description'),
  math: $('guided-step-math'),
  note: $('guided-step-note'),
  caption: $('guided-scene-caption'),
  previous: $('guided-prev'),
  next: $('guided-next'),
  play: $('guided-play'),
  final: $('guided-final-message')
};

if (Object.values(ui).every(Boolean)) {
  const TOTAL_STEPS = 4;
  const COLORS = {
    red: '#e75059',
    merah: '#e75059',
    blue: '#368ce8',
    biru: '#368ce8',
    yellow: '#f2c94c',
    kuning: '#f2c94c',
    white: '#f7f8fb',
    putih: '#f7f8fb',
    green: '#3bb987',
    hijau: '#3bb987',
    purple: '#9b75db',
    orange: '#f2934b',
    black: '#283342',
    gray: '#aeb8c2',
    gold: '#d8ad4c',
    neutral: '#6f8aa6'
  };

  let currentProblem = null;
  let currentStep = 0;
  let autoPlayTimer = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function getKnown(problem) {
    if (problem.aiSolution) return problem.aiSolution.known;

    const known = [];
    if (problem.model === 'dice' || problem.model === 'dice-single') {
      const count = problem.diceCount || (problem.model === 'dice-single' ? 1 : 2);
      known.push(`${count} dadu, masing-masing memiliki 6 sisi.`);
    }
    if (problem.model === 'balls' && problem.counts) {
      for (const [color, count] of Object.entries(problem.counts)) {
        if (count > 0) known.push(`${count} bola ${color}.`);
      }
    }
    if (Number.isFinite(problem.total)) {
      known.push(`Ruang sampel berisi ${problem.total} kemungkinan hasil.`);
    }
    if (Number.isFinite(problem.favorable)) {
      known.push(`${problem.favorable} hasil memenuhi kejadian.`);
    }
    return known.length ? known : [problem.description || problem.title];
  }

  function getAsked(problem) {
    return problem.aiSolution?.asked ||
      problem.interpretation?.interpretation ||
      problem.description ||
      `Menentukan ${problem.title}.`;
  }

  function getFormula(problem) {
    if (problem.aiSolution) return problem.aiSolution.formula;
    if (problem.kind === 'counting') return `${problem.formula} = ${problem.answerValue}`;
    if (problem.kind === 'binomial') return problem.formula;
    return `${problem.favorable}/${problem.total} = ${problem.fraction} = ${problem.percentage.toFixed(2)}%`;
  }

  function getAnswer(problem) {
    return problem.aiSolution?.answer ||
      (problem.kind === 'counting'
        ? `${problem.answerValue} ${problem.answerLabel}`
        : `${problem.fraction} (${problem.percentage.toFixed(2)}%)`);
  }

  function getSlides(problem) {
    if (problem.aiSolution) {
      const solution = problem.aiSolution;
      return [
        {
          title: 'Diketahui',
          description: 'Data yang tertulis pada soal dan digunakan dalam perhitungan.',
          math: solution.known.join(' · '),
          note: 'Pastikan setiap angka dan informasi berasal dari soal, bukan asumsi tambahan.',
          caption: 'Langkah 1: Catat semua informasi yang diketahui.',
          content: { type: 'list', items: solution.known }
        },
        {
          title: 'Ditanyakan',
          description: solution.asked,
          math: 'Tentukan kejadian atau nilai peluang yang diminta.',
          note: 'Kejadian yang ditanyakan menjadi fokus pembilang atau parameter pada rumus.',
          caption: 'Langkah 2: Kenali dengan tepat apa yang harus dicari.',
          content: { type: 'text', text: solution.asked }
        },
        {
          title: 'Analisis dan perhitungan',
          description: solution.analysis,
          math: solution.formula,
          note: 'Ikuti urutan langkah dan periksa kembali substitusi angka ke dalam rumus.',
          caption: 'Langkah 3: Hubungkan informasi soal dengan rumus.',
          content: { type: 'list', items: solution.steps }
        },
        {
          title: 'Jawaban dan kesimpulan',
          description: solution.conclusion,
          math: solution.answer,
          note: 'Jawaban akhir harus menjawab pertanyaan dengan satuan atau bentuk peluang yang sesuai.',
          caption: 'Langkah 4: Simpulkan hasilnya.',
          content: { type: 'result', items: [solution.formula, solution.answer, solution.conclusion] }
        }
      ];
    }

    const analysis = problem.steps?.length > 1
      ? problem.steps.slice(0, -1)
      : [problem.summary];
    return [
      {
        title: 'Diketahui',
        description: `Informasi utama pada soal: ${problem.title.toLowerCase()}.`,
        math: getKnown(problem).join(' · '),
        note: 'Kumpulkan data yang diketahui sebelum memilih rumus.',
        caption: 'Langkah 1: Baca data pada soal.',
        content: { type: 'list', items: getKnown(problem) }
      },
      {
        title: 'Ditanyakan',
        description: getAsked(problem),
        math: 'Tentukan kejadian yang ingin dihitung.',
        note: 'Bedakan kejadian yang ditanyakan dari seluruh hasil yang mungkin.',
        caption: 'Langkah 2: Tentukan kejadian yang dicari.',
        content: { type: 'text', text: getAsked(problem) }
      },
      {
        title: 'Analisis dan perhitungan',
        description: analysis.join(' '),
        math: getFormula(problem),
        note: 'Bandingkan banyak hasil yang memenuhi kejadian dengan ruang sampel.',
        caption: 'Langkah 3: Susun perhitungan berdasarkan ruang sampel.',
        content: { type: 'list', items: analysis }
      },
      {
        title: 'Jawaban dan kesimpulan',
        description: problem.summary,
        math: getAnswer(problem),
        note: 'Peluang adalah perbandingan hasil yang memenuhi kejadian terhadap seluruh kemungkinan.',
        caption: 'Langkah 4: Tafsirkan jawaban akhir.',
        content: { type: 'result', items: [getFormula(problem), getAnswer(problem), problem.summary] }
      }
    ];
  }

  function addObjects(problem, slideIndex, container) {
    const visualItems = problem.aiSolution?.visualization?.items;
    if (visualItems?.length) {
      const grid = element('div', 'guided-object-grid');
      for (const item of visualItems) {
        const card = element('div', `guided-object-card${item.favorable && slideIndex >= 2 ? ' favorable' : ''}`);
        const shape = element('span', `guided-object-shape shape-${item.shape}`);
        shape.style.backgroundColor = COLORS[item.color] || COLORS.neutral;
        if (item.color === 'white') shape.classList.add('light-object');
        shape.setAttribute('aria-hidden', 'true');
        const label = element('strong', '', item.label);
        const count = element('small', '', `Jumlah: ${item.count}`);
        card.append(shape, label, count);
        grid.appendChild(card);
      }
      container.appendChild(grid);
      return;
    }

    if (problem.model === 'balls' && problem.counts) {
      const grid = element('div', 'guided-object-grid');
      for (const [color, count] of Object.entries(problem.counts)) {
        if (!count) continue;
        const card = element('div', `guided-object-card${color === problem.target && slideIndex >= 2 ? ' favorable' : ''}`);
        const shape = element('span', 'guided-object-shape shape-sphere');
        shape.style.backgroundColor = COLORS[color] || COLORS.neutral;
        if (color === 'putih') shape.classList.add('light-object');
        shape.setAttribute('aria-hidden', 'true');
        card.append(shape, element('strong', '', color), element('small', '', `${count} bola`));
        grid.appendChild(card);
      }
      container.appendChild(grid);
      return;
    }

    if (!Array.isArray(problem.sample) || !problem.sample.length) return;
    let items = problem.sample;
    if (slideIndex >= 2) items = items.filter((item) => item.favorable);
    const limit = slideIndex === 1 ? 36 : 24;
    const grid = element('div', 'guided-sample-grid');
    for (const item of items.slice(0, limit)) {
      const values = item.values || (
        Number.isInteger(item.first) ? [item.first, item.second] : null
      );
      let label = item.value ?? '';
      if (values) {
        const operator = problem.interpretation?.eventType === 'product_equals' ? ' × ' : ' + ';
        label = values.join(operator);
      }
      const chip = element('span', `guided-sample-chip${item.favorable && slideIndex >= 1 ? ' favorable' : ''}`, label);
      grid.appendChild(chip);
    }
    if (items.length > limit) {
      grid.appendChild(element('span', 'guided-sample-more', `+${items.length - limit} hasil lainnya`));
    }
    container.appendChild(grid);
  }

  function renderIllustration(problem, slideIndex) {
    const root = element('div', 'guided-slide-content');
    const title = problem.aiSolution?.visualization?.title ||
      (problem.model === 'balls' ? 'Komposisi objek' : 'Gambaran ruang sampel');
    root.appendChild(element('div', 'guided-illustration-title', title));
    addObjects(problem, slideIndex, root);
    if (problem.aiSolution?.visualization?.caption) {
      root.appendChild(element('p', 'guided-illustration-caption', problem.aiSolution.visualization.caption));
    }
    return root;
  }

  function renderContent(slide) {
    const content = element('div', 'guided-slide-copy');
    if (slide.content.type === 'list') {
      const list = element('ul', 'guided-slide-list');
      for (const item of slide.content.items) {
        list.appendChild(element('li', '', item));
      }
      content.appendChild(list);
    } else if (slide.content.type === 'result') {
      for (const [index, item] of slide.content.items.entries()) {
        content.appendChild(element('div', `guided-result-line${index === 1 ? ' primary' : ''}`, item));
      }
    } else {
      content.appendChild(element('p', 'guided-slide-quote', slide.content.text));
    }
    return content;
  }

  function updateStep() {
    if (!currentProblem) return;
    const steps = getSlides(currentProblem);
    const step = steps[currentStep];
    const stepNumber = currentStep + 1;
    const progress = Math.round(stepNumber / steps.length * 100);

    ui.count.textContent = `LANGKAH ${stepNumber} DARI ${steps.length}`;
    ui.percent.textContent = `${progress}%`;
    ui.bar.style.width = `${progress}%`;
    ui.title.textContent = step.title;
    ui.description.textContent = step.description;
    ui.math.textContent = step.math;
    ui.note.textContent = step.note;
    ui.caption.textContent = step.caption;
    ui.previous.disabled = currentStep === 0;
    ui.next.disabled = currentStep === steps.length - 1;
    ui.final.classList.toggle('visible', currentStep === steps.length - 1);
    ui.host.replaceChildren(renderIllustration(currentProblem, currentStep), renderContent(step));
  }

  function stopAutoPlay() {
    if (autoPlayTimer !== null) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    ui.play.textContent = '▶ Putar otomatis';
  }

  function goNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      currentStep += 1;
      updateStep();
    } else {
      stopAutoPlay();
    }
  }

  function goPrevious() {
    if (currentStep > 0) {
      currentStep -= 1;
      updateStep();
    }
    stopAutoPlay();
  }

  function toggleAutoPlay() {
    if (autoPlayTimer !== null) {
      stopAutoPlay();
      return;
    }
    if (currentStep >= TOTAL_STEPS - 1) {
      currentStep = 0;
      updateStep();
    }
    ui.play.textContent = 'Ⅱ Jeda';
    autoPlayTimer = setInterval(() => {
      if (currentStep >= TOTAL_STEPS - 1) {
        stopAutoPlay();
        return;
      }
      goNext();
    }, 3500);
  }

  function loadProblem(problem) {
    stopAutoPlay();
    currentProblem = problem;
    currentStep = 0;
    ui.final.classList.remove('visible');
    updateStep();
  }

  ui.previous.addEventListener('click', goPrevious);
  ui.next.addEventListener('click', () => {
    stopAutoPlay();
    goNext();
  });
  ui.play.addEventListener('click', toggleAutoPlay);
  window.addEventListener('probability:solution-ready', (event) => {
    loadProblem(event.detail);
  });
  window.addEventListener('pagehide', () => {
    stopAutoPlay();
  }, { once: true });
}
