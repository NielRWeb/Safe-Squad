/**
 * SAFE SQUAD — src/core/session.ts
 * =============================================================================
 * "WHO IS USING THE APP RIGHT NOW?"
 *
 * This file keeps the current login in ONE place and tells the rest of the app
 * when it changes. It is written in the same style as core/state.ts: a small
 * module-level value, a few functions, and a listener list — no framework.
 *
 *      restore()        on boot: ask the server if we are still logged in
 *      loginWithLrn()   student login (LRN only — no password)
 *      loginAdmin()     teacher/principal login (username + password)
 *      startPractice()  offline practice mode (see below)
 *      logout()         end the session on the server and here
 *
 * WHERE THE LOGIN REALLY LIVES
 * On the server, in memory (server/session.js), identified by an httpOnly
 * cookie. This file only holds a COPY of the display details (name, role, LRN)
 * so screens can render without another request. That copy is not a security
 * measure — the server re-checks the cookie on every single request, so editing
 * this file's variables in the browser console would not grant any access.
 *
 * PRACTICE MODE (role 'guest')
 * If the API cannot be reached at all — the school server is off, or the site is
 * opened as a static GitHub Pages build where no API exists — the seven games
 * must still work, because they worked before any of this existed. The login
 * screen then offers "practice mode": full gameplay, scores saved on the device
 * (core/state.ts) exactly as before, nothing sent to a server, clearly labelled.
 * A guest can never see another student's data, because there is no data.
 *
 * ⚠ SECURITY NOTE TO DOCUMENT, NOT TO HIDE
 * Logging in with an LRN and no password is IDENTIFICATION, not strong
 * AUTHENTICATION: an LRN is not secret, so anyone who knows one can open that
 * student's record. The school asked for this on purpose (young students on
 * shared classroom devices cannot manage passwords). The consequences are kept
 * small by design — a student session can only read and write ITS OWN game
 * scores, never the roster, never another student's record; the sensitive
 * endpoints (/api/admin/*) always require a real admin password, checked on the
 * server. If this system is ever used for anything more sensitive than game
 * scores, students need a second factor (for example LRN + a class PIN).
 * =============================================================================
 */
import {
  api,
  onUnauthorized,
  ApiError,
  type AdminUser,
  type SessionInfo,
  type ServerUser,
  type StudentUser,
} from '../services/api';

/** A practice-mode player: logged in locally, unknown to the server. */
export interface GuestUser {
  role: 'guest';
  fullName: string;
}

export type CurrentUser = ServerUser | GuestUser;

/**
 * Who may open a route. Used by core/router.ts.
 *   public    – no login needed (the login screen itself)
 *   loggedIn  – any session: student, admin or practice mode
 *   student   – student sessions only
 *   admin     – admin sessions only (the admin dashboard, next phase)
 */
export type AccessLevel = 'public' | 'loggedIn' | 'student' | 'admin';

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let current: CurrentUser | null = null;
let info: SessionInfo | null = null;
/** Did the last call to the server succeed? Drives the practice-mode offer. */
let serverReachable = true;
/** Set when the server ends a session, so the login screen can explain why. */
let endedMessage: string | null = null;
/** True once restore() has finished, so screens know whether to wait. */
let restored = false;
/** Guards against two boot-time restores running at the same time. */
let restoreInFlight: Promise<CurrentUser | null> | null = null;

type Listener = (user: CurrentUser | null) => void;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((fn) => {
    try {
      fn(current);
    } catch (err) {
      console.warn('[session] listener failed', err);
    }
  });
}

/** React to any change of login (the router uses this to bounce to /login). */
export function onSessionChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ------------------------------------------------------------------ */
/* Reading the session                                                 */
/* ------------------------------------------------------------------ */

export function currentUser(): CurrentUser | null {
  return current;
}

/** Anybody logged in, including practice mode. */
export function isLoggedIn(): boolean {
  return current !== null;
}

export function isStudent(): boolean {
  return current?.role === 'student';
}

export function isAdmin(): boolean {
  return current?.role === 'admin';
}

/** Practice mode: playing without a server. */
export function isGuest(): boolean {
  return current?.role === 'guest';
}

/**
 * True only for a real student login — the one case where a finished round is
 * sent to the server. Admins and practice-mode players are not saved, because
 * POST /api/results is student-only and would answer 403.
 */
export function canSaveResults(): boolean {
  return isStudent();
}

/** When the server will end this login (null in practice mode). */
export function sessionInfo(): SessionInfo | null {
  return info;
}

/** Can the server be reached? False means the login screen offers practice mode. */
export function isServerReachable(): boolean {
  return serverReachable;
}

/** Has restore() finished? Lets the boot code avoid a second guess. */
export function isRestored(): boolean {
  return restored;
}

/** Why the last login ended (expired, logged out elsewhere…) — shown once. */
export function takeEndedMessage(): string | null {
  const message = endedMessage;
  endedMessage = null;
  return message;
}

/** The short name to show in the hub: "Juan Miguel" rather than the full record. */
export function displayName(): string {
  if (!current) return '';
  if (current.role === 'student') return current.firstName || current.fullName;
  return current.fullName || (current.role === 'admin' ? current.username : 'Practice mode');
}

/**
 * May this session open a route that needs `access`?
 * The frontend uses this to avoid showing screens the server would refuse anyway;
 * the SERVER is what actually enforces it (server/session.js).
 */
export function allows(access: AccessLevel): boolean {
  switch (access) {
    case 'public':
      return true;
    case 'loggedIn':
      return isLoggedIn();
    case 'student':
      return isStudent();
    case 'admin':
      return isAdmin();
    default:
      return false;
  }
}

/* ------------------------------------------------------------------ */
/* Changing the session                                                */
/* ------------------------------------------------------------------ */

function adopt(user: CurrentUser, sessionInfoValue: SessionInfo | null): CurrentUser {
  current = user;
  info = sessionInfoValue;
  endedMessage = null;
  serverReachable = user.role !== 'guest';
  emit();
  return user;
}

/** Clear everything locally (used by logout and by an expired session). */
function clearLocal(): void {
  current = null;
  info = null;
  emit();
}

/**
 * Ask the server who is logged in. Called once at boot.
 *
 * · 200 → we are still logged in (this is what survives a page refresh)
 * · 401 → nobody is logged in, which is normal on a first visit
 * · network failure → the API is not there; the login screen offers practice mode
 *
 * Never throws: the boot code must always be able to continue to a working screen.
 */
export function restore(): Promise<CurrentUser | null> {
  if (restoreInFlight) return restoreInFlight;

  restoreInFlight = (async () => {
    try {
      const me = await api.me();
      serverReachable = true;
      return adopt(me.user, me.session);
    } catch (err) {
      if (err instanceof ApiError && err.isOffline) {
        serverReachable = false;
        console.warn('[session] API unreachable — practice mode will be offered');
      } else if (err instanceof ApiError && err.isDatabaseDown) {
        // The API is alive but MySQL is not: still no login, but say why.
        serverReachable = true;
        console.warn('[session] API is up but the database is not:', err.detail ?? err.message);
      }
      current = null;
      info = null;
      return null;
    } finally {
      restored = true;
      restoreInFlight = null;
    }
  })();

  return restoreInFlight;
}

/**
 * Student login: LRN only, exactly as the school asked.
 * Throws ApiError with a message that can be shown to a student as-is
 * ("No student record matches that LRN…").
 */
export async function loginWithLrn(lrn: string): Promise<StudentUser> {
  const response = await api.login(lrn);
  serverReachable = true;
  return adopt(response.user, null) as StudentUser;
}

/** Admin login: username + password. The password is sent once and never stored. */
export async function loginAdmin(username: string, password: string): Promise<AdminUser> {
  const response = await api.adminLogin(username, password);
  serverReachable = true;
  return adopt(response.user, null) as AdminUser;
}

/**
 * Practice mode: play the seven games with no server at all.
 * Nothing is sent anywhere; scores stay in localStorage as they always did.
 */
export function startPractice(): GuestUser {
  return adopt({ role: 'guest', fullName: 'Practice mode' }, null) as GuestUser;
}

/**
 * Log out. The server call is attempted but never blocks the local logout: if
 * the network is gone we still clear the session here, so the student is never
 * stuck on a screen they cannot leave.
 */
export async function logout(): Promise<void> {
  if (current && current.role !== 'guest') {
    try {
      await api.logout();
    } catch (err) {
      console.warn('[session] logout request failed — clearing locally anyway', err);
    }
  }
  clearLocal();
}

/**
 * The server told us this login no longer exists (it expired, or the API
 * restarted — sessions live in the server's memory). Clear our copy and let the
 * router send the student back to the login screen with an explanation.
 */
function handleUnauthorized(message: string): void {
  if (!current) return; // already logged out; nothing to do
  console.warn('[session] login ended by the server:', message);
  endedMessage = 'Your session ended. Please log in again.';
  clearLocal();
}

// api.ts calls this whenever any request comes back 401. Registering it here
// keeps the dependency one-way: session → api, never api → session.
onUnauthorized(handleUnauthorized);
