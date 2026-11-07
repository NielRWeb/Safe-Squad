/** Production policy and session restart tests using the file-backed test DB adapter, not MySQL. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, copyFile, symlink, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('persistent sessions, production cookies, CSRF, RBAC and admin throttling', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'safe-security-'));
  let child;
  try {
    await cp(path.join(root, 'server'), path.join(dir, 'server'), { recursive: true });
    await copyFile(path.join(root, 'tests/stub-db.js'), path.join(dir, 'server/db.js'));
    await copyFile(path.join(root, 'package.json'), path.join(dir, 'package.json'));
    await symlink(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    const sock = net.createServer(); await new Promise(r => sock.listen(0, '127.0.0.1', r));
    const port = sock.address().port; await new Promise(r => sock.close(r));
    const file = path.join(dir, 'sessions.json');
    const env = { ...process.env, PORT: String(port), NODE_ENV: 'production', DB_HOST: 'example', DB_PORT: '3306', DB_NAME: 'test', DB_USER: 'safeapp', DB_PASSWORD: 'fake-test-only', FRONTEND_ORIGIN: 'https://school.example', SESSION_COOKIE_SECURE: 'true', SESSION_MINUTES: '120', STUB_SESSION_FILE: file };
    async function start() {
      child = spawn(process.execPath, ['server/index.js'], { cwd: dir, env, stdio: 'ignore' });
      for (let i = 0; i < 100; i++) {
        try { if ((await fetch(`http://127.0.0.1:${port}/api/health`)).ok) return; } catch { /* starting */ }
        if (child.exitCode !== null) throw new Error('Server failed to start'); await delay(50);
      }
      throw Error('server timeout');
    }
    async function stop() { if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(r => child.once('exit', r)); } }
    async function call(url, { method = 'GET', data, cookie, origin, header = true } = {}) {
      const headers = {};
      if (origin !== undefined) headers.Origin = origin;
      if (header && method !== 'GET') headers['X-Safe-Squad-Request'] = '1';
      if (data) headers['Content-Type'] = 'application/json';
      if (cookie) headers.Cookie = cookie;
      return fetch(`http://127.0.0.1:${port}/api${url}`, { method, headers, ...(data ? { body: JSON.stringify(data) } : {}) });
    }
    await start();
    const student = { lrn: '136000000001' };
    assert.equal((await call('/auth/login', { method: 'POST', data: student })).status, 403);
    assert.equal((await call('/auth/login', { method: 'POST', data: student, origin: 'https://evil.example' })).status, 403);
    assert.equal((await call('/auth/login', { method: 'POST', data: student, origin: env.FRONTEND_ORIGIN, header: false })).status, 403);
    let response = await call('/auth/login', { method: 'POST', data: student, origin: env.FRONTEND_ORIGIN });
    assert.equal(response.status, 200);
    const setCookie = response.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /Secure/i); assert.match(setCookie, /SameSite=Lax/i);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
    assert.match(response.headers.get('strict-transport-security'), /max-age/);
    const cookie = setCookie.split(';')[0], rawToken = cookie.split('=')[1];
    const stored = await readFile(file, 'utf8'); assert.ok(!stored.includes(rawToken));
    assert.equal((await call('/admin/reports', { cookie })).status, 403);
    assert.equal((await call('/admin/reports')).status, 401);
    await stop(); await start();
    assert.equal((await call('/me', { cookie })).status, 200, 'session survives a restart');
    const rows = JSON.parse(await readFile(file, 'utf8'));
    Object.values(rows)[0].expires_ms = Date.now() - 1; await writeFile(file, JSON.stringify(rows));
    assert.equal((await call('/me', { cookie })).status, 401, 'expired session is refused');
    response = await call('/auth/login', { method: 'POST', data: student, origin: env.FRONTEND_ORIGIN });
    const newCookie = response.headers.get('set-cookie').split(';')[0];
    assert.equal((await call('/auth/logout', { method: 'POST', cookie: newCookie, origin: env.FRONTEND_ORIGIN })).status, 200);
    assert.equal((await call('/me', { cookie: newCookie })).status, 401, 'logout revokes token');
    const admin = await call('/auth/admin-login', { method: 'POST', data: { username: 'teacher', password: 'Str0ngPass123' }, origin: env.FRONTEND_ORIGIN });
    assert.equal(admin.status, 200);
    const adminCookie = admin.headers.get('set-cookie').split(';')[0];
    assert.equal((await call('/admin/students', { cookie: adminCookie })).status, 200);
    for (let i = 0; i < 9; i++) assert.equal((await call('/auth/admin-login', { method: 'POST', data: { username: 'teacher', password: 'wrong' }, origin: env.FRONTEND_ORIGIN })).status, 401);
    response = await call('/auth/admin-login', { method: 'POST', data: { username: 'teacher', password: 'wrong' }, origin: env.FRONTEND_ORIGIN });
    assert.equal(response.status, 429); assert.ok(response.headers.get('retry-after'));
    for (let i = 0; i < 12; i++) assert.equal((await call('/auth/login', { method: 'POST', data: { lrn: '999999999999' }, origin: env.FRONTEND_ORIGIN })).status, 404, 'failed student attempts are not blocked');
    assert.equal((await call('/auth/login', { method: 'POST', data: student, origin: env.FRONTEND_ORIGIN })).status, 200, 'legitimate student login is not blocked');
    await stop(); child = null;
    const bad = spawn(process.execPath, ['server/index.js'], { cwd: dir, env: { ...env, SESSION_COOKIE_SECURE: 'false' }, stdio: 'ignore' });
    const code = await new Promise(r => bad.once('exit', r)); assert.notEqual(code, 0, 'insecure production config fails');
  } finally {
    if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(r => child.once('exit', r)); }
    await rm(dir, { recursive: true, force: true });
  }
});
