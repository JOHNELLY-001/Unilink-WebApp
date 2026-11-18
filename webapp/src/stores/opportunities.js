import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getOpportunities } from '../api/opportunities.js'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  const opportunities = ref([])
  const loading       = ref(false)
  const loaded        = ref(false)

  async function fetchAll() {
    if (loaded.value) return
    loading.value = true
    try {
      opportunities.value = await getOpportunities()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function refresh() { loaded.value = false; return fetchAll() }

  return { opportunities, loading, loaded, fetchAll, refresh }
})