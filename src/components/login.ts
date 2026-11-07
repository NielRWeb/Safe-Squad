/**
 * SAFE SQUAD — src/components/login.ts
 * =============================================================================
 * THE LOGIN SCREEN — the first thing anybody sees now.
 *
 * TWO DOORS IN ONE CARD
 *   · Student      → LRN only. No password. This is what the school asked for:
 *                    young students on shared classroom devices cannot be
 *                    expected to manage passwords. (See the security note at the
 *                    top of core/session.ts — an LRN identifies, it does not
 *                    strongly authenticate.)
 *   · Teacher/Admin → username + password, checked against a scrypt hash on the
 *                    server. This is the door that can see every student.
 *
 * PRACTICE MODE
 * If the API cannot be reached (server off, or the site opened as a static build
 * with no backend) the seven games still have to work, so a third button appears
 * and offers practice mode: full gameplay, scores kept on the device only, and a
 * permanent label saying nothing is being saved. It never appears when the server
 * is working.
 *
 * WHAT THIS SCREEN NEVER DOES
 *   · it never lists, searches or guesses student records — the only thing it can
 *     do is ask the server about ONE LRN that was typed in;
 *   · it never stores a password (the admin password is sent once, over the
 *     request, and is not kept in a variable, in localStorage or in the DOM);
 *   · it never shows a different message for "no such user" and "wrong password"
 *     — the server deliberately answers the same thing for both.
 *
 * Built with the same helpers as every other screen (el, svgBox, existing
 * artwork) so it looks and behaves like part of the game hub.
 * =============================================================================
 */
import { el, svgBox, on } from '../utils/dom';
import { icon } from '../art/icons';
import { hubBackground } from '../art/scenes';
import { mascotKaya } from '../art/characters';
import { audio } from '../core/audio';
import { ApiError, api } from '../services/api';
import {
  isServerReachable,
  loginAdmin,
  loginWithLrn,
  startPractice,
  takeEndedMessage,
} from '../core/session';
import type { Nav, Scene } from '../core/router';

/** What we currently believe about the server, in plain words. */
type ServerState = 'checking' | 'ready' | 'no-database' | 'unreachable';

/** A Philippine LRN is exactly 12 digits. */
const LRN_LENGTH = 12;

export function createLoginScene(nav: Nav): Scene {
  audio.music('hub');

  let disposed = false;
  let busy = false;
  let serverState: ServerState = isServerReachable() ? 'checking' : 'unreachable';

  const root = el('section', { class: 'auth', 'aria-label': 'SAFE SQUAD login' });
  root.appendChild(svgBox(hubBackground(), 'auth__sky'));

  /* ---------------- messages ---------------- */
  // One region for anything the app needs to tell the user (aria-live so screen
  // readers say it without the student having to find it).
  const notice = el('div', { class: 'auth__notice', role: 'status', 'aria-live': 'polite', hidden: 'true' });
  const errorBox = el('div', { class: 'auth__error', role: 'alert', 'aria-live': 'assertive', hidden: 'true' });

  function showNotice(text: string, kind: 'info' | 'warn' = 'info'): void {
    notice.textContent = text;
    notice.className = `auth__notice auth__notice--${kind}`;
    notice.hidden = false;
  }
  function hideNotice(): void {
    notice.hidden = true;
    notice.textContent = '';
  }
  function showError(text: string): void {
    errorBox.textContent = text;
    errorBox.hidden = false;
  }
  function hideError(): void {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  /** Explain the server situation, and offer practice mode when it is down. */
  function renderServerState(): void {
    practiceRow.hidden = serverState === 'ready' || serverState === 'checking';
    if (serverState === 'checking') {
      hideNotice();
    } else if (serverState === 'unreachable') {
      showNotice(
        'The SAFE SQUAD server cannot be reached, so scores cannot be saved to your school record. You can still play in practice mode.',
        'warn',
      );
    } else if (serverState === 'no-database') {
      showNotice(
        'The server is running but its MySQL database is not connected yet, so logins and scores cannot be saved. Ask the person in charge to run: npm run db:setup',
        'warn',
      );
    } else {
      hideNotice();
    }
  }

  /* ---------------- the two forms ---------------- */

  /**
   * A labelled text field. Using a real <label for=…> means the field can be
   * reached by tapping its words, and screen readers announce it properly.
   */
  function field(
    id: string,
    labelText: string,
    hint: string,
    attrs: Record<string, string>,
  ): { row: HTMLElement; input: HTMLInputElement; hintEl: HTMLElement } {
    const input = el('input', {
      class: 'field__input',
      id,
      type: 'text',
      placeholder: ' ',
      ...attrs,
    }) as HTMLInputElement;
    const hintEl = el('span', { class: 'field__hint', id: `${id}-hint`, text: hint });
    const row = el(
      'div',
      { class: 'field' },
      el('label', { class: 'field__label', for: id, text: labelText }),
      input,
      hintEl,
    );
    return { row, input, hintEl };
  }

  /* ---- student: LRN only ---- */
  const lrn = field('lrn', 'Your LRN', '12 digits — no password needed', {
    inputmode: 'numeric',
    autocomplete: 'username',
    maxlength: String(LRN_LENGTH),
    'aria-describedby': 'lrn-hint',
  });

  // Keep the box digits-only while typing and show progress towards 12.
  const offLrnInput = on(lrn.input, 'input', () => {
    const digits = lrn.input.value.replace(/\D/g, '').slice(0, LRN_LENGTH);
    if (digits !== lrn.input.value) lrn.input.value = digits;
    lrn.hintEl.textContent =
      digits.length === LRN_LENGTH
        ? 'That looks like a complete LRN.'
        : `${digits.length} of ${LRN_LENGTH} digits`;
    hideError();
  });

  const studentSubmit = el('button', {
    class: 'btn btn--mint btn--block btn--lg',
    type: 'submit',
    html: `${icon('shield')}<span>Enter SAFE SQUAD</span>`,
  }) as HTMLButtonElement;

  const studentForm = el(
    'form',
    { class: 'auth__panel', id: 'panel-student', novalidate: 'true' },
    lrn.row,
    studentSubmit,
    el('p', {
      class: 'auth__fineprint',
      text: 'Your LRN is only used to find your own game record. Ask your teacher if you do not know it.',
    }),
  );

  /* ---- admin: username + password ---- */
  const username = field('admin-username', 'Admin username', 'Teacher, guidance or principal account', {
    autocomplete: 'username',
    'aria-describedby': 'admin-username-hint',
  });
  const password = field('admin-password', 'Password', 'Never stored by this app', {
    autocomplete: 'current-password',
    'aria-describedby': 'admin-password-hint',
  });
  password.input.type = 'password';

  const adminSubmit = el('button', {
    class: 'btn btn--grape btn--block btn--lg',
    type: 'submit',
    html: `${icon('gear')}<span>Log in as admin</span>`,
  }) as HTMLButtonElement;

  const adminForm = el(
    'form',
    { class: 'auth__panel', id: 'panel-admin', novalidate: 'true', hidden: 'true' },
    username.row,
    password.row,
    adminSubmit,
    el('p', {
      class: 'auth__fineprint',
      text: 'Admin accounts can see every student record, so they always need a password. The password is checked on the server and is never saved here.',
    }),
  );

  /* ---- practice mode (only when the server cannot save anything) ---- */
  const practiceBtn = el('button', {
    class: 'btn btn--ghost btn--block',
    type: 'button',
    html: `${icon('play')}<span>Play in practice mode</span>`,
  }) as HTMLButtonElement;
  const practiceRow = el(
    'div',
    { class: 'auth__practice', hidden: 'true' },
    practiceBtn,
    el('p', {
      class: 'auth__fineprint',
      text: 'Practice mode plays all seven games normally, but nothing is sent to the school server — scores stay on this device only.',
    }),
  );

  /* ---------------- tabs ---------------- */
  const studentTab = el('button', {
    class: 'auth__tab is-active',
    type: 'button',
    role: 'tab',
    id: 'tab-student',
    'aria-selected': 'true',
    'aria-controls': 'panel-student',
    html: `${icon('people')}<span>Student</span>`,
  }) as HTMLButtonElement;
  const adminTab = el('button', {
    class: 'auth__tab',
    type: 'button',
    role: 'tab',
    id: 'tab-admin',
    'aria-selected': 'false',
    'aria-controls': 'panel-admin',
    html: `${icon('gear')}<span>Teacher / Admin</span>`,
  }) as HTMLButtonElement;

  function selectTab(which: 'student' | 'admin'): void {
    const student = which === 'student';
    studentTab.classList.toggle('is-active', student);
    adminTab.classList.toggle('is-active', !student);
    studentTab.setAttribute('aria-selected', String(student));
    adminTab.setAttribute('aria-selected', String(!student));
    studentForm.hidden = !student;
    adminForm.hidden = student;
    hideError();
    audio.sfx('click');
    (student ? lrn.input : username.input).focus();
  }

  studentTab.addEventListener('click', () => selectTab('student'));
  adminTab.addEventListener('click', () => selectTab('admin'));

  /* ---------------- busy state ---------------- */
  function setBusy(state: boolean, label?: string): void {
    busy = state;
    [studentSubmit, adminSubmit, practiceBtn].forEach((btn) => (btn.disabled = state));
    if (state) {
      studentSubmit.classList.add('is-busy');
      adminSubmit.classList.add('is-busy');
      if (label) {
        if (!studentForm.hidden) studentSubmit.lastElementChild!.textContent = label;
        if (!adminForm.hidden) adminSubmit.lastElementChild!.textContent = label;
      }
    } else {
      studentSubmit.classList.remove('is-busy');
      adminSubmit.classList.remove('is-busy');
      studentSubmit.lastElementChild!.textContent = 'Enter SAFE SQUAD';
      adminSubmit.lastElementChild!.textContent = 'Log in as admin';
    }
  }

  /** Turn anything the server or the network threw into one readable sentence. */
  function describeError(err: unknown): string {
    if (err instanceof ApiError) {
      if (err.isOffline) {
        serverState = 'unreachable';
        renderServerState();
        return 'Cannot reach the SAFE SQUAD server. Check that it is running, or continue in practice mode.';
      }
      if (err.isDatabaseDown) {
        serverState = 'no-database';
        renderServerState();
        return `${err.message}${err.detail ? ` (${err.detail})` : ''}`;
      }
      return err.message; // the server already writes student-friendly messages
    }
    console.warn('[login] unexpected error', err);
    return 'Something went wrong. Please try again.';
  }

  /** Where to go once we are in. */
  function enter(): void {
    audio.sfx('whoosh');
    const wanted = nav.takePending();
    nav.go(wanted && wanted !== 'login' ? wanted : 'hub');
  }

  /* ---------------- student submit ---------------- */
  const offStudentForm = on(studentForm, 'submit', async (ev) => {
    ev.preventDefault();
    if (busy) return;
    hideError();

    const value = lrn.input.value.replace(/\D/g, '');
    if (value.length !== LRN_LENGTH) {
      showError(`Please type all ${LRN_LENGTH} digits of your LRN (you typed ${value.length}).`);
      lrn.input.focus();
      return;
    }

    setBusy(true, 'Checking…');
    try {
      const student = await loginWithLrn(value);
      serverState = 'ready';
      renderServerState();
      console.log(`[login] student ${student.lrn} logged in`);
      enter();
    } catch (err) {
      setBusy(false);
      showError(describeError(err));
      // Select the text so one tap on the field is enough to retype it.
      lrn.input.focus();
      lrn.input.select();
    }
  });

  /* ---------------- admin submit ---------------- */
  const offAdminForm = on(adminForm, 'submit', async (ev) => {
    ev.preventDefault();
    if (busy) return;
    hideError();

    const name = username.input.value.trim();
    const secret = password.input.value;
    if (!name) {
      showError('Please type the admin username.');
      username.input.focus();
      return;
    }
    if (!secret) {
      showError('Please type the password.');
      password.input.focus();
      return;
    }

    setBusy(true, 'Checking…');
    try {
      await loginAdmin(name, secret);
      serverState = 'ready';
      renderServerState();
      // Clear the password box immediately; it is never needed again.
      password.input.value = '';
      enter();
    } catch (err) {
      setBusy(false);
      showError(describeError(err));
      password.input.value = '';
      password.input.focus();
    }
  });

  /* ---------------- practice mode ---------------- */
  const offPractice = on(practiceBtn, 'click', () => {
    if (busy) return;
    audio.sfx('click');
    startPractice();
    enter();
  });

  /* ---------------- assemble the screen ---------------- */
  const card = el(
    'div',
    { class: 'auth__card' },
    el('h1', { class: 'auth__title', text: 'Welcome to SAFE SQUAD' }),
    el('p', {
      class: 'auth__lead',
      text: 'Seven games that teach how to keep children safe. Log in to play and save your progress.',
    }),
    notice,
    errorBox,
    el('div', { class: 'auth__tabs', role: 'tablist', 'aria-label': 'How do you want to log in?' }, studentTab, adminTab),
    studentForm,
    adminForm,
    practiceRow,
  );

  const inner = el(
    'div',
    { class: 'auth__inner' },
    el(
      'header',
      { class: 'auth__brand' },
      svgBox(mascotKaya('wave'), 'auth__logo'),
      el(
        'div',
        { class: 'auth__brandtext' },
        el('strong', { text: 'SAFE SQUAD' }),
        el('span', { text: 'Child Protection Hub' }),
      ),
    ),
    card,
    el('p', {
      class: 'auth__foot',
      html:
        'If something in real life feels unsafe, tell a trusted adult straight away.<br>' +
        'Original artwork, characters and music created for this school project.',
    }),
  );
  root.appendChild(inner);

  /* ---------------- first paint ---------------- */
  // A session that expired (or an API restart, which empties the server's memory)
  // is explained once, here, instead of silently dumping the student on a form.
  const ended = takeEndedMessage();
  if (ended) showError(ended);

  renderServerState();
  window.setTimeout(() => lrn.input.focus(), 120);

  /* ---------------- check the server, then update the offer ---------------- */
  // Cheap and quick: it decides whether practice mode is offered, and it also
  // recovers if the server is started after this screen was already open.
  void api
    .health()
    .then((health) => {
      if (disposed) return;
      serverState = health.database === 'connected' ? 'ready' : 'no-database';
      renderServerState();
    })
    .catch(() => {
      if (disposed) return;
      serverState = 'unreachable';
      renderServerState();
    });

  return {
    root,
    destroy: () => {
      disposed = true;
      offLrnInput();
      offStudentForm();
      offAdminForm();
      offPractice();
      // Never leave a typed password in memory or on screen.
      password.input.value = '';
      audio.stopMusic();
    },
  };
}
