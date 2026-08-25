/**
 * SAFE SQUAD — application entry point.
 * Registers the four screens and boots the router.
 */
import '../styles/main.css';
import { Router, type RouteId } from './core/router';
import { createHubScene } from './components/hub';
import { createBabyCryScene } from './games/babyCry';
import { createPuzzleScene } from './games/puzzle';
import { createFactFallScene } from './games/factFall';
import { createHeartsScene } from './games/hearts';
import { createMazeScene } from './games/maze';
import { createPrincessScene } from './games/princess';
import { createBingoScene } from './games/bingo';
import { installAudioUnlock } from './core/audio';

function boot(): void {
  const mount = document.getElementById('app');
  if (!mount) {
    console.error('[SAFE SQUAD] #app container missing');
    return;
  }

  installAudioUnlock();

  const router = new Router(mount);
  router.register('hub', createHubScene);
  router.register('babyCry', createBabyCryScene);
  router.register('puzzle', createPuzzleScene);
  router.register('factFall', createFactFallScene);
  router.register('hearts', createHeartsScene);
  router.register('maze', createMazeScene);
  router.register('princess', createPrincessScene);
  router.register('bingo', createBingoScene);
  router.start('hub');

  // Browser back/forward should move between hub and games, never break the app.
  window.addEventListener('hashchange', () => {
    const route = location.hash.slice(1);
    const known: RouteId[] = ['hub', 'babyCry', 'puzzle', 'factFall', 'hearts', 'maze', 'princess', 'bingo'];
    if ((known as string[]).includes(route)) router.go(route as RouteId);
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

boot();
