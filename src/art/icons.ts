/**
 * Original inline SVG icon set (stroke-based, rounded, friendly).
 * All icons are 24x24 and inherit `currentColor`.
 */

const wrap = (d: string, extra = ''): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}${extra}</svg>`;

export const icons = {
  back: wrap('<path d="M15 5 8 12l7 7"/>'),
  home: wrap('<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),
  play: wrap('<path d="M8 5.5 18 12 8 18.5z" fill="currentColor" stroke-width="2"/>'),
  replay: wrap('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4h4"/>'),
  question: wrap(
    '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.2-2.6 4"/><circle cx="12" cy="17.4" r="1.1" fill="currentColor" stroke="none"/>',
  ),
  gear: wrap(
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.2v2.1M12 18.7v2.1M20.8 12h-2.1M5.3 12H3.2M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5M18.2 18.2l-1.5-1.5M7.3 7.3 5.8 5.8"/>',
  ),
  soundOn: wrap('<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M16 9a4.4 4.4 0 0 1 0 6"/><path d="M18.6 6.4a8 8 0 0 1 0 11.2"/>'),
  soundOff: wrap('<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="m16.5 9.5 5 5M21.5 9.5l-5 5"/>'),
  musicOn: wrap('<path d="M9 18V6.6l10-2v11"/><circle cx="6.6" cy="18" r="2.6"/><circle cx="16.6" cy="15.6" r="2.6"/>'),
  musicOff: wrap(
    '<path d="M9 18V6.6l10-2v3"/><circle cx="6.6" cy="18" r="2.6"/><path d="m15 13 6 6M21 13l-6 6"/>',
  ),
  check: wrap('<circle cx="12" cy="12" r="9"/><path d="m7.8 12.3 2.8 2.9 5.6-6"/>'),
  cross: wrap('<circle cx="12" cy="12" r="9"/><path d="m8.6 8.6 6.8 6.8M15.4 8.6l-6.8 6.8"/>'),
  bulb: wrap(
    '<path d="M9 17h6M10 20.5h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6V17h5.6v-1.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z"/>',
  ),
  tap: wrap(
    '<path d="M9 11.5V6.2a2 2 0 1 1 4 0v7.1l2.2-1a2 2 0 0 1 2.7 2.4l-1.3 4A3.5 3.5 0 0 1 13.3 21H11a4 4 0 0 1-3.4-1.9L5 15a1.9 1.9 0 0 1 3-2.3z"/>',
  ),
  mouse: wrap('<rect x="7.5" y="3" width="9" height="18" rx="4.5"/><path d="M12 7v3.2"/>'),
  drag: wrap('<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>'),
  star: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" fill="currentColor"/></svg>`,
  starEmpty: wrap('<path d="m12 3.4 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.8l6-.9z"/>'),
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5S3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 8.5 3.4c0 5.8-8.5 11.1-8.5 11.1z" fill="currentColor"/></svg>`,
  shield: wrap('<path d="M12 3.2 19 6v6c0 4.6-3 7.6-7 8.8-4-1.2-7-4.2-7-8.8V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),
  arrowLeft: wrap('<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>'),
  arrowRight: wrap('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
  car: wrap(
    '<path d="M4.5 16.5v2a1 1 0 0 0 1 1h1.6a1 1 0 0 0 1-1v-2M15.9 16.5v2a1 1 0 0 0 1 1h1.6a1 1 0 0 0 1-1v-2"/><path d="M3.6 16.5h16.8v-3.2l-1.7-4.6a2 2 0 0 0-1.9-1.3H7.2a2 2 0 0 0-1.9 1.3l-1.7 4.6z"/><path d="M6.4 13.4h11.2"/>',
  ),
  puzzle: wrap(
    '<path d="M10 4h4a1 1 0 0 1 1 1v1.4a1.8 1.8 0 1 0 3.4 1v-.2H20a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.4a1.8 1.8 0 1 0-1 3.4H20v3.4a1 1 0 0 1-1 1h-4"/><path d="M15 20H5a1 1 0 0 1-1-1v-4h1.4A1.8 1.8 0 1 0 6.4 11H4V6a1 1 0 0 1 1-1h5"/>',
  ),
  baby: wrap(
    '<circle cx="12" cy="12" r="9"/><path d="M9 10.5h.01M15 10.5h.01"/><path d="M9.6 15c1.4 1.3 3.4 1.3 4.8 0"/>',
  ),
  eye: wrap('<path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.6"/>'),
  people: wrap(
    '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.4 5.3a3.2 3.2 0 0 1 0 6.1M17.8 20a6 6 0 0 0-2-4.3"/>',
  ),
  flag: wrap('<path d="M6 21V4"/><path d="M6 4.6h11.5l-2.2 4 2.2 4H6"/>'),
  close: wrap('<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>'),
};

export type IconName = keyof typeof icons;

/** Returns icon markup; unknown names fall back to a neutral dot (never crashes). */
export function icon(name: IconName): string {
  return icons[name] ?? wrap('<circle cx="12" cy="12" r="6"/>');
}
