import sql from '../db.js'

function toSession(s) {
  return {
    id:                s.id,
    topic:             s.topic,
    scheduledAt:       s.scheduled_at,
    durationMin:       s.duration_min,
    type:              s.type,
    status:            s.status,
    notes:             s.notes,
    createdAt:         s.created_at,
    studentId:         s.student_id,
    mentorId:          s.mentor_id,
    studentFirstName:  s.student_first_name,
    studentLastName:   s.student_last_name,
    studentAvatar:     s.student_avatar,
    mentorFirstName:   s.mentor_first_name,
    mentorLastName:    s.mentor_last_name,
    mentorAvatar:      s.mentor_avatar,
    mentorTitle:       s.mentor_title,
    mentorCompany:     s.mentor_company,
  }
}

// GET /api/v1/sessions
export async function getSessions(req, res, next) {
  try {
    const userId = req.user.id
    const ismentor = req.user.role === 'mentor'

    const rows = await sql`
      SELECT
        s.*,
        student.first_name  AS student_first_name,
        student.last_name   AS student_last_name,
        student.avatar_url  AS student_avatar,
        mentor.first_name   AS mentor_first_name,
        mentor.last_name    AS mentor_last_name,
        mentor.avatar_url   AS mentor_avatar,
        mp.title            AS mentor_title,
        mp.company          AS mentor_company
      FROM sessions s
      JOIN users student      ON student.id  = s.student_id
      JOIN users mentor       ON mentor.id   = s.mentor_id
      JOIN mentor_profiles mp ON mp.user_id  = s.mentor_id
      WHERE ${ismentor ? sql`s.mentor_id = ${userId}` : sql`s.student_id = ${userId}`}
      ORDER BY s.scheduled_at DESC
    `

    res.json({ success: true, sessions: rows.map(toSession) })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/sessions/upcoming
export async function getUpcomingSession(req, res, next) {
  try {
    const userId   = req.user.id
    const ismentor = req.user.role === 'mentor'

    const rows = await sql`
      SELECT
        s.*,
        student.first_name  AS student_first_name,
        student.last_name   AS student_last_name,
        student.avatar_url  AS student_avatar,
        mentor.first_name   AS mentor_first_name,
        mentor.last_name    AS mentor_last_name,
        mentor.avatar_url   AS mentor_avatar,
        mp.title            AS mentor_title,
        mp.company          AS mentor_company
      FROM sessions s
      JOIN users student      ON student.id  = s.student_id
      JOIN users mentor       ON mentor.id   = s.mentor_id
      JOIN mentor_profiles mp ON mp.user_id  = s.mentor_id
      WHERE ${ismentor ? sql`s.mentor_id = ${userId}` : sql`s.student_id = ${userId}`}
        AND s.status     = 'upcoming'
        AND s.scheduled_at > NOW()
      ORDER BY s.scheduled_at ASC
      LIMIT 1
    `

    res.json({ success: true, session: rows[0] ? toSession(rows[0]) : null })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/sessions/upcoming/all  ← mentor: all upcoming sessions
export async function getUpcomingSessions(req, res, next) {
  try {
    const mentorId = req.user.id

    const rows = await sql`
      SELECT
        s.*,
        student.first_name AS student_first_name,
        student.last_name  AS student_last_name,
        student.avatar_url AS student_avatar,
        mentor.first_name  AS mentor_first_name,
        mentor.last_name   AS mentor_last_name,
        mentor.avatar_url  AS mentor_avatar,
        mp.title           AS mentor_title,
        mp.company         AS mentor_company
      FROM sessions s
      JOIN users student      ON student.id  = s.student_id
      JOIN users mentor       ON mentor.id   = s.mentor_id
      JOIN mentor_profiles mp ON mp.user_id  = s.mentor_id
      WHERE s.mentor_id    = ${mentorId}
        AND s.status       = 'upcoming'
        AND s.scheduled_at > NOW()
      ORDER BY s.scheduled_at ASC
    `

    res.json({ success: true, sessions: rows.map(toSession) })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/sessions  ← mentor proposes a session to a student
export async function createSession(req, res, next) {
  try {
    const { studentId, topic, scheduledAt, durationMin, type } = req.body
    const mentorId = req.user.id

    if (!studentId || !topic || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'studentId, topic and scheduledAt are required.',
      })
    }

    // Confirm accepted connection exists
    const conn = await sql`
      SELECT id FROM mentor_connections
      WHERE mentor_id  = ${mentorId}
        AND student_id = ${studentId}
        AND status     = 'accepted'
      LIMIT 1
    `
    if (conn.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You can only propose sessions to accepted connections.',
      })
    }

    const rows = await sql`
      INSERT INTO sessions
        (student_id, mentor_id, topic, scheduled_at, duration_min, type)
      VALUES
        (${studentId}, ${mentorId}, ${topic},
         ${scheduledAt}, ${durationMin || 60}, ${type || 'video'})
      RETURNING *
    `

    res.status(201).json({ success: true, session: toSession(rows[0]) })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/v1/sessions/:id
export async function updateSession(req, res, next) {
  try {
    const { status, scheduledAt, notes } = req.body
    const userId = req.user.id

    const rows = await sql`
      UPDATE sessions SET
        status       = COALESCE(${status      || null}, status),
        scheduled_at = COALESCE(${scheduledAt || null}::timestamptz, scheduled_at),
        notes        = COALESCE(${notes       || null}, notes),
        updated_at   = NOW()
      WHERE id = ${req.params.id}
        AND (student_id = ${userId} OR mentor_id = ${userId})
      RETURNING *
    `

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found.' })
    }

    res.json({ success: true, session: toSession(rows[0]) })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/sessions/:id
export async function cancelSession(req, res, next) {
  try {
    const userId = req.user.id

    const rows = await sql`
      UPDATE sessions SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${req.params.id}
        AND (student_id = ${userId} OR mentor_id = ${userId})
      RETURNING id
    `

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found.' })
    }

    res.json({ success: true, message: 'Session cancelled.' })
  } catch (err) {
    next(err)
  }
}