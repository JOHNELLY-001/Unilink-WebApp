import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/requireRole.js'
import {
  getPosts, createPost, deletePost,
  likePost, unlikePost,
  getReplies, createReply,
} from '../controllers/community.controller.js'

const router = Router()

// All authenticated users can read, like, and reply
router.get(   '/posts',               authenticate, getPosts)
router.post(  '/posts/:id/like',      authenticate, likePost)
router.delete('/posts/:id/like',      authenticate, unlikePost)
router.get(   '/posts/:id/replies',   authenticate, getReplies)
router.post(  '/posts/:id/replies',   authenticate, createReply)

// Only mentors and admins can create posts
router.post(  '/posts',               authenticate, requireRole('mentor', 'admin'), createPost)

// Only post owner or admin can delete
router.delete('/posts/:id',           authenticate, deletePost)

export default router