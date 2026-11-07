/** Admin dashboard. The server independently checks the admin session on every request. */
import { el } from '../utils/dom';
import { api, ApiError, type AdminStudent, type GameResult } from '../services/api';
import { createReportsPanel } from './reports';
import { displayName, logout } from '../core/session';
import { confirmDialog } from '../core/ui';
import type { Nav, Scene } from '../core/router';

const games: Record<string, string> = {
  babyCry: "Don't Make the Baby Cry", puzzle: 'Attach the Missing Puzzle',
  factFall: 'Fact or Fall', hearts: 'Save Your Hearts', maze: 'Choose & Escape',
  princess: 'Save the Princess', bingo: 'Bingo Game',
};

function dateLabel(value: string | null): string {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function createAdminScene(nav: Nav): Scene {
  let alive = true;
  let students: AdminStudent[] = [];
  let results: GameResult[] = [];
  const root = el('section', { class: 'admin', 'aria-label': 'Admin dashboard' });
  const summary = el('div', { class: 'admin__stats', 'aria-live': 'polite' });
  const management = el('div', { class: 'admin__management' });
  const managementNotice = el('p', { class: 'admin__message', role: 'status', 'aria-live': 'polite' });
  const studentList = el('div', { class: 'admin__list', 'aria-live': 'polite' });
  const resultList = el('div', { class: 'admin__list', 'aria-live': 'polite' });
  const studentSearch = el('input', { id: 'student-search', type: 'search', placeholder: 'Name, LRN, grade or section' });
  const resultSearch = el('input', { id: 'result-search', type: 'search', placeholder: 'Student name or LRN' });
  const gameFilter = el('select', { id: 'result-game' }, el('option', { value: '', text: 'All games' }));
  Object.entries(games).forEach(([id, name]) => gameFilter.appendChild(el('option', { value: id, text: name })));

  function message(target: HTMLElement, text: string): void {
    target.replaceChildren(el('p', { class: 'admin__message', text }));
  }
  function failure(target: HTMLElement, label: string, retry: () => void): void {
    const button = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Try again' });
    button.addEventListener('click', retry);
    target.replaceChildren(el('div', { class: 'admin__error', role: 'alert' },
      el('p', { text: `Could not load ${label}. Please check your connection or permissions and try again.` }), button));
  }
  function renderStudents(): void {
    const search = studentSearch.value.trim().toLowerCase();
    const matching = students.filter(s => [s.lrn, s.fullName, s.gradeLevel, s.section].join(' ').toLowerCase().includes(search));
    if (!matching.length) return message(studentList, search ? 'No students match your search.' : 'No students found.');
    studentList.replaceChildren(...matching.map(s => {
      const edit = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Edit', 'aria-label': `Edit ${s.fullName}` });
      edit.addEventListener('click', () => showForm(s));
      const deactivate = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Deactivate', 'aria-label': `Deactivate ${s.fullName}` });
      deactivate.addEventListener('click', () => confirmDialog({
        title: 'Deactivate student?',
        text: `${s.fullName} will no longer be able to log in. Their past results will be kept.`,
        confirmLabel: 'Yes, deactivate', cancelLabel: 'Cancel',
        onConfirm: () => { void deactivateStudent(s, deactivate); },
      }));
      return el('article', { class: 'admin__row' },
        el('strong', { text: s.fullName || 'Unnamed student' }),
        el('span', { text: `LRN: ${s.lrn}` }),
        el('span', { text: [s.gradeLevel, s.section].filter(Boolean).join(' · ') || 'Grade and section unavailable' }),
        el('span', { class: s.isActive ? 'admin__active' : 'admin__inactive', text: s.isActive ? 'Active' : 'Deactivated' }),
        el('div', { class: 'admin__actions' }, edit, s.isActive ? deactivate : null));
    }));
  }

  async function deactivateStudent(student: AdminStudent, button: HTMLButtonElement): Promise<void> {
    button.disabled = true;
    managementNotice.textContent = 'Deactivating student…';
    try {
      await api.deactivateStudent(student.lrn);
      if (!alive) return;
      managementNotice.textContent = 'Student deactivated. Historical results are preserved.';
      reports.refresh();
      await Promise.all([loadStudents(), loadSummary()]);
    } catch (error) {
      if (!alive) return;
      button.disabled = false;
      managementNotice.textContent = error instanceof ApiError ? error.message : 'Could not deactivate student. Please try again.';
    }
  }

  function showForm(student?: AdminStudent): void {
    managementNotice.textContent = '';
    const title = el('h3', { text: student ? 'Edit student' : 'Add student' });
    const form = el('form', { class: 'admin__form' });
    function field(id: string, label: string, value: string, max: number): HTMLInputElement {
      const input = el('input', { id, value, maxlength: max, required: true, type: 'text' });
      form.append(el('div', {}, el('label', { for: id, text: label }), input));
      return input;
    }
    const lrn = field('manage-lrn', 'LRN (12 digits)', student?.lrn || '', 12);
    lrn.setAttribute('inputmode', 'numeric'); lrn.setAttribute('pattern', '[0-9]{12}');
    if (student) { lrn.readOnly = true; lrn.setAttribute('aria-describedby', 'lrn-note'); form.append(el('p', { id: 'lrn-note', class: 'admin__note', text: 'LRN cannot be changed because it links to past results.' })); }
    const firstName = field('manage-first', 'First name', student?.firstName || '', 60);
    const lastName = field('manage-last', 'Last name', student?.lastName || '', 60);
    const gradeLevel = field('manage-grade', 'Grade', student?.gradeLevel || '', 20);
    const section = field('manage-section', 'Section', student?.section || '', 30);
    const errorLine = el('p', { class: 'admin__error', role: 'alert' });
    const save = el('button', { class: 'admin__button', type: 'submit', text: student ? 'Save changes' : 'Add student' });
    const cancel = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Cancel' });
    cancel.addEventListener('click', () => management.replaceChildren());
    form.append(errorLine, el('div', { class: 'admin__actions' }, save, cancel));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fields = { firstName: firstName.value.trim(), lastName: lastName.value.trim(), gradeLevel: gradeLevel.value.trim(), section: section.value.trim() };
      if (!/^\d{12}$/.test(lrn.value.trim()) || Object.values(fields).some(value => !value)) {
        errorLine.textContent = 'Enter a 12-digit LRN and fill in every field.'; return;
      }
      save.disabled = true; cancel.disabled = true; errorLine.textContent = '';
      try {
        if (student) await api.updateStudent(student.lrn, fields);
        else await api.createStudent({ lrn: lrn.value.trim(), ...fields });
        if (!alive) return;
        management.replaceChildren();
        managementNotice.textContent = student ? 'Student updated.' : 'Student added.';
        reports.refresh();
        await Promise.all([loadStudents(), loadSummary(), loadResults()]);
      } catch (error) {
        if (!alive) return;
        errorLine.textContent = error instanceof ApiError ? error.message : 'Could not save student. Please try again.';
        save.disabled = false; cancel.disabled = false;
      }
    });
    management.replaceChildren(title, form);
    lrn.focus();

  }
  function renderResults(): void {
    const search = resultSearch.value.trim().toLowerCase();
    const matching = results.filter(r =>
      [r.fullName || `${r.firstName || ''} ${r.lastName || ''}`, r.lrn].join(' ').toLowerCase().includes(search)
      && (!gameFilter.value || r.gameId === gameFilter.value));
    if (!matching.length) return message(resultList, search || gameFilter.value ? 'No results match these filters.' : 'No results recorded yet.');
    resultList.replaceChildren(...matching.map(r => el('article', { class: 'admin__row admin__result' },
      el('div', { class: 'admin__rowhead' }, el('strong', { text: r.fullName || 'Student' }),
        el('span', { class: 'admin__score', text: `${r.correct} / ${r.total} correct` })),
      el('span', { text: `LRN: ${r.lrn}` }),
      el('span', { text: `${games[r.gameId] || r.gameId} · Category: ${r.categoryId || 'Not specified'}` }),
      r.stars !== null ? el('span', { text: `Stars collected: ${r.stars}` }) : null,
      el('time', { text: dateLabel(r.playedAt), datetime: r.playedAt || undefined }),
    )));
  }
  async function loadSummary(): Promise<void> {
    message(summary, 'Loading summary…');
    try {
      const data = await api.adminSummary();
      if (!alive) return;
      const stat = (label: string, value: string) => el('div', { class: 'admin__stat' },
        el('span', { text: label }), el('strong', { text: value }));
      summary.replaceChildren(stat('Students', String(data.students)), stat('Active students', String(data.activeStudents)), stat('Game attempts', String(data.results.rounds)), stat('Participating students', String(data.results.studentsWhoPlayed)),
        stat('Average per round', data.results.rounds ? `${data.results.averagePercent}%` : '—'));
    } catch { if (alive) failure(summary, 'summary', () => void loadSummary()); }
  }
  async function loadStudents(): Promise<void> {
    studentSearch.disabled = true;
    message(studentList, 'Loading students…');
    try {
      const data = await api.adminStudents();
      if (!alive) return;
      students = data.students; studentSearch.disabled = false; renderStudents();
    } catch { if (alive) failure(studentList, 'students', () => void loadStudents()); }
  }
  async function loadResults(): Promise<void> {
    resultSearch.disabled = true; gameFilter.disabled = true;
    message(resultList, 'Loading results…');
    try {
      const data = await api.adminResults();
      if (!alive) return;
      results = data.results; resultSearch.disabled = false; gameFilter.disabled = false; renderResults();
    } catch { if (alive) failure(resultList, 'results', () => void loadResults()); }
  }
  studentSearch.addEventListener('input', renderStudents);
  resultSearch.addEventListener('input', renderResults);
  gameFilter.addEventListener('change', renderResults);
  const addStudent = el('button', { class: 'admin__button', type: 'button', text: 'Add student' });
  addStudent.addEventListener('click', () => showForm());
  const back = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: '← Game hub' });
  back.addEventListener('click', () => nav.toHub());
  const signOut = el('button', { class: 'admin__button', type: 'button', text: 'Log out' });
  signOut.addEventListener('click', () => confirmDialog({ title: 'Log out?', text: 'You will return to the login screen.',
    confirmLabel: 'Yes, log out', cancelLabel: 'Cancel', onConfirm: () => { void logout(); } }));
  const reports = createReportsPanel();
  root.append(
    el('header', { class: 'admin__header' }, el('div', {}, el('span', { class: 'admin__eyebrow', text: 'SAFE SQUAD · TEACHER SPACE' }),
      el('h1', { text: 'Admin dashboard' }), el('p', { text: `Welcome, ${displayName()}.` })),
      el('div', { class: 'admin__actions' }, back, signOut)),
    el('main', { class: 'admin__content' },
      el('section', { class: 'admin__section', 'aria-label': 'Overview' }, el('h2', { text: 'At a glance' }), summary),
      reports.root,
      el('section', { class: 'admin__section', 'aria-labelledby': 'students-heading' },
        el('h2', { id: 'students-heading', text: 'Students' }), addStudent, management, managementNotice,
        el('label', { for: 'student-search', text: 'Search students' }), studentSearch, studentList),
      el('section', { class: 'admin__section', 'aria-labelledby': 'results-heading' },
        el('h2', { id: 'results-heading', text: 'Recent game results' }),
        el('p', { class: 'admin__note', text: 'Showing up to the 50 most recent attempts. Filters apply to this list only.' }),
        el('div', { class: 'admin__filters' },
          el('div', {}, el('label', { for: 'result-search', text: 'Search results' }), resultSearch),
          el('div', {}, el('label', { for: 'result-game', text: 'Game' }), gameFilter)), resultList)));
  void loadSummary(); void loadStudents(); void loadResults();
  return { root, destroy: () => { alive = false; reports.destroy(); } };
}
