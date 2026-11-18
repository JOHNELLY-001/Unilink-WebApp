<template>
  <div class="ob-card">
    <!-- Pending Approval Screen -->
    <div v-if="ob.currentStep === 5" class="ob-pending">
      <div class="pend-icon">⏳</div>
      <h2 class="ob-title" style="text-align:center">Profile Submitted!</h2>
      <p class="ob-desc" style="text-align:center">
        Your mentor profile has been submitted for review. Our team will verify your details
        within <strong>2–3 business days</strong>. You'll receive an email once approved.
      </p>
      <div class="pend-info">
        <div class="pend-row">
          <span>Name</span>
          <strong>{{ auth.fullName }}</strong>
        </div>
        <div class="pend-row">
          <span>Field</span>
          <strong>{{ ob.mentorData.field }}</strong>
        </div>
        <div class="pend-row">
          <span>Status</span>
          <span class="chip-r">Pending Approval</span>
        </div>
      </div>
      <p class="pend-note">You can log in to check your status at any time.</p>
      <RouterLink to="/login" class="ba ob-nav-btn" style="display:block;text-align:center;margin-top:20px">
        Back to Login
      </RouterLink>
    </div>

    <!-- Steps 1–4 -->
    <template v-else>
      <!-- Step Indicator -->
      <div class="ob-steps">
        <div
          v-for="n in 4"
          :key="n"
          class="ob-step"
          :class="{ done: ob.currentStep > n, active: ob.currentStep === n }"
        >
          <div class="ob-step-dot">
            <span v-if="ob.currentStep > n">✓</span>
            <span v-else>{{ n }}</span>
          </div>
          <div class="ob-step-label">{{ stepLabels[n - 1] }}</div>
        </div>
      </div>

      <div class="ob-progress-bar">
        <div class="ob-progress-fill" :style="{ width: ob.mentorProgress + '%' }"></div>
      </div>

      <!-- STEP 1: Professional Info -->
      <div v-if="ob.currentStep === 1" class="ob-step-body">
        <h2 class="ob-title">Professional Details</h2>
        <p class="ob-desc">Help students understand who you are and what you do.</p>

        <label class="fl">Job Title</label>
        <input class="fi" placeholder="e.g. Software Engineer" v-model="ob.mentorData.title" />

        <label class="fl">Company / Institution</label>
        <input class="fi" placeholder="e.g. Vodacom Tanzania" v-model="ob.mentorData.company" />

        <label class="fl">Field / Industry</label>
        <select class="fi" v-model="ob.mentorData.field">
          <option value="">Select your field</option>
          <option v-for="f in fields" :key="f">{{ f }}</option>
        </select>

        <label class="fl">Years of Experience</label>
        <select class="fi" v-model="ob.mentorData.yearsExperience">
          <option value="">Select range</option>
          <option>1–3 years</option>
          <option>3–5 years</option>
          <option>5–10 years</option>
          <option>10+ years</option>
        </select>
      </div>

      <!-- STEP 2: Mentoring Areas -->
      <div v-if="ob.currentStep === 2" class="ob-step-body">
        <h2 class="ob-title">Mentoring Areas</h2>
        <p class="ob-desc">What topics can you mentor students on?</p>

        <div class="tag-grid">
          <button
            v-for="area in mentoringAreas"
            :key="area"
            class="tag-btn"
            :class="{ selected: ob.mentorData.mentoringAreas.includes(area) }"
            @click="toggleArea(area)"
          >
            {{ area }}
          </button>
        </div>
      </div>

      <!-- STEP 3: Availability -->
      <div v-if="ob.currentStep === 3" class="ob-step-body">
        <h2 class="ob-title">Availability</h2>
        <p class="ob-desc">Let students know when and how they can reach you.</p>

        <label class="fl">Session Preference</label>
        <select class="fi" v-model="ob.mentorData.sessionType">
          <option value="">Select preference</option>
          <option>Video call (Google Meet / Zoom)</option>
          <option>Voice call</option>
          <option>In-person (Dar es Salaam)</option>
          <option>Text / Chat only</option>
          <option>Flexible</option>
        </select>

        <label class="fl">Availability</label>
        <select class="fi" v-model="ob.mentorData.availability">
          <option value="">Select availability</option>
          <option>Weekdays only</option>
          <option>Weekends only</option>
          <option>Weekdays & Weekends</option>
          <option>Evenings only</option>
        </select>

        <label class="fl">Hours per Month (approx.)</label>
        <select class="fi" v-model="ob.mentorData.hoursPerMonth">
          <option value="">Select hours</option>
          <option>1–2 hrs</option>
          <option>3–5 hrs</option>
          <option>6–10 hrs</option>
          <option>10+ hrs</option>
        </select>
      </div>

      <!-- STEP 4: Bio & Links -->
      <div v-if="ob.currentStep === 4" class="ob-step-body">
        <h2 class="ob-title">Bio & Links</h2>
        <p class="ob-desc">Let students know your story. A great bio gets more connection requests.</p>

        <label class="fl">Professional Bio</label>
        <textarea class="fi" rows="4" placeholder="Share your journey, expertise, and why you want to mentor…" v-model="ob.mentorData.bio"></textarea>

        <label class="fl">LinkedIn Profile URL (optional)</label>
        <input class="fi" placeholder="https://linkedin.com/in/…" v-model="ob.mentorData.linkedIn" />

        <label class="fl">Portfolio / Website (optional)</label>
        <input class="fi" placeholder="https://yoursite.com" v-model="ob.mentorData.portfolio" />
      </div>

      <!-- Navigation -->
      <div class="ob-nav">
        <button class="bo ob-nav-btn" v-if="ob.currentStep > 1" @click="ob.prevStep()">Back</button>
        <div v-else></div>

        <button
          v-if="ob.currentStep < 4"
          class="ba ob-nav-btn"
          @click="ob.nextStep()"
          :disabled="!canProceed"
        >
          Continue
        </button>

        <button v-else class="ba ob-nav-btn" @click="handleFinish" :disabled="auth.loading">
          <span v-if="auth.loading">Submitting…</span>
          <span v-else>Submit for Review</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '../../stores/onboarding.js'
import { useAuthStore } from '../../stores/auth.js'

const ob = useOnboardingStore()
const auth = useAuthStore()

ob.goToStep(1)

const stepLabels = ['Professional', 'Mentoring', 'Availability', 'Bio & Links']

const fields = [
  'Technology & Software','Medicine & Health','Law & Legal Services',
  'Engineering','Business & Entrepreneurship','Education & Teaching',
  'Finance & Banking','Architecture','Agriculture','Journalism & Media',
  'Environmental Science','Public Service & NGO','Art & Design',
]

const mentoringAreas = [
  'Career Planning','University Applications','Interview Preparation',
  'STEM Subjects','Business & Entrepreneurship','Study Skills',
  'Scholarship Applications','CV & Resume Writing','Leadership',
  'Mental Health & Wellbeing','Networking','Research & Academia',
]

function toggleArea(area) {
  const list = [...ob.mentorData.mentoringAreas]
  const idx = list.indexOf(area)
  if (idx === -1) list.push(area)
  else list.splice(idx, 1)
  ob.updateMentorData({ mentoringAreas: list })
}

const canProceed = computed(() => {
  if (ob.currentStep === 1)
    return ob.mentorData.title && ob.mentorData.company && ob.mentorData.field
  if (ob.currentStep === 2)
    return ob.mentorData.mentoringAreas.length > 0
  if (ob.currentStep === 3)
    return ob.mentorData.sessionType && ob.mentorData.availability
  return true
})

async function handleFinish() {
  const result = await auth.finishMentorOnboarding(ob.mentorData)
  if (result.success) ob.goToStep(5)
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

.ob-steps { display: flex; justify-content: space-between; margin-bottom: 12px; }
.ob-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.ob-step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid var(--brd);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: var(--tx4);
  background: var(--white); transition: all var(--t-base);
}
.ob-step.active .ob-step-dot { border-color: var(--acc); background: var(--acc); color: #fff; }
.ob-step.done .ob-step-dot { border-color: var(--grn); background: var(--grn); color: #fff; }
.ob-step-label { font-size: 9.5px; font-weight: 600; color: var(--tx4); text-align: center; }
.ob-step.active .ob-step-label { color: var(--acc); }
.ob-step.done .ob-step-label { color: var(--grn); }

.ob-progress-bar { height: 4px; background: var(--brd); border-radius: 20px; margin-bottom: 28px; }
.ob-progress-fill { height: 4px; border-radius: 20px; background: linear-gradient(to right, var(--acc), var(--teal)); transition: width 0.35s ease; }

.ob-step-body { min-height: 260px; }
.ob-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--tx); margin-bottom: 4px; }
.ob-desc { font-size: 13px; color: var(--tx3); margin-bottom: 20px; }

.tag-grid { display: flex; flex-wrap: wrap; gap: 7px; }
.tag-btn {
  padding: 5px 12px; border-radius: 20px; border: 1.5px solid var(--brd);
  background: var(--white); font-size: 12px; font-weight: 600;
  color: var(--tx2); cursor: pointer; transition: all var(--t-fast);
}
.tag-btn:hover { border-color: var(--acc-md); color: var(--acc); }
.tag-btn.selected { border-color: var(--acc); background: var(--acc-lt); color: var(--acc); }

.ob-nav { display: flex; justify-content: space-between; margin-top: 28px; gap: 10px; }
.ob-nav-btn { padding: 9px 22px; font-size: 13px; border-radius: var(--r-md); }
.ob-nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── PENDING ── */
.ob-pending { text-align: center; padding: 8px 0; }
.pend-icon { font-size: 48px; margin-bottom: 16px; }
.pend-info {
  background: var(--page);
  border: 1px solid var(--brd);
  border-radius: var(--r-md);
  padding: 14px;
  margin: 20px 0;
  text-align: left;
}
.pend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid var(--brd);
  font-size: 12.5px;
}
.pend-row:last-child { border-bottom: none; }
.pend-row span:first-child { color: var(--tx3); }
.pend-note { font-size: 12px; color: var(--tx4); }

@media (max-width: 480px) {
  .ob-card { padding: 24px 16px; }
}
</style>