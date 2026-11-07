/** Deployment smoke tests against a fake DB, not a MySQL or HTTPS integration test. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, copyFile, symlink, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function freePort() {
  const sock = net.createServer(); await new Promise(resolve => sock.listen(0, '127.0.0.1', resolve));
  const port = sock.address().port; await new Promise(resolve => sock.close(resolve)); return port;
}

test('empty schema matches development tables and has no seed or destructive statements', async () => {
  const development = await readFile(path.join(root, 'server/schema.sql'), 'utf8');
  const empty = await readFile(path.join(root, 'server/schema-empty.sql'), 'utf8');
  const tables = text => text.match(/CREATE TABLE IF NOT EXISTS\s+\w+\s*\([\s\S]*?\) ENGINE\s*=\s*InnoDB;/gi);
  assert.deepEqual(tables(empty), tables(development));
  const sql = empty.replace(/--[^\n]*/g, '');
  assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|DROP|TRUNCATE|USE|CREATE\s+DATABASE)\b(?!\s+CASCADE)/i);
});

test('production startup, readiness, graceful stop and invalid port', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'safesquad-deploy-'));
  let child;
  try {
    await cp(path.join(root, 'server'), path.join(dir, 'server'), { recursive: true });
    await copyFile(path.join(root, 'tests/stub-db.js'), path.join(dir, 'server/db.js'));
    await copyFile(path.join(root, 'package.json'), path.join(dir, 'package.json'));
    await symlink(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    const port = await freePort();
    const env = { ...process.env, PORT: String(port), NODE_ENV: 'production', DB_HOST: 'example', DB_PORT: '3306', DB_NAME: 'test', DB_USER: 'safeapp', DB_PASSWORD: 'fake-test-only', FRONTEND_ORIGIN: 'https://school.example', SESSION_COOKIE_SECURE: 'true', HOST: '127.0.0.1' };
    async function start(extra = {}) {
      child = spawn(process.execPath, ['server/index.js'], { cwd: dir, env: { ...env, ...extra }, stdio: 'ignore' });
      for (let n = 0; n < 100; n++) {
        try { const res = await fetch(`http://127.0.0.1:${port}/api/health`); if (res.ok) return; } catch { /* starting */ }
        if (child.exitCode !== null) throw Error('API exited during startup');
        await delay(50);
      }
      throw Error('API did not start');
    }
    async function stop() {
      child.kill('SIGTERM'); const code = await new Promise(resolve => child.once('exit', resolve)); child = null;
      assert.equal(code, 0, 'SIGTERM closes the server cleanly');
    }
    await start();
    let response = await fetch(`http://127.0.0.1:${port}/api/ready`);
    assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
    await stop();
    await start({ STUB_FAIL_READY: '1' });
    response = await fetch(`http://127.0.0.1:${port}/api/ready`);
    assert.equal(response.status, 503); assert.equal((await response.json()).ok, false);
    assert.equal((await fetch(`http://127.0.0.1:${port}/api/health`)).status, 200, 'liveness remains available');
    await stop();
    child = spawn(process.execPath, ['server/index.js'], { cwd: dir, env: { ...env, PORT: 'not-a-port' }, stdio: 'ignore' });
    assert.notEqual(await new Promise(resolve => child.once('exit', resolve)), 0); child = null;
    child = spawn(process.execPath, ['server/setup-database.js'], { cwd: dir, env, stdio: 'ignore' });
    assert.notEqual(await new Promise(resolve => child.once('exit', resolve)), 0, 'production demo seeding is refused'); child = null;
  } finally {
    if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)); }
    await rm(dir, { recursive: true, force: true });
  }
});
