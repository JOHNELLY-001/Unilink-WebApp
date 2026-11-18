import sql from '../db.js'

// ── GET FULL USER WITH PROFILE ──
export async function getUserById(userId) {
  const [user] = await sql`
    SELECT
      u.id, u.first_name, u.last_name, u.email, u.phone,
      u.role, u.avatar_url, u.onboarding_complete, u.created_at,
      -- Student fields
      sp.school, sp.form, sp.region, sp.combination,
      sp.career_interests, sp.target_universities, sp.goals, sp.bio AS student_bio,
      -- Mentor fields
      mp.title, mp.company, mp.field, mp.years_experience,
      mp.mentoring_areas, mp.session_type, mp.availability,
      mp.hours_per_month, mp.bio AS mentor_bio,
      mp.linkedin_url, mp.portfolio_url, mp.approval_status
    FROM users u
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    LEFT JOIN mentor_profiles  mp ON mp.user_id = u.id
    WHERE u.id = ${userId}
    LIMIT 1
  `
  return user || null
}

// ── CHECK IF EMAIL EXISTS ──
export async function emailExists(email) {
  const [row] = await sql`
    SELECT id FROM users WHERE email = ${email} LIMIT 1
  `
  return !!row
}

// ── GET USER BY EMAIL ──
export async function getUserByEmail(email) {
  const [user] = await sql`
    SELECT id, first_name, last_name, email, phone, role,
           password_hash, avatar_url, onboarding_complete, is_active, google_id
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `
  return user || null
}

// ── GET USER BY GOOGLE ID ──
export async function getUserByGoogleId(googleId) {
  const [user] = await sql`
    SELECT id, first_name, last_name, email, role,
           avatar_url, onboarding_complete
    FROM users
    WHERE google_id = ${googleId}
    LIMIT 1
  `
  return user || null
}

// ── UPDATE USER AVATAR ──
export async function updateUserAvatar(userId, avatarUrl, avatarPublicId) {
  await sql`
    UPDATE users SET
      avatar_url       = ${avatarUrl},
      avatar_public_id = ${avatarPublicId},
      updated_at       = NOW()
    WHERE id = ${userId}
  `
}

// ── GET USER AVATAR PUBLIC ID (for deletion) ──
export async function getUserAvatarPublicId(userId) {
  const [row] = await sql`
    SELECT avatar_public_id FROM users WHERE id = ${userId} LIMIT 1
  `
  return row?.avatarPublicId || null
}

// ── MARK ONBOARDING COMPLETE ──
export async function markOnboardingComplete(userId) {
  await sql`
    UPDATE users SET onboarding_complete = true, updated_at = NOW()
    WHERE id = ${userId}
  `
}

// ── DEACTIVATE USER ──
export async function deactivateUser(userId) {
  await sql`
    UPDATE users SET is_active = false, updated_at = NOW()
    WHERE id = ${userId}
  `
}