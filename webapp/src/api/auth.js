import api from './index.js'

// ── LOGIN ──
export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data // { success, user }
}

// ── REGISTER ──
export async function register({ firstName, lastName, email, phone, password, role }) {
  const { data } = await api.post('/auth/register', { firstName, lastName, email, phone, password, role })
  return data // { success, user }
}

// ── GOOGLE AUTH ──
export async function loginWithGoogle({ idToken, role } = {}) {
  const { data } = await api.post('/auth/google', { idToken, role })
  return data // { success, user }
}

// ── LOGOUT ──
export async function logout() {
  const { data } = await api.post('/auth/logout')
  return data
}

// ── GET CURRENT USER ──
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data // { success, user }
}

// ── STUDENT ONBOARDING ──
export async function completeStudentOnboarding(payload) {
  const { data } = await api.post('/auth/onboarding/student', payload)
  return data
}

// ── MENTOR ONBOARDING ──
export async function completeMentorOnboarding(payload) {
  const { data } = await api.post('/auth/onboarding/mentor', payload)
  return data
}