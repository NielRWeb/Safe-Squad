/**
 * GAME 5 — CHOOSE & ESCAPE
 *
 * EXACT FLOW (see the SAFE SQUAD spec):
 *   1. the maze appears immediately — there is NO question popup, no YES/NO
 *      selection screen and no answer menu anywhere before the player moves
 *   2. the statement is shown as a small non-blocking strip above the maze
 *   3. the player physically drives their character into the YES portal or the
 *      NO portal — entering a portal IS the answer
 *   4. three enemies patrol and chase from the very first second
 *   5. captured → back to the entrance, same statement, plus a tip
 *   6. portal entered → the answer is evaluated and explained, then next round
 *
 * The maze is a proper Pac-Man-sized grid (21x13 on wide screens, 13x19 in
 * portrait), regenerated for every question, with mirrored gates so the layout
 * can never hint at the answer.
 */
import { el, svgBox, loop, on, TimerPool, canvasDpr } from '../../utils/dom';
import { icon } from '../../art/icons';
import { mazeBackground } from '../../art/scenes2';
import { drawChaser, drawGate, drawRunner, roundRect } from '../../art/canvasArt';
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
import { QuizSession, checkYesNo } from '../../core/quiz';
import type { Nav, Scene } from '../../core/router';

/**
 * Arcade-sized mazes — shaped to the screen so phones stay playable.
 * (27x15 on wide screens, 15x21 in portrait: a proper Pac-Man style board.)
 */
const LANDSCAPE_DIMS = { cols: 27, rows: 15 };
const PORTRAIT_DIMS = { cols: 15, rows: 21 };
const PLAYER_SPEED = 5.4; // cells per second
/**
 * The enemies ALWAYS move. For the first moment of a round they simply cannot
 * catch the player (a grace period), which keeps the start fair without ever
 * freezing them in place.
 */
const CAPTURE_GRACE = 2;

type Dir = { x: number; y: number };
const DIRS: Record<string, Dir> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

interface Enemy {
  x: number;
  y: number;
  dir: Dir;
  /** Cell where the last decision was made — prevents per-frame re-deciding. */
  lastCell: string;
  speed: number;
  /** 'chase' heads for the player, 'ambush' cuts them off, 'rove' patrols. */
  style: 'chase' | 'ambush' | 'rove';
  roveTarget: { c: number; r: number };
  roveIn: number;
  body: string;
  edge: string;
  home: { c: number; r: number };
}

export function createMazeScene(nav: Nav): Scene {
  audio.music('maze');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  const hud = new Hud({ onBack: nav.toHub, howTo: 'maze', total: session.total });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('maze', 'top');
  const coach = new MistakeCoach('maze', 'maze');

  let mistakes = 0;
  let finished = false;
  let running = false;
  /** The portal the student drove into during the current round (for the UI). */
  let target: 'YES' | 'NO' | null = null;
  void target;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game maze', 'aria-label': 'Choose and Escape maze game' });
  root.appendChild(svgBox(mazeBackground(), 'game__bg'));

  /* ---------------- statement strip -------------------------------------
   * NOT a popup and NOT an answer menu: it is a thin, non-blocking line above
   * the maze that shows what the two portals are answering. The player answers
   * by driving into a portal — there is no YES/NO button anywhere. */
  const topicEl = el('span', { class: 'maze__topic' });
  const statementEl = el('p', { class: 'maze__statement' });
  const answerChip = el('span', { class: 'maze__answer', text: 'Choose a portal to answer' });
  // The start-of-round hint lives INSIDE the banner (normal flow) rather than
  // floating over the board: as an absolutely positioned toast it sat on top
  // of the maze and, on a 320px phone, on top of the D-pad itself.
  const banner = el(
    'div',
    { class: 'maze__target' },
    el('div', { class: 'maze__strip' }, topicEl, statementEl),
    answerChip,
    toast.root,
  );

  /* ---------------- canvas ---------------- */
  const canvas = el('canvas', { class: 'maze__canvas', 'aria-hidden': 'true' }) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const canvasWrap = el('div', { class: 'maze__wrap' }, canvas);

  /* ---------------- touch D-pad ---------------- */
  const padBtn = (name: keyof typeof DIRS, label: string, cls: string): HTMLButtonElement => {
    const b = el('button', {
      class: `maze__padbtn ${cls}`,
      type: 'button',
      'aria-label': `Move ${name}`,
      html: label,
    }) as HTMLButtonElement;
    const press = (ev: Event): void => {
      ev.preventDefault();
      wantDir = DIRS[name];
    };
    b.addEventListener('pointerdown', press);
    b.addEventListener('click', press);
    return b;
  };
  const pad = el(
    'div',
    { class: 'maze__pad', 'aria-label': 'Movement controls' },
    padBtn('up', icon('arrowLeft'), 'is-up'),
    padBtn('left', icon('arrowLeft'), 'is-left'),
    padBtn('right', icon('arrowRight'), 'is-right'),
    padBtn('down', icon('arrowRight'), 'is-down'),
  );

  const status = el('div', { class: 'maze__status' });
  const stage = el(
    'div',
    { class: 'game__stage maze__stage' },
    banner,
    canvasWrap,
    el('div', { class: 'maze__footer' }, status, pad),
  );
  root.append(hud.root, stage, tip.root, feedback.root);

  /* ---------------- maze generation ---------------- */
  let grid: number[][] = [];
  /** Compact map string (rows of 0/1) so automated tests can plan a route. */
  let gridSignature = '';
  let yesLeft = true;
  let COLS = LANDSCAPE_DIMS.cols;
  let ROWS = LANDSCAPE_DIMS.rows;

  let start = { c: COLS >> 1, r: ROWS - 2 };
  let gateLeft = { c: 1, r: 1 };
  let gateRight = { c: COLS - 2, r: 1 };
  let enemyHomes: { c: number; r: number }[] = [];
  /** The Pac-Man style wrap-around corridor (left edge ⇄ right edge). */
  let tunnelRow = 7;

  function pickDims(): void {
    const rect = canvasWrap.getBoundingClientRect();
    const portrait = rect.height > rect.width * 1.05;
    const dims = portrait ? PORTRAIT_DIMS : LANDSCAPE_DIMS;
    COLS = dims.cols;
    ROWS = dims.rows;
    const centre = COLS % 2 ? COLS >> 1 : (COLS >> 1) - 1;
    const midRow = ROWS % 2 ? ROWS >> 1 : (ROWS >> 1) - 1;
    tunnelRow = midRow % 2 === 1 ? midRow : midRow + 1; // corridors sit on odd rows
    start = { c: centre, r: ROWS - 2 };
    gateLeft = { c: 1, r: 1 };
    gateRight = { c: COLS - 2, r: 1 };
    // three spawn points: far from the entrance AND off the tunnel row, so the
    // side portals are never camped from the first second
    const upper = Math.max(1, tunnelRow - 2);
    const lower = Math.min(ROWS - 2, tunnelRow + 2);
    enemyHomes = [
      { c: centre, r: 1 },
      { c: 1, r: upper },
      { c: COLS - 2, r: lower },
    ];
    void midRow;
  }

  function generateMaze(): void {
    pickDims();
    grid = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
    const stack: { c: number; r: number }[] = [{ c: 1, r: ROWS - 2 }];
    grid[ROWS - 2][1] = 1;
    while (stack.length) {
      const cur = stack[stack.length - 1];
      const options = [
        { c: cur.c + 2, r: cur.r },
        { c: cur.c - 2, r: cur.r },
        { c: cur.c, r: cur.r + 2 },
        { c: cur.c, r: cur.r - 2 },
      ].filter((n) => n.c > 0 && n.c < COLS - 1 && n.r > 0 && n.r < ROWS - 1 && grid[n.r][n.c] === 0);
      if (!options.length) {
        stack.pop();
        continue;
      }
      const next = options[Math.floor(Math.random() * options.length)];
      grid[(cur.r + next.r) / 2][(cur.c + next.c) / 2] = 1;
      grid[next.r][next.c] = 1;
      stack.push(next);
    }
    [start, gateLeft, gateRight, ...enemyHomes].forEach((p) => {
      grid[p.r][p.c] = 1;
    });
    // extra openings → loops, so the player is never trapped in a dead end
    const holes = Math.round((COLS * ROWS) / 26);
    for (let i = 0; i < holes; i++) {
      const r = 1 + 2 * Math.floor(Math.random() * ((ROWS - 1) / 2));
      const c = 2 * (1 + Math.floor(Math.random() * ((COLS - 3) / 2)));
      grid[r][c] = 1;
    }
    // guarantee the gates and spawns connect to the corridors
    grid[1][2] = 1;
    grid[1][COLS - 3] = 1;
    grid[2][1] = 1;
    grid[2][COLS - 2] = 1;
    // PAC-MAN SIDE PORTALS: open a straight corridor across the tunnel row and
    // punch through both side walls so the row wraps left ⇄ right.
    for (let c = 0; c < COLS; c++) grid[tunnelRow][c] = 1;
    gridSignature = grid.map((row) => row.join('')).join('|');
    enemyHomes.forEach((h) => {
      grid[h.r][Math.max(1, h.c - 1)] = 1;
      grid[Math.max(1, h.r - 1)][h.c] = 1;
    });
    resize();
  }

  /** Columns wrap around, so the tunnel row behaves like the arcade portals. */
  const wrapC = (c: number): number => ((c % COLS) + COLS) % COLS;
  const walkable = (c: number, r: number): boolean => {
    // round defensively: callers sometimes pass floating positions, and a
    // fractional index would silently read `undefined` and block movement
    const cc = wrapC(Math.round(c));
    const rr = Math.round(r);
    return rr >= 0 && rr < ROWS && grid[rr]?.[cc] === 1;
  };

  /* ---------------- entities ---------------- */
  let player = { x: start.c, y: start.r };
  let dir: Dir | null = null;
  let wantDir: Dir | null = null;
  let invincible = 0;
  let grace = CAPTURE_GRACE;
  let time = 0;

  const ENEMY_LOOKS = [
    { body: '#ff6f61', edge: '#c9483c' },
    { body: '#c084ff', edge: '#7b3fd0' },
    { body: '#63c6ff', edge: '#2f7fbd' },
  ];
  const ENEMY_SPEEDS = [3.0, 2.7, 2.4]; // always slower than the player (5.4)
  let enemies: Enemy[] = [];

  const ENEMY_STYLES: Enemy['style'][] = ['chase', 'ambush', 'rove'];

  function spawnEnemies(): void {
    enemies = enemyHomes.map((home, i) => ({
      x: home.c,
      y: home.r,
      dir: DIRS.left,
      lastCell: '',
      speed: ENEMY_SPEEDS[i % ENEMY_SPEEDS.length],
      style: ENEMY_STYLES[i % ENEMY_STYLES.length],
      roveTarget: { c: home.c, r: home.r },
      roveIn: 0,
      body: ENEMY_LOOKS[i % ENEMY_LOOKS.length].body,
      edge: ENEMY_LOOKS[i % ENEMY_LOOKS.length].edge,
      home,
    }));
  }

  /** Arcade ghost logic: at every cell centre pick the exit (never reversing,
   *  unless it is the only one) that gets closest to this ghost's target tile. */
  function ghostTarget(e: Enemy): { c: number; r: number } {
    const pc = Math.round(player.x);
    const pr = Math.round(player.y);
    if (e.style === 'chase') return { c: pc, r: pr };
    if (e.style === 'ambush') {
      const d = dir ?? DIRS.up;
      return { c: pc + d.x * 4, r: pr + d.y * 4 };
    }
    // rove: patrol its own corner, but pounce when the player is close
    const near = Math.hypot(pc - e.x, pr - e.y) < 6;
    return near ? { c: pc, r: pr } : e.roveTarget;
  }

  function chooseGhostDir(e: Enemy): Dir {
    const c = Math.round(e.x);
    const r = Math.round(e.y);
    const target = ghostTarget(e);
    const options = Object.values(DIRS).filter((d) => walkable(c + d.x, r + d.y));
    if (!options.length) return e.dir;
    const forward = options.filter((d) => !(d.x === -e.dir.x && d.y === -e.dir.y));
    const pool = forward.length ? forward : options;
    let best = pool[0];
    let bestScore = Infinity;
    for (const d of pool) {
      // measure through the tunnel too, so ghosts use the side portals
      const nx = c + d.x;
      const dx = Math.min(Math.abs(target.c - nx), COLS - Math.abs(target.c - nx));
      const dy = target.r - (r + d.y);
      const score = Math.hypot(dx, dy) + Math.random() * 0.35; // tiny jitter
      if (score < bestScore) {
        bestScore = score;
        best = d;
      }
    }
    return best;
  }

  function resetPositions(): void {
    player = { x: start.c, y: start.r };
    dir = null;
    wantDir = null;
    invincible = 1.2;
    grace = CAPTURE_GRACE;
    spawnEnemies();
    enemies.forEach((e) => {
      e.lastCell = '';
    });
  }

  /* ---------------- round flow ---------------- */
  /**
   * Starts a round. The statement is only *shown* (never asked): the player
   * answers later by walking into the YES or the NO portal.
   */
  function startRound(): void {
    if (finished) return;
    const q = session.current;
    hud.setProgress(session.humanIndex, session.total);
    statementEl.textContent = q.question;
    topicEl.textContent = q.topic;
    yesLeft = Math.random() < 0.5;
    generateMaze();
    resetPositions();
    updateStatus();
    banner.classList.add('is-live');
    banner.classList.remove('is-answered');
    answerChip.textContent = 'Choose a portal to answer';
    answerChip.className = 'maze__answer';
    running = true;
    toast.show('Drive into the YES portal or the NO portal to answer!', 'plain', 2600);
  }

  function restartMaze(reason: string): void {
    running = false;
    mistakes++;
    audio.sfx('hurt');
    tip.nudge();
    feedback.show(false, reason, 'Back to the entrance — read the statement again and pick your portal.', [
      {
        label: 'Run again',
        variant: 'btn--coral',
        onClick: () => {
          feedback.hide();
          const again = (): void => {
            resetPositions();
            running = true;
          };
          const shown = coach.register(mistakes, again);
          if (!shown) again();
        },
      },
    ]);
  }

  /** The portal the player drives into is their answer. */
  function reachedGate(gate: 'left' | 'right'): void {
    if (!running || finished) return;
    running = false;
    const chosen: 'YES' | 'NO' = (gate === 'left') === yesLeft ? 'YES' : 'NO';
    target = chosen;
    const q = session.current;
    const correct = checkYesNo(q, chosen);
    session.score(correct);
    audio.sfx(correct ? 'correct' : 'wrong');
    if (!correct) {
      mistakes++;
      tip.nudge();
    }
    answerChip.textContent = `You entered the ${chosen} portal`;
    answerChip.className = `maze__answer ${chosen === 'YES' ? 'is-yes' : 'is-no'}`;
    // On short/landscape phones the chip is hidden until it has something new
    // to say, so the maze itself gets that row back.
    banner.classList.add('is-answered');

    const last = session.index >= session.total - 1;
    feedback.show(
      correct,
      correct
        ? `Correct — ${chosen} was the right answer!`
        : `Not quite — you chose ${chosen}, the answer was ${q.correct}`,
      q.explanation,
      [
        {
          label: last ? 'See my result' : 'Next maze',
          variant: correct ? '' : 'btn--coral',
          onClick: () => {
            feedback.hide();
            const advance = (): void => {
              if (session.next()) startRound();
              else finish();
            };
            const shown = !correct && coach.register(mistakes, advance);
            if (!shown) advance();
          },
        },
      ],
    );
  }

  function caught(): void {
    if (!running || finished) return;
    restartMaze('An enemy caught you!');
  }

  function finish(): void {
    if (finished) return;
    finished = true;
    running = false;
    audio.sfx('fanfare');
    const { correct, total } = session.result();
    root.appendChild(
      buildCompletion({
        gameId: 'maze',
        gameTitle: 'Choose & Escape',
        correct,
        total,
        extraLine: 'You escaped every maze!',
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('maze'),
        onHub: nav.toHub,
      }),
    );
  }

  function updateStatus(): void {
    // The two hints after the portal sides are marked up separately so a
    // narrow phone can drop them (CSS) instead of wrapping onto three lines
    // and colliding with the D-pad.
    status.innerHTML = `<span class="maze__key maze__key--yes">YES</span> ${yesLeft ? 'left' : 'right'}
      · <span class="maze__key maze__key--no">NO</span> ${yesLeft ? 'right' : 'left'}
      <span class="maze__hint"> · 3 enemies chasing</span><span class="maze__hint maze__hint--tunnel"> · side tunnels wrap left ⇄ right</span>`;
  }

  function randomFloorCell(): { c: number; r: number } {
    for (let i = 0; i < 60; i++) {
      const c = 1 + Math.floor(Math.random() * (COLS - 2));
      const r = 1 + Math.floor(Math.random() * (ROWS - 2));
      if (walkable(c, r)) return { c, r };
    }
    return { c: 1, r: 1 };
  }

  /* ---------------- movement ---------------- */
  /** Counts portal wraps — exposed on the scene element for QA. */
  let wrapCount = 0;

  function stepEntity(pos: { x: number; y: number }, d: Dir | null, speed: number, dt: number): { x: number; y: number } {
    if (!d) return pos;
    let nx = pos.x + d.x * speed * dt;
    const ny = pos.y + d.y * speed * dt;
    const targetC = Math.round(nx + d.x * 0.5);
    const targetR = Math.round(ny + d.y * 0.5);
    if (!walkable(targetC, targetR)) return { x: Math.round(pos.x), y: Math.round(pos.y) };
    // side portals: slide off one edge, appear on the other
    if (nx < -0.5) {
      nx += COLS;
      wrapCount++;
    } else if (nx > COLS - 0.5) {
      nx -= COLS;
      wrapCount++;
    }
    return { x: nx, y: ny };
  }

  const atCentre = (p: { x: number; y: number }): boolean =>
    Math.abs(p.x - Math.round(p.x)) < 0.08 && Math.abs(p.y - Math.round(p.y)) < 0.08;

  /* ---------------- rendering ---------------- */
  let cell = 26;
  let offX = 0;
  let offY = 0;

  /** Flipped by the ResizeObserver so the loop never measures every frame. */
  let sizeDirty = true;
  function resize(): void {
    sizeDirty = false;
    const dpr = canvasDpr();
    // clientWidth/Height are integral; the fractional bounding rect used to
    // round up half a pixel and push the canvas past the viewport edge.
    // NOTE: no minimum here. A 120px floor made the canvas taller than its
    // wrapper on landscape phones, so it spilled over the footer and the
    // D-pad sat on top of the maze.
    const w = Math.max(1, canvasWrap.clientWidth);
    const h = Math.max(1, canvasWrap.clientHeight);
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(6, Math.floor(Math.min(w / COLS, h / ROWS)));
    offX = Math.round((w - cell * COLS) / 2);
    offY = Math.round((h - cell * ROWS) / 2);
  }

  function draw(): void {
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#8fe0ad';
    roundRect(ctx, offX - 6, offY - 6, cell * COLS + 12, cell * ROWS + 12, 16);
    ctx.fill();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = offX + c * cell;
        const y = offY + r * cell;
        if (grid[r]?.[c] === 1) {
          ctx.fillStyle = (r + c) % 2 ? '#f3e6c8' : '#efe0bd';
          ctx.fillRect(x, y, cell, cell);
        } else {
          ctx.fillStyle = '#2f9c5e';
          roundRect(ctx, x + 1, y + 1, cell - 2, cell - 2, cell * 0.3);
          ctx.fill();
          ctx.fillStyle = '#57c47e';
          ctx.beginPath();
          ctx.arc(x + cell * 0.36, y + cell * 0.34, cell * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // side portals (visual hint for the wrap-around corridor)
    const py = offY + tunnelRow * cell + cell / 2;
    [offX, offX + cell * COLS].forEach((px, i) => {
      const g = ctx.createRadialGradient(px, py, cell * 0.1, px, py, cell * 0.9);
      g.addColorStop(0, 'rgba(111,232,255,.85)');
      g.addColorStop(1, 'rgba(111,232,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, cell * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6fe8ff';
      ctx.lineWidth = Math.max(2, cell * 0.09);
      ctx.beginPath();
      ctx.arc(px, py, cell * 0.42, i === 0 ? Math.PI * 0.5 : Math.PI * 1.5, i === 0 ? Math.PI * 1.5 : Math.PI * 0.5);
      ctx.stroke();
      // little chevrons showing the wrap direction
      ctx.beginPath();
      const dirSign = i === 0 ? -1 : 1;
      for (let k = 0; k < 2; k++) {
        const cx2 = px + dirSign * (cell * 0.12 + k * cell * 0.16);
        ctx.moveTo(cx2 - dirSign * cell * 0.08, py - cell * 0.14);
        ctx.lineTo(cx2, py);
        ctx.lineTo(cx2 - dirSign * cell * 0.08, py + cell * 0.14);
      }
      ctx.stroke();
    });

    // gates
    const gateY = offY + gateLeft.r * cell + cell / 2;
    const yesX = offX + (yesLeft ? gateLeft.c : gateRight.c) * cell + cell / 2;
    const noX = offX + (yesLeft ? gateRight.c : gateLeft.c) * cell + cell / 2;
    drawGate(ctx, yesX, gateY, cell * 0.78, 'yes');
    drawGate(ctx, noX, gateY, cell * 0.78, 'no');

    // entrance
    ctx.fillStyle = 'rgba(18,160,143,.25)';
    ctx.beginPath();
    ctx.arc(offX + start.c * cell + cell / 2, offY + start.r * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // enemies
    enemies.forEach((e) => {
      drawChaser(ctx, offX + e.x * cell + cell / 2, offY + e.y * cell + cell / 2, cell * 0.34, time, e.body, e.edge);
    });
    if (grace > 0 && running) {
      const bx = offX + (cell * COLS) / 2;
      const by = offY + 18;
      ctx.fillStyle = 'rgba(11,22,44,.72)';
      roundRect(ctx, bx - 92, by - 14, 184, 30, 15);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      ctx.font = '900 15px ui-rounded, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Safe for ${Math.ceil(grace)}s…`, bx, by + 1);
    }

    // player
    drawRunner(
      ctx,
      offX + player.x * cell + cell / 2,
      offY + player.y * cell + cell / 2,
      cell * 0.34,
      time,
      (dir?.x ?? 1) >= 0 ? 1 : -1,
    );
    if (invincible > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(offX + player.x * cell + cell / 2, offY + player.y * cell + cell / 2, cell * 0.48, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /* ---------------- main loop ---------------- */
  const stopLoop = loop((dt) => {
    time += dt;
    if (sizeDirty) resize();

    if (running && !finished) {
      invincible = Math.max(0, invincible - dt);
      grace = Math.max(0, grace - dt);

      // instant reversal is allowed mid-corridor (classic arcade feel)
      if (wantDir && dir && wantDir.x === -dir.x && wantDir.y === -dir.y) {
        dir = wantDir;
        wantDir = null;
      }
      if (atCentre(player)) {
        player.x = wrapC(Math.round(player.x));
        player.y = Math.round(player.y);
        if (wantDir && walkable(player.x + wantDir.x, player.y + wantDir.y)) {
          dir = wantDir;
          wantDir = null;
        } else if (dir && !walkable(player.x + dir.x, player.y + dir.y)) {
          dir = null; // corridor ends: stop, keep the requested turn buffered
        }
      }
      player = stepEntity(player, dir, PLAYER_SPEED, dt);

      {
        enemies.forEach((e) => {
          e.roveIn -= dt;
          if (e.roveIn <= 0) {
            e.roveIn = 3.5;
            e.roveTarget = randomFloorCell();
          }
          // Decide ONCE per cell. Re-deciding on every frame inside the centre
          // tolerance made the ghosts jitter on the spot instead of patrolling.
          const cellKey = `${wrapC(Math.round(e.x))},${Math.round(e.y)}`;
          if (atCentre(e) && e.lastCell !== cellKey) {
            e.x = wrapC(Math.round(e.x));
            e.y = Math.round(e.y);
            e.dir = chooseGhostDir(e);
            e.lastCell = cellKey;
          }
          // safety net: never let a ghost sit against a wall
          if (!walkable(Math.round(e.x) + e.dir.x, Math.round(e.y) + e.dir.y) && atCentre(e)) {
            e.dir = chooseGhostDir(e);
            e.lastCell = cellKey;
          }
          // classic arcade rule: ghosts crawl inside the wrap-around tunnel,
          // so the portals stay a usable escape route for the player
          const inTunnel = Math.round(e.y) === tunnelRow;
          const speed = inTunnel ? e.speed * 0.45 : e.speed;
          const moved = stepEntity({ x: e.x, y: e.y }, e.dir, speed, dt);
          e.x = moved.x;
          e.y = moved.y;
        });

        const hit = enemies.some((e) => {
          const dx = Math.min(Math.abs(e.x - player.x), COLS - Math.abs(e.x - player.x));
          return Math.hypot(dx, e.y - player.y) < 0.62;
        });
        if (invincible <= 0 && grace <= 0 && hit) caught();
      }

      const pc = Math.round(player.x);
      const pr = Math.round(player.y);
      if (pr === gateLeft.r && pc === gateLeft.c) reachedGate('left');
      else if (pr === gateRight.r && pc === gateRight.c) reachedGate('right');
    }

    // QA hooks: grid position + portal usage, readable from the DOM
    root.dataset.cell = `${Math.round(player.x)},${Math.round(player.y)}`;
    root.dataset.aligned = String(
      Math.abs(player.x - Math.round(player.x)) < 0.001 || Math.abs(player.y - Math.round(player.y)) < 0.001,
    );
    root.dataset.wraps = String(wrapCount);
    root.dataset.grid = `${COLS}x${ROWS}`;
    root.dataset.tunnel = String(tunnelRow);
    root.dataset.pos = `${player.x.toFixed(2)},${player.y.toFixed(2)}`;
    root.dataset.enemycount = String(enemies.length);
    root.dataset.enemies = enemies.map((e) => `${e.x.toFixed(1)}:${e.y.toFixed(1)}`).join('|');
    if (root.dataset.mazegrid !== gridSignature) root.dataset.mazegrid = gridSignature;
    draw();
  });

  /* ---------------- input ---------------- */
  const offKeys = on(window, 'keydown', (ev) => {
    const k = (ev as KeyboardEvent).key.toLowerCase();
    const map: Record<string, Dir> = {
      arrowup: DIRS.up,
      w: DIRS.up,
      arrowdown: DIRS.down,
      s: DIRS.down,
      arrowleft: DIRS.left,
      a: DIRS.left,
      arrowright: DIRS.right,
      d: DIRS.right,
    };
    if (map[k]) {
      wantDir = map[k];
      ev.preventDefault();
    }
  });

  let touchStart: { x: number; y: number } | null = null;
  canvas.addEventListener('pointerdown', (ev) => {
    touchStart = { x: ev.clientX, y: ev.clientY };
  });
  // A gesture taken over by the browser (or a second finger) must not leave a
  // stale swipe origin behind, or the next tap registers a phantom direction.
  canvas.addEventListener('pointercancel', () => {
    touchStart = null;
  });
  canvas.addEventListener('pointerup', (ev) => {
    if (!touchStart) return;
    const dx = ev.clientX - touchStart.x;
    const dy = ev.clientY - touchStart.y;
    touchStart = null;
    if (Math.hypot(dx, dy) < 18) return;
    wantDir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? DIRS.right : DIRS.left) : dy > 0 ? DIRS.down : DIRS.up;
  });

  const offResize = on(window, 'resize', () => {
    sizeDirty = true;
  });
  const ro = new ResizeObserver(() => {
    sizeDirty = true;
  });
  ro.observe(canvasWrap);

  /* ---------------- boot ---------------- */
  generateMaze();
  resetPositions();
  updateStatus();
  statementEl.textContent = session.current.question;
  topicEl.textContent = session.current.topic;
  hud.setProgress(1, session.total);
  requestAnimationFrame(() => resize());

  showGameIntro(
    'Choose & Escape',
    'The maze starts straight away. Read the statement above the maze, then drive into the YES portal or the NO portal — the portal you enter is your answer. Three enemies are hunting you, so plan your route!',
    'maze',
    () => startRound(),
  );

  return {
    root,
    destroy: () => {
      timers.clear();
      coach.dispose();
      feedback.hide();
      closeAllModals();
      stopLoop();
      offKeys();
      offResize();
      ro.disconnect();
      audio.stopMusic();
    },
  };
}
