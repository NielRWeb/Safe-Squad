/**
 * OPTIONAL AUDIO FILE OVERRIDES
 * -----------------------------------------------------------------------------
 * SAFE SQUAD ships with 100% original, code-generated sound (Web Audio API), so
 * there are no copyrighted assets and nothing to download.
 *
 * If you would rather use your own recordings, drop the files into
 * `assets/audio/` and map them here. Anything listed below replaces the
 * generated version; anything left out keeps using the built-in synth.
 *
 *   import correctUrl from '../../assets/audio/correct.mp3';
 *   export const SFX_FILES: Partial<Record<SfxName, string>> = { correct: correctUrl };
 */
import type { SfxName, MusicName } from '../core/audio';

export const SFX_FILES: Partial<Record<SfxName, string>> = {};

export const MUSIC_FILES: Partial<Record<MusicName, string>> = {};
