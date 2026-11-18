import { calculateProgress } from '../services/progress.service.js'

// GET /api/v1/progress
export async function getProgress(req, res, next) {
  try {
    const progress = await calculateProgress(req.user.id)
    res.json({ success: true, progress })
  } catch (err) {
    next(err)
  }
}