import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HOST = '127.0.0.1';
const PORT = Number(process.env.API_PORT || 3001);
const MAX_INPUT_LENGTH = 2000;
const MAX_BODY_BYTES = 8192;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const CACHE_TTL_MS = 10 * 60_000;
const CACHE_LIMIT = 256;

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(data));
}

async function readJsonBody(request) {
  const chunks = [];
  let bytes = 0;

  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      const error = new Error('Ukuran permintaan terlalu besar.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Format permintaan tidak valid.');
    error.statusCode = 400;
    throw error;
  }
}

export function createApiServer({
  interpret,
  host = HOST,
  port = PORT,
  rateLimit = RATE_LIMIT
} = {}) {
  const rateLimits = new Map();
  const cache = new Map();

  const handler = interpret || (async (question) => {
    const { interpretProbabilityQuestion } = await import('./gemini.js');
    return interpretProbabilityQuestion(question);
  });

  const server = createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || HOST}`);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, {
        configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL)
      });
      return;
    }

    if (request.method !== 'POST' || url.pathname !== '/api/interpret') {
      sendJson(response, 404, { error: 'Endpoint tidak ditemukan.' });
      return;
    }

    const address = request.socket.remoteAddress || 'unknown';
    const recent = (rateLimits.get(address) || []).filter(
      (timestamp) => Date.now() - timestamp < RATE_WINDOW_MS
    );
    if (recent.length >= rateLimit) {
      rateLimits.set(address, recent);
      sendJson(response, 429, { error: 'Terlalu banyak permintaan. Coba lagi sebentar.' });
      return;
    }
    recent.push(Date.now());
    rateLimits.set(address, recent);

    if (!request.headers['content-type']?.includes('application/json')) {
      sendJson(response, 415, { error: 'Permintaan harus berupa JSON.' });
      return;
    }

    try {
      const body = await readJsonBody(request);
      if (!body || typeof body.question !== 'string' ||
        body.question.trim().length === 0 ||
        body.question.length > MAX_INPUT_LENGTH) {
        sendJson(response, 400, {
          error: `Soal harus berisi 1 sampai ${MAX_INPUT_LENGTH} karakter.`
        });
        return;
      }

      const question = body.question.trim();
      const cached = getCached(cache, question);
      if (cached.value) {
        sendJson(response, 200, { interpretation: cached.value, cached: true });
        return;
      }

      const interpretation = await handler(question);
      if (interpretation.status === 'success') {
        setCached(cache, cached.key, interpretation);
      }
      sendJson(response, 200, { interpretation, cached: false });
    } catch (error) {
      const statusCode = [400, 413, 415, 429, 502, 503, 504].includes(error.statusCode)
        ? error.statusCode
        : 500;
      const message = statusCode >= 500
        ? (statusCode === 429
          ? 'Batas penggunaan layanan AI tercapai. Coba lagi nanti.'
          : statusCode === 503
            ? 'Layanan AI belum dikonfigurasi.'
            : statusCode === 504
              ? 'Layanan AI melewati batas waktu.'
              : 'Layanan AI sedang tidak tersedia.')
        : error.message;
      sendJson(response, statusCode, { error: message });
    }
  });

  server.listen(port, host);

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [address, timestamps] of rateLimits) {
      const valid = timestamps.filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
      if (valid.length) rateLimits.set(address, valid);
      else rateLimits.delete(address);
    }
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
  }, RATE_WINDOW_MS);
  cleanup.unref();
  server.on('close', () => clearInterval(cleanup));

  return server;
}

function getCached(cache, question, now = Date.now()) {
  const key = createHash('sha256')
    .update(question.toLocaleLowerCase('id').replace(/\s+/g, ' ').trim())
    .digest('hex');
  const entry = cache.get(key);

  if (!entry || entry.expiresAt <= now) {
    cache.delete(key);
    return { key, value: null };
  }

  return { key, value: entry.value };
}

function setCached(cache, key, value, now = Date.now()) {
  if (cache.size >= CACHE_LIMIT) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = createApiServer();
  server.on('listening', () => {
    console.log(`Probability Solver API listening on http://${HOST}:${PORT}`);
  });
}
