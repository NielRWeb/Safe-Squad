/**
 * SAFE SQUAD — HUB COVER ART
 * -----------------------------------------------------------------------------
 * One cover per mini-game, all built from the same recipe so the hub reads as a
 * single collection:
 *
 *   · 16:9 stage with a game-specific sky/floor gradient
 *   · soft top-left key light + bottom vignette (same lighting everywhere)
 *   · a faint SAFE SQUAD shield watermark pattern
 *   · one clear hero motif that shows the gameplay at a glance
 *   · flat shapes, thick friendly outlines, the shared brand palette
 *
 * Everything is inline SVG (no image downloads, scales perfectly on any screen).
 */

const W = 320;
const H = 180;

/** Shared lighting, watermark and framing used by every cover. */
function stage(id: string, sky: [string, string], body: string, floor?: string): string {
  return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="${id}Sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/>
    </linearGradient>
    <radialGradient id="${id}Key" cx="22%" cy="10%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}Vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050d1c" stop-opacity="0"/>
      <stop offset="1" stop-color="#050d1c" stop-opacity=".34"/>
    </linearGradient>
    <pattern id="${id}Mark" width="54" height="54" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
      <path d="M27 12 40 17v11c0 9-6 14-13 17-7-3-13-8-13-17V17z" fill="#ffffff" opacity=".05"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}Sky)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}Mark)"/>
  ${floor ?? ''}
  <rect width="${W}" height="${H}" fill="url(#${id}Key)"/>
  ${body}
  <rect width="${W}" height="${H}" fill="url(#${id}Vig)"/>
</svg>`;
}

/** Soft contact shadow used under every character so nothing floats. */
const shadow = (cx: number, cy: number, rx: number, ry = rx * 0.26): string =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#06202a" opacity=".22"/>`;

/* ================================================================== */
/* 1 · DON'T MAKE THE BABY CRY                                        */
/* ================================================================== */
export function coverBabyCry(): string {
  const body = `
  <!-- nursery props -->
  <g opacity=".55">
    <rect x="18" y="30" width="52" height="46" rx="8" fill="#fff3e2" stroke="#e2a86f" stroke-width="4"/>
    <rect x="26" y="38" width="36" height="30" rx="4" fill="#bfe9ff"/>
    <circle cx="54" cy="46" r="6" fill="#ffe08a"/>
    <path d="M26 60c8-6 16-2 22 2s12 4 14 2v4H26z" fill="#8fe0ad"/>
  </g>
  <g opacity=".5">
    <path d="M262 20v18" stroke="#c98b52" stroke-width="4"/>
    <path d="M240 38h44" stroke="#c98b52" stroke-width="4" stroke-linecap="round"/>
    <circle cx="244" cy="50" r="8" fill="#ffd166"/>
    <path d="M262 38v10" stroke="#c98b52" stroke-width="3"/><path d="M254 58a8 8 0 0 1 16 0z" fill="#63c6ff"/>
    <path d="M280 38v8" stroke="#c98b52" stroke-width="3"/><path d="M280 48l7 12h-14z" fill="#ff9a86"/>
  </g>

  ${shadow(160, 168, 62, 12)}

  <!-- mother (bust, correct proportions: head ≈ 1/4 of the visible figure) -->
  <g transform="translate(160 24)">
    <!-- long hair behind -->
    <path d="M0 6c-26 0-38 18-38 44 0 22 3 40-3 62 14 6 27 9 41 10 14-1 27-4 41-10-6-22-3-40-3-62C38 24 26 6 0 6z"
          fill="#3b2b28"/>
    <!-- body -->
    <path d="M0 74c-26 0-40 16-46 44-2 10-3 20-3 34h98c0-14-1-24-3-34-6-28-20-44-46-44z" fill="#7b61ff"/>
    <path d="M-20 84c6 8 12 12 20 12s14-4 20-12" stroke="#4a34b8" stroke-width="4" fill="none" opacity=".4"/>
    <!-- neck: short and natural -->
    <path d="M-9 60h18v12c0 6-4 9-9 9s-9-3-9-9z" fill="#e8b78d"/>
    <!-- head -->
    <ellipse cx="0" cy="36" rx="26" ry="28" fill="#f7c9a5"/>
    <path d="M-26 32c0-22 12-30 26-30s26 8 26 30c-3-11-9-16-14-17-5 6-16 9-25 7-7-2-11 2-13 10z" fill="#3b2b28"/>
    <ellipse cx="-9" cy="38" rx="4.4" ry="5" fill="#fff"/><ellipse cx="9" cy="38" rx="4.4" ry="5" fill="#fff"/>
    <circle cx="-8.4" cy="39" r="2.6" fill="#25303f"/><circle cx="9.6" cy="39" r="2.6" fill="#25303f"/>
    <ellipse cx="-17" cy="45" rx="5" ry="3" fill="#ff9a86" opacity=".55"/>
    <ellipse cx="17" cy="45" rx="5" ry="3" fill="#ff9a86" opacity=".55"/>
    <path d="M-6 48c4 5 8 5 12 0" stroke="#b3564a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g transform="translate(22 12)"><circle r="4" fill="#ff8fa0"/><circle cx="-5" cy="-2.5" r="3.4" fill="#ff6f8a"/>
      <circle cx="5" cy="-2.5" r="3.4" fill="#ff6f8a"/><circle cx="-3.4" cy="4" r="3.4" fill="#ff6f8a"/>
      <circle cx="3.4" cy="4" r="3.4" fill="#ff6f8a"/><circle r="1.8" fill="#ffd166"/></g>
  </g>

  <!-- baby cradled in front -->
  <g transform="translate(160 122)">
    <path d="M0-24c22 0 37 14 37 33 0 18-16 29-37 29s-37-11-37-29c0-19 15-33 37-33z"
          fill="#ffd97a" stroke="#e9932a" stroke-width="3"/>
    <circle cx="0" cy="-4" r="22" fill="#fbd8b8"/>
    <path d="M-22-10c3-13 13-19 22-19s18 6 20 17c-7-6-13-3-20-3s-14-2-22 5z" fill="#c98b52"/>
    <ellipse cx="-8" cy="-4" rx="4.4" ry="5" fill="#fff"/><ellipse cx="8" cy="-4" rx="4.4" ry="5" fill="#fff"/>
    <circle cx="-7.4" cy="-3" r="2.8" fill="#25303f"/><circle cx="8.6" cy="-3" r="2.8" fill="#25303f"/>
    <ellipse cx="-15" cy="3" rx="5" ry="3.4" fill="#ff9a86" opacity=".8"/>
    <ellipse cx="15" cy="3" rx="5" ry="3.4" fill="#ff9a86" opacity=".8"/>
    <path d="M-6 4c4 5 9 5 13 0z" fill="#b3564a"/>
  </g>
  <!-- mother's arms in front of the bundle -->
  <path d="M120 118c-8 20 4 36 32 40" stroke="#6a4fe0" stroke-width="15" stroke-linecap="round" fill="none"/>
  <path d="M200 118c8 20-4 36-32 40" stroke="#7b61ff" stroke-width="15" stroke-linecap="round" fill="none"/>
  <ellipse cx="152" cy="150" rx="11" ry="8" fill="#f0b590"/>
  <ellipse cx="168" cy="151" rx="11" ry="8" fill="#e8b78d"/>

  <!-- YES / NO chips: the gameplay at a glance -->
  <g transform="translate(44 138)">
    <rect x="-28" y="-14" width="56" height="28" rx="14" fill="#29b96b" stroke="#158a4c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">YES</text>
  </g>
  <g transform="translate(278 138)">
    <rect x="-26" y="-14" width="52" height="28" rx="14" fill="#ef4b5e" stroke="#c22a3c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">NO</text>
  </g>`;
  return stage('cb', ['#ffe9d2', '#ffbf94'], body,
    `<path d="M0 132h320v48H0z" fill="#d79a63"/><ellipse cx="160" cy="150" rx="150" ry="30" fill="#ffd7c9" opacity=".85"/>`);
}

/* ================================================================== */
/* 2 · ATTACH THE MISSING PUZZLE                                      */
/* ================================================================== */
export function coverPuzzle(): string {
  const tile = (x: number, y: number, w: number, h: number, fill: string): string =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}"/>`;
  const body = `
  <!-- classroom hint -->
  <g opacity=".35">
    <rect x="16" y="18" width="66" height="48" rx="8" fill="#f7fbff"/>
    <path d="M24 56l14-16 10 10 8-8 12 14z" fill="#7ed99b"/><circle cx="66" cy="30" r="6" fill="#ffd166"/>
  </g>

  <!-- board with holes -->
  <g transform="translate(160 92)">
    <rect x="-104" y="-56" width="208" height="112" rx="16" fill="#0e2a4b" opacity=".45"/>
    <rect x="-104" y="-56" width="208" height="112" rx="16" fill="none" stroke="#ffffff"
          stroke-width="3" stroke-dasharray="9 8" opacity=".8"/>
    ${tile(-98, -50, 64, 50, '#ffd166')}
    ${tile(-30, -50, 64, 50, '#7ed99b')}
    ${tile(-98, 4, 64, 46, '#ff9a86')}
    ${tile(38, 4, 60, 46, '#63c6ff')}
    <!-- empty hole -->
    <rect x="38" y="-50" width="60" height="50" rx="7" fill="#08213c" opacity=".55"/>
    <text x="68" y="-18" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="20" font-weight="900" fill="#9fc3e8" opacity=".8">?</text>
  </g>

  <!-- the piece being dragged in -->
  <g transform="translate(238 44) rotate(-12)">
    ${shadow(0, 34, 30, 8)}
    <rect x="-30" y="-24" width="60" height="48" rx="9" fill="#ffe08a" stroke="#e0a92a" stroke-width="4"/>
    <circle cx="0" cy="-4" r="12" fill="#fff"/><path d="M-8 8c5 7 11 7 16 0z" fill="#e0a92a"/>
  </g>
  <!-- hand cursor -->
  <g transform="translate(252 92)">
    <path d="M0-16v16M0 0c-6 0-10 4-10 10 0 10 6 18 16 18h8c8 0 12-6 12-14v-12c0-4-6-4-6 0v6
             c0-6-6-6-6 0v-4c0-6-6-6-6 0v-4c0-6-8-6-8 0z" fill="#fff" stroke="#25303f" stroke-width="3"
          stroke-linejoin="round"/>
  </g>

  <!-- drag arrow -->
  <path d="M214 66c-14 6-22 14-26 22" stroke="#ffffff" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-dasharray="7 8" opacity=".85"/>`;
  return stage('cp', ['#1b3f6b', '#3f9bbd'], body,
    `<path d="M0 148h320v32H0z" fill="#c9803c"/><rect y="140" width="320" height="12" rx="6" fill="#f3cf9e"/>`);
}

/* ================================================================== */
/* 3 · FACT OR FALL                                                   */
/* ================================================================== */
export function coverFactFall(): string {
  const body = `
  <!-- Y road with aligned markings -->
  <g>
    <path d="M138 180v-52l-46-44V0" fill="none" stroke="#eef2f7" stroke-width="56" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M182 180v-52l46-44V0" fill="none" stroke="#eef2f7" stroke-width="56" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M138 180v-52l-46-44V0" fill="none" stroke="#59637a" stroke-width="46" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M182 180v-52l46-44V0" fill="none" stroke="#59637a" stroke-width="46" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="160" cy="126" r="32" fill="#59637a"/>
    <path d="M160 180v-54" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9"/>
    <path d="M150 116 108 76V6" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9" fill="none"/>
    <path d="M170 116l42-40V6" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9" fill="none"/>
    <g stroke="#ffffff" stroke-width="3" opacity=".55" stroke-linecap="round" fill="none">
      <path d="M150 140l-14-14"/><path d="M136 126h9"/><path d="M136 126v9"/>
      <path d="M170 140l14-14"/><path d="M184 126h-9"/><path d="M184 126v9"/>
    </g>
  </g>

  <!-- signs -->
  <g transform="translate(58 56)">
    <rect x="-26" y="-16" width="52" height="32" rx="9" fill="#29b96b" stroke="#158a4c" stroke-width="4"/>
    <text x="0" y="7" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">YES</text>
    <rect x="-4" y="16" width="8" height="18" rx="4" fill="#8d6b4b"/>
  </g>
  <g transform="translate(262 56)">
    <rect x="-24" y="-16" width="48" height="32" rx="9" fill="#ef4b5e" stroke="#c22a3c" stroke-width="4"/>
    <text x="0" y="7" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">NO</text>
    <rect x="-4" y="16" width="8" height="18" rx="4" fill="#8d6b4b"/>
  </g>

  <!-- top-down car -->
  <g transform="translate(160 142) scale(.94)">
    ${shadow(0, 26, 24, 7)}
    <g fill="#232a3a">
      <rect x="-27" y="-22" width="10" height="18" rx="5"/><rect x="17" y="-22" width="10" height="18" rx="5"/>
      <rect x="-27" y="6" width="10" height="18" rx="5"/><rect x="17" y="6" width="10" height="18" rx="5"/>
    </g>
    <rect x="-22" y="-28" width="44" height="56" rx="16" fill="#ff6f61" stroke="#a8342a" stroke-width="3"/>
    <path d="M-14-14h28l-3 9h-22z" fill="#cdeeff" stroke="#6aa9c9" stroke-width="2"/>
    <rect x="-13" y="-4" width="26" height="17" rx="7" fill="#ffd0c6" stroke="#a8342a" stroke-width="2"/>
    <circle cx="0" cy="4" r="6.5" fill="#f7c9a5"/><path d="M-6.5 3a6.5 6.5 0 0 1 13 0z" fill="#3b2b28"/>
    <circle cx="-2.5" cy="5" r="1.3" fill="#25303f"/><circle cx="2.5" cy="5" r="1.3" fill="#25303f"/>
    <path d="M-13 15h26l-2 7h-22z" fill="#cdeeff" stroke="#6aa9c9" stroke-width="2"/>
    <rect x="-18" y="-27" width="9" height="5" rx="2.5" fill="#fff2b8"/>
    <rect x="9" y="-27" width="9" height="5" rx="2.5" fill="#fff2b8"/>
  </g>

  <!-- roadside trees, clearly on the grass -->
  <g transform="translate(28 120)">${shadow(2, 22, 16, 5)}<rect x="-4" y="-2" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-12" r="18" fill="#2f9c5e"/><circle cx="-12" cy="-2" r="12" fill="#3fae6a"/>
    <circle cx="12" cy="-2" r="12" fill="#3fae6a"/><circle cx="-3" cy="-22" r="10" fill="#57c47e"/></g>
  <g transform="translate(292 132) scale(.85)">${shadow(2, 22, 16, 5)}<rect x="-4" y="-2" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-12" r="18" fill="#2f9c5e"/><circle cx="-12" cy="-2" r="12" fill="#3fae6a"/>
    <circle cx="12" cy="-2" r="12" fill="#3fae6a"/></g>`;
  return stage('cd', ['#7fd8a1', '#4bb877'], body);
}

/* ================================================================== */
/* 4 · SAVE YOUR HEARTS                                               */
/* ================================================================== */
export function coverHearts(): string {
  const heart = (x: number, y: number, on: boolean, s = 1): string =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 8C-8 2-13-3-13-8a5.6 5.6 0 0 1 13-2.6A5.6 5.6 0 0 1 13-8c0 5-5 10-13 16z"
      fill="${on ? '#ff4f6d' : '#6d7893'}" stroke="${on ? '#c22a3c' : '#525c74'}" stroke-width="2.4"/></g>`;
  const body = `
  <!-- arena banners + crowd -->
  <g opacity=".7">
    ${[36, 96, 224, 284].map((x, i) => `<g transform="translate(${x} 0)">
      <rect x="-11" y="-4" width="22" height="42" rx="5" fill="${['#2fd6c0', '#ffd166', '#ff6f61', '#63c6ff'][i]}"/>
      <path d="M-11 38h22l-11 10z" fill="#0e1a33" opacity=".25"/></g>`).join('')}
  </g>
  <g opacity=".45" fill="#1a2a55">
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${16 + i * 27}" cy="62" r="9"/>`).join('')}
    <rect y="70" width="320" height="12" fill="#152449"/>
  </g>

  <!-- hero -->
  <g transform="translate(86 150)">
    ${shadow(0, 8, 28, 7)}
    <rect x="-14" y="-26" width="11" height="28" rx="5.5" fill="#2a3a5c"/>
    <rect x="3" y="-26" width="11" height="28" rx="5.5" fill="#2a3a5c"/>
    <path d="M-22-62c0-14 10-22 22-22s22 8 22 22v30c0 8-10 12-22 12s-22-4-22-12z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3.4"/>
    <path d="M0-78l14 6v11c0 8-6 12-14 15-8-3-14-7-14-15v-11z" fill="#ffd166" stroke="#e0a92a" stroke-width="2.6"/>
    <circle cx="0" cy="-96" r="21" fill="#f7c9a5"/>
    <path d="M-21-98a21 21 0 0 1 42 0c-6-9-13-12-21-12s-15 3-21 12z" fill="#2f2320"/>
    <ellipse cx="-8" cy="-96" rx="5" ry="5.6" fill="#fff"/><ellipse cx="8" cy="-96" rx="5" ry="5.6" fill="#fff"/>
    <circle cx="-7" cy="-95" r="3" fill="#25303f"/><circle cx="9" cy="-95" r="3" fill="#25303f"/>
    <path d="M-6-86h12" stroke="#8a4a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M20-56c9 3 13 10 12 19" stroke="#f7c9a5" stroke-width="9" stroke-linecap="round" fill="none"/>
  </g>
  <g>${heart(64, 168, true, 0.92)}${heart(88, 168, true, 0.92)}${heart(112, 168, true, 0.92)}</g>

  <!-- demon -->
  <g transform="translate(238 150)">
    ${shadow(0, 8, 32, 8)}
    <ellipse cx="-14" cy="0" rx="13" ry="7" fill="#4a34b8"/><ellipse cx="14" cy="0" rx="13" ry="7" fill="#4a34b8"/>
    <path d="M0-96c25 0 39 22 39 53 0 32-17 48-39 48s-39-16-39-48c0-31 14-53 39-53z" fill="#7b61ff" stroke="#3f2ba3" stroke-width="3.4"/>
    <path d="M-25-84c-7-9-6-20 1-25 4 8 9 14 14 17z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="2.6"/>
    <path d="M25-84c7-9 6-20-1-25-4 8-9 14-14 17z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="2.6"/>
    <ellipse cx="0" cy="-26" rx="21" ry="24" fill="#c9b3ff" opacity=".45"/>
    <ellipse cx="-12" cy="-62" rx="10" ry="11" fill="#fff"/><ellipse cx="12" cy="-62" rx="10" ry="11" fill="#fff"/>
    <circle cx="-11" cy="-60" r="5.4" fill="#25303f"/><circle cx="13" cy="-60" r="5.4" fill="#25303f"/>
    <path d="M-20-78c6-4 13-4 17-1M20-78c-6-4-13-4-17-1" stroke="#3f2ba3" stroke-width="3.4" stroke-linecap="round" fill="none"/>
    <path d="M-12-40h24" stroke="#2b1c66" stroke-width="4.4" stroke-linecap="round"/>
  </g>
  <g>${heart(214, 168, true, 0.92)}${heart(238, 168, true, 0.92)}${heart(262, 168, false, 0.92)}</g>

  <!-- energy burst mid-flight -->
  <g transform="translate(163 104)">
    <circle r="19" fill="#5ef0d8" opacity=".92"/><circle r="10" fill="#fff" opacity=".95"/>
    <path d="M0-30l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#12a08f" opacity=".5"/>
  </g>
  <path d="M120 108c10-6 20-8 28-6" stroke="#5ef0d8" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="6 7" fill="none" opacity=".8"/>`;
  return stage('ch', ['#22265e', '#5b41d8'], body,
    `<path d="M20 96h280l40 84H-20z" fill="#ffb648"/><path d="M46 108h228l30 72H16z" fill="#ffd08a" opacity=".65"/>`);
}

/* ================================================================== */
/* 5 · CHOOSE & ESCAPE                                                */
/* ================================================================== */
export function coverMaze(): string {
  const hedge = (x: number, y: number, w: number, h: number): string =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#2f9c5e"/>
     <circle cx="${x + 8}" cy="${y + 8}" r="3.4" fill="#57c47e"/>`;
  const ghost = (x: number, y: number, body: string, edge: string, s = 1): string =>
    `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-11 9c0-14 4-22 11-22s11 8 11 22c-4-3-5 2-7.5 2S0 8-3 10s-4-4-8 -1z" fill="${body}" stroke="${edge}" stroke-width="2.6"/>
      <circle cx="-4" cy="-4" r="3.6" fill="#fff"/><circle cx="4" cy="-4" r="3.6" fill="#fff"/>
      <circle cx="-3.2" cy="-3.4" r="1.8" fill="#25303f"/><circle cx="4.8" cy="-3.4" r="1.8" fill="#25303f"/>
    </g>`;
  const body = `
  <rect x="18" y="16" width="284" height="148" rx="14" fill="#f3e6c8"/>
  <g>
    ${hedge(18, 16, 284, 14)}${hedge(18, 150, 284, 14)}
    ${hedge(18, 16, 14, 148)}${hedge(288, 16, 14, 148)}
    ${hedge(96, 44, 14, 62)}${hedge(40, 88, 62, 14)}
    ${hedge(146, 32, 14, 46)}${hedge(96, 118, 84, 14)}
    ${hedge(196, 46, 14, 74)}${hedge(210, 46, 56, 14)}
    ${hedge(232, 96, 34, 14)}${hedge(96, 74, 46, 14)}
  </g>
  <!-- gates -->
  <g transform="translate(60 58)">
    <circle r="22" fill="#29b96b" opacity=".25"/>
    <rect x="-22" y="-13" width="44" height="26" rx="9" fill="#29b96b" stroke="#158a4c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="13" font-weight="900" fill="#fff">YES</text>
  </g>
  <g transform="translate(262 58)">
    <circle r="22" fill="#ef4b5e" opacity=".25"/>
    <rect x="-20" y="-13" width="40" height="26" rx="9" fill="#ef4b5e" stroke="#c22a3c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="13" font-weight="900" fill="#fff">NO</text>
  </g>
  <!-- runner -->
  <g transform="translate(160 140)">
    ${shadow(0, 14, 15, 5)}
    <circle r="15" fill="#ffd166" stroke="#e0a92a" stroke-width="3"/>
    <path d="M-15-4a15 15 0 0 1 30 0z" fill="#12a08f"/>
    <circle cx="-5" cy="2" r="3" fill="#4a3405"/><circle cx="5" cy="2" r="3" fill="#4a3405"/>
    <path d="M-5 8c3 3 7 3 10 0" stroke="#8a6100" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="-16" cy="4" rx="8" ry="4" fill="#ff6f61" transform="rotate(-14)"/>
  </g>
  <!-- three chasers -->
  ${ghost(112, 96, '#ff6f61', '#c9483c', 1.05)}
  ${ghost(214, 128, '#c084ff', '#7b3fd0', 1.05)}
  ${ghost(232, 108, '#63c6ff', '#2f7fbd', 1.05)}`;
  return stage('cm', ['#123a5c', '#1f7a56'], body);
}

/* ================================================================== */
/* 6 · SAVE THE PRINCESS                                              */
/* ================================================================== */
export function coverPrincess(): string {
  const body = `
  <!-- sky furniture -->
  <g fill="#fff" opacity=".95">
    <ellipse cx="58" cy="40" rx="21" ry="11"/><ellipse cx="75" cy="44" rx="15" ry="8"/><ellipse cx="43" cy="44" rx="13" ry="7"/>
    <ellipse cx="196" cy="26" rx="16" ry="8"/><ellipse cx="209" cy="29" rx="11" ry="6"/>
  </g>
  <circle cx="290" cy="28" r="16" fill="#ffe08a"/>
  <g opacity=".5" fill="#7ed99b">
    <ellipse cx="60" cy="128" rx="90" ry="34"/><ellipse cx="250" cy="126" rx="110" ry="36"/>
  </g>

  <!-- castle on the right: the goal of the adventure -->
  <g transform="translate(242 132)">
    ${shadow(0, 6, 52, 8)}
    <rect x="-46" y="-58" width="20" height="58" rx="4" fill="#dfe7f2" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M-49-58h26l-13-16z" fill="#5b41d8"/>
    <rect x="26" y="-58" width="20" height="58" rx="4" fill="#dfe7f2" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M23-58h26l-13-16z" fill="#5b41d8"/>
    <rect x="-28" y="-48" width="56" height="48" rx="5" fill="#eef3fa" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M-32-48h64l-32-20z" fill="#7b61ff"/>
    <path d="M0-68v-12h14l-4 5 4 5z" fill="#ffd166"/>
    <rect x="-9" y="-22" width="18" height="22" rx="9" fill="#2b1c66"/>
    <rect x="-38" y="-44" width="10" height="12" rx="3" fill="#63c6ff"/>
    <rect x="28" y="-44" width="10" height="12" rx="3" fill="#63c6ff"/>
  </g>

  <!-- princess: the SAME height as the hero, waving beside the gate -->
  <g transform="translate(288 132)">
    ${shadow(0, 2, 15, 4)}
    <path d="M-13 0c-1-19 5-27 13-27s14 8 13 27z" fill="#ff8fb1" stroke="#d3527c" stroke-width="2.6"/>
    <path d="M-9-27c2-5 5-7 9-7s7 2 9 7z" fill="#ffa7c4"/>
    <path d="M9-30c7-3 11 0 12 6" stroke="#f7c9a5" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-38" r="11" fill="#f7c9a5"/>
    <path d="M-11-40a11 11 0 0 1 22 0c-3-6-6-8-11-8s-8 2-11 8z" fill="#7a4a2a"/>
    <path d="M-12-33c-3 8-3 14-1 19 3-6 3-12 1-19zM12-33c3 8 3 14 1 19-3-6-3-12-1-19z" fill="#7a4a2a"/>
    <path d="M-9-47l3-8 3 6 3-8 3 8 3-6 3 8z" fill="#ffd166"/>
    <circle cx="-4" cy="-38" r="1.9" fill="#25303f"/><circle cx="4" cy="-38" r="1.9" fill="#25303f"/>
    <ellipse cx="-8" cy="-34" rx="3" ry="2" fill="#ff9a86" opacity=".7"/>
    <ellipse cx="8" cy="-34" rx="3" ry="2" fill="#ff9a86" opacity=".7"/>
    <path d="M-3-32c2 2 4 2 6 0" stroke="#b3564a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>

  <!-- platform staircase leading to the castle -->
  <g>
    <rect x="14" y="126" width="78" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="14" y="122" width="78" height="9" rx="4.5" fill="#57c47e"/>
    <rect x="108" y="98" width="70" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="108" y="94" width="70" height="9" rx="4.5" fill="#57c47e"/>
    <rect x="186" y="120" width="52" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="186" y="116" width="52" height="9" rx="4.5" fill="#57c47e"/>
  </g>

  <!-- ? block above the middle platform -->
  <g transform="translate(143 58)">
    <rect x="-17" y="-17" width="34" height="34" rx="8" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
    ${[[-11, -11], [11, -11], [-11, 11], [11, 11]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#e0a92a"/>`)
      .join('')}
    <text x="0" y="8" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="22" font-weight="900" fill="#8a6100">?</text>
  </g>
  <g transform="translate(143 90)" opacity=".85">
    <path d="M0-8v10" stroke="#ffd166" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 5"/>
  </g>

  <!-- hero mid-jump, same scale as the princess -->
  <g transform="translate(96 104)">
    ${shadow(4, 26, 15, 5)}
    <rect x="-11" y="4" width="8" height="15" rx="4" fill="#2a3a5c" transform="rotate(-14)"/>
    <rect x="4" y="4" width="8" height="15" rx="4" fill="#2a3a5c" transform="rotate(12)"/>
    <path d="M-14-9c0-9 6-14 14-14s14 5 14 14v10c0 6-6 9-14 9s-14-3-14-9z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3"/>
    <circle cx="0" cy="-9" r="5" fill="#ffd166"/>
    <path d="M13-16c7-4 12-1 13 6" stroke="#f7c9a5" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M-13-16c-6-2-9 1-10 6" stroke="#f7c9a5" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-33" r="13" fill="#f7c9a5"/>
    <path d="M-13-35a13 13 0 0 1 26 0c-4-6-8-8-13-8s-9 2-13 8z" fill="#2f2320"/>
    <ellipse cx="4" cy="-33" rx="3.6" ry="4.2" fill="#fff"/><circle cx="5" cy="-32" r="2.2" fill="#25303f"/>
    <ellipse cx="-6" cy="-33" rx="3.4" ry="4" fill="#fff"/><circle cx="-5" cy="-32" r="2" fill="#25303f"/>
    <path d="M-2-25c3 3 6 3 8 0" stroke="#8a4a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>
  <!-- motion arc under the jump -->
  <path d="M46 138c10-20 24-30 38-32" stroke="#ffffff" stroke-width="3.4" fill="none"
        stroke-linecap="round" stroke-dasharray="5 7" opacity=".55"/>

  <!-- critter patrolling the first platform -->
  <g transform="translate(206 114)">
    ${shadow(0, 6, 12, 4)}
    <ellipse cx="0" cy="-3" rx="12" ry="10" fill="#ff9a86" stroke="#c9483c" stroke-width="2.6"/>
    <circle cx="-4" cy="-5" r="3.2" fill="#fff"/><circle cx="4" cy="-5" r="3.2" fill="#fff"/>
    <circle cx="-3.4" cy="-4.4" r="1.6" fill="#25303f"/><circle cx="4.6" cy="-4.4" r="1.6" fill="#25303f"/>
  </g>`;
  return stage('cz', ['#5bc0ff', '#cdf1ff'], body,
    `<path d="M0 150h320v30H0z" fill="#8d6b4b"/><rect y="144" width="320" height="12" rx="6" fill="#57c47e"/>`);
}

/* ================================================================== */
/* 7 · BINGO                                                          */
/* ================================================================== */
export function coverBingo(): string {
  const cells: string[] = [];
  const size = 24;
  const gap = 5;
  const startX = 160 - (size * 5 + gap * 4) / 2;
  const startY = 46;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const x = startX + c * (size + gap);
      const y = startY + r * (size + gap);
      const onDiag = r === c;
      const opened = onDiag && r < 3;
      cells.push(
        opened
          ? `<g><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="7" fill="#fff4d2" stroke="#e0a92a" stroke-width="3"/>
             <path d="m${x + size / 2} ${y + 5} 2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.2 6-.8z" fill="#ffd166" stroke="#e0a92a" stroke-width="1.4"/></g>`
          : `<g><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="7" fill="#5fd8ff" stroke="#1d5f96" stroke-width="3"/>
             <path d="M${x} ${y + size / 2}h${size}" stroke="#1d5f96" stroke-width="2" opacity=".45"/>
             <circle cx="${x + size / 2}" cy="${y + size / 2}" r="4.4" fill="#ffd166" stroke="#e0a92a" stroke-width="1.6"/></g>`,
      );
      if (onDiag) {
        cells.push(
          `<rect x="${x - 3}" y="${y - 3}" width="${size + 6}" height="${size + 6}" rx="9" fill="none"
             stroke="#ffd166" stroke-width="3" stroke-dasharray="6 5" opacity=".95"/>`,
        );
      }
    }
  }
  const body = `
  <g opacity=".16" fill="#fff">
    ${Array.from({ length: 10 }, (_, i) => {
      const a1 = (i / 10) * Math.PI * 2;
      const a2 = a1 + 0.2;
      return `<path d="M160 96 L${160 + Math.cos(a1) * 300} ${96 + Math.sin(a1) * 300} L${
        160 + Math.cos(a2) * 300
      } ${96 + Math.sin(a2) * 300}z"/>`;
    }).join('')}
  </g>
  ${[24, 60, 260, 296].map((x) => `<circle cx="${x}" cy="16" r="6.5" fill="#ffe08a" opacity=".9"/>`).join('')}
  <!-- stage curtains -->
  <path d="M0 0h44c-8 62-4 118 4 180H0z" fill="#ff8a72"/>
  <path d="M320 0h-44c8 62 4 118-4 180h48z" fill="#ff8a72"/>
  ${cells.join('')}
  <!-- star popping out of a freshly opened box -->
  <g transform="translate(238 138)">
    <circle r="21" fill="#ffd166" opacity=".28"/>
    <path d="m0-18 5.4 11 12 1.7-8.8 8.4 2.2 12L0 9.6-10.8 15l2.2-12-8.8-8.4 12-1.7z" fill="#ffd166" stroke="#e0a92a" stroke-width="3"/>
  </g>
  <g transform="translate(74 140)">
    <rect x="-20" y="-18" width="40" height="36" rx="9" fill="#5fd8ff" stroke="#1d5f96" stroke-width="3"/>
    <path d="M-20-2h40" stroke="#1d5f96" stroke-width="2.4" opacity=".5"/>
    <circle cx="0" cy="-2" r="6" fill="#ffd166" stroke="#e0a92a" stroke-width="2"/>
  </g>`;
  return stage('cbg', ['#2a1b6b', '#7b4fd0'], body,
    `<path d="M0 156h320v24H0z" fill="#241a52"/>`);
}
