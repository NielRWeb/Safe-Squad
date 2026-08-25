/**
 * SAFE SQUAD — original cartoon characters, drawn as inline SVG.
 * Nothing here is copied from any existing game or brand.
 *
 *  · Kaya  — the mascot (a friendly guardian sprout)
 *  · Mother & Baby — Game 1
 *  · Top-down car + driver "Miko" — Game 3
 */

/* ------------------------------------------------------------------ */
/* Kaya, the SAFE SQUAD mascot                                         */
/* ------------------------------------------------------------------ */
export function mascotKaya(mood: 'happy' | 'wave' | 'think' = 'happy'): string {
  const mouth =
    mood === 'think'
      ? '<path d="M86 128c6-3 14-3 20 1" stroke="#0d3b36" stroke-width="5" stroke-linecap="round" fill="none"/>'
      : '<path d="M80 124c6 12 28 12 34 0z" fill="#0d3b36"/><path d="M87 133c4 4 12 4 16 0z" fill="#ff8fa0"/>';
  const arm =
    mood === 'wave'
      ? '<g style="transform-origin:52px 150px;animation:arm-wiggle-l 1.2s ease-in-out infinite"><path d="M52 150c-14-6-22-18-20-30" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/></g>'
      : '<path d="M52 150c-13 2-20 10-21 20" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/>';

  return `
<svg viewBox="0 0 200 220" class="kaya" role="img" aria-label="Kaya, the Safe Squad guardian mascot">
  <defs>
    <linearGradient id="kayaBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4ce4cd"/><stop offset="1" stop-color="#12a08f"/>
    </linearGradient>
    <radialGradient id="kayaGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="204" rx="52" ry="10" fill="#06202a" opacity=".22"/>
  <!-- sprout leaf -->
  <path d="M100 40c0-16 12-28 30-30-2 18-13 29-30 32z" fill="#7ce495"/>
  <path d="M100 42c-2-14-12-22-27-24 2 15 11 23 27 26z" fill="#57cf7c"/>
  <path d="M100 44v14" stroke="#2f9e63" stroke-width="6" stroke-linecap="round"/>
  <!-- shield body -->
  <path d="M100 52c22 6 42 9 46 10v58c0 40-24 62-46 72-22-10-46-32-46-72V62c4-1 24-4 46-10z"
        fill="url(#kayaBody)" stroke="#0b7a6d" stroke-width="5" stroke-linejoin="round"/>
  <path d="M100 52c22 6 42 9 46 10v58c0 40-24 62-46 72V52z" fill="#0b7a6d" opacity=".08"/>
  <ellipse cx="100" cy="105" rx="42" ry="42" fill="url(#kayaGlow)"/>
  ${arm}
  <path d="M148 150c13 2 20 10 21 20" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/>
  <!-- face -->
  <g>
    <ellipse cx="80" cy="99" rx="13" ry="14.5" fill="#fff"/>
    <ellipse cx="120" cy="99" rx="13" ry="14.5" fill="#fff"/>
    <circle cx="82" cy="102" r="7" fill="#0d3b36"/>
    <circle cx="122" cy="102" r="7" fill="#0d3b36"/>
    <circle cx="79" cy="98" r="2.6" fill="#fff"/>
    <circle cx="119" cy="98" r="2.6" fill="#fff"/>
    <ellipse cx="62" cy="118" rx="9" ry="6" fill="#ff9a86" opacity=".65"/>
    <ellipse cx="138" cy="118" rx="9" ry="6" fill="#ff9a86" opacity=".65"/>
    ${mouth}
  </g>
  <!-- badge -->
  <circle cx="100" cy="158" r="15" fill="#ffc93c" stroke="#e79f10" stroke-width="4"/>
  <path d="m93 158 5 5 9-10" stroke="#7a5200" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Game 1 — mother cradling her baby                                   */
/* ------------------------------------------------------------------ */
export function motherAndBaby(): string {
  return `
<svg viewBox="0 0 340 440" class="chars mood-0" role="img"
     aria-label="A cartoon mother with long hair holding her baby. The baby's face shows how the round is going.">
  <defs>
    <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a72ff"/><stop offset="1" stop-color="#5b41d8"/>
    </linearGradient>
    <linearGradient id="dressArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9d88ff"/><stop offset="1" stop-color="#6a4fe0"/>
    </linearGradient>
    <linearGradient id="blanket" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe4a1"/><stop offset="1" stop-color="#ffb648"/>
    </linearGradient>
    <linearGradient id="hairG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a352f"/><stop offset="1" stop-color="#2b1e1a"/>
    </linearGradient>
    <clipPath id="babyHeadClip"><circle cx="170" cy="300" r="41"/></clipPath>
    <clipPath id="momHeadClip"><ellipse cx="170" cy="126" rx="48" ry="52"/></clipPath>
  </defs>

  <ellipse cx="170" cy="428" rx="120" ry="13" fill="#06202a" opacity=".22"/>

  <!-- ============ MOTHER ============ -->
  <g class="mother">
    <!-- long hair BEHIND the body: one soft silhouette, no floating strands -->
    <path d="M170 62c-42 0-64 30-64 74 0 26 4 44 4 66 0 34-8 62-14 90 20 8 40 12 60 13
             -10-34-12-70-8-104-6-22-8-42-6-58 4-30 14-46 28-46s24 16 28 46c2 16 0 36-6 58
             4 34 2 70-8 104 20-1 40-5 60-13-6-28-14-56-14-90 0-22 4-40 4-66 0-44-22-74-64-74z"
          fill="url(#hairG)"/>
    <!-- torso: shoulders slightly wider than the head, natural silhouette -->
    <path d="M170 196c-38 0-62 22-72 60-8 30-12 68-12 174h168c0-106-4-144-12-174-10-38-34-60-72-60z"
          fill="url(#dress)"/>
    <path d="M132 214c10 14 22 21 38 21s28-7 38-21" stroke="#4a34b8" stroke-width="6"
          opacity=".35" fill="none" stroke-linecap="round"/>
    <!-- short, natural neck -->
    <path d="M152 166h36v22c0 10-8 16-18 16s-18-6-18-16z" fill="#e8b78d"/>
    <path d="M152 176c10 8 26 8 36 0v-10h-36z" fill="#d8a67c" opacity=".55"/>

    <!-- head -->
    <g class="mother-head">
      <ellipse cx="170" cy="126" rx="48" ry="52" fill="#f7c9a5"/>
      <!-- ears -->
      <ellipse cx="122" cy="130" rx="8" ry="11" fill="#f0b590"/>
      <ellipse cx="218" cy="130" rx="8" ry="11" fill="#f0b590"/>
      <!-- fringe, clipped to the head so it never floats -->
      <g clip-path="url(#momHeadClip)">
        <path d="M118 120c0-40 22-58 52-58s52 18 52 58c-6-20-16-30-26-32-10 12-30 17-48 13-14-3-24 3-30 19z"
              fill="url(#hairG)"/>
      </g>
      <!-- hair volume on both sides of the face -->
      <path d="M124 108c-8 16-9 38-6 58 8-16 10-38 10-52z" fill="#4a352f"/>
      <path d="M216 108c8 16 9 38 6 58-8-16-10-38-10-52z" fill="#4a352f"/>
      <!-- eyes -->
      <ellipse cx="152" cy="130" rx="8.5" ry="9.5" fill="#fff"/>
      <ellipse cx="188" cy="130" rx="8.5" ry="9.5" fill="#fff"/>
      <circle cx="153" cy="132" r="5" fill="#25303f"/>
      <circle cx="189" cy="132" r="5" fill="#25303f"/>
      <circle cx="151" cy="129" r="1.9" fill="#fff"/>
      <circle cx="187" cy="129" r="1.9" fill="#fff"/>
      <rect class="eye-lid" x="142" y="118" width="20" height="13" fill="#f7c9a5"/>
      <rect class="eye-lid" x="178" y="118" width="20" height="13" fill="#f7c9a5"/>
      <!-- lashes -->
      <path d="M143 126c1-3 3-5 6-6M197 126c-1-3-3-5-6-6" stroke="#2b1e1a" stroke-width="2.6"
            stroke-linecap="round" fill="none"/>
      <g class="brow brow-calm">
        <path d="M143 115c5-4 13-4 17-1" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M180 114c5-3 12-3 17 1" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow-worry">
        <path d="M142 118c6-6 13-8 18-4" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M198 118c-6-6-13-8-18-4" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
      </g>
      <ellipse class="blush" cx="138" cy="145" rx="9.5" ry="6" fill="#ff9a86" opacity=".55"/>
      <ellipse class="blush" cx="202" cy="145" rx="9.5" ry="6" fill="#ff9a86" opacity=".55"/>
      <path d="M170 136c3 4 3 7 0 9" stroke="#e0a17a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <!-- mouths -->
      <path class="mouth-happy" d="M159 152c6 8 16 8 22 0" stroke="#b3564a" stroke-width="4.4"
            fill="none" stroke-linecap="round"/>
      <path class="mouth-sad" d="M159 158c6-7 16-7 22 0" stroke="#b3564a" stroke-width="4.4"
            fill="none" stroke-linecap="round"/>
      <ellipse class="mouth-cry" cx="170" cy="155" rx="10" ry="8" fill="#a34a3e"/>
      <!-- hair flower keeps the character clearly feminine -->
      <g transform="translate(214 92)">
        <circle r="6.5" fill="#ff8fa0"/>
        <circle cx="-8.5" cy="-4" r="5.5" fill="#ff6f8a"/><circle cx="8.5" cy="-4" r="5.5" fill="#ff6f8a"/>
        <circle cx="-5.5" cy="6.5" r="5.5" fill="#ff6f8a"/><circle cx="5.5" cy="6.5" r="5.5" fill="#ff6f8a"/>
        <circle r="3" fill="#ffd166"/>
      </g>
      <g class="sweat">
        <path d="M232 86c5 8 8 12 8 15a8 8 0 1 1-16 0c0-3 3-7 8-15z" fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/>
      </g>
    </g>
  </g>

  <!-- ============ BABY (cradled in front) ============ -->
  <g class="baby-body">
    <!-- swaddle -->
    <path d="M170 258c40 0 68 26 68 62 0 34-30 56-68 56s-68-22-68-56c0-36 28-62 68-62z"
          fill="url(#blanket)" stroke="#e9932a" stroke-width="5"/>
    <path d="M112 348c34 16 82 16 116 0" stroke="#e9932a" stroke-width="5" fill="none" opacity=".55"/>
    <path d="M170 320c-14 8-26 10-40 8 10 12 26 18 40 18s30-6 40-18c-14 2-26 0-40-8z"
          fill="#ffcf7a" opacity=".7"/>

    <!-- head -->
    <g>
      <circle cx="170" cy="300" r="41" fill="#fbd8b8"/>
      <ellipse cx="129" cy="303" rx="7" ry="9" fill="#f2c8a4"/>
      <ellipse cx="211" cy="303" rx="7" ry="9" fill="#f2c8a4"/>
      <g clip-path="url(#babyHeadClip)">
        <path d="M129 284c6-24 24-35 41-35s33 11 37 32c-13-11-25-6-38-6s-26-4-40 9z" fill="#c98b52"/>
      </g>
      <path d="M164 259c4-9 13-11 17-5" stroke="#c98b52" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="155" cy="300" rx="8.4" ry="9.4" fill="#fff"/>
      <ellipse cx="186" cy="300" rx="8.4" ry="9.4" fill="#fff"/>
      <circle cx="156" cy="302" r="5.6" fill="#25303f"/>
      <circle cx="187" cy="302" r="5.6" fill="#25303f"/>
      <circle cx="154" cy="299" r="2.1" fill="#fff"/>
      <circle cx="185" cy="299" r="2.1" fill="#fff"/>
      <rect class="eye-lid" x="145" y="288" width="20" height="12" fill="#fbd8b8"/>
      <rect class="eye-lid" x="176" y="288" width="20" height="12" fill="#fbd8b8"/>
      <g class="brow brow-calm">
        <path d="M147 287c4-3 12-3 16-1" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M178 286c4-2 12-2 16 1" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow-worry">
        <path d="M146 290c5-6 12-7 17-3" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M195 290c-5-6-12-7-17-3" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <ellipse class="blush" cx="141" cy="314" rx="9" ry="6.4" fill="#ff9a86" opacity=".75"/>
      <ellipse class="blush" cx="200" cy="314" rx="9" ry="6.4" fill="#ff9a86" opacity=".75"/>
      <path class="mouth-happy" d="M158 320c7 9 20 9 27 0z" fill="#b3564a"/>
      <path class="mouth-sad" d="M159 326c6-7 18-7 24 0" stroke="#b3564a" stroke-width="4.6"
            fill="none" stroke-linecap="round"/>
      <g class="mouth-cry">
        <ellipse cx="171" cy="324" rx="14" ry="12" fill="#b3564a"/>
        <ellipse cx="171" cy="330" rx="7" ry="5" fill="#ff8fa0"/>
      </g>
      <g class="tear"><path d="M145 310c4 6 6 9 6 12a6 6 0 1 1-12 0c0-3 2-6 6-12z"
            fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/></g>
      <g class="tear" style="animation-delay:.4s"><path d="M197 310c4 6 6 9 6 12a6 6 0 1 1-12 0c0-3 2-6 6-12z"
            fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/></g>
    </g>
  </g>

  <!-- mother's forearms cradling the swaddle -->
  <g class="mother-arms">
    <path d="M96 250c-16 44 4 100 62 108" stroke="#6a4fe0" stroke-width="34"
          stroke-linecap="round" fill="none" opacity=".9"/>
    <path d="M244 250c16 44-4 100-62 108" stroke="url(#dressArm)" stroke-width="34"
          stroke-linecap="round" fill="none"/>
    <ellipse cx="160" cy="360" rx="19" ry="15" fill="#f0b590"/>
    <ellipse cx="182" cy="362" rx="19" ry="15" fill="#e8b78d"/>
    <path d="M150 356c8 6 20 7 28 2" stroke="#d89b74" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>

  <!-- baby hands rest on top of the cradling arms: only the hand waddles -->
  <g class="baby-arm-r">
    <path d="M132 330c-16 2-26 9-30 20" stroke="#fbd8b8" stroke-width="17" stroke-linecap="round" fill="none"/>
    <circle cx="100" cy="352" r="11" fill="#fbd8b8"/>
    <path d="M94 350c3 3 8 3 11 0" stroke="#e8b78d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>
  <g class="baby-arm-l">
    <path d="M208 330c16 2 26 9 30 20" stroke="#fbd8b8" stroke-width="17" stroke-linecap="round" fill="none"/>
    <circle cx="240" cy="352" r="11" fill="#fbd8b8"/>
    <path d="M235 350c3 3 8 3 11 0" stroke="#e8b78d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>

  <!-- happy music notes (shown briefly after a correct answer) -->
  <g class="music-note" fill="#ffd166" stroke="#e09b20" stroke-width="2">
    <g transform="translate(272 250)"><circle cx="0" cy="12" r="7"/><rect x="5" y="-16" width="4" height="28"/>
      <path d="M9 -16c8 2 12 6 12 12" fill="none"/></g>
    <g transform="translate(62 262)"><circle cx="0" cy="12" r="6"/><rect x="4" y="-12" width="3.4" height="24"/></g>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Game 3 — top-down car and its driver, "Miko"                        */
/* ------------------------------------------------------------------ */
export function topDownCar(): string {
  return `
<svg viewBox="0 0 120 190" class="car-svg" role="img" aria-label="A cartoon car seen from above with a driver inside">
  <defs>
    <linearGradient id="carPaint" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff8f79"/><stop offset=".5" stop-color="#ff6f61"/>
      <stop offset="1" stop-color="#d9483c"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cdeeff"/><stop offset="1" stop-color="#7fc4e8"/>
    </linearGradient>
  </defs>
  <!-- wheels -->
  <g fill="#232a3a">
    <rect x="4" y="36" width="18" height="34" rx="8"/>
    <rect x="98" y="36" width="18" height="34" rx="8"/>
    <rect x="4" y="120" width="18" height="34" rx="8"/>
    <rect x="98" y="120" width="18" height="34" rx="8"/>
  </g>
  <g class="wheel-tread" fill="#4b5468">
    <rect x="6" y="42" width="14" height="4" rx="2"/><rect x="6" y="54" width="14" height="4" rx="2"/>
    <rect x="100" y="42" width="14" height="4" rx="2"/><rect x="100" y="54" width="14" height="4" rx="2"/>
    <rect x="6" y="126" width="14" height="4" rx="2"/><rect x="6" y="138" width="14" height="4" rx="2"/>
    <rect x="100" y="126" width="14" height="4" rx="2"/><rect x="100" y="138" width="14" height="4" rx="2"/>
  </g>
  <!-- flat tyre overlay (shown when the car breaks down) -->
  <g class="wheel-flat" fill="#2b3242">
    <ellipse cx="13" cy="140" rx="14" ry="9"/>
    <ellipse cx="107" cy="140" rx="14" ry="9"/>
  </g>

  <g class="car-body">
    <!-- chassis -->
    <rect x="12" y="12" width="96" height="166" rx="34" fill="url(#carPaint)" stroke="#a8342a" stroke-width="4"/>
    <!-- bonnet + boot shading -->
    <path d="M20 40c10-16 70-16 80 0" fill="none" stroke="#ffb3a5" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path d="M20 152c10 14 70 14 80 0" fill="none" stroke="#a8342a" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    <!-- windscreen -->
    <path d="M28 56h64l-7 22H35z" fill="url(#glass)" stroke="#6aa9c9" stroke-width="3"/>
    <!-- cabin roof -->
    <rect x="26" y="80" width="68" height="46" rx="16" fill="#ffd0c6" stroke="#a8342a" stroke-width="3"/>
    <!-- driver seen from above -->
    <g class="driver-top">
      <circle cx="60" cy="100" r="17" fill="#f7c9a5"/>
      <path d="M43 98a17 17 0 0 1 34 0z" fill="#3b2b28"/>
      <circle cx="53" cy="104" r="3.2" fill="#25303f"/>
      <circle cx="67" cy="104" r="3.2" fill="#25303f"/>
      <path d="M55 112c3 3 7 3 10 0" stroke="#8a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="34" y="112" width="52" height="14" rx="7" fill="#2fd6c0" opacity=".9"/>
    </g>
    <!-- rear window -->
    <path d="M32 130h56l-6 16H38z" fill="url(#glass)" stroke="#6aa9c9" stroke-width="3"/>
    <!-- headlights -->
    <rect x="22" y="16" width="18" height="10" rx="5" fill="#fff2b8" stroke="#e0b430" stroke-width="2.5"/>
    <rect x="80" y="16" width="18" height="10" rx="5" fill="#fff2b8" stroke="#e0b430" stroke-width="2.5"/>
    <rect x="22" y="166" width="18" height="8" rx="4" fill="#ff4f5e" stroke="#a8342a" stroke-width="2"/>
    <rect x="80" y="166" width="18" height="8" rx="4" fill="#ff4f5e" stroke="#a8342a" stroke-width="2"/>
  </g>

  <!-- breakdown smoke -->
  <g class="smoke" fill="#e6eef6" opacity=".9">
    <circle cx="34" cy="18" r="11"/>
    <circle cx="52" cy="8" r="8" opacity=".8"/>
    <circle cx="70" cy="16" r="6" opacity=".7"/>
  </g>
</svg>`;
}

/** Driver Miko, standing next to the broken car and looking stressed. */
export function driverCharacter(): string {
  return `
<svg viewBox="0 0 100 120" class="driver-svg" role="img" aria-label="The driver stands beside the car looking worried">
  <ellipse cx="50" cy="112" rx="26" ry="6" fill="#06202a" opacity=".25"/>
  <g class="driver-body">
    <!-- legs -->
    <rect x="38" y="78" width="10" height="30" rx="5" fill="#2a3a5c"/>
    <rect x="52" y="78" width="10" height="30" rx="5" fill="#2a3a5c"/>
    <!-- torso -->
    <rect x="30" y="42" width="40" height="42" rx="16" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3"/>
    <!-- arms -->
    <g class="driver-arm-l"><path d="M68 52c10-4 16 2 16 12" stroke="#f7c9a5" stroke-width="11" stroke-linecap="round" fill="none"/></g>
    <g class="driver-arm-r"><path d="M32 52c-10-4-16 2-16 12" stroke="#f7c9a5" stroke-width="11" stroke-linecap="round" fill="none"/></g>
    <!-- head -->
    <circle cx="50" cy="30" r="20" fill="#f7c9a5"/>
    <path d="M30 27a20 20 0 0 1 40 0c-6-7-14-9-20-9s-14 2-20 9z" fill="#3b2b28"/>
    <ellipse cx="42" cy="31" rx="4.6" ry="5.4" fill="#fff"/>
    <ellipse cx="58" cy="31" rx="4.6" ry="5.4" fill="#fff"/>
    <circle cx="42" cy="32" r="2.8" fill="#25303f"/>
    <circle cx="58" cy="32" r="2.8" fill="#25303f"/>
    <path d="M35 22c4 1 8 3 10 6" stroke="#3b2b28" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M65 22c-4 1-8 3-10 6" stroke="#3b2b28" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="50" cy="42" rx="7" ry="5.5" fill="#8a4a3a"/>
    <path d="M74 14c5 7 8 11 8 14a8 8 0 1 1-16 0c0-3 3-7 8-14z" fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/>
  </g>
</svg>`;
}

/** Cartoon road sign used at the fork (YES = left, NO = right). */
export function roadSign(kind: 'yes' | 'no'): string {
  const yes = kind === 'yes';
  return `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <g filter="none">
    <rect x="6" y="6" width="108" height="76" rx="18"
          fill="${yes ? '#29b96b' : '#ef4b5e'}" stroke="${yes ? '#158a4c' : '#c22a3c'}" stroke-width="6"/>
    <rect x="54" y="76" width="12" height="40" rx="5" fill="#8d6b4b" stroke="#6b4f36" stroke-width="4"/>
    <text x="60" y="56" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="34" font-weight="900" fill="#ffffff">${yes ? 'YES' : 'NO'}</text>
    <path d="${yes ? 'M34 24h-14l-10 10 10 10h14' : 'M86 24h14l10 10-10 10H86'}"
          fill="none" stroke="#ffffff" stroke-width="0"/>
  </g>
</svg>`;
}
