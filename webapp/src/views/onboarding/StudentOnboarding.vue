<template>
  <div class="ob-card">
    <!-- Step Indicator -->
    <div class="ob-steps">
      <div
        v-for="n in ob.studentTotalSteps"
        :key="n"
        class="ob-step"
        :class="{
          done: ob.currentStep > n,
          active: ob.currentStep === n
        }"
      >
        <div class="ob-step-dot">
          <span v-if="ob.currentStep > n">✓</span>
          <span v-else>{{ n }}</span>
        </div>
        <div class="ob-step-label">{{ stepLabels[n - 1] }}</div>
      </div>
    </div>

    <div class="ob-progress-bar">
      <div class="ob-progress-fill" :style="{ width: ob.studentProgress + '%' }"></div>
    </div>

    <!-- STEP 1: Education -->
    <div v-if="ob.currentStep === 1" class="ob-step-body">
      <h2 class="ob-title">Your Education</h2>
      <p class="ob-desc">Tell us about where you're studying right now.</p>

      <label class="fl">School Name</label>
      <input class="fi" placeholder="e.g. Kilakala High School" v-model="ob.studentData.school" />

      <label class="fl">Form Level</label>
      <select class="fi" v-model="ob.studentData.form">
        <option value="">Select form level</option>
        <option>Form 5</option>
        <option>Form 6</option>
      </select>

      <label class="fl">Region</label>
      <select class="fi" v-model="ob.studentData.region">
        <option value="">Select region</option>
        <option v-for="r in tanzaniaRegions" :key="r">{{ r }}</option>
      </select>
    </div>

    <!-- STEP 2: Combination -->
    <div v-if="ob.currentStep === 2" class="ob-step-body">
      <h2 class="ob-title">Your Combination</h2>
      <p class="ob-desc">What subject combination are you studying?</p>

      <div class="combo-grid">
        <button
          v-for="combo in combinations"
          :key="combo.code"
          class="combo-card"
          :class="{ selected: ob.studentData.combination === combo.code }"
          @click="ob.updateStudentData({ combination: combo.code })"
        >
          <div class="combo-code">{{ combo.code }}</div>
          <div class="combo-name">{{ combo.name }}</div>
        </button>
      </div>
    </div>

    <!-- STEP 3: Interests -->
    <div v-if="ob.currentStep === 3" class="ob-step-body">
      <h2 class="ob-title">Career Interests</h2>
      <p class="ob-desc">Select careers you're interested in. You can change these later.</p>

      <div class="tag-grid">
        <button
          v-for="career in careerOptions"
          :key="career"
          class="tag-btn"
          :class="{ selected: ob.studentData.careerInterests.includes(career) }"
          @click="toggleCareer(career)"
        >
          {{ career }}
        </button>
      </div>

      <label class="fl" style="margin-top: 16px">Your Goals (optional)</label>
      <textarea class="fi" rows="3" placeholder="What do you hope to achieve with UniLink?" v-model="ob.studentData.goals"></textarea>
    </div>

    <!-- STEP 4: Bio -->
    <div v-if="ob.currentStep === 4" class="ob-step-body">
      <h2 class="ob-title">Almost done!</h2>
      <p class="ob-desc">Add a short bio to personalize your profile. This step is optional.</p>

      <label class="fl">Short Bio</label>
      <textarea class="fi" rows="4" placeholder="Tell mentors and peers a bit about yourself…" v-model="ob.studentData.bio"></textarea>

      <p class="ob-skip-hint">You can skip this and fill it in from your profile later.</p>
    </div>

    <!-- Navigation -->
    <div class="ob-nav">
      <button class="bo ob-nav-btn" v-if="ob.currentStep > 1" @click="ob.prevStep()">
        Back
      </button>
      <div v-else></div>

      <button
        v-if="ob.currentStep < ob.studentTotalSteps"
        class="ba ob-nav-btn"
        @click="ob.nextStep()"
        :disabled="!canProceed"
      >
        Continue
      </button>

      <button
        v-else
        class="ba ob-nav-btn"
        @click="handleFinish"
        :disabled="auth.loading"
      >
        <span v-if="auth.loading">Saving…</span>
        <span v-else>Go to Dashboard 🎉</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '../../stores/onboarding.js'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter()
const ob = useOnboardingStore()
const auth = useAuthStore()

ob.goToStep(1)

const stepLabels = ['Education', 'Combination', 'Interests', 'Bio']

const tanzaniaRegions = [
  'Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera',
  'Katavi','Kigoma','Kilimanjaro','Lindi','Manyara','Mara',
  'Mbeya','Morogoro','Mtwara','Mwanza','Njombe','Pemba North',
  'Pemba South','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu',
  'Singida','Songwe','Tabora','Tanga','Unguja North','Unguja South',
  'Unguja West (Mjini Magharibi)',
]

const combinations = [
  { code: 'PCM',  name: 'Physics, Chemistry, Maths' },
  { code: 'PCB',  name: 'Physics, Chemistry, Biology' },
  { code: 'CBG',  name: 'Chemistry, Biology, Geography' },
  { code: 'HGE',  name: 'History, Geography, Economics' },
  { code: 'HGL',  name: 'History, Geography, Literature' },
  { code: 'EGM',  name: 'Economics, Geography, Maths' },
  { code: 'HKL',  name: 'History, Kiswahili, Literature' },
  { code: 'ECA',  name: 'Economics, Commerce, Accountancy' },
]

const careerOptions = [
  'Software Engineering','Medicine','Law','Engineering',
  'Business & Entrepreneurship','Data Science','Architecture',
  'Teaching & Education','Journalism','Environmental Science',
  'Finance & Banking','Public Health','Social Work','Agriculture',
  'Art & Design','Film & Media',
]

function toggleCareer(career) {
  const list = [...ob.studentData.careerInterests]
  const idx = list.indexOf(career)
  if (idx === -1) list.push(career)
  else list.splice(idx, 1)
  ob.updateStudentData({ careerInterests: list })
}

const canProceed = computed(() => {
  if (ob.currentStep === 1) return ob.studentData.school && ob.studentData.form && ob.studentData.region
  if (ob.currentStep === 2) return !!ob.studentData.combination
  if (ob.currentStep === 3) return ob.studentData.careerInterests.length > 0
  return true
})

async function handleFinish() {
  const result = await auth.finishStudentOnboarding(ob.studentData)
  if (result.success) {
    ob.resetOnboarding()
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.ob-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-xl);
  padding: 32px 28px;
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-md);
}

/* ── STEPS ── */
.ob-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.ob-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.ob-step-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--brd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--tx4);
  background: var(--white);
  transition: all var(--t-base);
}
.ob-step.active .ob-step-dot {
  border-color: var(--acc);
  background: var(--acc);
  color: #fff;
}
.ob-step.done .ob-step-dot {
  border-color: var(--grn);
  background: var(--grn);
  color: #fff;
}

.ob-step-label {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--tx4);
  text-align: center;
}
.ob-step.active .ob-step-label { color: var(--acc); }
.ob-step.done .ob-step-label { color: var(--grn); }

/* ── PROGRESS ── */
.ob-progress-bar {
  height: 4px;
  background: var(--brd);
  border-radius: 20px;
  margin-bottom: 28px;
}
.ob-progress-fill {
  height: 4px;
  border-radius: 20px;
  background: linear-gradient(to right, var(--acc), var(--teal));
  transition: width 0.35s ease;
}

/* ── STEP BODY ── */
.ob-step-body { min-height: 220px; }
.ob-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--tx); margin-bottom: 4px; }
.ob-desc { font-size: 13px; color: var(--tx3); margin-bottom: 20px; }

/* ── COMBINATION GRID ── */
.combo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 4px;
}

.combo-card {
  border: 2px solid var(--brd);
  border-radius: var(--r-md);
  padding: 10px 12px;
  text-align: left;
  background: var(--white);
  cursor: pointer;
  transition: border-color var(--t-fast), background var(--t-fast);
}
.combo-card:hover { border-color: var(--acc-md); background: var(--acc-lt); }
.combo-card.selected { border-color: var(--acc); background: var(--acc-lt); }

.combo-code { font-size: 13px; font-weight: 700; color: var(--acc); }
.combo-name { font-size: 10.5px; color: var(--tx3); margin-top: 2px; }

/* ── TAG GRID ── */
.tag-grid { display: flex; flex-wrap: wrap; gap: 7px; }

.tag-btn {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid var(--brd);
  background: var(--white);
  font-size: 12px;
  font-weight: 600;
  color: var(--tx2);
  cursor: pointer;
  transition: all var(--t-fast);
}
.tag-btn:hover { border-color: var(--acc-md); color: var(--acc); }
.tag-btn.selected { border-color: var(--acc); background: var(--acc-lt); color: var(--acc); }

.ob-skip-hint { font-size: 11.5px; color: var(--tx4); margin-top: 4px; }

/* ── NAV ── */
.ob-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
  gap: 10px;
}
.ob-nav-btn { padding: 9px 22px; font-size: 13px; border-radius: var(--r-md); }
.ob-nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 480px) {
  .ob-card { padding: 24px 16px; }
  .combo-grid { grid-template-columns: 1fr; }
}
</style>