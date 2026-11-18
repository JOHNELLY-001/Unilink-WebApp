import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getCareers, getCareerById, recordCareerView } from '../controllers/careers.controller.js'

const router = Router()
router.get( '/',         authenticate, getCareers)
router.get( '/:id',      authenticate, getCareerById)
router.post('/:id/view', authenticate, recordCareerView)
export default router