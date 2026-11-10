
import { createQuizQuestions } from './question-bank.js';

/* =============================================
   PROBABILITY 3D
   QUIZ & EVALUATION SYSTEM
============================================= */

const $ = (id) => document.getElementById(id);

const STORAGE = {
  used: 'p3d_quiz_used_questions_v1',
  history: 'p3d_quiz_history_v1'
};

const SESSION_SIZE = 10;
const CHALLENGE_SECONDS = 15 * 60;

const ui = {
  setup: $('quiz-setup'),
  category: $('quiz-category'),
  difficulty: $('quiz-difficulty'),
  mode: $('quiz-mode'),
  start: $('quiz-start'),

  session: $('quiz-session'),
  number: $('quiz-number'),
  progress: $('quiz-progress'),
  progressText: $('quiz-progress-text'),
  timer: $('quiz-timer'),
  modeLabel: $('quiz-mode-label'),

  question: $('quiz-question'),
  type: $('quiz-type'),
  answerArea: $('quiz-answer-area'),

  previous: $('quiz-previous'),
  check: $('quiz-check'),
  next: $('quiz-next'),

  feedback: $('quiz-feedback'),

  results: $('quiz-results')
};

if (Object.values(ui).every(Boolean)) {

  let session = null;
  let timerInterval = null;

  /* ======================================
     MODE DESCRIPTION
  ====================================== */

  const modeDescription = $('quiz-mode-description');

  function updateModeDescription() {
    if (!modeDescription) return;

    modeDescription.textContent = ui.mode.value === 'learning'
      ? 'Learning Mode: tanpa batas waktu. Setiap jawaban akan langsung diperiksa, dilengkapi pembahasan rumus dan penjelasan penyelesaian.'
      : 'Challenge Mode: 15 menit untuk 10 soal. Pembahasan dan jawaban benar hanya ditampilkan setelah sesi selesai atau waktu habis.';
  }

  ui.mode.addEventListener('change', updateModeDescription);
  updateModeDescription();

  /* ======================================
     STORAGE HELPERS
  ====================================== */

  function readStorage(key, fallback = []) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || 'null'
      );

      return Array.isArray(value) ? value : fallback;

    } catch (error) {
      console.warn('Quiz storage could not be read:', error);

      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    } catch (error) {
      console.error('Quiz storage could not be saved:', error);

      return false;
    }
  }

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]
    );
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const remaining = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  }

  /* ======================================
     ANSWER DISPLAY
  ====================================== */

  function getSelectedDisplay(question, answer) {

    if (answer === null || answer === undefined || answer === '') {
      return 'Belum dijawab';
    }

    if (question.type === 'mcq') {
      return question.options.find(
        item => item.id === answer
      )?.text || 'Belum dijawab';
    }

    if (question.type === 'numeric') {
      return `${answer}`;
    }

    if (question.type === 'multi') {
      if (!Array.isArray(answer)) return 'Belum dijawab';
      return question.options
        .filter(item => answer.includes(item.id))
        .map(item => item.text)
        .join(', ') || 'Belum dijawab';
    }

    if (question.type === 'ordering') {
      if (!Array.isArray(answer)) return 'Belum dijawab';
      return answer.map((id, index) => {
        const item = question.orderOptions.find(
          option => option.id === id
        );

        return `${index + 1}. ${item?.text || ''}`;
      }).join(' | ');
    }

    return 'Belum dijawab';
  }

  function getCorrectDisplay(question) {

    if (question.type === 'mcq') {
      return question.options.find(
        item => item.id === question.correctOptionId
      )?.text || question.answerDisplay;
    }

    if (question.type === 'numeric') {
      return question.answerDisplay;
    }

    if (question.type === 'multi') {
      return question.options
        .filter(item => question.correctIds.includes(item.id))
        .map(item => item.text)
        .join(', ');
    }

    if (question.type === 'ordering') {
      return question.correctOrder.map((id, index) => {
        const item = question.orderOptions.find(
          option => option.id === id
        );

        return `${index + 1}. ${item?.text || ''}`;
      }).join(' | ');
    }

    return question.answerDisplay;
  }

  /* ======================================
     GENERATE ANSWER INPUT
  ====================================== */

  function renderAnswerInput(question) {

    if (question.type === 'mcq') {

      return `
        <div class="quiz-options">

          ${question.options.map((option, index) => `
            <label class="quiz-option">

              <input
                type="radio"
                name="quiz-answer"
                value="${escapeHTML(option.id)}">

              <span class="quiz-option-letter">
                ${String.fromCharCode(65 + index)}
              </span>

              <span>
                ${escapeHTML(option.text)}
              </span>

            </label>
          `).join('')}

        </div>
      `;
    }

    if (question.type === 'numeric') {

      return `
        <div class="quiz-numeric-answer">

          <label for="quiz-numeric-input">
            Jawaban kamu
          </label>

          <input
            type="text"
            id="quiz-numeric-input"
            inputmode="decimal"
            autocomplete="off"
            placeholder="Masukkan jawaban">

          <small>
            ${escapeHTML(question.inputHelp)}
          </small>

        </div>
      `;
    }

    if (question.type === 'multi') {

      return `
        <div class="quiz-multi-heading">
          Pilih semua jawaban yang benar.
        </div>

        <div class="quiz-options">

          ${question.options.map((option, index) => `
            <label class="quiz-option">

              <input
                type="checkbox"
                name="quiz-multi-answer"
                value="${escapeHTML(option.id)}">

              <span class="quiz-option-letter">
                ${String.fromCharCode(65 + index)}
              </span>

              <span>
                ${escapeHTML(option.text)}
              </span>

            </label>
          `).join('')}

        </div>
      `;
    }

    if (question.type === 'ordering') {

      return `
        <div class="quiz-ordering">

          ${question.correctOrder.map((correctId, index) => {

            const options = question.orderOptions;

            return `
              <label class="quiz-order-row">

                <span>${index + 1}</span>

                <select
                  class="quiz-order-select"
                  data-order-position="${index}">

                  <option value="" selected>
                    Pilih langkah ke-${index + 1}
                  </option>

                  ${options.map(option => `
                    <option value="${escapeHTML(option.id)}">
                      ${escapeHTML(option.text)}
                    </option>
                  `).join('')}

                </select>

              </label>
            `;
          }).join('')}

        </div>
      `;
    }

    return '<p>Format jawaban belum tersedia.</p>';
  }

  /* ======================================
     COLLECT ANSWER
  ====================================== */

  function collectAnswer(question) {

    if (question.type === 'mcq') {

      return ui.answerArea.querySelector(
        'input[name="quiz-answer"]:checked'
      )?.value ?? null;
    }

    if (question.type === 'numeric') {

      return ui.answerArea.querySelector(
        '#quiz-numeric-input'
      )?.value.trim() ?? null;
    }

    if (question.type === 'multi') {

      return Array.from(
        ui.answerArea.querySelectorAll(
          'input[name="quiz-multi-answer"]:checked'
        )
      ).map(input => input.value);
    }

    if (question.type === 'ordering') {

      return Array.from(
        ui.answerArea.querySelectorAll(
          '.quiz-order-select'
        )
      ).map(input => input.value);
    }

    return null;
  }

  /* ======================================
     ORDERING HELPERS
  ====================================== */

  // Mencegah satu langkah dipilih pada lebih dari satu posisi.
  function updateOrderingAvailability() {
    const selects = Array.from(
      ui.answerArea.querySelectorAll('.quiz-order-select')
    );

    const selectedValues = selects
      .map(select => select.value)
      .filter(Boolean);

    selects.forEach(select => {
      const currentValue = select.value;

      Array.from(select.options).forEach(option => {
        if (!option.value) {
          option.disabled = false;
          return;
        }

        option.disabled =
          option.value !== currentValue &&
          selectedValues.includes(option.value);
      });
    });
  }

  function bindOrderingSelects() {
    const selects = ui.answerArea.querySelectorAll(
      '.quiz-order-select'
    );

    selects.forEach(select => {
      select.addEventListener('change', updateOrderingAvailability);
    });

    updateOrderingAvailability();
  }

  function getAnswerValidationMessage(question, answer) {
    if (question.type === 'mcq' && !answer) {
      return 'Silakan pilih salah satu jawaban terlebih dahulu.';
    }

    if (question.type === 'numeric' && !String(answer ?? '').trim()) {
      return 'Silakan isi jawaban numerik terlebih dahulu.';
    }

    if (question.type === 'multi' && (!Array.isArray(answer) || answer.length === 0)) {
      return 'Silakan pilih minimal satu jawaban.';
    }

    if (question.type === 'ordering') {
      if (!Array.isArray(answer) || answer.length !== question.correctOrder.length) {
        return 'Silakan isi seluruh urutan langkah terlebih dahulu.';
      }

      if (answer.some(value => !value)) {
        return 'Masih ada urutan langkah yang belum dipilih.';
      }

      if (new Set(answer).size !== answer.length) {
        return 'Setiap langkah hanya boleh digunakan satu kali. Pilih langkah yang berbeda pada setiap posisi.';
      }

      const validIds = new Set(
        question.orderOptions.map(option => option.id)
      );

      if (answer.some(value => !validIds.has(value))) {
        return 'Ada pilihan langkah yang tidak valid. Silakan pilih ulang.';
      }
    }

    return '';
  }

  function isAnswerUnanswered(question, answer) {
    if (answer === null || answer === undefined) return true;

    if (question.type === 'numeric') {
      return !String(answer).trim();
    }

    if (question.type === 'multi') {
      return !Array.isArray(answer) || answer.length === 0;
    }

    if (question.type === 'ordering') {
      return !Array.isArray(answer) || answer.length === 0 ||
        answer.every(value => !value);
    }

    return answer === '';
  }

  /* ======================================
     CHECK NUMERIC ANSWER
  ====================================== */

  function parseNumericAnswer(value, question) {

    if (typeof value !== 'string') return NaN;

    const clean = value
      .trim()
      .replace(/%/g, '')
      .replace(',', '.');

    if (!clean) return NaN;

    if (/^-?\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(clean)) {

      const [numerator, denominator] = clean
        .split('/')
        .map(Number);

      if (denominator === 0) return NaN;

      const result = numerator / denominator;

      return question.kind === 'probability'
        ? result * 100
        : result;
    }

    const result = Number(clean);

    if (!Number.isFinite(result)) return NaN;

    return result;
  }

  /* ======================================
     EVALUATE ANSWER
  ====================================== */

  function evaluateAnswer(question, answer) {

    if (answer === null || answer === undefined) {
      return false;
    }

    if (question.type === 'mcq') {

      return answer === question.correctOptionId;
    }

    if (question.type === 'numeric') {

      const value = parseNumericAnswer(
        answer,
        question
      );

      if (!Number.isFinite(value)) return false;

      return question.kind === 'probability'
        ? Math.abs(value - question.answerNumeric) < 0.025
        : Math.abs(value - question.answerNumeric) < 1e-9;
    }

    if (question.type === 'multi') {

      if (!Array.isArray(answer)) return false;

      const actual = [...answer].sort();
      const correct = [...question.correctIds].sort();

      return actual.length === correct.length &&
        actual.every((item, index) => item === correct[index]);
    }

    if (question.type === 'ordering') {
      if (!Array.isArray(answer)) return false;
      if (answer.length !== question.correctOrder.length) return false;
      if (answer.some(item => !item)) return false;
      if (new Set(answer).size !== answer.length) return false;

      return answer.every(
        (item, index) => item === question.correctOrder[index]
      );
    }

    return false;
  }

  /* ======================================
     EXPLANATION DISPLAY
  ====================================== */

  function buildExplanation(question, answer) {

    const isCorrect = evaluateAnswer(
      question,
      answer
    );

    const title = isCorrect
      ? 'Hebat! Jawaban kamu benar.'
      : 'Jawaban kamu belum tepat. Mari kita pelajari.';

    const solverButton = question.solverPrompt
      ? `
        <button
          type="button"
          class="quiz-open-solver"
          data-open-solver>
          ↗ Lihat pembahasan melalui visualisasi 3D
        </button>
      `
      : '';

    return `
      <div class="quiz-feedback-card ${isCorrect ? 'correct' : 'incorrect'}">

        <div class="quiz-feedback-header">

          <strong>
            ${isCorrect ? '✓' : '✕'}
            ${title}
          </strong>

        </div>

        <div class="quiz-feedback-answer">

          <span>Jawaban kamu</span>

          <p>
            ${escapeHTML(
              getSelectedDisplay(question, answer)
            )}
          </p>

          <span>Jawaban yang benar</span>

          <p class="quiz-correct-answer">
            ${escapeHTML(getCorrectDisplay(question))}
          </p>

        </div>

        <div class="quiz-explanation-content">

          <h4>Mengapa jawaban tersebut benar?</h4>

          <ol>
            ${question.steps.map(step => `
              <li>${escapeHTML(step)}</li>
            `).join('')}
          </ol>

        </div>

        <div class="quiz-explanation-summary">
          <strong>Kesimpulan</strong>

          <p>${escapeHTML(question.answerDisplay)}</p>

        </div>

        ${solverButton}

      </div>
    `;
  }

  /* ======================================
     RENDER QUESTION
  ====================================== */

  function renderQuestion() {

    const question = session.questions[session.index];

    const index = session.index;

    const total = session.questions.length;

    const percentage =
      (index + 1) / total * 100;

    ui.number.textContent =
      `SOAL ${index + 1} DARI ${total}`;

    ui.progressText.textContent =
      `${Math.round(percentage)}%`;

    ui.progress.style.width =
      `${percentage}%`;

    ui.question.textContent =
      question.question;

    const typeLabels = {
      mcq: 'Pilihan ganda',
      numeric: 'Jawaban numerik',
      multi: 'Pilih lebih dari satu',
      ordering: 'Urutkan langkah'
    };

    ui.type.textContent =
      typeLabels[question.type];

    ui.previous.disabled = index === 0;

    ui.answerArea.innerHTML =
      renderAnswerInput(question);

    // Pulihkan jawaban sebelumnya.
    const previousAnswer = session.answers[index];
    restoreAnswer(question, previousAnswer);

    if (question.type === 'ordering') {
      bindOrderingSelects();
    }

    const alreadyChecked =
      session.checked[index];

    ui.feedback.hidden =
      !alreadyChecked;

    if (alreadyChecked) {

      ui.feedback.innerHTML =
        buildExplanation(question, previousAnswer);
    } else {
      ui.feedback.innerHTML = '';
    }

    if (session.mode === 'learning') {

      ui.check.hidden = alreadyChecked;

      ui.next.hidden = false;

      ui.next.disabled = !alreadyChecked;

      ui.next.textContent =
        index === total - 1
          ? 'Selesaikan pembelajaran'
          : 'Soal berikutnya →';

      setInputDisabled(alreadyChecked);

    } else {

      ui.check.hidden = true;

      ui.next.hidden = false;
      ui.next.disabled = false;

      ui.next.textContent =
        index === total - 1
          ? 'Kumpulkan jawaban'
          : 'Simpan & berikutnya →';
    }

    bindSolverButtons();
  }

  function restoreAnswer(question, answer) {

    if (
      answer === null ||
      answer === undefined
    ) return;

    if (question.type === 'mcq') {

      const input = ui.answerArea.querySelector(
        `input[value="${CSS.escape(answer)}"]`
      );

      if (input) input.checked = true;
    }

    if (question.type === 'numeric') {

      const input = ui.answerArea.querySelector(
        '#quiz-numeric-input'
      );

      if (input) input.value = answer;
    }

    if (question.type === 'multi' && Array.isArray(answer)) {

      answer.forEach(id => {

        const input = ui.answerArea.querySelector(
          `input[value="${CSS.escape(id)}"]`
        );

        if (input) input.checked = true;
      });
    }

    if (question.type === 'ordering' && Array.isArray(answer)) {

      answer.forEach((id, index) => {

        const input = ui.answerArea.querySelector(
          `[data-order-position="${index}"]`
        );

        if (input) input.value = id;
      });
    }
  }

  function setInputDisabled(disabled) {

    ui.answerArea.querySelectorAll(
      'input, select'
    ).forEach(input => {
      input.disabled = disabled;
    });
  }

  /* ======================================
     CHECK CURRENT ANSWER
  ====================================== */

  function checkCurrentAnswer() {

    const question =
      session.questions[session.index];

    const answer = collectAnswer(question);

    const validationMessage =
      getAnswerValidationMessage(question, answer);

    if (validationMessage) {
      ui.feedback.hidden = false;
      ui.feedback.innerHTML = `
        <div class="quiz-feedback-card incorrect">
          ${escapeHTML(validationMessage)}
        </div>
      `;
      return;
    }

    session.answers[session.index] = answer;

    session.checked[session.index] = true;

    ui.feedback.hidden = false;

    ui.feedback.innerHTML =
      buildExplanation(question, answer);

    setInputDisabled(true);

    ui.check.hidden = true;

    ui.next.disabled = false;

    ui.next.textContent =
      session.index === session.questions.length - 1
        ? 'Selesaikan pembelajaran'
        : 'Soal berikutnya →';

    bindSolverButtons();
  }

  /* ======================================
     TIMER
  ====================================== */

  function startTimer() {

    stopTimer();

    if (session.mode !== 'challenge') return;

    session.remainingSeconds =
      CHALLENGE_SECONDS;

    updateTimerDisplay();

    timerInterval = setInterval(() => {

      session.remainingSeconds--;

      updateTimerDisplay();

      if (session.remainingSeconds <= 0) {
        finishSession(true);
      }

    }, 1000);
  }

  function stopTimer() {

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {

    ui.timer.textContent =
      formatTime(session.remainingSeconds);

    ui.timer.classList.toggle(
      'warning',
      session.remainingSeconds <= 60
    );
  }

  /* ======================================
     SAVE ANSWERS & NAVIGATION
  ====================================== */

  function saveCurrentAnswer() {

    const question =
      session.questions[session.index];

    session.answers[session.index] =
      collectAnswer(question);
  }

  function nextQuestion() {

    if (session.mode === 'learning') {

      if (!session.checked[session.index]) return;

    } else {

      saveCurrentAnswer();
    }

    if (
      session.index ===
      session.questions.length - 1
    ) {

      finishSession(false);

      return;
    }

    session.index++;

    renderQuestion();
  }

  function previousQuestion() {

    if (
      session.mode !== 'challenge' ||
      session.index === 0
    ) return;

    saveCurrentAnswer();

    session.index--;

    renderQuestion();
  }

  /* ======================================
     START SESSION
  ====================================== */

  function startSession() {

    const category = ui.category.value;
    const difficulty = ui.difficulty.value;
    const mode = ui.mode.value;

    const usedIds = readStorage(STORAGE.used);

    const generated = createQuizQuestions(
      category,
      difficulty,
      SESSION_SIZE,
      usedIds
    );

    if (!generated.questions.length) {
      alert('Belum ada soal yang tersedia untuk kategori ini.');
      return;
    }

    if (generated.questions.length < SESSION_SIZE) {
      alert(
        `Saat ini hanya tersedia ${generated.questions.length} soal unik untuk pilihan ini. Sesi tetap dimulai dengan jumlah soal yang tersedia.`
      );
    }

    session = {
      questions: generated.questions,

      category,
      difficulty,
      mode,

      index: 0,

      answers: Array(generated.questions.length).fill(null),

      checked: Array(generated.questions.length).fill(false),

      startedAt: Date.now(),

      remainingSeconds: CHALLENGE_SECONDS,

      wasRecycled: generated.wasRecycled
    };

    // Catat soal yang sudah digunakan.
    const updatedHistory = [
      ...usedIds,
      ...generated.questions.map(question => question.id)
    ].slice(-1000);

    const stored = writeStorage(
      STORAGE.used,
      updatedHistory
    );

    session.storageAvailable = stored;

    ui.setup.hidden = true;
    ui.results.hidden = true;
    ui.session.hidden = false;

    ui.session.dataset.mode = mode;

    ui.modeLabel.textContent =
      mode === 'learning'
        ? 'LEARNING MODE'
        : 'CHALLENGE MODE';

    ui.timer.hidden = mode !== 'challenge';

    renderQuestion();

    startTimer();

    if (generated.wasRecycled) {
      console.info(
        'Quiz: beberapa soal diambil dari variasi yang tersedia kembali.'
      );
    }
  }

  /* ======================================
     REVIEW AND EVALUATION
  ====================================== */

  function getResults() {

    const questions = session.questions;

    const answers = session.answers;

    const details = questions.map((question, index) => ({
      question,
      answer: answers[index],
      correct: evaluateAnswer(
        question,
        answers[index]
      )
    }));

    const correct = details.filter(
      item => item.correct
    ).length;
    const unanswered = details.filter(item =>
      isAnswerUnanswered(item.question, item.answer)
    ).length;

    const total = questions.length;

    const score = Math.round(
      correct / total * 100
    );

    const durationSeconds = Math.round(
      (Date.now() - session.startedAt) / 1000
    );

    const categoryScores = {};

    details.forEach(item => {

      const category = item.question.category;

      if (!categoryScores[category]) {
        categoryScores[category] = {
          total: 0,
          correct: 0
        };
      }

      categoryScores[category].total++;

      if (item.correct) {
        categoryScores[category].correct++;
      }
    });

    return {
      details,
      correct,
      wrong: total - unanswered - correct,
      unanswered,
      total,
      score,
      durationSeconds,
      categoryScores
    };
  }

  function evaluationLabel(score) {

    if (score >= 90) return 'Sangat Baik';

    if (score >= 80) return 'Baik';

    if (score >= 70) return 'Cukup';

    if (score >= 60) return 'Perlu Latihan';

    return 'Perlu Pendampingan Belajar';
  }

  function categoryLabel(category) {

    const labels = {
      dice: 'Peluang Dadu',
      coin: 'Peluang Koin',
      cards: 'Peluang Kartu',
      balls: 'Peluang Bola',
      counting: 'Permutasi & Kombinasi',
      conditional: 'Peluang Bersyarat'
    };

    return labels[category] || category;
  }

  function createRecommendation(scores) {

    const categories = Object.entries(scores)
      .map(([category, data]) => ({
        category,
        accuracy:
          data.correct / data.total * 100
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    if (!categories.length) {
      return 'Kerjakan lebih banyak soal untuk mendapatkan rekomendasi belajar.';
    }

    const weakest = categories[0];

    if (weakest.accuracy >= 80) {
      return 'Bagus! Kamu sudah menguasai seluruh kategori yang muncul pada sesi ini. Coba tingkat kesulitan yang lebih tinggi.';
    }

    return `Materi yang paling membutuhkan latihan adalah ${categoryLabel(weakest.category)}. Kami menyarankan kamu kembali ke materi tersebut dan mencoba Laboratorium 3D.`;
  }

  /* ======================================
     RENDER RESULT
  ====================================== */

  function renderResult(results, expired = false) {

    ui.setup.hidden = true;
    ui.session.hidden = true;
    ui.results.hidden = false;

    const history = readStorage(STORAGE.history);

    const record = {
      date: new Date().toISOString(),
      category: session.category,
      difficulty: session.difficulty,
      mode: session.mode,
      score: results.score,
      correct: results.correct,
      total: results.total,
      durationSeconds: results.durationSeconds
    };

    writeStorage(
      STORAGE.history,
      [record, ...history].slice(0, 50)
    );

    const categoryHTML = Object.entries(
      results.categoryScores
    ).map(([category, data]) => {

      const rate =
        data.correct / data.total * 100;

      return `
        <div class="quiz-category-result">

          <div>
            <span>${categoryLabel(category)}</span>

            <strong>${Math.round(rate)}%</strong>
          </div>

          <div class="quiz-result-track">
            <i style="width:${rate}%"></i>
          </div>

        </div>
      `;
    }).join('');

    const reviewHTML = results.details.map(
      (item, index) => {

        const question = item.question;

        const correctAnswer =
          escapeHTML(getCorrectDisplay(question));

        const selectedAnswer =
          escapeHTML(
            getSelectedDisplay(
              question,
              item.answer
            )
          );

        const solverButton = question.solverPrompt
          ? `
            <button
              type="button"
              class="quiz-open-solver"
              data-review-solver="${index}">
              Buka visualisasi 3D
            </button>
          `
          : '';

        return `
          <article class="quiz-review-card">

            <div class="quiz-review-title">

              <strong>Soal ${index + 1}</strong>

              <span class="${item.correct ? 'correct-text' : 'incorrect-text'}">
                ${item.correct ? 'Benar' : 'Belum benar'}
              </span>

            </div>

            <p class="quiz-review-question">
              ${escapeHTML(question.question)}
            </p>

            <div class="quiz-review-answer">

              <span>Jawaban kamu</span>
              <p>${selectedAnswer}</p>

              <span>Jawaban yang benar</span>
              <p class="correct-text">${correctAnswer}</p>

            </div>

            <details>
              <summary>Lihat pembahasan lengkap</summary>

              <ol>
                ${question.steps.map(step => `
                  <li>${escapeHTML(step)}</li>
                `).join('')}
              </ol>

              ${solverButton}

            </details>

          </article>
        `;
      }
    ).join('');

    ui.results.innerHTML = `

      <div class="quiz-result-header">

        <span class="quiz-kicker">
          QUIZ COMPLETED
        </span>

        <h2>Hasil Evaluasi Belajarmu</h2>

        <div class="quiz-score-circle">
          <strong>${results.score}</strong>
          <span>/ 100</span>
        </div>

        <h3>${evaluationLabel(results.score)}</h3>

        <p>
          ${expired
            ? 'Waktu habis. Jawaban yang sudah diisi telah dinilai.'
            : 'Sesi Quiz berhasil diselesaikan.'}
        </p>

      </div>

      <div class="quiz-result-stat-grid">

        <div>
          <strong>${results.correct}</strong>
          <span>Jawaban benar</span>
        </div>

        <div>
          <strong>${results.wrong}</strong>
          <span>Jawaban salah</span>
        </div>

        <div>
          <strong>${results.unanswered}</strong>
          <span>Tidak dijawab</span>
        </div>

        <div>
          <strong>${formatTime(results.durationSeconds)}</strong>
          <span>Waktu pengerjaan</span>
        </div>

      </div>

      <section class="quiz-evaluation">

        <h3>Evaluasi per Materi</h3>

        ${categoryHTML}

        <div class="quiz-recommendation">

          <strong>Rekomendasi belajar</strong>

          <p>
            ${escapeHTML(
              createRecommendation(results.categoryScores)
            )}
          </p>

        </div>

      </section>

      <section class="quiz-review">

        <h3>Pembahasan Seluruh Soal</h3>

        ${reviewHTML}

      </section>

      <div class="quiz-result-actions">

        <button
          type="button"
          id="quiz-new-session"
          class="quiz-action-primary">

          ↻ Kerjakan Soal Baru

        </button>

        <button
          type="button"
          id="quiz-back-dashboard"
          class="quiz-action-secondary">

          Kembali ke Quiz

        </button>

      </div>

    `;

    ui.results.querySelector(
      '#quiz-new-session'
    ).addEventListener('click', startSession);

    ui.results.querySelector(
      '#quiz-back-dashboard'
    ).addEventListener('click', () => {

      ui.results.hidden = true;
      ui.session.hidden = true;
      ui.setup.hidden = false;
      ui.feedback.innerHTML = '';
      ui.feedback.hidden = true;

      session = null;
    });

    bindSolverButtons();
  }

  /* ======================================
     FINISH SESSION
  ====================================== */

  function finishSession(expired = false) {

    if (!session) return;

    if (session.mode === 'challenge') {
      // Simpan jawaban pada soal yang sedang terbuka, termasuk saat waktu habis.
      saveCurrentAnswer();
    }

    stopTimer();

    const results = getResults();

    renderResult(results, expired);
  }

  /* ======================================
     OPEN EXISTING 3D SOLVER
  ====================================== */

  function openSolver(prompt) {

    const field = $('solver-question');

    const button = $('solver-submit');

    if (!field || !button) {
      alert('AI Solver belum ditemukan di halaman ini.');
      return;
    }

    field.value = prompt;

    const target = $('ai-solver');

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    setTimeout(() => {
      button.click();
    }, 250);
  }

  function bindSolverButtons() {

    document.querySelectorAll(
      '[data-open-solver]'
    ).forEach(button => {

      button.onclick = () => {

        const question =
          session?.questions[session.index];

        if (question?.solverPrompt) {
          openSolver(question.solverPrompt);
        }
      };
    });

    ui.results.querySelectorAll(
      '[data-review-solver]'
    ).forEach(button => {

      button.onclick = () => {

        const index = Number(
          button.dataset.reviewSolver
        );

        const question =
          session?.questions[index];

        if (question?.solverPrompt) {
          openSolver(question.solverPrompt);
        }
      };
    });
  }

  /* ======================================
     EVENT LISTENERS
  ====================================== */

  ui.start.addEventListener(
    'click',
    startSession
  );

  ui.check.addEventListener(
    'click',
    checkCurrentAnswer
  );

  ui.next.addEventListener(
    'click',
    nextQuestion
  );

  ui.previous.addEventListener(
    'click',
    previousQuestion
  );

  /* ======================================
     INITIALIZATION
  ====================================== */

  ui.session.hidden = true;
  ui.results.hidden = true;

  ui.setup.hidden = false;
}
