/**
 * SAFE SQUAD — server/routes/results.js
 * =============================================================================
 * SAVING AND READING ONE STUDENT'S GAME RESULTS.
 *
 * Mounted at `/api` in index.js, so the routes below are:
 *
 *   POST /api/results       save one finished round (called when a game ends)
 *   GET  /api/me/results    this student's own history, newest first
 *
 * Both routes are student-only (`requireStudent`).
 *
 * THE ONE THING TO REMEMBER ABOUT THIS FILE
 * The LRN used for saving ALWAYS comes from the session (`req.session.lrn`),
 * never from the request body. A student therefore cannot post a score into
 * somebody else's record, no matter what they send.
 * =============================================================================
 */
import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { requireStudent } from '../session.js';
import { resultFromRow, toInteger } from '../format.js';

const router = Router();

/**
 * The seven game ids the frontend can send. They match the `GameId` type in
 * src/core/state.ts exactly.
 *
 * Checking against a list like this is called a WHITELIST: anything not on the
 * list is refused, so nobody can invent a game id and pollute the database.
 * (The server cannot import a TypeScript type at runtime, so the list is written
 * out again here on purpose — keep the two in sync if an 8th game is ever added.)
 */
const GAME_IDS = ['babyCry', 'puzzle', 'factFall', 'hearts', 'maze', 'princess', 'bingo'];

/** A category id looks like c1…c7 (see src/data/questions.ts). Kept loose on purpose. */
const CATEGORY_PATTERN = /^[A-Za-z0-9_-]{1,16}$/;

/** Shared SELECT column list, so both queries below return the same shape. */
const RESULT_COLUMNS = 'id, lrn, game_id, category_id, correct, total, stars, played_at';

/* ------------------------------------------------------------------ */
/* POST /api/results — save one finished round                         */
/* ------------------------------------------------------------------ */
router.post('/results', requireStudent, async (req, res) => {
  const body = req.body ?? {};

  /* ---- 1. Validate every field before it goes anywhere near MySQL ---- */
  const gameId = String(body.gameId ?? '').trim();
  if (!GAME_IDS.includes(gameId)) {
    return res.status(400).json({
      error: `Unknown game id "${gameId}". Expected one of: ${GAME_IDS.join(', ')}.`,
    });
  }

  // The category is optional for now (the frontend does not send it yet), so an
  // empty string is allowed and stored as ''.
  const categoryId = String(body.categoryId ?? '').trim();
  if (categoryId && !CATEGORY_PATTERN.test(categoryId)) {
    return res.status(400).json({ error: 'categoryId must be 1-16 letters, numbers, - or _.' });
  }

  const total = toInteger(body.total, { fallback: -1, min: 1, max: 255 });
  if (total < 1) {
    return res.status(400).json({ error: 'total must be a whole number between 1 and 255.' });
  }

  const correct = toInteger(body.correct, { fallback: -1, min: 0, max: 255 });
  if (correct < 0 || correct > total) {
    return res.status(400).json({
      error: `correct must be between 0 and total (${total}).`,
    });
  }

  // stars is optional: only some games award stars. Absent/empty means NULL.
  let stars = null;
  if (body.stars !== undefined && body.stars !== null && body.stars !== '') {
    stars = toInteger(body.stars, { fallback: -1, min: 0, max: 255 });
    if (stars < 0) {
      return res.status(400).json({ error: 'stars must be a whole number between 0 and 255.' });
    }
  }

  /* ---- 2. Save it ---- */
  const lrn = req.session.lrn; // from the login session — never from the body

  // For an INSERT, mysql2 does not give rows back; it gives a "result header"
  // that carries the new id (insertId) and how many rows changed.
  const header = await query(
    `INSERT INTO game_results (lrn, game_id, category_id, correct, total, stars)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [lrn, gameId, categoryId, correct, total, stars],
  );

  const saved = await queryOne(
    `SELECT ${RESULT_COLUMNS} FROM game_results WHERE id = ?`,
    [header.insertId],
  );

  console.log('[results] round saved');
  return res.status(201).json({ ok: true, id: Number(header.insertId), result: resultFromRow(saved) });
});

/* ------------------------------------------------------------------ */
/* GET /api/me/results — the logged-in student's own history           */
/* ------------------------------------------------------------------ */
router.get('/me/results', requireStudent, async (req, res) => {
  // ?limit=10 is allowed, but bounded so one request can never ask for the whole
  // table. toInteger() guarantees a plain JS integer…
  const limit = toInteger(req.query.limit, { fallback: 20, min: 1, max: 200 });

  const filters = ['WHERE lrn = ?'];
  const params = [req.session.lrn];

  // Optional ?gameId=bingo filter, checked against the same whitelist.
  const gameId = String(req.query.gameId ?? '').trim();
  if (gameId) {
    if (!GAME_IDS.includes(gameId)) {
      return res.status(400).json({ error: `Unknown game id "${gameId}".` });
    }
    filters.push('AND game_id = ?');
    params.push(gameId);
  }

  // …which is why it is safe to write it straight into the SQL here. MySQL cannot
  // accept a `?` placeholder for LIMIT in a prepared statement, and the value is
  // a number WE calculated — it is never text from the browser.
  const rows = await query(
    `SELECT ${RESULT_COLUMNS}
       FROM game_results
      ${filters.join(' ')}
      ORDER BY played_at DESC, id DESC
      LIMIT ${limit}`,
    params,
  );

  const results = rows.map(resultFromRow);
  return res.json({ ok: true, count: results.length, results });
});

export default router;
