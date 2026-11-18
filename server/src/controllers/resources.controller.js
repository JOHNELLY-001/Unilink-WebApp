import sql from '../db.js'
import { mapResource } from '../utils/mappers.js'

// GET /api/v1/resources
export async function getResources(req, res, next) {
  try {
    const { category, type, search } = req.query
    const rows = await sql`
      SELECT * FROM resources
      WHERE (${category || null}::text IS NULL OR category = ${category || ''})
        AND (${type     || null}::text IS NULL OR type     = ${type     || ''})
        AND (${search   || null}::text IS NULL OR title ILIKE ${'%' + (search || '') + '%'})
      ORDER BY created_at DESC
    `
    res.json({ success: true, resources: rows.map(mapResource) })
  } catch (err) { next(err) }
}

// GET /api/v1/resources/:id
export async function getResourceById(req, res, next) {
  try {
    const [row] = await sql`SELECT * FROM resources WHERE id = ${req.params.id} LIMIT 1`
    if (!row) return res.status(404).json({ success: false, message: 'Resource not found.' })
    res.json({ success: true, resource: mapResource(row) })
  } catch (err) { next(err) }
}

// POST /api/v1/resources/:id/view
export async function recordResourceView(req, res, next) {
  try {
    await sql`
      INSERT INTO resource_views (user_id, resource_id)
      VALUES (${req.user.id}, ${req.params.id})
      ON CONFLICT (user_id, resource_id) DO NOTHING
    `
    await sql`
      UPDATE resources SET view_count = view_count + 1, updated_at = NOW()
      WHERE id = ${req.params.id}
    `
    res.json({ success: true })
  } catch (err) { next(err) }
}
