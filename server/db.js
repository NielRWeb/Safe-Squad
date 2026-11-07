/**
 * SAFE SQUAD — server/db.js
 * =============================================================================
 * THE ONLY FILE THAT TALKS TO MYSQL.
 *
 * Every other server file asks this one for data, so there is exactly one place
 * where the database is configured and exactly one place to look if the database
 * is the problem.
 *
 * Two rules this file follows:
 *   1. Credentials come from `.env` (never from src/, never hard-coded here).
 *   2. Every query uses `?` placeholders, so text typed by a student can never
 *      be read as SQL. This is what stops "SQL injection".
 * =============================================================================
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

/* ------------------------------------------------------------------ */
/* 1. Load .env                                                        */
/* ------------------------------------------------------------------ */
// `.env` always sits next to package.json (one folder above this file), so the
// server works no matter which folder the command was started from.
const thisFolder = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(thisFolder, '..', '.env');
dotenv.config({ path: envPath, quiet: true });

/* ------------------------------------------------------------------ */
/* 2. Read the connection settings                                     */
/* ------------------------------------------------------------------ */
/**
 * The connection settings. `||` supplies a sensible default so the server can
 * still start on a fresh clone that has no `.env` yet — it just reports that the
 * database is unreachable instead of crashing.
 */
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'safe_squad',
};

/** Which settings are still missing? Used only to print a friendly hint. */
export function missingEnvVars() {
  return ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].filter(
    (name) => !process.env[name],
  );
}

/* ------------------------------------------------------------------ */
/* 3. The connection pool                                              */
/* ------------------------------------------------------------------ */
/**
 * A "pool" is a small set of reusable database connections. Opening a new
 * connection for every request is slow; a pool hands one out, then takes it back.
 *
 * Five connections is plenty for one class of phones, and it keeps a school MySQL
 * server from being overwhelmed.
 */
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 100, // avoid unbounded memory growth if MySQL cannot keep up
  connectTimeout: 10000,
  // Return DATETIME columns as plain 'YYYY-MM-DD HH:MM:SS' text. The JSON sent to
  // the browser then looks the same on every computer, with no timezone shifting.
  dateStrings: true,
});

/* ------------------------------------------------------------------ */
/* 4. Query helpers                                                    */
/* ------------------------------------------------------------------ */
/**
 * Run a query and get the rows back.
 *
 * @param {string} sql     SQL with `?` for every value, e.g.
 *                         'SELECT * FROM students WHERE lrn = ?'
 * @param {unknown[]} params  the values, in the same order as the `?` marks
 *
 * mysql2 turns this into a PREPARED STATEMENT: the SQL is sent first, the values
 * afterwards, so a value can never change the meaning of the SQL.
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Same as query(), but returns the first row only (or null when there is none). */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}

/** Close the pool. Used by the small command-line scripts so they can exit. */
export async function closePool() {
  await pool.end();
}

/* ------------------------------------------------------------------ */
/* 5. "Is the database there?"                                         */
/* ------------------------------------------------------------------ */
/**
 * Cheap connection test used by GET /api/health and by the startup message.
 * It never throws — it answers { ok: true } or { ok: false, message }.
 */
export async function pingDatabase() {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1');
    return { ok: true };
  } catch (error) {
    return { ok: false, message: explainDbError(error) };
  } finally {
    // Always give the connection back to the pool, even after an error.
    if (connection) connection.release();
  }
}

/** Error codes that mean "we could not reach / use MySQL". */
const DB_ERROR_CODES = new Set([
  'ECONNREFUSED', // MySQL is not running, or wrong port
  'ENOTFOUND', // wrong host name
  'EAI_AGAIN', // DNS hiccup
  'ETIMEDOUT',
  'ECONNRESET',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_SEQUENCE_TIMEOUT',
  'ER_ACCESS_DENIED_ERROR', // wrong user / password
  'ER_DBACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR', // database does not exist yet
  'ER_NO_SUCH_TABLE', // schema.sql has not been run yet
]);

/** True when an error came from MySQL or from failing to reach it. */
export function isDbError(error) {
  return DB_ERROR_CODES.has(error?.code) || error?.message === 'Queue limit reached.';
}

/**
 * Turn a scary MySQL error into one sentence a student or a panellist can read.
 * The technical text is logged in the terminal, never sent to the browser.
 */
export function explainDbError(error) {
  switch (error?.code) {
    case 'ECONNREFUSED':
      return 'MySQL is not running on that host/port (is XAMPP or MySQL started?).';
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return `The database host "${dbConfig.host}" could not be found.`;
    case 'ER_ACCESS_DENIED_ERROR':
    case 'ER_DBACCESS_DENIED_ERROR':
      return `MySQL rejected the login for user "${dbConfig.user}" (check DB_USER / DB_PASSWORD in .env).`;
    case 'ER_BAD_DB_ERROR':
      return `Database "${dbConfig.database}" does not exist yet — run: npm run db:setup`;
    case 'ER_NO_SUCH_TABLE':
      return 'The tables are missing — run: npm run db:setup';
    case 'ETIMEDOUT':
    case 'PROTOCOL_SEQUENCE_TIMEOUT':
      return 'MySQL did not answer in time.';
    default:
      return error?.message || 'Unknown database error.';
  }
}
