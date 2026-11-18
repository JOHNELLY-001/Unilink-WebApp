import sql from '../db.js'

// ── HELPER ──
function toUser(row) {
  if (!row) return null
  return {
    id:              row.id,
    firstName:       row.first_name,
    lastName:        row.last_name,
    email:           row.email,
    avatarUrl:       row.avatar_url,
    school:          row.school,
    form:            row.form,
    region:          row.region,
    combination:     row.combination,
    careerInterests: row.career_interests,
    targetUniversities: row.target_universities,
    goals:           row.goals,
    bio:             row.bio,
  }
}

// ── GET INCOMING PENDING REQUESTS (mentor) ──
// GET /api/v1/connections/requests
export async function getPendingRequests(req, res, next) {
  try {
    const mentorId = req.user.id

    const rows = await sql`
      SELECT
        mc.id         AS connection_id,
        mc.status,
        mc.created_at,
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar_url,
        sp.school,
        sp.form,
        sp.region,
        sp.combination,
        sp.career_interests,
        sp.target_universities,
        sp.goals,
        sp.bio
      FROM mentor_connections mc
      JOIN users u ON u.id = mc.student_id
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      WHERE mc.mentor_id = ${mentorId}
        AND mc.status = 'pending'
      ORDER BY mc.created_at DESC
    `

    const requests = rows.map(r => ({
      connectionId: r.connection_id,
      status:       r.status,
      createdAt:    r.created_at,
      student:      toUser(r),
    }))

    res.json({ success: true, requests })
  } catch (err) {
    next(err)
  }
}

// ── GET ALL ACCEPTED STUDENTS (mentor) ──
// GET /api/v1/connections/students
export async function getMyStudents(req, res, next) {
  try {
    const mentorId = req.user.id

    const rows = await sql`
      SELECT
        mc.id         AS connection_id,
        mc.created_at AS connected_at,
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar_url,
        sp.school,
        sp.form,
        sp.region,
        sp.combination,
        sp.career_interests,
        sp.target_universities,
        sp.goals,
        sp.bio
      FROM mentor_connections mc
      JOIN users u ON u.id = mc.student_id
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      WHERE mc.mentor_id = ${mentorId}
        AND mc.status = 'accepted'
      ORDER BY mc.created_at DESC
    `

    const students = rows.map(r => ({
      connectionId: r.connection_id,
      connectedAt:  r.connected_at,
      student:      toUser(r),
    }))

    res.json({ success: true, students })
  } catch (err) {
    next(err)
  }
}

// ── ACCEPT CONNECTION REQUEST (mentor) ──
// POST /api/v1/connections/:id/accept
export async function acceptRequest(req, res, next) {
  try {
    const mentorId     = req.user.id
    const connectionId = req.params.id

    const rows = await sql`
      UPDATE mentor_connections
      SET status = 'accepted'
      WHERE id = ${connectionId}
        AND mentor_id = ${mentorId}
        AND status = 'pending'
      RETURNING *
    `

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found or already handled.',
      })
    }

    res.json({ success: true, message: 'Connection accepted.' })
  } catch (err) {
    next(err)
  }
}

// ── DECLINE CONNECTION REQUEST (mentor) ──
// POST /api/v1/connections/:id/decline
export async function declineRequest(req, res, next) {
  try {
    const mentorId     = req.user.id
    const connectionId = req.params.id

    const rows = await sql`
      UPDATE mentor_connections
      SET status = 'declined'
      WHERE id = ${connectionId}
        AND mentor_id = ${mentorId}
        AND status = 'pending'
      RETURNING *
    `

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found or already handled.',
      })
    }

    res.json({ success: true, message: 'Connection declined.' })
  } catch (err) {
    next(err)
  }
}

// ── GET MY CONNECTIONS (student) ──
// GET /api/v1/connections
export async function getMyConnections(req, res, next) {
  try {
    const studentId = req.user.id

    const rows = await sql`
      SELECT
        mc.id         AS connection_id,
        mc.status,
        mc.created_at,
        u.id,
        u.first_name,
        u.last_name,
        u.avatar_url,
        mp.title,
        mp.company,
        mp.field,
        mp.mentoring_areas,
        mp.session_type
      FROM mentor_connections mc
      JOIN users u ON u.id = mc.mentor_id
      LEFT JOIN mentor_profiles mp ON mp.user_id = u.id
      WHERE mc.student_id = ${studentId}
      ORDER BY mc.created_at DESC
    `

    const connections = rows.map(r => ({
      connectionId: r.connection_id,
      status:       r.status,
      createdAt:    r.created_at,
      mentor: {
        id:             r.id,
        firstName:      r.first_name,
        lastName:       r.last_name,
        avatarUrl:      r.avatar_url,
        title:          r.title,
        company:        r.company,
        field:          r.field,
        mentoringAreas: r.mentoring_areas,
        sessionType:    r.session_type,
      },
    }))

    res.json({ success: true, connections })
  } catch (err) {
    next(err)
  }
}