import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import { uploadResource } from '../middleware/upload.js'
import {
  getAdminStats,
  getPendingMentors, approveMentor, rejectMentor,
  getAllUsers, toggleUserActive,
  adminGetCareers, adminCreateCareer, adminUpdateCareer, adminDeleteCareer,
  adminGetOpportunities, adminCreateOpportunity, adminUpdateOpportunity, adminDeleteOpportunity,
  adminGetResources, adminCreateResource, adminUpdateResource, adminDeleteResource,
  adminGetPosts, adminDeletePost,
} from '../controllers/admin.controller.js'

const router = Router()

// All admin routes require auth + admin role
router.use(authenticate, requireRole('admin'))

// Stats
router.get('/stats',                    getAdminStats)

// Mentor approvals
router.get('/mentors/pending',          getPendingMentors)
router.post('/mentors/:id/approve',     approveMentor)
router.post('/mentors/:id/reject',      rejectMentor)

// Users
router.get('/users',                    getAllUsers)
router.patch('/users/:id/toggle',       toggleUserActive)

// Careers
router.get('/careers',                  adminGetCareers)
router.post('/careers',                 adminCreateCareer)
router.patch('/careers/:id',            adminUpdateCareer)
router.delete('/careers/:id',           adminDeleteCareer)

// Opportunities
router.get('/opportunities',            adminGetOpportunities)
router.post('/opportunities',           adminCreateOpportunity)
router.patch('/opportunities/:id',      adminUpdateOpportunity)
router.delete('/opportunities/:id',     adminDeleteOpportunity)

// Resources
router.get('/resources',                adminGetResources)
router.post('/resources', uploadResource.single('file'), adminCreateResource)
router.patch('/resources/:id',          adminUpdateResource)
router.delete('/resources/:id',         adminDeleteResource)

// Community moderation
router.get('/community/posts',          adminGetPosts)
router.delete('/community/:id',         adminDeletePost)

export default router