import sql from '../db.js'
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  storeRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  hashPassword,
  comparePassword,
  verifyGoogleToken,
} from '../services/auth.service.js'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// ── HELPER: snake_case row → camelCase object ──
function toUser(row) {
  if (!row) return null
  return {
    id:                 row.id,
    firstName:          row.first_name,
    lastName:           row.last_name,
    email:              row.email,
    phone:              row.phone,
    role:               row.role,
    avatarUrl:          row.avatar_url,
    onboardingComplete: row.onboarding_complete,
    googleId:           row.google_id,
    isActive:           row.is_active,
    createdAt:          row.created_at,
    // Student profile fields
    school:             row.school,
    form:               row.form,
    region:             row.region,
    combination:        row.combination,
    careerInterests:    row.career_interests,
    targetUniversities: row.target_universities,
    goals:              row.goals,
    bio:                row.bio,
    // Mentor profile fields
    title:              row.title,
    company:            row.company,
    field:              row.field,
    yearsExperience:    row.years_experience,
    mentoringAreas:     row.mentoring_areas,
    sessionType:        row.session_type,
    availability:       row.availability,
    hoursPerMonth:      row.hours_per_month,
    linkedinUrl:        row.linkedin_url,
    portfolioUrl:       row.portfolio_url,
    approvalStatus:     row.approval_status,
  }
}

// ── REGISTER ──
export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }
    if (!['student', 'mentor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const passwordHash = await hashPassword(password)

    const rows = await sql`
      INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone || null}, ${passwordHash}, ${role})
      RETURNING id, first_name, last_name, email, phone, role, avatar_url, onboarding_complete, created_at
    `
    const user = rows[0]

    const accessToken  = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)
    await storeRefreshToken(user.id, refreshToken)
    setAuthCookies(res, accessToken, refreshToken)

    res.status(201).json({ success: true, user: toUser(user) })
  } catch (err) {
    next(err)
  }
}

// ── LOGIN ──
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const rows = await sql`
      SELECT id, first_name, last_name, email, phone, role, password_hash,
             avatar_url, onboarding_complete, is_active
      FROM users WHERE email = ${email} LIMIT 1
    `
    const user = rows[0]

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    if (!user.password_hash) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in.' })
    }

    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const accessToken  = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)
    await storeRefreshToken(user.id, refreshToken)
    setAuthCookies(res, accessToken, refreshToken)

    res.json({ success: true, user: toUser(user) })
  } catch (err) {
    next(err)
  }
}

// ── GOOGLE AUTH ──
export async function googleAuth(req, res, next) {
  try {
    const { idToken, role } = req.body

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google ID token is required.' })
    }

    const googleUser = await verifyGoogleToken(idToken)

    let rows = await sql`
      SELECT id, first_name, last_name, email, role, avatar_url, onboarding_complete
      FROM users WHERE google_id = ${googleUser.googleId} OR email = ${googleUser.email}
      LIMIT 1
    `
    let user = rows[0]

    if (!user) {
      if (!role || !['student', 'mentor'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Role is required for new Google sign-ups.' })
      }
      rows = await sql`
        INSERT INTO users (first_name, last_name, email, google_id, avatar_url, role, onboarding_complete)
        VALUES (${googleUser.firstName}, ${googleUser.lastName}, ${googleUser.email},
                ${googleUser.googleId}, ${googleUser.avatarUrl}, ${role}, false)
        RETURNING id, first_name, last_name, email, role, avatar_url, onboarding_complete
      `
      user = rows[0]
    } else {
      await sql`
        UPDATE users SET google_id = ${googleUser.googleId}, updated_at = NOW()
        WHERE id = ${user.id} AND google_id IS NULL
      `
    }

    const accessToken  = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)
    await storeRefreshToken(user.id, refreshToken)
    setAuthCookies(res, accessToken, refreshToken)

    res.json({ success: true, user: toUser(user) })
  } catch (err) {
    next(err)
  }
}

// ── LOGOUT ──
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.refresh_token
    if (refreshToken) await deleteRefreshToken(refreshToken)
    clearAuthCookies(res)
    res.json({ success: true, message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
}

// ── GET ME ──
export async function getMe(req, res, next) {
  try {
    const userId = req.user.id

    const rows = await sql`
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.phone, u.role,
        u.avatar_url, u.onboarding_complete, u.created_at,
        sp.school, sp.form, sp.region, sp.combination,
        sp.career_interests, sp.target_universities, sp.goals, sp.bio,
        mp.title, mp.company, mp.field, mp.years_experience,
        mp.mentoring_areas, mp.session_type, mp.availability,
        mp.hours_per_month, mp.linkedin_url, mp.portfolio_url,
        mp.approval_status
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN mentor_profiles  mp ON mp.user_id = u.id
      WHERE u.id = ${userId}
      LIMIT 1
    `
    const user = rows[0]
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    res.json({ success: true, user: toUser(user) })
  } catch (err) {
    next(err)
  }
}

// ── REFRESH TOKEN ──
export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refresh_token
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' })
    }

    const stored = await verifyRefreshToken(token)
    if (!stored) {
      return res.status(401).json({ success: false, message: 'Refresh token not recognised.' })
    }

    const rows = await sql`SELECT id, role FROM users WHERE id = ${decoded.userId} LIMIT 1`
    const user = rows[0]
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' })

    await deleteRefreshToken(token)
    const newAccessToken  = generateAccessToken(user.id, user.role)
    const newRefreshToken = generateRefreshToken(user.id)
    await storeRefreshToken(user.id, newRefreshToken)
    setAuthCookies(res, newAccessToken, newRefreshToken)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// ── STUDENT ONBOARDING ──
export async function studentOnboarding(req, res, next) {
  try {
    const userId = req.user.id
    const { school, form, region, combination, careerInterests, targetUniversities, goals, bio } = req.body

    await sql`
      INSERT INTO student_profiles
        (user_id, school, form, region, combination, career_interests, target_universities, goals, bio)
      VALUES
        (${userId}, ${school || null}, ${form || null}, ${region || null}, ${combination || null},
         ${careerInterests || []}, ${targetUniversities || []}, ${goals || null}, ${bio || null})
      ON CONFLICT (user_id) DO UPDATE SET
        school               = EXCLUDED.school,
        form                 = EXCLUDED.form,
        region               = EXCLUDED.region,
        combination          = EXCLUDED.combination,
        career_interests     = EXCLUDED.career_interests,
        target_universities  = EXCLUDED.target_universities,
        goals                = EXCLUDED.goals,
        bio                  = EXCLUDED.bio,
        updated_at           = NOW()
    `

    await sql`
      UPDATE users SET onboarding_complete = true, updated_at = NOW()
      WHERE id = ${userId}
    `

    res.json({ success: true, message: 'Onboarding complete.' })
  } catch (err) {
    next(err)
  }
}

// ── MENTOR ONBOARDING ──
export async function mentorOnboarding(req, res, next) {
  try {
    const userId = req.user.id
    const {
      title, company, field, yearsExperience,
      mentoringAreas, sessionType, availability,
      hoursPerMonth, bio, linkedIn, portfolio,
    } = req.body

    await sql`
      INSERT INTO mentor_profiles
        (user_id, title, company, field, years_experience, mentoring_areas,
         session_type, availability, hours_per_month, bio, linkedin_url, portfolio_url)
      VALUES
        (${userId}, ${title || null}, ${company || null}, ${field || null},
         ${yearsExperience || null}, ${mentoringAreas || []},
         ${sessionType || null}, ${availability || null}, ${hoursPerMonth || null},
         ${bio || null}, ${linkedIn || null}, ${portfolio || null})
      ON CONFLICT (user_id) DO UPDATE SET
        title            = EXCLUDED.title,
        company          = EXCLUDED.company,
        field            = EXCLUDED.field,
        years_experience = EXCLUDED.years_experience,
        mentoring_areas  = EXCLUDED.mentoring_areas,
        session_type     = EXCLUDED.session_type,
        availability     = EXCLUDED.availability,
        hours_per_month  = EXCLUDED.hours_per_month,
        bio              = EXCLUDED.bio,
        linkedin_url     = EXCLUDED.linkedin_url,
        portfolio_url    = EXCLUDED.portfolio_url,
        updated_at       = NOW()
    `

    await sql`
      UPDATE users SET onboarding_complete = true, updated_at = NOW()
      WHERE id = ${userId}
    `

    res.json({ success: true, message: 'Profile submitted for review.', pendingApproval: true })
  } catch (err) {
    next(err)
  }
}