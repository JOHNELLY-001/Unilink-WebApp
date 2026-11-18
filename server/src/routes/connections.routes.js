import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import {
  getPendingRequests,
  getMyStudents,
  acceptRequest,
  declineRequest,
  getMyConnections,
} from '../controllers/connections.controller.js'

const router = Router()

// Student routes
router.get( '/',                authenticate, requireRole('student'), getMyConnections)

// Mentor routes
router.get( '/requests',        authenticate, requireRole('mentor'), getPendingRequests)
router.get( '/students',        authenticate, requireRole('mentor'), getMyStudents)
router.post('/:id/accept',      authenticate, requireRole('mentor'), acceptRequest)
router.post('/:id/decline',     authenticate, requireRole('mentor'), declineRequest)

export default router