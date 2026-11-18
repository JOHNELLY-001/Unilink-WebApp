import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import {
  getSessions,
  getUpcomingSession,
  getUpcomingSessions,
  createSession,
  updateSession,
  cancelSession,
} from '../controllers/sessions.controller.js'

const router = Router()

router.get(   '/',              authenticate, getSessions)
router.get(   '/upcoming',      authenticate, getUpcomingSession)
router.get(   '/upcoming/all',  authenticate, requireRole('mentor'), getUpcomingSessions)
router.post(  '/',              authenticate, requireRole('mentor'), createSession)
router.patch( '/:id',           authenticate, updateSession)
router.delete('/:id',           authenticate, cancelSession)

export default router