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
  return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
async function freePort() {
  const server = net.createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port; await new Promise(resolve => server.close(resolve)); return port;
}
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'safesquad-test-'));
  await cp(path.join(root, 'server'), path.join(directory, 'server'), { recursive: true });
  await copyFile(path.join(root, 'tests/stub-db.js'), path.join(directory, 'server/db.js'));
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

test('management, access control and retained results', async () => {
  const admin = await call('POST', '/auth/admin-login', { username: 'teacher', password: 'Str0ngPass123' });
  assert.equal(admin.status, 200); adminCookie = admin.cookie;
  const student = await call('POST', '/auth/login', { lrn: '136000000001' });
  assert.equal(student.status, 200); studentCookie = student.cookie;
  for (const [method, url, body] of [
    ['POST', '/admin/students', details], ['PUT', '/admin/students/000000000123', details],
    ['POST', '/admin/students/000000000123/deactivate', {}],
  ]) {
    assert.equal((await call(method, url, body)).status, 401);
    assert.equal((await call(method, url, body, studentCookie)).status, 403);
  }
  assert.equal((await call('POST', '/admin/students', { ...details, lrn: '123' }, adminCookie)).status, 400);
  assert.equal((await call('POST', '/admin/students', { ...details, firstName: '  ' }, adminCookie)).status, 400);
  assert.equal((await call('POST', '/admin/students', { ...details, firstName: 'A'.repeat(61) }, adminCookie)).status, 400);
  assert.equal((await call('POST', '/admin/students', details, adminCookie)).status, 201);
  assert.equal((await call('POST', '/admin/students', details, adminCookie)).status, 409);
  let roster = await call('GET', '/admin/students?search=Ana', null, adminCookie);
  assert.equal(roster.body.students[0].firstName, 'Ana');
  assert.equal(roster.body.students[0].isActive, true);
  assert.equal((await call('GET', '/admin/students?search=000000000123', null, adminCookie)).body.count, 1);
  const login = await call('POST', '/auth/login', { lrn: details.lrn });
  assert.equal(login.status, 200);
  assert.equal((await call('POST', '/results', { gameId: 'bingo', categoryId: 'c1', correct: 4, total: 5, stars: 2 }, login.cookie)).status, 201);
  assert.equal((await call('PUT', `/admin/students/${details.lrn}`, { ...details, lrn: '111111111111' }, adminCookie)).status, 400);
  assert.equal((await call('PUT', `/admin/students/${details.lrn}`, { ...details, firstName: 'Maria' }, adminCookie)).status, 200);
  roster = await call('GET', '/admin/students?search=Maria', null, adminCookie);
  assert.ok(roster.body.students.some(s => s.lrn === details.lrn && s.firstName === 'Maria'));
  assert.equal((await call('PUT', '/admin/students/999999999999', details, adminCookie)).status, 400); // mismatched LRN rejected
  assert.equal((await call('POST', `/admin/students/${details.lrn}/deactivate`, {}, adminCookie)).status, 200);
  assert.equal((await call('GET', '/me', null, login.cookie)).status, 401);
  assert.equal((await call('POST', '/results', { gameId: 'bingo', correct: 1, total: 1 }, login.cookie)).status, 401);
  assert.equal((await call('POST', '/auth/login', { lrn: details.lrn })).status, 404);
  roster = await call('GET', `/admin/students?search=${details.lrn}`, null, adminCookie);
  assert.equal(roster.body.students[0].isActive, false);
  const history = await call('GET', `/admin/results?lrn=${details.lrn}`, null, adminCookie);
  assert.equal(history.body.count, 1); assert.equal(history.body.results[0].correct, 4);
  assert.equal(history.body.results[0].firstName, 'Maria');
  assert.equal((await call('GET', '/admin/summary', null, adminCookie)).body.results.rounds, 1);
  assert.equal((await call('POST', '/admin/students/999999999999/deactivate', {}, adminCookie)).status, 404);
});
