/**
 * SAFE SQUAD — Audio Manager
 * -----------------------------------------------------------------------------
 * All music and sound effects are generated in the browser with the Web Audio
 * API, so the project ships with zero copyrighted assets and zero downloads.
 * Every sound is a small, cartoon-style synth patch.
 *
 * Public API:
 *   audio.unlock()                   – call on first user gesture
 *   audio.sfx('correct')             – one-shot effect
 *   audio.music('hub')  / .stopMusic()
 *   audio.startEngine() / .stopEngine() / .revEngine()
 *   audio.setMusicEnabled(bool) / setSfxEnabled(bool) / setVolume(0..1)
 *
 * Replace any sound with a real file via src/audio/manifest.ts.
 */
import { settings } from './state';
import { SFX_FILES, MUSIC_FILES } from '../audio/manifest';

export type SfxName =
  | 'click'
  | 'back'
  | 'whoosh'
  | 'correct'
  | 'wrong'
  | 'snap'
  | 'pop'
  | 'appear'
  | 'fanfare'
  | 'sad'
  | 'babyCoo'
  | 'babyFuss'
  | 'babyCry'
  | 'babyTantrum'
  | 'momCalm'
  | 'momGasp'
  | 'crash'
  | 'flatTyre'
  | 'skid'
  | 'attack'
  | 'hurt'
  | 'jump'
  | 'coin'
  | 'boxOpen'
  | 'empty'
  | 'victory'
  | 'defeat'
  | 'chase';

export type MusicName = 'hub' | 'baby' | 'puzzle' | 'drive' | 'battle' | 'maze' | 'hero' | 'bingo';

type Wave = OscillatorType;

interface TrackDef {
  bpm: number;
  /** 16-step patterns; numbers are MIDI notes, null = rest. */
  bass: (number | null)[];
  lead: (number | null)[];
  pad: number[][];
  hats: number[];
  kick: number[];
  leadWave: Wave;
  bassWave: Wave;
  gain: number;
}

const midi = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

/* -------------------------------------------------------------------------- */
/* Music patterns — four short original loops, one per screen.                */
/* -------------------------------------------------------------------------- */
const TRACKS: Record<MusicName, TrackDef> = {
  // Bright, bouncy hub theme (A major-ish, playful)
  hub: {
    bpm: 104,
    bassWave: 'triangle',
    leadWave: 'square',
    gain: 0.9,
    bass: [45, null, 45, null, 52, null, 45, null, 47, null, 47, null, 54, null, 47, null],
    lead: [69, 71, 73, null, 76, null, 73, 71, 69, 71, 73, 76, 78, null, 76, null],
    pad: [
      [57, 61, 64],
      [59, 62, 66],
      [61, 64, 68],
      [57, 61, 64],
    ],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    kick: [0, 6, 8, 14],
  },
  // Warm, slow lullaby for the baby game
  baby: {
    bpm: 76,
    bassWave: 'sine',
    leadWave: 'triangle',
    gain: 0.75,
    bass: [
      48, null, null, null, 53, null, null, null, 55, null, null, null, 50, null, null, null,
    ],
    lead: [72, null, 76, null, 79, null, 76, null, 74, null, 72, null, 71, null, null, null],
    pad: [
      [60, 64, 67],
      [65, 69, 72],
      [67, 71, 74],
      [62, 65, 69],
    ],
    hats: [4, 12],
    kick: [0, 8],
  },
  // Curious, puzzle-box plucks
  puzzle: {
    bpm: 92,
    bassWave: 'triangle',
    leadWave: 'sine',
    gain: 0.8,
    bass: [43, null, 43, null, 48, null, 43, null, 46, null, 46, null, 50, null, 46, null],
    lead: [67, 70, 72, 70, 75, null, 72, 70, 67, 70, 72, 74, 75, null, 72, null],
    pad: [
      [55, 58, 62],
      [60, 63, 67],
      [58, 62, 65],
      [55, 58, 62],
    ],
    hats: [2, 6, 10, 14],
    kick: [0, 8, 11],
  },
  // Driving groove for Fact or Fall
  drive: {
    bpm: 122,
    bassWave: 'sawtooth',
    leadWave: 'square',
    gain: 0.72,
    bass: [40, 40, 47, 40, 45, 45, 52, 45, 43, 43, 50, 43, 45, 47, 48, 50],
    lead: [
      64, null, 67, null, 71, null, 67, null, 69, null, 72, null, 71, null, 67, null,
    ],
    pad: [
      [52, 55, 59],
      [57, 60, 64],
      [55, 59, 62],
      [52, 55, 59],
    ],
    hats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    kick: [0, 4, 7, 8, 12],
  },
  // Heroic march for the Save Your Hearts battle arena
  battle: {
    bpm: 116,
    bassWave: 'triangle',
    leadWave: 'square',
    gain: 0.8,
    bass: [41, null, 41, 48, 43, null, 43, 50, 45, null, 45, 52, 46, 48, 50, 52],
    lead: [65, null, 68, null, 72, 71, 68, null, 65, null, 70, null, 73, null, 70, null],
    pad: [
      [53, 56, 60],
      [55, 58, 62],
      [57, 60, 64],
      [53, 56, 60],
    ],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    kick: [0, 3, 6, 8, 11, 14],
  },
  // Tense but playful loop for the Choose & Escape maze
  maze: {
    bpm: 108,
    bassWave: 'sawtooth',
    leadWave: 'triangle',
    gain: 0.7,
    bass: [38, 38, null, 45, 38, null, 43, null, 40, 40, null, 47, 40, null, 45, null],
    lead: [62, 65, 67, 65, 70, null, 67, 65, 62, 65, 69, 65, 72, null, 67, null],
    pad: [
      [50, 53, 57],
      [52, 55, 59],
      [50, 53, 57],
      [55, 58, 62],
    ],
    hats: [1, 3, 5, 7, 9, 11, 13, 15],
    kick: [0, 6, 8, 12],
  },
  // Bouncy adventure theme for Save the Princess
  hero: {
    bpm: 132,
    bassWave: 'triangle',
    leadWave: 'square',
    gain: 0.72,
    bass: [43, 43, 50, 43, 48, 48, 55, 48, 45, 45, 52, 45, 47, 47, 54, 47],
    lead: [72, 76, 79, 76, 81, null, 79, 76, 74, 77, 81, 77, 83, null, 79, null],
    pad: [
      [55, 59, 62],
      [60, 64, 67],
      [57, 61, 64],
      [59, 62, 66],
    ],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    kick: [0, 4, 8, 12],
  },
  // Light, sparkly loop for the Bingo board
  bingo: {
    bpm: 96,
    bassWave: 'sine',
    leadWave: 'triangle',
    gain: 0.78,
    bass: [48, null, 55, null, 50, null, 57, null, 52, null, 59, null, 50, null, 55, null],
    lead: [76, 79, 83, 79, 84, null, 81, 79, 76, 79, 84, 81, 88, null, 84, null],
    pad: [
      [60, 64, 67],
      [62, 65, 69],
      [64, 67, 71],
      [59, 62, 67],
    ],
    hats: [2, 6, 10, 14],
    kick: [0, 8],
  },
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private currentTrack: MusicName | null = null;
  private pendingTrack: MusicName | null = null;
  private schedulerId = 0;
  private step = 0;
  private nextNoteTime = 0;

  private engine: { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private unlocked = false;

  /* ----------------------------- lifecycle ------------------------------ */

  /** Must be called from a user gesture (browser autoplay policy). */
  unlock(): void {
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') void ctx.resume();
      this.unlocked = true;
      if (this.pendingTrack) {
        const t = this.pendingTrack;
        this.pendingTrack = null;
        this.music(t);
      }
    } catch (err) {
      console.warn('[audio] unlock failed', err);
    }
  }

  private ensureCtx(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const Ctor: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = settings.volume;
      master.connect(ctx.destination);

      const musicBus = ctx.createGain();
      musicBus.gain.value = settings.music ? 0.32 : 0;
      musicBus.connect(master);

      const sfxBus = ctx.createGain();
      sfxBus.gain.value = settings.sfx ? 0.9 : 0;
      sfxBus.connect(master);

      this.ctx = ctx;
      this.master = master;
      this.musicBus = musicBus;
      this.sfxBus = sfxBus;
      this.noiseBuffer = this.makeNoise(ctx);
      void this.preloadFiles();
      return ctx;
    } catch (err) {
      console.warn('[audio] Web Audio unavailable — running silently', err);
      return null;
    }
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * 1.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Loads any user-supplied audio files listed in the manifest. */
  private async preloadFiles(): Promise<void> {
    const entries: [string, string][] = [
      ...Object.entries(SFX_FILES).map(([k, v]) => [`sfx:${k}`, v] as [string, string]),
      ...Object.entries(MUSIC_FILES).map(([k, v]) => [`music:${k}`, v] as [string, string]),
    ];
    for (const [key, url] of entries) {
      try {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        const ctx = this.ctx;
        if (!ctx) return;
        this.buffers.set(key, await ctx.decodeAudioData(arr));
      } catch (err) {
        console.warn(`[audio] could not load ${url} — using generated sound instead`, err);
      }
    }
  }

  /* ------------------------------ settings ------------------------------ */

  setVolume(v: number): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    this.master.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
  }

  setMusicEnabled(on: boolean): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.musicBus) return;
    this.musicBus.gain.setTargetAtTime(on ? 0.32 : 0, ctx.currentTime, 0.08);
    if (on && !this.currentTrack && this.pendingTrack) this.music(this.pendingTrack);
  }

  setSfxEnabled(on: boolean): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxBus) return;
    this.sfxBus.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.05);
  }

  /* ------------------------------- music -------------------------------- */

  music(name: MusicName): void {
    if (this.currentTrack === name) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.unlocked) {
      this.pendingTrack = name;
      return;
    }
    this.stopMusic();
    this.currentTrack = name;

    // A user-supplied file wins over the generated loop.
    const buf = this.buffers.get(`music:${name}`);
    if (buf && this.musicBus) {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(this.musicBus);
      src.start();
      this.fileMusic = src;
      return;
    }

    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.08;
    const track = TRACKS[name];
    const stepDur = 60 / track.bpm / 4; // 16th notes
    this.schedulerId = window.setInterval(() => {
      const c = this.ctx;
      if (!c) return;
      while (this.nextNoteTime < c.currentTime + 0.15) {
        this.scheduleStep(track, this.step, this.nextNoteTime);
        this.nextNoteTime += stepDur;
        this.step = (this.step + 1) % 16;
      }
    }, 40);
  }

  private fileMusic: AudioBufferSourceNode | null = null;

  stopMusic(): void {
    if (this.schedulerId) {
      clearInterval(this.schedulerId);
      this.schedulerId = 0;
    }
    if (this.fileMusic) {
      try {
        this.fileMusic.stop();
      } catch {
        /* already stopped */
      }
      this.fileMusic = null;
    }
    this.currentTrack = null;
  }

  private scheduleStep(track: TrackDef, step: number, time: number): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;
    const stepDur = 60 / track.bpm / 4;

    const bassNote = track.bass[step];
    if (bassNote !== null && bassNote !== undefined) {
      this.blip(midi(bassNote), time, stepDur * 1.6, track.bassWave, 0.16 * track.gain, bus, 700);
    }
    const leadNote = track.lead[step];
    if (leadNote !== null && leadNote !== undefined) {
      this.blip(midi(leadNote), time, stepDur * 1.3, track.leadWave, 0.075 * track.gain, bus, 2600);
    }
    if (step % 4 === 0) {
      const chord = track.pad[(step / 4) % track.pad.length];
      chord.forEach((n) =>
        this.blip(midi(n), time, stepDur * 3.6, 'sine', 0.05 * track.gain, bus, 1400),
      );
    }
    if (track.hats.includes(step)) this.noiseHit(time, 0.03, 7000, 0.05 * track.gain, bus);
    if (track.kick.includes(step)) this.kick(time, bus, 0.28 * track.gain);
  }

  /* ------------------------------- effects ------------------------------ */

  sfx(name: SfxName): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxBus) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const bus = this.sfxBus;
    const t = ctx.currentTime;

    const file = this.buffers.get(`sfx:${name}`);
    if (file) {
      const src = ctx.createBufferSource();
      src.buffer = file;
      src.connect(bus);
      src.start();
      return;
    }

    try {
      switch (name) {
        case 'click':
          this.blip(660, t, 0.07, 'square', 0.16, bus, 3000);
          this.blip(990, t + 0.03, 0.06, 'square', 0.09, bus, 4000);
          break;
        case 'back':
          this.blip(520, t, 0.08, 'triangle', 0.16, bus, 2400);
          this.blip(340, t + 0.05, 0.1, 'triangle', 0.12, bus, 1800);
          break;
        case 'whoosh':
          this.sweepNoise(t, 0.35, 400, 4200, 0.12, bus);
          break;
        case 'pop':
          this.slide(300, 900, t, 0.12, 'sine', 0.2, bus);
          break;
        case 'appear':
          [784, 1046, 1318].forEach((f, i) =>
            this.blip(f, t + i * 0.055, 0.14, 'triangle', 0.13, bus, 5000),
          );
          break;
        case 'correct':
          [659, 830, 988, 1318].forEach((f, i) =>
            this.blip(f, t + i * 0.07, 0.2, 'triangle', 0.16, bus, 6000),
          );
          break;
        case 'snap':
          this.blip(1200, t, 0.05, 'square', 0.14, bus, 6000);
          this.noiseHit(t, 0.05, 2600, 0.14, bus);
          this.blip(1600, t + 0.04, 0.16, 'sine', 0.12, bus, 7000);
          break;
        case 'wrong':
          this.blip(196, t, 0.16, 'sawtooth', 0.16, bus, 900);
          this.blip(185, t + 0.13, 0.24, 'sawtooth', 0.16, bus, 700);
          break;
        case 'sad':
          this.slide(420, 220, t, 0.5, 'triangle', 0.16, bus);
          break;
        case 'fanfare':
          [523, 659, 784, 1046, 1318].forEach((f, i) =>
            this.blip(f, t + i * 0.11, 0.34, 'square', 0.12, bus, 6000),
          );
          [523, 784, 1046].forEach((f) => this.blip(f, t + 0.55, 0.7, 'triangle', 0.11, bus, 5000));
          break;
        case 'babyCoo':
          this.voice(t, [560, 720, 640], 0.5, 0.12, bus, 6);
          break;
        case 'babyFuss':
          this.voice(t, [520, 430], 0.45, 0.15, bus, 9);
          this.voice(t + 0.4, [480, 400], 0.4, 0.12, bus, 9);
          break;
        case 'babyCry':
          this.cryWave(t, 3, 0.2, bus);
          break;
        case 'babyTantrum':
          this.cryWave(t, 5, 0.26, bus, 1.25);
          break;
        case 'momCalm':
          this.voice(t, [330, 300, 270], 0.75, 0.1, bus, 4);
          break;
        case 'momGasp':
          this.sweepNoise(t, 0.28, 900, 2600, 0.1, bus);
          this.slide(420, 620, t, 0.22, 'sine', 0.08, bus);
          break;
        case 'crash':
          this.noiseHit(t, 0.34, 900, 0.3, bus);
          this.blip(90, t, 0.35, 'square', 0.26, bus, 400);
          this.slide(300, 70, t + 0.03, 0.4, 'sawtooth', 0.14, bus);
          break;
        case 'flatTyre':
          this.sweepNoise(t, 0.9, 3000, 300, 0.16, bus);
          this.slide(260, 90, t + 0.1, 0.8, 'sawtooth', 0.1, bus);
          break;
        case 'skid':
          this.sweepNoise(t, 0.5, 1800, 700, 0.14, bus);
          break;
        case 'attack':
          this.slide(320, 1150, t, 0.16, 'square', 0.16, bus);
          this.noiseHit(t + 0.14, 0.12, 1800, 0.16, bus);
          this.blip(1400, t + 0.16, 0.12, 'triangle', 0.12, bus, 6000);
          break;
        case 'hurt':
          this.slide(520, 150, t, 0.34, 'sawtooth', 0.16, bus);
          this.noiseHit(t, 0.16, 700, 0.16, bus);
          break;
        case 'jump':
          this.slide(320, 780, t, 0.16, 'square', 0.12, bus);
          break;
        case 'coin':
          this.blip(1046, t, 0.08, 'square', 0.13, bus, 7000);
          this.blip(1568, t + 0.07, 0.22, 'square', 0.12, bus, 7000);
          break;
        case 'boxOpen':
          this.noiseHit(t, 0.1, 1400, 0.16, bus);
          this.slide(220, 520, t, 0.14, 'triangle', 0.13, bus);
          break;
        case 'empty':
          this.blip(300, t, 0.12, 'sine', 0.12, bus, 1200);
          this.blip(220, t + 0.1, 0.2, 'sine', 0.1, bus, 900);
          break;
        case 'victory':
          [659, 784, 988, 1318, 1568].forEach((f, i) =>
            this.blip(f, t + i * 0.1, 0.3, 'triangle', 0.13, bus, 6000),
          );
          break;
        case 'defeat':
          [392, 349, 311, 262].forEach((f, i) =>
            this.blip(f, t + i * 0.16, 0.34, 'sawtooth', 0.12, bus, 1600),
          );
          break;
        case 'chase':
          this.blip(180, t, 0.14, 'square', 0.1, bus, 800);
          this.blip(150, t + 0.13, 0.16, 'square', 0.1, bus, 700);
          break;
      }
    } catch (err) {
      console.warn('[audio] sfx failed', name, err);
    }
  }

  /** Layered cartoon "waa-waa" cry. Intensity 1..5. */
  private cryWave(t0: number, intensity: number, gain: number, bus: GainNode, rate = 1): void {
    const waas = Math.min(4, 1 + Math.floor(intensity / 1.6));
    for (let i = 0; i < waas; i++) {
      const start = t0 + (i * 0.38) / rate;
      const base = 520 + intensity * 40 + i * 25;
      this.voice(start, [base, base * 1.25, base * 0.85], 0.34 / rate, gain, bus, 12 + intensity * 2);
    }
  }

  /* --------------------------- driving engine --------------------------- */

  startEngine(): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxBus || this.engine) return;
    try {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 78;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      const gain = ctx.createGain();
      gain.gain.value = 0.0;
      osc.connect(filter).connect(gain).connect(this.sfxBus);
      osc.start();
      gain.gain.setTargetAtTime(0.055, ctx.currentTime, 0.3);
      this.engine = { osc, gain, filter };
    } catch (err) {
      console.warn('[audio] engine failed', err);
    }
  }

  /** speed 0..1 changes the engine pitch while driving. */
  setEngineSpeed(speed: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.engine) return;
    this.engine.osc.frequency.setTargetAtTime(70 + speed * 80, ctx.currentTime, 0.15);
    this.engine.gain.gain.setTargetAtTime(0.03 + speed * 0.05, ctx.currentTime, 0.2);
  }

  stopEngine(): void {
    const ctx = this.ctx;
    if (!ctx || !this.engine) return;
    const { osc, gain } = this.engine;
    this.engine = null;
    try {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* ignore */
    }
  }

  /* ---------------------------- synth helpers --------------------------- */

  private blip(
    freq: number,
    time: number,
    dur: number,
    wave: Wave,
    gain: number,
    dest: AudioNode,
    cutoff = 5000,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(filter).connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  private slide(
    from: number,
    to: number,
    time: number,
    dur: number,
    wave: Wave,
    gain: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(from, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  /** Vowel-ish voice used for the baby and mother — vibrato + formant filter. */
  private voice(
    time: number,
    pitches: number[],
    dur: number,
    gain: number,
    dest: AudioNode,
    vibrato = 8,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const seg = dur / pitches.length;
    pitches.forEach((p, i) => {
      if (i === 0) osc.frequency.setValueAtTime(p, time);
      else osc.frequency.linearRampToValueAtTime(p, time + seg * i);
    });

    // vibrato wobble = cartoon crying character
    const lfo = ctx.createOscillator();
    lfo.frequency.value = vibrato;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = pitches[0] * 0.05;
    lfo.connect(lfoGain).connect(osc.frequency);

    const formant = ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = 900;
    formant.Q.value = 3.5;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + dur * 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(formant).connect(g).connect(dest);
    osc.start(time);
    lfo.start(time);
    osc.stop(time + dur + 0.05);
    lfo.stop(time + dur + 0.05);
  }

  private noiseHit(
    time: number,
    dur: number,
    cutoff: number,
    gain: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(filter).connect(g).connect(dest);
    src.start(time);
    src.stop(time + dur + 0.05);
  }

  private sweepNoise(
    time: number,
    dur: number,
    from: number,
    to: number,
    gain: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, to), time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(filter).connect(g).connect(dest);
    src.start(time);
    src.stop(time + dur + 0.1);
  }

  private kick(time: number, dest: AudioNode, gain: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.13);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + 0.22);
  }
}

export const audio = new AudioManager();

/** Wires the first user gesture so browsers allow sound to start. */
export function installAudioUnlock(): void {
  const handler = () => {
    audio.unlock();
    audio.setVolume(settings.volume);
    audio.setMusicEnabled(settings.music);
    audio.setSfxEnabled(settings.sfx);
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach((evt) =>
    window.addEventListener(evt, handler, { once: false, passive: true }),
  );
}
