/**
 * SAFE SQUAD — illustrated environments and hub card art for games 4-7.
 * Same visual language as scenes.ts (flat cartoon shapes, warm gradients).
 */

const slice = 'preserveAspectRatio="xMidYMid slice"';

/* ---------------------------------------------------------------- */
/* GAME 4 — cartoon battle arena                                      */
/* ---------------------------------------------------------------- */
export function arenaBackground(): string {
  const crowd = Array.from({ length: 26 }, (_, i) => {
    const x = 40 + i * 46;
    const y = 300 + (i % 3) * 16;
    const c = ['#ffd166', '#63c6ff', '#ff9a86', '#7ed99b', '#c9b3ff'][i % 5];
    return `<g transform="translate(${x} ${y})"><circle r="17" fill="${c}" opacity=".85"/>
      <path d="M-20 34c0-16 9-24 20-24s20 8 20 24z" fill="${c}" opacity=".6"/></g>`;
  }).join('');

  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="arenaSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2c5c"/><stop offset=".45" stop-color="#3f4fa0"/>
      <stop offset="1" stop-color="#7b61ff"/>
    </linearGradient>
    <linearGradient id="arenaFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffb648"/><stop offset="1" stop-color="#e08a2a"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="0%" r="70%">
      <stop offset="0" stop-color="#fff6d6" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff6d6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#arenaSky)"/>
  <ellipse cx="600" cy="120" rx="520" ry="300" fill="url(#spot)"/>

  <!-- banners -->
  ${[160, 420, 780, 1040]
    .map(
      (x, i) => `<g transform="translate(${x} 0)">
      <rect x="-34" y="-10" width="68" height="150" rx="10" fill="${['#2fd6c0', '#ff6f61', '#ffd166', '#63c6ff'][i]}"/>
      <path d="M-34 140h68l-34 34z" fill="${['#12a08f', '#c9483c', '#e0a92a', '#2f9ae0'][i]}"/>
      <circle cx="0" cy="62" r="22" fill="#fff" opacity=".85"/>
      <path d="M0 46 14 52v14c0 10-6 16-14 20-8-4-14-10-14-20V52z" fill="#0e1a33" opacity=".7"/>
    </g>`,
    )
    .join('')}

  <!-- crowd stand -->
  <path d="M0 260h1200v120H0z" fill="#152449"/>
  ${crowd}
  <path d="M0 356h1200v34H0z" fill="#0e1a33"/>

  <!-- arena floor -->
  <path d="M60 390h1080l120 410H-60z" fill="url(#arenaFloor)"/>
  <path d="M100 420h1000l90 320H10z" fill="#ffd08a" opacity=".55"/>
  <g stroke="#c9803c" stroke-width="5" opacity=".45">
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${120 + i * 160} 400 ${60 + i * 190} 800"/>`).join('')}
  </g>
  <ellipse cx="600" cy="640" rx="420" ry="80" fill="#ffe3b0" opacity=".5"/>
</svg>`;
}

/* ---------------------------------------------------------------- */
/* GAME 5 — hedge-garden backdrop behind the maze canvas              */
/* ---------------------------------------------------------------- */
export function mazeBackground(): string {
  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="mazeSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#123a5c"/><stop offset=".5" stop-color="#1f6f7a"/>
      <stop offset="1" stop-color="#2f9c6a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#mazeSky)"/>
  <g opacity=".18" fill="#fff">
    <ellipse cx="220" cy="120" rx="120" ry="46"/><ellipse cx="300" cy="140" rx="90" ry="34"/>
    <ellipse cx="980" cy="180" rx="130" ry="48"/><ellipse cx="890" cy="196" rx="80" ry="30"/>
  </g>
  <circle cx="1010" cy="120" r="56" fill="#ffe08a" opacity=".85"/>
  <path d="M0 620c150-60 300-20 460 10s320 20 480-30 260-20 260-20v220H0z" fill="#1f7a56" opacity=".7"/>
  <path d="M0 700c180-40 340 10 520 20s340-30 500-10 180 20 180 20v70H0z" fill="#176046"/>
  ${[90, 300, 900, 1120]
    .map(
      (x, i) => `<g transform="translate(${x} ${700 - (i % 2) * 40}) scale(${1 + (i % 2) * 0.25})">
      <rect x="-8" y="-10" width="16" height="60" rx="8" fill="#6b4f36"/>
      <circle cx="0" cy="-34" r="42" fill="#2f9c5e"/>
      <circle cx="-28" cy="-12" r="28" fill="#3fae6a"/><circle cx="28" cy="-12" r="28" fill="#3fae6a"/>
      <circle cx="-6" cy="-56" r="24" fill="#57c47e" opacity=".9"/>
    </g>`,
    )
    .join('')}
</svg>`;
}

/* ---------------------------------------------------------------- */
/* GAME 7 — Bingo game-show stage                                     */
/* ---------------------------------------------------------------- */
export function bingoBackground(): string {
  const bulbs = Array.from({ length: 22 }, (_, i) => {
    const x = 40 + i * 54;
    return `<circle cx="${x}" cy="46" r="11" fill="#ffe08a" opacity=".9"/>
            <circle cx="${x}" cy="46" r="20" fill="#ffd166" opacity=".18"/>`;
  }).join('');

  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="bingoWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1b6b"/><stop offset=".55" stop-color="#4b2fa8"/>
      <stop offset="1" stop-color="#7b4fd0"/>
    </linearGradient>
    <linearGradient id="bingoStageG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9a86"/><stop offset="1" stop-color="#e0553f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bingoWall)"/>
  <!-- radial rays -->
  <g opacity=".14" fill="#fff">
    ${Array.from({ length: 12 }, (_, i) => {
      const a1 = (i / 12) * Math.PI * 2;
      const a2 = a1 + 0.16;
      const r = 900;
      return `<path d="M600 360 L${600 + Math.cos(a1) * r} ${360 + Math.sin(a1) * r} L${
        600 + Math.cos(a2) * r
      } ${360 + Math.sin(a2) * r}z"/>`;
    }).join('')}
  </g>
  ${bulbs}
  <!-- curtains -->
  <path d="M0 0h230c-40 220-10 460 30 800H0z" fill="url(#bingoStageG)"/>
  <path d="M1200 0H970c40 220 10 460-30 800h260z" fill="url(#bingoStageG)"/>
  <g opacity=".25" stroke="#7a1f14" stroke-width="6">
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${40 + i * 42} 0c-20 260 0 520 20 800"/>`).join('')}
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${1160 - i * 42} 0c20 260 0 520-20 800"/>`).join('')}
  </g>
  <!-- stage floor -->
  <path d="M0 690h1200v110H0z" fill="#241a52"/>
  <ellipse cx="600" cy="700" rx="520" ry="60" fill="#ffd166" opacity=".12"/>
  <!-- floating stars -->
  ${[
    [180, 250, 1],
    [1030, 300, 0.8],
    [300, 560, 0.6],
    [920, 590, 0.7],
  ]
    .map(
      ([x, y, s]) =>
        `<g transform="translate(${x} ${y}) scale(${s})" opacity=".5">
          <path d="m0-26 8 17 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3z" fill="#ffd166"/></g>`,
    )
    .join('')}
</svg>`;
}

