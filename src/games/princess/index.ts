/**
 * GAME 6 — SAVE THE PRINCESS
 * An original cartoon platform adventure (no borrowed characters or levels).
 * Run, jump, dodge critters, punch the five ? blocks to answer child-protection
 * questions, then walk through the opened gate to rescue the princess.
 *
 *  · correct answer → the block turns into a star and the gate gets closer
 *  · wrong answer / fall / critter → lose one of 3 lives, respawn at the last
 *    checkpoint flag (this is the SAFE SQUAD "retry" behaviour)
 *  · the question itself is asked through the shared QuestionOverlay
 */
import { el, loop, on, clamp, TimerPool, canvasDpr } from '../../utils/dom';
import { icon } from '../../art/icons';
import {
  drawCritter,
  drawFlag,
  drawGateDoor,
  drawPlatformHero,
  drawPrincess,
  drawQuestionBlock,
  roundRect,
  star,
} from '../../art/canvasArt';
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

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Critter {
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  to: number;
  dir: number;
  alive: boolean;
}
interface QBlock {
  x: number;
  y: number;
  s: number;
  used: boolean;
}

const GRAVITY = 2200;
const MOVE_SPEED = 260;
const JUMP_V = 900; // ≈184px jump — every platform and ? block is reachable
const HERO_W = 42;
const HERO_H = 58;
const GROUND_Y = 460;
const MAX_LIVES = 3;

export function createPrincessScene(nav: Nav): Scene {
  audio.music('hero');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  const hud = new Hud({ onBack: nav.toHub, howTo: 'princess', total: session.total });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('princess', 'top');
  const coach = new MistakeCoach('princess', 'princess');
  const overlay = new QuestionOverlay();

  /**
   * Classroom assist mode (add ?assist=1 to the URL). Falls and critters send
   * the student back to the checkpoint without costing a life, so the lesson
   * questions stay reachable for players who find platforming hard.
   */
  const params = new URLSearchParams(location.search);
  const assist = params.has('assist');
  /**
   * Classroom demo helper: `?level=2` (or 3) starts on that level, so a teacher
   * can show the castle ending without replaying the whole world.
   */
  const startLevel = Math.max(0, Math.min(2, (Number(params.get('level')) || 1) - 1));

  let lives = MAX_LIVES;
  let stars = 0;
  let finished = false;
  let paused = true;
  let time = 0;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game princess', 'aria-label': 'Save the Princess platform game' });

  const canvas = el('canvas', { class: 'princess__canvas', 'aria-hidden': 'true' }) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  root.appendChild(el('div', { class: 'princess__world' }, canvas));

  /* ---------------- levels ---------------- */
  /**
   * THREE hand-authored levels. Each one must be cleared (all of its question
   * blocks answered) before its exit gate opens; the last level ends at the
   * castle where the princess is waiting.
   */
  interface LevelDef {
    name: string;
    width: number;
    platforms: Platform[];
    critters: Critter[];
    blocks: QBlock[];
    checkpoints: { x: number; y: number; reached: boolean }[];
    gate: { x: number; y: number; w: number; h: number };
  }

  const makeLevels = (): LevelDef[] => [
    {
      name: 'Green Fields',
      width: 2400,
      platforms: [
        { x: 0, y: GROUND_Y, w: 760, h: 120 },
        { x: 880, y: GROUND_Y, w: 620, h: 120 },
        { x: 1620, y: GROUND_Y, w: 780, h: 120 },
        { x: 380, y: 350, w: 180, h: 26 },
        { x: 700, y: 290, w: 160, h: 26 },
        { x: 1120, y: 330, w: 190, h: 26 },
        { x: 1760, y: 300, w: 200, h: 26 },
      ],
      critters: [
        { x: 560, y: GROUND_Y - 40, w: 46, h: 40, from: 470, to: 690, dir: 1, alive: true },
        { x: 1800, y: GROUND_Y - 40, w: 46, h: 40, from: 1700, to: 2100, dir: -1, alive: true },
      ],
      blocks: [
        { x: 430, y: 250, s: 56, used: false },
        { x: 1180, y: 220, s: 56, used: false },
      ],
      checkpoints: [
        { x: 120, y: GROUND_Y, reached: true },
        { x: 1000, y: GROUND_Y, reached: false },
      ],
      gate: { x: 2200, y: GROUND_Y, w: 120, h: 170 },
    },
    {
      name: 'Cloud Steps',
      width: 2600,
      platforms: [
        { x: 0, y: GROUND_Y, w: 560, h: 120 },
        { x: 700, y: GROUND_Y, w: 420, h: 120 },
        { x: 1280, y: GROUND_Y, w: 500, h: 120 },
        { x: 1920, y: GROUND_Y, w: 680, h: 120 },
        { x: 330, y: 330, w: 160, h: 26 },
        { x: 620, y: 260, w: 150, h: 24 },
        { x: 900, y: 330, w: 170, h: 26 },
        { x: 1360, y: 300, w: 190, h: 26 },
        { x: 1640, y: 240, w: 150, h: 24 },
        { x: 2050, y: 320, w: 190, h: 26 },
      ],
      critters: [
        { x: 820, y: GROUND_Y - 40, w: 46, h: 40, from: 740, to: 1080, dir: 1, alive: true },
        { x: 1420, y: GROUND_Y - 40, w: 46, h: 40, from: 1320, to: 1740, dir: -1, alive: true },
        { x: 2200, y: GROUND_Y - 40, w: 46, h: 40, from: 2000, to: 2400, dir: 1, alive: true },
      ],
      blocks: [
        { x: 660, y: 170, s: 56, used: false },
        { x: 1680, y: 150, s: 56, used: false },
      ],
      checkpoints: [
        { x: 100, y: GROUND_Y, reached: true },
        { x: 1340, y: GROUND_Y, reached: false },
      ],
      gate: { x: 2400, y: GROUND_Y, w: 120, h: 170 },
    },
    {
      name: 'Castle Approach',
      width: 3000,
      platforms: [
        { x: 0, y: GROUND_Y, w: 3000, h: 120 },
        { x: 300, y: 320, w: 170, h: 26 },
        { x: 900, y: 330, w: 190, h: 26 },
        { x: 1180, y: 250, w: 150, h: 24 },
        { x: 1620, y: 320, w: 190, h: 26 },
        { x: 1900, y: 250, w: 160, h: 24 },
        { x: 2200, y: 320, w: 180, h: 26 },
      ],
      critters: [
        { x: 900, y: GROUND_Y - 40, w: 46, h: 40, from: 800, to: 1300, dir: 1, alive: true },
        { x: 1700, y: GROUND_Y - 40, w: 46, h: 40, from: 1520, to: 1980, dir: -1, alive: true },
        { x: 2300, y: GROUND_Y - 40, w: 46, h: 40, from: 2150, to: 2500, dir: 1, alive: true },
      ],
      blocks: [{ x: 1560, y: 312, s: 56, used: false }],
      checkpoints: [
        { x: 100, y: GROUND_Y, reached: true },
        { x: 1520, y: GROUND_Y, reached: false },
      ],
      gate: { x: 2680, y: GROUND_Y, w: 130, h: 190 },
    },
  ];

  const levels = makeLevels();
  const TOTAL_BLOCKS = levels.reduce((n, l) => n + l.blocks.length, 0);
  let levelIndex = 0;
  let level: LevelDef = levels[0];
  let platforms = level.platforms;
  let critters = level.critters;
  let blocks = level.blocks;
  let checkpoints = level.checkpoints;
  let gate = level.gate;
  let LEVEL_W = level.width;
  const princessPos = { x: 2880, y: GROUND_Y };

  /** Loads a level and drops the hero at its entrance. */
  function loadLevel(index: number): void {
    levelIndex = index;
    level = levels[index];
    platforms = level.platforms;
    critters = level.critters;
    blocks = level.blocks;
    checkpoints = level.checkpoints;
    gate = level.gate;
    LEVEL_W = level.width;
    spawn = { x: 90, y: GROUND_Y - HERO_H };
    hero.x = spawn.x;
    hero.y = spawn.y;
    hero.vx = 0;
    hero.vy = 0;
    hero.invincible = 1.2;
    camera = 0;
    renderStatus();
  }

  /* ---------------- hero ---------------- */
  let spawn = { x: 90, y: GROUND_Y - HERO_H };
  let camera = 0;
  const hero = {
    x: 90,
    y: GROUND_Y - HERO_H,
    vx: 0,
    vy: 0,
    grounded: true,
    facing: 1,
    invincible: 0,
  };
  camera = 0;

  const input = { left: false, right: false, jump: false };

  /* ---------------- HUD extras ---------------- */
  const lifeRow = el('div', { class: 'princess__lives', 'aria-label': 'Lives' });
  const starRow = el('div', { class: 'princess__stars' });
  function renderStatus(): void {
    lifeRow.replaceChildren();
    for (let i = 0; i < MAX_LIVES; i++) {
      lifeRow.appendChild(
        el('span', {
          class: `princess__life${i < lives ? '' : ' is-lost'}`,
          html: icon('heart'),
          'aria-hidden': 'true',
        }),
      );
    }
    lifeRow.setAttribute('aria-label', `${lives} of ${MAX_LIVES} hearts left`);
    starRow.innerHTML =
      `${icon('flag')}<span>Level ${levelIndex + 1}/${levels.length}</span>` +
      `${icon('star')}<span>${stars} / ${TOTAL_BLOCKS}</span>`;
    hud.setLabel(`Level ${levelIndex + 1} of ${levels.length} · ${stars}/${TOTAL_BLOCKS} stars`,
      stars / TOTAL_BLOCKS);
  }

  /* ---------------- touch controls ---------------- */
  const holdBtn = (
    label: string,
    key: 'left' | 'right' | 'jump',
    cls: string,
    aria: string,
  ): HTMLButtonElement => {
    const b = el('button', {
      class: `princess__btn ${cls}`,
      type: 'button',
      'aria-label': aria,
      html: label,
    }) as HTMLButtonElement;
    const down = (ev: Event): void => {
      ev.preventDefault();
      input[key] = true;
      if (key === 'jump') tryJump();
      b.classList.add('is-down');
    };
    const up = (): void => {
      input[key] = false;
      b.classList.remove('is-down');
    };
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointerleave', up);
    b.addEventListener('pointercancel', up);
    return b;
  };

  const controls = el(
    'div',
    { class: 'princess__controls' },
    el(
      'div',
      { class: 'princess__dpad' },
      holdBtn(icon('arrowLeft'), 'left', 'is-left', 'Move left'),
      holdBtn(icon('arrowRight'), 'right', 'is-right', 'Move right'),
    ),
    holdBtn('<span>JUMP</span>', 'jump', 'is-jump', 'Jump'),
  );

  const statusBar = el('div', { class: 'princess__status' }, lifeRow, starRow);
  root.append(hud.root, statusBar, controls, overlay.root, tip.root, toast.root, feedback.root);

  /* ---------------- helpers ---------------- */
  function tryJump(): void {
    if (paused || finished) return;
    if (hero.grounded) {
      hero.vy = -JUMP_V;
      hero.grounded = false;
      audio.sfx('jump');
    }
  }

  function respawn(): void {
    hero.x = spawn.x;
    hero.y = spawn.y;
    hero.vx = 0;
    hero.vy = 0;
    hero.invincible = 1.4;
    camera = clamp(hero.x - viewW() * 0.35, 0, Math.max(0, LEVEL_W - viewW()));
  }

  function loseLife(reason: string): void {
    if (paused || finished || hero.invincible > 0) return;
    if (assist) {
      audio.sfx('pop');
      toast.show(`${reason} — assist mode: back to the checkpoint`, 'plain', 1600);
      respawn();
      return;
    }
    lives--;
    renderStatus();
    audio.sfx('hurt');
    paused = true;
    if (lives <= 0) {
      gameOver();
      return;
    }
    toast.show(`${reason} — ${lives} ${lives === 1 ? 'heart' : 'hearts'} left`, 'bad', 2000);
    timers.after(() => {
      respawn();
      paused = false;
    }, 700);
  }

  /** Clears the current level and moves the hero to the next one. */
  function nextLevel(): void {
    if (finished) return;
    paused = true;
    audio.sfx('victory');
    const nextName = levels[levelIndex + 1].name;
    feedback.show(
      true,
      `Level ${levelIndex + 1} complete — ${level.name} cleared!`,
      `Great work. Next up: ${nextName}. Your lives and stars carry over.`,
      [
        {
          label: 'Enter the next level',
          onClick: () => {
            feedback.hide();
            loadLevel(levelIndex + 1);
            paused = false;
          },
        },
      ],
    );
  }

  function gameOver(): void {
    if (finished) return;
    finished = true;
    paused = true;
    audio.sfx('defeat');
    const { correct, total } = session.result();
    root.appendChild(
      buildCompletion({
        gameId: 'princess',
        gameTitle: 'Save the Princess',
        correct,
        total,
        title: 'Game over',
        extraLine: `Out of hearts on level ${levelIndex + 1}! You collected ${stars} of ${TOTAL_BLOCKS} stars.`,
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('princess'),
        onHub: nav.toHub,
      }),
    );
  }

  function win(): void {
    if (finished) return;
    finished = true;
    paused = true;
    audio.sfx('victory');
    const { correct, total } = session.result();
    root.appendChild(
      buildCompletion({
        gameId: 'princess',
        gameTitle: 'Save the Princess',
        correct,
        total,
        extraLine: `You cleared all ${levels.length} levels and rescued the princess!`,
        message: session.completionMessage,
        categoryName: session.category.name,
        onReplay: () => nav.go('princess'),
        onHub: nav.toHub,
      }),
    );
  }

  /* ---------------- question blocks ---------------- */
  let activeBlock: QBlock | null = null;

  const seeBtn = el('button', {
    class: 'btn btn--sun princess__see',
    type: 'button',
    html: `${icon('question')}<span>See Q&amp;A</span>`,
    'aria-label': 'Reopen the current question',
  }) as HTMLButtonElement;
  seeBtn.addEventListener('click', () => {
    audio.sfx('click');
    overlay.reopen();
    syncSee();
  });
  root.appendChild(seeBtn);

  function syncSee(): void {
    const show = !!activeBlock && !overlay.isOpen && !finished;
    seeBtn.classList.toggle('is-show', show);
    seeBtn.disabled = !show;
  }

  function hitBlock(block: QBlock): void {
    if (block.used || activeBlock || finished) return;
    activeBlock = block;
    paused = true;
    audio.sfx('boxOpen');
    hud.setProgress(session.humanIndex, session.total);
    overlay.ask(session.current, (correct) => onBlockAnswer(correct, block), {
      closable: true,
      caption: `Question block ${stars + 1} of ${TOTAL_BLOCKS}`,
      onClose: () => {
        toast.show('Tap "See Q&A" to answer the block question.', 'plain', 2400);
        syncSee();
      },
    });
    syncSee();
  }

  function onBlockAnswer(correct: boolean, block: QBlock): void {
    session.score(correct);
    timers.after(() => {
      overlay.hide();
      if (correct) {
        block.used = true;
        stars++;
        renderStatus();
        audio.sfx('coin');
        const levelDone = blocks.every((b) => b.used);
        toast.show(
          `Star ${stars} of ${TOTAL_BLOCKS}!${levelDone ? ' The gate of this level is open!' : ''}`,
          'good',
          2000,
        );
        feedback.show(true, 'Correct — the block turns into a star', session.current.explanation, [
          {
            label: stars === blocks.length ? 'Head for the gate' : 'Keep going',
            onClick: () => {
              feedback.hide();
              activeBlock = null;
              syncSee();
              session.next();
              paused = false;
            },
          },
        ]);
      } else {
        const q = session.current;
        tip.nudge();
        feedback.show(
          false,
          `Wrong answer — that costs a heart (the answer was ${q.correct})`,
          `${q.explanation} You will restart from the last checkpoint and can hit the block again.`,
          [
          {
            label: 'Back to checkpoint',
            variant: 'btn--coral',
            onClick: () => {
              feedback.hide();
              activeBlock = null;
              syncSee();
              const after = (): void => {
                if (assist) {
                  respawn();
                  paused = false;
                  return;
                }
                lives--;
                renderStatus();
                if (lives <= 0) {
                  gameOver();
                  return;
                }
                audio.sfx('hurt');
                respawn();
                paused = false;
              };
              const shown = coach.register(session.wrong, after);
              if (!shown) after();
            },
          },
        ],
        );
      }
    }, 480);
  }

  /* ---------------- physics ---------------- */
  function update(dt: number): void {
    if (paused || finished) return;
    time += dt;
    hero.invincible = Math.max(0, hero.invincible - dt);

    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    hero.vx = dir * MOVE_SPEED;
    if (dir !== 0) hero.facing = dir;
    if (input.jump && hero.grounded) tryJump();

    hero.x = clamp(hero.x + hero.vx * dt, 0, LEVEL_W - HERO_W);
    hero.vy += GRAVITY * dt;
    const nextY = hero.y + hero.vy * dt;

    // platform collisions (simple AABB, landing from above / bumping from below)
    hero.grounded = false;
    for (const p of platforms) {
      const overlapX = hero.x + HERO_W > p.x + 4 && hero.x < p.x + p.w - 4;
      if (!overlapX) continue;
      if (hero.vy >= 0 && hero.y + HERO_H <= p.y + 6 && nextY + HERO_H >= p.y) {
        hero.y = p.y - HERO_H;
        hero.vy = 0;
        hero.grounded = true;
      } else if (hero.vy < 0 && hero.y >= p.y + p.h - 6 && nextY <= p.y + p.h) {
        hero.y = p.y + p.h;
        hero.vy = 40;
      }
    }
    if (!hero.grounded) hero.y = hero.vy === 0 ? hero.y : nextY;

    // fell into a gap
    if (hero.y > GROUND_Y + 260) {
      loseLife('You fell');
      return;
    }

    // critters
    for (const c of critters) {
      if (!c.alive) continue;
      c.x += c.dir * 70 * dt;
      if (c.x < c.from) {
        c.x = c.from;
        c.dir = 1;
      }
      if (c.x > c.to) {
        c.x = c.to;
        c.dir = -1;
      }
      const hit =
        hero.x + HERO_W - 8 > c.x && hero.x + 8 < c.x + c.w && hero.y + HERO_H > c.y && hero.y < c.y + c.h;
      if (!hit) continue;
      if (hero.vy > 120 && hero.y + HERO_H < c.y + c.h * 0.7) {
        // bounce off the critter (harmless cartoon squash)
        c.alive = false;
        hero.vy = -JUMP_V * 0.65;
        audio.sfx('pop');
      } else {
        loseLife('A critter bumped you');
        return;
      }
    }

    // question blocks (hit from below or by touching)
    for (const b of blocks) {
      if (b.used) continue;
      const near =
        hero.x + HERO_W > b.x - 6 && hero.x < b.x + b.s + 6 && hero.y < b.y + b.s + 10 && hero.y + HERO_H > b.y - 10;
      if (near) {
        hitBlock(b);
        break;
      }
    }

    // checkpoints
    for (const cp of checkpoints) {
      if (!cp.reached && hero.x > cp.x) {
        cp.reached = true;
        spawn = { x: cp.x + 10, y: GROUND_Y - HERO_H };
        audio.sfx('appear');
        toast.show('Checkpoint reached!', 'good', 1400);
      }
    }

    // gate: locked until every ? block in THIS level is answered
    const levelCleared = blocks.every((b) => b.used);
    const lastLevel = levelIndex === levels.length - 1;
    if (hero.x + HERO_W > gate.x + 6) {
      if (!levelCleared) {
        hero.x = gate.x - HERO_W + 6;
        const left = blocks.filter((b) => !b.used).length;
        toast.show(`The gate is locked — ${left} question block(s) left in this level.`, 'plain', 1600);
      } else if (!lastLevel) {
        nextLevel();
        return;
      }
    }
    // the princess only exists on the final level
    if (lastLevel && levelCleared && hero.x + HERO_W > princessPos.x - 40) win();

    camera = clamp(hero.x - viewW() * 0.35, 0, Math.max(0, LEVEL_W - viewW()));
  }

  /** Visible level width in LEVEL units (canvas pixels ÷ current draw scale). */
  const drawScale = (): number => {
    const h = canvas.clientHeight || 620;
    const w = canvas.clientWidth || 900;
    // The level is authored for a 620-unit-tall view. On a tall portrait phone
    // fitting the height alone zooms in so far that the player cannot see the
    // next platform or pit, so also cap the scale to keep at least ~430 level
    // units of track visible. Landscape and desktop are unaffected.
    return clamp(Math.min(h / 620, w / 430), 0.55, 1.5);
  };
  const viewW = (): number => (canvas.clientWidth || 900) / drawScale();

  /* ---------------- rendering ---------------- */
  /* The canvas is stretched by CSS (width/height: 100%); only the backing
   * store is written here. Writing an inline px width used to fight the CSS
   * and produced a sub-pixel overflow that scrolled the page sideways.
   * `dirty` is flipped by the ResizeObserver so the loop never has to force a
   * layout read on every single frame (a real cost on low-end phones). */
  let sizeDirty = true;
  function resize(): void {
    sizeDirty = false;
    const host = canvas.parentElement ?? root;
    const dpr = canvasDpr();
    const w = Math.max(1, Math.floor(host.clientWidth || root.clientWidth));
    const h = Math.max(1, Math.floor(host.clientHeight || root.clientHeight));
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(): void {
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    // the level is authored for a 620px-tall view; scale to fit the screen
    const scale = drawScale();
    ctx.clearRect(0, 0, w, h);

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#5bc0ff');
    sky.addColorStop(0.55, '#9fe3ff');
    sky.addColorStop(1, '#d9f6ea');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // parallax clouds + hills
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 520 - camera * 0.25) % (w + 700)) - 200;
      const cy = 60 + (i % 3) * 46;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 62, 26, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 44, cy + 10, 44, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - 44, cy + 12, 38, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#7ed99b';
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 460 - camera * 0.45) % (w + 900)) - 250;
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.72, 240, 120, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(0, h - 620 * scale);
    ctx.scale(scale, scale);
    ctx.translate(-camera, 0);

    // dark earth behind everything below the ground line: the gaps between
    // platforms then read as real pits instead of white holes.
    ctx.fillStyle = '#3f2d1f';
    ctx.fillRect(camera - 60, GROUND_Y, viewW() + 120, 900);

    // platforms
    for (const p of platforms) {
      const grassH = Math.min(18, p.h * 0.4);
      ctx.fillStyle = '#8d6b4b';
      roundRect(ctx, p.x, p.y, p.w, p.h, 10);
      ctx.fill();
      ctx.fillStyle = '#57c47e';
      roundRect(ctx, p.x, p.y, p.w, grassH + 6, 10);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.08)';
      for (let i = 0; i < p.w; i += 60) {
        ctx.fillRect(p.x + i + 12, p.y + grassH + 16, 26, 6);
      }
    }

    // checkpoints
    checkpoints.forEach((cp) => drawFlag(ctx, cp.x, cp.y, 78, cp.reached, time));

    // question blocks
    blocks.forEach((b) => drawQuestionBlock(ctx, b.x, b.y, b.s, b.used, time));

    // critters
    critters.forEach((c) => c.alive && drawCritter(ctx, c.x, c.y, c.w, c.h, time));

    // gate + princess (the princess waits at the end of the final level)
    const levelCleared = blocks.every((b) => b.used);
    drawGateDoor(ctx, gate.x, gate.y, gate.w, gate.h, levelCleared);
    // the princess is drawn at the hero's scale (HERO_H tall including crown)
    if (levelIndex === levels.length - 1) {
      drawPrincess(ctx, princessPos.x, princessPos.y, HERO_H * 1.14, time);
    }

    // hero
    drawPlatformHero(ctx, hero.x, hero.y, HERO_W, HERO_H, {
      facing: hero.facing,
      running: Math.abs(hero.vx) > 10,
      grounded: hero.grounded,
      t: time,
      invincible: hero.invincible > 0,
    });

    // floating counter above the gate
    if (!levelCleared) {
      ctx.fillStyle = 'rgba(11,22,44,.75)';
      roundRect(ctx, gate.x - 24, gate.y - gate.h - 96, 180, 48, 14);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      star(ctx, gate.x + 4, gate.y - gate.h - 72, 16, 7);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '900 24px ui-rounded, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${blocks.filter((b) => b.used).length} / ${blocks.length}`,
        gate.x + 28,
        gate.y - gate.h - 70,
      );
    }

    ctx.restore();
  }

  /* ---------------- loop + input ---------------- */
  const stopLoop = loop((dt) => {
    if (sizeDirty) resize();
    update(dt);
    draw();
  });

  const offKeyDown = on(window, 'keydown', (ev) => {
    const k = (ev as KeyboardEvent).key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = true;
    if (k === 'arrowright' || k === 'd') input.right = true;
    if (k === ' ' || k === 'arrowup' || k === 'w') {
      input.jump = true;
      tryJump();
      ev.preventDefault();
    }
  });
  const offKeyUp = on(window, 'keyup', (ev) => {
    const k = (ev as KeyboardEvent).key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = false;
    if (k === 'arrowright' || k === 'd') input.right = false;
    if (k === ' ' || k === 'arrowup' || k === 'w') input.jump = false;
  });
  const offResize = on(window, 'resize', () => {
    sizeDirty = true;
  });
  const ro = new ResizeObserver(() => {
    sizeDirty = true;
  });
  ro.observe(canvas.parentElement ?? root);

  /* ---------------- boot ---------------- */
  loadLevel(startLevel);
  renderStatus();
  syncSee();
  resize();

  showGameIntro(
    'Save the Princess',
    'Three levels of running and jumping. Every ? block asks a YES/NO child-protection question: answer correctly to turn it into a star and open the level gate. A wrong answer, a fall or a critter costs one of your 3 hearts. Clear all three levels to save the princess.',
    'princess',
    () => {
      paused = false;
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
      stopLoop();
      offKeyDown();
      offKeyUp();
      offResize();
      ro.disconnect();
      audio.stopMusic();
    },
  };
}
