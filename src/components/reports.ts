/** Filtered reports are independent of the dashboard's 50-row recent-results list. */
import { el } from '../utils/dom';
import { api, ApiError, reportCsvUrl, type ReportFilters, type ReportResponse } from '../services/api';

const games: Record<string, string> = {
  babyCry: "Don't Make the Baby Cry", puzzle: 'Attach the Missing Puzzle', factFall: 'Fact or Fall',
  hearts: 'Save Your Hearts', maze: 'Choose & Escape', princess: 'Save the Princess', bingo: 'Bingo Game',
};

export function createReportsPanel(): { root: HTMLElement; destroy: () => void; refresh: () => void } {
  let alive = true;
  let requestNumber = 0;
  let applied: ReportFilters = {};
  const root = el('section', { class: 'admin__section', 'aria-labelledby': 'reports-title' });
  const form = el('form', { class: 'admin__filters' });
  const start = el('input', { id: 'report-start', type: 'date' });
  const end = el('input', { id: 'report-end', type: 'date' });
  const student = el('select', { id: 'report-student' }, el('option', { value: '', text: 'All students' }));
  const status = el('p', { class: 'admin__message', role: 'status', 'aria-live': 'polite' });
  const rosterStatus = el('div', { role: 'status', 'aria-live': 'polite' });
  const body = el('div', { 'aria-live': 'polite' });
  const apply = el('button', { class: 'admin__button', type: 'submit', text: 'Apply filters' });
  const exportLink = el('a', { class: 'admin__button admin__button--outline admin__export', text: 'Export filtered CSV' });
  exportLink.hidden = true;
  const field = (id: string, label: string, control: HTMLElement) => el('div', {}, el('label', { for: id, text: label }), control);
  form.append(field('report-start', 'Start date', start), field('report-end', 'End date', end),
    field('report-student', 'Student', student), el('div', { class: 'admin__actions admin__report-actions' }, apply, exportLink));
  root.append(el('h2', { id: 'reports-title', text: 'Reports & analytics' }),
    el('p', { class: 'admin__note', text: 'Dates are inclusive, using the database server’s calendar dates. Student totals reflect the current roster; attempt statistics follow these filters.' }),
    form, rosterStatus, status, body);

  async function loadRoster(): Promise<void> {
    try {
      const response = await api.adminStudents();
      if (!alive) return;
      rosterStatus.replaceChildren();
      student.disabled = false;
      const selected = student.value;
      student.replaceChildren(el('option', { value: '', text: 'All students' }), ...response.students.map(s =>
        el('option', { value: s.lrn, text: `${s.fullName} · ${s.lrn}${s.isActive ? '' : ' (deactivated)'}` })));
      student.value = selected;
    } catch {
      if (alive) {
        student.disabled = true;
        const retry = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Retry student list' });
        retry.addEventListener('click', () => void loadRoster());
        rosterStatus.replaceChildren(el('p', { class: 'admin__error', text: 'Could not load the student selector.' }), retry);
      }
    }
  }
  const stat = (label: string, value: string) => el('div', { class: 'admin__stat' }, el('span', { text: label }), el('strong', { text: value }));
  function render(data: ReportResponse): void {
    const cards = el('div', { class: 'admin__stats' },
      stat('Total students', String(data.students)), stat('Active students', String(data.activeStudents)),
      stat('Filtered attempts', String(data.attempts)), stat('Participating students', String(data.participants)),
      stat('Average per attempt', data.attempts ? `${data.averagePercent}%` : '—'),
      stat('Correct answers', `${data.correctAnswers} / ${data.questions}`));
    const gameCards = el('div', { class: 'admin__list' }, ...Object.entries(games).map(([id, name]) => {
      const game = data.byGame.find(g => g.gameId === id);
      return el('article', { class: 'admin__row' }, el('strong', { text: name }),
        el('span', { text: `${game?.attempts ?? 0} attempts · ${game?.participants ?? 0} students` }),
        el('span', { text: game?.attempts ? `Average per attempt: ${game.averagePercent}%` : 'No attempts in this range.' }));
    }));
    const history = el('div', { class: 'admin__list' });
    if (!data.results.length) history.append(el('p', { class: 'admin__message', text: 'No attempts match these filters.' }));
    else for (const r of data.results) {
      const when = r.playedAt ? new Date(r.playedAt) : null;
      const date = when && !Number.isNaN(when.getTime()) ? when.toLocaleString() : (r.playedAt || 'Date unavailable');
      history.append(el('article', { class: 'admin__row' },
        el('strong', { text: r.fullName || 'Student' }), el('span', { text: `LRN: ${r.lrn}` }),
        el('span', { text: `${games[r.gameId] || r.gameId} · Category: ${r.categoryId || 'Not specified'}` }),
        el('span', { text: `Score: ${r.correct} / ${r.total} correct${r.total ? ` (${Math.round(r.correct / r.total * 100)}%)` : ''}` }),
        r.stars === null ? null : el('span', { text: `Stars: ${r.stars}` }), el('span', { text: date })));
    }
    const pagination = el('div', { class: 'admin__actions admin__report-actions' });
    const previous = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Previous' });
    const next = el('button', { class: 'admin__button admin__button--outline', type: 'button', text: 'Next' });
    previous.disabled = data.page <= 1; next.disabled = data.page * data.pageSize >= data.attempts;
    previous.addEventListener('click', () => void load({ ...applied, page: data.page - 1 }));
    next.addEventListener('click', () => void load({ ...applied, page: data.page + 1 }));
    pagination.append(previous, el('span', { text: `Page ${data.page}` }), next);
    body.replaceChildren(cards, el('h3', { text: 'Game analytics' }), gameCards,
      el('h3', { text: applied.lrn ? 'Student game history' : 'Game history' }), history, pagination);
  }
  async function load(filters: ReportFilters): Promise<void> {
    applied = filters;
    const sequence = ++requestNumber;
    status.textContent = 'Loading report…'; body.replaceChildren(); exportLink.hidden = true;
    try {
      const data = await api.adminReport(filters);
      if (!alive || sequence !== requestNumber) return;
      render(data); status.textContent = `${data.attempts} matching attempts.`;
      // Export uses the applied filters (not unsaved form edits) and includes all pages.
      exportLink.href = reportCsvUrl({ start: filters.start, end: filters.end, lrn: filters.lrn });
      exportLink.hidden = false;
    } catch (error) {
      if (!alive || sequence !== requestNumber) return;
      status.textContent = error instanceof ApiError ? error.message : 'Could not load report. Please try again.';
    }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (start.value && end.value && start.value > end.value) { status.textContent = 'End date must be on or after start date.'; return; }
    void load({ start: start.value, end: end.value, lrn: student.value, page: 1 });
  });
  void loadRoster(); void load({ page: 1 });
  return { root, destroy: () => { alive = false; requestNumber++; }, refresh: () => { void loadRoster(); void load(applied); } };
}
