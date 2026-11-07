/**
 * SAFE SQUAD — server/passwords.js
 * =============================================================================
 * ADMIN PASSWORD HASHING.
 *
 * THE RULE: a plain-text password is never stored, never logged, never sent back
 * to the browser. Only a one-way HASH is saved in the `admins.password_hash`
 * column. If the database ever leaked, the passwords would still be unreadable.
 *
 * WHY NODE'S BUILT-IN `crypto` AND NOT `bcrypt`?
 * `crypto.scrypt` is part of Node itself, so the project needs no extra package.
 * scrypt is a modern, deliberately slow, memory-hard password hash — the same
 * family of algorithm as bcrypt.
 *
 * WHAT IS STORED IN THE DATABASE (one text column):
 *      scrypt:<random salt>:<hash>
 *   e.g. scrypt:9f2c…:4ab1…
 * The salt is different for every admin, so two admins with the same password
 * still get different hashes (and a rainbow table is useless).
 *
 * NOTE: students do NOT have passwords — they log in with their LRN only.
 * This file is used for ADMIN accounts only.
 * =============================================================================
 */
import crypto from 'node:crypto';

/** Length of the derived key, in bytes. 64 is a common, strong choice. */
const KEY_LENGTH = 64;
/** Name of the algorithm, stored with the hash so we can verify it later. */
const SCHEME = 'scrypt';

/**
 * Turn a plain-text password into the string that gets saved in MySQL.
 * @param {string} plainPassword
 * @returns {string} 'scrypt:<salt>:<hash>'
 */
export function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(plainPassword), salt, KEY_LENGTH).toString('hex');
  return `${SCHEME}:${salt}:${hash}`;
}

/**
 * Check a typed password against the stored hash.
 *
 * scrypt is one-way, so we cannot "decrypt" the hash. Instead we hash the typed
 * password with the SAME salt and compare the two results.
 *
 * `timingSafeEqual` compares in constant time. An ordinary `===` stops at the
 * first different character, which leaks (through timing) how much of a guess was
 * right. This version always takes the same amount of time.
 *
 * @param {string} plainPassword  what the admin typed
 * @param {string} storedHash     what is in admins.password_hash
 * @returns {boolean}
 */
export function verifyPassword(plainPassword, storedHash) {
  const [scheme, salt, hash] = String(storedHash ?? '').split(':');
  if (scheme !== SCHEME || !salt || !hash) return false;

  const typed = crypto.scryptSync(String(plainPassword ?? ''), salt, KEY_LENGTH);
  const stored = Buffer.from(hash, 'hex');

  // Lengths must match before timingSafeEqual can be used.
  if (typed.length !== stored.length) return false;
  return crypto.timingSafeEqual(typed, stored);
}

/**
 * A throwaway hash used when the USERNAME does not exist.
 *
 * Without it, "unknown username" answers instantly while "wrong password" takes
 * ~50 ms, so an attacker could tell which usernames are real just by measuring
 * the response time. Verifying against this dummy costs the same time either way.
 * It is generated once when the server starts and is never saved anywhere.
 */
export const DUMMY_HASH = hashPassword('this-account-does-not-exist');

/**
 * Password rules for creating an admin (used by `npm run admin:create`).
 * Kept as a function so the same rule can be reused later by an admin screen.
 * @returns {string|null} a human-readable problem, or null when the password is OK
 */
export function passwordProblem(password) {
  const value = String(password ?? '');
  if (value.length < 8) return 'The password must be at least 8 characters long.';
  if (!/[A-Za-z]/.test(value)) return 'The password must contain at least one letter.';
  if (!/[0-9]/.test(value)) return 'The password must contain at least one number.';
  return null;
}
