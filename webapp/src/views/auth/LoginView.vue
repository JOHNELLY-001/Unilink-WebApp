<template>
  <div class="auth-card">
    <div class="ac-head">
      <h2 class="ac-title">Welcome back</h2>
      <p class="ac-sub">Log in to your UniLink account</p>
    </div>

    <!-- Error -->
    <div class="ac-error" v-if="auth.error">{{ auth.error }}</div>

    <!-- Form -->
    <div class="ac-form">
      <label class="fl">Email address</label>
      <input
        class="fi"
        type="email"
        placeholder="you@email.com"
        v-model="form.email"
        @keyup.enter="handleLogin"
      />

      <label class="fl">Password</label>
      <div class="pw-wrap">
        <input
          class="fi"
          :type="showPw ? 'text' : 'password'"
          placeholder="••••••••"
          v-model="form.password"
          @keyup.enter="handleLogin"
          style="margin-bottom:0; padding-right: 36px"
        />
        <button class="pw-eye" @click="showPw = !showPw" type="button">
          {{ showPw ? '🙈' : '👁️' }}
        </button>
      </div>

      <div class="ac-row">
        <label class="ac-check">
          <input type="checkbox" v-model="form.remember" />
          <span>Remember me</span>
        </label>
        <a href="#" class="ac-forgot">Forgot password?</a>
      </div>

      <button class="ba ac-btn" @click="handleLogin" :disabled="auth.loading">
        <span v-if="auth.loading">Signing in…</span>
        <span v-else>Log in</span>
      </button>

      <div class="ac-divider"><span>or</span></div>

      <button class="ac-google" @click="handleGoogle" :disabled="auth.loading">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </div>

    <p class="ac-switch">
      Don't have an account?
      <RouterLink to="/register">Sign up</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const showPw = ref(false)

const form = ref({ email: '', password: '', remember: false })

onMounted(() => auth.clearError())

async function handleLogin() {
  if (!form.value.email || !form.value.password) return
  const result = await auth.login({ email: form.value.email, password: form.value.password })
  if (result.success) {
    redirectAfterAuth()
  }
}

async function handleGoogle() {
  const result = await auth.loginWithGoogle()
  if (result.success) redirectAfterAuth()
}

function redirectAfterAuth() {
  if (!auth.onboardingComplete) {
    router.push(auth.isStudent ? '/onboarding/student' : '/onboarding/mentor')
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.auth-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-xl);
  padding: 32px 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-md);
}

.ac-head { margin-bottom: 22px; }
.ac-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--tx);
  margin-bottom: 4px;
}
.ac-sub { font-size: 13px; color: var(--tx3); }

.ac-error {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  border-radius: var(--r-md);
  padding: 9px 12px;
  font-size: 12.5px;
  margin-bottom: 16px;
}

.ac-form { display: flex; flex-direction: column; }

.pw-wrap { position: relative; margin-bottom: 12px; }
.pw-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
}

.ac-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.ac-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tx2);
  cursor: pointer;
}
.ac-forgot { font-size: 12px; color: var(--acc); font-weight: 600; }

.ac-btn {
  width: 100%;
  padding: 10px;
  font-size: 13.5px;
  border-radius: var(--r-md);
  margin-bottom: 14px;
}
.ac-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.ac-divider {
  text-align: center;
  position: relative;
  margin-bottom: 14px;
}
.ac-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 1px;
  background: var(--brd);
}
.ac-divider span {
  background: var(--white);
  position: relative;
  padding: 0 10px;
  font-size: 11.5px;
  color: var(--tx4);
}

.ac-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--white);
  border: 1.5px solid var(--brd);
  border-radius: var(--r-md);
  padding: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--tx);
  cursor: pointer;
  transition: background var(--t-fast), border-color var(--t-fast);
}
.ac-google:hover { background: var(--page); border-color: var(--tx4); }
.ac-google:disabled { opacity: 0.6; cursor: not-allowed; }

.ac-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 12.5px;
  color: var(--tx3);
}
.ac-switch a { color: var(--acc); font-weight: 700; }
</style>