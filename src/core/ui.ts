/**
 * Shared game UI: HUD, toasts, tip bubble, feedback banner,
 * settings dialog and the completion screen.
 * Every game composes these instead of re-implementing them.
 */
import { el, clear } from '../utils/dom';
import { icon } from '../art/icons';
import { audio } from './audio';
import { openHowTo, type HowToId } from './howto';
import { closeAllModals, openModal } from './modal';
import { settings, saveSettings, resetProgress, recordResult, type GameId } from './state';
import { completionBadge } from '../art/scenes';
import { mascotKaya } from '../art/characters';
import { checkChoice, checkYesNo, pickRandom, shuffledAnswers } from './quiz';
import type { AnyQuestion, ChoiceQuestion, YesNoQuestion } from '../data/questions';
import { tipsByGame } from '../data/questions';

/* ------------------------------------------------------------------ */
/* Sound buttons (shared by hub + games)                               */
/* ------------------------------------------------------------------ */
export function soundButtons(): HTMLElement[] {
  const musicBtn = el('button', {
    class: `icon-btn ${settings.music ? 'icon-btn--on' : ''}`,
    type: 'button',
    'aria-pressed': String(settings.music),
    'aria-label': 'Toggle background music',
    title: 'Music',
    html: settings.music ? icon('musicOn') : icon('musicOff'),
  });
  const sfxBtn = el('button', {
    class: `icon-btn ${settings.sfx ? 'icon-btn--on' : ''}`,
    type: 'button',
    'aria-pressed': String(settings.sfx),
    'aria-label': 'Toggle sound effects',
    title: 'Sound effects',
    html: settings.sfx ? icon('soundOn') : icon('soundOff'),
  });

  musicBtn.addEventListener('click', () => {
    saveSettings({ music: !settings.music });
    audio.setMusicEnabled(settings.music);
    musicBtn.innerHTML = settings.music ? icon('musicOn') : icon('musicOff');
    musicBtn.classList.toggle('icon-btn--on', settings.music);
    musicBtn.setAttribute('aria-pressed', String(settings.music));
    audio.sfx('click');
  });
  sfxBtn.addEventListener('click', () => {
    saveSettings({ sfx: !settings.sfx });
    audio.setSfxEnabled(settings.sfx);
    sfxBtn.innerHTML = settings.sfx ? icon('soundOn') : icon('soundOff');
    sfxBtn.classList.toggle('icon-btn--on', settings.sfx);
    sfxBtn.setAttribute('aria-pressed', String(settings.sfx));
    audio.sfx('click');
  });

  return [musicBtn, sfxBtn];
}

/* ------------------------------------------------------------------ */
/* Settings dialog                                                     */
/* ------------------------------------------------------------------ */
export function openSettings(): void {
  const makeSwitch = (
    label: string,
    hint: string,
    value: boolean,
    onChange: (v: boolean) => void,
  ): HTMLElement => {
    const sw = el('button', {
      class: 'switch',
      type: 'button',
      role: 'switch',
      'aria-checked': String(value),
      'aria-label': label,
    });
    sw.addEventListener('click', () => {
      const next = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(next));
      onChange(next);
      audio.sfx('click');
    });
    return el(
      'div',
      { class: 'setting-row' },
      el('div', { class: 'setting-row__text' }, el('strong', { text: label }), el('span', { text: hint })),
      sw,
    );
  };

  const slider = el('input', {
    type: 'range',
    min: '0',
    max: '100',
    value: String(Math.round(settings.volume * 100)),
    'aria-label': 'Master volume',
  }) as HTMLInputElement;
  slider.addEventListener('input', () => {
    const v = Number(slider.value) / 100;
    saveSettings({ volume: v });
    audio.setVolume(v);
  });

  openModal({
    title: 'Settings',
    body: [
      makeSwitch('Background music', 'Original chiptune loops', settings.music, (v) => {
        saveSettings({ music: v });
        audio.setMusicEnabled(v);
      }),
      makeSwitch('Sound effects', 'Buttons, characters and feedback', settings.sfx, (v) => {
        saveSettings({ sfx: v });
        audio.setSfxEnabled(v);
      }),
      el(
        'div',
        { class: 'setting-row' },
        el(
          'div',
          { class: 'setting-row__text' },
          el('strong', { text: 'Volume' }),
          el('span', { text: 'Master level for music and effects' }),
        ),
        slider,
      ),
      el(
        'div',
        { class: 'setting-row' },
        el(
          'div',
          { class: 'setting-row__text' },
          el('strong', { text: 'Reset progress' }),
          el('span', { text: 'Clears best scores saved on this device' }),
        ),
        (() => {
          const b = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Reset' });
          b.addEventListener('click', () => {
            resetProgress();
            audio.sfx('back');
            b.textContent = 'Cleared';
            b.setAttribute('disabled', 'true');
          });
          return b;
        })(),
      ),
    ],
    actions: [{ label: 'Done', variant: 'mint' }],
  });
}

/* ------------------------------------------------------------------ */
/* HUD                                                                 */
/* ------------------------------------------------------------------ */
export interface HudOptions {
  onBack: () => void;
  howTo: HowToId;
  total: number;
  /** Ask "are you sure?" before leaving a round in progress (default: true). */
  confirmExit?: boolean;
}

export class Hud {
  readonly root: HTMLElement;
  private fill: HTMLElement;
  private label: HTMLElement;

  constructor(opts: HudOptions) {
    const back = el('button', {
      class: 'btn hud__back',
      type: 'button',
      'aria-label': 'Return to the game hub',
      html: `${icon('arrowLeft')}<span>Return to Hub</span>`,
    });
    back.addEventListener('click', () => {
      audio.sfx('back');
      if (opts.confirmExit === false) {
        opts.onBack();
        return;
      }
      confirmLeave(opts.onBack);
    });

    this.fill = el('div', { class: 'progress__fill' });
    this.label = el('div', { class: 'progress__label', text: `Question 1 / ${opts.total}` });
    const progress = el(
      'div',
      {
        class: 'progress',
        role: 'progressbar',
        'aria-valuemin': '1',
        'aria-valuemax': String(opts.total),
        'aria-valuenow': '1',
      },
      this.label,
      el('div', { class: 'progress__track' }, this.fill),
    );

    const help = el('button', {
      class: 'icon-btn',
      type: 'button',
      'aria-label': 'How to play',
      title: 'How to play',
      html: icon('question'),
    });
    help.addEventListener('click', () => {
      audio.sfx('click');
      openHowTo(opts.howTo);
    });

    this.root = el(
      'div',
      { class: 'hud' },
      back,
      el('div', { class: 'hud__spacer' }),
      progress,
      el('div', { class: 'hud__spacer' }),
      help,
      ...soundButtons(),
    );
  }

  setProgress(index: number, total: number): void {
    this.label.textContent = `Question ${index} / ${total}`;
    this.fill.style.width = `${(index / total) * 100}%`;
    this.root.querySelector('.progress')?.setAttribute('aria-valuenow', String(index));
  }

  /**
   * Free-form progress for games that are NOT a fixed five-question run
   * (battle progress, level progress, pattern progress …).
   * `ratio` is 0..1 and drives the same progress bar.
   */
  setLabel(text: string, ratio: number): void {
    this.label.textContent = text;
    this.fill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    const bar = this.root.querySelector('.progress');
    bar?.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    bar?.setAttribute('aria-valuemin', '0');
    bar?.setAttribute('aria-valuemax', '100');
    bar?.setAttribute('aria-label', text);
  }
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */
export class Toast {
  readonly root = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
  private timer = 0;

  show(text: string, kind: 'good' | 'bad' | 'plain' = 'plain', ms = 2200): void {
    this.root.textContent = text;
    this.root.className = `toast is-show${kind === 'plain' ? '' : ` toast--${kind}`}`;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.root.classList.remove('is-show'), ms);
  }

  hide(): void {
    this.root.classList.remove('is-show');
  }
}

/* ------------------------------------------------------------------ */
/* Tip system                                                          */
/* ------------------------------------------------------------------ */
export class TipBubble {
  readonly root: HTMLElement;
  private textEl: HTMLElement;
  private timer = 0;
  private shownCount = 0;

  constructor(
    private gameId: keyof typeof tipsByGame,
    placement: 'bottom' | 'top' = 'bottom',
  ) {
    const bulb = el('div', { class: 'tip__icon', 'aria-hidden': 'true' });
    bulb.innerHTML = `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#ffe08a"/>
      <path d="M24 10a10 10 0 0 0-6 18c.9.7 1.4 1.7 1.4 2.8V32h9.2v-1.2c0-1.1.5-2.1 1.4-2.8A10 10 0 0 0 24 10z" fill="#fff6d6" stroke="#e0a92a" stroke-width="2.4"/>
      <path d="M20 35h8M21.5 38.5h5" stroke="#e0a92a" stroke-width="3" stroke-linecap="round"/></svg>`;
    this.textEl = el('p', { class: 'tip__text' });
    const close = el('button', {
      class: 'tip__close',
      type: 'button',
      'aria-label': 'Dismiss tip',
      text: '✕',
    });
    close.addEventListener('click', () => this.hide());
    this.root = el(
      'div',
      { class: `tip${placement === 'top' ? ' tip--top' : ''}`, role: 'status', 'aria-live': 'polite' },
      bulb,
      this.textEl,
      close,
    );
  }

  /** Always shows the next coaching tip (used after a wrong answer). */
  nudge(): void {
    const tips = tipsByGame[this.gameId] ?? [];
    if (!tips.length) return;
    this.show(tips[this.shownCount++ % tips.length]);
  }

  /** Called after every wrong answer — shows a tip from the 2nd mistake on. */
  maybeShow(totalWrong: number): void {
    if (totalWrong < 2) return;
    const tips = tipsByGame[this.gameId] ?? [];
    if (!tips.length) return;
    const tip = tips[this.shownCount % tips.length];
    this.shownCount++;
    this.show(tip);
  }

  show(text: string, ms = 6500): void {
    this.textEl.textContent = text;
    this.root.classList.add('is-show');
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.hide(), ms);
  }

  hide(): void {
    this.root.classList.remove('is-show');
  }
}

/* ------------------------------------------------------------------ */
/* Feedback banner                                                     */
/* ------------------------------------------------------------------ */
export interface FeedbackAction {
  label: string;
  variant?: string;
  onClick: () => void;
}

export class Feedback {
  readonly root = el('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  private titleEl = el('div', { class: 'feedback__title' });
  private textEl = el('p', { class: 'feedback__text' });
  private actionsEl = el('div', { class: 'feedback__actions' });

  constructor() {
    this.root.append(this.titleEl, this.textEl, this.actionsEl);
  }

  show(good: boolean, title: string, text: string, actions: FeedbackAction[]): void {
    this.root.classList.toggle('feedback--bad', !good);
    this.titleEl.innerHTML = `${good ? icon('check') : icon('cross')}<span>${title}</span>`;
    this.textEl.textContent = text;
    clear(this.actionsEl);
    actions.forEach((a) => {
      const btn = el('button', {
        class: `btn ${a.variant ?? (good ? '' : 'btn--coral')}`,
        type: 'button',
        text: a.label,
      });
      btn.addEventListener('click', () => {
        audio.sfx('click');
        a.onClick();
      });
      this.actionsEl.appendChild(btn);
    });
    this.root.classList.add('is-show');
    window.setTimeout(() => this.actionsEl.querySelector('button')?.focus(), 220);
  }

  hide(): void {
    this.root.classList.remove('is-show');
  }
}

/* ------------------------------------------------------------------ */
/* Completion screen                                                   */
/* ------------------------------------------------------------------ */
export interface CompletionOptions {
  gameId: GameId;
  gameTitle: string;
  correct: number;
  total: number;
  onReplay: () => void;
  onHub: () => void;
  /** Optional extra line, e.g. "You completed the picture!" */
  extraLine?: string;
  /** Official completion message of the category that was played. */
  message?: string;
  /** Category name, shown as a chip above the message. */
  categoryName?: string;
  /** Overrides the headline (e.g. "Game over" instead of "Round complete!"). */
  title?: string;
}

export function buildCompletion(opts: CompletionOptions): HTMLElement {
  const { correct, total } = opts;
  recordResult(opts.gameId, correct);
  audio.sfx(correct >= Math.ceil(total * 0.6) ? 'fanfare' : 'sad');

  const ratio = total ? correct / total : 0;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;
  // The official guidance for the category that was just played.
  const message =
    opts.message ??
    'Remember: if something feels unsafe, tell a trusted teacher, guidance counsellor or parent.';

  const badge = el('div', { class: 'complete__badge', 'aria-hidden': 'true' });
  badge.innerHTML = completionBadge(stars);

  const starRow = el('div', { class: 'complete__stars', 'aria-hidden': 'true' });
  for (let i = 1; i <= 3; i++) {
    const s = el('div', { style: { color: i <= stars ? '#ffc93c' : '#dfe6f0' } });
    s.innerHTML = icon('star');
    starRow.appendChild(s);
  }

  const replay = el('button', { class: 'btn btn--sun', type: 'button', text: 'Play again' });
  replay.addEventListener('click', () => {
    audio.sfx('click');
    // wipe any alert that might still belong to the finished round
    closeAllModals();
    layer.remove();
    opts.onReplay();
  });
  const hub = el('button', { class: 'btn btn--ghost', type: 'button', text: '← Return to Hub' });
  hub.addEventListener('click', () => {
    audio.sfx('back');
    closeAllModals();
    layer.remove();
    opts.onHub();
  });

  const card = el(
    'div',
    { class: 'complete__card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Round complete' },
    badge,
    el('h2', { text: opts.title ?? (correct === total ? 'Perfect round!' : 'Round complete!') }),
    starRow,
    el(
      'div',
      { class: 'complete__score' },
      el('b', { text: String(correct) }),
      el('span', { text: `/ ${total} correct` }),
    ),
    opts.categoryName
      ? el('span', { class: 'complete__cat', text: opts.categoryName })
      : el('span', { class: 'sr-only', text: 'Round summary' }),
    opts.extraLine ? el('p', { class: 'complete__extra', text: opts.extraLine }) : el('span'),
    el('p', { class: 'complete__msg', text: message }),
    el('div', { class: 'complete__actions' }, replay, hub),
  );

  const layer = el('div', { class: 'complete' }, confetti(stars > 0), card);
  window.setTimeout(() => replay.focus(), 300);
  return layer;
}

function confetti(active: boolean): HTMLElement {
  const box = el('div', { class: 'confetti', 'aria-hidden': 'true' });
  if (!active) return box;
  const colors = ['#ffc93c', '#2fd6c0', '#ff6f61', '#7b61ff', '#63c6ff', '#7ed99b'];
  for (let i = 0; i < 34; i++) {
    const bit = document.createElement('i');
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.animationDuration = `${2.4 + Math.random() * 2.4}s`;
    bit.style.animationDelay = `${Math.random() * 1.6}s`;
    bit.style.transform = `rotate(${Math.random() * 180}deg)`;
    box.appendChild(bit);
  }
  return box;
}

/** Small decorative mascot used on game intro overlays. */
export function mascotNode(size = 120): HTMLElement {
  const box = el('div', { style: { width: `${size}px`, margin: '0 auto' }, 'aria-hidden': 'true' });
  box.innerHTML = mascotKaya('happy');
  return box;
}

/* ------------------------------------------------------------------ */
/* Pre-game intro (gives "How to Play" before every game starts)        */
/* ------------------------------------------------------------------ */
export function showGameIntro(
  title: string,
  blurb: string,
  howTo: HowToId,
  onStart: () => void,
): void {
  let started = false;
  const start = (): void => {
    if (started) return;
    started = true;
    onStart();
  };
  openModal({
    title,
    body: [mascotNode(120), blurb],
    actions: [
      {
        label: 'How to Play',
        variant: 'ghost',
        closeAfter: false,
        onClick: () => openHowTo(howTo),
      },
      { label: 'Start round', variant: 'mint', onClick: start },
    ],
    // Dismissing the dialog (X, Escape, backdrop) also starts the round,
    // so a student can never get stuck on a paused screen.
    onClose: start,
  });
}


/* ------------------------------------------------------------------ */
/* Alert-style confirmation dialog (used by "Return to Hub")           */
/* ------------------------------------------------------------------ */
export interface ConfirmOptions {
  title: string;
  text: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Illustration shown above the text. */
  art?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function confirmDialog(opts: ConfirmOptions): void {
  const art = el('div', { class: 'alert__art', 'aria-hidden': 'true' });
  art.innerHTML = opts.art ?? mascotKaya('think');

  openModal({
    title: opts.title,
    className: 'modal--alert',
    body: [art, el('p', { class: 'alert__text', text: opts.text })],
    actions: [
      {
        label: opts.cancelLabel ?? 'Cancel',
        variant: 'ghost',
        onClick: () => opts.onCancel?.(),
      },
      { label: opts.confirmLabel, variant: 'coral', onClick: () => opts.onConfirm() },
    ],
  });
}

/** Standard "leave the round?" confirmation shared by all three games. */
export function confirmLeave(onConfirm: () => void): void {
  confirmDialog({
    title: 'Return to Hub?',
    text: 'Your progress in this round will be lost. Are you sure you want to leave the game?',
    confirmLabel: 'Yes, return to Hub',
    cancelLabel: 'Cancel, keep playing',
    onConfirm,
  });
}

/* ------------------------------------------------------------------ */
/* Mistake coach — one popup when the student crosses 3 mistakes       */
/* ------------------------------------------------------------------ */
/**
 * Tracks mistakes for the CURRENT round only (a new instance is created by every
 * game scene, so nothing carries over between mini-games). The encouraging popup
 * fires when the counter crosses the threshold and then only again after another
 * full threshold of mistakes, so it never spams the player.
 */
export class MistakeCoach {
  private nextTrigger: number;
  private disposed = false;
  /** Closes the alert this coach opened — guarantees only ONE is ever live. */
  private closeCurrent: (() => void) | null = null;

  constructor(
    private gameId: keyof typeof tipsByGame,
    private howTo: HowToId,
    private threshold = 3,
  ) {
    this.nextTrigger = threshold;
  }

  /** Stops the coach for good — called when its scene is destroyed. */
  dispose(): void {
    this.disposed = true;
    this.closeCurrent?.();
    this.closeCurrent = null;
  }

  /** Call with the running mistake count for this round. */
  register(mistakes: number, onClose?: () => void): boolean {
    if (this.disposed || mistakes < this.nextTrigger) return false;
    this.nextTrigger = mistakes + this.threshold;
    // Skip "open How to Play" style tips here — that is already a button below.
    const tips = (tipsByGame[this.gameId] ?? []).filter((t) => !/how to play/i.test(t));
    const tip = pickRandom(tips, 'Take a moment and think about what keeps a child safe.');

    const art = el('div', { class: 'alert__art', 'aria-hidden': 'true' });
    art.innerHTML = mascotKaya('think');

    audio.sfx('appear');
    // never stack two coaching alerts
    this.closeCurrent?.();
    this.closeCurrent = openModal({
      title: 'Need a little help?',
      className: 'modal--alert',
      body: [
        art,
        el('p', {
          class: 'alert__text',
          text: `You have missed ${mistakes} questions in this round. That is completely normal — this is how you learn to spot the warning signs.`,
        }),
        el('div', { class: 'alert__tip' }, el('strong', { text: 'Tip · ' }), el('span', { text: tip })),
      ],
      actions: [
        {
          label: 'Open How to Play',
          variant: 'ghost',
          closeAfter: false,
          onClick: () => openHowTo(this.howTo),
        },
        { label: 'Got it — keep going', variant: 'mint' },
      ],
      onClose: () => {
        this.closeCurrent = null;
        onClose?.();
      },
    });
    return true;
  }
}


/* ------------------------------------------------------------------ */
/* Reusable question overlay                                           */
/* ------------------------------------------------------------------ */
/**
 * The shared "a question is being asked" panel used by Save Your Hearts,
 * Save the Princess and Bingo. It renders YES/NO questions or multiple-choice
 * questions (plain answer text — never A/B/C labels) and reports the result
 * back to the game, which decides what happens next.
 */
export interface AskOptions {
  /** Adds a ✕ that hides the panel (games pair this with a "See Q&A" button). */
  closable?: boolean;
  onClose?: () => void;
  /** Small caption above the question, e.g. "Star 3 of 5". */
  caption?: string;
  /** Extra class on the card, for per-game theming. */
  className?: string;
}

export class QuestionOverlay {
  readonly root = el('div', { class: 'qoverlay', hidden: 'true' });
  private current: AnyQuestion | null = null;
  private lastOpts: AskOptions = {};
  private lastHandler: ((correct: boolean, chosen: string) => void) | null = null;

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Asks a question. The handler runs once, after the student answers. */
  ask(
    q: AnyQuestion,
    onAnswer: (correct: boolean, chosen: string) => void,
    opts: AskOptions = {},
  ): void {
    this.current = q;
    this.lastOpts = opts;
    this.lastHandler = onAnswer;

    const panel = el('div', { class: `qpanel qoverlay__panel ${opts.className ?? ''}` });
    if (opts.closable) {
      const close = el('button', {
        class: 'icon-btn qoverlay__close',
        type: 'button',
        'aria-label': 'Hide the question',
        title: 'Hide question',
        html: icon('close'),
      });
      close.addEventListener('click', () => {
        audio.sfx('back');
        this.hide();
        opts.onClose?.();
      });
      panel.appendChild(close);
    }
    if (opts.caption) panel.appendChild(el('span', { class: 'qoverlay__caption', text: opts.caption }));
    panel.appendChild(el('span', { class: 'qpanel__topic', text: q.topic }));
    panel.appendChild(
      el('p', { class: 'qpanel__text', role: 'heading', 'aria-level': '2', text: q.question }),
    );

    const list = el('div', { class: 'opt-list' });
    const buttons: HTMLButtonElement[] = [];
    const finish = (correct: boolean, chosen: string, btn: HTMLButtonElement): void => {
      buttons.forEach((b) => (b.disabled = true));
      btn.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (!correct) {
        const rightText = 'answers' in q ? (q as ChoiceQuestion).correctAnswer : (q as YesNoQuestion).correct;
        buttons
          .find((b) => b.dataset.answer === rightText)
          ?.classList.add('is-correct');
      }
      audio.sfx(correct ? 'correct' : 'wrong');
      onAnswer(correct, chosen);
    };

    if ('answers' in q) {
      const choice = q as ChoiceQuestion;
      shuffledAnswers(choice).forEach((opt) => {
        const btn = el('button', { class: 'btn opt-btn', type: 'button' }) as HTMLButtonElement;
        btn.dataset.answer = opt;
        btn.append(el('span', { class: 'opt-text', text: opt }));
        btn.addEventListener('click', () => finish(checkChoice(choice, opt), opt, btn));
        buttons.push(btn);
        list.appendChild(btn);
      });
    } else {
      const yn = q as YesNoQuestion;
      (['YES', 'NO'] as const).forEach((val) => {
        const btn = el('button', {
          class: `btn answer-btn${val === 'NO' ? ' answer-btn--no' : ''}`,
          type: 'button',
          html: `${icon(val === 'YES' ? 'check' : 'cross')}<span>${val}</span>`,
          'aria-label': `Answer ${val.toLowerCase()}`,
        }) as HTMLButtonElement;
        btn.dataset.answer = val;
        btn.addEventListener('click', () => finish(checkYesNo(yn, val), val, btn));
        buttons.push(btn);
        list.appendChild(btn);
      });
      list.classList.add('opt-list--yesno');
    }

    panel.appendChild(list);
    this.root.replaceChildren(el('div', { class: 'qoverlay__card' }, panel));
    this.root.hidden = false;
    window.setTimeout(() => buttons[0]?.focus(), 180);
  }

  /** Re-opens the last question (used by "See Q&A" style buttons). */
  reopen(): void {
    if (this.current && this.lastHandler) this.ask(this.current, this.lastHandler, this.lastOpts);
  }

  hide(): void {
    this.root.hidden = true;
    this.root.replaceChildren();
  }
}
