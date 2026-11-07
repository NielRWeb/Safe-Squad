/**
 * SAFE SQUAD — server/create-admin.js
 * =============================================================================
 * CREATE AN ADMIN ACCOUNT FROM THE TERMINAL.
 *
 *     npm run admin:create
 *         → asks you for the username, password, full name and role
 *
 *     npm run admin:create -- teacher Str0ngPass123 "Ms. Rivera"
 *     npm run admin:create -- teacher Str0ngPass123 "Ms. Rivera" principal
 *         → takes them as arguments (note: arguments land in your shell history,
 *           so the interactive version above is the safer habit)
 *
 * WHY A SCRIPT INSTEAD OF A ROW IN schema.sql?
 * An admin row needs a password HASH. A hash of a password that is written down
 * in a public repository is the same thing as publishing that password — anybody
 * could read schema.sql and log in as the teacher. This script makes the hash on
 * YOUR computer, so no credential ever exists in the source code.
 *
 * The password itself is only ever held in a variable: it is hashed, the hash is
 * inserted, and the password is never printed or written to a file.
 * =============================================================================
 */
import readline from 'node:readline/promises';
import { Writable } from 'node:stream';
import { stdin as input, stdout as output } from 'node:process';
import { query, queryOne, pingDatabase, explainDbError, closePool } from './db.js';
import { hashPassword, passwordProblem } from './passwords.js';

/** Usernames are simple and case-sensitive: letters, numbers, dot, dash, underscore. */
const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,40}$/;
/** Roles are short lowercase words, e.g. admin, principal, guidance. */
const ROLE_PATTERN = /^[a-z]{3,20}$/;

function usage() {
  console.log('');
  console.log('  SAFE SQUAD — create an admin account');
  console.log('');
  console.log('  Usage (interactive, recommended):');
  console.log('    npm run admin:create');
  console.log('');
  console.log('  Usage (all values as arguments):');
  console.log('    npm run admin:create -- <username> <password> "<full name>" [role]');
  console.log('');
  console.log('  Example:');
  console.log('    npm run admin:create -- teacher Str0ngPass123 "Ms. Rivera"');
  console.log('');
}

async function main() {
  let [username, password, fullName, role] = process.argv.slice(2);

  const interactive = !username && !password;
  if (interactive && !process.stdin.isTTY) {
    // Nothing can be typed (for example inside a script or CI), so ask for args.
    usage();
    console.log('  ✘ This terminal cannot answer prompts — pass the values as arguments.');
    process.exitCode = 1;
    return;
  }

  let muted = false;
  const promptOutput = new Writable({ write(chunk, _encoding, callback) { if (!muted) output.write(chunk); callback(); } });
  const rl = interactive ? readline.createInterface({ input, output: promptOutput, terminal: true }) : null;
  try {
    if (rl) {
      console.log('');
      console.log('  SAFE SQUAD — create an admin account');
      console.log('  Password input is hidden; use a private terminal.');
      console.log('');
      username = (await rl.question('  Username        : ')).trim();
      output.write('  Password        : ');
      muted = true;
      try { password = await rl.question(''); } finally { muted = false; output.write('\n'); }
      fullName = (await rl.question('  Full name       : ')).trim();
      role = (await rl.question('  Role [admin]    : ')).trim() || 'admin';
    }

    /* ---------------- validate ---------------- */
    const problems = [];
    if (!USERNAME_PATTERN.test(String(username ?? ''))) {
      problems.push('The username must be 3-40 characters: letters, numbers, dot, dash or underscore.');
    }
    const passwordProblemText = passwordProblem(password);
    if (passwordProblemText) problems.push(passwordProblemText);
    if (!ROLE_PATTERN.test(String(role ?? ''))) {
      problems.push('The role must be 3-20 lowercase letters (for example: admin, principal, guidance).');
    }
    if (problems.length) {
      usage();
      problems.forEach((problem) => console.log(`  ✘ ${problem}`));
      console.log('');
      process.exitCode = 1;
      return;
    }

    /* ---------------- is MySQL there? ---------------- */
    const ping = await pingDatabase();
    if (!ping.ok) {
      console.log('');
      console.log(`  ✘ Cannot reach MySQL: ${ping.message}`);
      console.log('    Start MySQL, check .env, and create the tables with: npm run db:setup');
      console.log('');
      process.exitCode = 1;
      return;
    }

    /* ---------------- already taken? ---------------- */
    const existing = await queryOne('SELECT id FROM admins WHERE username = ?', [username]);
    if (existing) {
      console.log('');
      console.log(`  ✘ The username "${username}" already exists (admin id ${existing.id}).`);
      console.log('    Choose another username, or delete that row first:');
      console.log(`      DELETE FROM admins WHERE username = '${username}';`);
      console.log('');
      process.exitCode = 1;
      return;
    }

    /* ---------------- hash and insert ---------------- */
    const passwordHash = hashPassword(password);
    await query(
      'INSERT INTO admins (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, fullName ?? '', role],
    );

    const created = await queryOne(
      'SELECT id, username, full_name, role, created_at FROM admins WHERE username = ?',
      [username],
    );

    console.log('');
    console.log('  ✔ Admin account created');
    console.log(`    id       : ${created.id}`);
    console.log(`    username : ${created.username}`);
    console.log(`    name     : ${created.full_name || '(not given)'}`);
    console.log(`    role     : ${created.role}`);
    console.log('    password : stored as a scrypt hash only — keep the original somewhere safe,');
    console.log('               it cannot be read back out of the database.');
    console.log('');
    console.log('  Log in with:  POST /api/auth/admin-login  { "username": "...", "password": "..." }');
    console.log('');
  } catch (error) {
    console.log('');
    console.log(`  ✘ Could not create the admin: ${explainDbError(error)}`);
    console.log(`    (${error.code ?? ''} ${error.sqlMessage ?? error.message ?? ''})`);
    console.log('');
    process.exitCode = 1;
  } finally {
    if (rl) rl.close();
    await closePool().catch(() => {});
  }
}

await main();
