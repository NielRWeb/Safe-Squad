/** Local smoke checks; no real MySQL, Render deployment or HTTPS transport. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, copyFile, symlink, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('optional TLS is passed to mysql2 with verification and optional CA', async () => {
  const temp = await mkdtemp(path.join(tmpdir(), 'safe-tls-'));
  try {
    const ca = path.join(temp, 'test-ca.pem');
    await writeFile(ca, 'synthetic CA text, not a real certificate');
    const script = `import {dbConfig,pool,closePool} from './server/db.js'; console.log(JSON.stringify({config:dbConfig.ssl || null, pool:pool.pool.config.connectionConfig.ssl || null})); await closePool();`;
    function run(variables) {
      return spawnSync(process.execPath, ['--input-type=module', '-e', script], {
        cwd: root, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development', DB_SSL: '', DB_SSL_CA_PATH: '', ...variables },
      });
    }
    for (const setting of ['', 'false']) {
      const result = run({ DB_SSL: setting }); assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(result.stdout).config, null);
    }
    let result = run({ DB_SSL: 'true' }); assert.equal(result.status, 0, result.stderr);
    let data = JSON.parse(result.stdout);
    assert.equal(data.pool.minVersion, 'TLSv1.2'); assert.equal(data.pool.rejectUnauthorized, true); assert.equal(data.pool.ca, undefined);
    result = run({ DB_SSL: 'true', DB_SSL_CA_PATH: ca }); assert.equal(result.status, 0, result.stderr);
    data = JSON.parse(result.stdout);
    assert.equal(data.pool.ca, 'synthetic CA text, not a real certificate');
    assert.notEqual(run({ DB_SSL: 'true', DB_SSL_CA_PATH: path.join(temp, 'missing.pem') }).status, 0);
    assert.notEqual(run({ DB_SSL: 'invalid' }).status, 0);
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('production serves frontend while preserving API routes', async () => {
  const temp = await mkdtemp(path.join(tmpdir(), 'safe-static-'));
  let child;
  try {
    await cp(path.join(root, 'server'), path.join(temp, 'server'), { recursive: true });
    await copyFile(path.join(root, 'tests/stub-db.js'), path.join(temp, 'server/db.js'));
    await copyFile(path.join(root, 'package.json'), path.join(temp, 'package.json'));
    await symlink(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
    await mkdir(path.join(temp, 'dist', 'assets'), { recursive: true });
    await writeFile(path.join(temp, 'dist/index.html'), '<!doctype html><title>Static smoke test</title><script type="module" src="/assets/app.js"></script>');
    await writeFile(path.join(temp, 'dist/assets/app.js'), 'console.log("static-ok");');
    await mkdir(path.join(temp, 'dist/api'), { recursive: true });
    await writeFile(path.join(temp, 'dist/api/health'), 'must not shadow the API');
    const socket = net.createServer(); await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
    const port = socket.address().port; await new Promise(resolve => socket.close(resolve));
    const env = { ...process.env, PORT: String(port), HOST: '127.0.0.1', NODE_ENV: 'production', DB_HOST: 'example', DB_PORT: '3306', DB_NAME: 'test', DB_USER: 'safeapp', DB_PASSWORD: 'fake-test-only', FRONTEND_ORIGIN: 'https://school.example', SESSION_COOKIE_SECURE: 'true' };
    child = spawn(process.execPath, [path.join(temp, 'server/index.js')], { cwd: path.join(temp, 'dist'), env, stdio: 'ignore' });
    const base = `http://127.0.0.1:${port}`;
    let response;
    for (let i = 0; i < 100; i++) {
      try { response = await fetch(`${base}/api/health`); if (response.ok) break; } catch { /* starting */ }
      if (child.exitCode !== null) throw Error('server exited');
      await delay(50);
    }
    assert.ok(response?.ok, 'server started');
    response = await fetch(`${base}/`);
    assert.equal(response.status, 200); assert.match(await response.text(), /Static smoke test/);
    assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
    assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
    response = await fetch(`${base}/assets/app.js`); assert.equal(response.status, 200); assert.match(await response.text(), /static-ok/);
    response = await fetch(`${base}/api/health`); assert.equal(response.status, 200);
    assert.match(response.headers.get('content-security-policy'), /default-src 'none'/);
    assert.equal((await response.json()).service, 'safe-squad-api');
    response = await fetch(`${base}/api/admin/students`); assert.equal(response.status, 401); assert.match(response.headers.get('content-type'), /json/);
    response = await fetch(`${base}/api/missing`); assert.equal(response.status, 404); assert.match(response.headers.get('content-type'), /json/);
    response = await fetch(`${base}/api/reports`); assert.equal(response.status, 404); assert.match(response.headers.get('content-type'), /json/);
    response = await fetch(`${base}/nonexistent.js`); assert.equal(response.status, 404);
  } finally {
    if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)); }
    await rm(temp, { recursive: true, force: true });
  }
});
