/**
 * Persistent settings + best scores.
 * localStorage is wrapped in try/catch: private browsing must not crash the game.
 */

export interface Settings {
  music: boolean;
  sfx: boolean;
  volume: number; // 0..1 master volume
}

export type GameId =
  | 'babyCry'
  | 'puzzle'
  | 'factFall'
  | 'hearts'
  | 'maze'
  | 'princess'
  | 'bingo';

export interface Progress {
  /** Best number of correct answers (out of 5) per game. */
  best: Partial<Record<GameId, number>>;
  /** How many rounds the student has completed per game. */
  plays: Partial<Record<GameId, number>>;
  /** True once the student has seen the hub tutorial. */
  seenIntro: boolean;
}

const SETTINGS_KEY = 'safesquad.settings.v1';
const PROGRESS_KEY = 'safesquad.progress.v1';

const defaultSettings: Settings = { music: true, sfx: true, volume: 0.75 };
const defaultProgress: Progress = { best: {}, plays: {}, seenIntro: false };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...fallback };
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return { ...fallback };
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — settings simply won't persist */
  }
}

export const settings: Settings = read(SETTINGS_KEY, defaultSettings);
export const progress: Progress = read(PROGRESS_KEY, defaultProgress);

type Listener = () => void;
const listeners = new Set<Listener>();

export function onStateChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(): void {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.warn('[state] listener failed', err);
    }
  });
}

export function saveSettings(patch: Partial<Settings>): void {
  Object.assign(settings, patch);
  write(SETTINGS_KEY, settings);
  emit();
}

export function recordResult(game: GameId, correct: number): void {
  progress.best[game] = Math.max(progress.best[game] ?? 0, correct);
  progress.plays[game] = (progress.plays[game] ?? 0) + 1;
  write(PROGRESS_KEY, progress);
  emit();
}

export function markIntroSeen(): void {
  progress.seenIntro = true;
  write(PROGRESS_KEY, progress);
}

export function resetProgress(): void {
  progress.best = {};
  progress.plays = {};
  progress.seenIntro = false;
  write(PROGRESS_KEY, progress);
  emit();
}
