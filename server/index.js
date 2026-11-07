/**
 * SAFE SQUAD — server/index.js
 * =============================================================================
 * THE API SERVER. Start it with:  npm run dev:server
 *
 * WHAT THIS FILE DOES, IN ORDER:
 *   1. builds the Express app,
 *   2. adds four small "middlewares" that run before every route
 *      (read the JSON body, set safety headers, log the request, load the login),
 *   3. answers GET /api/health,
 *   4. hands the request to one of the three route files,
 *   5. turns anything left over into a JSON 404,
 *   6. catches every error in ONE place at the bottom.
 *
 * A "middleware" is just a function Express calls in turn:
 *      (req, res, next) => { …do something…; next(); }
 * That is the whole idea of Express, and it is why this file is short.
 *
 * THE FRONTEND NEVER KNOWS THIS PORT EXISTS
 * vite.config.ts proxies /api/* to http://localhost:4000, so browser code simply
 * calls fetch('/api/health'). Same origin → no CORS configuration, and the same
 * code works when the built site is served by this very server later on.
 * =============================================================================
 */
import express from 'express';
import { dbConfig, missingEnvVars, pingDatabase, isDbError, explainDbError, closePool, query } from './db.js';
import { attachSession, activeSessionCount } from './session.js';
import { production, securityHeaders, csrfGuard, limitAdminLogin } from './security.js';
import authRoutes from './routes/auth.js';
import resultsRoutes from './routes/results.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/reports.js';

const app = express();
const portValue = process.env.PORT ?? '4000';
if (!/^\d+$/.test(portValue) || Number(portValue) < 1 || Number(portValue) > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535.');
}
const PORT = Number(portValue);
// On a VM the reverse proxy can reach loopback; managed platforms may require 0.0.0.0.
const HOST = process.env.HOST || (production ? '127.0.0.1' : '0.0.0.0');
const API_VERSION = '0.1.0';
const startedAt = Date.now();

/* ------------------------------------------------------------------ */
/* 1. Middlewares that run for every request                           */
/* ------------------------------------------------------------------ */

// Do not advertise which framework we use (a tiny, free bit of hygiene).
app.disable('x-powered-by');

// Parse JSON request bodies. The 32 kb ceiling means a huge or malicious body is
// rejected before it is read into memory.

// API security headers and strict same-origin production policy.
app.use(securityHeaders);
app.use(csrfGuard);
app.post('/api/auth/admin-login', limitAdminLogin);
app.use(express.json({ limit: '32kb' }));
app.use((req, res, next) => {
  const started = Date.now();
  // Never log LRNs, names, query strings, cookie tokens, or request bodies.
  res.on('finish', () => console.log(`${req.method} API → ${res.statusCode} in ${Date.now() - started} ms`));
  next();
});

// Put the logged-in user (or null) on every request, before any route runs.
app.use(attachSession);

/* ------------------------------------------------------------------ */
/* 2. Health check                                                     */
/* ------------------------------------------------------------------ */
/**
 * GET /api/health
 * A tiny JSON answer that proves the API is alive, and says whether MySQL is
 * reachable. Open http://localhost:4000/api/health in a browser to see it.
 */
app.get('/api/health', async (_req, res) => {
  const db = await pingDatabase();
  res.json({
    ok: true,
    service: 'safe-squad-api',
    version: API_VERSION,
    time: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    // Preserve the health shape without making a database outage crash health.
    activeSessions: db.ok ? await activeSessionCount().catch(() => 0) : 0,
    database: db.ok ? 'connected' : 'unavailable',
    ...(db.ok || production ? {} : { databaseDetail: db.message }),
    endpoints: [
      'GET  /api/health',
      'GET  /api/ready',
      'POST /api/auth/login',
      'POST /api/auth/admin-login',
      'POST /api/auth/logout',
      'GET  /api/me',
      'POST /api/results',
      'GET  /api/me/results',
      'GET  /api/admin/students',
      'POST /api/admin/students',
      'PUT  /api/admin/students/:lrn',
      'POST /api/admin/students/:lrn/deactivate',
      'GET  /api/admin/results',
      'GET  /api/admin/summary',
      'GET  /api/admin/reports',
      'GET  /api/admin/reports.csv',
    ],
  });
});

/** Readiness is separate from liveness: it verifies DB access and required columns.
 * These SELECTs read no rows and never expose SQL or connection details to clients. */
app.get('/api/ready', async (_req, res) => {
  try {
    await Promise.all([
      query('SELECT lrn, first_name, last_name, grade_level, section, is_active FROM students LIMIT 0'),
      query('SELECT id, username, password_hash, full_name, role FROM admins LIMIT 0'),
      query('SELECT id, lrn, game_id, category_id, correct, total, stars, played_at FROM game_results LIMIT 0'),
      query('SELECT token_hash, role, student_lrn, user_data, created_ms, expires_ms, absolute_expires_ms FROM sessions LIMIT 0'),
    ]);
    return res.json({ ok: true, service: 'safe-squad-api' });
  } catch {
    return res.status(503).json({ ok: false, service: 'safe-squad-api', error: 'Database or required schema unavailable.' });
  }
});

/* ------------------------------------------------------------------ */
/* 3. The routes                                                       */
/* ------------------------------------------------------------------ */
app.use('/api', authRoutes); //    /api/auth/login, /api/auth/admin-login, /api/auth/logout, /api/me
app.use('/api', resultsRoutes); // /api/results, /api/me/results
app.use('/api', adminRoutes);
app.use('/api', reportRoutes); //   /api/admin/students, /api/admin/results, /api/admin/summary

/* ------------------------------------------------------------------ */
/* 4. JSON 404 for anything that did not match                         */
/* ------------------------------------------------------------------ */
app.use((req, res) => {
  res.status(404).json({
    error: `Nothing is served at ${req.method} ${req.originalUrl}`,
    hint: 'Try GET /api/health for the list of endpoints.',
  });
});

/* ------------------------------------------------------------------ */
/* 5. ONE error handler for the whole API                              */
/* ------------------------------------------------------------------ */
/**
 * Express recognises an error handler by its FOUR arguments.
 *
 * Express 5 sends a rejected promise straight here, so the route files can use
 * plain `async` functions with no try/catch at all — every database failure ends
 * up in this one place, which is much easier to explain (and to fix) than twenty
 * try/catch blocks.
 *
 * The browser gets a friendly sentence; the terminal gets the real error.
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
app.use((error, _req, res, _next) => {
  // A body that was not valid JSON.
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'The request body was not valid JSON.' });
  }
  // A body that was too large.
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'The request body is too large.' });
  }
  // MySQL is down / not set up yet. 503 = "try again later", which is honest.
  if (isDbError(error)) {
    console.error('[db]', error.code ?? 'database error', production ? '' : error.message);
    return res.status(503).json({
      error: 'The database is not reachable, so this request cannot be answered yet.',
      ...(production ? {} : { detail: explainDbError(error), hint: 'Start MySQL, copy .env.example to .env, then run: npm run db:setup' }),
    });
  }

  console.error('[api] unexpected error:', production ? (error?.code || 'internal error') : error);
  return res.status(500).json({ error: 'Something went wrong on the server. The details are in the server terminal.' });
});

/* ------------------------------------------------------------------ */
/* 6. Start                                                            */
/* ------------------------------------------------------------------ */
const server = app.listen(PORT, HOST, async () => {
  console.log('');
  console.log('  SAFE SQUAD API');
  console.log(`  → listening on ${HOST}:${PORT} (health: /api/health, readiness: /api/ready)`);
  if (!production) console.log(`  MySQL: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  const missing = missingEnvVars();
  if (missing.length) {
    console.log('');
    console.log(`  ! No .env yet — using defaults for: ${missing.join(', ')}`);
    console.log('    Copy .env.example to .env and put your real MySQL details in it.');
  }

  const db = await pingDatabase();
  if (db.ok) {
    console.log('  MySQL: connected ✔');
  } else {
    console.log(production ? '  MySQL: NOT reachable ✘' : `  MySQL: NOT reachable ✘  (${db.message})`);
    console.log('  The API is still running — endpoints that need data answer 503 with a hint.');
    if (!production) console.log('  Once MySQL is up, create the tables with:  npm run db:setup');
  }
  console.log('');
});

/**
 * Shut down tidily on Ctrl+C:
 *   1. stop accepting new requests,
 *   2. close idle sockets and allow active requests up to ten seconds,
 *   3. close the MySQL pool, then exit; force exit on timeout.
 */
function shutdown(signal) {
  console.log(`\n[api] ${signal} received — shutting down.`);
  server.close(async () => {
    try {
      await closePool();
    } catch {
      /* the pool was never connected — nothing to close */
    }
    console.log('[api] closed. Bye.');
    process.exit(0);
  });
  server.closeIdleConnections?.();
  // Allow active requests to finish, then force close if they are stuck.
  setTimeout(() => { server.closeAllConnections?.(); process.exit(1); }, 10000).unref();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(signal));
}
