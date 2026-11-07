/**
 * SAFE SQUAD — server/routes/admin.js
 * =============================================================================
 * THE ADMIN'S VIEW OF THE WHOLE SCHOOL.
 *
 * Mounted at `/api` in index.js, so the routes below are:
 *
 *   GET /api/admin/students   the roster, with each student's play stats
 *   GET /api/admin/results    every saved round (filterable), newest first
 *   GET /api/admin/summary    one small JSON object of totals for a dashboard
 *
 * ALL THREE ARE ADMIN-ONLY.
 * `requireAdmin` runs before the handler, and it runs on the SERVER. A student
 * who types this URL into the browser gets 403 — hiding the button in the
 * frontend would not be enough, because the URL can always be called directly.
 *
 * NOTE ON VALIDATION: these routes only READ, and every value they filter by is
 * passed to MySQL through a `?` placeholder, so a strange value simply matches
 * nothing. The strict whitelist lives in results.js, where data is WRITTEN —
 * checking input on the way in is what protects the database.
 * =============================================================================
 */
import { Router } from 'express';
import { query } from '../db.js';
import { requireAdmin, revokeStudentSessions } from '../session.js';
import { studentFromRow, resultFromRow, toInteger } from '../format.js';

const router = Router();

const LRN_PATTERN = /^\d{12}$/;

/* ------------------------------------------------------------------ */
/* GET /api/admin/students — roster + per-student stats                */
/* ------------------------------------------------------------------ */
router.get('/admin/students', requireAdmin, async (req, res) => {
  const filters = [];
  const params = [];

  // ?search=cruz  → matches part of a name, a section or an LRN.
  const search = String(req.query.search ?? '').trim();
  if (search) {
    filters.push('(s.lrn LIKE ? OR s.last_name LIKE ? OR s.first_name LIKE ? OR s.section LIKE ?)');
    const like = `%${search}%`; // the value is a placeholder, so this is safe
    params.push(like, like, like, like);
  }

  // ?gradeLevel=Grade 7 → exact match on one column.
  const gradeLevel = String(req.query.gradeLevel ?? '').trim();
  if (gradeLevel) {
    filters.push('s.grade_level = ?');
    params.push(gradeLevel);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  /*
   * LEFT JOIN (not JOIN) so a student who has not played anything yet still
   * appears in the list — with zeros. Those are exactly the students a teacher
   * needs to see.
   *
   * Every non-aggregated column is repeated in GROUP BY because MySQL runs in
   * ONLY_FULL_GROUP_BY mode by default and would otherwise refuse the query.
   */
  const rows = await query(
    `SELECT s.lrn,
            s.last_name,
            s.first_name,
            s.grade_level,
            s.section,
            s.is_active,
            s.created_at,
            COUNT(g.id)                                              AS rounds_played,
            COALESCE(MAX(g.correct), 0)                              AS best_correct,
            COALESCE(ROUND(AVG(g.correct / NULLIF(g.total, 0)) * 100), 0) AS average_percent,
            MAX(g.played_at)                                         AS last_played
       FROM students s
       LEFT JOIN game_results g ON g.lrn = s.lrn
       ${where}
      GROUP BY s.lrn, s.last_name, s.first_name, s.grade_level, s.section, s.is_active, s.created_at
      ORDER BY s.last_name, s.first_name`,
    params,
  );

  const students = rows.map((row) => ({
    ...studentFromRow(row),
    isActive: Boolean(Number(row.is_active)),
    createdAt: row.created_at ?? null,
    roundsPlayed: Number(row.rounds_played),
    bestCorrect: Number(row.best_correct),
    averagePercent: Number(row.average_percent),
    lastPlayed: row.last_played ?? null,
  }));

  return res.json({ ok: true, count: students.length, students });
});

/* Student management never changes the LRN or touches game_results. */
function studentFields(body) {
  const specs = [['firstName', 60], ['lastName', 60], ['gradeLevel', 20], ['section', 30]];
  const values = [];
  for (const [key, max] of specs) {
    if (typeof body?.[key] !== 'string') return null;
    const value = body[key].trim().replace(/\s+/g, ' ');
    // Reject control characters; text is rendered with textContent on the client.
    if (!value || value.length > max || /[\x00-\x1f\x7f]/.test(value)) return null;
    values.push(value);
  }
  return values;
}

router.post('/admin/students', requireAdmin, async (req, res) => {
  const lrn = typeof req.body?.lrn === 'string' ? req.body.lrn.trim() : '';
  const fields = studentFields(req.body);
  if (!LRN_PATTERN.test(lrn) || !fields) {
    return res.status(400).json({ error: 'Enter a 12-digit LRN, first and last name, grade and section within their length limits.' });
  }
  try {
    await query('INSERT INTO students (lrn, first_name, last_name, grade_level, section) VALUES (?, ?, ?, ?, ?)', [lrn, ...fields]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A student with this LRN already exists.' });
    throw error;
  }
  return res.status(201).json({ ok: true, message: 'Student added.' });
});

router.put('/admin/students/:lrn', requireAdmin, async (req, res) => {
  const { lrn } = req.params;
  const fields = studentFields(req.body);
  if (!LRN_PATTERN.test(lrn) || !fields || (req.body?.lrn !== undefined && req.body.lrn !== lrn)) {
    return res.status(400).json({ error: 'Enter valid student details. An LRN cannot be changed.' });
  }
  const result = await query('UPDATE students SET first_name = ?, last_name = ?, grade_level = ?, section = ? WHERE lrn = ?', [...fields, lrn]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Student not found.' });
  return res.json({ ok: true, message: 'Student updated.' });
});

router.post('/admin/students/:lrn/deactivate', requireAdmin, async (req, res) => {
  const { lrn } = req.params;
  if (!LRN_PATTERN.test(lrn)) return res.status(400).json({ error: 'An LRN must be exactly 12 digits.' });
  const result = await query('UPDATE students SET is_active = 0 WHERE lrn = ?', [lrn]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Student not found.' });
  revokeStudentSessions(lrn);
  return res.json({ ok: true, message: 'Student deactivated. Historical results are preserved.' });
});

/* ------------------------------------------------------------------ */
/* GET /api/admin/results — every round, newest first                  */
/* ------------------------------------------------------------------ */
router.get('/admin/results', requireAdmin, async (req, res) => {
  const limit = toInteger(req.query.limit, { fallback: 50, min: 1, max: 500 });

  const filters = [];
  const params = [];

  // ?lrn=136001234567 → one student's history.
  const lrn = String(req.query.lrn ?? '').trim();
  if (lrn) {
    if (!LRN_PATTERN.test(lrn)) {
      return res.status(400).json({ error: 'An LRN must be exactly 12 digits.' });
    }
    filters.push('g.lrn = ?');
    params.push(lrn);
  }

  // ?gameId=bingo → one game only. An unknown id simply returns no rows.
  const gameId = String(req.query.gameId ?? '').trim();
  if (gameId) {
    filters.push('g.game_id = ?');
    params.push(gameId);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const rows = await query(
    `SELECT g.id, g.lrn, g.game_id, g.category_id, g.correct, g.total, g.stars, g.played_at,
            s.first_name, s.last_name
       FROM game_results g
       LEFT JOIN students s ON s.lrn = g.lrn
       ${where}
      ORDER BY g.played_at DESC, g.id DESC
      LIMIT ${limit}`, // limit is an integer we computed ourselves — see results.js
    params,
  );

  const results = rows.map(resultFromRow);
  return res.json({ ok: true, count: results.length, results });
});

/* ------------------------------------------------------------------ */
/* GET /api/admin/summary — the numbers for an admin dashboard         */
/* ------------------------------------------------------------------ */
router.get('/admin/summary', requireAdmin, async (req, res) => {
  // Three independent questions, so they are asked at the same time.
  const [totalsRows, perGameRows, countsRows] = await Promise.all([
    query(
      `SELECT COUNT(*)                                                     AS rounds,
              COUNT(DISTINCT lrn)                                          AS students_who_played,
              COALESCE(SUM(correct), 0)                                    AS correct_answers,
              COALESCE(SUM(total), 0)                                      AS questions_answered,
              COALESCE(ROUND(AVG(correct / NULLIF(total, 0)) * 100), 0)    AS average_percent,
              MAX(played_at)                                               AS last_round
         FROM game_results`,
    ),
    query(
      `SELECT game_id,
              COUNT(*)                                                     AS rounds,
              COUNT(DISTINCT lrn)                                          AS players,
              COALESCE(ROUND(AVG(correct / NULLIF(total, 0)) * 100), 0)    AS average_percent,
              MAX(correct)                                                 AS best_correct
         FROM game_results
        GROUP BY game_id
        ORDER BY game_id`,
    ),
    query('SELECT (SELECT COUNT(*) FROM students) AS students, (SELECT COUNT(*) FROM students WHERE is_active = 1) AS active_students, (SELECT COUNT(*) FROM admins) AS admins'),
  ]);

  const totals = totalsRows[0] ?? {};
  const counts = countsRows[0] ?? {};

  return res.json({
    ok: true,
    // MySQL returns COUNT/AVG as strings or decimals; Number() makes them plain
    // numbers so the frontend can chart them without surprises.
    students: Number(counts.students ?? 0),
    admins: Number(counts.admins ?? 0),
    activeStudents: Number(counts.active_students ?? 0),
    results: {
      rounds: Number(totals.rounds ?? 0),
      studentsWhoPlayed: Number(totals.students_who_played ?? 0),
      correctAnswers: Number(totals.correct_answers ?? 0),
      questionsAnswered: Number(totals.questions_answered ?? 0),
      averagePercent: Number(totals.average_percent ?? 0),
      lastRound: totals.last_round ?? null,
    },
    byGame: perGameRows.map((row) => ({
      gameId: row.game_id,
      rounds: Number(row.rounds),
      players: Number(row.players),
      averagePercent: Number(row.average_percent),
      bestCorrect: Number(row.best_correct ?? 0),
    })),
  });
});

export default router;
