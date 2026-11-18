<template>
  <div class="ob-layout">
    <!-- Top bar -->
    <div class="ob-top">
      <div class="ob-logo-wrap">
        <div class="ob-logo">U</div>
        <span class="ob-name">UniLink</span>
      </div>
      <button class="ob-logout" @click="handleLogout">Log out</button>
    </div>

    <!-- Content -->
    <div class="ob-body">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.ob-layout {
  min-height: 100vh;
  background: var(--page);
  display: flex;
  flex-direction: column;
}

.ob-top {
  height: 58px;
  background: var(--white);
  border-bottom: 1px solid var(--brd);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
}

.ob-logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ob-logo {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: #fff;
}

.ob-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--sb);
}

.ob-logout {
  background: none;
  border: none;
  font-size: 12.5px;
  color: var(--tx3);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--t-fast);
}
.ob-logout:hover { color: var(--tx); }

.ob-body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  overflow-y: auto;
}

@media (max-width: 480px) {
  .ob-top { padding: 0 16px; }
  .ob-body { padding: 24px 12px; }
}
</style>