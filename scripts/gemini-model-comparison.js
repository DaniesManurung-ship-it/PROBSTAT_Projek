import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { responseSchema } from '../server/gemini.js';
import { validateInterpretation } from '../src/features/solver/interpretation-contract.js';

const REQUEST_TIMEOUT_MS = 60_000;
const PROMPT = 'Reply with the single word: READY';
const MODELS = [
  { model: 'gemini-3.8-flash', thinkingLevel: 'low' },
  { model: 'gemini-3.5-flash-lite', thinkingLevel: 'minimal' }
];

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);

const apiKey = process.env.GEMINI_API_KEY;

function sanitize(value) {
  let text = String(value ?? '');
  if (apiKey) text = text.replaceAll(apiKey, '[REDACTED]');
  return text
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/([?&](?:key|api_key)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[REDACTED]')
    .slice(0, 500);
}

function getProviderError(error) {
  if (error?.error && typeof error.error === 'object') return error.error;
  if (typeof error?.message !== 'string') return null;

  try {
    const parsed = JSON.parse(error.message);
    return parsed?.error && typeof parsed.error === 'object' ? parsed.error : null;
  } catch {
    return null;
  }
}

function getErrorDetails(error) {
  const providerError = getProviderError(error);
  const httpStatus = Number(
    error?.status || error?.statusCode ||
    (typeof providerError?.code === 'number' ? providerError.code : null)
  ) || null;
  const errorCode = providerError?.status || providerError?.code || error?.code || null;
  const codeText = String(errorCode || '').toUpperCase();
  const message = sanitize(providerError?.message || error?.message || 'Unknown Gemini error');
  const messageText = message.toLowerCase();

  let errorType = 'sdk_error';
  if (httpStatus === 504 || codeText === 'DEADLINE_EXCEEDED') {
    errorType = 'upstream_timeout_504';
  } else if (httpStatus === 401 || codeText === 'UNAUTHENTICATED') {
    errorType = 'authentication_401';
  } else if (httpStatus === 403 || codeText === 'PERMISSION_DENIED') {
    errorType = 'permission_403';
  } else if (httpStatus === 429 || codeText === 'RESOURCE_EXHAUSTED') {
    errorType = 'rate_limited_429';
  } else if (httpStatus === 503 || codeText === 'UNAVAILABLE') {
    errorType = 'service_unavailable_503';
  } else if (httpStatus === 404 || codeText === 'MODEL_NOT_FOUND' || codeText === 'NOT_FOUND' ||
    /model.{0,40}(not found|does not exist|not available)/i.test(messageText)) {
    errorType = 'model_not_available';
  } else if (!httpStatus && (error?.name === 'AbortError' ||
    /TimeoutError$/.test(error?.name || ''))) {
    errorType = 'local_timeout';
  } else if (error?.name === 'APIConnectionError' ||
    ['ECONNRESET', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH', 'EAI_AGAIN', 'ENOTFOUND']
      .includes(String(error?.code || error?.cause?.code || '').toUpperCase())) {
    errorType = 'network_error';
  } else if (httpStatus >= 500) {
    errorType = 'upstream_server_error';
  }

  return {
    errorType,
    httpStatus,
    errorCode: errorCode === null ? null : sanitize(errorCode),
    message
  };
}

function emit(data) {
  console.log(JSON.stringify(data));
}

function getInteractionText(response) {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const text = response?.output
    ?.flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .map((item) => item.text)
    .find((item) => typeof item === 'string' && item.trim());

  return typeof text === 'string' ? text.trim() : '';
}

async function runTextTest(client, configuration) {
  const { model, thinkingLevel } = configuration;
  const startedAt = new Date();
  const startTime = Date.now();
  emit({
    event: 'request_started',
    test: 'text_generation',
    method: 'models.generateContent',
    model,
    thinkingLevel,
    startedAt: startedAt.toISOString(),
    timeoutMs: REQUEST_TIMEOUT_MS,
    attempts: 1
  });

  try {
    const response = await client.models.generateContent({
      model,
      contents: PROMPT,
      config: {
        thinkingConfig: { thinkingLevel }
      }
    });
    const finishedAt = new Date();
    const text = String(response?.text || '').trim();
    const result = {
      event: 'request_finished',
      test: 'text_generation',
      method: 'models.generateContent',
      model,
      thinkingLevel,
      status: text ? 'success' : 'empty_response',
      httpStatus: Number(response?.sdkHttpResponse?.status) || 200,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Date.now() - startTime,
      responseReceived: true,
      responseReadable: Boolean(text),
      responseLength: text.length
    };
    emit(result);
    return { ...result, ok: Boolean(text) };
  } catch (error) {
    const finishedAt = new Date();
    const details = getErrorDetails(error);
    const result = {
      event: 'request_finished',
      test: 'text_generation',
      method: 'models.generateContent',
      model,
      thinkingLevel,
      status: 'failed',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Date.now() - startTime,
      responseReceived: details.httpStatus !== null,
      responseReadable: false,
      providerErrorReadable: details.httpStatus !== null && Boolean(details.message),
      ...details
    };
    emit(result);
    return { ...result, ok: false };
  }
}

async function runInteractionTest(client, configuration) {
  const { model, thinkingLevel } = configuration;
  const startedAt = new Date();
  const startTime = Date.now();
  emit({
    event: 'request_started',
    test: 'structured_output',
    method: 'interactions.create',
    model,
    startedAt: startedAt.toISOString(),
    timeoutMs: REQUEST_TIMEOUT_MS,
    attempts: 1
  });

  try {
    const response = await client.interactions.create({
      model,
      input: JSON.stringify({
        question: 'Dua dadu bersisi enam dilempar. Berapa peluang jumlah mata keduanya sama dengan 12?'
      }),
      system_instruction: 'Ekstrak interpretasi soal sesuai JSON Schema. Jangan hitung peluang.',
      store: false,
      automatic_continuation: false,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: responseSchema
      }
    }, {
      timeout_ms: REQUEST_TIMEOUT_MS,
      retries: { strategy: 'none' }
    });
    const finishedAt = new Date();
    const text = getInteractionText(response);
    const result = {
      event: 'request_finished',
      test: 'structured_output',
      method: 'interactions.create',
      model,
      thinkingLevel,
      status: text ? 'response_received' : 'empty_response',
      httpStatus: Number(response?.sdkHttpResponse?.status) || 200,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Date.now() - startTime,
      responseReceived: true,
      responseReadable: Boolean(text),
      responseLength: text.length,
      jsonParsed: false,
      contractValid: false
    };

    if (text) {
      try {
        const validation = validateInterpretation(JSON.parse(text));
        result.jsonParsed = true;
        result.contractValid = validation.valid;
        if (validation.valid) {
          result.interpretationStatus = validation.data.status;
          result.interpretationCategory = validation.data.category;
        } else {
          result.validationError = sanitize(validation.error);
        }
      } catch {
        result.jsonParsed = false;
      }
    }

    emit(result);
    return { ok: result.responseReadable && result.contractValid };
  } catch (error) {
    const finishedAt = new Date();
    const details = getErrorDetails(error);
    emit({
      event: 'request_finished',
      test: 'structured_output',
      method: 'interactions.create',
      model,
      thinkingLevel,
      status: 'failed',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Date.now() - startTime,
      responseReceived: details.httpStatus !== null,
      responseReadable: false,
      providerErrorReadable: details.httpStatus !== null && Boolean(details.message),
      ...details
    });
    return { ok: false };
  }
}

async function main() {
  const runStartedAt = new Date();
  if (!apiKey) {
    emit({
      event: 'comparison_finished',
      status: 'configuration_error',
      reason: 'GEMINI_API_KEY is not configured',
      startedAt: runStartedAt.toISOString(),
      finishedAt: new Date().toISOString()
    });
    process.exitCode = 1;
    return;
  }

  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: REQUEST_TIMEOUT_MS,
      retryOptions: { attempts: 1 }
    }
  });
  const results = [];

  for (const configuration of MODELS) {
    results.push(await runTextTest(client, configuration));
  }

  const selected = results.find((result) => result.ok);
  let structuredOutput = { skipped: true, reason: 'no_text_model_succeeded' };
  if (selected) {
    const configuration = MODELS.find((candidate) => candidate.model === selected.model);
    structuredOutput = await runInteractionTest(client, configuration);
  } else {
    emit({
      event: 'request_skipped',
      test: 'structured_output',
      reason: structuredOutput.reason
    });
  }

  emit({
    event: 'comparison_finished',
    status: selected && structuredOutput.ok ? 'success' : 'failed',
    startedAt: runStartedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    timeoutMs: REQUEST_TIMEOUT_MS,
    retries: 0,
    textTests: results.map(({ model, thinkingLevel, httpStatus, durationMs, ok }) => ({
      model,
      thinkingLevel,
      httpStatus: httpStatus ?? null,
      durationMs,
      succeeded: ok
    })),
    structuredOutputModel: selected?.model || null
  });

  if (!selected || !structuredOutput.ok) process.exitCode = 1;
}

main().catch((error) => {
  emit({
    event: 'comparison_finished',
    status: 'failed',
    ...getErrorDetails(error)
  });
  process.exitCode = 1;
});
