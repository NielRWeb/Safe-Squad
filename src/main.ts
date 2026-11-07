/**
 * SAFE SQUAD — application entry point.
 *
 * BOOTS IN FOUR STEPS:
 *   1. show a small "loading" panel (so a refresh is never a blank screen),
 *   2. ask the server whether this browser is still logged in (core/session.ts),
 *   3. open the right screen: the one in the URL if it is allowed, otherwise the
 *      hub — or the login screen when nobody is logged in,
 *   4. register the screens and keep the browser's hash in step with them.
 *
 * The route list lives in ONE place now (router.register + ROUTE_ACCESS); the
 * old hard-coded `known` array is gone, so adding a screen cannot half-work.
 */
import '../styles/main.css';
import { el } from './utils/dom';
import { Router } from './core/router';
import { createLoginScene } from './components/login';
import { createHubScene } from './components/hub';
import { createBabyCryScene } from './games/babyCry';
import { createPuzzleScene } from './games/puzzle';
import { createFactFallScene } from './games/factFall';
import { createHeartsScene } from './games/hearts';
import { createMazeScene } from './games/maze';
import { createPrincessScene } from './games/princess';
import { createBingoScene } from './games/bingo';
import { installAudioUnlock } from './core/audio';
import { onSessionChange, restore } from './core/session';

/** The brief panel shown while we ask the server who is logged in. */
function buildSplash(): HTMLElement {
  return el(
    'div',
    { class: 'boot', role: 'status', 'aria-live': 'polite' },
    el('strong', { text: 'SAFE SQUAD' }),
    el('span', { text: 'Getting things ready…' }),
  );
}

async function boot(): Promise<void> {
  const mount = document.getElementById('app');
  if (!mount) {
    console.error('[SAFE SQUAD] #app container missing');
    return;
  }

  installAudioUnlock();

  // Remember where the URL wanted to go BEFORE the router rewrites the hash.
  const wanted = location.hash.slice(1);
  mount.appendChild(buildSplash());

  const router = new Router(mount);
  router.register('login', createLoginScene);
  router.register('hub', createHubScene);
  router.register('babyCry', createBabyCryScene);
  router.register('puzzle', createPuzzleScene);
  router.register('factFall', createFactFallScene);
  router.register('hearts', createHeartsScene);
  router.register('maze', createMazeScene);
  router.register('princess', createPrincessScene);
  router.register('bingo', createBingoScene);

  /* ---------- who is logged in? ---------- */
  // restore() never throws: no login, an expired login and "server not running"
  // all come back as null, and each one has a screen that can handle it.
  const user = await restore();

  // Building the first scene also removes the splash (Router clears #app).
  if (user) {
    router.go(router.has(wanted) ? wanted : 'hub');
  } else {
    // Keep the requested route so the login screen can return there afterwards.
    if (router.has(wanted) && wanted !== 'login') router.go(wanted); // → bounces to login
    else router.go('login');
  }

  /* ---------- a login that ends mid-game ---------- */
  // Sessions live in the server's memory and expire, so any screen can find
  // itself logged out while it is open. When that happens, go to the login
  // screen — never leave a student on a screen that can no longer save anything.
  onSessionChange((session) => {
    if (session) return;
    if (router.route && router.route !== 'login') router.go('login');
  });

  // Browser hash changes (a typed #bingo, a bookmark, a shared link).
  window.addEventListener('hashchange', () => {
    const route = location.hash.slice(1);
    // router.has() is a type guard: unknown hashes are ignored, known ones are
    // still checked against the access rules inside router.go().
    if (router.has(route)) router.go(route);
  });

  // Keep the real viewport height on mobile browsers with dynamic toolbars.
  const setVh = (): void =>
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', () => window.setTimeout(setVh, 200));
}

// Never let a single failure leave the student with a blank screen.
window.addEventListener('error', (ev) => console.warn('[SAFE SQUAD] runtime error', ev.error));
window.addEventListener('unhandledrejection', (ev) =>
  console.warn('[SAFE SQUAD] promise rejection', ev.reason),
);

void boot();
