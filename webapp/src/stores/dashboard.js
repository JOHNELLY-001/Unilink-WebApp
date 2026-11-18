import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDashboardStats,
  getUpcomingSession,
  getRecommendedMentors,
  getRecentOpportunities,
  getActivityFeed,
  getCareerProgress,
  getCommunityHighlights,
} from '../api/dashboard.js'

export const useDashboardStore = defineStore('dashboard', () => {
  // ── STATE ──
  const stats           = ref(null)
  const upcomingSession = ref(null)
  const mentors         = ref([])
  const opportunities   = ref([])
  const activity        = ref([])
  const careerProgress  = ref([])
  const community       = ref([])
  const loading         = ref(false)
  const loaded          = ref(false)

  // ── ACTIONS ──
  async function fetchAll() {
    if (loaded.value) return   // don't re-fetch on revisit unless forced
    loading.value = true
    try {
      const [s, session, m, o, a, cp, c] = await Promise.all([
        getDashboardStats(),
        getUpcomingSession(),
        getRecommendedMentors(),
        getRecentOpportunities(),
        getActivityFeed(),
        getCareerProgress(),
        getCommunityHighlights(),
      ])
      stats.value           = s
      upcomingSession.value = session
      mentors.value         = m
      opportunities.value   = o
      activity.value        = a
      careerProgress.value  = cp
      community.value       = c
      loaded.value          = true
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    loaded.value = false
    return fetchAll()
  }

  return {
    stats, upcomingSession, mentors,
    opportunities, activity, careerProgress,
    community, loading, loaded,
    fetchAll, refresh,
  }
})