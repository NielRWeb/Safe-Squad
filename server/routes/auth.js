/**
 * SAFE SQUAD — server/routes/auth.js
 * =============================================================================
 * WHO ARE YOU?  (logging in, logging out, and "who am I?")
 *
 * This file is mounted at `/api` in index.js, so the routes below are:
 *
 *   POST /api/auth/login         student login — LRN only, no password
 *   POST /api/auth/admin-login   admin login  — username + password
 *   POST /api/auth/logout        ends the session for whoever is logged in
 *   GET  /api/me                 returns the logged-in user (or 401)
 *
 * TWO KINDS OF LOGIN, ON PURPOSE
 *   · A STUDENT identifies themselves with their LRN alone (this does not prove identity). There is no password to
 *     forget, which is the point: the app is used by whole classes on shared
 *     devices. The trade-off is that an LRN is not secret, so student data must
 *     stay low-sensitivity (game scores only) and the server must be on a
 *     school-controlled network. Admin data is the sensitive part, which is why…
 *   · An ADMIN must always supply a password, and that password is stored only as
 *     a scrypt hash (see server/passwords.js). Admin endpoints are the ones that
 *     can see every student in the school.
 * =============================================================================
 */
import { Router } from 'express';
import { queryOne } from '../db.js';
import {
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  requireLogin,
} from '../session.js';
import { verifyPassword, DUMMY_HASH } from '../passwords.js';
import { studentFromRow } from '../format.js';

const router = Router();

/**
 * A Philippine LRN is 12 digits. Checking the shape here means a typo gets a
 * clear message instead of a pointless trip to MySQL.
 */
const LRN_PATTERN = /^\d{12}$/;

/* ------------------------------------------------------------------ */
/* POST /api/auth/login — student, LRN only                            */
/* ------------------------------------------------------------------ */
router.post('/auth/login', async (req, res) => {
  // Accept a number or a string from the frontend; trim spaces from a paste.
  const lrn = String(req.body?.lrn ?? '').trim();

  if (!lrn) {
    return res.status(400).json({ error: 'Please enter your LRN.' });
  }
  if (!LRN_PATTERN.test(lrn)) {
    return res.status(400).json({
      error: 'An LRN must be exactly 12 digits (for example 136001234567).',
    });
  }

  // The student must already exist in the roster. We deliberately do NOT create
  // accounts on the fly: the class list is the school's, and letting anyone make
  // an account would fill the database with junk.
  const row = await queryOne(
    'SELECT lrn, first_name, last_name, grade_level, section FROM students WHERE lrn = ? AND is_active = 1',
    [lrn],
  );

  if (!row) {
    return res.status(404).json({
      error: 'No student record matches that LRN. Please check the number, or ask your teacher to add you to the class list.',
    });
  }

  const student = studentFromRow(row);

  // The session keeps only what the dashboards need to display.
  await destroySession(req.sessionToken);
  const token = await createSession({
    role: 'student',
    lrn: student.lrn,
    firstName: student.firstName,
    lastName: student.lastName,
    fullName: student.fullName,
    gradeLevel: student.gradeLevel,
    section: student.section,
  });
  setSessionCookie(res, token);

  console.log('[auth] student login succeeded');
  return res.json({ ok: true, user: { role: 'student', ...student } });
});

/* ------------------------------------------------------------------ */
/* POST /api/auth/admin-login — username + password                    */
/* ------------------------------------------------------------------ */
router.post('/auth/admin-login', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (username.length > 40 || password.length > 256) return res.status(400).json({ error: 'Invalid login details.' });

  if (!username || !password) {
    return res.status(400).json({ error: 'Both a username and a password are required.' });
  }

  const row = await queryOne(
    'SELECT id, username, password_hash, full_name, role FROM admins WHERE username = ?',
    [username],
  );

  if (!row) {
    // Do the work anyway, so "no such user" and "wrong password" take the same
    // amount of time and an attacker cannot discover which usernames exist.
    verifyPassword(password, DUMMY_HASH);
    console.log('[auth] admin login failed');
    // One generic message for both failures — never say which half was wrong.
    return res.status(401).json({ error: 'Wrong username or password.' });
  }

  if (!verifyPassword(password, row.password_hash)) {
    console.log('[auth] admin login failed');
    return res.status(401).json({ error: 'Wrong username or password.' });
  }

  await destroySession(req.sessionToken);
  const token = await createSession({
    role: 'admin',
    adminId: Number(row.id),
    username: row.username,
    adminRole: row.role ?? 'admin',
    fullName: row.full_name ?? row.username,
  });
  setSessionCookie(res, token);

  // Log the success, but NEVER the password and never the hash.
  console.log('[auth] admin login succeeded');
  return res.json({
    ok: true,
    user: {
      role: 'admin',
      id: Number(row.id),
      username: row.username,
      fullName: row.full_name ?? row.username,
      adminRole: row.role ?? 'admin',
    },
  });
});

/* ------------------------------------------------------------------ */
/* POST /api/auth/logout                                               */
/* ------------------------------------------------------------------ */
router.post('/auth/logout', async (req, res) => {
  // Deleting the session on the SERVER is the part that really logs out.
  // Clearing the cookie only removes the token from this browser.
  await destroySession(req.sessionToken);
  clearSessionCookie(res);
  return res.json({ ok: true, message: 'Logged out.' });
});

/* ------------------------------------------------------------------ */
/* GET /api/me — who is logged in?                                     */
/* ------------------------------------------------------------------ */
router.get('/me', requireLogin, (req, res) => {
  const session = req.session;

  const user =
    session.role === 'student'
      ? {
          role: 'student',
          lrn: session.lrn,
          firstName: session.firstName,
          lastName: session.lastName,
          fullName: session.fullName,
          gradeLevel: session.gradeLevel,
          section: session.section,
        }
      : {
          role: 'admin',
          id: session.adminId,
          username: session.username,
          fullName: session.fullName,
          adminRole: session.adminRole ?? 'admin',
        };

  // Session middleware loads current display details from the database.
  return res.json({
    ok: true,
    user,
    session: {
      loginAt: new Date(session.createdAt).toISOString(),
      expiresAt: new Date(session.expiresAt).toISOString(),
    },
  });
});

export default router;
