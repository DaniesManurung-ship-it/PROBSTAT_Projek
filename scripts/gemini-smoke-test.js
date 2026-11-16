import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { responseSchema } from '../server/gemini.js';
import { validateInterpretation } from '../src/features/solver/interpretation-contract.js';

const REQUEST_TIMEOUT_MS = 60_000;
const envPath = resolve(process.cwd(), '.env');

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

function sanitize(value) {
  let text = String(value ?? '');
  if (apiKey) text = text.replaceAll(apiKey, '[REDACTED]');
  return text
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/([?&](?:key|api_key)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[REDACTED]')
    .slice(0, 500);
}

function getErrorDetails(error) {
  const providerError = error?.error && typeof error.error === 'object'
    ? error.error
    : null;
  const httpStatus = Number(error?.status || error?.statusCode) || null;
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

async function runRequest(phase, request) {
  const startedAt = new Date();
  const startTime = Date.now();
  emit({
    event: 'request_started',
    phase,
    model,
    startedAt: startedAt.toISOString(),
    timeoutMs: REQUEST_TIMEOUT_MS
  });

  try {
    const response = await request();
    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;
    const text = phase === 'simple_text'
      ? String(response?.text || '').trim()
      : getInteractionText(response);
    const result = {
      event: 'request_finished',
      phase,
      model,
      status: 'response_received',
      httpStatus: Number(response?.sdkHttpResponse?.status) || 200,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      responseReceived: true,
      responseReadable: Boolean(text),
      responseLength: text.length
    };

    if (phase === 'interactions_json' && text) {
      try {
        const parsed = JSON.parse(text);
        const validation = validateInterpretation(parsed);
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
        result.contractValid = false;
      }
    }

    emit(result);
    return { ok: result.responseReadable && (phase !== 'interactions_json' || result.contractValid) };
  } catch (error) {
    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;
    const errorDetails = getErrorDetails(error);
    emit({
      event: 'request_finished',
      phase,
      model,
      status: 'failed',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      responseReceived: errorDetails.httpStatus !== null,
      responseReadable: false,
      providerErrorReadable: errorDetails.httpStatus !== null && Boolean(errorDetails.message),
      ...errorDetails
    });
    return { ok: false };
  }
}

async function main() {
  const runStartedAt = new Date();
  if (!apiKey || !model) {
    emit({
      event: 'diagnostic_finished',
      status: 'configuration_error',
      startedAt: runStartedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      apiKeyConfigured: Boolean(apiKey),
      modelConfigured: Boolean(model)
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

  const simple = await runRequest('simple_text', () => client.models.generateContent({
    model,
    contents: 'Reply with the single word: READY'
  }));

  let interactions = { skipped: true, reason: 'simple_text_request_failed' };
  if (simple.ok) {
    interactions = await runRequest('interactions_json', () => client.interactions.create({
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
    }));
  } else {
    emit({
      event: 'request_skipped',
      phase: 'interactions_json',
      reason: interactions.reason
    });
  }

  emit({
    event: 'diagnostic_finished',
    status: simple.ok && interactions.ok ? 'success' : 'failed',
    startedAt: runStartedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    model,
    timeoutMs: REQUEST_TIMEOUT_MS,
    retries: 0,
    interactionsJsonSchema: 'application responseSchema'
  });

  if (!simple.ok || !interactions.ok) process.exitCode = 1;
}

main().catch((error) => {
  emit({
    event: 'diagnostic_finished',
    status: 'failed',
    model: model || null,
    ...getErrorDetails(error)
  });
  process.exitCode = 1;
});
