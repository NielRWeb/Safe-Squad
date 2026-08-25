/**
 * Minimal scene router. Each screen returns a root element plus a destroy()
 * hook so timers, animation loops and listeners are always cleaned up.
 */
import { closeAllModals } from './modal';

export interface Scene {
  root: HTMLElement;
  destroy?: () => void;
}

export type RouteId =
  | 'hub'
  | 'babyCry'
  | 'puzzle'
  | 'factFall'
  | 'hearts'
  | 'maze'
  | 'princess'
  | 'bingo';

export interface Nav {
  go: (route: RouteId) => void;
  toHub: () => void;
}

export class Router {
  private current: Scene | null = null;
  private factories = new Map<RouteId, (nav: Nav) => Scene>();
  readonly nav: Nav;

  constructor(private container: HTMLElement) {
    this.nav = {
      go: (route) => this.go(route),
      toHub: () => this.go('hub'),
    };
  }

  register(route: RouteId, factory: (nav: Nav) => Scene): void {
    this.factories.set(route, factory);
  }

  go(route: RouteId): void {
    const factory = this.factories.get(route);
    if (!factory) {
      console.error(`[router] unknown route "${route}" — returning to hub`);
      if (route !== 'hub') this.go('hub');
      return;
    }
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
      if (route !== 'hub') {
        this.go('hub');
        return;
      }
      throw err;
    }

    this.current = scene;
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
