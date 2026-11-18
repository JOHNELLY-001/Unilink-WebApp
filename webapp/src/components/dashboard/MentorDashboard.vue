<template>
  <div>

    <!-- PENDING APPROVAL SCREEN -->
    <div v-if="auth.pendingApproval" class="pending-screen pnl">
      <div class="ps-icon">⏳</div>
      <h2 class="ps-title">Your profile is under review</h2>
      <p class="ps-desc">Our admin team is verifying your details. This usually takes 2–3 business days. You'll be able to access all mentor features once approved.</p>
      <div class="ps-info">
        <div class="ps-row"><span>Name</span><strong>{{ auth.fullName }}</strong></div>
        <div class="ps-row"><span>Field</span><strong>{{ auth.user?.field }}</strong></div>
        <div class="ps-row"><span>Status</span><span class="chip-r">Pending Approval</span></div>
      </div>
      <p class="ps-note">Check back soon or refresh this page to see your status.</p>
    </div>

    <!-- APPROVED MENTOR DASHBOARD -->
    <template v-else>

      <!-- HERO -->
      <div class="hero-panel pnl" style="margin-bottom:16px">
        <div class="hp-left">
          <div class="hp-greeting">Welcome back 👋</div>
          <h2 class="hp-name">{{ auth.fullName }}</h2>
          <p class="hp-sub">{{ auth.user?.title }} · {{ auth.user?.company }}</p>
          <div class="hp-tags">
            <span class="tg t-t" v-for="area in (auth.user?.mentoringAreas || []).slice(0,3)" :key="area">{{ area }}</span>
          </div>
        </div>
        <div class="hp-right">
          <div class="hp-badge">
            <span class="badge-approved">✅ Approved Mentor</span>
            <div class="hp-field">{{ auth.user?.field }}</div>
            <div class="hp-avail">{{ auth.user?.availability }}</div>
          </div>
        </div>
      </div>

      <!-- STAT CARDS -->
      <div class="sg" style="margin-bottom:16px">
        <div class="pnl stat-card" v-for="s in statCards" :key="s.label">
          <div class="sc-top">
            <div class="sc-ic" :style="{ background: s.bg, color: s.color }">{{ s.icon }}</div>
            <span class="sc-urgent" v-if="s.urgent && s.value > 0">Action needed</span>
          </div>
          <div class="sc-val">{{ s.value }}</div>
          <div class="sc-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- ROW 1: Pending Requests + Upcoming Sessions -->
      <div class="two" style="margin-bottom:16px">

        <!-- Pending Connection Requests -->
        <div class="pnl">
          <div class="sh">
            <span class="st">Connection Requests</span>
            <span class="tg t-c" v-if="pendingRequests.length">{{ pendingRequests.length }} pending</span>
          </div>

          <div v-if="loadingRequests" class="sk-col">
            <div class="sk-item sk-pulse" v-for="n in 2" :key="n"></div>
          </div>

          <div v-else-if="pendingRequests.length">
            <div class="req-row" v-for="req in pendingRequests" :key="req.connectionId">
              <div class="av req-av">
                {{ initials(req.student.firstName, req.student.lastName) }}
              </div>
              <div class="req-info">
                <div class="req-name">{{ req.student.firstName }} {{ req.student.lastName }}</div>
                <div class="req-meta">{{ req.student.form }} · {{ req.student.combination }} · {{ req.student.school }}</div>
                <div class="req-interests" v-if="req.student.careerInterests?.length">
                  <span class="tg t-b" style="font-size:9px" v-for="i in req.student.careerInterests.slice(0,2)" :key="i">{{ i }}</span>
                </div>
              </div>
              <div class="req-actions">
                <button class="bt req-btn" @click="handleAccept(req)" :disabled="actioning === req.connectionId">
                  {{ actioning === req.connectionId ? '…' : 'Accept' }}
                </button>
                <button class="bo req-btn" @click="handleDecline(req)" :disabled="actioning === req.connectionId">
                  Decline
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-mini">
            <div style="font-size:28px;margin-bottom:6px">🎉</div>
            <div style="font-size:12.5px;color:var(--tx3)">No pending requests right now.</div>
          </div>
        </div>

        <!-- Upcoming Sessions -->
        <div class="pnl">
          <div class="sh">
            <span class="st">Upcoming Sessions</span>
            <RouterLink to="/sessions" class="sl">View all</RouterLink>
          </div>

          <div v-if="loadingSessions" class="sk-col">
            <div class="sk-item sk-pulse" v-for="n in 2" :key="n"></div>
          </div>

          <div v-else-if="upcomingSessions.length">
            <div class="ses-row" v-for="ses in upcomingSessions" :key="ses.id">
              <div class="av ses-av">{{ ses.studentInitials }}</div>
              <div class="ses-info">
                <div class="ses-name">{{ ses.studentName }}</div>
                <div class="ses-topic">{{ ses.topic }}</div>
                <div class="ses-date">{{ ses.dateFormatted }} · {{ ses.timeFormatted }}</div>
              </div>
              <div class="ses-right">
                <span class="tg t-b" style="font-size:9px">{{ ses.typeLabel }}</span>
                <button class="ba ses-join-btn">Join</button>
              </div>
            </div>
          </div>

          <div v-else class="empty-mini">
            <div style="font-size:28px;margin-bottom:6px">📅</div>
            <div style="font-size:12.5px;color:var(--tx3)">No upcoming sessions.</div>
            <RouterLink to="/my-students" class="sl" style="font-size:11.5px;margin-top:4px;display:block">Propose one to a student →</RouterLink>
          </div>
        </div>
      </div>

      <!-- ROW 2: My Students + Community -->
      <div class="two">

        <!-- Recent Students -->
        <div class="pnl">
          <div class="sh">
            <span class="st">My Students</span>
            <RouterLink to="/my-students" class="sl">See all</RouterLink>
          </div>

          <div v-if="loadingStudents" class="sk-col">
            <div class="sk-item sk-pulse" v-for="n in 3" :key="n"></div>
          </div>

          <div v-else-if="myStudents.length">
            <div class="student-row" v-for="s in myStudents.slice(0,4)" :key="s.connectionId">
              <div class="av st-av">{{ initials(s.student.firstName, s.student.lastName) }}</div>
              <div class="st-info">
                <div class="st-name">{{ s.student.firstName }} {{ s.student.lastName }}</div>
                <div class="st-meta">{{ s.student.form }} · {{ s.student.combination }}</div>
              </div>
              <RouterLink to="/my-students" class="bo st-btn">View</RouterLink>
            </div>
          </div>

          <div v-else class="empty-mini">
            <div style="font-size:28px;margin-bottom:6px">🎓</div>
            <div style="font-size:12.5px;color:var(--tx3)">No students yet. Accept connection requests to get started.</div>
          </div>
        </div>

        <!-- Community -->
        <div class="pnl">
          <div class="sh">
            <span class="st">Community</span>
            <RouterLink to="/community" class="sl">Post something</RouterLink>
          </div>
          <div class="comm-post" v-for="post in community" :key="post.id">
            <div class="comm-top-row">
              <div class="av cp-av">{{ initials(post.firstName, post.lastName) }}</div>
              <div>
                <div class="cp-name">{{ post.firstName }} {{ post.lastName }}</div>
                <div class="cp-meta">{{ post.role }} · {{ timeAgo(post.createdAt) }}</div>
              </div>
            </div>
            <p class="cp-body">{{ post.body }}</p>
            <div class="cp-footer">
              <span>❤️ {{ post.likes }}</span>
              <span>💬 {{ post.replies }}</span>
            </div>
          </div>
          <div v-if="!community.length" class="empty-mini">
            <div style="font-size:12.5px;color:var(--tx3)">No posts yet. Share your expertise!</div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { getPendingRequests, acceptRequest, declineRequest, getMyStudents } from '../../api/connections.js'
import { getUpcomingSessions } from '../../api/sessions.js'
import api from '../../api/index.js'

const auth = useAuthStore()

const pendingRequests  = ref([])
const upcomingSessions = ref([])
const myStudents       = ref([])
const community        = ref([])
const loadingRequests  = ref(true)
const loadingSessions  = ref(true)
const loadingStudents  = ref(true)
const actioning        = ref(null)

const statCards = computed(() => [
  { icon:'🎓', label:'Total Students',       value: myStudents.value.length,      bg:'#EBF0FF', color:'#3A5BD9', urgent: false },
  { icon:'⏳', label:'Pending Requests',     value: pendingRequests.value.length, bg:'#FEF0E6', color:'#DC6B2F', urgent: true  },
  { icon:'📅', label:'Upcoming Sessions',    value: upcomingSessions.value.length,bg:'#E0F5F3', color:'#0D9488', urgent: false },
  { icon:'💬', label:'Community Posts',      value: community.value.length,       bg:'#D1FAE5', color:'#059669', urgent: false },
])

onMounted(async () => {
  try {
    pendingRequests.value = await getPendingRequests()
  } catch {} finally { loadingRequests.value = false }

  try {
    upcomingSessions.value = await getUpcomingSessions()
  } catch {} finally { loadingSessions.value = false }

  try {
    myStudents.value = await getMyStudents()
  } catch {} finally { loadingStudents.value = false }

  try {
    const { data } = await api.get('/community/posts')
    community.value = (data.posts || []).slice(0, 3)
  } catch {}
})

async function handleAccept(req) {
  actioning.value = req.connectionId
  try {
    await acceptRequest(req.connectionId)
    pendingRequests.value = pendingRequests.value.filter(r => r.connectionId !== req.connectionId)
    myStudents.value = await getMyStudents()
  } catch {} finally { actioning.value = null }
}

async function handleDecline(req) {
  actioning.value = req.connectionId
  try {
    await declineRequest(req.connectionId)
    pendingRequests.value = pendingRequests.value.filter(r => r.connectionId !== req.connectionId)
  } catch {} finally { actioning.value = null }
}

function initials(first, last) {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const h = Math.floor((Date.now() - new Date(dateStr)) / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}
</script>

<style scoped>
.pending-screen { display:flex; flex-direction:column; align-items:center; text-align:center; padding:40px 24px; max-width:520px; margin:0 auto; }
.ps-icon  { font-size:52px; margin-bottom:16px; }
.ps-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--tx); margin-bottom:8px; }
.ps-desc  { font-size:13px; color:var(--tx3); line-height:1.7; margin-bottom:20px; }
.ps-info  { width:100%; background:var(--page); border:1px solid var(--brd); border-radius:var(--r-md); padding:14px; text-align:left; margin-bottom:14px; }
.ps-row   { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--brd); font-size:12.5px; }
.ps-row:last-child { border-bottom:none; }
.ps-row span:first-child { color:var(--tx3); }
.ps-note  { font-size:11.5px; color:var(--tx4); }
.hero-panel { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.hp-greeting { font-size:12px; color:var(--tx3); font-weight:600; margin-bottom:2px; }
.hp-name { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--tx); margin-bottom:3px; }
.hp-sub  { font-size:12px; color:var(--tx3); margin-bottom:8px; }
.hp-tags { display:flex; flex-wrap:wrap; gap:5px; }
.hp-right { flex-shrink:0; }
.hp-badge { background:var(--page); border:1px solid var(--brd); border-radius:var(--r-md); padding:13px 16px; text-align:center; }
.badge-approved { font-size:12px; font-weight:700; color:var(--grn); display:block; margin-bottom:6px; }
.hp-field { font-size:12px; color:var(--tx2); font-weight:600; }
.hp-avail { font-size:11px; color:var(--tx4); margin-top:3px; }
.stat-card { display:flex; flex-direction:column; gap:4px; }
.sc-top  { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.sc-ic   { width:32px; height:32px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:16px; }
.sc-urgent { font-size:9.5px; font-weight:700; color:var(--coral); }
.sc-val  { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--tx); }
.sc-label{ font-size:11px; color:var(--tx3); }
.sk-col  { display:flex; flex-direction:column; gap:8px; }
.sk-item { height:64px; border-radius:var(--r-md); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse{ background:var(--brd); animation:pulse 1.6s ease infinite; }
.req-row { display:flex; align-items:flex-start; gap:10px; padding:11px 0; border-bottom:1px solid var(--brd); }
.req-row:last-child { border-bottom:none; }
.req-av  { width:36px; height:36px; font-size:12px; flex-shrink:0; }
.req-info{ flex:1; min-width:0; }
.req-name{ font-size:12.5px; font-weight:700; color:var(--tx); }
.req-meta{ font-size:10.5px; color:var(--tx3); margin-top:2px; }
.req-interests { display:flex; gap:4px; flex-wrap:wrap; margin-top:5px; }
.req-actions { display:flex; flex-direction:column; gap:5px; flex-shrink:0; }
.req-btn { padding:5px 12px; font-size:10.5px; }
.req-btn:disabled { opacity:.6; cursor:not-allowed; }
.ses-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--brd); }
.ses-row:last-child { border-bottom:none; }
.ses-av  { width:32px; height:32px; font-size:11px; flex-shrink:0; }
.ses-info{ flex:1; min-width:0; }
.ses-name{ font-size:12.5px; font-weight:700; color:var(--tx); }
.ses-topic { font-size:11px; color:var(--tx2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ses-date{ font-size:10.5px; color:var(--tx4); margin-top:2px; }
.ses-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
.ses-join-btn { padding:4px 12px; font-size:10.5px; }
.student-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--brd); }
.student-row:last-child { border-bottom:none; }
.st-av   { width:30px; height:30px; font-size:10px; flex-shrink:0; }
.st-info { flex:1; min-width:0; }
.st-name { font-size:12.5px; font-weight:700; color:var(--tx); }
.st-meta { font-size:10.5px; color:var(--tx3); }
.st-btn  { padding:4px 12px; font-size:10.5px; flex-shrink:0; }
.empty-mini { text-align:center; padding:20px 0; }
.comm-post { padding:10px 0; border-bottom:1px solid var(--brd); }
.comm-post:last-child { border-bottom:none; }
.comm-top-row { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.cp-av   { width:28px; height:28px; font-size:10px; flex-shrink:0; }
.cp-name { font-size:12px; font-weight:700; color:var(--tx); }
.cp-meta { font-size:10px; color:var(--tx4); text-transform:capitalize; }
.cp-body { font-size:12px; color:var(--tx2); line-height:1.6; margin-bottom:8px; }
.cp-footer { display:flex; gap:12px; font-size:11px; color:var(--tx3); }
</style>