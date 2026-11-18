import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPosts, getCategories } from '../api/community.js'

export const useCommunityStore = defineStore('community', () => {
  const posts      = ref([])
  const categories = ref([])
  const loading    = ref(false)
  const loaded     = ref(false)

  async function fetchAll() {
    if (loaded.value) return
    loading.value = true
    try {
      const [p, c] = await Promise.all([getPosts(), getCategories()])
      posts.value      = p
      categories.value = c
      loaded.value     = true
    } finally {
      loading.value = false
    }
  }

  function refresh() { loaded.value = false; return fetchAll() }

  return { posts, categories, loading, loaded, fetchAll, refresh }
})