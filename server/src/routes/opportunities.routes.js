import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getOpportunities, getOpportunityById, saveOpportunity, unsaveOpportunity, getSavedOpportunities } from '../controllers/opportunities.controller.js'

const router = Router()
router.get(   '/',         authenticate, getOpportunities)
router.get(   '/saved',    authenticate, getSavedOpportunities)
router.get(   '/:id',      authenticate, getOpportunityById)
router.post(  '/:id/save', authenticate, saveOpportunity)
router.delete('/:id/save', authenticate, unsaveOpportunity)
export default router