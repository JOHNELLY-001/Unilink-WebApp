-- 001_create_users.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                VARCHAR(255) UNIQUE,
  phone                VARCHAR(30),
  password_hash        VARCHAR(255),
  first_name           VARCHAR(100) NOT NULL,
  last_name            VARCHAR(100) NOT NULL,
  role                 VARCHAR(20)  NOT NULL CHECK (role IN ('student','mentor','admin')),
  avatar_url           TEXT,
  avatar_public_id     TEXT,
  onboarding_complete  BOOLEAN DEFAULT FALSE,
  google_id            VARCHAR(255) UNIQUE,
  is_active            BOOLEAN DEFAULT TRUE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role      ON users(role);