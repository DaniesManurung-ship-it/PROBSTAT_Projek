import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApiServer } from '../server/index.js';

function successfulInterpretation() {
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
    interpretation: 'Peluang angka genap.'
  };
}

async function startServer(t, options = {}) {
  const server = createApiServer({ port: 0, ...options });
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

test('accepts a question and caches successful interpretations', async (t) => {
  let calls = 0;
  const baseUrl = await startServer(t, {
    interpret: async () => {
      calls += 1;
      return successfulInterpretation();
    }
  });

  const first = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Peluang dadu genap?' })
  });
  const firstBody = await first.json();
  assert.equal(first.status, 200);
  assert.equal(firstBody.cached, false);

  const second = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: '  PELUANG   DADU GENAP? ' })
  });
  const secondBody = await second.json();
  assert.equal(second.status, 200);
  assert.equal(secondBody.cached, true);
  assert.equal(calls, 1);
});

test('rejects invalid input and rate-limits requests', async (t) => {
  const baseUrl = await startServer(t, {
    rateLimit: 2,
    interpret: async () => successfulInterpretation()
  });

  const invalid = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: ' ' })
  });
  assert.equal(invalid.status, 400);

  const first = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Soal pertama' })
  });
  assert.equal(first.status, 200);

  const limited = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Soal kedua' })
  });
  assert.equal(limited.status, 429);
});

test('health endpoint does not expose configuration values', async (t) => {
  const baseUrl = await startServer(t, { interpret: async () => successfulInterpretation() });
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(body), ['configured']);
});

test('returns diagnostic status and forwards correction context to the interpreter', async (t) => {
  let receivedContext;
  const interpretation = successfulInterpretation();
  interpretation.status = 'needs_confirmation';
  const baseUrl = await startServer(t, {
    interpret: async (_question, context) => {
      receivedContext = context;
      return interpretation;
    }
  });

  const response = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'dua dadu angka 12',
      previousInterpretation: successfulInterpretation(),
      correction: 'Maksudnya jumlah mata kedua dadu.'
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.interpretationStatus, 'needs_confirmation');
  assert.equal(body.interpretationSource, 'gemini');
  assert.equal(body.requestStatus, 'completed');
  assert.equal(receivedContext.correction, 'Maksudnya jumlah mata kedua dadu.');
  assert.equal(receivedContext.previousInterpretation.status, 'success');
});

test('repairs a clearly stated two-ball same-color event instead of asking for it again', async (t) => {
  const interpretation = {
    ...successfulInterpretation(),
    status: 'clarification',
    category: 'balls',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'color_draw',
    ballCounts: { merah: 4, biru: 5, kuning: 0 },
    ballTarget: 'merah',
    drawCount: 2,
    replacement: 'without',
    missingInformation: ['kejadian dua bola dengan warna yang dicari'],
    clarification: 'Apa kejadian warna bola yang ditanyakan?',
    interpretation: 'Diambil dua bola dari kantong.'
  };
  const baseUrl = await startServer(t, { interpret: async () => interpretation });
  const response = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'Kantong berisi 4 bola merah dan 5 bola biru. Diambil 2 bola sekaligus. Peluang terambilnya kedua bola berwarna merah?'
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.interpretation.status, 'success');
  assert.equal(body.interpretation.eventType, 'same_color_draw');
  assert.deepEqual(body.interpretation.missingInformation, []);
  assert.equal(body.interpretation.clarification, '');
});

test('keeps a green marble target when it maps to the unused yellow slot', async (t) => {
  const interpretation = {
    ...successfulInterpretation(),
    status: 'clarification',
    category: 'balls',
    diceCount: null,
    sidesPerDie: null,
    eventType: 'color_draw',
    ballCounts: { merah: 3, biru: 5, kuning: 4 },
    ballTarget: 'kuning',
    drawCount: 2,
    replacement: 'without',
    missingInformation: ['kejadian dua bola dengan warna yang dicari'],
    clarification: 'Apa warna bola yang ditanyakan?',
    interpretation: 'Kedua kelereng hijau diambil sekaligus.'
  };
  const baseUrl = await startServer(t, { interpret: async () => interpretation });
  const response = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'Diambil 2 kelereng sekaligus. Berapa peluang kedua kelereng berwarna hijau?'
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.interpretation.status, 'success');
  assert.equal(body.interpretation.eventType, 'same_color_draw');
  assert.equal(body.interpretation.ballTarget, 'kuning');
});

test('returns valid sanitized JSON when interpretation fails', async (t) => {
  const baseUrl = await startServer(t, {
    interpret: async () => {
      const error = new Error('private provider details');
      error.statusCode = 504;
      throw error;
    }
  });
  const response = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'soal peluang' })
  });
  const body = await response.json();

  assert.equal(response.status, 504);
  assert.equal(body.requestStatus, 'timeout');
  assert.equal(body.interpretationSource, 'gemini');
  assert.doesNotMatch(JSON.stringify(body), /private provider details/);
});

test('distinguishes upstream AI unavailability from missing configuration', async (t) => {
  const baseUrl = await startServer(t, {
    interpret: async () => {
      const error = new Error('provider is temporarily unavailable');
      error.statusCode = 503;
      error.code = 'AI_UNAVAILABLE';
      throw error;
    }
  });
  const response = await fetch(`${baseUrl}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'soal peluang' })
  });
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.requestStatus, 'unavailable');
  assert.match(body.error, /sementara tidak tersedia/);
});
