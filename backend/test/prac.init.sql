DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'film') THEN
    CREATE ROLE film LOGIN;
  END IF;
END$$;

SELECT 'CREATE DATABASE film OWNER film'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'film')\gexec

\c film

CREATE TABLE IF NOT EXISTS films (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  image        TEXT NOT NULL,
  rating       NUMERIC(3,1) NOT NULL DEFAULT 0,
  about        TEXT,
  description  TEXT
);

CREATE TABLE IF NOT EXISTS schedules (
  id             TEXT PRIMARY KEY,
  film_id        TEXT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  starts_at      TIMESTAMPTZ NOT NULL,
  hall           INT NOT NULL,
  rows           INT NOT NULL,
  seats_per_row  INT NOT NULL,
  price          INT NOT NULL DEFAULT 0,
  taken          TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_schedules_film_id ON schedules(film_id);
