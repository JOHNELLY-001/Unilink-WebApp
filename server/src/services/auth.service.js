import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env.js'
import sql from '../db.js'

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

// ── TOKEN GENERATION ──
export function generateAccessToken(userId, role) {
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES })
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES })
}

// ── COOKIE HELPERS ──
export function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = env.NODE_ENV === 'production'

  // Access token — 15 minutes
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge:   15 * 60 * 1000,
  })

  // Refresh token — 7 days
  // ⚠️  NO path restriction — browser must send it on every request
  //     so the interceptor can silently refresh expired access tokens
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
}

// ── REFRESH TOKEN STORAGE ──
export async function storeRefreshToken(userId, token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await sql`
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt})
  `
}

export async function verifyRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const rows = await sql`
    SELECT * FROM refresh_tokens
    WHERE token_hash = ${tokenHash} AND expires_at > NOW()
    LIMIT 1
  `
  return rows[0] || null
}

export async function deleteRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  await sql`DELETE FROM refresh_tokens WHERE token_hash = ${tokenHash}`
}

export async function deleteAllRefreshTokens(userId) {
  await sql`DELETE FROM refresh_tokens WHERE user_id = ${userId}`
}

// ── PASSWORD HELPERS ──
export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// ── GOOGLE TOKEN VERIFICATION ──
export async function verifyGoogleToken(idToken) {
  const ticket  = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID })
  const payload = ticket.getPayload()
  return {
    googleId:  payload.sub,
    email:     payload.email,
    firstName: payload.given_name,
    lastName:  payload.family_name,
    avatarUrl: payload.picture,
  }
}