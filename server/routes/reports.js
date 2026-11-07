/** Admin-only reports. Dates are inclusive calendar dates in the database's DATETIME convention. */
import { Router } from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../session.js';
import { resultFromRow } from '../format.js';

const router = Router();
const PAGE_SIZE = 100;

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1000) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function filtersFor(input) {
  const { start = '', end = '', lrn = '' } = input;
  if (typeof start !== 'string' || typeof end !== 'string' || typeof lrn !== 'string' ||
      (start && !validDate(start)) || (end && !validDate(end)) ||
      (start && end && start > end) || (lrn && !/^\d{12}$/.test(lrn))) return null;
  const conditions = [];
  const params = [];
  if (start) { conditions.push('g.played_at >= ?'); params.push(`${start} 00:00:00`); }
  if (end) { conditions.push('g.played_at <= ?'); params.push(`${end} 23:59:59`); }
  if (lrn) { conditions.push('g.lrn = ?'); params.push(lrn); }
  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

const detailsSql = (where) => `SELECT g.id, g.lrn, g.game_id, g.category_id, g.correct, g.total, g.stars, g.played_at,
  s.first_name, s.last_name FROM game_results g LEFT JOIN students s ON s.lrn = g.lrn
  ${where} ORDER BY g.played_at DESC, g.id DESC`;

router.get('/admin/reports', requireAdmin, async (req, res) => {
  const filters = filtersFor(req.query);
  const pageValue = req.query.page ?? '1';
  if (!filters || typeof pageValue !== 'string' || !/^[1-9]\d{0,6}$/.test(pageValue)) {
    return res.status(400).json({ error: 'Use valid dates, an end date on or after the start date, a 12-digit LRN, and a valid page.' });
  }
  const page = Number(pageValue);
  const { where, params } = filters;
  const [counts, totals, games, rows] = await Promise.all([
    query('SELECT COUNT(*) AS students, COALESCE(SUM(is_active = 1), 0) AS active_students FROM students'),
    query(`SELECT COUNT(*) AS attempts, COUNT(DISTINCT g.lrn) AS participants,
      COALESCE(ROUND(AVG(g.correct / NULLIF(g.total, 0)) * 100), 0) AS average_percent,
      COALESCE(SUM(g.correct), 0) AS correct_answers, COALESCE(SUM(g.total), 0) AS questions
      FROM game_results g ${where}`, params),
    query(`SELECT g.game_id, COUNT(*) AS attempts, COUNT(DISTINCT g.lrn) AS participants,
      COALESCE(ROUND(AVG(g.correct / NULLIF(g.total, 0)) * 100), 0) AS average_percent
      FROM game_results g ${where} GROUP BY g.game_id ORDER BY g.game_id`, params),
    // page is validated as a bounded integer, never raw query text.
    query(`${detailsSql(where)} LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`, params),
  ]);
  const total = totals[0];
  res.set('Cache-Control', 'no-store');
  return res.json({ ok: true, students: Number(counts[0].students), activeStudents: Number(counts[0].active_students),
    attempts: Number(total.attempts), participants: Number(total.participants),
    averagePercent: Number(total.average_percent), correctAnswers: Number(total.correct_answers), questions: Number(total.questions),
    byGame: games.map(g => ({ gameId: g.game_id, attempts: Number(g.attempts), participants: Number(g.participants), averagePercent: Number(g.average_percent) })),
    results: rows.map(resultFromRow), page, pageSize: PAGE_SIZE });
});

/** Always quote fields, double quotes, and neutralize spreadsheet formulas even after whitespace. */
function csvCell(value, identifier = false) {
  let text = value == null ? '' : value instanceof Date ? value.toISOString() : String(value);
  if (identifier || /^[\s\u0000-\u001f]*[=+\-@]/u.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

router.get('/admin/reports.csv', requireAdmin, async (req, res) => {
  const filters = filtersFor(req.query);
  if (!filters) return res.status(400).json({ error: 'Use valid dates, an end date on or after the start date, and a 12-digit LRN.' });
  const rows = await query(detailsSql(filters.where), filters.params);
  const lines = [['LRN', 'Student name', 'Game ID', 'Category', 'Correct', 'Total questions', 'Stars', 'Attempt date'].map(v => csvCell(v)).join(',')];
  for (const row of rows) {
    const result = resultFromRow(row);
    lines.push([csvCell(result.lrn, true), csvCell(result.fullName), csvCell(result.gameId), csvCell(result.categoryId),
      csvCell(result.correct), csvCell(result.total), csvCell(result.stars), csvCell(result.playedAt)].join(','));
  }
  res.set({ 'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="safe-squad-report.csv"' });
  return res.type('text/csv').send('\uFEFF' + lines.join('\r\n') + '\r\n');
});
export default router;
