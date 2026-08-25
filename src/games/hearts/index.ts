/**
 * GAME 4 — SAVE YOUR HEARTS
 * A cartoon question battle against the doubt demon. Both fighters start with
 * 3 hearts:
 *   correct answer → your hero attacks and the demon loses a heart
 *   wrong answer   → the demon counter-attacks and you lose a heart
 *
 * THE BATTLE IS NOT A FIXED FIVE-QUESTION ROUND. It runs until the demon is
 * defeated or the player is knocked out, so the number of questions depends on
 * how the fight goes. Questions come from the shared bank through
 * QuestionFeeder (same shuffling rules as QuizSession, but endless).
 */
import { el, svgBox, delay, TimerPool } from '../../utils/dom';
import { icon } from '../../art/icons';
import { arenaBackground } from '../../art/scenes2';
import { energyBurst, heroFighter, rivalFighter } from '../../art/characters2';
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

const MAX_HEARTS = 3;

export function createHeartsScene(nav: Nav): Scene {
  audio.music('battle');
  // clean slate: no dialog from a previous round may survive into this one
  closeAllModals();

  const session = new QuizSession();
  const hud = new Hud({ onBack: nav.toHub, howTo: 'hearts', total: MAX_HEARTS });
  const feedback = new Feedback();
  const toast = new Toast();
  const tip = new TipBubble('hearts', 'top');
  const coach = new MistakeCoach('hearts', 'hearts');
  const overlay = new QuestionOverlay();

  let heroHearts = MAX_HEARTS;
  let rivalHearts = MAX_HEARTS;
  let finished = false;
  let busy = false;

  /** Scene-scoped timers: cleared on destroy so no stale alert can pop up. */
  const timers = new TimerPool();

  const root = el('section', { class: 'game hearts', 'aria-label': 'Save Your Hearts battle game' });
  root.appendChild(svgBox(arenaBackground(), 'game__bg'));

  /* ---------------- fighters ---------------- */
  const heroBox = svgBox(heroFighter(), 'hearts__fighter hearts__fighter--hero');
  const rivalBox = svgBox(rivalFighter(), 'hearts__fighter hearts__fighter--rival');
  const heroSvg = heroBox.querySelector('svg') as SVGElement;
  const rivalSvg = rivalBox.querySelector('svg') as SVGElement;

  const burst = svgBox(energyBurst('hero'), 'hearts__burst');

  const heroHeartRow = el('div', { class: 'hearts__row', 'aria-label': 'Your hearts' });
  const rivalHeartRow = el('div', { class: 'hearts__row', 'aria-label': 'Rival hearts' });

  /** HUD shows battle progress instead of "question n / 5". */
  function updateHud(): void {
    const landed = MAX_HEARTS - rivalHearts;
    hud.setLabel(`Demon hearts ${rivalHearts} / ${MAX_HEARTS}`, landed / MAX_HEARTS);
  }

  function renderHearts(): void {
    const build = (row: HTMLElement, count: number, who: string): void => {
      row.replaceChildren();
      for (let i = 0; i < MAX_HEARTS; i++) {
        const alive = i < count;
        const h = el('span', {
          class: `hearts__pip${alive ? '' : ' is-lost'}`,
          html: icon('heart'),
          'aria-hidden': 'true',
        });
        row.appendChild(h);
      }
      row.setAttribute('aria-label', `${who}: ${count} of ${MAX_HEARTS} hearts left`);
    };
    build(heroHeartRow, heroHearts, 'You');
    build(rivalHeartRow, rivalHearts, 'Demon');
    updateHud();
  }

  const arena = el(
    'div',
    { class: 'hearts__arena' },
    el(
      'div',
      { class: 'hearts__side hearts__side--hero' },
      el('div', { class: 'hearts__name', text: 'BANTAY (You)' }),
      heroHeartRow,
      heroBox,
    ),
    el('div', { class: 'hearts__vs' }, el('span', { text: 'VS' })),
    el(
      'div',
      { class: 'hearts__side hearts__side--rival' },
      el('div', { class: 'hearts__name', text: 'GRUMBLE · DOUBT DEMON' }),
      rivalHeartRow,
      rivalBox,
    ),
    burst,
  );

  const askBtn = el('button', {
    class: 'btn btn--sun hearts__ask',
    type: 'button',
    html: `${icon('question')}<span>See question</span>`,
    'aria-label': 'Reopen the current question',
  }) as HTMLButtonElement;
  askBtn.addEventListener('click', () => {
    audio.sfx('click');
    overlay.reopen();
    syncAsk();
  });

  const stage = el('div', { class: 'game__stage hearts__stage' }, arena, askBtn);
  root.append(hud.root, stage, overlay.root, tip.root, toast.root, feedback.root);

  function syncAsk(): void {
    const show = !overlay.isOpen && !finished && !busy;
    askBtn.classList.toggle('is-show', show);
    askBtn.disabled = !show;
  }

  /* ---------------- battle helpers ---------------- */
  function setFace(svg: SVGElement, mood: 'calm' | 'determined' | 'hurt'): void {
    svg.classList.remove('mood-calm', 'mood-determined', 'mood-hurt');
    svg.classList.add(`mood-${mood}`);
  }

  async function attack(who: 'hero' | 'rival'): Promise<void> {
    const attacker = who === 'hero' ? heroSvg : rivalSvg;
    const target = who === 'hero' ? rivalSvg : heroSvg;
    burst.innerHTML = energyBurst(who);
    attacker.classList.add('is-attacking');
    setFace(attacker, 'determined');
    audio.sfx('attack');
    burst.classList.remove('is-flying-hero', 'is-flying-rival');
    void burst.offsetWidth; // restart the CSS animation
    burst.classList.add(who === 'hero' ? 'is-flying-hero' : 'is-flying-rival');

    await delay(430);
    target.classList.add('is-hit');
    setFace(target, 'hurt');
    audio.sfx('hurt');
    if (who === 'hero') rivalHearts--;
    else heroHearts--;
    renderHearts();
    (who === 'hero' ? rivalHeartRow : heroHeartRow).classList.add('is-shaking');

    await delay(620);
    attacker.classList.remove('is-attacking');
    target.classList.remove('is-hit');
    burst.classList.remove('is-flying-hero', 'is-flying-rival');
    heroHeartRow.classList.remove('is-shaking');
    rivalHeartRow.classList.remove('is-shaking');
    setFace(attacker, 'calm');
    setFace(target, 'calm');
  }

  /* ---------------- question flow ---------------- */
  function askQuestion(): void {
    if (finished) return;
    updateHud();
    overlay.ask(session.current, onAnswer, {
      closable: true,
      caption: `Question ${session.humanIndex} of ${session.total} · demon hearts ${rivalHearts}`,
      onClose: () => {
        toast.show('Tap "See question" to bring the battle question back.', 'plain', 2400);
        syncAsk();
      },
    });
    syncAsk();
  }

  async function onAnswer(correct: boolean): Promise<void> {
    if (busy) return;
    busy = true;
    syncAsk();
    const q = session.current;
    session.score(correct);

    await delay(520);
    overlay.hide();
    await attack(correct ? 'hero' : 'rival');

    if (correct) {
      toast.show('Direct hit! The demon loses a heart.', 'good', 1600);
    } else {
      toast.show('Ouch! You lose a heart.', 'bad', 1600);
      tip.maybeShow(session.wrong);
    }

    const over = heroHearts <= 0 || rivalHearts <= 0;
    feedback.show(
      correct,
      correct ? 'Correct — nice hit!' : 'Wrong — the demon strikes back',
      q.explanation,
      [
        {
          label: over ? 'See the result' : 'Next attack',
          variant: correct ? '' : 'btn--coral',
          onClick: () => {
            feedback.hide();
            busy = false;
            if (over) {
              finish();
              return;
            }
            // The battle continues until one side is knocked out — there is no
            // fixed question count here.
            const advance = (): void => {
              if (session.next()) askQuestion();
              else finish();
            };
            const shown = !correct && coach.register(session.wrong, advance);
            if (!shown) advance();
          },
        },
      ],
    );
  }

  function finish(): void {
    if (finished) return;
    finished = true;
    syncAsk();
    overlay.hide();
    const won = rivalHearts <= 0 && heroHearts > 0;
    audio.sfx(won ? 'victory' : 'defeat');
    heroSvg.classList.toggle('is-winner', won);
    rivalSvg.classList.toggle('is-winner', !won);
    setFace(won ? heroSvg : rivalSvg, 'determined');
    setFace(won ? rivalSvg : heroSvg, 'hurt');

    const { correct, total } = session.result();
    timers.after(() => {
      root.appendChild(
        buildCompletion({
          gameId: 'hearts',
          gameTitle: 'Save Your Hearts',
          correct,
          total,
          title: won ? undefined : 'Game over',
          extraLine: won
            ? `Demon defeated — you kept ${heroHearts} of ${MAX_HEARTS} hearts!`
            : `The demon won this one. You landed ${MAX_HEARTS - rivalHearts} of ${MAX_HEARTS} hits.`,
          message: session.completionMessage,
          categoryName: session.category.name,
          onReplay: () => nav.go('hearts'),
          onHub: nav.toHub,
        }),
      );
    }, 900);
  }

  /* ---------------- boot ---------------- */
  renderHearts();
  setFace(heroSvg, 'calm');
  setFace(rivalSvg, 'calm');
  syncAsk();

  showGameIntro(
    'Save Your Hearts',
    'You and the doubt demon both start with 3 hearts. Every correct answer knocks a heart off the demon — every wrong answer costs you one. The battle runs until one of you is defeated, so there is no fixed number of questions!',
    'hearts',
    () => askQuestion(),
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
