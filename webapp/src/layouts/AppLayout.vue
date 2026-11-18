<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Mobile overlay -->
    <div
      class="mob-overlay"
      :class="{ visible: ui.sidebarOpen }"
      @click="ui.closeSidebar()"
    />

    <!-- Main -->
    <div class="app-main">
      <AppTopbar />
      <div class="app-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import { useUiStore } from '../stores/ui.js'

const ui = useUiStore()
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100dvh;
  position: relative;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mob-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(18, 33, 58, 0.45);
  z-index: 199;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.mob-overlay.visible {
  opacity: 1;
  pointer-events: all;
}

@media (max-width: 768px) {
  .mob-overlay { display: block; }
}
</style>