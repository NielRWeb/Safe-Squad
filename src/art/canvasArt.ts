/**
 * SAFE SQUAD — canvas drawing helpers for the two action games
 * (Choose & Escape, Save the Princess). Kept in /art so all artwork lives in
 * one place, exactly like the SVG scene/character modules.
 *
 * Every routine draws in the same flat cartoon style: rounded shapes, thick
 * outlines, big eyes, no realistic detail.
 */

export type Ctx = CanvasRenderingContext2D;

export function roundRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function eyes(ctx: Ctx, x: number, y: number, r: number, look: number, dark = '#25303f'): void {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.34, y, r * 0.24, r * 0.28, 0, 0, Math.PI * 2);
  ctx.ellipse(x + r * 0.34, y, r * 0.24, r * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(x - r * 0.34 + look * r * 0.08, y + r * 0.04, r * 0.13, 0, Math.PI * 2);
  ctx.arc(x + r * 0.34 + look * r * 0.08, y + r * 0.04, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

/* ------------------------------------------------------------------ */
/* Choose & Escape                                                     */
/* ------------------------------------------------------------------ */

/** The player: a round, cheerful cartoon runner with a little scarf. */
export function drawRunner(ctx: Ctx, x: number, y: number, r: number, t: number, dir: number): void {
  const bob = Math.sin(t * 9) * r * 0.08;
  ctx.save();
  ctx.translate(x, y + bob);
  // shadow
  ctx.fillStyle = 'rgba(6,32,42,.28)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.95 - bob, r * 0.8, r * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  // scarf
  ctx.fillStyle = '#ff6f61';
  ctx.beginPath();
  ctx.ellipse(-dir * r * 0.7, r * 0.1, r * 0.5, r * 0.22, Math.sin(t * 9) * 0.3, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = '#e0a92a';
  ctx.lineWidth = Math.max(2, r * 0.14);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // cap
  ctx.fillStyle = '#12a08f';
  ctx.beginPath();
  ctx.arc(0, -r * 0.25, r * 0.92, Math.PI * 1.08, Math.PI * 1.92);
  ctx.fill();
  eyes(ctx, 0, r * 0.05, r, dir, '#4a3405');
  // smile
  ctx.strokeStyle = '#8a6100';
  ctx.lineWidth = Math.max(1.6, r * 0.1);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, r * 0.22, r * 0.34, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/** The chaser: a wobbling cartoon shadow-blob (spooky but harmless). */
export function drawChaser(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  t: number,
  body = '#ff6f61',
  edge = '#c9483c',
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(6,32,42,.28)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.95, r * 0.8, r * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();

  const wob = Math.sin(t * 6) * r * 0.08;
  ctx.fillStyle = body;
  ctx.strokeStyle = edge;
  ctx.lineWidth = Math.max(2, r * 0.14);
  ctx.beginPath();
  ctx.moveTo(-r, r * 0.7);
  ctx.quadraticCurveTo(-r - wob, -r * 1.1, 0, -r * 1.05);
  ctx.quadraticCurveTo(r + wob, -r * 1.1, r, r * 0.7);
  // wavy skirt
  for (let i = 0; i < 4; i++) {
    const sx = r - (i * 2 * r) / 4;
    ctx.quadraticCurveTo(sx - r * 0.25, r * (i % 2 ? 0.45 : 0.95), sx - r * 0.5, r * 0.7);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  eyes(ctx, 0, -r * 0.2, r * 1.05, 0);
  // frown
  ctx.strokeStyle = edge;
  ctx.lineWidth = Math.max(1.6, r * 0.1);
  ctx.beginPath();
  ctx.arc(0, r * 0.42, r * 0.3, 1.2 * Math.PI, 1.8 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/** YES / NO escape gate. */
export function drawGate(ctx: Ctx, x: number, y: number, s: number, kind: 'yes' | 'no'): void {
  const yes = kind === 'yes';
  ctx.save();
  ctx.translate(x, y);
  // glowing arch
  ctx.fillStyle = yes ? 'rgba(41,185,107,.28)' : 'rgba(239,75,94,.28)';
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = yes ? '#29b96b' : '#ef4b5e';
  ctx.strokeStyle = yes ? '#158a4c' : '#c22a3c';
  ctx.lineWidth = Math.max(2, s * 0.14);
  roundRect(ctx, -s * 0.72, -s * 0.6, s * 1.44, s * 1.05, s * 0.28);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${Math.round(s * 0.62)}px ui-rounded, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(yes ? 'YES' : 'NO', 0, -s * 0.05);
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Save the Princess                                                   */
/* ------------------------------------------------------------------ */

export interface HeroState {
  facing: number;
  running: boolean;
  grounded: boolean;
  t: number;
  invincible?: boolean;
}

/** Side-view cartoon hero (same character family as the hub mascot). */
export function drawPlatformHero(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  s: HeroState,
): void {
  const step = s.running && s.grounded ? Math.sin(s.t * 14) : 0;
  ctx.save();
  ctx.translate(x + w / 2, y + h);
  if (s.invincible && Math.floor(s.t * 12) % 2 === 0) ctx.globalAlpha = 0.45;
  ctx.scale(s.facing >= 0 ? 1 : -1, 1);

  // shadow
  ctx.fillStyle = 'rgba(6,32,42,.25)';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.5, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  ctx.fillStyle = '#2a3a5c';
  const legH = h * 0.26;
  roundRect(ctx, -w * 0.3 + step * w * 0.16, -legH, w * 0.24, legH, w * 0.12);
  ctx.fill();
  roundRect(ctx, w * 0.06 - step * w * 0.16, -legH, w * 0.24, legH, w * 0.12);
  ctx.fill();

  // body
  ctx.fillStyle = '#2fd6c0';
  ctx.strokeStyle = '#0b7a6d';
  ctx.lineWidth = Math.max(2, w * 0.07);
  roundRect(ctx, -w * 0.34, -h * 0.66, w * 0.68, h * 0.42, w * 0.22);
  ctx.fill();
  ctx.stroke();

  // badge
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(0, -h * 0.45, w * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // arm
  ctx.strokeStyle = '#f7c9a5';
  ctx.lineWidth = w * 0.16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.18, -h * 0.58);
  ctx.lineTo(w * 0.34 + (s.grounded ? step * w * 0.1 : w * 0.12), -h * 0.4 - (s.grounded ? 0 : h * 0.1));
  ctx.stroke();

  // head
  const hy = -h * 0.78;
  ctx.fillStyle = '#f7c9a5';
  ctx.beginPath();
  ctx.arc(0, hy, w * 0.34, 0, Math.PI * 2);
  ctx.fill();
  // hair
  ctx.fillStyle = '#2f2320';
  ctx.beginPath();
  ctx.arc(0, hy - w * 0.04, w * 0.34, Math.PI * 1.05, Math.PI * 2.05);
  ctx.fill();
  // face
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(w * 0.12, hy + w * 0.03, w * 0.09, w * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#25303f';
  ctx.beginPath();
  ctx.arc(w * 0.14, hy + w * 0.04, w * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8a4a3a';
  ctx.lineWidth = Math.max(1.5, w * 0.05);
  ctx.beginPath();
  ctx.arc(w * 0.1, hy + w * 0.18, w * 0.1, 0.1 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/** A harmless patrolling critter. */
export function drawCritter(ctx: Ctx, x: number, y: number, w: number, h: number, t: number): void {
  const squash = 1 + Math.sin(t * 8) * 0.06;
  ctx.save();
  ctx.translate(x + w / 2, y + h);
  ctx.fillStyle = 'rgba(6,32,42,.22)';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.46, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.scale(1, squash);
  ctx.fillStyle = '#ff9a86';
  ctx.strokeStyle = '#c9483c';
  ctx.lineWidth = Math.max(2, w * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.45, w * 0.46, h * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // feet
  ctx.fillStyle = '#c9483c';
  ctx.beginPath();
  ctx.ellipse(-w * 0.22, -h * 0.02, w * 0.16, h * 0.1, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.22, -h * 0.02, w * 0.16, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  eyes(ctx, 0, -h * 0.55, w * 0.9, 0);
  ctx.restore();
}

/** The princess waiting at the end of the level. */
export function drawPrincess(ctx: Ctx, x: number, y: number, h: number, t: number): void {
  const bob = Math.sin(t * 2.2) * h * 0.03;
  ctx.save();
  ctx.translate(x, y + bob);
  const w = h * 0.62;
  // dress
  ctx.fillStyle = '#ff8fb1';
  ctx.strokeStyle = '#d3527c';
  ctx.lineWidth = Math.max(2, h * 0.035);
  ctx.beginPath();
  ctx.moveTo(-w * 0.16, -h * 0.5);
  ctx.lineTo(w * 0.16, -h * 0.5);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.06, w * 0.42, 0);
  ctx.lineTo(-w * 0.42, 0);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.06, -w * 0.16, -h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // head
  ctx.fillStyle = '#f7c9a5';
  ctx.beginPath();
  ctx.arc(0, -h * 0.62, h * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // hair
  ctx.fillStyle = '#7a4a2a';
  ctx.beginPath();
  ctx.arc(0, -h * 0.65, h * 0.17, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-h * 0.16, -h * 0.5, h * 0.06, h * 0.16, 0, 0, Math.PI * 2);
  ctx.ellipse(h * 0.16, -h * 0.5, h * 0.06, h * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  // crown
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(-h * 0.12, -h * 0.74);
  ctx.lineTo(-h * 0.08, -h * 0.86);
  ctx.lineTo(-h * 0.02, -h * 0.76);
  ctx.lineTo(h * 0.03, -h * 0.88);
  ctx.lineTo(h * 0.08, -h * 0.76);
  ctx.lineTo(h * 0.12, -h * 0.86);
  ctx.lineTo(h * 0.14, -h * 0.74);
  ctx.closePath();
  ctx.fill();
  eyes(ctx, 0, -h * 0.62, h * 0.34, 0);
  ctx.strokeStyle = '#b3564a';
  ctx.lineWidth = Math.max(1.4, h * 0.022);
  ctx.beginPath();
  ctx.arc(0, -h * 0.56, h * 0.05, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/** Question block: '?' while active, star once answered. */
export function drawQuestionBlock(
  ctx: Ctx,
  x: number,
  y: number,
  s: number,
  used: boolean,
  t: number,
): void {
  const bob = used ? 0 : Math.sin(t * 3) * s * 0.05;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = used ? '#c9803c' : '#ffd166';
  ctx.strokeStyle = used ? '#8a5a22' : '#e0a92a';
  ctx.lineWidth = Math.max(2, s * 0.08);
  roundRect(ctx, 0, 0, s, s, s * 0.18);
  ctx.fill();
  ctx.stroke();
  // rivets
  ctx.fillStyle = used ? '#8a5a22' : '#e0a92a';
  [0.18, 0.82].forEach((fx) =>
    [0.18, 0.82].forEach((fy) => {
      ctx.beginPath();
      ctx.arc(s * fx, s * fy, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }),
  );
  if (used) {
    ctx.fillStyle = '#ffd166';
    star(ctx, s / 2, s / 2, s * 0.3, s * 0.14);
    ctx.fill();
  } else {
    ctx.fillStyle = '#8a6100';
    ctx.font = `900 ${Math.round(s * 0.62)}px ui-rounded, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', s / 2, s * 0.56);
  }
  ctx.restore();
}

export function star(ctx: Ctx, cx: number, cy: number, r1: number, r2: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** Checkpoint flag — grey when passive, teal once reached. */
export function drawFlag(ctx: Ctx, x: number, y: number, h: number, active: boolean, t: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#8d6b4b';
  ctx.lineWidth = Math.max(2, h * 0.08);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -h);
  ctx.stroke();
  const wave = active ? Math.sin(t * 5) * h * 0.06 : 0;
  ctx.fillStyle = active ? '#2fd6c0' : '#b9c4d4';
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.quadraticCurveTo(h * 0.32, -h + wave, h * 0.6, -h * 0.82);
  ctx.quadraticCurveTo(h * 0.32, -h * 0.72 + wave, 0, -h * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** The castle gate that opens once every question block is answered. */
export function drawGateDoor(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  open: boolean,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#e6ecf5';
  ctx.strokeStyle = '#b7c3d6';
  ctx.lineWidth = 4;
  roundRect(ctx, 0, -h, w, h, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#7b61ff';
  ctx.beginPath();
  ctx.moveTo(-8, -h);
  ctx.lineTo(w / 2, -h - h * 0.28);
  ctx.lineTo(w + 8, -h);
  ctx.closePath();
  ctx.fill();
  // doorway
  ctx.fillStyle = open ? '#2b1c66' : '#8d6b4b';
  const dw = w * 0.44;
  const dh = h * 0.6;
  ctx.beginPath();
  ctx.moveTo(w / 2 - dw / 2, 0);
  ctx.lineTo(w / 2 - dw / 2, -dh + dw / 2);
  ctx.arc(w / 2, -dh + dw / 2, dw / 2, Math.PI, 0);
  ctx.lineTo(w / 2 + dw / 2, 0);
  ctx.closePath();
  ctx.fill();
  if (!open) {
    ctx.strokeStyle = '#6b4f36';
    ctx.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 - dw / 2, -dh * (i / 4));
      ctx.lineTo(w / 2 + dw / 2, -dh * (i / 4));
      ctx.stroke();
    }
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(w / 2 + dw * 0.3, -dh * 0.35, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
