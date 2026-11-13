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
    eventType: 'even',
    target: null,
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
