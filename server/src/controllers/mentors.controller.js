import sql from '../db.js'
import { mapMentorListItem, mapMentorDetail, mapMentorConnection } from '../utils/mappers.js'

// ── GET ALL MENTORS ──
export async function getMentors(req, res, next) {
  try {
    const { field, search } = req.query

    const rows = await sql`
      SELECT
        u.id, u.first_name, u.last_name, u.avatar_url,
        mp.title, mp.company, mp.field, mp.mentoring_areas,
        mp.session_type, mp.availability, mp.bio,
        COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') AS sessions,
        EXISTS (
          SELECT 1 FROM sessions s2
          WHERE s2.mentor_id = u.id AND s2.status = 'upcoming'
        ) AS is_busy
      FROM users u
      JOIN mentor_profiles mp ON mp.user_id = u.id
      LEFT JOIN sessions s ON s.mentor_id = u.id
      WHERE mp.approval_status = 'approved'
        AND u.is_active = true
        AND (${field  || null}::text IS NULL OR mp.field ILIKE ${field  || ''})
        AND (${search || null}::text IS NULL
             OR u.first_name || ' ' || u.last_name ILIKE ${'%' + (search || '') + '%'}
             OR mp.field ILIKE ${'%' + (search || '') + '%'}
             OR ${search || ''}::text = ANY(mp.mentoring_areas))
      GROUP BY u.id, mp.id
      ORDER BY sessions DESC, u.created_at DESC
    `

    res.json({ success: true, mentors: rows.map(mapMentorListItem) })
  } catch (err) {
    next(err)
  }
}

// ── GET MENTOR BY ID ──
export async function getMentorById(req, res, next) {
  try {
    const { id } = req.params

    const [row] = await sql`
      SELECT
        u.id, u.first_name, u.last_name, u.avatar_url,
        mp.title, mp.company, mp.field, mp.mentoring_areas,
        mp.session_type, mp.availability, mp.hours_per_month,
        mp.bio, mp.linkedin_url, mp.portfolio_url,
        COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') AS sessions
      FROM users u
      JOIN mentor_profiles mp ON mp.user_id = u.id
      LEFT JOIN sessions s ON s.mentor_id = u.id
      WHERE u.id = ${id} AND mp.approval_status = 'approved'
      GROUP BY u.id, mp.id
      LIMIT 1
    `

    if (!row) return res.status(404).json({ success: false, message: 'Mentor not found.' })

    res.json({ success: true, mentor: mapMentorDetail(row) })
  } catch (err) {
    next(err)
  }
}

// ── SEND CONNECTION REQUEST ──
export async function connectWithMentor(req, res, next) {
  try {
    const studentId = req.user.id
    const mentorId  = req.params.id

    if (studentId === mentorId) {
      return res.status(400).json({ success: false, message: 'You cannot connect with yourself.' })
    }

    // Check mentor exists and is approved
    const [mentor] = await sql`
      SELECT u.id FROM users u
      JOIN mentor_profiles mp ON mp.user_id = u.id
      WHERE u.id = ${mentorId} AND mp.approval_status = 'approved'
      LIMIT 1
    `
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found.' })

    // Check existing connection
    const [existing] = await sql`
      SELECT id, status FROM mentor_connections
      WHERE student_id = ${studentId} AND mentor_id = ${mentorId}
      LIMIT 1
    `
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Connection request already ${existing.status}.`,
      })
    }

    await sql`
      INSERT INTO mentor_connections (student_id, mentor_id, status)
      VALUES (${studentId}, ${mentorId}, 'pending')
    `

    res.status(201).json({ success: true, message: 'Connection request sent.' })
  } catch (err) {
    next(err)
  }
}

// ── GET MY CONNECTIONS ──
export async function getMyConnections(req, res, next) {
  try {
    const userId = req.user.id

    const rows = await sql`
      SELECT
        mc.id, mc.status, mc.created_at,
        u.id AS mentor_id, u.first_name, u.last_name, u.avatar_url,
        mp.title, mp.company, mp.field
      FROM mentor_connections mc
      JOIN users u           ON u.id = mc.mentor_id
      JOIN mentor_profiles mp ON mp.user_id = u.id
      WHERE mc.student_id = ${userId}
      ORDER BY mc.created_at DESC
    `

    res.json({ success: true, connections: rows.map(mapMentorConnection) })
  } catch (err) {
    next(err)
  }
}
