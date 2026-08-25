/**
 * GAME 3 — FACT OR FALL
 * A top-down cartoon driving game. The car really drives: the world scrolls,
 * wheels roll, the car turns into the chosen road, and a wrong choice ends in
 * a harmless cartoon breakdown with the driver hopping out, worried.
 *
 * The world is drawn on a canvas (cheap on phones) while the car, driver and
 * question panel are DOM/SVG so text stays crisp and readable at any size.
 */
import { el, svgBox, loop, on, clamp, lerp, TimerPool, canvasDpr } from '../../utils/dom';
import { topDownCar, driverCharacter, roadSign } from '../../art/characters';
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

type Phase = 'idle' | 'driving' | 'question' | 'turning' | 'crash' | 'recover' | 'done';

interface Deco {
  side: -1 | 1;
  offset: number; // distance from the road edge
  world: number; // world position
  kind: 'tree' | 'bush' | 'rock' | 'sign' | 'flower';
  size: number;
}

const SEGMENT = 1200; // world distance between forks

export function createFactFallScene(nav: Nav): Scene {
  audio.music('drive');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  /** Official rule: the run continues until the destination or all chances are lost. */
  const MAX_CHANCES = 3;
  let chances = MAX_CHANCES;
  const hud = new Hud({ onBack: nav.toHub, howTo: 'factFall', total: session.total });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('factFall');
  const coach = new MistakeCoach('factFall', 'factFall', 2);
  /** Wrong turns in THIS round only (retries included). */
  let mistakes = 0;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game drive', 'aria-label': 'Fact or Fall driving game' });

  /* ---------------- canvas world ---------------- */
  const canvas = el('canvas', { 'aria-hidden': 'true' }) as HTMLCanvasElement;
  const worldBox = el('div', { class: 'drive__world' }, canvas);
  const ctx = canvas.getContext('2d');

  /* ---------------- car + driver ---------------- */
  const car = svgBox(topDownCar(), 'drive__car');
  const driver = svgBox(driverCharacter(), 'drive__driver');

  /* ---------------- fork signs ---------------- */
  const signYes = svgBox(roadSign('yes'), 'drive__sign drive__sign--yes');
  const signNo = svgBox(roadSign('no'), 'drive__sign drive__sign--no');
  const signs = el('div', { class: 'drive__signs' }, signYes, signNo);

  /* ---------------- question UI ---------------- */
  const topicEl = el('span', { class: 'qpanel__topic' });
  const questionEl = el('p', { class: 'qpanel__text', role: 'heading', 'aria-level': '2' });
  const panel = el('div', { class: 'drive__panel qpanel' }, topicEl, questionEl);

  const leftBtn = el('button', {
    class: 'btn road-btn',
    type: 'button',
    html: '<small>← LEFT ROAD</small><span>YES · FACT</span>',
    'aria-label': 'Take the left road: yes, this is a fact',
  }) as HTMLButtonElement;
  const rightBtn = el('button', {
    class: 'btn road-btn road-btn--right',
    type: 'button',
    html: '<small>RIGHT ROAD →</small><span>NO · MYTH</span>',
    'aria-label': 'Take the right road: no, this is a myth',
  }) as HTMLButtonElement;
  const choices = el('div', { class: 'drive__choices' }, leftBtn, rightBtn);
  const hint = el('div', {
    class: 'drive__hint',
    text: 'Tip: the road signs at the fork show which side is YES and which is NO.',
  });
  const ui = el('div', { class: 'drive__ui' }, panel, choices, hint);

  root.append(worldBox, signs, car, driver, hud.root, ui, tip.root, toast.root, feedback.root);

  /* ---------------- state ---------------- */
  let W = 1;
  let H = 1;
  let dpr = 1;
  let roadW = 200;
  let phase: Phase = 'idle';
  let worldY = 0;
  let speed = 0;
  let finished = false;

  // car screen state
  let carX = 0;
  let carY = 0;
  let carAngle = 0;
  let carScale = 1;
  let turnT = 0;
  let turnDir: -1 | 1 = -1;
  let crashShake = 0;
  let attemptWrong = false; // this fork already scored a wrong answer

  const decos: Deco[] = [];
  let decoSeed = 1234;

  function rnd(): number {
    // deterministic pseudo random so the world doesn't flicker on resize
    decoSeed = (decoSeed * 1664525 + 1013904223) % 4294967296;
    return decoSeed / 4294967296;
  }

  function seedDecorations(): void {
    decos.length = 0;
    const total = SEGMENT * (session.total + 2);
    for (let w = -400; w < total; w += 62) {
      const n = rnd();
      const side: -1 | 1 = n > 0.5 ? 1 : -1;
      const kind: Deco['kind'] =
        n > 0.62 ? 'tree' : n > 0.42 ? 'bush' : n > 0.3 ? 'rock' : n > 0.22 ? 'sign' : 'flower';
      decos.push({
        side,
        offset: 40 + rnd() * 260,
        world: w + rnd() * 60,
        kind,
        size: 0.7 + rnd() * 0.8,
      });
    }
  }
  seedDecorations();

  /** Flipped by the ResizeObserver so the loop never measures every frame. */
  let sizeDirty = true;
  function resize(): void {
    sizeDirty = false;
    lastDrawKey = ''; // geometry changed: force a repaint
    // Use clientWidth/clientHeight (already integral) rather than the
    // fractional bounding rect: rounding a half pixel up pushed the canvas
    // past the viewport and scrolled the page sideways on phones.
    W = Math.max(1, root.clientWidth);
    H = Math.max(1, root.clientHeight);
    dpr = canvasDpr();
    const bw = Math.round(W * dpr);
    const bh = Math.round(H * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    roadW = clamp(W * 0.24, 104, 210);
    const carW = clamp(roadW * 0.46, 62, 110);
    car.style.width = `${carW}px`;
    driver.style.width = `${carW * 0.78}px`;
    if (phase === 'idle' || phase === 'driving') {
      carX = W / 2;
      carY = baseCarY();
    }
  }

  /** The car parks above the question panel so the UI never covers it. */
  // Fork geometry is derived from the free space ABOVE the car so the junction,
  // the branch roads and the pothole always stay inside the viewport.
  /** Branch offset always leaves a clear wedge of grass inside the Y. */
  const branchDX = (): number => clamp(roadW * 1.5, roadW * 1.15, W * 0.36);
  const branchDY = (): number => clamp(baseCarY() * 0.27, 70, 170);
  const stopGap = (): number => clamp(baseCarY() * 0.3, 80, 180);

  const baseCarY = (): number => {
    const uiH = ui.getBoundingClientRect().height || H * 0.28;
    const carH = (car.getBoundingClientRect().width || 80) * (190 / 120);
    return clamp(H - uiH - carH * 0.75, H * 0.28, H * 0.72);
  };
  const forkWorld = (): number => (session.index + 1) * SEGMENT;
  const forkScreenY = (): number => baseCarY() - (forkWorld() - worldY);

  /* ---------------- drawing ---------------- */
  /**
   * The canvas scene is a pure function of (size, worldY, phase, turnDir), so
   * while the player is reading a question nothing on it changes. Re-painting
   * a full-screen canvas 60x a second for an identical picture was the biggest
   * avoidable cost on a mid-range phone; this skips those frames. The car,
   * driver and signs are DOM elements, so their CSS animations keep playing.
   */
  let lastDrawKey = '';
  function drawIfChanged(): void {
    const key = `${W}|${H}|${Math.round(worldY * 4)}|${phase}|${turnDir}`;
    if (key === lastDrawKey) return;
    lastDrawKey = key;
    draw();
  }

  function draw(): void {
    if (!ctx) return;
    const cx = W / 2;

    // grass
    const grass = ctx.createLinearGradient(0, 0, 0, H);
    grass.addColorStop(0, '#6fce8f');
    grass.addColorStop(0.5, '#7ed99b');
    grass.addColorStop(1, '#5fc482');
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // rolling hills in the distance
    ctx.fillStyle = 'rgba(63,174,106,.28)';
    for (let i = 0; i < 3; i++) {
      const y = ((worldY * 0.12 + i * 420) % (H + 500)) - 200;
      ctx.beginPath();
      ctx.ellipse(cx - roadW * 2.4 + i * 90, y, 260, 90, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + roadW * 2.2 - i * 60, y + 160, 300, 100, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const fy = forkScreenY();
    const showFork = fy > -300 && fy < H + 200;
    const bdx = branchDX();
    const bdy = branchDY();

    /* ---- the road is built ONCE as polylines, then rendered in three passes
       (edge → asphalt → centre line) so every marking follows the real shape,
       including through the junction and both branches. ---- */
    type Pt = { x: number; y: number };
    const trunk: Pt[] = [
      { x: cx, y: H + 80 },
      { x: cx, y: showFork ? fy : -120 },
    ];
    const branches: Pt[][] = showFork
      ? ([-1, 1] as const).map((sgn) => [
          { x: cx, y: fy },
          { x: cx + sgn * bdx, y: fy - bdy },
          { x: cx + sgn * bdx, y: fy - bdy - 900 },
        ])
      : [];
    const paths: Pt[][] = [trunk, ...branches];

    const tracePath = (pts: Pt[]): void => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    };

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1 — light shoulder underneath (creates a clean, aligned white edge)
    ctx.strokeStyle = '#eef2f7';
    ctx.lineWidth = roadW + 12;
    paths.forEach((p) => {
      tracePath(p);
      ctx.stroke();
    });

    // 2 — asphalt
    ctx.strokeStyle = '#59637a';
    ctx.lineWidth = roadW;
    paths.forEach((p) => {
      tracePath(p);
      ctx.stroke();
    });

    // 3 — yellow centre line: dashes run ALONG each path, so they can never
    //     drift off the tarmac. The trunk scrolls with the world; the branch
    //     dashes are anchored to the junction and move with it.
    const dash = Math.max(18, roadW * 0.16);
    ctx.strokeStyle = '#ffd85e';
    ctx.lineWidth = Math.max(5, roadW * 0.045);
    ctx.setLineDash([dash, dash * 0.85]);
    ctx.lineCap = 'butt';
    ctx.lineDashOffset = -(worldY % (dash * 1.85));
    tracePath(trunk);
    ctx.stroke();
    ctx.lineDashOffset = 0;
    branches.forEach((p) => {
      tracePath(p);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.lineCap = 'round';

    // 4 — junction pad: a rounded plaza so the Y reads as one piece of road
    if (showFork) {
      ctx.fillStyle = '#59637a';
      ctx.beginPath();
      ctx.arc(cx, fy, roadW * 0.62, 0, Math.PI * 2);
      ctx.fill();
      // painted arrows pointing into each branch
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = Math.max(4, roadW * 0.04);
      ctx.lineCap = 'round';
      ([-1, 1] as const).forEach((sgn) => {
        const ax = cx + sgn * roadW * 0.3;
        const ay = fy - roadW * 0.16;
        ctx.beginPath();
        ctx.moveTo(cx + sgn * roadW * 0.06, fy + roadW * 0.2);
        ctx.lineTo(ax, ay);
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - sgn * roadW * 0.12, ay + roadW * 0.02);
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - sgn * roadW * 0.02, ay + roadW * 0.14);
        ctx.stroke();
      });
    }

    // ---- decorations ----
    // FAIR PLAY RULE: scenery is never allowed to sit on (or near) either road.
    // Both routes must look equally clear so the picture can never hint at the
    // correct answer — the only clue is the question itself.
    decos.forEach((d) => {
      const y = baseCarY() - (d.world - worldY);
      if (y < -80 || y > H + 80) return;
      const x = cx + d.side * (roadW / 2 + d.offset);
      if (x < -80 || x > W + 80) return;
      if (isOnRoad(x, y, fy, showFork, bdx, bdy, 34 * d.size)) return;
      drawDeco(d, x, y);
    });

    // ---- obstacle on a failed road ----
    if (phase === 'crash' || phase === 'recover') {
      drawPothole(cx + turnDir * bdx * 0.9, fy - bdy * 0.86);
    }

    // soft vignette so the UI panel always reads well
    const vig = ctx.createLinearGradient(0, H * 0.55, 0, H);
    vig.addColorStop(0, 'rgba(6,16,32,0)');
    vig.addColorStop(1, 'rgba(6,16,32,.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
  }

  function drawDeco(d: Deco, x: number, y: number): void {
    if (!ctx) return;
    const s = d.size;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = 'rgba(20,60,40,.18)';
    switch (d.kind) {
      case 'tree':
        ctx.beginPath();
        ctx.ellipse(6, 10, 30, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2f9c5e';
        circle(0, 0, 30);
        ctx.fillStyle = '#3fae6a';
        circle(-12, -8, 20);
        circle(14, -4, 18);
        ctx.fillStyle = '#57c47e';
        circle(-2, -14, 15);
        ctx.fillStyle = '#8d6b4b';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'bush':
        ctx.beginPath();
        ctx.ellipse(4, 8, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3fae6a';
        circle(0, 0, 18);
        ctx.fillStyle = '#57c47e';
        circle(-10, 4, 12);
        circle(10, 4, 12);
        break;
      case 'rock':
        ctx.fillStyle = '#9fb0c4';
        ctx.beginPath();
        ctx.moveTo(-14, 8);
        ctx.lineTo(-6, -10);
        ctx.lineTo(8, -12);
        ctx.lineTo(16, 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#c3d0de';
        ctx.beginPath();
        ctx.moveTo(-6, -10);
        ctx.lineTo(8, -12);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 'sign':
        ctx.fillStyle = '#8d6b4b';
        ctx.fillRect(-3, -6, 6, 26);
        ctx.fillStyle = '#2fd6c0';
        roundRect(-20, -30, 40, 26, 8);
        ctx.fill();
        ctx.fillStyle = '#0b7a6d';
        roundRect(-13, -23, 26, 5, 2.5);
        ctx.fill();
        roundRect(-13, -14, 18, 5, 2.5);
        ctx.fill();
        break;
      default:
        ctx.fillStyle = '#ffd166';
        circle(0, 0, 5);
        ctx.fillStyle = '#fff';
        circle(-8, 4, 4);
        circle(8, 3, 4);
        break;
    }
    ctx.restore();
  }

  /** Shortest distance from a point to a line segment. */
  function distToSegment(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
  ): number {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / len2, 0, 1);
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  /**
   * True when a decoration would overlap the tarmac (trunk or either branch),
   * including a safety margin. Used to keep both routes clear and identical.
   */
  function isOnRoad(
    x: number,
    y: number,
    fy: number,
    hasFork: boolean,
    bdx: number,
    bdy: number,
    pad: number,
  ): boolean {
    const cx = W / 2;
    const clear = roadW / 2 + pad + 12;
    // main trunk (from the bottom of the screen up to the junction)
    const trunkTop = hasFork ? fy : -200;
    if (Math.abs(x - cx) < clear && y > trunkTop - clear) return true;
    if (!hasFork) return false;
    // junction pad
    if (Math.hypot(x - cx, y - fy) < roadW * 0.72 + pad) return true;
    // the two branches: diagonal part + the straight part running off-screen
    for (const s of [-1, 1] as const) {
      const jx = cx + s * bdx;
      const jy = fy - bdy;
      if (distToSegment(x, y, cx, fy, jx, jy) < clear) return true;
      if (distToSegment(x, y, jx, jy, jx, jy - 900) < clear) return true;
    }
    return false;
  }

  function circle(x: number, y: number, r: number): void {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(x: number, y: number, w: number, h: number, r: number): void {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawPothole(x: number, y: number): void {
    if (!ctx) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#2f3646';
    ctx.beginPath();
    ctx.ellipse(0, 0, 46, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c212c';
    ctx.beginPath();
    ctx.ellipse(0, 2, 36, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // barrier
    ctx.fillStyle = '#ff9a3c';
    roundRect(-40, -46, 80, 14, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    [-30, -6, 18].forEach((bx) => {
      roundRect(bx, -46, 12, 14, 4);
      ctx.fill();
    });
    ctx.restore();
  }

  /* ---------------- car helpers ---------------- */
  function paintCar(): void {
    const shake = crashShake > 0 ? Math.sin(performance.now() / 28) * crashShake : 0;
    car.style.transform = `translate3d(${carX + shake}px, ${carY}px, 0) translate(-50%, -50%) rotate(${carAngle}deg) scale(${carScale})`;
  }

  function setRolling(on: boolean): void {
    car.classList.toggle('is-rolling', on);
  }

  /* ---------------- question flow ---------------- */
  function updateHud(): void {
    hud.setLabel(
      `Question ${session.humanIndex} / ${session.total} · chances ${chances}/${MAX_CHANCES}`,
      (session.humanIndex - 1) / session.total,
    );
  }

  function showQuestion(): void {
    const q = session.current;
    topicEl.textContent = q.topic;
    questionEl.textContent = q.question;
    updateHud();
    panel.classList.add('is-show');
    leftBtn.disabled = false;
    rightBtn.disabled = false;
    choices.style.visibility = 'visible';
    positionSigns(true);
    phase = 'question';
    audio.setEngineSpeed(0.05);
  }

  function hideQuestion(): void {
    panel.classList.remove('is-show');
    leftBtn.disabled = true;
    rightBtn.disabled = true;
    positionSigns(false);
  }

  function positionSigns(show: boolean): void {
    const fy = forkScreenY();
    const dx = branchDX();
    const sy = clamp(fy - branchDY() * 1.25, 140, H * 0.62);
    signYes.style.left = `${clamp(W / 2 - dx, 70, W - 70)}px`;
    signYes.style.top = `${sy}px`;
    signNo.style.left = `${clamp(W / 2 + dx, 70, W - 70)}px`;
    signNo.style.top = `${sy}px`;
    signYes.classList.toggle('is-show', show);
    signNo.classList.toggle('is-show', show);
  }

  let pendingCorrect = false;

  function answer(choice: 'YES' | 'NO'): void {
    if (phase !== 'question' || finished) return;
    const q = session.current;
    const correct = checkYesNo(q, choice);
    turnDir = choice === 'YES' ? -1 : 1;
    hideQuestion();
    turnT = 0;
    audio.sfx('skid');

    if (correct) {
      if (!attemptWrong) session.score(true);
      phase = 'turning';
      setRolling(true);
      audio.setEngineSpeed(0.9);
      toast.show(attemptWrong ? 'Back on the road!' : 'Correct — nice driving!', 'good', 1500);
    } else {
      if (!attemptWrong) session.score(false);
      mistakes++;
      tip.maybeShow(mistakes);
      attemptWrong = true;
      phase = 'turning';
      setRolling(true);
      audio.setEngineSpeed(0.7);
    }
    pendingCorrect = correct;
  }

  function crash(): void {
    phase = 'crash';
    setRolling(false);
    crashShake = 6;
    car.classList.add('is-broken');
    audio.sfx('crash');
    audio.setEngineSpeed(0);
    timers.after(() => audio.sfx('flatTyre'), 420);
    timers.after(() => {
      crashShake = 0;
      // driver hops out beside the car and reacts
      driver.style.left = `${carX - turnDir * 70}px`;
      driver.style.top = `${carY + 30}px`;
      driver.classList.add('is-out');
    }, 500);

    const q = session.current;
    chances = Math.max(0, chances - 1);
    updateHud();
    const lastChance = chances <= 0;
    timers.after(() => {
      feedback.show(
        false,
        lastChance
          ? 'Crash! That was your last chance'
          : `Oh no — you fell off the road! The answer was ${q.correct}`,
        `${pickRandom(encouragements, '')} ${q.explanation}`,
        [
          {
            label: lastChance ? 'See my result' : `Retry this fork · ${chances} chance(s) left`,
            variant: 'btn--coral',
            onClick: () => {
              feedback.hide();
              if (lastChance) {
                finish(true);
                return;
              }
              // A coaching popup only appears when the mistake threshold is crossed.
              const shown = coach.register(mistakes, () => recover());
              if (!shown) recover();
            },
          },
        ],
      );
    }, 900);
  }

  function recover(): void {
    phase = 'recover';
    driver.classList.remove('is-out');
    car.classList.remove('is-broken');
    audio.sfx('pop');
    session.allowRetry();
    // reverse back down to the junction, then ask again
    const startX = carX;
    const startY = carY;
    const startA = carAngle;
    const t0 = performance.now();
    const dur = 700;
    const step = (): void => {
      const t = clamp((performance.now() - t0) / dur, 0, 1);
      carX = lerp(startX, W / 2, t);
      carY = lerp(startY, baseCarY(), t);
      carAngle = lerp(startA, 0, t);
      paintCar();
      if (t < 1) requestAnimationFrame(step);
      else {
        audio.setEngineSpeed(0.2);
        showQuestion();
      }
    };
    requestAnimationFrame(step);
  }

  function nextFork(): void {
    if (session.next()) {
      attemptWrong = false;
      phase = 'driving';
      speed = 0;
      carX = W / 2;
      carY = baseCarY();
      carAngle = 0;
      setRolling(true);
    } else {
      finish();
    }
  }

  function finish(lost = false): void {
    if (finished) return;
    finished = true;
    phase = 'done';
    setRolling(false);
    audio.stopEngine();
    audio.sfx(lost ? 'defeat' : 'victory');
    const { correct, total } = session.result();
    root.appendChild(
      buildCompletion({
        gameId: 'factFall',
        gameTitle: 'Fact or Fall',
        correct,
        total,
        title: lost ? 'Game over' : undefined,
        extraLine: lost
          ? 'You ran out of chances before reaching the destination.'
          : `You reached the destination with ${chances}/${MAX_CHANCES} chances left!`,
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('factFall'),
        onHub: nav.toHub,
      }),
    );
  }

  /* ---------------- main loop ---------------- */
  const stopLoop = loop((dt) => {
    // The scene element is measured lazily: it only gets its real size once the
    // router has inserted it into the page, and it changes on rotate/resize.
    if (sizeDirty) {
      resize();
      positionSigns(phase === 'question');
    }

    if (phase === 'driving') {
      const target = forkWorld() - stopGap();
      const remaining = target - worldY;
      const cruise = clamp(remaining * 1.6, 90, 520);
      speed = lerp(speed, cruise, 0.06);
      worldY = Math.min(target, worldY + speed * dt);
      audio.setEngineSpeed(clamp(speed / 520, 0.1, 1));
      if (remaining <= 2) {
        worldY = target;
        speed = 0;
        setRolling(false);
        audio.sfx('skid');
        showQuestion();
      }
    } else if (phase === 'turning') {
      turnT = clamp(turnT + dt * (pendingCorrect ? 0.85 : 1.1), 0, 1);
      const fy = forkScreenY();
      const dx = branchDX();
      const dy = branchDY();
      // Quadratic curve from the junction into the chosen branch.
      // A wrong turn stops at the pothole; a correct turn carries on up the road.
      const t = turnT;
      const p0 = { x: W / 2, y: baseCarY() };
      const p1 = { x: W / 2, y: fy };
      const p2 = pendingCorrect
        ? { x: W / 2 + turnDir * dx, y: Math.max(60, fy - dy - roadW * 0.6) }
        : { x: W / 2 + turnDir * dx * 0.9, y: fy - dy * 0.86 };
      carX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      carY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      carAngle = lerp(0, turnDir * 42, Math.min(1, t * 1.6));
      if (pendingCorrect) worldY += 180 * dt * t;
      if (turnT >= 1) {
        if (pendingCorrect) {
          // straighten up, scroll the world, then continue to the next fork
          phase = 'idle';
          audio.sfx('correct');
          const q = session.current;
          feedback.show(true, 'Correct road!', q.explanation, [
            {
              label: session.index >= session.total - 1 ? 'Finish the drive' : 'Drive on',
              onClick: () => {
                feedback.hide();
                nextFork();
              },
            },
          ]);
        } else {
          crash();
        }
      }
    }

    // keep the car parked correctly while a dialog is open
    paintCar();
    drawIfChanged();
  });

  /* ---------------- input ---------------- */
  leftBtn.addEventListener('click', () => answer('YES'));
  rightBtn.addEventListener('click', () => answer('NO'));
  const offKeys = on(window, 'keydown', (ev) => {
    const k = (ev as KeyboardEvent).key;
    if (k === 'ArrowLeft') answer('YES');
    if (k === 'ArrowRight') answer('NO');
  });
  const offResize = on(window, 'resize', () => {
    sizeDirty = true;
  });
  const ro = new ResizeObserver(() => {
    sizeDirty = true;
  });
  ro.observe(root);

  resize();
  updateHud();
  hideQuestion();
  choices.style.visibility = 'hidden';
  carX = W / 2;
  carY = baseCarY();
  paintCar();

  showGameIntro(
    'Fact or Fall',
    'Drive the road and decide at every fork: LEFT = YES, RIGHT = NO. A wrong turn makes the car crash and costs one of your 3 chances. Reach the destination before your chances run out!',
    'factFall',
    () => {
      audio.startEngine();
      choices.style.visibility = 'visible';
      phase = 'driving';
      setRolling(true);
    },
  );

  return {
    root,
    destroy: () => {
      timers.clear();
      coach.dispose();
      feedback.hide();
      tip.hide();
      closeAllModals();
      stopLoop();
      offKeys();
      offResize();
      ro.disconnect();
      audio.stopEngine();
      audio.stopMusic();
    },
  };
}
