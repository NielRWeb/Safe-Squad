/**
 * SAFE SQUAD — src/core/router.ts
 * =============================================================================
 * Minimal scene router with ACCESS RULES.
 *
 * Each screen returns a root element plus a destroy() hook so timers, animation
 * loops and listeners are always cleaned up.
 *
 * WHAT WAS ADDED FOR LOGINS
 * A table (ROUTE_ACCESS) says who may open each screen, and go() checks it
 * BEFORE building anything. A student who is not logged in cannot open the hub or
 * a game: they are sent to the login screen, and the route they asked for is
 * remembered so they land there after logging in.
 *
 * This is a CONVENIENCE, not the security. The server re-checks the session
 * cookie on every request (server/session.js → requireStudent / requireAdmin),
 * so a student who hand-edits the URL hash still cannot read or write data they
 * are not allowed to. Frontend rules hide screens; server rules protect data.
 * =============================================================================
 */
import { closeAllModals } from './modal';
import { allows, isLoggedIn, type AccessLevel } from './session';

export interface Scene {
  root: HTMLElement;
  destroy?: () => void;
}

export type RouteId =
  | 'login'
  | 'hub'
  | 'babyCry'
  | 'puzzle'
  | 'factFall'
  | 'hearts'
  | 'maze'
  | 'princess'
  | 'bingo';

/**
 * WHO MAY OPEN WHICH SCREEN.
 *
 *   login              public    – everybody (it is the door)
 *   hub + the 7 games  loggedIn  – any session: student, admin or practice mode.
 *                                  Admins are allowed in so a teacher can check a
 *                                  game; their rounds are simply not saved
 *                                  (POST /api/results is student-only).
 *
 * A future 'admin' dashboard route goes in this table with the 'admin' level and
 * nothing else has to change.
 */
export const ROUTE_ACCESS: Record<RouteId, AccessLevel> = {
  login: 'public',
  hub: 'loggedIn',
  babyCry: 'loggedIn',
  puzzle: 'loggedIn',
  factFall: 'loggedIn',
  hearts: 'loggedIn',
  maze: 'loggedIn',
  princess: 'loggedIn',
  bingo: 'loggedIn',
};

export interface Nav {
  go: (route: RouteId) => void;
  toHub: () => void;
  toLogin: () => void;
  /**
   * The screen the user asked for before being redirected to the login screen.
   * Reading it clears it, so the login screen can send them straight back to the
   * game they tapped instead of always dumping them on the hub.
   */
  takePending: () => RouteId | null;
}

export class Router {
  private current: Scene | null = null;
  private currentId: RouteId | null = null;
  private factories = new Map<RouteId, (nav: Nav) => Scene>();
  /** Where the user wanted to go before being sent to the login screen. */
  private pending: RouteId | null = null;
  readonly nav: Nav;

  constructor(private container: HTMLElement) {
    this.nav = {
      go: (route) => this.go(route),
      toHub: () => this.go('hub'),
      toLogin: () => this.go('login'),
      takePending: () => this.takePendingRoute(),
    };
  }

  register(route: RouteId, factory: (nav: Nav) => Scene): void {
    this.factories.set(route, factory);
  }

  /** Is this a route we know? (main.ts uses this instead of a second list.) */
  has(route: string): route is RouteId {
    return this.factories.has(route as RouteId);
  }

  /** Which screen is on display right now. */
  get route(): RouteId | null {
    return this.currentId;
  }

  /**
   * The route the user asked for before being redirected to the login screen.
   * Reading it clears it, so it can only be used once.
   */
  takePendingRoute(): RouteId | null {
    const route = this.pending;
    this.pending = null;
    return route;
  }

  go(route: RouteId): void {
    /* ---------- 1. access rules ---------- */
    const access = ROUTE_ACCESS[route] ?? 'loggedIn';
    if (!allows(access)) {
      if (route === 'login') return; // the login screen is public; never loops
      if (isLoggedIn()) {
        // Somebody IS logged in, just not with the role this screen needs (a
        // student typing #admin, say). Sending them to the login screen would
        // bounce straight back here, so they go somewhere safe instead. The
        // server refuses the same request anyway (requireAdmin / requireStudent).
        console.warn(`[router] "${route}" needs a ${access} session — staying on a safe screen`);
        if (route !== 'hub') this.go('hub');
        return;
      }
      // Not logged in at all: remember where they wanted to go, then show the door.
      this.pending = route;
      this.go('login');
      return;
    }
    if (route === 'login' && isLoggedIn()) {
      // Already logged in: no reason to sit on the login screen.
      const wanted = this.takePendingRoute();
      this.go(wanted && wanted !== 'login' ? wanted : 'hub');
      return;
    }

    /* ---------- 2. is the screen registered? ---------- */
    const factory = this.factories.get(route);
    if (!factory) {
      console.error(`[router] unknown route "${route}" — returning to hub`);
      if (route !== 'hub') this.go('hub');
      return;
    }

    /* ---------- 3. tear down the old screen, build the new one ---------- */
    // Any dialog belonging to the old scene must go with it.
    closeAllModals();
    // Tear down the previous scene first so nothing keeps running.
    try {
      this.current?.destroy?.();
    } catch (err) {
      console.warn('[router] destroy failed', err);
    }
    this.container.replaceChildren();

    let scene: Scene;
    try {
      scene = factory(this.nav);
    } catch (err) {
      console.error('[router] scene failed to start', err);
      if (route !== 'hub' && route !== 'login') {
        this.go('hub');
        return;
      }
      throw err;
    }

    this.current = scene;
    this.currentId = route;
    if (route !== 'login') this.pending = null; // we arrived; forget the intention
    scene.root.classList.add('scene--enter');
    this.container.appendChild(scene.root);
    // Update the hash so refresh/deep-links behave sensibly.
    if (location.hash.slice(1) !== route) {
      history.replaceState(null, '', `#${route}`);
    }
    window.scrollTo(0, 0);
  }

  start(defaultRoute: RouteId = 'hub'): void {
    const fromHash = location.hash.slice(1) as RouteId;
    this.go(this.factories.has(fromHash) ? fromHash : defaultRoute);
  }
}
