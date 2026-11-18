import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import { getMentors, getMentorById, connectWithMentor, getMyConnections } from '../controllers/mentors.controller.js'

const router = Router()
router.get( '/',             authenticate, getMentors)
router.get( '/connections',  authenticate, requireRole('student'), getMyConnections)
router.get( '/:id',          authenticate, getMentorById)
router.post('/:id/connect',  authenticate, requireRole('student'), connectWithMentor)
export default router