-- =============================================================================
--  SAFE SQUAD — MySQL SCHEMA
-- =============================================================================
--  Everything the database needs, in one file, in the right order.
--
--  HOW TO RUN IT (pick one):
--
--    A) the easy way — a Node script reads this file and runs it for you:
--         copy .env.example .env      (then put your MySQL password in it)
--         npm run db:setup
--
--    B) by hand, in a terminal:
--         mysql -u root -p < server/schema.sql
--
--    C) in phpMyAdmin (XAMPP): open the SQL tab and paste this file.
--
--  Running it again is safe: the tables use IF NOT EXISTS and the sample rows use
--  INSERT IGNORE, so nothing is duplicated or lost.
--
--  TABLES
--    students      the class roster — one row per student, keyed by LRN
--    admins        staff logins — the ONLY table with a password (stored hashed)
--    game_results  one row per finished round — the student's actual progress
-- =============================================================================

-- Create the database itself, so `npm run db:setup` works on a brand-new MySQL
-- install with no manual steps. utf8mb4 stores any character, including the
-- ñ in Filipino names.
CREATE DATABASE IF NOT EXISTS safe_squad
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE safe_squad;


-- -----------------------------------------------------------------------------
-- 1. STUDENTS
-- -----------------------------------------------------------------------------
-- The LRN (Learner Reference Number) is the student's identity in this system:
-- it is the primary key, it is what they type to log in, and it is what every
-- game result points at.
--
-- VARCHAR(12), not a number type: an LRN is an IDENTIFIER, not a quantity.
-- Storing it as text keeps any leading zero intact and stops anyone from ever
-- trying to do arithmetic on it.
CREATE TABLE IF NOT EXISTS students (
  lrn          VARCHAR(12)  NOT NULL,
  last_name    VARCHAR(60)  NOT NULL,
  first_name   VARCHAR(60)  NOT NULL,
  grade_level  VARCHAR(20)  NOT NULL DEFAULT '',
  section      VARCHAR(30)  NOT NULL DEFAULT '',
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (lrn),
  INDEX idx_students_name (last_name, first_name),
  INDEX idx_students_class (grade_level, section)
) ENGINE = InnoDB;


-- -----------------------------------------------------------------------------
-- 2. ADMINS
-- -----------------------------------------------------------------------------
-- Teachers / guidance counsellors / principals who can see the whole roster.
--
-- password_hash holds text like  scrypt:<salt>:<hash>  produced by
-- server/passwords.js. THE PLAIN PASSWORD IS NEVER STORED ANYWHERE — not here,
-- not in a comment, not in the source code.
--
-- Admin rows are created with a command, so no credentials live in this file:
--     npm run admin:create -- your_username YourPassword123 "Full Name"
CREATE TABLE IF NOT EXISTS admins (
  id             INT           NOT NULL AUTO_INCREMENT,
  username       VARCHAR(40)   NOT NULL,
  password_hash  VARCHAR(255)  NOT NULL,
  full_name      VARCHAR(120)  NOT NULL DEFAULT '',
  role           VARCHAR(20)   NOT NULL DEFAULT 'admin',
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE = InnoDB;


-- -----------------------------------------------------------------------------
-- 3. GAME RESULTS
-- -----------------------------------------------------------------------------
-- One row per finished round. This is an ATTEMPT LOG, not a "best score" table:
-- history is kept, and best/average scores are calculated from it with SQL
-- (see GET /api/admin/summary). Nothing is overwritten, so a teacher can see a
-- student improving over time.
--
--   game_id      exactly one of the seven ids used by the frontend:
--                babyCry, puzzle, factFall, hearts, maze, princess, bingo
--   category_id  which of the 7 question categories was played (c1…c7).
--                Optional for now — the frontend does not send it yet, so it
--                defaults to ''.
--   correct      how many questions were answered correctly
--   total        how many questions were in that round. Kept separately because
--                not every game plays a fixed 5 (Save Your Hearts runs until a
--                knockout, Save the Princess spans 3 levels), so "4/5" and "4/9"
--                must not be mixed up.
--   stars        stars earned, when the game has them. NULL means "not applicable".
--   played_at    filled in by MySQL itself, so the server clock is the only clock.
CREATE TABLE IF NOT EXISTS game_results (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  lrn          VARCHAR(12)  NOT NULL,
  game_id      VARCHAR(16)  NOT NULL,
  category_id  VARCHAR(16)  NOT NULL DEFAULT '',
  correct      TINYINT      NOT NULL DEFAULT 0,
  total        TINYINT      NOT NULL DEFAULT 0,
  stars        TINYINT      NULL,
  played_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_results_lrn (lrn),
  INDEX idx_results_game (game_id),
  INDEX idx_results_played (played_at),
  -- FOREIGN KEY: a result can only exist for a student who is in the roster, so
  -- the database itself refuses orphan rows. ON DELETE CASCADE means removing a
  -- student also removes their results (a school's "delete this record" request).
  CONSTRAINT fk_results_student
    FOREIGN KEY (lrn) REFERENCES students (lrn)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- =============================================================================
--  SAMPLE STUDENTS — LOCAL DEVELOPMENT ONLY
-- =============================================================================
--  ⚠ THESE PEOPLE DO NOT EXIST. The names and LRNs below are invented so you can
--    log in and test on your own computer without typing a real class list.
--  ⚠ DELETE THIS SECTION (and these rows) before the database is ever used with
--    real students:
--        DELETE FROM students WHERE lrn LIKE '1360000000%';
--  ⚠ Real student data is personal data under the Data Privacy Act (RA 10173):
--    keep it on a school-controlled server and collect only what you need.
--
--  Try one of these LRNs at POST /api/auth/login:
--     136000000001 … 136000000006
-- =============================================================================
INSERT IGNORE INTO students (lrn, last_name, first_name, grade_level, section) VALUES
  ('136000000001', 'Dela Cruz',  'Juan Miguel',  'Grade 7',  'Sampaguita'),
  ('136000000002', 'Santos',     'Maria Clara',  'Grade 8',  'Rizal'),
  ('136000000003', 'Reyes',      'Andres Nico',  'Grade 9',  'Mabini'),
  ('136000000004', 'Bautista',   'Aling Bebang', 'Grade 10', 'Bonifacio'),
  ('136000000005', 'Ocampo',     'Patricia Mae', 'Grade 11', 'STEM-1'),
  ('136000000006', 'Villanueva', 'Carlo Jose',   'Grade 12', 'ABM-2');


-- -----------------------------------------------------------------------------
-- SAMPLE RESULTS — OPTIONAL, COMMENTED OUT ON PURPOSE
-- -----------------------------------------------------------------------------
-- Uncomment these three lines if you want the admin endpoints to return
-- something immediately during a demo. They are only for local development.
--
-- INSERT IGNORE INTO game_results (id, lrn, game_id, category_id, correct, total, stars) VALUES
--   (1, '136000000001', 'babyCry',  'c1', 4, 5, NULL),
--   (2, '136000000001', 'bingo',    'c4', 5, 5, 3),
--   (3, '136000000002', 'hearts',   'c7', 3, 6, NULL);


-- -----------------------------------------------------------------------------
-- NO ADMIN ACCOUNTS ARE INSERTED HERE — ON PURPOSE.
-- -----------------------------------------------------------------------------
-- An admin row needs a password hash, and a hash of a known password committed
-- to git is the same as publishing the password. Create the first admin locally
-- instead (the hash is generated on your machine and never committed):
--
--     npm run admin:create -- teacher Str0ngPass123 "Ms. Rivera"
--
-- Then log in at POST /api/auth/admin-login with { "username": "teacher",
-- "password": "Str0ngPass123" }.
-- -----------------------------------------------------------------------------

-- Quick check: show what was created.
-- SHOW TABLES;
-- SELECT lrn, last_name, first_name, grade_level, section FROM students;
