<template>
  <div class="pg-wrap">
    <div class="pnl page-head" style="margin-bottom:16px">
      <div>
        <h2 class="st" style="font-size:16px">Sessions</h2>
        <p style="font-size:12px;color:var(--tx3);margin-top:2px">All your mentoring sessions — upcoming and past.</p>
      </div>
      <div class="filter-tabs">
        <button v-for="tab in tabs" :key="tab" class="tab-btn" :class="{ active: activeTab===tab }" @click="activeTab=tab">{{ tab }}</button>
      </div>
    </div>

    <div v-if="loading" class="sk-col"><div class="sk-item sk-pulse" v-for="n in 3" :key="n"></div></div>

    <div v-else-if="filtered.length" class="sessions-list">
      <div class="session-card pnl" v-for="s in filtered" :key="s.id">
        <div class="scard-left">
          <div class="av scard-av">{{ auth.isMentor ? s.studentInitials : s.mentorInitials }}</div>
          <div class="scard-info">
            <div class="scard-name">{{ auth.isMentor ? s.studentName : s.mentorName }}</div>
            <div class="scard-role" v-if="auth.isMentor">Student</div>
            <div class="scard-role" v-else>{{ s.mentorTitle }} · {{ s.mentorCompany }}</div>
            <div class="scard-topic">{{ s.topic }}</div>
          </div>
        </div>
        <div class="scard-right">
          <div class="scard-date">📅 {{ s.dateFormatted }}</div>
          <div class="scard-time">🕙 {{ s.timeFormatted }}</div>
          <div class="scard-type">{{ s.typeLabel }}</div>
          <span class="tg" :class="statusTag(s.status)">{{ capitalize(s.status) }}</span>
          <div class="scard-actions" v-if="s.status === 'upcoming'">
            <button class="ba scard-btn">Join</button>
            <button class="bo scard-btn" @click="handleCancel(s)">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state pnl">
      <div style="font-size:40px;margin-bottom:10px">📅</div>
      <div class="st">No {{ activeTab.toLowerCase() }} sessions</div>
      <p style="font-size:12.5px;color:var(--tx3);margin-top:4px" v-if="auth.isMentor">
        Go to My Students to propose a session with an accepted student.
      </p>
      <p style="font-size:12.5px;color:var(--tx3);margin-top:4px" v-else>
        Connect with a mentor to get your first session.
      </p>
      <RouterLink :to="auth.isMentor ? '/my-students' : '/mentors'" class="ba" style="padding:8px 20px;font-size:13px;margin-top:16px;display:inline-block">
        {{ auth.isMentor ? 'Go to My Students' : 'Find a Mentor' }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { getSessions, cancelSession } from '../api/sessions.js'

const auth    = useAuthStore()
const sessions = ref([])
const loading  = ref(true)
const activeTab = ref('Upcoming')
const tabs = ['Upcoming', 'Completed', 'Cancelled', 'All']

const filtered = computed(() => {
  if (activeTab.value === 'All') return sessions.value
  return sessions.value.filter(s => s.status === activeTab.value.toLowerCase())
})

onMounted(async () => {
  try { sessions.value = await getSessions() }
  catch {} finally { loading.value = false }
})

async function handleCancel(session) {
  if (!confirm('Cancel this session?')) return
  try {
    await cancelSession(session.id)
    const s = sessions.value.find(x => x.id === session.id)
    if (s) s.status = 'cancelled'
  } catch (err) {
    alert(err?.response?.data?.message || 'Failed to cancel session.')
  }
}

function statusTag(status) {
  return { upcoming:'t-b', completed:'t-n', cancelled:'t-c' }[status] || 't-b'
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>

<style scoped>
.page-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.filter-tabs { display:flex; gap:6px; }
.tab-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.tab-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.tab-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.sk-col  { display:flex; flex-direction:column; gap:12px; }
.sk-item { height:100px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse{ background:var(--brd); animation:pulse 1.6s ease infinite; }
.sessions-list { display:flex; flex-direction:column; gap:12px; }
.session-card { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.scard-left { display:flex; gap:12px; align-items:flex-start; flex:1; min-width:0; }
.scard-av   { width:44px; height:44px; font-size:15px; flex-shrink:0; }
.scard-info { flex:1; min-width:0; }
.scard-name { font-size:14px; font-weight:700; color:var(--tx); }
.scard-role { font-size:11px; color:var(--tx3); margin-bottom:4px; }
.scard-topic{ font-size:12.5px; font-weight:600; color:var(--acc); }
.scard-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
.scard-date,.scard-time,.scard-type { font-size:11.5px; color:var(--tx2); }
.scard-actions { display:flex; gap:6px; margin-top:4px; }
.scard-btn { padding:5px 12px; font-size:11px; }
.empty-state { text-align:center; padding:48px 20px; }
</style>