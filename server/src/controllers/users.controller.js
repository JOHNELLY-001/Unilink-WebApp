import sql from '../db.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js'

// ── GET PROFILE ──
export async function getProfile(req, res, next) {
  try {
    const rows = await sql`
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.phone,
        u.role, u.avatar_url, u.onboarding_complete, u.created_at,
        sp.school, sp.form, sp.region, sp.combination,
        sp.career_interests, sp.target_universities, sp.goals, sp.bio AS student_bio,
        mp.title, mp.company, mp.field, mp.years_experience,
        mp.mentoring_areas, mp.session_type, mp.availability,
        mp.hours_per_month, mp.bio AS mentor_bio,
        mp.linkedin_url, mp.portfolio_url, mp.approval_status
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN mentor_profiles  mp ON mp.user_id = u.id
      WHERE u.id = ${req.user.id}
      LIMIT 1
    `
    const user = rows[0]
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    res.json({ success: true, user: mapUser(user) })
  } catch (err) {
    next(err)
  }
}

// ── UPDATE PROFILE ──
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id
    const {
      firstName, lastName, phone, bio,
      school, form, region, combination, careerInterests, targetUniversities, goals,
      title, company, field, yearsExperience, mentoringAreas,
      sessionType, availability, hoursPerMonth, linkedIn, portfolio,
    } = req.body

    await sql`
      UPDATE users SET
        first_name = COALESCE(${firstName || null}, first_name),
        last_name  = COALESCE(${lastName  || null}, last_name),
        phone      = COALESCE(${phone     || null}, phone),
        updated_at = NOW()
      WHERE id = ${userId}
    `

    if (req.user.role === 'student') {
      await sql`
        UPDATE student_profiles SET
          school              = COALESCE(${school             || null}, school),
          form                = COALESCE(${form               || null}, form),
          region              = COALESCE(${region             || null}, region),
          combination         = COALESCE(${combination        || null}, combination),
          career_interests    = COALESCE(${careerInterests    || null}, career_interests),
          target_universities = COALESCE(${targetUniversities || null}, target_universities),
          goals               = COALESCE(${goals              || null}, goals),
          bio                 = COALESCE(${bio                || null}, bio),
          updated_at          = NOW()
        WHERE user_id = ${userId}
      `
    } else if (req.user.role === 'mentor') {
      await sql`
        UPDATE mentor_profiles SET
          title            = COALESCE(${title           || null}, title),
          company          = COALESCE(${company         || null}, company),
          field            = COALESCE(${field           || null}, field),
          years_experience = COALESCE(${yearsExperience || null}, years_experience),
          mentoring_areas  = COALESCE(${mentoringAreas  || null}, mentoring_areas),
          session_type     = COALESCE(${sessionType     || null}, session_type),
          availability     = COALESCE(${availability    || null}, availability),
          hours_per_month  = COALESCE(${hoursPerMonth   || null}, hours_per_month),
          bio              = COALESCE(${bio              || null}, bio),
          linkedin_url     = COALESCE(${linkedIn        || null}, linkedin_url),
          portfolio_url    = COALESCE(${portfolio       || null}, portfolio_url),
          updated_at       = NOW()
        WHERE user_id = ${userId}
      `
    }

    res.json({ success: true, message: 'Profile updated.' })
  } catch (err) {
    next(err)
  }
}

// ── UPLOAD AVATAR ──
export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' })
    }

    // Delete old avatar from Cloudinary if exists
    const existing = await sql`
      SELECT avatar_public_id FROM users WHERE id = ${req.user.id} LIMIT 1
    `
    if (existing[0]?.avatar_public_id) {
      await deleteFromCloudinary(existing[0].avatar_public_id)
    }

    // Upload new avatar
    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      'unilink/avatars',
      { transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }] }
    )

    await sql`
      UPDATE users SET
        avatar_url       = ${url},
        avatar_public_id = ${publicId},
        updated_at       = NOW()
      WHERE id = ${req.user.id}
    `

    res.json({ success: true, avatarUrl: url })
  } catch (err) {
    next(err)
  }
}

// ── HELPER ──
function mapUser(r) {
  return {
    id:                 r.id,
    firstName:          r.first_name,
    lastName:           r.last_name,
    email:              r.email,
    phone:              r.phone,
    role:               r.role,
    avatarUrl:          r.avatar_url,
    onboardingComplete: r.onboarding_complete,
    createdAt:          r.created_at,
    school:             r.school,
    form:               r.form,
    region:             r.region,
    combination:        r.combination,
    careerInterests:    r.career_interests,
    targetUniversities: r.target_universities,
    goals:              r.goals,
    bio:                r.student_bio || r.mentor_bio,
    title:              r.title,
    company:            r.company,
    field:              r.field,
    yearsExperience:    r.years_experience,
    mentoringAreas:     r.mentoring_areas,
    sessionType:        r.session_type,
    availability:       r.availability,
    hoursPerMonth:      r.hours_per_month,
    linkedinUrl:        r.linkedin_url,
    portfolioUrl:       r.portfolio_url,
    approvalStatus:     r.approval_status,
  }
}