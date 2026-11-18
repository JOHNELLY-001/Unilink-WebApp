import { Router } from 'express'
import authRoutes          from './auth.routes.js'
import usersRoutes         from './users.routes.js'
import mentorsRoutes       from './mentors.routes.js'
import connectionsRoutes   from './connections.routes.js'
import careersRoutes       from './careers.routes.js'
import opportunitiesRoutes from './opportunities.routes.js'
import communityRoutes     from './community.routes.js'
import resourcesRoutes     from './resources.routes.js'
import progressRoutes      from './progress.routes.js'
import sessionsRoutes      from './sessions.routes.js'
import adminRoutes         from './admin.routes.js'

const router = Router()

router.use('/auth',          authRoutes)
router.use('/users',         usersRoutes)
router.use('/mentors',       mentorsRoutes)
router.use('/connections',   connectionsRoutes)
router.use('/careers',       careersRoutes)
router.use('/opportunities', opportunitiesRoutes)
router.use('/community',     communityRoutes)
router.use('/resources',     resourcesRoutes)
router.use('/progress',      progressRoutes)
router.use('/sessions',      sessionsRoutes)
router.use('/admin',         adminRoutes)

export default router