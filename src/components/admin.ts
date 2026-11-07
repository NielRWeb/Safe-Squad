/** Admin dashboard. The server independently checks the admin session on every request. */
import { el } from '../utils/dom';
import { api, type AdminStudent, type GameResult } from '../services/api';
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
    studentList.replaceChildren(...matching.map(s => el('article', { class: 'admin__row' },
      el('strong', { text: s.fullName || 'Unnamed student' }),
      el('span', { text: `LRN: ${s.lrn}` }),
      el('span', { text: [s.gradeLevel, s.section].filter(Boolean).join(' · ') || 'Grade and section unavailable' }),
    )));
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
      summary.replaceChildren(stat('Students', String(data.students)), stat('Game attempts', String(data.results.rounds)),
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
  const back = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: '← Game hub' });
  back.addEventListener('click', () => nav.toHub());
  const signOut = el('button', { class: 'admin__button', type: 'button', text: 'Log out' });
  signOut.addEventListener('click', () => confirmDialog({ title: 'Log out?', text: 'You will return to the login screen.',
    confirmLabel: 'Yes, log out', cancelLabel: 'Cancel', onConfirm: () => { void logout(); } }));
  root.append(
    el('header', { class: 'admin__header' }, el('div', {}, el('span', { class: 'admin__eyebrow', text: 'SAFE SQUAD · TEACHER SPACE' }),
      el('h1', { text: 'Admin dashboard' }), el('p', { text: `Welcome, ${displayName()}.` })),
      el('div', { class: 'admin__actions' }, back, signOut)),
    el('main', { class: 'admin__content' },
      el('section', { class: 'admin__section', 'aria-label': 'Overview' }, el('h2', { text: 'At a glance' }), summary),
      el('section', { class: 'admin__section', 'aria-labelledby': 'students-heading' },
        el('h2', { id: 'students-heading', text: 'Students' }),
        el('label', { for: 'student-search', text: 'Search students' }), studentSearch, studentList),
      el('section', { class: 'admin__section', 'aria-labelledby': 'results-heading' },
        el('h2', { id: 'results-heading', text: 'Recent game results' }),
        el('p', { class: 'admin__note', text: 'Showing up to the 50 most recent attempts. Filters apply to this list only.' }),
        el('div', { class: 'admin__filters' },
          el('div', {}, el('label', { for: 'result-search', text: 'Search results' }), resultSearch),
          el('div', {}, el('label', { for: 'result-game', text: 'Game' }), gameFilter)), resultList)));
  void loadSummary(); void loadStudents(); void loadResults();
  return { root, destroy: () => { alive = false; } };
}
