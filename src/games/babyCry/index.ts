/**
 * GAME 1 — DON'T MAKE THE BABY CRY
 * A YES/NO game where the characters carry the feedback:
 * the baby's mood drops one stage for every wrong answer
 * (calm → sad → upset → crying → distressed → tantrum).
 */
import { el, svgBox, on, TimerPool } from '../../utils/dom';
import { icon } from '../../art/icons';
import { nurseryBackground } from '../../art/scenes';
import { motherAndBaby } from '../../art/characters';
import { audio } from '../../core/audio';
import { closeAllModals } from '../../core/modal';
import {
  Feedback,
  Hud,
  MistakeCoach,
  TipBubble,
  Toast,
  buildCompletion,
  showGameIntro,
} from '../../core/ui';
import { QuizSession, checkYesNo, pickRandom } from '../../core/quiz';
import { encouragements } from '../../data/questions';
import type { Nav, Scene } from '../../core/router';

const MOOD_LABELS = [
  'Baby is calm',
  'Baby is sad',
  'Baby is upset',
  'Baby is crying',
  'Baby is very upset',
  'Baby tantrum!',
];

export function createBabyCryScene(nav: Nav): Scene {
  audio.music('baby');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  /** Official rule: three mistakes in the whole round end the game. */
  const MAX_MISTAKES = 3;
  const ANSWER_SECONDS = 25;
  const hud = new Hud({ onBack: nav.toHub, howTo: 'babyCry', total: session.total });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('babyCry');
  const coach = new MistakeCoach('babyCry', 'babyCry');

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game baby', 'aria-label': "Don't Make the Baby Cry" });
  root.appendChild(svgBox(nurseryBackground(), 'game__bg'));

  /* ---------- characters ---------- */
  const charsBox = el('div', { class: 'baby__chars' });
  charsBox.innerHTML = motherAndBaby();
  const chars = charsBox.querySelector('svg') as SVGElement;

  /* ---------- countdown timer ---------- */
  const timerFill = el('div', { class: 'baby__timerfill' });
  const timerText = el('span', { class: 'baby__timertext' });
  const timerBar = el(
    'div',
    { class: 'baby__timer', role: 'timer', 'aria-live': 'off' },
    el('span', { class: 'baby__timerlabel', text: 'TIME' }),
    el('div', { class: 'baby__timertrack' }, timerFill),
    timerText,
  );

  /* ---------- mood meter ---------- */
  const moodFill = el('div', { class: 'progress__fill' });
  const moodText = el('span', { text: MOOD_LABELS[0] });
  const moodBar = el(
    'div',
    { class: 'baby__moodbar', role: 'status', 'aria-live': 'polite' },
    moodText,
    el('div', { class: 'progress__track' }, moodFill),
  );

  /* ---------- question panel ---------- */
  const topicEl = el('span', { class: 'qpanel__topic' });
  const questionEl = el('p', { class: 'qpanel__text', role: 'heading', 'aria-level': '2' });
  const panel = el('div', { class: 'qpanel' }, topicEl, questionEl);

  const yesBtn = el('button', {
    class: 'btn answer-btn',
    type: 'button',
    html: `${icon('check')}<span>YES</span><small>SAFE / TRUE</small>`,
    'aria-label': 'Answer yes',
  });
  const noBtn = el('button', {
    class: 'btn answer-btn answer-btn--no',
    type: 'button',
    html: `${icon('cross')}<span>NO</span><small>UNSAFE / FALSE</small>`,
    'aria-label': 'Answer no',
  });
  const answers = el('div', { class: 'baby__answers' }, yesBtn, noBtn);

  const stage = el(
    'div',
    { class: 'game__stage' },
    el(
      'div',
      { class: 'baby__layout' },
      charsBox,
      el('div', { class: 'baby__panelwrap' }, moodBar, timerBar, panel, answers),
    ),
  );

  root.append(hud.root, stage, tip.root, toast.root, feedback.root);

  /* ---------- game logic ---------- */
  let locked = true; // locked until the intro dialog is dismissed
  let finished = false;
  let mistakes = 0; // persists across questions — never reset per question
  let timeLeft = ANSWER_SECONDS;
  let tickId = 0;

  function stopTimer(): void {
    if (tickId) {
      window.clearInterval(tickId);
      tickId = 0;
    }
  }

  function renderTimer(): void {
    timerText.textContent = `${Math.ceil(Math.max(0, timeLeft))}s`;
    timerFill.style.width = `${(Math.max(0, timeLeft) / ANSWER_SECONDS) * 100}%`;
    timerBar.classList.toggle('is-urgent', timeLeft <= 6);
  }

  function startTimer(): void {
    stopTimer();
    timeLeft = ANSWER_SECONDS;
    renderTimer();
    tickId = window.setInterval(() => {
      if (locked || finished) return;
      timeLeft -= 0.1;
      renderTimer();
      if (timeLeft <= 0) {
        stopTimer();
        timeUp();
      }
    }, 100);
  }

  function updateChances(): void {
    hud.setLabel(
      `Question ${session.humanIndex} / ${session.total} · chances ${MAX_MISTAKES - mistakes}/${MAX_MISTAKES}`,
      session.humanIndex / session.total,
    );
  }

  function setMood(level: number): void {
    const lvl = Math.max(0, Math.min(5, level));
    chars.setAttribute('class', `chars mood-${lvl}`);
    moodText.textContent = MOOD_LABELS[lvl];
    moodFill.style.width = `${100 - lvl * 20}%`;
  }

  function renderQuestion(): void {
    const q = session.current;
    topicEl.textContent = q.topic;
    questionEl.textContent = q.question;
    updateChances();
    panel.animate(
      [
        { opacity: 0, transform: 'translateY(14px) scale(.97)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
    yesBtn.disabled = false;
    noBtn.disabled = false;
    locked = false;
    startTimer();
  }

  function reactGood(): void {
    chars.classList.add('react-good');
    timers.after(() => chars.classList.remove('react-good'), 950);
    audio.sfx('correct');
    timers.after(() => audio.sfx('babyCoo'), 220);
  }

  function reactBad(level: number): void {
    chars.classList.add('react-bad');
    timers.after(() => chars.classList.remove('react-bad'), 550);
    audio.sfx('wrong');
    timers.after(() => {
      if (level >= 5) audio.sfx('babyTantrum');
      else if (level >= 3) audio.sfx('babyCry');
      else audio.sfx('babyFuss');
    }, 260);
    if (level >= 3) timers.after(() => audio.sfx('momGasp'), 700);
  }

  /** The clock ran out: counts as a mistake, exactly like a wrong answer. */
  function timeUp(): void {
    if (locked || finished) return;
    resolve(false, true);
  }

  function answer(choice: 'YES' | 'NO'): void {
    if (locked || finished) return;
    resolve(checkYesNo(session.current, choice), false);
  }

  function resolve(correct: boolean, ranOut: boolean): void {
    locked = true;
    stopTimer();
    yesBtn.disabled = true;
    noBtn.disabled = true;

    const q = session.current;
    session.score(correct);
    if (!correct) mistakes++;
    setMood(mistakes);

    if (correct) {
      reactGood();
      toast.show('Correct!', 'good', 1400);
    } else {
      reactBad(mistakes);
      toast.show(
        ranOut ? 'Time is up — that counts as a mistake.' : pickRandom(encouragements, 'Not quite.'),
        'bad',
        1800,
      );
      tip.maybeShow(mistakes);
    }

    const outOfChances = mistakes >= MAX_MISTAKES;
    const last = session.index >= session.total - 1;
    const title = correct
      ? 'Correct — the baby stays calm'
      : outOfChances
        ? 'Tantrum! That was your third mistake'
        : ranOut
          ? `Time up — the answer was ${q.correct}`
          : `Not quite — the answer was ${q.correct}`;

    feedback.show(correct, title, q.explanation, [
      {
        label: outOfChances ? 'See my result' : last ? 'See my result' : 'Next question',
        variant: correct ? '' : 'btn--coral',
        onClick: () => {
          feedback.hide();
          tip.hide();
          const advance = (): void => {
            if (outOfChances) {
              finish(true);
              return;
            }
            if (session.next()) renderQuestion();
            else finish(false);
          };
          const shown = !correct && coach.register(mistakes, advance);
          if (!shown) advance();
        },
      },
    ]);
  }

  function finish(lost = false): void {
    if (finished) return;
    finished = true;
    stopTimer();
    const { correct, total } = session.result();
    const extra = lost
      ? 'Game over — the baby had a tantrum after 3 mistakes.'
      : mistakes === 0
        ? 'You finished every question and the baby stayed calm!'
        : `You finished the round with ${mistakes} of ${MAX_MISTAKES} chances used.`;
    audio.sfx(lost ? 'defeat' : 'victory');
    root.appendChild(
      buildCompletion({
        gameId: 'babyCry',
        gameTitle: "Don't Make the Baby Cry",
        correct,
        total,
        title: lost ? 'Game over' : undefined,
        extraLine: extra,
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('babyCry'),
        onHub: nav.toHub,
      }),
    );
  }

  yesBtn.addEventListener('click', () => answer('YES'));
  noBtn.addEventListener('click', () => answer('NO'));

  // Keyboard shortcuts for desktop players
  const offKeys = on(window, 'keydown', (ev) => {
    const k = (ev as KeyboardEvent).key.toLowerCase();
    if (k === 'y') answer('YES');
    if (k === 'n') answer('NO');
  });

  setMood(0);
  renderQuestion();
  locked = true;
  yesBtn.disabled = true;
  noBtn.disabled = true;

  showGameIntro(
    "Don't Make the Baby Cry",
    'You are the mother carrying the baby. Answer each YES/NO question before the timer runs out. You have 3 chances for the whole round: 1st mistake the baby cries softly, 2nd it cries louder, 3rd it has a tantrum and the game ends.',
    'babyCry',
    () => {
      audio.sfx('babyCoo');
      locked = false;
      yesBtn.disabled = false;
      noBtn.disabled = false;
    },
  );

  return {
    root,
    destroy: () => {
      timers.clear();
      stopTimer();
      coach.dispose();
      feedback.hide();
      closeAllModals();
      offKeys();
      audio.stopMusic();
    },
  };
}
