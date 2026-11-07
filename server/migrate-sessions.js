/** Non-destructive session table upgrade; safe to run repeatedly. */
import { query, closePool } from './db.js';
try {
  await query(`CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    role VARCHAR(10) NOT NULL, student_lrn VARCHAR(12) NULL, user_data TEXT NOT NULL,
    created_ms BIGINT NOT NULL, expires_ms BIGINT NOT NULL, absolute_expires_ms BIGINT NOT NULL,
    INDEX idx_sessions_student (role, student_lrn), INDEX idx_sessions_expiry (expires_ms)
  ) ENGINE = InnoDB`);
  console.log('Persistent sessions table is ready. Existing student data was not changed.');
} catch (error) { console.error('Session migration failed:', error.message); process.exitCode = 1; }
finally { await closePool(); }
