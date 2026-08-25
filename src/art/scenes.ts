/**
 * SAFE SQUAD — original illustrated environments (inline SVG).
 * Each game gets its own scene while sharing the same art direction:
 * flat shapes, thick friendly outlines, warm sky gradients, rounded hills.
 */

const slice = 'preserveAspectRatio="xMidYMid slice"';

/* ---------------------------------------------------------------- */
/* Reusable illustration bits                                        */
/* ---------------------------------------------------------------- */
function cloud(x: number, y: number, s: number, o = 0.9): string {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">
    <ellipse cx="0" cy="0" rx="34" ry="20" fill="#fff"/>
    <ellipse cx="26" cy="6" rx="24" ry="15" fill="#fff"/>
    <ellipse cx="-26" cy="6" rx="22" ry="13" fill="#fff"/>
  </g>`;
}

function tree(x: number, y: number, s: number, tone = '#3fae6a'): string {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-6" y="-6" width="12" height="34" rx="6" fill="#8d6b4b"/>
    <circle cx="0" cy="-26" r="26" fill="${tone}"/>
    <circle cx="-18" cy="-12" r="18" fill="${tone}"/>
    <circle cx="18" cy="-12" r="18" fill="${tone}"/>
    <circle cx="-6" cy="-38" r="16" fill="#57c47e" opacity=".8"/>
  </g>`;
}

function bush(x: number, y: number, s: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="26" ry="17" fill="#3fae6a"/>
    <ellipse cx="-14" cy="4" rx="16" ry="12" fill="#57c47e"/>
    <ellipse cx="14" cy="4" rx="16" ry="12" fill="#48b872"/>
  </g>`;
}

/* ---------------------------------------------------------------- */
/* HUB — a sunny hilltop town at golden hour                          */
/* ---------------------------------------------------------------- */
export function hubBackground(): string {
  const stars = Array.from({ length: 26 }, () => {
    const x = Math.round(Math.random() * 1200);
    const y = Math.round(Math.random() * 240);
    const r = (Math.random() * 1.6 + 0.8).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(
      Math.random() * 0.5 +
      0.25
    ).toFixed(2)}"/>`;
  }).join('');

  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="hubSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f2b52"/><stop offset=".42" stop-color="#2a6f9e"/>
      <stop offset=".72" stop-color="#54b6c4"/><stop offset="1" stop-color="#9ee7cf"/>
    </linearGradient>
    <radialGradient id="hubSun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#ffd166"/>
      <stop offset="1" stop-color="#ffd166" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#hubSky)"/>
  ${stars}
  <circle cx="960" cy="210" r="150" fill="url(#hubSun)" opacity=".85"/>
  <circle cx="960" cy="210" r="52" fill="#ffe08a" opacity=".95"/>
  ${cloud(190, 150, 1.25, 0.5)}${cloud(700, 110, 0.9, 0.4)}${cloud(1060, 330, 1.1, 0.35)}
  ${cloud(380, 300, 0.75, 0.28)}

  <!-- far hills -->
  <path d="M0 560c150-70 260-30 380 10s250 40 400-20 320-40 420 10v240H0z" fill="#2c7f86" opacity=".85"/>
  <path d="M0 620c170-60 300-10 430 30s260 20 400-30 300-20 370 20v160H0z" fill="#238a7a"/>
  <!-- mid hills -->
  <path d="M0 690c180-50 330 10 470 30s260-10 400-40 260-10 330 20v100H0z" fill="#1f9e7f"/>
  <!-- village -->
  <g opacity=".95">
    <g transform="translate(150 640)">
      <rect x="-34" y="-46" width="68" height="48" rx="8" fill="#f3e2c7"/>
      <path d="M-44-46 0-84l44 38z" fill="#e07a5f"/>
      <rect x="-12" y="-28" width="24" height="30" rx="4" fill="#ffd166"/>
    </g>
    <g transform="translate(1010 660) scale(.9)">
      <rect x="-34" y="-46" width="68" height="48" rx="8" fill="#f3e2c7"/>
      <path d="M-44-46 0-84l44 38z" fill="#7b61ff"/>
      <rect x="-12" y="-28" width="24" height="30" rx="4" fill="#ffd166"/>
    </g>
  </g>
  ${tree(300, 700, 1.1)}${tree(430, 730, 0.85, '#35a061')}${tree(880, 720, 1.05)}
  ${tree(1130, 700, 0.9, '#35a061')}${bush(600, 760, 1.2)}${bush(760, 786, 1)}
  <!-- foreground grass -->
  <path d="M0 760c220-40 420 20 640 10s380-40 560-16v46H0z" fill="#7ed99b"/>
  <rect y="790" width="1200" height="20" fill="#7ed99b"/>
</svg>`;
}

/* ---------------------------------------------------------------- */
/* GAME 1 — cosy nursery / living room                               */
/* ---------------------------------------------------------------- */
export function nurseryBackground(): string {
  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe6c9"/><stop offset="1" stop-color="#ffcfa8"/>
    </linearGradient>
    <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c98b52"/><stop offset="1" stop-color="#a86e3c"/>
    </linearGradient>
    <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#d7f4e6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#wall)"/>
  <!-- wallpaper dots -->
  <g fill="#ffb98a" opacity=".55">
    ${Array.from({ length: 40 }, (_, i) => {
      const x = 60 + (i % 10) * 125;
      const y = 70 + Math.floor(i / 10) * 130;
      return `<circle cx="${x}" cy="${y}" r="7"/><circle cx="${x + 62}" cy="${y + 65}" r="4"/>`;
    }).join('')}
  </g>
  <!-- window -->
  <g transform="translate(170 130)">
    <rect x="-14" y="-14" width="288" height="248" rx="22" fill="#fff6e6" stroke="#e2a86f" stroke-width="12"/>
    <rect x="4" y="4" width="252" height="212" rx="10" fill="url(#winSky)"/>
    ${cloud(90, 60, 0.6, 0.95)}${cloud(200, 130, 0.45, 0.8)}
    <circle cx="215" cy="50" r="26" fill="#ffe08a"/>
    <path d="M4 170c40-26 80-6 120 10s90 6 132-14v50H4z" fill="#7ed99b"/>
    <rect x="120" y="4" width="14" height="212" fill="#e2a86f"/>
    <rect x="4" y="100" width="252" height="14" fill="#e2a86f"/>
  </g>
  <!-- shelf with toys -->
  <g transform="translate(830 190)">
    <rect x="0" y="150" width="300" height="18" rx="9" fill="#c98b52"/>
    <g transform="translate(50 150)">
      <circle cx="0" cy="-30" r="30" fill="#7b61ff"/><circle cx="-22" cy="-52" r="12" fill="#7b61ff"/>
      <circle cx="22" cy="-52" r="12" fill="#7b61ff"/><circle cx="-10" cy="-30" r="4" fill="#fff"/>
      <circle cx="10" cy="-30" r="4" fill="#fff"/><ellipse cx="0" cy="-18" rx="10" ry="7" fill="#ffd7c9"/>
    </g>
    <g transform="translate(150 150)">
      <rect x="-26" y="-52" width="52" height="52" rx="10" fill="#ff6f61"/>
      <rect x="-14" y="-40" width="28" height="28" rx="6" fill="#ffd166"/>
    </g>
    <g transform="translate(240 150)">
      <path d="M-24 0v-56h48v56z" fill="#2fd6c0"/><path d="M-24-56h48l-10 12h-28z" fill="#12a08f"/>
    </g>
  </g>
  <!-- hanging mobile -->
  <g transform="translate(600 0)" opacity=".95">
    <path d="M0 0v90" stroke="#c98b52" stroke-width="6"/>
    <path d="M-90 90h180" stroke="#c98b52" stroke-width="6" stroke-linecap="round"/>
    <g><path d="M-80 90v30" stroke="#c98b52" stroke-width="4"/><circle cx="-80" cy="136" r="16" fill="#ffd166"/></g>
    <g><path d="M0 90v46" stroke="#c98b52" stroke-width="4"/><path d="M-16 152a16 16 0 1 1 32 0z" fill="#63c6ff"/></g>
    <g><path d="M80 90v24" stroke="#c98b52" stroke-width="4"/><path d="M80 116l14 24H66z" fill="#ff9a86"/></g>
  </g>
  <!-- floor + rug -->
  <path d="M0 620h1200v180H0z" fill="url(#floorG)"/>
  <g stroke="#8f5a2c" stroke-width="4" opacity=".5">
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 150} 620 ${i * 150 - 60} 800"/>`).join('')}
  </g>
  <ellipse cx="600" cy="740" rx="440" ry="90" fill="#f2b5a0"/>
  <ellipse cx="600" cy="740" rx="330" ry="66" fill="#ffd7c9"/>
  <ellipse cx="600" cy="740" rx="210" ry="42" fill="#fff0e2"/>
  <!-- crib on the right -->
  <g transform="translate(1000 470)">
    <rect x="-10" y="0" width="230" height="24" rx="12" fill="#e2a86f"/>
    <rect x="-10" y="90" width="230" height="24" rx="12" fill="#e2a86f"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 30}" y="0" width="10" height="110" rx="5" fill="#f0c391"/>`).join('')}
    <rect x="0" y="112" width="16" height="52" rx="8" fill="#c98b52"/>
    <rect x="200" y="112" width="16" height="52" rx="8" fill="#c98b52"/>
  </g>
</svg>`;
}

/* ---------------------------------------------------------------- */
/* GAME 2 — bright classroom / craft table                            */
/* ---------------------------------------------------------------- */
export function puzzleBackground(): string {
  return `
<svg viewBox="0 0 1200 800" ${slice} aria-hidden="true">
  <defs>
    <linearGradient id="clsWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b3f6b"/><stop offset=".55" stop-color="#2f6fa8"/>
      <stop offset="1" stop-color="#3f9bbd"/>
    </linearGradient>
    <linearGradient id="deskG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0b979"/><stop offset="1" stop-color="#c9803c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#clsWall)"/>
  <!-- soft light beams -->
  <g opacity=".12" fill="#fff">
    <path d="M120 0 320 0 120 800 -80 800z"/>
    <path d="M520 0 640 0 420 800 300 800z"/>
    <path d="M980 0 1140 0 980 800 820 800z"/>
  </g>
  <!-- pin board -->
  <g transform="translate(120 90)">
    <rect width="420" height="280" rx="20" fill="#f6e0bd" stroke="#c9803c" stroke-width="12"/>
    <g transform="translate(40 40)">
      <rect width="150" height="110" rx="8" fill="#fff" transform="rotate(-4)"/>
      <g transform="rotate(-4) translate(12 14)">
        <circle cx="30" cy="26" r="18" fill="#ffd166"/>
        <path d="M0 84c8-26 24-34 30-34s22 8 30 34z" fill="#2fd6c0"/>
        <rect x="76" y="14" width="58" height="10" rx="5" fill="#cfd9e6"/>
        <rect x="76" y="34" width="46" height="10" rx="5" fill="#cfd9e6"/>
        <rect x="76" y="54" width="58" height="10" rx="5" fill="#cfd9e6"/>
      </g>
      <g transform="translate(190 10) rotate(5)">
        <rect width="150" height="110" rx="8" fill="#fff"/>
        <path d="M22 76 60 34l26 28 20-18 24 32z" fill="#7ed99b"/>
        <circle cx="112" cy="26" r="14" fill="#ffd166"/>
      </g>
    </g>
    <circle cx="60" cy="34" r="8" fill="#ff6f61"/>
    <circle cx="360" cy="40" r="8" fill="#7b61ff"/>
  </g>
  <!-- whiteboard -->
  <g transform="translate(700 110)">
    <rect width="400" height="250" rx="18" fill="#f7fbff" stroke="#cfd9e6" stroke-width="10"/>
    <g stroke="#2fd6c0" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M50 70h180"/><path d="M50 110h240"/><path d="M50 150h140"/>
    </g>
    <g transform="translate(300 150)">
      <path d="M0-60 46-42v34c0 24-18 38-46 46-28-8-46-22-46-46v-34z" fill="#ffd166" stroke="#e0a92a" stroke-width="7"/>
      <path d="m-18 -6 12 12 26-28" stroke="#8a6100" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
  <!-- desk -->
  <path d="M0 560h1200v240H0z" fill="url(#deskG)"/>
  <rect y="548" width="1200" height="34" rx="16" fill="#f3cf9e"/>
  <g opacity=".35" stroke="#a86e3c" stroke-width="4">
    ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${600 + i * 18}h1200"/>`).join('')}
  </g>
  <!-- desk props -->
  <g transform="translate(110 560)">
    <rect x="-40" y="-70" width="80" height="70" rx="12" fill="#ff6f61" stroke="#c9483c" stroke-width="6"/>
    <rect x="-16" y="-96" width="12" height="30" rx="6" fill="#ffd166"/>
    <rect x="4" y="-104" width="12" height="38" rx="6" fill="#63c6ff"/>
    <rect x="-34" y="-100" width="12" height="34" rx="6" fill="#7ed99b"/>
  </g>
  <g transform="translate(1080 560)">
    <ellipse cx="0" cy="-8" rx="58" ry="14" fill="#e0f7ff"/>
    <path d="M-46-8c0-30 92-30 92 0z" fill="#a8e6ff"/>
    <path d="M-30-40c6-14 54-14 60 0z" fill="#7ed99b" opacity=".8"/>
  </g>
</svg>`;
}

export function puzzlePicture(): string {
  return `
<svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="ppSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#d9f6ea"/>
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#ppSky)"/>
  <circle cx="252" cy="34" r="22" fill="#ffe08a"/>
  <g fill="#fff" opacity=".9">
    <ellipse cx="60" cy="34" rx="22" ry="13"/><ellipse cx="76" cy="38" rx="16" ry="10"/>
    <ellipse cx="44" cy="38" rx="14" ry="9"/>
    <ellipse cx="180" cy="22" rx="16" ry="9"/><ellipse cx="192" cy="25" rx="12" ry="7"/>
  </g>
  <!-- school building -->
  <g transform="translate(150 96)">
    <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#fff3df" stroke="#d9a26a" stroke-width="3"/>
    <path d="M-80-30 0-66l80 36z" fill="#e07a5f" stroke="#b9553c" stroke-width="3"/>
    <rect x="-14" y="-6" width="28" height="36" rx="4" fill="#7b61ff"/>
    <circle cx="6" cy="14" r="2.4" fill="#ffd166"/>
    <rect x="-56" y="-16" width="24" height="20" rx="4" fill="#63c6ff" stroke="#3f9bbd" stroke-width="2"/>
    <rect x="32" y="-16" width="24" height="20" rx="4" fill="#63c6ff" stroke="#3f9bbd" stroke-width="2"/>
    <path d="M0-66v-12" stroke="#8d6b4b" stroke-width="3"/>
    <path d="M0-78h18l-4 6 4 6H0z" fill="#2fd6c0"/>
  </g>
  <!-- grass -->
  <path d="M0 130c60-16 110 8 160 10s90-10 140-14v74H0z" fill="#7ed99b"/>
  <path d="M0 152c70-10 120 12 170 12s90-8 130-12v48H0z" fill="#5fc482"/>
  <!-- trees -->
  <g transform="translate(28 138)">
    <rect x="-4" y="-4" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-18" r="18" fill="#3fae6a"/><circle cx="-12" cy="-8" r="12" fill="#48b872"/>
    <circle cx="12" cy="-8" r="12" fill="#48b872"/>
  </g>
  <g transform="translate(276 146) scale(.85)">
    <rect x="-4" y="-4" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-18" r="18" fill="#3fae6a"/><circle cx="-12" cy="-8" r="12" fill="#48b872"/>
  </g>
  <!-- three students + trusted adult holding a shield -->
  <g transform="translate(96 168)">
    <ellipse cx="0" cy="16" rx="16" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-13 14c-2-22 4-30 13-30s15 8 13 30z" fill="#ff6f61"/>
    <circle cx="0" cy="-22" r="12" fill="#f7c9a5"/>
    <path d="M-12-24a12 12 0 0 1 24 0c-4-5-8-6-12-6s-8 1-12 6z" fill="#3b2b28"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-3-15c2 2 4 2 6 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(150 172) scale(1.15)">
    <ellipse cx="0" cy="14" rx="17" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-14 12c-2-22 5-30 14-30s16 8 14 30z" fill="#2fd6c0"/>
    <circle cx="0" cy="-22" r="12" fill="#e8b78d"/>
    <path d="M-12-24a12 12 0 0 1 24 0c-4-6-8-7-12-7s-8 1-12 7z" fill="#241a18"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-4-14c3 3 5 3 8 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(204 168)">
    <ellipse cx="0" cy="16" rx="16" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-13 14c-2-22 4-30 13-30s15 8 13 30z" fill="#ffc93c"/>
    <circle cx="0" cy="-22" r="12" fill="#f2c39c"/>
    <path d="M-12-22c0-8 5-12 12-12s12 4 12 12c0 4-2 6-4 6 0-6-4-8-8-8s-8 2-8 8c-2 0-4-2-4-6z" fill="#5a3a2a"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-3-15c2 2 4 2 6 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <!-- protective shield emblem -->
  <g transform="translate(150 96) scale(.62)">
    <path d="M0-52 40-36v28c0 22-16 36-40 44-24-8-40-22-40-44v-28z" fill="#ffd166" stroke="#e0a92a" stroke-width="6" opacity=".95"/>
    <path d="m-16-6 12 12 24-26" stroke="#8a6100" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- banner -->
  <g transform="translate(150 18)">
    <rect x="-92" y="-14" width="184" height="28" rx="14" fill="#7b61ff" opacity=".92"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">SAFE SCHOOL, SAFE ME</text>
  </g>
</svg>`;
}

/* ---------------------------------------------------------------- */
/* Completion badge                                                   */
/* ---------------------------------------------------------------- */
export function completionBadge(stars: number): string {
  const on = (i: number): string => (stars >= i ? '#ffd166' : '#e3e9f2');
  const onS = (i: number): string => (stars >= i ? '#e0a92a' : '#cbd5e4');
  return `
<svg viewBox="0 0 200 170" aria-hidden="true">
  <circle cx="100" cy="92" r="62" fill="#e8f7f4"/>
  <path d="M100 40 148 58v34c0 28-20 46-48 56-28-10-48-28-48-56V58z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="6"/>
  <path d="m82 92 14 14 28-32" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g>
    <g transform="translate(36 40)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${on(1)}" stroke="${onS(1)}" stroke-width="3"/></g>
    <g transform="translate(100 18) scale(1.25)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${on(2)}" stroke="${onS(2)}" stroke-width="2.6"/></g>
    <g transform="translate(164 40)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${on(3)}" stroke="${onS(3)}" stroke-width="3"/></g>
  </g>
</svg>`;
}
