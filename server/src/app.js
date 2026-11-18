import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'

const app = express()

// Trust the first proxy (Render / Vercel / Nginx) so req.ip is the real client IP
app.set('trust proxy', 1)

// ── SECURITY ──
app.use(helmet({
  // COOP is set by the frontend's Vercel config (same-origin-allow-popups)
  // so Google Identity Services can use postMessage. The API doesn't need it.
  crossOriginOpenerPolicy: false,
}))

// ── CORS ──
// CLIENT_URL may be a comma-separated list (production domain, preview URLs, etc.)
// Trailing slashes are stripped — CORS origin matching is exact-string.
const allowedOrigins = env.CLIENT_URL
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean)

console.log('[CORS] Allowed origins:', allowedOrigins)

app.use(cors({
  origin: allowedOrigins,
  credentials:    true,
  methods:        ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── BODY PARSING ──
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── LOGGING ──
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── HEALTH CHECK ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, timestamp: new Date().toISOString() })
})

// ── API ROUTES ──
app.use('/api/v1', apiLimiter, routes)

// ── 404 + ERROR HANDLERS ──
app.use(notFound)
app.use(errorHandler)

export default app
