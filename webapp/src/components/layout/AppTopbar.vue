<template>
  <header class="topbar">
    <!-- Left: hamburger + title -->
    <div class="tb-left">
      <button class="tb-ham" @click="ui.toggleSidebar()">
        <span></span><span></span><span></span>
      </button>
      <h1 class="tb-title">{{ ui.topbarTitle }}</h1>
    </div>

    <!-- Right: search + notifications + avatar -->
    <div class="tb-right">
      <div class="tb-search">
        <svg class="tb-search-ic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input class="tb-search-input" placeholder="Search…" v-model="searchQuery" />
      </div>

      <!-- Notifications -->
      <button class="tb-icon-btn" @click="notifOpen = !notifOpen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="tb-badge" v-if="notifCount > 0">{{ notifCount }}</span>
      </button>

      <!-- Avatar -->
      <div class="tb-av-wrap">
        <div class="av tb-av">{{ auth.initials }}</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '../../stores/ui.js'
import { useAuthStore } from '../../stores/auth.js'

const ui = useUiStore()
const auth = useAuthStore()
const searchQuery = ref('')
const notifOpen = ref(false)
const notifCount = ref(3) // will come from a notifications store/API later
</script>

<style scoped>
.topbar {
  height: 56px;
  background: var(--white);
  border-bottom: 1px solid var(--brd);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 50;
}

/* ── LEFT ── */
.tb-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.tb-ham {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  flex-shrink: 0;
}
.tb-ham span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--tx2);
  border-radius: 2px;
}

.tb-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--tx);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── RIGHT ── */
.tb-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.tb-search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--page);
  border: 1.5px solid var(--brd);
  border-radius: var(--r-md);
  padding: 0 10px;
  height: 32px;
  transition: border-color var(--t-fast);
}
.tb-search:focus-within { border-color: var(--acc); }

.tb-search-ic { color: var(--tx4); flex-shrink: 0; }

.tb-search-input {
  background: none;
  border: none;
  outline: none;
  font-size: 12.5px;
  color: var(--tx);
  width: 160px;
}
.tb-search-input::placeholder { color: var(--tx4); }

.tb-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--r-md);
  background: var(--page);
  border: 1.5px solid var(--brd);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--tx2);
  position: relative;
  transition: background var(--t-fast);
}
.tb-icon-btn:hover { background: var(--acc-lt); color: var(--acc); border-color: var(--acc-md); }

.tb-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--coral);
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--white);
}

.tb-av {
  width: 30px;
  height: 30px;
  font-size: 11px;
  cursor: pointer;
}
.tb-av-wrap { display: flex; align-items: center; }

/* ── MOBILE ── */
@media (max-width: 768px) {
  .tb-ham { display: flex; }
  .tb-search { display: none; }
  .topbar { padding: 0 12px; }
  .tb-icon-btn { width: 36px; height: 36px; } /* larger touch target */
}

@media (max-width: 480px) {
  .tb-title { font-size: 14px; }
}
</style>