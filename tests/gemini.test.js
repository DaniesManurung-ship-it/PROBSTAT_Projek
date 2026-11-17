import test from 'node:test';
import assert from 'node:assert/strict';
import { createGeminiInterpreter, responseSchema } from '../server/gemini.js';
import { toCanonicalProblem } from '../src/features/solver/interpretation-contract.js';

function validDiceResponse() {
  return {
    status: 'success',
    category: 'dice',
    confidence: 0.95,
    diceCount: 1,
    sidesPerDie: 6,
    trialCount: null,
    eventType: 'even',
    target: null,
    successProbability: null,
    coinSide: 'unknown',
    cardEvent: 'unknown',
    ballCounts: null,
    ballTarget: 'unknown',
    drawCount: null,
    replacement: 'not_applicable',
    countingType: 'not_applicable',
    n: null,
    r: null,
    population: null,
    mathCount: null,
    physicsCount: null,
    bothCount: null,
    conditionalEvent: 'unknown',
    missingInformation: [],
    clarification: '',
    interpretation: 'Peluang mendapatkan angka genap pada sebuah dadu.'
  };
}

function mockClient(response) {
  const calls = [];
  const options = [];
  const responses = Array.isArray(response) ? response : [response];
  let responseIndex = 0;
  return {
    calls,
    options,
    client: {
      interactions: {
        create: async (request, requestOptions) => {
          calls.push(request);
          options.push(requestOptions);
          const current = responses[Math.min(responseIndex, responses.length - 1)];
          responseIndex += 1;
          if (current instanceof Error) throw current;
          return {
            output_text: typeof current === 'string' ? current : JSON.stringify(current)
          };
        }
      }
    }
  };
}

test('sends a structured-output request and validates the model response', async () => {
  const mock = mockClient(validDiceResponse());
  const interpret = createGeminiInterpreter({ client: mock.client, model: 'mock-model' });
  const result = await interpret('Berapa peluang dadu menunjukkan bilangan genap?');

  assert.equal(result.status, 'success');
  assert.equal(mock.calls[0].model, 'mock-model');
  assert.equal(mock.calls[0].response_format.mime_type, 'application/json');
  assert.equal(mock.calls[0].response_format.schema.type, 'object');
  assert.equal(mock.calls[0].store, false);
  assert.equal(mock.calls[0].automatic_continuation, false);
  assert.ok(mock.options[0].timeout_ms > 0 && mock.options[0].timeout_ms <= 15000);
  assert.deepEqual(mock.options[0].retries, { strategy: 'none' });
  assert.equal(responseSchema.properties.category.type, 'string');
});

test('retries only temporary 503 failures with bounded exponential backoff and one total deadline', async () => {
  const unavailable = () => {
    const error = new Error('test-api-key-secret: upstream unavailable');
    error.name = 'InternalServerError';
    error.status = 503;
    error.error = {
      code: 503,
      status: 'UNAVAILABLE',
      message: 'test-api-key-secret: upstream unavailable'
    };
    return error;
  };
  const mock = mockClient([unavailable(), unavailable(), validDiceResponse()]);
  const delays = [];
  const logs = [];
  let clock = 100;
  const interpret = createGeminiInterpreter({
    client: mock.client,
    model: 'gemini-test',
    apiKey: 'test-api-key-secret',
    timeoutMs: 5000,
    sleep: async (delay) => {
      delays.push(delay);
      clock += delay;
    },
    now: () => clock,
    logger: (event) => logs.push(event)
  });

  const result = await interpret('soal dadu');

  assert.equal(result.status, 'success');
  assert.equal(mock.calls.length, 3);
  assert.deepEqual(delays, [250, 500]);
  assert.ok(mock.options.every((option) => option.timeout_ms > 0 && option.timeout_ms <= 5000));
  assert.equal(mock.calls.every((call) => call.model === 'gemini-test'), true);
  assert.equal(logs.at(-1).responseJson, true);
  assert.equal(logs.at(-1).durationMs, 750);
  assert.doesNotMatch(JSON.stringify(logs), /test-api-key-secret/);
  assert.match(JSON.stringify(logs), /UNAVAILABLE/);
});

test('does not retry authentication, permission, quota, or model errors', async () => {
  for (const [status, code, expectedMessage] of [
    [401, 'UNAUTHENTICATED', /401/],
    [403, 'PERMISSION_DENIED', /403/],
    [429, 'RESOURCE_EXHAUSTED', /Batas penggunaan/],
    [404, 'NOT_FOUND', /GEMINI_MODEL/]
  ]) {
    const providerError = new Error('provider response');
    providerError.status = status;
    providerError.error = { code: status, status: code, message: 'provider message' };
    const mock = mockClient(providerError);
    await assert.rejects(
      createGeminiInterpreter({ client: mock.client, model: 'mock-model' })('soal'),
      (error) => error.statusCode === status && expectedMessage.test(error.message)
    );
    assert.equal(mock.calls.length, 1);
  }
});

test('retries temporary connection failures but not request timeouts', async () => {
  const connection = new Error('temporary connection failure');
  connection.name = 'APIConnectionError';
  const mock = mockClient([connection, validDiceResponse()]);
  const delays = [];
  const result = await createGeminiInterpreter({
    client: mock.client,
    model: 'mock-model',
    sleep: async (delay) => delays.push(delay)
  })('soal');

  assert.equal(result.status, 'success');
  assert.equal(mock.calls.length, 2);
  assert.deepEqual(delays, [250]);
});

test('stops after the retry limit and preserves the final upstream 503', async () => {
  const unavailable = () => {
    const error = new Error('temporarily unavailable');
    error.status = 503;
    error.error = { code: 503, status: 'UNAVAILABLE', message: 'temporarily unavailable' };
    return error;
  };
  const mock = mockClient([unavailable(), unavailable(), unavailable()]);
  const delays = [];
  let clock = 0;
  await assert.rejects(
    createGeminiInterpreter({
      client: mock.client,
      model: 'gemini-test',
      timeoutMs: 5000,
      sleep: async (delay) => {
        delays.push(delay);
        clock += delay;
      },
      now: () => clock
    })('soal'),
    (error) => error.statusCode === 503 &&
      error.diagnostics.httpStatus === 503 &&
      error.diagnostics.errorCode === 'UNAVAILABLE' &&
      error.diagnostics.attempts === 3
  );
  assert.equal(mock.calls.length, 3);
  assert.deepEqual(delays, [250, 500]);
});

test('retry delays are included in the total request deadline', async () => {
  const unavailable = new Error('temporarily unavailable');
  unavailable.status = 503;
  unavailable.error = { status: 'UNAVAILABLE', message: 'temporarily unavailable' };
  const mock = mockClient([unavailable, unavailable]);
  const delays = [];
  let clock = 0;
  await assert.rejects(
    createGeminiInterpreter({
      client: mock.client,
      model: 'gemini-test',
      timeoutMs: 700,
      sleep: async (delay) => {
        delays.push(delay);
        clock += delay;
      },
      now: () => clock
    })('soal'),
    (error) => error.statusCode === 503 && error.diagnostics.attempts === 2
  );
  assert.equal(mock.calls.length, 2);
  assert.deepEqual(delays, [250]);
  assert.equal(mock.options[1].timeout_ms, 450);
});

test('maps quota and timeout failures to safe service errors', async () => {
  const quota = new Error('provider details must not reach the user');
  quota.status = 429;
  const quotaMock = mockClient(quota);
  await assert.rejects(
    createGeminiInterpreter({ client: quotaMock.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 429 && /Batas penggunaan/.test(error.message)
  );

  const timeout = new Error('request timeout');
  timeout.name = 'APIConnectionTimeoutError';
  const timeoutMock = mockClient(timeout);
  await assert.rejects(
    createGeminiInterpreter({ client: timeoutMock.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 504 && /melewati batas waktu/.test(error.message)
  );
  assert.equal(timeoutMock.calls.length, 1);

  const gatewayTimeout = new Error('upstream request timed out');
  gatewayTimeout.status = 504;
  const gatewayMock = mockClient(gatewayTimeout);
  await assert.rejects(
    createGeminiInterpreter({ client: gatewayMock.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 504 && /melewati batas waktu/.test(error.message)
  );
});

test('rejects malformed or schema-invalid model responses', async () => {
  const malformed = mockClient('{not json');
  await assert.rejects(
    createGeminiInterpreter({ client: malformed.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 502 && /tidak valid/.test(error.message)
  );

  const invalid = mockClient({ ...validDiceResponse(), unexpected: true });
  await assert.rejects(
    createGeminiInterpreter({ client: invalid.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 502
  );
});

test('preserves confirmation status and passes prior interpretation with corrections', async () => {
  const proposed = validDiceResponse();
  proposed.status = 'needs_confirmation';
  proposed.diceCount = 2;
  proposed.eventType = 'sum_equals';
  proposed.target = 12;
  proposed.interpretation =
    'Dua buah dadu bersisi enam dilempar bersamaan; peluang jumlah mata keduanya sama dengan 12.';
  const mock = mockClient(proposed);
  const interpret = createGeminiInterpreter({ client: mock.client, model: 'mock-model' });
  const result = await interpret('2 dadu dilempar bersamaan berapa peluang angka 12?', {
    previousInterpretation: proposed,
    correction: 'Maksud saya jumlah kedua mata dadu.'
  });

  assert.equal(result.status, 'needs_confirmation');
  const request = JSON.parse(mock.calls[0].input);
  assert.equal(request.question, '2 dadu dilempar bersamaan berapa peluang angka 12?');
  assert.equal(request.userCorrection, 'Maksud saya jumlah kedua mata dadu.');
  assert.equal(request.previousInterpretation.eventType, 'sum_equals');
  assert.match(mock.calls[0].system_instruction, /status=needs_confirmation/);
});

test('sends Indonesian paraphrases to the semantic interpreter without local keyword rewriting', async () => {
  const proposed = validDiceResponse();
  proposed.status = 'needs_confirmation';
  proposed.diceCount = 2;
  proposed.eventType = 'sum_equals';
  proposed.target = 12;
  const mock = mockClient(proposed);
  const interpret = createGeminiInterpreter({ client: mock.client, model: 'mock-model' });
  const questions = [
    'Dua dadu dilempar, peluang jumlahnya 12 berapa?',
    'Kalau aku lempar dua dadu bareng, kemungkinan total 12?',
    'Berapa probabilitas hasil penjumlahan dua dadu sama dengan 12?',
    'Aku melempar sepasang dadu. Berapa kesempatan mendapatkan total dua belas?'
  ];

  for (const question of questions) {
    const result = await interpret(question);
    assert.equal(result.eventType, 'sum_equals');
    assert.equal(result.target, 12);
    assert.equal(result.status, 'needs_confirmation');
  }
  assert.deepEqual(mock.calls.map((call) => JSON.parse(call.input).question), questions);
});

test('interprets a complete simultaneous ball draw without requesting redundant details', async () => {
  const proposed = {
    ...validDiceResponse(),
    status: 'success',
    category: 'balls',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'same_color_draw',
    ballCounts: { merah: 4, biru: 5, kuning: 0 },
    ballTarget: 'merah',
    drawCount: 2,
    replacement: 'without',
    interpretation: 'Dua bola merah diambil sekaligus dari 4 bola merah dan 5 bola biru.'
  };
  const mock = mockClient(proposed);
  const interpret = createGeminiInterpreter({ client: mock.client, model: 'mock-model' });
  const question =
    'Sebuah kantong berisi 4 bola merah dan 5 bola biru. Diambil 2 bola sekaligus secara acak. Peluang terambilnya kedua bola berwarna merah adalah';
  const result = await interpret(question);

  assert.equal(result.status, 'success');
  assert.deepEqual(result.ballCounts, { merah: 4, biru: 5, kuning: 0 });
  assert.equal(result.replacement, 'without');
  assert.match(toCanonicalProblem(result), /dua bola merah tanpa pengembalian/);
  assert.match(mock.calls[0].system_instruction, /warna yang tidak disebut sebagai 0/);
  assert.match(mock.calls[0].system_instruction, /"sekaligus".*tanpa pengembalian/);
});

test('translates a three-dice sum into the local solver schema', async () => {
  const proposed = {
    ...validDiceResponse(),
    diceCount: 3,
    eventType: 'sum_equals',
    target: 7,
    interpretation: 'Tiga dadu dilempar bersamaan dan jumlah mata dadu adalah 7.'
  };
  const mock = mockClient(proposed);
  const interpret = createGeminiInterpreter({ client: mock.client, model: 'mock-model' });
  const result = await interpret('tiga dadu dilempar bersamaan, brp peluang dapat 7');

  assert.equal(result.status, 'success');
  assert.equal(result.diceCount, 3);
  assert.equal(result.eventType, 'sum_equals');
  assert.equal(result.target, 7);
  assert.match(mock.calls[0].system_instruction, /tiga dadu dilempar bersamaan, brp peluang dapat 7/);
});

test('translates exact binomial parameters for local calculation', async () => {
  const proposed = {
    ...validDiceResponse(),
    status: 'success',
    category: 'binomial',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'binomial_exact',
    target: 3,
    successProbability: 0.6,
    n: 5,
    interpretation: 'Tepat 3 sukses dari 5 percobaan dengan p=3/5.'
  };
  const mock = mockClient(proposed);
  const result = await createGeminiInterpreter({
    client: mock.client,
    model: 'mock-model'
  })('Peluang sukses 3 dari 5 percobaan jika p=3/5?');

  assert.equal(result.category, 'binomial');
  assert.equal(result.target, 3);
  assert.equal(result.successProbability, 0.6);
  assert.equal(responseSchema.properties.successProbability.type, 'number');
  assert.match(mock.calls[0].system_instruction, /P\(X=k\)=C\(n,k\)p\^k/);
});

test('translates a factor-of-six event instead of asking for a die face', async () => {
  const proposed = {
    ...validDiceResponse(),
    eventType: 'factor_of',
    target: 6,
    interpretation: 'Mata dadu yang merupakan faktor positif dari 6.'
  };
  const mock = mockClient(proposed);
  const interpret = createGeminiInterpreter({
    client: mock.client,
    model: 'mock-model'
  });
  const questions = [
    'Peluang muncul mata dadu yang merupakan faktor dari 6?',
    'Peluang mata dadu yang merupakan bilangan faktor dari 6?',
    'Peluang dadu menunjukkan faktor-faktor 6?',
    'Peluang mata dadu menjadi pembagi 6?',
    'Peluang muncul angka yang membagi 6 tanpa sisa?'
  ];

  for (const question of questions) {
    const result = await interpret(question);
    assert.equal(result.status, 'success');
    assert.equal(result.eventType, 'factor_of');
    assert.equal(result.target, 6);
  }
  assert.equal(mock.calls.length, questions.length);
  assert.match(mock.calls[0].system_instruction, /bilangan faktor dari X/);
});

test('allows Gemini to solve supported probability questions not modeled locally', async () => {
  const proposed = {
    ...validDiceResponse(),
    status: 'ai_solved',
    category: 'out_of_scope',
    eventType: 'unknown',
    solution: {
      formula: 'P(A) = |A| / |S|',
      answer: '1/2',
      steps: ['Ruang sampel berisi dua hasil yang sama mungkin.', 'Satu hasil memenuhi kejadian.']
    },
    interpretation: 'Peluang kejadian A adalah setengah.'
  };
  const mock = mockClient(proposed);
  const result = await createGeminiInterpreter({
    client: mock.client,
    model: 'mock-model'
  })('Soal probabilitas lain yang belum didukung mesin lokal.');

  assert.equal(result.status, 'ai_solved');
  assert.equal(result.solution.answer, '1/2');
  assert.match(mock.calls[0].system_instruction, /jangan menolaknya/);
});

test('solves a complete marble problem with a color outside the local schema', async () => {
  const proposed = {
    ...validDiceResponse(),
    status: 'ai_solved',
    category: 'out_of_scope',
    eventType: 'unknown',
    ballCounts: null,
    ballTarget: 'unknown',
    solution: {
      formula: 'P(merah) = jumlah kelereng merah / jumlah seluruh kelereng',
      answer: '3/12 = 1/4 = 25%',
      steps: [
        'Jumlah seluruh kelereng adalah 5 + 3 + 4 = 12.',
        'Ada 3 kelereng merah, jadi peluang mengambil kelereng merah adalah 3/12 = 1/4 = 25%.'
      ]
    },
    interpretation: 'Mengambil satu kelereng secara acak dari 5 biru, 3 merah, dan 4 hijau.'
  };
  const mock = mockClient(proposed);
  const result = await createGeminiInterpreter({
    client: mock.client,
    model: 'mock-model'
  })('Ada 5 kelereng biru, 3 merah, dan 4 hijau. Berapa peluang mengambil kelereng merah?');

  assert.equal(result.status, 'ai_solved');
  assert.equal(result.solution.answer, '3/12 = 1/4 = 25%');
  assert.match(mock.calls[0].system_instruction, /hijau boleh dipetakan ke slot warna lokal yang belum dipakai/);
  assert.match(mock.calls[0].system_instruction, /objek\/kejadian tidak dapat direpresentasikan/);
});

test('accepts text output blocks and rejects an empty interaction response', async () => {
  const expected = JSON.stringify(validDiceResponse());
  const blockClient = {
    interactions: {
      create: async () => ({ output: [{ content: [{ type: 'text', text: expected }] }] })
    }
  };
  const result = await createGeminiInterpreter({ client: blockClient, model: 'mock-model' })('soal');
  assert.equal(result.status, 'success');

  const emptyClient = { interactions: { create: async () => ({ output: [] }) } };
  await assert.rejects(
    createGeminiInterpreter({ client: emptyClient, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 502 && /kosong/.test(error.message)
  );
});
