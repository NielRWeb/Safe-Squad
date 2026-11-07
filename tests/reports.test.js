/** HTTP integration tests with real Express routes and an in-memory DB adapter, not MySQL. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, copyFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let directory, child, base;
let adminCookie, studentCookie;
const details = { lrn: '000000000123', firstName: '  Ana  ', lastName: 'Reyes', gradeLevel: 'Grade 7', section: 'Rizal' };
async function call(method, route, body, cookie) {
  const response = await fetch(base + route, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: (response.headers.get('content-type') || '').includes('json') ? await response.json() : await response.text(), headers: response.headers, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
async function freePort() {
  const server = net.createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port; await new Promise(resolve => server.close(resolve)); return port;
}
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'safesquad-test-'));
  await cp(path.join(root, 'server'), path.join(directory, 'server'), { recursive: true });
  await copyFile(path.join(root, 'tests/report-stub-db.js'), path.join(directory, 'server/db.js'));
  await copyFile(path.join(root, 'package.json'), path.join(directory, 'package.json'));
  await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
  const port = await freePort(); base = `http://127.0.0.1:${port}/api`;
  child = spawn(process.execPath, ['server/index.js'], { cwd: directory, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${base}/health`)).ok) return; } catch { /* server starting */ }
    if (child.exitCode !== null) throw new Error('Test server exited during startup');
    await delay(50);
  }
  throw new Error('Test server did not start');
});
after(async () => {
  if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)); }
  if (directory) await rm(directory, { recursive: true, force: true });
});

test('reports calculations, filters, export and authorisation', async () => {
  adminCookie = (await call('POST', '/auth/admin-login', { username: 'teacher', password: 'Str0ngPass123' })).cookie;
  studentCookie = (await call('POST', '/auth/login', { lrn: '136000000001' })).cookie;
  for (const url of ['/admin/reports', '/admin/reports.csv']) {
    assert.equal((await call('GET', url)).status, 401);
    assert.equal((await call('GET', url, null, studentCookie)).status, 403);
  }
  let response = await call('GET', '/admin/reports', null, adminCookie);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.body.students, 6); assert.equal(response.body.activeStudents, 5);
  assert.equal(response.body.attempts, 3); assert.equal(response.body.participants, 2);
  assert.equal(response.body.averagePercent, 67); assert.equal(response.body.correctAnswers, 10); assert.equal(response.body.questions, 15);
  assert.deepEqual(response.body.byGame.find(g => g.gameId === 'bingo'), { gameId: 'bingo', attempts: 2, participants: 2, averagePercent: 90 });
  response = await call('GET', '/admin/reports?start=2025-02-01&end=2025-02-01', null, adminCookie);
  assert.equal(response.body.attempts, 2); assert.equal(response.body.participants, 1); assert.equal(response.body.averagePercent, 50);
  assert.equal(response.body.results.length, 2); assert.equal(response.body.results[0].gameId, 'maze');
  response = await call('GET', '/admin/reports?start=2025-02-01&end=2025-02-02&lrn=136000000002', null, adminCookie);
  assert.equal(response.body.attempts, 1); assert.equal(response.body.correctAnswers, 5); assert.equal(response.body.results[0].stars, 3);
  response = await call('GET', '/admin/reports?start=2025-03-01', null, adminCookie);
  assert.equal(response.body.attempts, 0); assert.equal(response.body.participants, 0); assert.deepEqual(response.body.results, []);
  assert.equal((await call('GET', '/admin/reports?start=2025-02-30', null, adminCookie)).status, 400);
  assert.equal((await call('GET', '/admin/reports?start=2025-02-02&end=2025-02-01', null, adminCookie)).status, 400);
  assert.equal((await call('GET', '/admin/reports?lrn=123', null, adminCookie)).status, 400);
  assert.equal((await call('GET', '/admin/reports?page=0', null, adminCookie)).status, 400);
  const csv = await call('GET', '/admin/reports.csv?start=2025-02-01&end=2025-02-01', null, adminCookie);
  assert.equal(csv.status, 200); assert.match(csv.headers.get('content-type'), /text\/csv/);
  assert.match(csv.body, /"'136000000001"/); assert.match(csv.body, /"'=Risk,""Quoted"" Dela Cruz"/);
  assert.ok(!csv.body.includes('136000000002')); assert.ok(!csv.body.includes('password')); assert.equal(csv.body.trim().split('\r\n').length, 3);
  assert.equal((await call('GET', '/admin/reports.csv?end=2025-02-30', null, adminCookie)).status, 400);
  const empty = await call('GET', '/admin/reports.csv?start=2025-03-01', null, adminCookie);
  assert.equal(empty.body.trim().split('\r\n').length, 1);
});
