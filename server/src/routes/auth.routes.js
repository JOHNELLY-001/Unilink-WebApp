import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { validate } from '../middleware/validate.js'
import {
  registerSchema, loginSchema, googleAuthSchema,
  studentOnboardingSchema, mentorOnboardingSchema,
} from '../validation/auth.schema.js'
import { register, login, googleAuth, logout, getMe, refreshToken, studentOnboarding, mentorOnboarding } from '../controllers/auth.controller.js'

const router = Router()
router.post('/register',           authLimiter, validate(registerSchema),        register)
router.post('/login',              authLimiter, validate(loginSchema),           login)
router.post('/google',             authLimiter, validate(googleAuthSchema),      googleAuth)
router.post('/logout',             authenticate, logout)
router.get( '/me',                 authenticate, getMe)
router.post('/refresh',            authLimiter, refreshToken)
router.post('/onboarding/student', authenticate, validate(studentOnboardingSchema), studentOnboarding)
router.post('/onboarding/mentor',  authenticate, validate(mentorOnboardingSchema),  mentorOnboarding)
export default router
