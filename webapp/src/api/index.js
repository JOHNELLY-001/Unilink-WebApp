import axios from 'axios'

// In production, default to the relative /api/v1 path so requests go through
// the Vercel rewrite proxy (same-origin) — this keeps auth cookies first-party
// and avoids cross-site cookie blocking by browsers.
// In development, default to the local backend.
const defaultBase = import.meta.env.PROD
  ? '/api/v1'
  : 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_BASE_URL || defaultBase,
  timeout:         15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── SESSION EXPIRY HOOK ──
// The auth store registers a callback here so the interceptor can clear
// the user state without creating a circular import.
let onSessionExpired = null
export function setSessionExpiredHandler(fn) { onSessionExpired = fn }

// ── 401 REFRESH INTERCEPTOR ──
// When any request fails with 401 (expired access token), silently call
// /auth/refresh once, then retry the original request. Concurrent requests
// share a single refresh call. Never retries auth endpoints themselves.
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status   = error.response?.status
    const url      = original?.url || ''

    // Network errors, non-401s, or already-retried requests — propagate
    if (!status || status !== 401 || !original || original._retried) {
      return Promise.reject(error)
    }

    // Don't try to refresh on auth endpoints — prevents loops
    const authEndpoints = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/google', '/auth/logout']
    if (authEndpoints.some((e) => url.includes(e))) {
      return Promise.reject(error)
    }

    // Single-flight: share one refresh call across concurrent 401s
    original._retried = true
    try {
      refreshPromise = refreshPromise || api.post('/auth/refresh')
      await refreshPromise
      refreshPromise = null
      return api(original)   // retry the original request with the new token
    } catch (refreshErr) {
      refreshPromise = null
      // Refresh failed — session is truly over
      if (onSessionExpired) onSessionExpired()
      return Promise.reject(refreshErr)
    }
  }
)

export default api
