/**
 * SAFE SQUAD — server/format.js
 * =============================================================================
 * TRANSLATION LAYER: MySQL rows  →  the JSON the frontend expects.
 *
 * MySQL columns are snake_case (`first_name`, `played_at`) because that is the
 * SQL convention. The frontend is TypeScript and uses camelCase (`firstName`,
 * `playedAt`) because that is the JavaScript convention.
 *
 * Doing the translation here, in one small file, means:
 *   · route files stay short and readable;
 *   · only the fields listed below ever leave the server — a column we forget to
 *     copy is simply never sent, which is exactly what we want for anything
 *     sensitive (for example `admins.password_hash` is never mapped anywhere).
 * =============================================================================
 */

/**
 * A student row → the student object the browser is allowed to see.
 * @param {{lrn:string, first_name:string, last_name:string, grade_level?:string, section?:string}} row
 */
export function studentFromRow(row) {
  if (!row) return null;
  return {
    lrn: row.lrn,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    fullName: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim(),
    gradeLevel: row.grade_level ?? '',
    section: row.section ?? '',
  };
}

/**
 * One row of `game_results` → one result object.
 * Student names are included only when the query joined them in (admin routes);
 * for a student's own results they are left out because the student knows who
 * they are.
 */
export function resultFromRow(row) {
  if (!row) return null;
  const result = {
    id: Number(row.id),
    lrn: row.lrn,
    gameId: row.game_id,
    categoryId: row.category_id ?? '',
    correct: Number(row.correct),
    total: Number(row.total),
    // `stars` is allowed to be NULL (some games have no stars), so keep null.
    stars: row.stars === null || row.stars === undefined ? null : Number(row.stars),
    playedAt: row.played_at ?? null,
  };
  if (row.first_name !== undefined) {
    result.firstName = row.first_name ?? '';
    result.lastName = row.last_name ?? '';
    result.fullName = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim();
  }
  return result;
}

/**
 * Turn anything (usually a value from a URL like ?limit=25, or a score from a
 * request body) into a safe integer.
 *
 * The value is accepted ONLY if it is a whole number inside [min, max].
 * Anything else — text, decimals, negatives, absurdly large numbers — returns
 * `fallback`. It never silently "fixes" a bad value by clamping it, because a
 * score of -1 or 9999 should be refused, not quietly turned into 0 or 255.
 *
 * Two ways the routes use it:
 *   · with a sensible fallback (a LIMIT):  ?limit=99999  → 20, harmlessly capped
 *   · with fallback: -1 as a sentinel, so the route can answer 400 Bad Request
 *
 * @param {unknown} value
 * @param {{fallback?:number, min?:number, max?:number}} [options]
 * @returns {number}
 */
export function toInteger(value, options = {}) {
  const { fallback = 0, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options;
  if ((typeof value !== 'string' && typeof value !== 'number') || (typeof value === 'string' && !value.trim())) return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number)) return fallback;
  if (number < min || number > max) return fallback;
  return number;
}
