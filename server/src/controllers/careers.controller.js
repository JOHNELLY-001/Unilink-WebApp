// ============================================================
// careers.controller.js
// ============================================================
import sql from '../db.js'
import { mapCareer } from '../utils/mappers.js'

export async function getCareers(req, res, next) {
  try {
    const { field, search } = req.query
    const rows = await sql`
      SELECT * FROM careers
      WHERE (${field  || null}::text IS NULL OR field ILIKE ${field  || ''})
        AND (${search || null}::text IS NULL OR title ILIKE ${'%' + (search || '') + '%'})
      ORDER BY title ASC
    `
    res.json({ success: true, careers: rows.map(mapCareer) })
  } catch (err) { next(err) }
}

export async function getCareerById(req, res, next) {
  try {
    const [row] = await sql`SELECT * FROM careers WHERE id = ${req.params.id} LIMIT 1`
    if (!row) return res.status(404).json({ success: false, message: 'Career not found.' })
    res.json({ success: true, career: mapCareer(row) })
  } catch (err) { next(err) }
}

export async function recordCareerView(req, res, next) {
  try {
    await sql`
      INSERT INTO career_views (user_id, career_id)
      VALUES (${req.user.id}, ${req.params.id})
      ON CONFLICT (user_id, career_id) DO NOTHING
    `
    res.json({ success: true })
  } catch (err) { next(err) }
}
