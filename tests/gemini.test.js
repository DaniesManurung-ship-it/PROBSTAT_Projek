import test from 'node:test';
import assert from 'node:assert/strict';
import { createGeminiInterpreter, responseSchema } from '../server/gemini.js';

function validDiceResponse() {
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
    interpretation: 'Peluang mendapatkan angka genap pada sebuah dadu.'
  };
}

function mockClient(response) {
  const calls = [];
  return {
    calls,
    client: {
      interactions: {
        create: async (request) => {
          calls.push(request);
          if (response instanceof Error) throw response;
          return {
            output_text: typeof response === 'string' ? response : JSON.stringify(response)
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
  assert.equal(responseSchema.properties.category.type, 'string');
});

test('maps quota and timeout failures to safe service errors', async () => {
  const quota = new Error('provider details must not reach the user');
  quota.status = 429;
  const quotaMock = mockClient(quota);
  await assert.rejects(
    createGeminiInterpreter({ client: quotaMock.client, model: 'mock-model' })('soal'),
    (error) => error.statusCode === 429 && /Batas penggunaan/.test(error.message)
  );

  const timeout = new Error('timeout');
  timeout.name = 'TimeoutError';
  const timeoutMock = mockClient(timeout);
  await assert.rejects(
    createGeminiInterpreter({ client: timeoutMock.client, model: 'mock-model' })('soal'),
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
