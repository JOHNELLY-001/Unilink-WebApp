-- 008_add_google_auth.sql
-- Adds Google sign-in support to the users table (safe to run multiple times).

-- 1. google_id column — Google's unique `sub` identifier.
--    NULL for users registered with email/password.
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);

-- 2. Replace the non-unique index from 001_create_users.sql with a unique one.
--    (Plain unique index: Postgres allows multiple NULLs, so email-only users are unaffected.)
DROP INDEX IF EXISTS idx_users_google_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id_unique ON users(google_id);

-- 3. Speed up email lookups — /auth/google matches users by
--    `google_id = X OR email = Y` to link Google sign-in to existing accounts.
CREATE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);

-- 4. avatar_public_id — used to delete the old avatar from Cloudinary
--    when a user replaces their profile photo.
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_public_id TEXT;
