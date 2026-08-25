/**
 * GAME 2 — ATTACH THE MISSING PUZZLE
 * Answer a question → earn a piece → the STUDENT drags the piece into the hole.
 *
 * Rules implemented here:
 *  · the board starts COMPLETELY EMPTY — every piece must be earned
 *  · a wrong answer awards NO piece: the same question stays active, the student
 *    gets a tip and retries, and the options are reshuffled on every attempt
 *  · closing the question does not skip it — the "See Q&A" button reopens it
 *  · pieces never attach by themselves; a wrong hole bounces the piece back
 *
 * All pieces live in one absolutely positioned overlay layer so a piece can be
 * dragged freely between the tray and the board on any screen size.
 */
import { el, svgBox, clamp, on, TimerPool } from '../../utils/dom';
import { icon } from '../../art/icons';
import { puzzleBackground, puzzlePicture } from '../../art/scenes';
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
import { QuizSession, checkYesNo, pickRandom, shuffle } from '../../core/quiz';
import { encouragements } from '../../data/questions';
import type { Nav, Scene } from '../../core/router';

/**
 * The picture is split into FIVE regions — one per question — so the board can
 * start empty and still be completed in exactly 5 correct answers.
 * Values are fractions of the board (3 across the top, 2 across the bottom).
 */
const SLOT_RECTS = [
  { x: 0, y: 0, w: 1 / 3, h: 0.5 },
  { x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 },
  { x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 },
  { x: 0, y: 0.5, w: 0.5, h: 0.5 },
  { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
];
const CELLS = SLOT_RECTS.length;

interface Piece {
  index: number; // which slot it belongs to
  node: HTMLElement;
  placed: boolean;
  trayOrder: number;
}

export function createPuzzleScene(nav: Nav): Scene {
  audio.music('puzzle');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  const hud = new Hud({ onBack: nav.toHub, howTo: 'puzzle', total: session.total });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('puzzle', 'top');
  const coach = new MistakeCoach('puzzle', 'puzzle');

  /** Wrong attempts in THIS round only (retries included). */
  let mistakes = 0;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game puz', 'aria-label': 'Attach the Missing Puzzle' });
  root.appendChild(svgBox(puzzleBackground(), 'game__bg'));

  /* ---------------- board ---------------- */
  const board = el('div', { class: 'puz__board' });
  board.appendChild(svgBox(puzzlePicture(), 'puz__ghost'));

  const slotNodes: HTMLElement[] = SLOT_RECTS.map((r, i) => {
    const slot = el('div', {
      class: 'puz__slot',
      style: {
        left: `${r.x * 100}%`,
        top: `${r.y * 100}%`,
        width: `${r.w * 100}%`,
        height: `${r.h * 100}%`,
      },
    });
    slot.appendChild(el('div', { class: 'puz__slotnum', text: String(i + 1) }));
    board.appendChild(slot);
    return slot;
  });

  const boardWrap = el('div', { class: 'puz__boardwrap' }, board);

  /* ---------------- tray ---------------- */
  const trayHint = el('div', {
    class: 'puz__trayhint',
    text: 'Answer the question correctly to earn your first piece.',
  });
  const tray = el('div', { class: 'puz__tray' }, trayHint);
  const trayLabel = el(
    'div',
    { class: 'puz__traylabel' },
    el('span', { text: 'Piece tray' }),
    el('small', { text: 'Drag each piece into its numbered hole' }),
  );
  // `seeQaBtn` is created below and inserted here: on phones it sits in the flow
  // above the tray, on desktop CSS floats it against the right edge.
  const side = el('div', { class: 'puz__side' });

  const layer = el('div', {
    class: 'puz__layer',
    style: { position: 'absolute', inset: '0', zIndex: '25', pointerEvents: 'none' },
  });

  const stage = el(
    'div',
    { class: 'game__stage' },
    el('div', { class: 'puz__layout' }, boardWrap, side),
  );

  /* ---------------- "See Q&A" recovery button ---------------- */
  const seeQaBtn = el('button', {
    class: 'btn btn--sun puz__seeqa',
    type: 'button',
    html: `${icon('question')}<span>See Q&amp;A</span>`,
    'aria-label': 'Reopen the current question',
  }) as HTMLButtonElement;
  seeQaBtn.addEventListener('click', () => {
    audio.sfx('click');
    // While a question is unanswered this reopens it; once it is answered the
    // same button shows a read-only recap so the student can re-read the lesson.
    if (awaitingAnswer) showQuestion();
    else showReview();
  });

  side.append(seeQaBtn, trayLabel, tray);

  root.append(hud.root, stage, layer, tip.root, toast.root, feedback.root);

  /* ---------------- pieces ---------------- */
  // The board starts empty: every slot is earned, in a random order.
  const earnOrder = shuffle(Array.from({ length: CELLS }, (_, i) => i));

  const pieces = new Map<number, Piece>();
  let trayCount = 0;

  function makePiece(index: number): Piece {
    const inner = el('div', {
      class: 'puzzle-piece__inner',
      style: { position: 'absolute', left: '0', top: '0', pointerEvents: 'none' },
    });
    inner.innerHTML = puzzlePicture();
    const svg = inner.firstElementChild as SVGElement | null;
    svg?.setAttribute('preserveAspectRatio', 'none');

    // fx wrapper carries the pop/shake animations; the outer node carries position
    const fx = el('div', { class: 'puzzle-piece__fx' }, inner);
    const node = el(
      'div',
      {
        class: 'puzzle-piece is-new',
        role: 'button',
        tabindex: '0',
        'aria-label': `Puzzle piece ${index + 1}. Drag it into hole ${index + 1}.`,
        style: { position: 'absolute', pointerEvents: 'auto' },
      },
      fx,
    );
    layer.appendChild(node);
    const piece: Piece = { index, node, placed: false, trayOrder: trayCount++ };
    pieces.set(index, piece);
    attachDrag(piece);
    return piece;
  }

  /* ---------------- geometry ---------------- */
  /** Board-space box (viewport pixels) of a slot. */
  function slotBox(index: number): { x: number; y: number; w: number; h: number } {
    const r = board.getBoundingClientRect();
    const s = SLOT_RECTS[index];
    return { x: r.left + s.x * r.width, y: r.top + s.y * r.height, w: s.w * r.width, h: s.h * r.height };
  }

  function layout(): void {
    const layerRect = layer.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    pieces.forEach((piece) => {
      const s = SLOT_RECTS[piece.index];
      const w = s.w * boardRect.width;
      const h = s.h * boardRect.height;
      piece.node.style.width = `${w}px`;
      piece.node.style.height = `${h}px`;
      const inner = piece.node.querySelector('.puzzle-piece__inner') as HTMLElement;
      inner.style.width = `${boardRect.width}px`;
      inner.style.height = `${boardRect.height}px`;
      inner.style.transform = `translate(${-s.x * boardRect.width}px, ${-s.y * boardRect.height}px)`;
      if (piece.node.classList.contains('is-dragging')) return;
      const home = homePos(piece);
      setPos(piece.node, home.x - layerRect.left, home.y - layerRect.top, home.scale);
    });
  }

  /** Where a piece belongs right now: its board slot, or its tray parking spot. */
  function homePos(piece: Piece): { x: number; y: number; scale: number } {
    if (piece.placed) {
      const b = slotBox(piece.index);
      return { x: b.x, y: b.y, scale: 1 };
    }
    return trayPos(piece);
  }

  /** Parking spot (viewport coords) for a piece waiting in the tray. */
  function trayPos(piece: Piece): { x: number; y: number; scale: number } {
    const r = tray.getBoundingClientRect();
    const box = slotBox(piece.index);
    const usable = Math.max(60, r.width - 20);
    const slots = Math.max(1, trayCount);
    const scale = clamp(Math.min(1, usable / (slots * (box.w + 10))), 0.42, 1);
    const stepX = (box.w + 10) * scale;
    const startX = r.left + (r.width - stepX * slots) / 2;
    return {
      x: startX + piece.trayOrder * stepX,
      y: r.top + Math.max(6, (r.height - box.h * scale) / 2),
      scale,
    };
  }

  function setPos(node: HTMLElement, x: number, y: number, scale = 1): void {
    node.style.transformOrigin = 'top left';
    node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  /* ---------------- dragging (mouse + touch, one code path) ------------- */
  function attachDrag(piece: Piece): void {
    const node = piece.node;
    let dragging = false;
    let grabX = 0;
    let grabY = 0;
    let pointerId = -1;

    const down = (ev: PointerEvent): void => {
      if (piece.placed || dragging) return;
      dragging = true;
      pointerId = ev.pointerId;
      const layerRect = layer.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      grabX = ev.clientX - rect.left;
      grabY = ev.clientY - rect.top;
      node.classList.add('is-dragging');
      node.classList.remove('is-returning', 'is-new');
      // grow back to full size while dragging so it matches the hole
      setPos(node, rect.left - layerRect.left, rect.top - layerRect.top, 1);
      try {
        node.setPointerCapture(ev.pointerId);
      } catch {
        /* older browsers */
      }
      audio.sfx('pop');
      ev.preventDefault();
    };

    const centreOf = (ev: PointerEvent): { cx: number; cy: number } => {
      const box = slotBox(piece.index);
      return { cx: ev.clientX - grabX + box.w / 2, cy: ev.clientY - grabY + box.h / 2 };
    };

    const move = (ev: PointerEvent): void => {
      if (!dragging || ev.pointerId !== pointerId) return;
      const layerRect = layer.getBoundingClientRect();
      setPos(node, ev.clientX - grabX - layerRect.left, ev.clientY - grabY - layerRect.top, 1);
      const { cx, cy } = centreOf(ev);
      highlight(nearestSlot(cx, cy));
      ev.preventDefault();
    };

    const up = (ev: PointerEvent): void => {
      if (!dragging) return;
      dragging = false;
      pointerId = -1;
      node.classList.remove('is-dragging');
      highlight(-1);
      const { cx, cy } = centreOf(ev);
      const target = nearestSlot(cx, cy);
      if (target === piece.index) placePiece(piece);
      else rejectPiece(piece, target);
    };

    node.addEventListener('pointerdown', down);
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', () => {
      // A phone call / gesture interrupted the drag — put the piece back safely.
      if (!dragging) return;
      dragging = false;
      node.classList.remove('is-dragging');
      highlight(-1);
      returnHome(piece);
    });

    // Keyboard fallback: focus a piece and press Enter to attach it.
    node.addEventListener('keydown', (ev) => {
      const key = (ev as KeyboardEvent).key;
      if (key === 'Enter' || key === ' ') {
        ev.preventDefault();
        placePiece(piece);
      }
    });
  }

  /** Nearest slot to a point, or -1 when the point is far from every slot. */
  function nearestSlot(cx: number, cy: number): number {
    let best = -1;
    let bestDist = Infinity;
    let bestSize = 0;
    for (let i = 0; i < CELLS; i++) {
      const b = slotBox(i);
      const d = Math.hypot(cx - (b.x + b.w / 2), cy - (b.y + b.h / 2));
      if (d < bestDist) {
        bestDist = d;
        best = i;
        bestSize = Math.max(b.w, b.h);
      }
    }
    // Generous snapping zone — no pixel-perfect dragging required.
    return bestDist < bestSize * 0.75 ? best : -1;
  }

  function highlight(index: number): void {
    slotNodes.forEach((s, i) => s.classList.toggle('puz__slot--hot', i === index && !isFilled(i)));
  }

  function isFilled(index: number): boolean {
    const p = pieces.get(index);
    return !!p && p.placed;
  }

  function placePiece(piece: Piece): void {
    piece.placed = true;
    piece.node.classList.remove('is-new');
    piece.node.classList.add('is-placed', 'is-snapping');
    piece.node.style.pointerEvents = 'none';
    piece.node.tabIndex = -1;
    slotNodes[piece.index].classList.add('puz__slot--filled');
    const numLabel = slotNodes[piece.index].querySelector('.puz__slotnum');
    if (numLabel) (numLabel as HTMLElement).style.display = 'none';
    audio.sfx('snap');
    layout();
    sparkleBurst(piece.index);
    toast.show('Piece attached!', 'good', 1200);
    reflowTray();
    timers.after(() => piece.node.classList.remove('is-snapping'), 420);
    timers.after(afterPlacement, 520);
  }

  function rejectPiece(piece: Piece, attempted: number): void {
    audio.sfx('wrong');
    piece.node.classList.add('is-wrong');
    timers.after(() => piece.node.classList.remove('is-wrong'), 420);
    toast.show(
      attempted === -1
        ? 'Drop the piece closer to a hole on the board.'
        : `That hole belongs to another piece — try hole ${piece.index + 1}.`,
      'bad',
      2000,
    );
    returnHome(piece);
  }

  function returnHome(piece: Piece): void {
    piece.node.classList.add('is-returning');
    const layerRect = layer.getBoundingClientRect();
    const home = homePos(piece);
    setPos(piece.node, home.x - layerRect.left, home.y - layerRect.top, home.scale);
    timers.after(() => piece.node.classList.remove('is-returning'), 340);
  }

  function reflowTray(): void {
    let order = 0;
    trayCount = 0;
    pieces.forEach((p) => {
      if (!p.placed) trayCount++;
    });
    pieces.forEach((p) => {
      if (!p.placed) p.trayOrder = order++;
    });
    trayHint.style.display = trayCount ? 'none' : 'grid';
    trayHint.textContent = trayCount
      ? ''
      : answeredAll()
        ? 'All pieces attached — well done!'
        : 'Answer the question correctly to earn the next piece.';
    layout();
  }

  function sparkleBurst(index: number): void {
    const box = slotBox(index);
    const layerRect = layer.getBoundingClientRect();
    const colors = ['#ffc93c', '#2fd6c0', '#ff6f61', '#7b61ff'];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.background = colors[i % colors.length];
      s.style.left = `${box.x - layerRect.left + box.w / 2}px`;
      s.style.top = `${box.y - layerRect.top + box.h / 2}px`;
      const a = (i / 10) * Math.PI * 2;
      s.style.setProperty('--dx', `${Math.cos(a) * (40 + Math.random() * 40)}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * (40 + Math.random() * 40)}px`);
      layer.appendChild(s);
      timers.after(() => s.remove(), 700);
    }
  }

  /* ---------------- question flow ---------------- */
  const qOverlay = el('div', { class: 'puz__qoverlay', hidden: 'true' });
  root.appendChild(qOverlay);

  let finished = false;
  /** True while a question still has to be answered correctly. */
  let awaitingAnswer = false;
  /** The last question answered correctly — used by the read-only recap. */
  let lastAnswered: (typeof session.questions)[number] | null = null;

  function answeredAll(): boolean {
    return session.index >= session.total;
  }

  /**
   * The "See Q&A" button stays available throughout play: it reopens an
   * unanswered question, or shows a recap of the one just answered while the
   * student is dragging the piece. It never skips a question.
   */
  function syncSeeQa(): void {
    const show = qOverlay.hidden && !finished && (awaitingAnswer || lastAnswered !== null);
    seeQaBtn.classList.toggle('is-show', show);
    seeQaBtn.disabled = !show;
    const label = awaitingAnswer ? 'See Q&A' : 'Review Q&A';
    const span = seeQaBtn.querySelector('span');
    if (span) span.textContent = label;
    seeQaBtn.setAttribute(
      'aria-label',
      awaitingAnswer ? 'Reopen the current question' : 'Review the question you just answered',
    );
  }

  function closeQuestion(): void {
    qOverlay.hidden = true;
    qOverlay.replaceChildren();
    syncSeeQa();
  }

  /**
   * Renders the current question. Called again for every retry, so the answer
   * order is reshuffled each time (via the shared quiz helper).
   */
  function showQuestion(): void {
    if (finished) return;
    const q = session.current;
    awaitingAnswer = true;
    hud.setProgress(session.humanIndex, session.total);

    const topic = el('span', { class: 'qpanel__topic', text: q.topic });
    const text = el('p', {
      class: 'qpanel__text',
      role: 'heading',
      'aria-level': '2',
      text: q.question,
    });
    // Official questionnaire: every question is YES / NO.
    const list = el('div', { class: 'opt-list opt-list--yesno' });
    const buttons: HTMLButtonElement[] = [];
    (['YES', 'NO'] as const).forEach((val) => {
      const btn = el('button', {
        class: `btn answer-btn${val === 'NO' ? ' answer-btn--no' : ''}`,
        type: 'button',
        html: `${icon(val === 'YES' ? 'check' : 'cross')}<span>${val}</span>`,
        'aria-label': `Answer ${val.toLowerCase()}`,
      }) as HTMLButtonElement;
      btn.dataset.answer = val;
      btn.addEventListener('click', () => choose(val, btn, buttons));
      buttons.push(btn);
      list.appendChild(btn);
    });

    const close = el('button', {
      class: 'icon-btn puz__qclose',
      type: 'button',
      'aria-label': 'Hide the question (you can reopen it with See Q&A)',
      title: 'Hide question',
      html: icon('close'),
    });
    close.addEventListener('click', () => {
      audio.sfx('back');
      closeQuestion();
      toast.show('Question hidden — tap "See Q&A" to bring it back.', 'plain', 2600);
    });

    const card = el(
      'div',
      { class: 'puz__qcard' },
      el('div', { class: 'qpanel puz__qpanel' }, close, topic, text, list),
    );
    qOverlay.replaceChildren(card);
    qOverlay.hidden = false;
    syncSeeQa();
    timers.after(() => buttons[0]?.focus(), 200);
  }

  function choose(opt: 'YES' | 'NO', btn: HTMLButtonElement, all: HTMLButtonElement[]): void {
    const q = session.current;
    const correct = checkYesNo(q, opt);
    all.forEach((b) => (b.disabled = true));
    btn.classList.add(correct ? 'is-correct' : 'is-wrong');

    // The QuizSession scores only the FIRST attempt, so retries cannot inflate
    // the score; `mistakes` counts every wrong attempt for the tip systems.
    session.score(correct);
    audio.sfx(correct ? 'correct' : 'wrong');

    if (correct) {
      lastAnswered = q;
      feedback.show(true, 'Correct — piece unlocked!', q.explanation, [
        {
          label: 'Take the piece',
          onClick: () => {
            feedback.hide();
            awaitingAnswer = false;
            closeQuestion();
            grantPiece();
          },
        },
      ]);
      return;
    }

    /* ---- wrong answer: no piece, keep the question, offer a retry ---- */
    mistakes++;
    tip.nudge();
    feedback.show(
      false,
      `Not quite — the answer was ${q.correct}`,
      `${pickRandom(encouragements, 'Not quite.')} ${q.explanation}`,
      [
        {
          label: 'Try again',
          variant: 'btn--coral',
          onClick: () => {
            feedback.hide();
            // A popup only appears when the mistake threshold is crossed.
            const shown = coach.register(mistakes, () => showQuestion());
            if (!shown) showQuestion();
          },
        },
      ],
    );
  }

  /** Read-only recap of the last correctly answered question. */
  function showReview(): void {
    const q = lastAnswered;
    if (!q) return;
    const close = el('button', {
      class: 'icon-btn puz__qclose',
      type: 'button',
      'aria-label': 'Close the recap',
      title: 'Close',
      html: icon('close'),
    });
    close.addEventListener('click', () => {
      audio.sfx('back');
      closeQuestion();
    });
    const list = el('div', { class: 'opt-list' });
    const answer = el('div', { class: 'btn opt-btn is-correct', 'aria-disabled': 'true' });
    answer.append(el('span', { class: 'opt-text', text: `Correct answer: ${q.correct}` }));
    list.appendChild(answer);

    const card = el(
      'div',
      { class: 'puz__qcard' },
      el(
        'div',
        { class: 'qpanel puz__qpanel' },
        close,
        el('span', { class: 'qpanel__topic', text: `${q.topic} · answered` }),
        el('p', { class: 'qpanel__text', text: q.question }),
        list,
        el('p', { class: 'puz__reviewnote', text: q.explanation }),
      ),
    );
    qOverlay.replaceChildren(card);
    qOverlay.hidden = false;
    syncSeeQa();
    timers.after(() => close.focus(), 150);
  }

  function grantPiece(): void {
    const idx = earnOrder[session.index];
    if (idx !== undefined && !pieces.has(idx)) {
      makePiece(idx);
      audio.sfx('appear');
      reflowTray();
      toast.show(`Piece ${idx + 1} is in your tray — drag it into hole ${idx + 1}.`, 'plain', 3000);
    }
    session.next();
    afterPlacement();
  }

  /** Called after a piece lands (or a question is answered) to advance the flow. */
  function afterPlacement(): void {
    if (finished) return;
    syncSeeQa();
    const pending = [...pieces.values()].some((p) => !p.placed);
    if (pending) return; // student still has a piece to attach
    if (!answeredAll()) {
      timers.after(showQuestion, 350);
    } else {
      finish();
    }
  }

  function finish(): void {
    if (finished) return;
    finished = true;
    awaitingAnswer = false;
    syncSeeQa();
    audio.sfx('fanfare');
    board.classList.add('pulse-good');
    const { correct, total } = session.result();
    timers.after(() => {
      root.appendChild(
        buildCompletion({
          gameId: 'puzzle',
          gameTitle: 'Attach the Missing Puzzle',
          correct,
          total,
          extraLine: 'You completed the picture!',
          message: session.completionMessage,
          categoryName: session.category.name,
          onReplay: () => nav.go('puzzle'),
          onHub: nav.toHub,
        }),
      );
    }, 700);
  }

  /* ---------------- boot ---------------- */
  const ro = new ResizeObserver(() => layout());
  ro.observe(board);
  ro.observe(tray);
  const offResize = on(window, 'resize', () => layout());
  const offOrientation = on(window, 'orientationchange', () => timers.after(layout, 250));
  requestAnimationFrame(() => {
    layout();
    reflowTray();
  });
  syncSeeQa();

  showGameIntro(
    'Attach the Missing Puzzle',
    'The board starts empty. Answer each YES/NO question correctly to earn a puzzle piece, then drag it into its hole yourself. A wrong answer means no piece — you simply try that question again.',
    'puzzle',
    () => {
      layout();
      showQuestion();
    },
  );

  return {
    root,
    destroy: () => {
      timers.clear();
      coach.dispose();
      feedback.hide();
      closeAllModals();
      ro.disconnect();
      offResize();
      offOrientation();
      audio.stopMusic();
    },
  };
}
