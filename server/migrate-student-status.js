/** Non-destructive, repeatable upgrade for existing Phase 1/2 databases. */
import { query, closePool } from './db.js';
try {
  const rows = await query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'students' AND COLUMN_NAME = 'is_active'",
  );
  if (rows.length) console.log('Student status column already exists; nothing to do.');
  else {
    await query('ALTER TABLE students ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1');
    console.log('Student status added. Existing students are active; results are unchanged.');
  }
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
