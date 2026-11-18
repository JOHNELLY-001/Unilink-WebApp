<template>
  <div class="auth-card">
    <!-- Step 1: Role Selection -->
    <div v-if="step === 1">
      <div class="ac-head">
        <h2 class="ac-title">Join UniLink</h2>
        <p class="ac-sub">I want to join as a…</p>
      </div>

      <div class="google-notice" v-if="isFinishingGoogle">
        ✅ Google account connected — choose your role to finish signing up.
      </div>

      <div class="role-cards">
        <button
          class="role-card"
          :class="{ selected: form.role === 'student' }"
          @click="form.role = 'student'"
        >
          <div class="role-ic" style="background: var(--acc-lt); color: var(--acc)">🎓</div>
          <div class="role-label">Student</div>
          <div class="role-desc">Form 5/6 student exploring careers and university paths</div>
        </button>

        <button
          class="role-card"
          :class="{ selected: form.role === 'mentor' }"
          @click="form.role = 'mentor'"
        >
          <div class="role-ic" style="background: var(--teal-lt); color: var(--teal)">💼</div>
          <div class="role-label">Mentor / Professional</div>
          <div class="role-desc">Professional looking to guide and inspire Tanzanian students</div>
        </button>
      </div>

      <button
        class="ba ac-btn"
        :disabled="!form.role"
        @click="handleContinue"
      >
        {{ isFinishingGoogle ? 'Finish Google Sign-Up' : 'Continue' }}
      </button>

      <p class="ac-switch">
        Already have an account?
        <RouterLink to="/login">Log in</RouterLink>
      </p>
    </div>

    <!-- Step 2: Account Details -->
    <div v-else>
      <button class="ac-back" @click="step = 1">← Back</button>
      <div class="ac-head">
        <h2 class="ac-title">Create your account</h2>
        <p class="ac-sub">
          Registering as a <strong>{{ form.role === 'student' ? 'Student' : 'Mentor' }}</strong>
        </p>
      </div>

      <div class="ac-error" v-if="auth.error">{{ auth.error }}</div>

      <div class="ac-form">
        <div class="fr">
          <div>
            <label class="fl">First Name</label>
            <input class="fi" type="text" placeholder="James" v-model="form.firstName" />
          </div>
          <div>
            <label class="fl">Last Name</label>
            <input class="fi" type="text" placeholder="Mwangi" v-model="form.lastName" />
          </div>
        </div>

        <label class="fl">Email address</label>
        <input class="fi" type="email" placeholder="you@email.com" v-model="form.email" />

        <label class="fl">Phone number</label>
        <input class="fi" type="tel" placeholder="+255 7XX XXX XXX" v-model="form.phone" />

        <label class="fl">Password</label>
        <div class="pw-wrap">
          <input
            class="fi"
            :type="showPw ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            v-model="form.password"
            style="margin-bottom:0; padding-right:36px"
          />
          <button class="pw-eye" @click="showPw = !showPw" type="button">
            {{ showPw ? '🙈' : '👁️' }}
          </button>
        </div>

        <p class="ac-terms">
          By signing up, you agree to UniLink's
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

        <button class="ba ac-btn" @click="handleRegister" :disabled="auth.loading || !isValid">
          <span v-if="auth.loading">Creating account…</span>
          <span v-else>Create Account</span>
        </button>

        <div class="ac-divider"><span>or</span></div>

        <div ref="googleHost" class="ac-google-host"></div>
        <div class="ac-google-error" v-if="googleError">{{ googleError }}</div>
      </div>

      <p class="ac-switch">
        Already have an account?
        <RouterLink to="/login">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { mountGoogleButton } from '../../utils/googleAuth.js'

const router = useRouter()
const route  = useRoute()
const auth = useAuthStore()
const step = ref(1)
const showPw = ref(false)
const googleHost = ref(null)
const googleError = ref('')

const form = ref({
  role: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
})

// Google sign-up started on the login page — finish it after role selection
const isFinishingGoogle = computed(() =>
  route.query.google === '1' && !!auth.pendingGoogleToken
)

async function mountGoogleButtonIfVisible() {
  if (step.value !== 2 || !googleHost.value) return
  try {
    await mountGoogleButton(googleHost.value, handleGoogleCredential)
  } catch (err) {
    googleError.value = err.message
  }
}

onMounted(() => {
  auth.clearError()
  if (isFinishingGoogle.value) step.value = 1
  mountGoogleButtonIfVisible()
})

// The Google button lives on step 2 — mount it whenever that step is shown
watch(step, () => { nextTick(mountGoogleButtonIfVisible) })

const isValid = computed(() =>
  form.value.firstName &&
  form.value.lastName &&
  form.value.email &&
  form.value.password.length >= 8
)

async function handleRegister() {
  if (!isValid.value) return
  const result = await auth.register(form.value)
  if (result.success) {
    router.push(form.value.role === 'student' ? '/onboarding/student' : '/onboarding/mentor')
  }
}

function handleContinue() {
  if (isFinishingGoogle.value && form.value.role) {
    finishGoogleSignUp()
  } else {
    step.value = 2
  }
}

async function finishGoogleSignUp() {
  const result = await auth.loginWithGoogle(auth.pendingGoogleToken, form.value.role)
  if (result.success) {
    router.push(auth.isStudent ? '/onboarding/student' : '/onboarding/mentor')
  } else {
    step.value = 1   // token expired/rejected — back to role selection
  }
}

async function handleGoogleCredential(credential) {
  const result = await auth.loginWithGoogle(credential, form.value.role || 'student')
  if (result.success) {
    router.push(auth.isStudent ? '/onboarding/student' : '/onboarding/mentor')
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
  max-width: 440px;
  box-shadow: var(--shadow-md);
}

.ac-back {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--tx3);
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  padding: 0;
}
.ac-back:hover { color: var(--acc); }

.ac-head { margin-bottom: 22px; }
.ac-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--tx); margin-bottom: 4px; }
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

/* ── ROLE CARDS ── */
.role-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

.role-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 2px solid var(--brd);
  border-radius: var(--r-lg);
  background: var(--white);
  cursor: pointer;
  text-align: left;
  transition: border-color var(--t-fast), background var(--t-fast);
}
.role-card:hover { border-color: var(--acc-md); background: var(--acc-lt); }
.role-card.selected { border-color: var(--acc); background: var(--acc-lt); }

.role-ic {
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.role-label { font-size: 13.5px; font-weight: 700; color: var(--tx); margin-bottom: 2px; }
.role-desc { font-size: 11.5px; color: var(--tx3); line-height: 1.4; }

/* ── FORM ── */
.ac-form { display: flex; flex-direction: column; }

.pw-wrap { position: relative; margin-bottom: 12px; }
.pw-eye {
  position: absolute; right: 10px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 13px;
}

.ac-terms {
  font-size: 11px;
  color: var(--tx3);
  line-height: 1.5;
  margin-bottom: 14px;
}
.ac-terms a { color: var(--acc); }

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
  top: 50%; left: 0; right: 0;
  height: 1px; background: var(--brd);
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

.google-notice {
  background: var(--grn-lt, #ECFDF5);
  border: 1px solid #6EE7B7;
  color: var(--grn, #059669);
  border-radius: var(--r-md);
  padding: 9px 12px;
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 14px;
}

.ac-switch { margin-top: 20px; text-align: center; font-size: 12.5px; color: var(--tx3); }
.ac-switch a { color: var(--acc); font-weight: 700; }
</style>