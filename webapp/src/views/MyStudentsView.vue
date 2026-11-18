<template>
  <div class="pg-wrap">
    <div v-if="loading" class="sk-wrap">
      <div class="sk-hero sk-pulse"></div>
      <div class="sk-row"><div class="sk-card sk-pulse" v-for="n in 4" :key="n"></div></div>
      <div class="sk-row2"><div class="sk-block sk-pulse"></div><div class="sk-block sk-pulse"></div></div>
    </div>
    <StudentDashboard v-else-if="auth.isStudent" />
    <MentorDashboard  v-else-if="auth.isMentor" />
    <div v-else class="pnl" style="text-align:center;padding:48px">
      <div style="font-size:32px;margin-bottom:8px">🛡️</div>
      <div class="st">Admin Dashboard</div>
      <p style="font-size:12px;color:var(--tx3);margin-top:4px">Use the admin panel for platform management.</p>
      <RouterLink to="/admin" class="ba" style="padding:8px 20px;font-size:13px;margin-top:16px;display:inline-block">Go to Admin Panel</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useDashboardStore } from '../stores/dashboard.js'
import StudentDashboard from '../components/dashboard/StudentDashboard.vue'
import MentorDashboard  from '../components/dashboard/MentorDashboard.vue'

const auth    = useAuthStore()
const store   = useDashboardStore()
const loading = store.loading

onMounted(() => {
  if (auth.isStudent) store.fetchAll()
})
</script>

<style scoped>
.sk-wrap { display:flex; flex-direction:column; gap:14px; }
.sk-hero { height:110px; border-radius:var(--r-lg); }
.sk-row  { display:grid; grid-template-columns:repeat(4,1fr); gap:11px; }
.sk-row2 { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
.sk-card { height:90px; border-radius:var(--r-lg); }
.sk-block{ height:200px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse{ background:var(--brd); animation:pulse 1.6s ease infinite; }
@media(max-width:768px){ .sk-row { grid-template-columns:1fr 1fr; } }
</style>