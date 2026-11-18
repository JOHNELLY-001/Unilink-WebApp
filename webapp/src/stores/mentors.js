import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMentors, getMentorFields } from '../api/mentors.js'

export const useMentorsStore = defineStore('mentors', () => {
  const mentors  = ref([])
  const fields   = ref([])
  const loading  = ref(false)
  const loaded   = ref(false)

  async function fetchAll() {
    if (loaded.value) return
    loading.value = true
    try {
      const [m, f] = await Promise.all([getMentors(), getMentorFields()])
      mentors.value = m
      fields.value  = f
      loaded.value  = true
    } finally {
      loading.value = false
    }
  }

  function refresh() { loaded.value = false; return fetchAll() }

  return { mentors, fields, loading, loaded, fetchAll, refresh }
})