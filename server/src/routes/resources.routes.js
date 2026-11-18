import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getResources, getResourceById, recordResourceView } from '../controllers/resources.controller.js'

const router = Router()
router.get( '/',         authenticate, getResources)
router.get( '/:id',      authenticate, getResourceById)
router.post('/:id/view', authenticate, recordResourceView)
export default router