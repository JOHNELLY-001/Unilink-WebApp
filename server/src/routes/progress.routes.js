import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import { getProgress } from '../controllers/progress.controller.js'

const router = Router()
router.get('/', authenticate, requireRole('student'), getProgress)
export default router