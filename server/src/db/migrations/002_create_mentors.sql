-- 002_create_profiles.sql

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(255) NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- ── STUDENT PROFILE ──
CREATE TABLE IF NOT EXISTS student_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  school               VARCHAR(255),
  form                 VARCHAR(20),
  region               VARCHAR(100),
  combination          VARCHAR(20),
  career_interests     TEXT[]   DEFAULT '{}',
  target_universities  TEXT[]   DEFAULT '{}',
  goals                TEXT,
  bio                  TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── MENTOR PROFILE ──
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  title            VARCHAR(255),
  company          VARCHAR(255),
  field            VARCHAR(255),
  years_experience VARCHAR(20),
  mentoring_areas  TEXT[]  DEFAULT '{}',
  session_type     VARCHAR(100),
  availability     VARCHAR(100),
  hours_per_month  VARCHAR(20),
  bio              TEXT,
  linkedin_url     TEXT,
  portfolio_url    TEXT,
  approval_status  VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected')),
  approved_at      TIMESTAMPTZ,
  approved_by      UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentor_profiles_status ON mentor_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_field  ON mentor_profiles(field);