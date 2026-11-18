import sql from '../db.js'

// ── GET ALL APPROVED MENTORS ──
export async function getApprovedMentors({ field = '', search = '' } = {}) {
  const mentors = await sql`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.avatar_url,
      mp.title,
      mp.company,
      mp.field,
      mp.mentoring_areas,
      mp.session_type,
      mp.availability,
      mp.bio,
      COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') AS sessions,
      NOT EXISTS (
        SELECT 1 FROM sessions s2
        WHERE s2.mentor_id = u.id AND s2.status = 'upcoming'
          AND s2.scheduled_at > NOW()
      ) AS available
    FROM users u
    JOIN mentor_profiles mp ON mp.user_id = u.id
    LEFT JOIN sessions s    ON s.mentor_id = u.id
    WHERE mp.approval_status = 'approved'
      AND u.is_active = true
      AND (
        ${field || null}::text IS NULL
        OR mp.field ILIKE ${field || ''}
      )
      AND (
        ${search || null}::text IS NULL
        OR u.first_name || ' ' || u.last_name ILIKE ${'%' + (search || '') + '%'}
        OR mp.field ILIKE ${'%' + (search || '') + '%'}
        OR ${search || ''}::text = ANY(mp.mentoring_areas)
      )
    GROUP BY u.id, mp.id
    ORDER BY sessions DESC, u.created_at DESC
  `
  return mentors
}

// ── GET SINGLE MENTOR BY ID ──
export async function getMentorById(mentorId) {
  const [mentor] = await sql`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.avatar_url,
      mp.title,
      mp.company,
      mp.field,
      mp.mentoring_areas,
      mp.session_type,
      mp.availability,
      mp.hours_per_month,
      mp.bio,
      mp.linkedin_url,
      mp.portfolio_url,
      COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') AS sessions
    FROM users u
    JOIN mentor_profiles mp ON mp.user_id = u.id
    LEFT JOIN sessions s    ON s.mentor_id = u.id
    WHERE u.id = ${mentorId}
      AND mp.approval_status = 'approved'
    GROUP BY u.id, mp.id
    LIMIT 1
  `
  return mentor || null
}

// ── GET DISTINCT MENTOR FIELDS ──
export async function getMentorFields() {
  const rows = await sql`
    SELECT DISTINCT field FROM mentor_profiles
    WHERE approval_status = 'approved' AND field IS NOT NULL
    ORDER BY field ASC
  `
  return ['All Fields', ...rows.map(r => r.field)]
}

// ── CHECK IF CONNECTION EXISTS ──
export async function connectionExists(studentId, mentorId) {
  const [row] = await sql`
    SELECT id, status FROM mentor_connections
    WHERE student_id = ${studentId} AND mentor_id = ${mentorId}
    LIMIT 1
  `
  return row || null
}

// ── CREATE CONNECTION REQUEST ──
export async function createConnection(studentId, mentorId) {
  const [connection] = await sql`
    INSERT INTO mentor_connections (student_id, mentor_id, status)
    VALUES (${studentId}, ${mentorId}, 'pending')
    RETURNING *
  `
  return connection
}

// ── GET STUDENT CONNECTIONS ──
export async function getStudentConnections(studentId) {
  const connections = await sql`
    SELECT
      mc.id,
      mc.status,
      mc.created_at,
      u.id        AS mentor_id,
      u.first_name,
      u.last_name,
      u.avatar_url,
      mp.title,
      mp.company,
      mp.field
    FROM mentor_connections mc
    JOIN users u            ON u.id  = mc.mentor_id
    JOIN mentor_profiles mp ON mp.user_id = u.id
    WHERE mc.student_id = ${studentId}
    ORDER BY mc.created_at DESC
  `
  return connections
}

// ── GET RECOMMENDED MENTORS FOR DASHBOARD ──
// Returns top 3 approved mentors matching student's career interests
export async function getRecommendedMentors(careerInterests = [], limit = 3) {
  const mentors = await sql`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.avatar_url,
      mp.title,
      mp.company,
      mp.field,
      mp.mentoring_areas,
      mp.session_type,
      COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') AS sessions
    FROM users u
    JOIN mentor_profiles mp ON mp.user_id = u.id
    LEFT JOIN sessions s    ON s.mentor_id = u.id
    WHERE mp.approval_status = 'approved'
      AND u.is_active = true
    GROUP BY u.id, mp.id
    ORDER BY sessions DESC
    LIMIT ${limit}
  `
  return mentors
}