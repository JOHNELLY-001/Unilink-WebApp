import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setSessionExpiredHandler } from '../api/index.js'
import {
  login as apiLogin,
  register as apiRegister,
  loginWithGoogle as apiGoogleLogin,
  logout as apiLogout,
  getMe,
  completeStudentOnboarding,
  completeMentorOnboarding,
} from '../api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  // ── STATE ──
  const user    = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  // Track whether we've already tried restoring the session this page load,
  // so we don't hammer /auth/me on every navigation when logged out.
  const sessionRestoreAttempted = ref(false)

  // Called by the axios interceptor when the refresh token is also invalid —
  // the session is truly over, so clear the user (next nav redirects to login).
  setSessionExpiredHandler(() => {
    user.value = null
  })

  // ── COMPUTED ──
  const isAuthenticated   = computed(() => !!user.value)
  const role              = computed(() => user.value?.role || null)
  const isStudent         = computed(() => role.value === 'student')
  const isMentor          = computed(() => role.value === 'mentor')
  const isAdmin           = computed(() => role.value === 'admin')
  const onboardingComplete= computed(() => user.value?.onboardingComplete || false)
  const pendingApproval   = computed(() => user.value?.approvalStatus === 'pending')
  const fullName          = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )
  const initials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase()
  })

  // ── HELPERS ──
  function clearError() { error.value = null }

  // ── ACTIONS ──
  async function login(credentials) {
    loading.value = true
    error.value   = null
    try {
      const data = await apiLogin(credentials)
      user.value  = data.user
      return { success: true }
    } catch (err) {
      error.value = err?.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value   = null
    try {
      const data = await apiRegister(payload)
      user.value  = data.user
      return { success: true }
    } catch (err) {
      error.value = err?.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(idToken, roleIfNew) {
    loading.value = true
    error.value   = null
    try {
      const data = await apiGoogleLogin({ idToken, role: roleIfNew })
      user.value  = data.user
      return { success: true }
    } catch (err) {
      error.value = err?.response?.data?.message || 'Google sign-in failed.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await apiLogout()
    } finally {
      user.value = null
      sessionRestoreAttempted.value = true   // session is gone; don't re-restore
      loading.value = false
    }
  }

  // Called on app load / protected navigation — restores session from httpOnly cookie
  async function restoreSession() {
    if (user.value) return true
    if (sessionRestoreAttempted.value) return false
    sessionRestoreAttempted.value = true
    loading.value = true
    try {
      const data = await getMe()   // ← use getMe() which is already imported
      user.value = data.user
      return true
    } catch {
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  async function finishStudentOnboarding(payload) {
    loading.value = true
    error.value   = null
    try {
      await completeStudentOnboarding(payload)
      // Refresh user from server so onboardingComplete is updated
      const data = await getMe()
      user.value  = { ...user.value, ...data.user, onboardingComplete: true }
      return { success: true }
    } catch (err) {
      error.value = err?.response?.data?.message || 'Failed to save onboarding data.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function finishMentorOnboarding(payload) {
    loading.value = true
    error.value   = null
    try {
      await completeMentorOnboarding(payload)
      const data = await getMe()
      user.value  = { ...user.value, ...data.user, onboardingComplete: true }
      return { success: true }
    } catch (err) {
      error.value = err?.response?.data?.message || 'Failed to save onboarding data.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    user, loading, error,
    isAuthenticated, role, isStudent, isMentor, isAdmin,
    onboardingComplete, pendingApproval, fullName, initials,
    login, register, loginWithGoogle, logout,
    restoreSession, finishStudentOnboarding, finishMentorOnboarding,
    clearError,
  }
})