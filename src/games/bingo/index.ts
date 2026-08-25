/**
 * GAME 7 — BINGO GAME
 * A 5x5 board of closed boxes. One Bingo pattern is drawn at random each round
 * and outlined on the board (the outline shows WHERE to play, never WHAT is
 * inside). Opening a box reveals either an empty square or a star; a star only
 * counts once its child-protection question is answered correctly.
 *
 * Loop: choose closed box → open → EMPTY or STAR → if STAR answer the question
 *       → correct collects the star → complete the highlighted pattern → WIN.
 */
import { el, svgBox, delay, TimerPool } from '../../utils/dom';
import { icon } from '../../art/icons';
import { bingoBackground } from '../../art/scenes2';
import { bingoBoxClosed, bingoEmpty, bingoStar } from '../../art/characters2';
import { audio } from '../../core/audio';
import { closeAllModals } from '../../core/modal';
import {
  Feedback,
  Hud,
  MistakeCoach,
  QuestionOverlay,
  TipBubble,
  Toast,
  buildCompletion,
  showGameIntro,
} from '../../core/ui';
import { QuizSession } from '../../core/quiz';
import type { Nav, Scene } from '../../core/router';

const SIZE = 5;
const CELLS = SIZE * SIZE;
/** Stars outside the pattern. 0 = one question per pattern square (5 total). */
const DECOY_STARS = 0;

type CellState = 'closed' | 'empty' | 'pending' | 'collected';

interface Cell {
  index: number;
  hasStar: boolean;
  inPattern: boolean;
  state: CellState;
  node: HTMLButtonElement;
  face: HTMLElement;
}

interface PatternDef {
  name: string;
  cells: number[];
}

/**
 * Winning patterns: HORIZONTAL, VERTICAL or DIAGONAL only — always 5 squares.
 * A fresh one is drawn for every round (and every retry, never the previous).
 */
function buildPatterns(): PatternDef[] {
  const list: PatternDef[] = [];
  for (let r = 0; r < SIZE; r++) {
    list.push({
      name: `Horizontal · row ${r + 1}`,
      cells: Array.from({ length: SIZE }, (_, c) => r * SIZE + c),
    });
  }
  for (let c = 0; c < SIZE; c++) {
    list.push({
      name: `Vertical · column ${c + 1}`,
      cells: Array.from({ length: SIZE }, (_, r) => r * SIZE + c),
    });
  }
  list.push({ name: 'Diagonal ↘', cells: [0, 6, 12, 18, 24] });
  list.push({ name: 'Diagonal ↙', cells: [4, 8, 12, 16, 20] });
  return list;
}

/** Remembers the last pattern so a retry never repeats it. */
let lastPatternName: string | null = null;

function drawFreshPattern(): PatternDef {
  const all = buildPatterns();
  const choices = all.filter((p) => p.name !== lastPatternName);
  const picked = choices[Math.floor(Math.random() * choices.length)];
  lastPatternName = picked.name;
  return picked;
}

export function createBingoScene(nav: Nav): Scene {
  audio.music('bingo');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  // One category = five official questions = the five pattern squares.
  const session = new QuizSession();
  const hud = new Hud({ onBack: nav.toHub, howTo: 'bingo', total: SIZE });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('bingo', 'top');
  const coach = new MistakeCoach('bingo', 'bingo');
  const overlay = new QuestionOverlay();

  let mistakes = 0;
  let finished = false;
  let busy = false;
  /** The box whose question still has to be answered correctly. */
  let pendingCell: Cell | null = null;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game bingo', 'aria-label': 'Bingo child protection game' });
  root.appendChild(svgBox(bingoBackground(), 'game__bg'));

  /* ---------------- board data ---------------- */
  const pattern = drawFreshPattern();
  const patternSet = new Set(pattern.cells);

  // Stars: every pattern square (so the round is always winnable) plus a couple
  // of decoys elsewhere — opening a decoy costs one of the five questions.
  const starSet = new Set<number>(pattern.cells);
  void DECOY_STARS;

  /* ---------------- board UI ---------------- */
  const board = el('div', {
    class: 'bingo__board',
    role: 'grid',
    'aria-label': `Bingo board, 5 by 5. Target pattern: ${pattern.name}`,
  });

  const cells: Cell[] = [];
  for (let i = 0; i < CELLS; i++) {
    const face = el('div', { class: 'bingo__face' });
    face.innerHTML = bingoBoxClosed();
    const node = el(
      'button',
      {
        class: 'bingo__cell',
        type: 'button',
        role: 'gridcell',
        'aria-label': `Closed box, row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}`,
      },
      face,
    ) as HTMLButtonElement;
    node.addEventListener('click', () => openCell(cells[i]));
    board.appendChild(node);
    cells.push({ index: i, hasStar: starSet.has(i), inPattern: patternSet.has(i), state: 'closed', node, face });
  }

  /* ---------------- side panel ---------------- */
  // The pattern stays SECRET while the round is running: no mini-map, no name,
  // no outline. The board must look like a plain 5x5 grid until a box is opened.
  const patternMini = el('div', { class: 'bingo__mini is-hidden', 'aria-hidden': 'true' });
  for (let i = 0; i < CELLS; i++) patternMini.appendChild(el('span'));
  const progressText = el('span', { class: 'bingo__count' });
  const seeBtn = el('button', {
    class: 'btn btn--sun bingo__see',
    type: 'button',
    html: `${icon('question')}<span>See Q&amp;A</span>`,
    'aria-label': 'Reopen the current question',
  }) as HTMLButtonElement;
  seeBtn.addEventListener('click', () => {
    audio.sfx('click');
    if (pendingCell) askFor(pendingCell);
    syncSee();
  });

  const panel = el(
    'aside',
    { class: 'bingo__panel' },
    el(
      'div',
      { class: 'bingo__patterncard' },
      el('span', { class: 'bingo__label', text: 'Hidden pattern' }),
      el('strong', { class: 'bingo__pattern', text: 'Find the 5 hidden stars' }),
      patternMini,
      progressText,
    ),
    seeBtn,
  );

  const stage = el(
    'div',
    { class: 'game__stage bingo__stage' },
    el('div', { class: 'bingo__layout' }, el('div', { class: 'bingo__boardwrap' }, board), panel),
  );
  root.append(hud.root, stage, overlay.root, tip.root, toast.root, feedback.root);

  /* ---------------- helpers ---------------- */
  const collected = (): number => cells.filter((c) => c.inPattern && c.state === 'collected').length;

  function updateProgress(): void {
    progressText.textContent = `${collected()} / ${SIZE} stars collected`;
    hud.setLabel(`Stars collected ${collected()} / ${SIZE}`, collected() / SIZE);
  }

  function syncSee(): void {
    const show = !!pendingCell && !overlay.isOpen && !finished;
    seeBtn.classList.toggle('is-show', show);
    seeBtn.disabled = !show;
  }

  function setBoardEnabled(enabled: boolean): void {
    cells.forEach((c) => {
      c.node.disabled = !enabled || c.state !== 'closed';
    });
  }

  /* ---------------- opening boxes ---------------- */
  async function openCell(cell: Cell): Promise<void> {
    if (busy || finished || pendingCell || cell.state !== 'closed') return;
    busy = true;
    setBoardEnabled(false);

    cell.node.classList.add('is-opening');
    audio.sfx('boxOpen');
    await delay(320);
    cell.node.classList.remove('is-opening');

    if (!cell.hasStar) {
      cell.state = 'empty';
      cell.face.innerHTML = bingoEmpty();
      cell.node.classList.add('is-empty');
      cell.node.setAttribute('aria-label', `Empty box, row ${Math.floor(cell.index / SIZE) + 1}, column ${(cell.index % SIZE) + 1}`);
      audio.sfx('empty');
      toast.show('Empty box — nothing inside. Keep looking!', 'plain', 1500);
      busy = false;
      setBoardEnabled(true);
      checkStillWinnable();
      return;
    }

    // star found — the question decides whether it is collected
    cell.state = 'pending';
    cell.face.innerHTML = bingoStar(false);
    cell.node.classList.add('is-star');
    audio.sfx('coin');
    cell.node.setAttribute('aria-label', 'Star found — answer the question to collect it');
    pendingCell = cell;
    busy = false;
    await delay(340);
    askFor(cell);
  }

  function askFor(cell: Cell): void {
    if (finished) return;
    updateProgress();
    overlay.ask(session.current, (correct) => onAnswer(correct, cell), {
      closable: true,
      caption: `Star found! Answer to collect it · ${session.humanIndex} of ${session.total}`,
      onClose: () => {
        toast.show('The star is still locked — tap "See Q&A" to answer.', 'plain', 2400);
        syncSee();
      },
    });
    setBoardEnabled(false);
    syncSee();
  }

  function onAnswer(correct: boolean, cell: Cell): void {
    session.score(correct);
    timers.after(() => {
      overlay.hide();
      if (correct) {
        cell.state = 'collected';
        cell.face.innerHTML = bingoStar(true);
        cell.node.classList.remove('is-star');
        cell.node.classList.add('is-collected');
        cell.node.setAttribute('aria-label', 'Star collected');
        pendingCell = null;
        audio.sfx('correct');
        sparkle(cell);
        updateProgress();
        syncSee();

        const done = collected() >= SIZE;
        feedback.show(
          true,
          cell.inPattern ? 'Star collected — pattern progress!' : 'Bonus star collected',
          session.current.explanation,
          [
            {
              label: done ? 'See my result' : 'Keep playing',
              onClick: () => {
                feedback.hide();
                session.next();
                updateProgress();
                // VICTORY IS DECIDED BY THE PATTERN ONLY.
                if (done) win();
                else setBoardEnabled(true);
              },
            },
          ],
        );
        return;
      }

      // wrong: the star stays locked and the same question comes back
      mistakes++;
      const q = session.current;
      tip.nudge();
      audio.sfx('wrong');
      feedback.show(
        false,
        `Not quite — the star stays locked (the answer was ${q.correct})`,
        `${q.explanation} Try the same question again.`,
        [
          {
            label: 'Try again',
            variant: 'btn--coral',
            onClick: () => {
              feedback.hide();
              const again = (): void => askFor(cell);
              const shown = coach.register(mistakes, again);
              if (!shown) again();
            },
          },
        ],
      );
    }, 460);
  }

  function sparkle(cell: Cell): void {
    const rect = cell.node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const colors = ['#ffd166', '#2fd6c0', '#ff6f61', '#7b61ff'];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.background = colors[i % colors.length];
      s.style.left = `${rect.left - rootRect.left + rect.width / 2}px`;
      s.style.top = `${rect.top - rootRect.top + rect.height / 2}px`;
      const a = (i / 10) * Math.PI * 2;
      s.style.setProperty('--dx', `${Math.cos(a) * (36 + Math.random() * 34)}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * (36 + Math.random() * 34)}px`);
      root.appendChild(s);
      timers.after(() => s.remove(), 700);
    }
  }

  /** A revealed-empty square inside the pattern makes the round impossible. */
  function checkStillWinnable(): void {
    const broken = cells.some((c) => c.inPattern && c.state === 'empty');
    if (broken) roundFailed('One of the pattern squares turned out to be empty.');
  }

  /** Shows the pattern in the side panel AFTER the round has been decided. */
  function revealPattern(): void {
    const label = panel.querySelector('.bingo__pattern');
    if (label) label.textContent = pattern.name;
    patternMini.classList.remove('is-hidden');
    patternMini.querySelectorAll('span').forEach((sp, i) => {
      sp.classList.toggle('is-on', patternSet.has(i));
    });
  }

  function roundFailed(reason: string): void {
    if (finished) return;
    finished = true;
    revealPattern();
    setBoardEnabled(false);
    syncSee();
    audio.sfx('defeat');
    const { correct, total } = session.result();
    root.appendChild(
      buildCompletion({
        gameId: 'bingo',
        gameTitle: 'Bingo Game',
        correct,
        total,
        title: 'Round over',
        extraLine: `${reason} Tap "Play again" for a brand-new board and pattern.`,
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('bingo'),
        onHub: nav.toHub,
      }),
    );
  }

  function win(): void {
    if (finished) return;
    finished = true;
    setBoardEnabled(false);
    syncSee();
    audio.sfx('victory');
    board.classList.add('is-bingo');
    // the winning line is only revealed once the round is over
    cells.filter((c) => c.inPattern).forEach((c) => c.node.classList.add('is-winline'));
    revealPattern();
    const { correct, total } = session.result();
    timers.after(() => {
      root.appendChild(
        buildCompletion({
          gameId: 'bingo',
          gameTitle: 'Bingo Game',
          correct,
          total,
          extraLine: `BINGO! You completed the "${pattern.name}" pattern.`,
          message: session.completionMessage,
          categoryName: session.category.name,
          onReplay: () => nav.go('bingo'),
          onHub: nav.toHub,
        }),
      );
    }, 900);
  }

  /* ---------------- boot ---------------- */
  // QA hook (never on by default): add ?qa=1 to the URL to expose the hidden
  // star cells to automated tests. Nothing is revealed to a normal player.
  if (new URLSearchParams(location.search).has('qa')) {
    root.dataset.stars = [...starSet].sort((a, b) => a - b).join(',');
    root.dataset.pattern = pattern.name;
  }

  updateProgress();
  setBoardEnabled(false);
  syncSee();

  showGameIntro(
    'Bingo Game',
    'Twenty-five closed boxes that all look the same. Break them open to hunt for the 5 hidden stars — each star only counts once you answer its YES/NO question correctly. The stars form a secret horizontal, vertical or diagonal line: collect them all for a BINGO!',
    'bingo',
    () => {
      setBoardEnabled(true);
      toast.show('Tap any box to break it open — the 5 stars are hidden!', 'plain', 3000);
    },
  );

  return {
    root,
    destroy: () => {
      timers.clear();
      coach.dispose();
      overlay.hide();
      feedback.hide();
      closeAllModals();
      audio.stopMusic();
    },
  };
}
