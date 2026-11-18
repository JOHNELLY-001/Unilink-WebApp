-- 007_create_sessions.sql

CREATE TABLE IF NOT EXISTS mentor_connections (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, mentor_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic        VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMPTZ  NOT NULL,
  duration_min INTEGER      DEFAULT 60,
  type         VARCHAR(30)  CHECK (type IN ('video','voice','in_person')),
  status       VARCHAR(20)  DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
  notes        TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_student_id   ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id    ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status       ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_mentor_connections_student ON mentor_connections(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_connections_mentor  ON mentor_connections(mentor_id);