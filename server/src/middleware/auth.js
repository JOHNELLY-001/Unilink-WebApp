import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import sql from '../db.js'

export async function authenticate(req, res, next) {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired.' })
      }
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }

    const rows = await sql`
      SELECT id, email, role, first_name, last_name, onboarding_complete
      FROM users
      WHERE id = ${decoded.userId}
      LIMIT 1
    `
    const user = rows[0]

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' })
    }

    // Attach with camelCase keys so controllers can use req.user.firstName etc.
    req.user = {
      id:                 user.id,
      email:              user.email,
      role:               user.role,
      firstName:          user.first_name,
      lastName:           user.last_name,
      onboardingComplete: user.onboarding_complete,
    }

    next()
  } catch (err) {
    next(err)
  }
}