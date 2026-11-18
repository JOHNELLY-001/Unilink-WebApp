import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // ── STATE ──
  const sidebarOpen = ref(false)
  const topbarTitle = ref('Dashboard')

  // ── ACTIONS ──
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function setTitle(title) {
    topbarTitle.value = title
  }

  return {
    sidebarOpen,
    topbarTitle,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setTitle,
  }
})