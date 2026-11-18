import app from './app.js'
import sql from './db.js'
import { env } from './config/env.js'

// ── NEON KEEP-ALIVE ──
// Pings the DB every 4 minutes to prevent Neon free tier from suspending
// Only runs in development — in production Render keeps the server warm
if (env.NODE_ENV === 'development') {
  setInterval(async () => {
    try {
      await sql`SELECT 1`
      console.log('[keep-alive] DB ping OK')
    } catch (err) {
      console.warn('[keep-alive] DB ping failed:', err.message)
    }
  }, 4 * 60 * 1000) // every 4 minutes
}

app.listen(env.PORT, () => {
  console.log(`🚀 UniLink server running on port ${env.PORT} [${env.NODE_ENV}]`)
})

export default app
