import sql from '../db.js'
import { mapPost, mapReply } from '../utils/mappers.js'

export async function getPosts(req, res, next) {
  try {
    const { category } = req.query
    const userId = req.user.id

    const rows = await sql`
      SELECT
        p.id, p.body, p.category, p.created_at,
        u.id AS user_id, u.first_name, u.last_name, u.avatar_url,
        COUNT(DISTINCT pl.id)  AS likes,
        COUNT(DISTINCT pr.id)  AS replies,
        EXISTS (
          SELECT 1 FROM post_likes pl2
          WHERE pl2.post_id = p.id AND pl2.user_id = ${userId}
        ) AS liked
      FROM community_posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN post_likes   pl ON pl.post_id = p.id
      LEFT JOIN post_replies pr ON pr.post_id = p.id
      WHERE (${category || null}::text IS NULL OR p.category = ${category || ''})
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `

    res.json({ success: true, posts: rows.map(mapPost) })
  } catch (err) { next(err) }
}

export async function createPost(req, res, next) {
  try {
    const { body, category } = req.body
    if (!body?.trim()) {
      return res.status(400).json({ success: false, message: 'Post body is required.' })
    }

    const [post] = await sql`
      INSERT INTO community_posts (user_id, body, category)
      VALUES (${req.user.id}, ${body.trim()}, ${category || 'General'})
      RETURNING *
    `

    res.status(201).json({ success: true, post })
  } catch (err) { next(err) }
}

export async function deletePost(req, res, next) {
  try {
    const [post] = await sql`
      SELECT id, user_id FROM community_posts WHERE id = ${req.params.id} LIMIT 1
    `
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    await sql`DELETE FROM community_posts WHERE id = ${req.params.id}`
    res.json({ success: true, message: 'Post deleted.' })
  } catch (err) { next(err) }
}

export async function likePost(req, res, next) {
  try {
    await sql`
      INSERT INTO post_likes (user_id, post_id)
      VALUES (${req.user.id}, ${req.params.id})
      ON CONFLICT (user_id, post_id) DO NOTHING
    `
    res.status(201).json({ success: true })
  } catch (err) { next(err) }
}

export async function unlikePost(req, res, next) {
  try {
    await sql`
      DELETE FROM post_likes WHERE user_id = ${req.user.id} AND post_id = ${req.params.id}
    `
    res.json({ success: true })
  } catch (err) { next(err) }
}

export async function getReplies(req, res, next) {
  try {
    const rows = await sql`
      SELECT pr.*, u.first_name, u.last_name, u.avatar_url
      FROM post_replies pr
      JOIN users u ON u.id = pr.user_id
      WHERE pr.post_id = ${req.params.id}
      ORDER BY pr.created_at ASC
    `
    res.json({ success: true, replies: rows.map(mapReply) })
  } catch (err) { next(err) }
}

export async function createReply(req, res, next) {
  try {
    const { body } = req.body
    if (!body?.trim()) {
      return res.status(400).json({ success: false, message: 'Reply body is required.' })
    }

    const [reply] = await sql`
      INSERT INTO post_replies (user_id, post_id, body)
      VALUES (${req.user.id}, ${req.params.id}, ${body.trim()})
      RETURNING *
    `
    res.status(201).json({ success: true, reply })
  } catch (err) { next(err) }
}
