/**
 * GAME HUB — the first screen students see.
 * Illustrated background, mascot, three game cards, progress, how-to & settings.
 */
import { el, svgBox } from '../utils/dom';
import { icon } from '../art/icons';
import { hubBackground } from '../art/scenes';
import {
  coverBabyCry,
  coverBingo,
  coverFactFall,
  coverHearts,
  coverMaze,
  coverPrincess,
  coverPuzzle,
} from '../art/covers';
import { mascotKaya } from '../art/characters';
import { audio } from '../core/audio';
import { openHowTo, type HowToId } from '../core/howto';
import { openSettings, soundButtons } from '../core/ui';
import { progress, type GameId } from '../core/state';
import type { Nav, RouteId, Scene } from '../core/router';
import { QUESTIONS_PER_ROUND } from '../data/questions';

interface CardDef {
  id: GameId & RouteId;
  n: number;
  tag: string;
  title: string;
  desc: string;
  art: string;
  pills: string[];
  howTo: HowToId;
}

const CARDS: CardDef[] = [
  {
    id: 'babyCry',
    n: 1,
    tag: 'Emotion · Yes / No',
    title: "Don't Make the Baby Cry",
    desc: 'Beat the timer with YES or NO answers. Three mistakes and the baby has a tantrum — keep the little one calm to the end of the round.',
    art: coverBabyCry(),
    pills: ['Timed YES / NO', '3 chances'],
    howTo: 'babyCry',
  },
  {
    id: 'puzzle',
    n: 2,
    tag: 'Drag & drop puzzle',
    title: 'Attach the Missing Puzzle',
    desc: 'Start with an empty board. Only correct YES/NO answers release a puzzle piece — then drag it into place yourself to reveal the picture.',
    art: coverPuzzle(),
    pills: ['YES / NO', 'Touch dragging'],
    howTo: 'puzzle',
  },
  {
    id: 'factFall',
    n: 3,
    tag: 'Top-down driving',
    title: 'Fact or Fall',
    desc: 'Drive the road and choose LEFT for YES or RIGHT for NO. A wrong turn crashes the car and costs one of your 3 chances.',
    art: coverFactFall(),
    pills: ['YES / NO roads', '3 chances'],
    howTo: 'factFall',
  },
  {
    id: 'hearts',
    n: 4,
    tag: 'Question battle',
    title: 'Save Your Hearts',
    desc: 'Duel the doubt demon! Both start with 3 hearts: correct YES/NO answers land a hit, mistakes cost you a heart.',
    art: coverHearts(),
    pills: ['YES / NO duel', '3 v 3 hearts'],
    howTo: 'hearts',
  },
  {
    id: 'maze',
    n: 5,
    tag: 'Maze chase',
    title: 'Choose & Escape',
    desc: 'Answer first — then the question disappears and you must escape through your own gate while three enemies hunt you.',
    art: coverMaze(),
    pills: ['Answer, then run', '3 enemies'],
    howTo: 'maze',
  },
  {
    id: 'princess',
    n: 6,
    tag: 'Platform adventure',
    title: 'Save the Princess',
    desc: 'Run, jump and hit the ? blocks. Five correct answers open the castle gate — a wrong one costs a life.',
    art: coverPrincess(),
    pills: ['Jump & dodge', '3 lives'],
    howTo: 'princess',
  },
  {
    id: 'bingo',
    n: 7,
    tag: 'Board game',
    title: 'Bingo Game',
    desc: 'Open closed boxes to find stars. A star only counts when you answer its question — complete the highlighted pattern to win.',
    art: coverBingo(),
    pills: ['5x5 board', 'Random pattern'],
    howTo: 'bingo',
  },
];

export function createHubScene(nav: Nav): Scene {
  audio.music('hub');

  const root = el('section', { class: 'hub', 'aria-label': 'SAFE SQUAD game hub' });
  root.appendChild(svgBox(hubBackground(), 'hub__sky'));

  /* ---------- top bar ---------- */
  const logo = svgBox(mascotKaya('happy'), 'hub__logo');
  const settingsBtn = el('button', {
    class: 'icon-btn',
    type: 'button',
    'aria-label': 'Open settings',
    title: 'Settings',
    html: icon('gear'),
  });
  settingsBtn.addEventListener('click', () => {
    audio.sfx('click');
    openSettings();
  });

  const topbar = el(
    'header',
    { class: 'hub__topbar' },
    el(
      'div',
      { class: 'hub__brand' },
      logo,
      el(
        'div',
        { class: 'hub__brandtext' },
        el('strong', { text: 'SAFE SQUAD' }),
        el('span', { text: 'Child Protection Hub' }),
      ),
    ),
    settingsBtn,
    ...soundButtons(),
  );

  /* ---------- hero ---------- */
  const hero = el(
    'div',
    { class: 'hub__hero' },
    el(
      'div',
      { class: 'hub__herotext' },
      el('h1', {
        html: 'Learn to spot the signs.<br><em>Protect every child.</em>',
      }),
      el('p', {
        text: `Seven cartoon mini-games about staying safe online, at school and at home — ${QUESTIONS_PER_ROUND} random questions every round.`,
      }),
      el(
        'div',
        { class: 'hub__herobadges' },
        el('span', { class: 'hub__badge', html: `${icon('tap')}<span>Made for phones</span>` }),
        el('span', { class: 'hub__badge', html: `${icon('question')}<span>5 questions per round</span>` }),
        el('span', { class: 'hub__badge', html: `${icon('people')}<span>Classroom friendly</span>` }),
      ),
    ),
    svgBox(mascotKaya('wave'), 'hub__mascot'),
  );

  /* ---------- progress ---------- */
  const progressCard = buildProgressCard();

  /* ---------- cards ---------- */
  const cards = el('div', { class: 'hub__cards' });
  CARDS.forEach((def) => cards.appendChild(buildCard(def, nav)));

  /* ---------- actions ---------- */
  const howBtn = el('button', {
    class: 'btn btn--sun',
    type: 'button',
    html: `${icon('question')}<span>How to Play</span>`,
  });
  howBtn.addEventListener('click', () => {
    audio.sfx('click');
    openHowTo('hub');
  });
  const setBtn = el('button', {
    class: 'btn btn--ghost',
    type: 'button',
    html: `${icon('gear')}<span>Settings</span>`,
  });
  setBtn.addEventListener('click', () => {
    audio.sfx('click');
    openSettings();
  });

  const inner = el(
    'div',
    { class: 'hub__inner' },
    topbar,
    hero,
    el(
      'div',
      { class: 'hub__sectionhead' },
      el('h2', { text: 'Choose your mission' }),
      el('span', { text: '7 games · 5 questions each' }),
    ),
    cards,
    progressCard,
    el('div', { class: 'hub__actions' }, howBtn, setBtn),
    el('p', {
      class: 'hub__foot',
      html:
        'SAFE SQUAD · original artwork, characters and music created for this project.<br>' +
        'If something in real life feels unsafe, tell a trusted adult straight away.',
    }),
  );
  root.appendChild(inner);

  // First-time visitors get the tutorial automatically.
  if (!progress.seenIntro) {
    window.setTimeout(() => openHowTo('hub'), 700);
  }

  return { root };
}

function buildCard(def: CardDef, nav: Nav): HTMLElement {
  const art = svgBox(def.art, 'gcard__art');
  art.appendChild(el('span', { class: 'gcard__tag', text: def.tag }));
  art.appendChild(el('span', { class: 'gcard__num', text: String(def.n), 'aria-hidden': 'true' }));

  const best = progress.best[def.id];

  const main = el(
    'button',
    {
      class: 'gcard__main',
      type: 'button',
      'aria-label': `Play ${def.title}. ${def.desc}`,
    },
    art,
    el(
      'div',
      { class: 'gcard__body' },
      el('h3', { text: def.title }),
      el('p', { text: def.desc }),
      el(
        'div',
        { class: 'gcard__meta' },
        ...def.pills.map((p) => el('span', { class: 'gcard__pill', text: p })),
        best !== undefined
          ? el('span', { class: 'gcard__pill gcard__pill--best', text: `★ Best ${best}/5` })
          : el('span', { class: 'gcard__pill', text: 'New' }),
      ),
      el(
        'div',
        { class: 'gcard__cta' },
        el('span', { class: 'gcard__play', html: `${icon('play')}<span>Play now</span>` }),
      ),
    ),
  );
  main.addEventListener('click', () => {
    audio.sfx('whoosh');
    nav.go(def.id);
  });

  const how = el('button', {
    class: 'gcard__how',
    type: 'button',
    text: 'How to play',
    'aria-label': `How to play ${def.title}`,
  });
  how.addEventListener('click', (ev) => {
    ev.stopPropagation();
    audio.sfx('click');
    openHowTo(def.howTo);
  });

  return el('article', { class: 'gcard' }, main, el('div', { class: 'gcard__foot' }, how));
}

function buildProgressCard(): HTMLElement {
  const names: Record<GameId, string> = {
    babyCry: 'Baby Cry',
    puzzle: 'Puzzle',
    factFall: 'Fact or Fall',
    hearts: 'Save Your Hearts',
    maze: 'Choose & Escape',
    princess: 'Save the Princess',
    bingo: 'Bingo',
  };
  const bars = el('div', { class: 'hub__progressbars' });
  (Object.keys(names) as GameId[]).forEach((id) => {
    const best = progress.best[id] ?? 0;
    const fill = el('div', { class: 'progress__fill', style: { width: `${(best / 5) * 100}%` } });
    bars.appendChild(
      el(
        'div',
        { class: 'hub__prow' },
        el('span', { text: names[id] }),
        el('span', { class: 'progress__track' }, fill),
        el('b', { text: `${best}/5` }),
      ),
    );
  });
  const shield = el('div', { 'aria-hidden': 'true' });
  shield.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#12a08f" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 19 6v6c0 4.6-3 7.6-7 8.8-4-1.2-7-4.2-7-8.8V6z"/>
      <path d="m8.8 12 2.2 2.2 4.2-4.4"/></svg>`;
  return el(
    'div',
    { class: 'hub__progresscard' },
    shield,
    el(
      'div',
      { style: { flex: '1', minWidth: '0' } },
      el('strong', { style: { fontSize: '0.95rem' }, text: 'Your best scores on this device' }),
      bars,
    ),
  );
}
