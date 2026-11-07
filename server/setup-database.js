/**
 * SAFE SQUAD — server/setup-database.js
 * =============================================================================
 * ONE COMMAND THAT BUILDS THE DATABASE.
 *
 *     npm run db:setup
 *
 * It reads server/schema.sql and runs the whole thing against MySQL, so you do
 * not have to open phpMyAdmin or remember any SQL. It creates the database, the
 * three tables and the six sample students — and it is safe to run twice.
 *
 * Your MySQL password is read from `.env` only. It is never typed into this file
 * and never printed on screen.
 * =============================================================================
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { dbConfig, explainDbError, closePool, missingEnvVars } from './db.js';

const thisFolder = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(thisFolder, 'schema.sql');

async function main() {
  // This legacy script creates/uses safe_squad and seeds demo rows. Never run it
  // in production or against a differently named database.
  if (process.env.NODE_ENV === 'production' || dbConfig.database !== 'safe_squad') {
    console.error('db:setup is for local safe_squad demo databases only. See docs/DEPLOYMENT.md for a seed-free installation.');
    process.exitCode = 1;
    await closePool();
    return;
  }
  console.log('');
  console.log('  SAFE SQUAD — database setup');
  console.log(`  MySQL: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}`);

  const missing = missingEnvVars();
  if (missing.length) {
    console.log(`  ! No .env values for: ${missing.join(', ')} — using defaults.`);
    console.log('    If this fails, copy .env.example to .env and set your MySQL password.');
  }

  // 1. Read the SQL file.
  let schemaSql;
  try {
    schemaSql = fs.readFileSync(schemaPath, 'utf8');
  } catch (error) {
    console.error(`  ✘ Could not read ${schemaPath}: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  // 2. Connect WITHOUT choosing a database (the script has to create it first)
  //    and allow several statements in one call, because schema.sql is a list.
  let connection = null;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    });

    await connection.query(schemaSql);
    console.log(`  ✔ schema.sql ran — database "${dbConfig.database}" is ready`);

    // 3. Report what is now in there (schema.sql ends with USE safe_squad).
    const [tables] = await connection.query('SHOW TABLES');
    const names = tables.map((row) => Object.values(row)[0]);
    console.log(`  ✔ tables: ${names.join(', ')}`);

    const [[{ students }]] = await connection.query('SELECT COUNT(*) AS students FROM students');
    const [[{ admins }]] = await connection.query('SELECT COUNT(*) AS admins FROM admins');
    const [[{ results }]] = await connection.query('SELECT COUNT(*) AS results FROM game_results');
    console.log(`  ✔ rows: ${students} students, ${admins} admins, ${results} results`);

    if (Number(admins) === 0) {
      console.log('');
      console.log('  → No admin account yet. Create one with:');
      console.log('      npm run admin:create');
    }
    console.log('');
    console.log('  → Start the API with:  npm run dev:server');
    console.log('  → Check it is alive:   http://localhost:4000/api/health');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('  ✘ Setup failed.');
    console.error(`    Reason : ${explainDbError(error)}`);
    console.error(`    MySQL  : ${error.code ?? ''} ${error.sqlMessage ?? error.message ?? ''}`);
    console.error('');
    console.error('    Checklist:');
    console.error('      1. Is MySQL running? (XAMPP control panel → Start MySQL)');
    console.error('      2. Does .env exist, with the right DB_USER / DB_PASSWORD?');
    console.error(`      3. Can that user create databases on ${dbConfig.host}:${dbConfig.port}?`);
    console.error('');
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end().catch(() => {});
    await closePool().catch(() => {});
  }
}

await main();
