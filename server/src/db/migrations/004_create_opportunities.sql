-- 004_create_opportunities.sql

CREATE TABLE IF NOT EXISTS opportunities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon         VARCHAR(10)  NOT NULL,
  title        VARCHAR(255) NOT NULL,
  org          VARCHAR(255) NOT NULL,
  description  TEXT,
  deadline     DATE         NOT NULL,
  type         VARCHAR(30)  NOT NULL CHECK (type IN ('scholarship','internship','programme','event')),
  field        VARCHAR(100) DEFAULT 'All Fields',
  requirements TEXT[]       DEFAULT '{}',
  link         TEXT,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_opportunities_type     ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);