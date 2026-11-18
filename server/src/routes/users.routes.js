import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { uploadAvatar as multerUpload } from '../middleware/upload.js'
import { getProfile, updateProfile, uploadAvatar } from '../controllers/users.controller.js'

const router = Router()
router.get(  '/profile', authenticate, getProfile)
router.patch('/profile', authenticate, updateProfile)
router.post( '/avatar',  authenticate, multerUpload.single('avatar'), uploadAvatar)
export default router