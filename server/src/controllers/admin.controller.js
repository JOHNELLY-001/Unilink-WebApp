import sql from '../db.js'
import { deleteFile } from '../services/cloudinary.service.js'
import { uploadToCloudinary } from '../middleware/upload.js'

// ── STATS ──
export async function getAdminStats(req, res, next) {
  try {
    const [
      [users], [students], [mentors], [pending],
      [posts], [opps], [sessions]
    ] = await Promise.all([
      sql`SELECT COUNT(*) AS count FROM users`,
      sql`SELECT COUNT(*) AS count FROM users WHERE role = 'student'`,
      sql`SELECT COUNT(*) AS count FROM users u JOIN mentor_profiles mp ON mp.user_id = u.id WHERE mp.approval_status = 'approved'`,
      sql`SELECT COUNT(*) AS count FROM mentor_profiles WHERE approval_status = 'pending'`,
      sql`SELECT COUNT(*) AS count FROM community_posts`,
      sql`SELECT COUNT(*) AS count FROM opportunities WHERE deadline >= CURRENT_DATE`,
      sql`SELECT COUNT(*) AS count FROM sessions WHERE status = 'completed'`,
    ])

    res.json({
      success: true,
      stats: {
        totalUsers:       parseInt(users.count),
        totalStudents:    parseInt(students.count),
        activeMentors:    parseInt(mentors.count),
        pendingApprovals: parseInt(pending.count),
        communityPosts:   parseInt(posts.count),
        activeOpps:       parseInt(opps.count),
        sessionsCompleted:parseInt(sessions.count),
      },
    })
  } catch (err) { next(err) }
}

// ── PENDING MENTORS ──
export async function getPendingMentors(req, res, next) {
  try {
    const rows = await sql`
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.avatar_url, u.created_at,
        mp.title, mp.company, mp.field, mp.bio,
        mp.linkedin_url, mp.mentoring_areas, mp.years_experience,
        mp.session_type, mp.availability
      FROM mentor_profiles mp
      JOIN users u ON u.id = mp.user_id
      WHERE mp.approval_status = 'pending'
      ORDER BY u.created_at ASC
    `
    const mentors = rows.map(r => ({
      id:             r.id,
      firstName:      r.first_name,
      lastName:       r.last_name,
      email:          r.email,
      avatarUrl:      r.avatar_url,
      createdAt:      r.created_at,
      title:          r.title,
      company:        r.company,
      field:          r.field,
      bio:            r.bio,
      linkedinUrl:    r.linkedin_url,
      mentoringAreas: r.mentoring_areas,
      yearsExperience:r.years_experience,
      sessionType:    r.session_type,
      availability:   r.availability,
    }))
    res.json({ success: true, mentors })
  } catch (err) { next(err) }
}

export async function approveMentor(req, res, next) {
  try {
    await sql`
      UPDATE mentor_profiles SET
        approval_status = 'approved',
        approved_at     = NOW(),
        approved_by     = ${req.user.id},
        updated_at      = NOW()
      WHERE user_id = ${req.params.id}
    `
    res.json({ success: true, message: 'Mentor approved.' })
  } catch (err) { next(err) }
}

export async function rejectMentor(req, res, next) {
  try {
    await sql`
      UPDATE mentor_profiles SET
        approval_status = 'rejected',
        updated_at      = NOW()
      WHERE user_id = ${req.params.id}
    `
    res.json({ success: true, message: 'Mentor rejected.' })
  } catch (err) { next(err) }
}

// ── USERS ──
export async function getAllUsers(req, res, next) {
  try {
    const { role, search } = req.query
    const rows = await sql`
      SELECT id, first_name, last_name, email, role, avatar_url, is_active, created_at
      FROM users
      WHERE (${role   || null}::text IS NULL OR role ILIKE ${role   || ''})
        AND (${search || null}::text IS NULL
             OR first_name || ' ' || last_name ILIKE ${'%' + (search || '') + '%'}
             OR email ILIKE ${'%' + (search || '') + '%'})
      ORDER BY created_at DESC
      LIMIT 100
    `
    const users = rows.map(r => ({
      id:        r.id,
      firstName: r.first_name,
      lastName:  r.last_name,
      email:     r.email,
      role:      r.role,
      avatarUrl: r.avatar_url,
      isActive:  r.is_active,
      createdAt: r.created_at,
    }))
    res.json({ success: true, users })
  } catch (err) { next(err) }
}

export async function toggleUserActive(req, res, next) {
  try {
    const rows = await sql`
      UPDATE users SET is_active = NOT is_active, updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING id, is_active
    `
    res.json({ success: true, isActive: rows[0]?.is_active })
  } catch (err) { next(err) }
}

// ── CAREERS CRUD ──
export async function adminGetCareers(req, res, next) {
  try {
    const rows = await sql`SELECT * FROM careers ORDER BY title ASC`
    res.json({ success: true, careers: rows })
  } catch (err) { next(err) }
}

export async function adminCreateCareer(req, res, next) {
  try {
    const {
      icon, title, field, combinations, salaryMin, salaryMax,
      demandLevel, duration, universities, description, skills,
    } = req.body

    if (!icon || !title || !field) {
      return res.status(400).json({ success: false, message: 'icon, title and field are required.' })
    }

    const rows = await sql`
      INSERT INTO careers
        (icon, title, field, combinations, salary_min, salary_max,
         demand_level, duration, universities, description, skills, created_by)
      VALUES
        (${icon}, ${title}, ${field}, ${combinations || []},
         ${salaryMin || null}, ${salaryMax || null}, ${demandLevel || null},
         ${duration || null}, ${universities || []},
         ${description || null}, ${skills || []}, ${req.user.id})
      RETURNING *
    `
    res.status(201).json({ success: true, career: rows[0] })
  } catch (err) { next(err) }
}

export async function adminUpdateCareer(req, res, next) {
  try {
    const b = req.body
    const rows = await sql`
      UPDATE careers SET
        icon         = COALESCE(${b.icon         || null}, icon),
        title        = COALESCE(${b.title        || null}, title),
        field        = COALESCE(${b.field        || null}, field),
        combinations = COALESCE(${b.combinations || null}, combinations),
        salary_min   = COALESCE(${b.salaryMin    || null}, salary_min),
        salary_max   = COALESCE(${b.salaryMax    || null}, salary_max),
        demand_level = COALESCE(${b.demandLevel  || null}, demand_level),
        duration     = COALESCE(${b.duration     || null}, duration),
        universities = COALESCE(${b.universities || null}, universities),
        description  = COALESCE(${b.description  || null}, description),
        skills       = COALESCE(${b.skills       || null}, skills),
        updated_at   = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Career not found.' })
    res.json({ success: true, career: rows[0] })
  } catch (err) { next(err) }
}

export async function adminDeleteCareer(req, res, next) {
  try {
    await sql`DELETE FROM careers WHERE id = ${req.params.id}`
    res.json({ success: true, message: 'Career deleted.' })
  } catch (err) { next(err) }
}

// ── OPPORTUNITIES CRUD ──
export async function adminGetOpportunities(req, res, next) {
  try {
    const rows = await sql`SELECT * FROM opportunities ORDER BY deadline ASC`
    res.json({ success: true, opportunities: rows })
  } catch (err) { next(err) }
}

export async function adminCreateOpportunity(req, res, next) {
  try {
    const { icon, title, org, description, deadline, type, field, requirements, link } = req.body

    if (!title || !org || !deadline || !type) {
      return res.status(400).json({ success: false, message: 'title, org, deadline and type are required.' })
    }

    const rows = await sql`
      INSERT INTO opportunities
        (icon, title, org, description, deadline, type, field, requirements, link, created_by)
      VALUES
        (${icon || '📋'}, ${title}, ${org}, ${description || null}, ${deadline},
         ${type}, ${field || 'All Fields'}, ${requirements || []}, ${link || null}, ${req.user.id})
      RETURNING *
    `
    res.status(201).json({ success: true, opportunity: rows[0] })
  } catch (err) { next(err) }
}

export async function adminUpdateOpportunity(req, res, next) {
  try {
    const b = req.body
    const rows = await sql`
      UPDATE opportunities SET
        icon         = COALESCE(${b.icon        || null}, icon),
        title        = COALESCE(${b.title       || null}, title),
        org          = COALESCE(${b.org         || null}, org),
        description  = COALESCE(${b.description || null}, description),
        deadline     = COALESCE(${b.deadline    || null}::date, deadline),
        type         = COALESCE(${b.type        || null}, type),
        field        = COALESCE(${b.field       || null}, field),
        requirements = COALESCE(${b.requirements|| null}, requirements),
        link         = COALESCE(${b.link        || null}, link),
        updated_at   = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Opportunity not found.' })
    res.json({ success: true, opportunity: rows[0] })
  } catch (err) { next(err) }
}

export async function adminDeleteOpportunity(req, res, next) {
  try {
    await sql`DELETE FROM opportunities WHERE id = ${req.params.id}`
    res.json({ success: true, message: 'Opportunity deleted.' })
  } catch (err) { next(err) }
}

// ── RESOURCES CRUD ──
export async function adminGetResources(req, res, next) {
  try {
    const rows = await sql`SELECT * FROM resources ORDER BY created_at DESC`
    res.json({ success: true, resources: rows })
  } catch (err) { next(err) }
}

export async function adminCreateResource(req, res, next) {
  try {
    const {
      icon, title, description, type, category,
      externalUrl, sizeMb: sizeMbFromForm, durationMin, readTimeMin,
    } = req.body

    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'title and type are required.' })
    }

    // Upload file buffer to Cloudinary (multer uses memoryStorage)
    let fileUrl = null
    let filePublicId = null
    let sizeMb = sizeMbFromForm || null
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'unilink/resources')
      fileUrl      = uploaded.url
      filePublicId = uploaded.publicId
      if (!sizeMb) sizeMb = Math.round((req.file.size / 1024 / 1024) * 100) / 100
    }

    const rows = await sql`
      INSERT INTO resources
        (icon, title, description, type, category, file_url, file_public_id,
         external_url, size_mb, duration_min, read_time_min, created_by)
      VALUES
        (${icon || '📄'}, ${title}, ${description || null},
         ${type.toLowerCase()}, ${category || null},
         ${fileUrl}, ${filePublicId},
         ${externalUrl || null}, ${sizeMb || null},
         ${durationMin || null}, ${readTimeMin || null}, ${req.user.id})
      RETURNING *
    `
    res.status(201).json({ success: true, resource: rows[0] })
  } catch (err) { next(err) }
}

export async function adminUpdateResource(req, res, next) {
  try {
    const b = req.body
    const rows = await sql`
      UPDATE resources SET
        icon         = COALESCE(${b.icon        || null}, icon),
        title        = COALESCE(${b.title       || null}, title),
        description  = COALESCE(${b.description || null}, description),
        category     = COALESCE(${b.category    || null}, category),
        external_url = COALESCE(${b.externalUrl || null}, external_url),
        updated_at   = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Resource not found.' })
    res.json({ success: true, resource: rows[0] })
  } catch (err) { next(err) }
}

export async function adminDeleteResource(req, res, next) {
  try {
    const rows = await sql`SELECT file_public_id FROM resources WHERE id = ${req.params.id} LIMIT 1`
    if (rows[0]?.file_public_id) await deleteFile(rows[0].file_public_id)
    await sql`DELETE FROM resources WHERE id = ${req.params.id}`
    res.json({ success: true, message: 'Resource deleted.' })
  } catch (err) { next(err) }
}

// ── COMMUNITY MODERATION ──
export async function adminGetPosts(req, res, next) {
  try {
    const rows = await sql`
      SELECT
        p.id, p.body, p.category, p.created_at,
        u.first_name, u.last_name, u.role,
        COUNT(DISTINCT pl.id) AS likes,
        COUNT(DISTINCT pr.id) AS replies
      FROM community_posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN post_likes   pl ON pl.post_id = p.id
      LEFT JOIN post_replies pr ON pr.post_id = p.id
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `
    const posts = rows.map(r => ({
      id:        r.id,
      body:      r.body,
      category:  r.category,
      createdAt: r.created_at,
      firstName: r.first_name,
      lastName:  r.last_name,
      role:      r.role,
      likes:     parseInt(r.likes)   || 0,
      replies:   parseInt(r.replies) || 0,
    }))
    res.json({ success: true, posts })
  } catch (err) { next(err) }
}

export async function adminDeletePost(req, res, next) {
  try {
    await sql`DELETE FROM community_posts WHERE id = ${req.params.id}`
    res.json({ success: true, message: 'Post deleted.' })
  } catch (err) { next(err) }
}