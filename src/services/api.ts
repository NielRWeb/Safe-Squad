/**
 * SAFE SQUAD — src/services/api.ts
 * =============================================================================
 * THE ONLY FILE IN THE FRONTEND THAT TALKS TO THE SERVER.
 *
 * Every screen calls `api.something()`. No other file contains `fetch`, so:
 *   · there is one place to change if the API changes;
 *   · every request sends the session cookie the same way;
 *   · every error is turned into one friendly `ApiError` object instead of each
 *     screen inventing its own error handling.
 *
 * THREE DETAILS THAT MATTER
 *
 * 1. THE URL IS RELATIVE ('/api/...'), never http://localhost:4000.
 *    The page and the API must look like the same website to the browser, so the
 *    login cookie is allowed to travel with the request. In development
 *    vite.config.ts forwards /api/* to the Express server; in production the same
 *    server can deliver both. Nothing here ever hard-codes a machine or a port.
 *
 * 2. `credentials: 'include'` on every request.
 *    That is what tells the browser "send the safesquad_session cookie too".
 *    Without it the server would see every request as a stranger and answer 401.
 *    The cookie is httpOnly, so this file can never read it — and that is the
 *    point: JavaScript cannot steal what it cannot see.
 *
 * 3. NO SECRETS HERE. No database name, no user, no password. The browser gets a
 *    copy of every file in src/, so anything written here is public. Credentials
 *    live only in the server's .env (see server/db.js).
 * =============================================================================
 */
import type { GameId } from '../core/state';

/**
 * Where the API lives. Relative by default (same origin). A school can override
 * it at build time with a VITE_API_BASE entry in .env, for example
 * `VITE_API_BASE=https://safesquad.myschool.edu.ph/api`, without editing code.
 */
const BASE: string = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

/* ============================================================================
 * The shapes the server sends back.
 * These mirror server/format.js and server/routes/*.js exactly — if you change
 * one side, change the other.
 * ==========================================================================*/

/** A logged-in student. */
export interface StudentUser {
  role: 'student';
  lrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gradeLevel: string;
  section: string;
}

/** A logged-in teacher / principal. The password hash is never sent anywhere. */
export interface AdminUser {
  role: 'admin';
  id: number;
  username: string;
  fullName: string;
  adminRole: string;
}

export type ServerUser = StudentUser | AdminUser;

/** When the login happened and when the server will end it. */
export interface SessionInfo {
  loginAt: string;
  expiresAt: string;
}

export interface MeResponse {
  ok: true;
  user: ServerUser;
  session: SessionInfo;
}

export interface LoginResponse {
  ok: true;
  user: StudentUser;
}

export interface AdminLoginResponse {
  ok: true;
  user: AdminUser;
}

export interface LogoutResponse {
  ok: true;
  message: string;
}

/** One saved round, exactly as `game_results` stores it. */
export interface GameResult {
  id: number;
  lrn: string;
  gameId: string;
  categoryId: string;
  correct: number;
  total: number;
  /** Stars collected in games that have them; null for games that do not. */
  stars: number | null;
  playedAt: string | null;
  /** Present only on admin queries, where the student's name was joined in. */
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

/**
 * What we POST when a round ends.
 * There is deliberately NO lrn field: the server takes the student from the
 * session cookie, so nobody can save a score into someone else's record.
 */
export interface SaveResultPayload {
  gameId: GameId;
  /** Which of the 7 question categories was played (c1…c7). '' when unknown. */
  categoryId?: string;
  correct: number;
  total: number;
  stars?: number | null;
}

export interface SaveResultResponse {
  ok: true;
  id: number;
  result: GameResult;
}

/** Admin roster fields returned by GET /admin/students. */
export interface AdminStudent {
  lrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gradeLevel: string;
  section: string;
  isActive: boolean;
}

export interface StudentFields {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  section: string;
}

export interface AdminSummary {
  ok: true;
  students: number;
  results: { rounds: number; averagePercent: number };
}

export interface ResultsResponse {
  ok: true;
  count: number;
  results: GameResult[];
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  time: string;
  uptimeSeconds: number;
  activeSessions: number;
  database: 'connected' | 'unavailable';
  databaseDetail?: string;
  endpoints: string[];
}

/* ============================================================================
 * Errors
 * ==========================================================================*/

/**
 * One error type for the whole app.
 *
 * `status` is the HTTP status code, except for network failures where it is 0
 * ("the server never answered at all" — a laptop with XAMPP switched off, or the
 * site opened from GitHub Pages where there is no API). Callers can react to the
 * difference: 0 means "offer practice mode", 401 means "log in again".
 */
export class ApiError extends Error {
  readonly status: number;
  /** Extra explanation the server sometimes adds (for example why MySQL is down). */
  readonly detail?: string;
  /** What to do about it, in plain language, when the server knows. */
  readonly hint?: string;

  constructor(status: number, message: string, detail?: string, hint?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.hint = hint;
  }

  /** True when the server could not be reached at all. */
  get isOffline(): boolean {
    return this.status === 0;
  }
  /** True when there is no (or no longer a) login. */
  get isNotLoggedIn(): boolean {
    return this.status === 401;
  }
  /** True when logged in but not allowed (for example a student on an admin URL). */
  get isForbidden(): boolean {
    return this.status === 403;
  }
  /** True when the server is up but MySQL is not. */
  get isDatabaseDown(): boolean {
    return this.status === 503;
  }
}

/* ============================================================================
 * The request helper
 * ==========================================================================*/

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  /**
   * A 401 normally means "your login ended", which tells the whole app to return
   * to the login screen. While CHECKING whether we are logged in, that is just an
   * ordinary answer, so those calls pass `silent401: true`.
   */
  silent401?: boolean;
}

/** Called whenever a request comes back 401 (see session.ts). */
type UnauthorizedHandler = (message: string) => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Lets session.ts react to an expired login without api.ts importing it. */
export function onUnauthorized(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/**
 * Send one request and give back the parsed JSON.
 * Anything that goes wrong becomes an ApiError — this function never throws a
 * raw network error, so screens do not need to know how fetch fails.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, silent401 = false } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      // Same origin + this line = the session cookie travels with the request.
      credentials: 'include',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // fetch only throws for network-level problems (server off, no route, DNS).
    throw new ApiError(
      0,
      'Cannot reach the SAFE SQUAD server.',
      'The app could not contact the API at all.',
      'Is the API running? Start it with: npm run dev:server',
    );
  }

  // The API always answers JSON — but be careful anyway (a proxy error page, for
  // example, would not be JSON and must not crash the game).
  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message =
      typeof payload.error === 'string' && payload.error
        ? payload.error
        : `The server answered ${response.status} ${response.statusText || ''}`.trim();
    const detail = typeof payload.detail === 'string' ? payload.detail : undefined;
    const hint = typeof payload.hint === 'string' ? payload.hint : undefined;

    if (response.status === 401 && !silent401) unauthorizedHandler?.(message);
    throw new ApiError(response.status, message, detail, hint);
  }

  return payload as T;
}

/* ============================================================================
 * The API, grouped by screen
 * ==========================================================================*/

export const api = {
  /* ---------- is the server there? ---------- */
  /** GET /api/health — cheap check used before showing "practice mode". */
  health(): Promise<HealthResponse> {
    return request<HealthResponse>('/health', { silent401: true });
  },

  /* ---------- logging in and out ---------- */
  /**
   * GET /api/me — asks the server who is logged in.
   * This is how a page refresh keeps the student logged in: the browser still
   * has the cookie, so the server still recognises it.
   */
  me(): Promise<MeResponse> {
    // silent401: "nobody is logged in" is a normal answer here, not an expiry.
    return request<MeResponse>('/me', { silent401: true });
  },

  /** POST /api/auth/login — student login, LRN only (no password). */
  login(lrn: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', { method: 'POST', body: { lrn } });
  },

  /** POST /api/auth/admin-login — teacher/principal login. */
  adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
    return request<AdminLoginResponse>('/auth/admin-login', {
      method: 'POST',
      body: { username, password },
    });
  },

  /** POST /api/auth/logout — ends the session on the server and clears the cookie. */
  logout(): Promise<LogoutResponse> {
    return request<LogoutResponse>('/auth/logout', { method: 'POST', silent401: true });
  },

  /* ---------- a student's own progress ---------- */
  /** POST /api/results — save one finished round. */
  saveResult(payload: SaveResultPayload): Promise<SaveResultResponse> {
    return request<SaveResultResponse>('/results', { method: 'POST', body: payload });
  },

  /** GET /api/me/results — this student's history, newest first. */
  myResults(limit = 20, gameId?: GameId): Promise<ResultsResponse> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (gameId) params.set('gameId', gameId);
    return request<ResultsResponse>(`/me/results?${params.toString()}`);
  },

  /* ---------- admin dashboard ---------- */
  adminStudents(search?: string): Promise<{ ok: true; count: number; students: AdminStudent[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/admin/students${query}`);
  },

  createStudent(student: StudentFields & { lrn: string }): Promise<{ ok: true; message: string }> {
    return request('/admin/students', { method: 'POST', body: student });
  },

  updateStudent(lrn: string, student: StudentFields): Promise<{ ok: true; message: string }> {
    return request(`/admin/students/${encodeURIComponent(lrn)}`, { method: 'PUT', body: student });
  },

  deactivateStudent(lrn: string): Promise<{ ok: true; message: string }> {
    return request(`/admin/students/${encodeURIComponent(lrn)}/deactivate`, { method: 'POST' });
  },

  adminResults(lrn?: string): Promise<ResultsResponse> {
    const query = lrn ? `?lrn=${encodeURIComponent(lrn)}` : '';
    return request<ResultsResponse>(`/admin/results${query}`);
  },

  adminSummary(): Promise<AdminSummary> {
    return request<AdminSummary>('/admin/summary');
  },
};
