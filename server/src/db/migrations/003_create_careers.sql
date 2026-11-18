-- 003_create_careers.sql

CREATE TABLE IF NOT EXISTS careers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon         VARCHAR(10)  NOT NULL,
  title        VARCHAR(255) NOT NULL,
  field        VARCHAR(100) NOT NULL,
  combinations TEXT[]       DEFAULT '{}',
  salary_min   INTEGER,
  salary_max   INTEGER,
  demand_level VARCHAR(20)  CHECK (demand_level IN ('Low','Medium','High','Very High')),
  duration     VARCHAR(50),
  universities TEXT[]       DEFAULT '{}',
  description  TEXT,
  skills       TEXT[]       DEFAULT '{}',
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_id  UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_careers_field ON careers(field);