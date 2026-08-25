/**
 * Reusable accessible modal used for How to Play, Settings and Pause.
 * Handles focus trapping, Escape, backdrop click and body scroll locking.
 */
import { el, clear } from '../utils/dom';
import { icon } from '../art/icons';
import { audio } from './audio';

export interface ModalAction {
  label: string;
  variant?: 'mint' | 'coral' | 'sun' | 'grape' | 'ghost' | 'dark';
  onClick?: (close: () => void) => void;
  /** Closes the modal after the click handler runs (default true). */
  closeAfter?: boolean;
}

export interface ModalOptions {
  title: string;
  /** Extra class on the dialog, e.g. 'modal--alert'. */
  className?: string;
  /** Body content — nodes are appended in order. */
  body: (Node | string)[];
  actions?: ModalAction[];
  onClose?: () => void;
}

let openCount = 0;
/** Every dialog currently on screen, so navigation can clean them all up. */
const openDialogs = new Set<() => void>();

/** Closes every open dialog — used when the router swaps scenes. */
export function closeAllModals(): void {
  [...openDialogs].forEach((close) => close());
  openDialogs.clear();
}

export function openModal(opts: ModalOptions): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const closeBtn = el('button', {
    class: 'icon-btn modal__close',
    type: 'button',
    'aria-label': 'Close dialog',
    html: icon('close'),
  });

  const bodyEl = el('div', { class: 'modal__body scroll-y' });
  opts.body.forEach((node) =>
    bodyEl.appendChild(typeof node === 'string' ? el('p', { text: node }) : node),
  );

  const modal = el(
    'div',
    {
      class: `modal${opts.className ? ` ${opts.className}` : ''}`,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': opts.title,
    },
    el(
      'div',
      { class: 'modal__head' },
      el('h2', { text: opts.title }),
      closeBtn,
    ),
    bodyEl,
  );

  if (opts.actions?.length) {
    const foot = el('div', { class: 'modal__foot' });
    opts.actions.forEach((action) => {
      const btn = el('button', {
        class: `btn ${action.variant ? `btn--${action.variant}` : ''}`,
        type: 'button',
        text: action.label,
      });
      btn.addEventListener('click', () => {
        audio.sfx('click');
        action.onClick?.(close);
        if (action.closeAfter !== false) close();
      });
      foot.appendChild(btn);
    });
    modal.appendChild(foot);
  }

  const backdrop = el('div', { class: 'modal-backdrop' }, modal);

  function close(): void {
    openDialogs.delete(close);
    if (!backdrop.isConnected) return;
    document.removeEventListener('keydown', onKey, true);
    backdrop.remove();
    openCount = Math.max(0, openCount - 1);
    if (openCount === 0) {
      document.body.style.removeProperty('overflow');
      // Resume the scene's decorative animations (see .has-modal in ui.css).
      document.body.classList.remove('has-modal');
    }
    opts.onClose?.();
    previouslyFocused?.focus?.();
  }

  function onKey(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      audio.sfx('back');
      close();
      return;
    }
    if (ev.key !== 'Tab') return;
    // simple focus trap
    const focusables = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  closeBtn.addEventListener('click', () => {
    audio.sfx('back');
    close();
  });
  backdrop.addEventListener('pointerdown', (ev) => {
    if (ev.target === backdrop) close();
  });
  document.addEventListener('keydown', onKey, true);

  document.body.appendChild(backdrop);
  openDialogs.add(close);
  openCount++;
  document.body.style.overflow = 'hidden';
  // While a dialog covers the screen the scene underneath is invisible, so its
  // looping CSS animations are pure battery drain on a phone. Pausing them
  // changes nothing visually and costs nothing to undo.
  document.body.classList.add('has-modal');
  window.setTimeout(() => closeBtn.focus(), 40);

  return close;
}

/** Convenience: build a tutorial/info step row with an icon. */
export function stepRow(iconMarkup: string, title: string, text: string): HTMLElement {
  const iconBox = el('div', { class: 'howto-step__icon', 'aria-hidden': 'true' });
  iconBox.innerHTML = iconMarkup;
  const body = el('div', {}, el('h3', { text: title }), el('p', { text }));
  return el('div', { class: 'howto-step' }, iconBox, body);
}

export function clearNode(node: Element): void {
  clear(node);
}
