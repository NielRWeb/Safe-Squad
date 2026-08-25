/**
 * Reusable "How to Play" system.
 * One definition per screen; the same renderer is used on the hub,
 * before a game starts and from the in-game HUD.
 */
import { openModal, stepRow } from './modal';
import { icon } from '../art/icons';
import { markIntroSeen } from './state';

export type HowToId =
  | 'hub'
  | 'babyCry'
  | 'puzzle'
  | 'factFall'
  | 'hearts'
  | 'maze'
  | 'princess'
  | 'bingo';

interface Step {
  icon: string;
  title: string;
  text: string;
}

interface HowToDef {
  title: string;
  intro: string;
  steps: Step[];
  /** Control explanation differs for touch and mouse. */
  touch: string;
  mouse: string;
}

const isTouch = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

const HOWTO: Record<HowToId, HowToDef> = {
  hub: {
    title: 'How SAFE SQUAD works',
    intro:
      'Three mini-games, five questions each. Every question is about keeping children safe — online, at school and at home.',
    steps: [
      {
        icon: icon('play'),
        title: 'Pick a game',
        text: 'Tap any card on the hub. Each game teaches the same topics in a different way.',
      },
      {
        icon: icon('question'),
        title: '5 questions per round',
        text: 'Questions are drawn at random from the question bank, so every round is different.',
      },
      {
        icon: icon('bulb'),
        title: 'Learn from feedback',
        text: 'After each answer you get a short explanation. Miss a few and a helpful tip appears.',
      },
      {
        icon: icon('shield'),
        title: 'Finish and improve',
        text: 'A completion screen shows your score. Replay to beat it, or return to the hub any time.',
      },
    ],
    touch: 'Tap the big buttons. Nothing needs a long press, and you can play with one thumb.',
    mouse: 'Click the buttons, or use Tab and Enter to play entirely with the keyboard.',
  },

  babyCry: {
    title: "How to play: Don't Make the Baby Cry",
    intro:
      'You are the mother carrying the baby. Answer each YES/NO question before the timer runs out. You get 3 chances for the whole round — the 3rd mistake ends the game with a tantrum.',
    steps: [
      {
        icon: icon('question'),
        title: 'Read the situation',
        text: 'A YES/NO statement appears under the characters, with a countdown bar. Letting the timer run out counts as a mistake.',
      },
      {
        icon: icon('check'),
        title: 'Answer YES or NO',
        text: 'Correct: the baby giggles and the mother smiles. You move to the next question.',
      },
      {
        icon: icon('cross'),
        title: 'Wrong answers',
        text: '1st mistake: the baby cries softly. 2nd: it cries louder. 3rd: a tantrum and the game ends. Chances never reset between questions.',
      },
      {
        icon: icon('bulb'),
        title: 'Goal',
        text: 'Answer all 5 questions of the category without using up your 3 chances.',
      },
    ],
    touch: 'Tap the green YES or red NO button. They are big enough for one-thumb play.',
    mouse: 'Click YES or NO, or press the Y and N keys on your keyboard.',
  },

  puzzle: {
    title: 'How to play: Attach the Missing Puzzle',
    intro:
      'The board starts empty. Answer a question correctly to earn a puzzle piece, then drag that piece into the right hole yourself. Five correct answers complete the picture.',
    steps: [
      {
        icon: icon('question'),
        title: 'Answer to earn a piece',
        text: 'Every question is YES or NO. Only a correct answer releases a piece into your tray.',
      },
      {
        icon: icon('replay'),
        title: 'Wrong answer? Try again',
        text: 'No piece is given. You get the official explanation plus a tip, and the same question comes back.',
      },
      {
        icon: icon('drag'),
        title: 'Drag it into place',
        text: 'Pieces never attach by themselves. Move the piece over its matching hole — it snaps when close enough.',
      },
      {
        icon: icon('cross'),
        title: 'Wrong hole?',
        text: 'The piece bounces back to the tray with a buzz. No penalty — just try another hole.',
      },
      {
        icon: icon('eye'),
        title: 'Hid the question by accident?',
        text: 'Tap the yellow "See Q&A" button to bring it back — you can never skip a question.',
      },
      {
        icon: icon('star'),
        title: 'Complete the picture',
        text: 'Place every piece to reveal the full illustration and finish the round.',
      },
    ],
    touch: 'Press and drag a piece with your finger, then lift your finger over the hole.',
    mouse: 'Click and hold a piece, drag it to the hole and release the mouse button.',
  },

  factFall: {
    title: 'How to play: Fact or Fall',
    intro:
      'You are driving along a cartoon road. At every fork a statement appears — decide whether it is TRUE (YES) or FALSE (NO) and pick your road. You have 3 chances.',
    steps: [
      {
        icon: icon('car'),
        title: 'Drive to the fork',
        text: 'The car drives on its own. It stops at each junction and a question panel slides up.',
      },
      {
        icon: icon('arrowLeft'),
        title: 'LEFT = YES / FACT',
        text: 'Take the left road when you believe the statement is true.',
      },
      {
        icon: icon('arrowRight'),
        title: 'RIGHT = NO / MYTH',
        text: 'Take the right road when you believe the statement is false.',
      },
      {
        icon: icon('cross'),
        title: 'Wrong road = breakdown',
        text: 'The car crashes and you lose one of your 3 chances. You get the explanation and retry the fork — but when the chances run out, the run is over.',
      },
    ],
    touch: 'Tap the LEFT (YES) or RIGHT (NO) button under the question panel.',
    mouse: 'Click a button, or use the ← and → arrow keys to steer.',
  },

  hearts: {
    title: 'How to play: Save Your Hearts',
    intro:
      'A cartoon question battle. You and the doubt demon start with 3 hearts each. Every correct answer lands a hit; every wrong answer costs you a heart. The fight lasts as long as it takes — there is no fixed number of questions.',
    steps: [
      {
        icon: icon('heart'),
        title: '3 hearts each',
        text: 'Hearts are shown above both fighters. The battle ends only when the demon is defeated — or when you run out of hearts.',
      },
      {
        icon: icon('question'),
        title: 'Pick the best action',
        text: 'Each round shows a child-protection situation with three possible responses. Choose the safest one.',
      },
      {
        icon: icon('check'),
        title: 'Correct = you attack',
        text: 'Your hero throws a shield burst and the demon loses one heart. Three hits win the battle.',
      },
      {
        icon: icon('cross'),
        title: 'Wrong = you take a hit',
        text: 'The demon counter-attacks and you lose a heart. Read the explanation, then keep fighting.',
      },
    ],
    touch: 'Tap the answer you think is safest. All buttons are finger-sized.',
    mouse: 'Click an answer, or use Tab and Enter to play from the keyboard.',
  },

  maze: {
    title: 'How to play: Choose & Escape',
    intro:
      'There is no question pop-up. The maze starts straight away: read the statement on the card above the maze, then drive into the YES portal or the NO portal — the portal you enter IS your answer.',
    steps: [
      {
        icon: icon('question'),
        title: 'Read the card, then run',
        text: 'The statement sits on a card above the maze the whole time, so you can re-read it while you move.',
      },
      {
        icon: icon('flag'),
        title: 'The portals are your answer',
        text: 'Drive into the green YES portal or the red NO portal. Both are equally reachable — the maze never hints at the answer.',
      },
      {
        icon: icon('people'),
        title: 'Three enemies hunt you',
        text: 'They patrol the corridors like arcade ghosts. If one catches you, you restart the same question from the entrance.',
      },
      {
        icon: icon('arrowRight'),
        title: 'Use the side portals',
        text: 'The glowing tunnel in the middle row wraps around: run off the left edge and you reappear on the right.',
      },
      {
        icon: icon('star'),
        title: 'Five escapes to win',
        text: 'Reach the correct gate five times to finish the round.',
      },
    ],
    touch: 'Tap the D-pad (or swipe the maze) to set a direction — you keep running until the corridor turns.',
    mouse: 'Arrow keys or WASD. Movement is four-way only, exactly like a classic maze arcade game.',
  },

  princess: {
    title: 'How to play: Save the Princess',
    intro:
      'A cartoon platform adventure. Run and jump across the kingdom, hit the five question blocks, and open the gate to rescue the princess.',
    steps: [
      {
        icon: icon('play'),
        title: 'Run and jump',
        text: 'Cross the platforms, skip the gaps and avoid the wandering critters.',
      },
      {
        icon: icon('question'),
        title: 'Hit the ? blocks',
        text: 'Jump into a question block to pause the action and open a child-protection question.',
      },
      {
        icon: icon('check'),
        title: 'Correct opens the way',
        text: 'A correct answer turns the block into a star. Five stars open the gate to the princess.',
      },
      {
        icon: icon('cross'),
        title: 'Wrong costs a life',
        text: 'A wrong answer, a fall or a critter costs one of your 3 lives and sends you back to the last checkpoint flag.',
      },
    ],
    touch: 'Hold the ◀ ▶ buttons to run and tap the JUMP button to jump.',
    mouse: 'Arrow keys or A/D to run, Space or W to jump.',
  },

  bingo: {
    title: 'How to play: Bingo Game',
    intro:
      'Twenty-five closed boxes. Some hide a star, most are empty. Collect stars on the highlighted pattern to win.',
    steps: [
      {
        icon: icon('flag'),
        title: 'Watch the pattern',
        text: 'One Bingo pattern is chosen at random each round and outlined on the board. Only those squares win the game.',
      },
      {
        icon: icon('tap'),
        title: 'Open a box',
        text: 'Tap any closed box. It either cracks open on an empty square, or reveals a star.',
      },
      {
        icon: icon('star'),
        title: 'Stars ask a question',
        text: 'A star is only collected once you answer its YES/NO question correctly. A wrong answer keeps the question active — try again.',
      },
      {
        icon: icon('check'),
        title: 'Complete the pattern',
        text: 'Collect a star on every highlighted square to win. Only the highlighted pattern counts as a Bingo.',
      },
    ],
    touch: 'Tap a box to open it. The board scales to your screen so every box stays finger-sized.',
    mouse: 'Click a box to open it. Hover shows which box you are about to pick.',
  },
};

export function openHowTo(id: HowToId, onClose?: () => void): void {
  const def = HOWTO[id] ?? HOWTO.hub;
  const body: (Node | string)[] = [def.intro];
  def.steps.forEach((s) => body.push(stepRow(s.icon, s.title, s.text)));
  body.push(
    stepRow(
      isTouch() ? icon('tap') : icon('mouse'),
      isTouch() ? 'Touch controls' : 'Mouse & keyboard',
      isTouch() ? def.touch : def.mouse,
    ),
  );
  const note = document.createElement('p');
  note.className = 'howto-note';
  note.textContent =
    'Remember: if a real situation ever feels unsafe, talk to a trusted adult straight away.';
  body.push(note);

  if (id === 'hub') markIntroSeen();

  openModal({
    title: def.title,
    body,
    actions: [{ label: "Got it — let's play", variant: 'mint' }],
    onClose,
  });
}
