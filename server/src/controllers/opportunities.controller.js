import sql from '../db.js'
import { mapOpportunity } from '../utils/mappers.js'

export async function getOpportunities(req, res, next) {
  try {
    const { type, field, search } = req.query
    const userId = req.user.id

    const rows = await sql`
      SELECT
        o.*,
        o.deadline::date                                      AS deadline,
        (o.deadline::date - CURRENT_DATE)                    AS days_left,
        EXISTS (
          SELECT 1 FROM saved_opportunities so
          WHERE so.opportunity_id = o.id AND so.user_id = ${userId}
        ) AS saved
      FROM opportunities o
      WHERE (${type   || null}::text IS NULL OR o.type  ILIKE ${type   || ''})
        AND (${field  || null}::text IS NULL OR o.field ILIKE ${field  || ''} OR o.field = 'All Fields')
        AND (${search || null}::text IS NULL
             OR o.title ILIKE ${'%' + (search || '') + '%'}
             OR o.org   ILIKE ${'%' + (search || '') + '%'})
      ORDER BY o.deadline ASC
    `

    res.json({ success: true, opportunities: rows.map(mapOpportunity) })
  } catch (err) { next(err) }
}

export async function getOpportunityById(req, res, next) {
  try {
    const [opp] = await sql`SELECT * FROM opportunities WHERE id = ${req.params.id} LIMIT 1`
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' })
    res.json({ success: true, opportunity: mapOpportunity(opp) })
  } catch (err) { next(err) }
}

export async function saveOpportunity(req, res, next) {
  try {
    await sql`
      INSERT INTO saved_opportunities (user_id, opportunity_id)
      VALUES (${req.user.id}, ${req.params.id})
      ON CONFLICT (user_id, opportunity_id) DO NOTHING
    `
    res.status(201).json({ success: true, message: 'Opportunity saved.' })
  } catch (err) { next(err) }
}

export async function unsaveOpportunity(req, res, next) {
  try {
    await sql`
      DELETE FROM saved_opportunities
      WHERE user_id = ${req.user.id} AND opportunity_id = ${req.params.id}
    `
    res.json({ success: true, message: 'Opportunity removed from saved.' })
  } catch (err) { next(err) }
}

export async function getSavedOpportunities(req, res, next) {
  try {
    const rows = await sql`
      SELECT o.*, (o.deadline::date - CURRENT_DATE) AS days_left, true AS saved
      FROM saved_opportunities so
      JOIN opportunities o ON o.id = so.opportunity_id
      WHERE so.user_id = ${req.user.id}
      ORDER BY o.deadline ASC
    `
    res.json({ success: true, opportunities: rows.map(mapOpportunity) })
  } catch (err) { next(err) }
}
