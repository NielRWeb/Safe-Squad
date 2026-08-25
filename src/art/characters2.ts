/**
 * SAFE SQUAD — original cartoon characters for games 4-7.
 * Same art direction as characters.ts: flat shapes, thick friendly outlines,
 * expressive faces, rounded silhouettes. Nothing here is copied from any
 * existing game or brand.
 *
 *  · Bantay  — the SAFE SQUAD hero (Save Your Hearts)
 *  · Grumble — the cartoon rival (Save Your Hearts)
 *  · Bingo box + star tiles (Bingo Game)
 */

/* ------------------------------------------------------------------ */
/* Game 4 — the hero: "Bantay" (Filipino for guardian/watcher)         */
/* ------------------------------------------------------------------ */
export function heroFighter(): string {
  return `
<svg viewBox="0 0 200 260" class="fighter fighter--hero" role="img" aria-label="Bantay, the Safe Squad hero">
  <defs>
    <linearGradient id="heroSuit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3fe0c8"/><stop offset="1" stop-color="#12a08f"/>
    </linearGradient>
  </defs>
  <ellipse class="shadow" cx="100" cy="248" rx="56" ry="10" fill="#06202a" opacity=".25"/>
  <g class="fighter__body">
    <!-- legs -->
    <rect x="74" y="188" width="20" height="54" rx="10" fill="#2a3a5c"/>
    <rect x="106" y="188" width="20" height="54" rx="10" fill="#2a3a5c"/>
    <rect x="68" y="232" width="32" height="14" rx="7" fill="#1c2740"/>
    <rect x="100" y="232" width="32" height="14" rx="7" fill="#1c2740"/>
    <!-- torso -->
    <path d="M66 126c0-20 15-32 34-32s34 12 34 32v50c0 12-15 18-34 18s-34-6-34-18z"
          fill="url(#heroSuit)" stroke="#0b7a6d" stroke-width="5"/>
    <path d="M100 100 118 108v18c0 12-8 18-18 22-10-4-18-10-18-22v-18z" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
    <!-- arms -->
    <g class="fighter__arm-back">
      <path d="M70 138c-16 4-24 18-22 34" stroke="#f7c9a5" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
    <g class="fighter__arm-front">
      <path d="M130 138c16 4 24 18 22 34" stroke="#f7c9a5" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
    <!-- head -->
    <g class="fighter__head">
      <circle cx="100" cy="66" r="38" fill="#f7c9a5"/>
      <path d="M62 62a38 38 0 0 1 76 0c-8-14-20-20-38-20s-30 6-38 20z" fill="#2f2320"/>
      <path d="M62 62c-4-26 14-44 38-44s42 18 38 44c-4-8-10-12-14-12-8 8-40 10-48 2-6 0-12 4-14 10z" fill="#3b2b28"/>
      <!-- eyes -->
      <ellipse class="eye" cx="86" cy="66" rx="9" ry="10" fill="#fff"/>
      <ellipse class="eye" cx="114" cy="66" rx="9" ry="10" fill="#fff"/>
      <circle class="pupil" cx="87" cy="68" r="5.4" fill="#25303f"/>
      <circle class="pupil" cx="115" cy="68" r="5.4" fill="#25303f"/>
      <circle cx="85" cy="65" r="2" fill="#fff"/>
      <circle cx="113" cy="65" r="2" fill="#fff"/>
      <ellipse class="blush" cx="74" cy="80" rx="8" ry="5.5" fill="#ff9a86" opacity=".7"/>
      <ellipse class="blush" cx="126" cy="80" rx="8" ry="5.5" fill="#ff9a86" opacity=".7"/>
      <!-- expressions -->
      <path class="mouth mouth--happy" d="M90 84c6 7 14 7 20 0" stroke="#8a4a3a" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path class="mouth mouth--determined" d="M88 86h24" stroke="#8a4a3a" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      <ellipse class="mouth mouth--hurt" cx="100" cy="88" rx="10" ry="8" fill="#8a4a3a"/>
      <g class="brow brow--calm">
        <path d="M78 52c5-4 12-4 16-1" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M106 51c4-3 11-3 16 1" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow--hurt">
        <path d="M78 48c5 1 12 5 16 9" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M122 48c-5 1-12 5-16 9" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
    </g>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Game 4 — the rival: "Grumble", a grumpy but harmless cartoon blob   */
/* ------------------------------------------------------------------ */
export function rivalFighter(): string {
  return `
<svg viewBox="0 0 200 260" class="fighter fighter--rival" role="img" aria-label="Grumble, the cartoon rival">
  <defs>
    <linearGradient id="rivalBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9b7dff"/><stop offset="1" stop-color="#5b41d8"/>
    </linearGradient>
  </defs>
  <ellipse class="shadow" cx="100" cy="248" rx="60" ry="11" fill="#06202a" opacity=".25"/>
  <g class="fighter__body">
    <!-- feet -->
    <ellipse cx="74" cy="236" rx="22" ry="12" fill="#4a34b8"/>
    <ellipse cx="126" cy="236" rx="22" ry="12" fill="#4a34b8"/>
    <!-- body blob -->
    <path d="M100 62c40 0 62 34 62 84 0 52-28 84-62 84s-62-32-62-84c0-50 22-84 62-84z"
          fill="url(#rivalBody)" stroke="#3f2ba3" stroke-width="5"/>
    <!-- horns -->
    <path d="M62 74c-10-14-8-30 2-38 6 12 12 20 18 24z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="4"/>
    <path d="M138 74c10-14 8-30-2-38-6 12-12 20-18 24z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="4"/>
    <!-- arms -->
    <g class="fighter__arm-back">
      <path d="M44 150c-14 8-18 22-14 36" stroke="#7b61ff" stroke-width="18" stroke-linecap="round" fill="none"/>
    </g>
    <g class="fighter__arm-front">
      <path d="M156 150c14 8 18 22 14 36" stroke="#7b61ff" stroke-width="18" stroke-linecap="round" fill="none"/>
    </g>
    <!-- belly -->
    <ellipse cx="100" cy="176" rx="34" ry="40" fill="#c9b3ff" opacity=".5"/>
    <!-- face -->
    <g class="fighter__head">
      <ellipse class="eye" cx="82" cy="112" rx="15" ry="17" fill="#fff"/>
      <ellipse class="eye" cx="120" cy="112" rx="15" ry="17" fill="#fff"/>
      <circle class="pupil" cx="84" cy="115" r="8" fill="#25303f"/>
      <circle class="pupil" cx="122" cy="115" r="8" fill="#25303f"/>
      <circle cx="81" cy="111" r="3" fill="#fff"/>
      <circle cx="119" cy="111" r="3" fill="#fff"/>
      <g class="brow brow--calm">
        <path d="M68 92c6-5 16-5 22-1" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M110 91c6-4 16-4 22 1" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow--hurt">
        <path d="M68 86c6 2 16 7 22 12" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M132 86c-6 2-16 7-22 12" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
      </g>
      <path class="mouth mouth--happy" d="M84 142c8 10 24 10 32 0z" fill="#2b1c66"/>
      <path class="mouth mouth--determined" d="M84 144h32" stroke="#2b1c66" stroke-width="6" stroke-linecap="round" fill="none"/>
      <ellipse class="mouth mouth--hurt" cx="100" cy="146" rx="16" ry="13" fill="#2b1c66"/>
      <path d="M88 138l6 6M112 138l-6 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;
}

/** Cartoon energy burst thrown between the two fighters. */
export function energyBurst(kind: 'hero' | 'rival'): string {
  const c1 = kind === 'hero' ? '#5ef0d8' : '#c9b3ff';
  const c2 = kind === 'hero' ? '#12a08f' : '#5b41d8';
  return `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <circle cx="60" cy="60" r="34" fill="${c1}" opacity=".9"/>
  <circle cx="60" cy="60" r="22" fill="#fff" opacity=".85"/>
  <path d="M60 4l10 26 26-10-10 26 26 10-26 10 10 26-26-10-10 26-10-26-26 10 10-26L4 60l26-10-10-26 26 10z"
        fill="${c2}" opacity=".55"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Game 7 — Bingo box tiles                                            */
/* ------------------------------------------------------------------ */
export function bingoBoxClosed(): string {
  return `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <linearGradient id="boxFace" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5fd8ff"/><stop offset="1" stop-color="#2f9ae0"/>
    </linearGradient>
  </defs>
  <rect x="6" y="10" width="88" height="84" rx="16" fill="#1d5f96"/>
  <rect x="6" y="6" width="88" height="80" rx="16" fill="url(#boxFace)" stroke="#1d5f96" stroke-width="4"/>
  <path d="M6 40h88" stroke="#1d5f96" stroke-width="5" opacity=".5"/>
  <path d="M50 6v80" stroke="#1d5f96" stroke-width="5" opacity=".35"/>
  <circle cx="50" cy="40" r="12" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
  <path d="M45 40h10M50 35v10" stroke="#8a6100" stroke-width="4" stroke-linecap="round"/>
</svg>`;
}

export function bingoStar(collected: boolean): string {
  const fill = collected ? '#ffd166' : '#ffe9a8';
  const stroke = collected ? '#e0a92a' : '#d7b45c';
  return `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="50" r="40" fill="${collected ? '#fff4d2' : '#ffffff'}" opacity=".85"/>
  <path d="m50 14 11 23 25 4-18 18 4 25-22-12-22 12 4-25-18-18 25-4z" fill="${fill}" stroke="${stroke}" stroke-width="5"
        stroke-linejoin="round"/>
  ${collected ? '<path d="m38 52 9 9 18-20" stroke="#0b7a6d" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
</svg>`;
}

export function bingoEmpty(): string {
  return `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="52" r="34" fill="#e8eef6" opacity=".7"/>
  <path d="M32 44c4-6 10-6 14 0M54 44c4-6 10-6 14 0" stroke="#8fa2bb" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M38 70c7-7 17-7 24 0" stroke="#8fa2bb" stroke-width="5" stroke-linecap="round" fill="none"/>
</svg>`;
}
