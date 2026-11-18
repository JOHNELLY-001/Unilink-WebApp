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

      <div ref="googleHost" class="ac-google-host"></div>
      <div class="ac-google-error" v-if="googleError">{{ googleError }}</div>
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
import { mountGoogleButton } from '../../utils/googleAuth.js'

const router = useRouter()
const auth = useAuthStore()
const showPw = ref(false)
const googleHost = ref(null)
const googleError = ref('')

const form = ref({ email: '', password: '', remember: false })

onMounted(async () => {
  auth.clearError()
  try {
    await mountGoogleButton(googleHost.value, handleGoogleCredential)
  } catch (err) {
    googleError.value = err.message
  }
})

async function handleLogin() {
  if (!form.value.email || !form.value.password) return
  const result = await auth.login({ email: form.value.email, password: form.value.password })
  if (result.success) {
    redirectAfterAuth()
  }
}

async function handleGoogleCredential(credential) {
  const result = await auth.loginWithGoogle(credential)
  if (result.success) {
    redirectAfterAuth()
    return
  }
  // New Google user — backend requires a role. The token is kept in the
  // auth store; finish sign-up on the register page.
  if (auth.pendingGoogleToken) {
    router.push('/register?google=1')
  }
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

.ac-google-host { display: flex; justify-content: center; min-height: 40px; }
.ac-google-host iframe { border-radius: var(--r-md) !important; }
.ac-google-error {
  margin-top: 8px;
  font-size: 11.5px;
  color: #DC2626;
  text-align: center;
}

.ac-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 12.5px;
  color: var(--tx3);
}
.ac-switch a { color: var(--acc); font-weight: 700; }
</style>