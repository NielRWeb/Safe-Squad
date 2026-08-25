# assets/audio

Music and sound effects are generated at runtime by the Web Audio synthesiser in
`src/core/audio.ts`, so no audio files are required and nothing is copyrighted.

To use your own recordings, place them here and map them in `src/audio/manifest.ts`:

```ts
import correctUrl from '../../assets/audio/correct.mp3';
export const SFX_FILES = { correct: correctUrl };
```

Any sound you map replaces the generated one; the rest keep working.
