import { env } from '../config/env.js'

// Postgres error code → client-friendly response
const PG_ERRORS = {
  '22P02': { status: 400, message: 'Invalid parameter.' },            // invalid uuid / syntax
  '23502': { status: 400, message: 'Missing required field.' },       // not-null violation
  '23503': { status: 400, message: 'Referenced record not found.' },  // FK violation
  '23505': { status: 409, message: 'Resource already exists.' },      // unique violation
}

export function errorHandler(err, req, res, next) {
  const isDev      = env.NODE_ENV === 'development'
  let statusCode   = err.statusCode || err.status || 500
  let message      = err.message || 'Internal Server Error'

  // Map known Postgres errors to safe, accurate responses
  const pg = PG_ERRORS[err.code]
  if (pg) {
    statusCode = pg.status
    message    = pg.message
  }

  // Multer upload errors (file too large, wrong type, etc.)
  if (err.name === 'MulterError') {
    statusCode = 400
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File is too large.'
      : 'File upload failed.'
  }

  // Log everything on the server
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err)

  // Never leak internals to clients in production
  if (statusCode >= 500 && !isDev) {
    message = 'Internal Server Error'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  })
}
