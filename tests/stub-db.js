/**
 * TEST STUB of server/db.js — tests only, never used by the production server.
 * Same exports, but the data lives in arrays instead of MySQL, so the real
 * Express routes, guards, cookies and JSON shapes can be tested end-to-end.
 */
import { hashPassword } from './passwords.js';
import fs from 'node:fs';

const students = [
  { lrn: '136000000001', last_name: 'Dela Cruz', first_name: 'Juan Miguel', grade_level: 'Grade 7', section: 'Sampaguita', created_at: '2026-01-05 08:00:00' },
  { lrn: '136000000002', last_name: 'Santos', first_name: 'Maria Clara', grade_level: 'Grade 8', section: 'Rizal', created_at: '2026-01-05 08:00:00' },
  { lrn: '136000000003', last_name: 'Reyes', first_name: 'Andres Nico', grade_level: 'Grade 9', section: 'Mabini', created_at: '2026-01-05 08:00:00' },
  { lrn: '136000000004', last_name: 'Bautista', first_name: 'Luis Gabriel', grade_level: 'Grade 7', section: 'Sampaguita', created_at: '2026-01-05 08:00:00' },
  { lrn: '136000000005', last_name: 'Ocampo', first_name: 'Angela Kate', grade_level: 'Grade 8', section: 'Rizal', created_at: '2026-01-05 08:00:00' },
  { lrn: '136000000006', last_name: 'Villanueva', first_name: 'Paolo Miguel', grade_level: 'Grade 9', section: 'Mabini', created_at: '2026-01-05 08:00:00' },
];
students.forEach(student => { student.is_active = 1; });
const admins = [
  { id: 1, username: 'teacher', password_hash: hashPassword('Str0ngPass123'), full_name: 'Ms. Rivera', role: 'admin', created_at: '2026-01-05 08:00:00' },
];
const results = [];
let nextResultId = 1;
let nextAdminId = 2;
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

export const dbConfig = { host: 'stub', port: 0, user: 'stub', password: '', database: 'stub' };
export function missingEnvVars() { return []; }
export async function pingDatabase() { return { ok: true }; }
export function isDbError() { return false; }
export function explainDbError(e) { return String(e?.message ?? e); }
export async function closePool() {}
export const pool = {};
export async function queryOne(sql, params = []) { const rows = await query(sql, params); return rows[0] ?? null; }

// Fake persistent store for tests only. STUB_SESSION_FILE survives an API restart.
let memorySessions = {};
function readSessions() {
  const file = process.env.STUB_SESSION_FILE;
  return file && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : memorySessions;
}
function writeSessions(data) {
  memorySessions = data;
  if (process.env.STUB_SESSION_FILE) fs.writeFileSync(process.env.STUB_SESSION_FILE, JSON.stringify(data));
}

export async function query(sql, params = []) {
  const s = sql.replace(/\s+/g, ' ');
  if (s.includes('SELECT COUNT(*) AS total FROM sessions')) return [{ total: Object.values(readSessions()).filter(row => row.expires_ms > params[0] && row.absolute_expires_ms > params[1]).length }];
  if (s.includes('INSERT INTO sessions')) {
    const [token_hash, role, student_lrn, user_data, created_ms, expires_ms, absolute_expires_ms] = params;
    const data = readSessions(); data[token_hash] = { token_hash, role, student_lrn, user_data, created_ms, expires_ms, absolute_expires_ms }; writeSessions(data); return { affectedRows: 1 };
  }
  if (s.includes('SELECT user_data, created_ms')) {
    const row = readSessions()[params[0]];
    return row && row.expires_ms > params[1] && row.absolute_expires_ms > params[2] ? [row] : [];
  }
  if (s.includes('UPDATE sessions SET expires_ms')) {
    const data = readSessions(), row = data[params[1]];
    if (!row || row.expires_ms <= params[2] || row.absolute_expires_ms <= params[3]) return { affectedRows: 0 };
    row.expires_ms = params[0]; writeSessions(data); return { affectedRows: 1 };
  }
  if (s.includes('DELETE FROM sessions WHERE token_hash')) {
    const data = readSessions(); const exists = !!data[params[0]]; delete data[params[0]]; writeSessions(data); return { affectedRows: Number(exists) };
  }
  if (s.includes("DELETE FROM sessions WHERE role = 'student'")) {
    const data = readSessions(); for (const [key, row] of Object.entries(data)) if (row.role === 'student' && row.student_lrn === params[0]) delete data[key];
    writeSessions(data); return { affectedRows: 1 };
  }


  if (s.includes('INSERT INTO students')) {
    const [lrn, first_name, last_name, grade_level, section] = params;
    if (students.some(student => student.lrn === lrn)) { const error = new Error('duplicate'); error.code = 'ER_DUP_ENTRY'; throw error; }
    students.push({ lrn, first_name, last_name, grade_level, section, is_active: 1, created_at: now() });
    return { affectedRows: 1 };
  }
  if (s.includes('UPDATE students SET first_name')) {
    const [first_name, last_name, grade_level, section, lrn] = params;
    const student = students.find(x => x.lrn === lrn);
    if (!student) return { affectedRows: 0 };
    Object.assign(student, { first_name, last_name, grade_level, section });
    return { affectedRows: 1 };
  }
  if (s.includes('UPDATE students SET is_active')) {
    const student = students.find(x => x.lrn === params[0]);
    if (!student) return { affectedRows: 0 };
    student.is_active = 0;
    return { affectedRows: 1 };
  }
  if (s.includes('INSERT INTO game_results')) {
    const [lrn, game_id, category_id, correct, total, stars] = params;
    const row = { id: nextResultId++, lrn, game_id, category_id, correct, total, stars, played_at: now() };
    results.push(row);
    return { insertId: row.id, affectedRows: 1 };
  }
  if (s.includes('INSERT INTO admins')) {
    const [username, password_hash, full_name, role] = params;
    admins.push({ id: nextAdminId++, username, password_hash, full_name, role, created_at: now() });
    return { insertId: admins.length, affectedRows: 1 };
  }
  if (s.includes('FROM admins WHERE id = ?')) return admins.filter(a => a.id === params[0]);
  if (s.includes('FROM admins WHERE username = ?')) return admins.filter((a) => a.username === params[0]);
  if (s.includes('FROM students WHERE lrn = ?')) return students.filter((x) => x.lrn === params[0] && (!s.includes('AND is_active = 1') || x.is_active === 1));

  // GET /api/me/results
  if (s.includes('FROM game_results WHERE lrn = ?')) {
    let rows = results.filter((r) => r.lrn === params[0]);
    if (s.includes('AND game_id = ?')) rows = rows.filter((r) => r.game_id === params[1]);
    const limit = Number(s.match(/LIMIT (\d+)/)?.[1] ?? 20);
    return [...rows].reverse().slice(0, limit);
  }
  if (s.includes('FROM game_results WHERE id = ?')) return results.filter((r) => r.id === Number(params[0]));

  // GET /api/admin/results (join with names)
  if (s.includes('FROM game_results g')) {
    let rows = [...results].reverse();
    if (s.includes('g.lrn = ?')) rows = rows.filter((r) => r.lrn === params[0]);
    if (s.includes('g.game_id = ?')) rows = rows.filter((r) => r.game_id === params[params.length - 1]);
    const limit = Number(s.match(/LIMIT (\d+)/)?.[1] ?? 50);
    return rows.slice(0, limit).map((r) => {
      const st = students.find((x) => x.lrn === r.lrn) ?? {};
      return { ...r, first_name: st.first_name, last_name: st.last_name };
    });
  }

  // GET /api/admin/students (aggregate)
  if (s.includes('LEFT JOIN game_results g ON g.lrn = s.lrn')) {
    let rows = students;
    if (s.includes('s.lrn LIKE ?')) {
      const term = String(params[0]).replace(/%/g, '').toLowerCase();
      rows = rows.filter((x) => `${x.lrn} ${x.last_name} ${x.first_name} ${x.section}`.toLowerCase().includes(term));
    }
    return rows.map((x) => {
      const own = results.filter((r) => r.lrn === x.lrn);
      const avg = own.length ? own.reduce((n, r) => n + (r.total ? r.correct / r.total : 0), 0) / own.length * 100 : 0;
      return { ...x, rounds_played: own.length, best_correct: own.reduce((n, r) => Math.max(n, r.correct), 0), average_percent: String(Math.round(avg)), last_played: own.length ? own[own.length - 1].played_at : null };
    });
  }

  // GET /api/admin/summary
  if (s.includes('students_who_played')) {
    const avg = results.length ? results.reduce((n, r) => n + (r.total ? r.correct / r.total : 0), 0) / results.length * 100 : 0;
    return [{ rounds: String(results.length), students_who_played: String(new Set(results.map((r) => r.lrn)).size), correct_answers: String(results.reduce((n, r) => n + r.correct, 0)), questions_answered: String(results.reduce((n, r) => n + r.total, 0)), average_percent: String(Math.round(avg)), last_round: results.length ? results[results.length - 1].played_at : null }];
  }
  if (s.includes('GROUP BY game_id')) {
    const ids = [...new Set(results.map((r) => r.game_id))];
    return ids.map((id) => {
      const own = results.filter((r) => r.game_id === id);
      const avg = own.reduce((n, r) => n + (r.total ? r.correct / r.total : 0), 0) / own.length * 100;
      return { game_id: id, rounds: String(own.length), players: String(new Set(own.map((r) => r.lrn)).size), average_percent: String(Math.round(avg)), best_correct: String(own.reduce((n, r) => Math.max(n, r.correct), 0)) };
    });
  }
  if (s.includes('(SELECT COUNT(*) FROM students)')) return [{ students: String(students.length), active_students: String(students.filter(x => x.is_active).length), admins: String(admins.length) }];
  if (s.includes('SELECT 1')) return [{ 1: 1 }];

  throw new Error(`STUB: unhandled SQL -> ${s.slice(0, 90)}`);
}
