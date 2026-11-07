/**
 * SAFE SQUAD — server/session.js
 * =============================================================================
 * SERVER-SIDE LOGIN SESSIONS.
 *
 * HOW A LOGIN WORKS HERE (the version you can draw on the board):
 *
 *   1. The browser POSTs the LRN (or the admin username + password).
 *   2. The server checks it against MySQL.
 *   3. If it is valid, the server creates a SESSION: a record kept in the
 *      server's own memory that says "this token belongs to student 1360…,
 *      role = student, expires at 15:40".
 *   4. The server sends back only a random, meaningless TOKEN (64 hex
 *      characters) inside an httpOnly cookie.
 *   5. Every later request carries that cookie. The server looks the token up in
 *      its memory and therefore knows who is asking — without the browser ever
 *      storing the name, role or LRN itself.
 *
 * WHY THE COOKIE IS `httpOnly`
 * JavaScript in the browser cannot read an httpOnly cookie. So even if a script
 * were smuggled into a page, it could not steal the login token. This is the main
 * reason a cookie is used instead of putting a token in localStorage.
 *
 * HONEST LIMITATION (say this at the defence, it is a strength not a weakness)
 * Sessions live in a Map in this file, i.e. in the server's RAM. Restarting the
 * server logs everybody out, and two separate server processes could not share
 * logins. That is perfectly fine for one school server; the upgrade path is the
 * `express-session` package with a MySQL session table, and nothing else in the
 * project would have to change.
 * =============================================================================
 */
import crypto from 'node:crypto';

/* ------------------------------------------------------------------ */
/* Settings (all from .env, all with safe defaults)                    */
/* ------------------------------------------------------------------ */
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'safesquad_session';
const TTL_MINUTES = Number(process.env.SESSION_MINUTES) || 120;
const TTL_MS = TTL_MINUTES * 60 * 1000;
// Cookies should only travel over HTTPS once the project is really deployed.
const COOKIE_SECURE = String(process.env.SESSION_COOKIE_SECURE).toLowerCase() === 'true';

/* ------------------------------------------------------------------ */
/* The session store                                                   */
/* ------------------------------------------------------------------ */
/** @type {Map<string, {token:string, role:'student'|'admin', lrn:string|null, adminId:number|null, username:string|null, adminRole:string, firstName:string, lastName:string, fullName:string, gradeLevel:string, section:string, createdAt:number, expiresAt:number}>} */
const sessions = new Map();

/**
 * Create a new session and return its random token.
 * @param {object} user  who is logging in (role plus a few display details)
 */
export function createSession(user) {
  // 32 random bytes = 256 bits of unguessability. Nobody can brute-force this.
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  sessions.set(token, {
    token,
    role: 'student',
    lrn: null,
    adminId: null,
    username: null,
    adminRole: '',
    firstName: '',
    lastName: '',
    fullName: '',
    gradeLevel: '',
    section: '',
    ...user,
    createdAt: now,
    expiresAt: now + TTL_MS,
  });
  return token;
}

/**
 * Look a token up. Expired sessions are deleted on sight and reported as null.
 * A valid session gets its expiry pushed forward ("sliding"), so a student who
 * keeps playing is not logged out mid-game.
 */
export function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + TTL_MS;
  return session;
}

/** End one session (logout). */
export function destroySession(token) {
  if (token) sessions.delete(token);
}

/** End every session (useful when you restart a lesson or change the roster). */
export function destroyAllSessions() {
  sessions.clear();
}

/** How many people are logged in right now. Handy while demonstrating. */
export function activeSessionCount() {
  return sessions.size;
}

// Once every five minutes, throw away expired sessions so the Map cannot grow
// forever on a server that runs all day. `.unref()` means this timer never stops
// Node from exiting when you press Ctrl+C.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(token);
  }
}, 5 * 60 * 1000);
sweeper.unref?.();

/* ------------------------------------------------------------------ */
/* Cookies                                                             */
/* ------------------------------------------------------------------ */
/**
 * Read the cookies off a request by hand.
 * (The `cookie-parser` package would do this too, but it is four lines and one
 * less dependency, so we do it ourselves.)
 *
 * A cookie header looks like:  name1=value1; name2=value2
 * @returns {Record<string,string>}
 */
export function parseCookies(req) {
  const header = req.headers?.cookie;
  if (!header) return {};
  const jar = {};
  for (const pair of header.split(';')) {
    const index = pair.indexOf('=');
    if (index === -1) continue;
    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (name) jar[decodeURIComponent(name)] = decodeURIComponent(value);
  }
  return jar;
}

/** Send the session cookie to the browser (Express writes the header for us). */
export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // browser JavaScript cannot read it
    sameSite: 'lax', // not sent along on cross-site requests (CSRF protection)
    secure: COOKIE_SECURE, // true only over HTTPS
    path: '/', // valid on every page of the site
    maxAge: TTL_MS,
  });
}

/** Delete the session cookie from the browser. */
export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/' });
}

/* ------------------------------------------------------------------ */
/* Middleware                                                          */
/* ------------------------------------------------------------------ */
/**
 * Runs on EVERY request: puts the session (or null) on `req.session`, so route
 * handlers can simply ask "who is this?".
 */
export function attachSession(req, _res, next) {
  const token = parseCookies(req)[COOKIE_NAME];
  req.sessionToken = token ?? null;
  req.session = getSession(token);
  next();
}

/** Anybody who is logged in (student or admin). */
export function requireLogin(req, res, next) {
  if (!req.session) {
    return res.status(401).json({ error: 'Not logged in. Please log in first.' });
  }
  next();
}

/** Students only — used by /api/me/results and POST /api/results. */
export function requireStudent(req, res, next) {
  if (!req.session) {
    return res.status(401).json({ error: 'Not logged in. Please log in with your LRN.' });
  }
  if (req.session.role !== 'student') {
    return res.status(403).json({ error: 'A student login is required for this.' });
  }
  next();
}

/**
 * Admins only — used by every /api/admin/* route.
 *
 * IMPORTANT: this check happens on the SERVER. A check written in the frontend
 * would only hide a button; anybody could still call the URL directly. Real
 * permission checks must always live here.
 */
export function requireAdmin(req, res, next) {
  if (!req.session) {
    return res.status(401).json({ error: 'Not logged in. Admins must log in first.' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'An admin login is required for this.' });
  }
  next();
}
