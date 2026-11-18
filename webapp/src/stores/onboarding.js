import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
  // ── STATE ──
  const currentStep = ref(1)

  // Student onboarding data (collected across steps)
  const studentData = ref({
    // Step 1 - Education
    school: '',
    form: '',
    region: '',
    // Step 2 - Combination
    combination: '',
    subjects: [],
    // Step 3 - Career interests
    careerInterests: [],
    targetUniversities: [],
    goals: '',
    // Step 4 - Bio (optional)
    bio: '',
    avatarFile: null,
  })

  // Mentor onboarding data (collected across steps)
  const mentorData = ref({
    // Step 1 - Professional info
    title: '',
    company: '',
    field: '',
    yearsExperience: '',
    // Step 2 - Mentoring areas
    mentoringAreas: [],
    targetAudience: [],
    // Step 3 - Availability
    availability: '',
    sessionType: '',
    hoursPerMonth: '',
    // Step 4 - Bio & links
    bio: '',
    linkedIn: '',
    portfolio: '',
    avatarFile: null,
  })

  // ── COMPUTED ──
  const studentTotalSteps = computed(() => 4)
  const mentorTotalSteps = computed(() => 5) // 4 + pending approval screen

  const studentProgress = computed(
    () => Math.round((currentStep.value / studentTotalSteps.value) * 100)
  )
  const mentorProgress = computed(
    () => Math.round((currentStep.value / (mentorTotalSteps.value - 1)) * 100)
  )

  // ── ACTIONS ──
  function nextStep() {
    currentStep.value++
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value--
  }

  function goToStep(step) {
    currentStep.value = step
  }

  function updateStudentData(patch) {
    studentData.value = { ...studentData.value, ...patch }
  }

  function updateMentorData(patch) {
    mentorData.value = { ...mentorData.value, ...patch }
  }

  function resetOnboarding() {
    currentStep.value = 1
    studentData.value = {
      school: '', form: '', region: '',
      combination: '', subjects: [],
      careerInterests: [], targetUniversities: [], goals: '',
      bio: '', avatarFile: null,
    }
    mentorData.value = {
      title: '', company: '', field: '', yearsExperience: '',
      mentoringAreas: [], targetAudience: [],
      availability: '', sessionType: '', hoursPerMonth: '',
      bio: '', linkedIn: '', portfolio: '', avatarFile: null,
    }
  }

  return {
    currentStep,
    studentData,
    mentorData,
    studentTotalSteps,
    mentorTotalSteps,
    studentProgress,
    mentorProgress,
    nextStep,
    prevStep,
    goToStep,
    updateStudentData,
    updateMentorData,
    resetOnboarding,
  }
})