/**
 * Tiny DOM helpers — keeps game code readable without a framework.
 */

type Props = Record<string, unknown>;

/** Create an element with attributes/props and children. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  applyProps(node, props);
  appendAll(node, children);
  return node;
}

function applyProps(node: HTMLElement, props: Props): void {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'html') node.innerHTML = String(value);
    else if (key === 'text') node.textContent = String(value);
    else if (key === 'style' && typeof value === 'object') {
      Object.assign(node.style, value as Partial<CSSStyleDeclaration>);
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(node.dataset, value as Record<string, string>);
    } else {
      node.setAttribute(key, String(value));
    }
  }
}

export function appendAll(
  parent: Node,
  children: (Node | string | null | undefined | false)[],
): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    parent.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
}

/** Build a DOM node from an SVG (or HTML) markup string. */
export function fromHTML<T extends Element = HTMLElement>(markup: string): T {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  const node = tpl.content.firstElementChild;
  if (!node) throw new Error('fromHTML: markup produced no element');
  return node as unknown as T;
}

/** Wrap raw SVG markup in a container div (handy for backgrounds). */
export function svgBox(markup: string, className = ''): HTMLDivElement {
  const box = document.createElement('div');
  if (className) box.className = className;
  box.innerHTML = markup;
  box.setAttribute('aria-hidden', 'true');
  return box;
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function on<K extends keyof HTMLElementEventMap>(
  target: EventTarget,
  type: K | string,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(type, handler as EventListener, options);
  return () => target.removeEventListener(type, handler as EventListener, options);
}

/** Promise-based delay that can be cancelled by an AbortSignal-like flag. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** requestAnimationFrame loop helper. Returns a stop() function. */
export function loop(step: (dt: number, t: number) => void): () => void {
  let raf = 0;
  let last = performance.now();
  let running = true;
  const tick = (now: number) => {
    if (!running) return;
    // Clamp dt so a backgrounded tab doesn't teleport the game world.
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    try {
      step(dt, now);
    } catch (err) {
      console.warn('[loop] step error', err);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    running = false;
    cancelAnimationFrame(raf);
  };
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}


/**
 * Scene-scoped timers.
 *
 * Every game creates one pool and uses `pool.after(...)` instead of
 * `window.setTimeout(...)`. When the scene is destroyed (Return to Hub, Retry,
 * Play again) the pool is cleared, so a pending callback from the OLD round can
 * never fire on top of a freshly started game — this is what used to make a
 * stale retry/failure alert reappear.
 */
export class TimerPool {
  private ids = new Set<number>();
  private disposed = false;

  /** Same signature as window.setTimeout, but scene-scoped. */
  after(fn: () => void, ms: number): number {
    if (this.disposed) return 0;
    const id = window.setTimeout(() => {
      this.ids.delete(id);
      if (!this.disposed) fn();
    }, ms);
    this.ids.add(id);
    return id;
  }

  /** Cancels every pending timer and blocks new ones. */
  clear(): void {
    this.disposed = true;
    this.ids.forEach((id) => window.clearTimeout(id));
    this.ids.clear();
  }
}

/**
 * Backing-store scale for a full-screen game canvas.
 *
 * Rasterising a big canvas is the single most expensive thing these games do
 * on a phone: at devicePixelRatio 2 a 390x844 screen is 1.3 million pixels
 * repainted every frame, which is what dragged Fact or Fall and Save the
 * Princess under 30 fps on a mid-range handset.
 *
 * Touch devices therefore cap the backing store at 1.5x. Their physical pixel
 * density is high enough that flat cartoon artwork stays sharp, and it cuts
 * the pixels pushed per frame by ~44%. Mouse/desktop displays are untouched
 * and still render at up to 2x.
 */
export function canvasDpr(): number {
  const raw = window.devicePixelRatio || 1;
  const coarse =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  return Math.max(1, Math.min(raw, coarse ? 1.5 : 2));
}
