/** Persistent server-side sessions. The browser gets a random token; MySQL stores only its SHA-256 hash. */
import crypto from 'node:crypto';
import { query, queryOne } from './db.js';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'safesquad_session';
const TTL_MS = (Number(process.env.SESSION_MINUTES) || 120) * 60_000;
const MAX_MS = 8 * 60 * 60_000; // absolute maximum even when the sliding expiry is refreshed
const COOKIE_SECURE = process.env.SESSION_COOKIE_SECURE === 'true';
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/' };
const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');
const validToken = token => typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);

export async function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  await query('INSERT INTO sessions (token_hash, role, student_lrn, user_data, created_ms, expires_ms, absolute_expires_ms) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [hashToken(token), user.role, user.role === 'student' ? user.lrn : null, JSON.stringify(user.role === 'student' ? { role: user.role, lrn: user.lrn } : { role: user.role, adminId: user.adminId }), now, Math.min(now + TTL_MS, now + MAX_MS), now + MAX_MS]);
  return token;
}

export async function activeSessionCount() {
  const row = await queryOne('SELECT COUNT(*) AS total FROM sessions WHERE expires_ms > ? AND absolute_expires_ms > ?', [Date.now(), Date.now()]);
  return Number(row?.total ?? 0);
}

export async function destroySession(token) {
  if (validToken(token)) await query('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
}

export async function revokeStudentSessions(lrn) {
  await query("DELETE FROM sessions WHERE role = 'student' AND student_lrn = ?", [lrn]);
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: Math.min(TTL_MS, MAX_MS) });
}
export function clearSessionCookie(res) { res.clearCookie(COOKIE_NAME, cookieOptions); }

export function parseCookies(req) {
  const cookies = {};
  for (const pair of (req.headers.cookie || '').split(';')) {
    const index = pair.indexOf('=');
    if (index < 0) continue;
    try { cookies[decodeURIComponent(pair.slice(0, index).trim())] = decodeURIComponent(pair.slice(index + 1).trim()); }
    catch { /* malformed cookies are ignored */ }
  }
  return cookies;
}

export async function attachSession(req, res, next) {
  const token = parseCookies(req)[COOKIE_NAME];
  req.sessionToken = validToken(token) ? token : null;
  req.session = null;
  if (!req.sessionToken) return next();
  const hash = hashToken(token);
  const now = Date.now();
  const row = await queryOne('SELECT user_data, created_ms, expires_ms, absolute_expires_ms FROM sessions WHERE token_hash = ? AND expires_ms > ? AND absolute_expires_ms > ?', [hash, now, now]);
  if (!row) return next();
  const identity = typeof row.user_data === 'string' ? JSON.parse(row.user_data) : row.user_data;
  let user;
  if (identity.role === 'student') {
    const student = await queryOne('SELECT lrn, first_name, last_name, grade_level, section, is_active FROM students WHERE lrn = ?', [identity.lrn]);
    if (!student || !Number(student.is_active)) { await destroySession(token); return next(); }
    user = { role: 'student', lrn: student.lrn, firstName: student.first_name, lastName: student.last_name,
      fullName: `${student.first_name} ${student.last_name}`.trim(), gradeLevel: student.grade_level, section: student.section };
  } else if (identity.role === 'admin') {
    const admin = await queryOne('SELECT id, username, full_name, role FROM admins WHERE id = ?', [identity.adminId]);
    if (!admin) { await destroySession(token); return next(); }
    user = { role: 'admin', adminId: Number(admin.id), username: admin.username, fullName: admin.full_name, adminRole: admin.role };
  } else { await destroySession(token); return next(); }
  const expires = Math.min(now + TTL_MS, Number(row.absolute_expires_ms));
  const updated = await query('UPDATE sessions SET expires_ms = ? WHERE token_hash = ? AND expires_ms > ? AND absolute_expires_ms > ?', [expires, hash, now, now]);
  if (!updated.affectedRows) return next();
  req.session = { ...user, createdAt: Number(row.created_ms), expiresAt: expires };
  // Refresh the browser expiry too; never extend past the absolute expiry.
  if (!['/api/auth/login', '/api/auth/admin-login', '/api/auth/logout'].includes(req.path)) {
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: expires - now });
  }
  next();
}

export function requireLogin(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Not logged in. Please log in first.' });
  next();
}
export function requireStudent(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Not logged in. Please log in with your LRN.' });
  if (req.session.role !== 'student') return res.status(403).json({ error: 'A student login is required for this.' });
  next();
}
export function requireAdmin(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Not logged in. Admins must log in first.' });
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'An admin login is required for this.' });
  next();
}

// Expired rows cannot authenticate; periodically remove them to bound retention.
const cleanup = setInterval(() => {
  void query('DELETE FROM sessions WHERE expires_ms <= ?', [Date.now()]).catch(() => console.warn('[session] expired-session cleanup failed'));
}, 60 * 60_000);
cleanup.unref();
