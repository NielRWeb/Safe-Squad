-- Empty installation schema: select your database before running this file.
-- No database creation, sample accounts, inserts, or destructive statements.

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

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  role VARCHAR(10) NOT NULL,
  student_lrn VARCHAR(12) NULL,
  user_data TEXT NOT NULL,
  created_ms BIGINT NOT NULL,
  expires_ms BIGINT NOT NULL,
  absolute_expires_ms BIGINT NOT NULL,
  INDEX idx_sessions_student (role, student_lrn),
  INDEX idx_sessions_expiry (expires_ms)
) ENGINE = InnoDB;
