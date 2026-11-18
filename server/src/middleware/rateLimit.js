import rateLimit from 'express-rate-limit'

// General API limiter — generous, protects against runaway clients
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,               // requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

// Strict limiter for auth endpoints — slows brute-force attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,                // auth attempts per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true, // don't punish successful logins
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
})
