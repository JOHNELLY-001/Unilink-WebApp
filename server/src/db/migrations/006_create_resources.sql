-- 006_create_resources.sql

CREATE TABLE IF NOT EXISTS resources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon            VARCHAR(10)  NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  type            VARCHAR(20)  NOT NULL CHECK (type IN ('pdf','video','article')),
  category        VARCHAR(100),
  file_url        TEXT,
  file_public_id  TEXT,
  external_url    TEXT,
  size_mb         NUMERIC(6,2),
  duration_min    INTEGER,
  read_time_min   INTEGER,
  download_count  INTEGER DEFAULT 0,
  view_count      INTEGER DEFAULT 0,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_views (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_resources_type     ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);