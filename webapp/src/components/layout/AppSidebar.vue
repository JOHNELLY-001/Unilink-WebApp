<template>
  <aside class="sidebar" :class="{ open: ui.sidebarOpen }">

    <!-- Brand -->
    <div class="sb-brand">
      <div class="sb-logo">U</div>
      <span class="sb-name">UniLink</span>
      <button class="sb-close" @click="ui.closeSidebar()">✕</button>
    </div>

    <!-- Role badge -->
    <div class="sb-role-wrap">
      <span class="sb-role" :class="roleBadgeClass">{{ roleBadgeLabel }}</span>
    </div>

    <!-- Navigation -->
    <nav class="sb-nav">
      <!-- STUDENT NAV -->
      <template v-if="auth.isStudent">
        <div class="sb-section-label">Main</div>
        <RouterLink v-for="item in studentNav" :key="item.name"
          :to="item.path" class="sb-link"
          :class="{ active: route.name === item.name }"
          @click="ui.closeSidebar()">
          <span class="sb-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </RouterLink>

        <div class="sb-section-label" style="margin-top:14px">Account</div>
        <RouterLink v-for="item in accountNav" :key="item.name"
          :to="item.path" class="sb-link"
          :class="{ active: route.name === item.name }"
          @click="ui.closeSidebar()">
          <span class="sb-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>

      <!-- MENTOR NAV -->
      <template v-else-if="auth.isMentor">
        <div class="sb-section-label">Main</div>
        <RouterLink v-for="item in mentorNav" :key="item.name"
          :to="item.path" class="sb-link"
          :class="{ active: route.name === item.name }"
          @click="ui.closeSidebar()">
          <span class="sb-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge && pendingCount > 0" class="sb-badge">{{ pendingCount }}</span>
        </RouterLink>

        <div class="sb-section-label" style="margin-top:14px">Account</div>
        <RouterLink v-for="item in accountNav" :key="item.name"
          :to="item.path" class="sb-link"
          :class="{ active: route.name === item.name }"
          @click="ui.closeSidebar()">
          <span class="sb-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>

      <!-- ADMIN NAV -->
      <template v-else-if="auth.isAdmin">
        <div class="sb-section-label">Admin</div>
        <RouterLink v-for="item in adminNav" :key="item.name"
          :to="item.path" class="sb-link"
          :class="{ active: route.name === item.name }"
          @click="ui.closeSidebar()">
          <span class="sb-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <!-- User info + logout -->
    <div class="sb-user">
      <div class="av sb-av">{{ auth.initials }}</div>
      <div class="sb-uinfo">
        <div class="sb-uname">{{ auth.fullName }}</div>
        <div class="sb-uemail">{{ auth.user?.email }}</div>
      </div>
      <button class="sb-out" @click="handleLogout" title="Log out">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useUiStore } from '../../stores/ui.js'
import { getPendingRequests } from '../../api/connections.js'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const ui     = useUiStore()

const pendingCount = ref(0)

onMounted(async () => {
  if (auth.isMentor) {
    try {
      const requests = await getPendingRequests()
      pendingCount.value = requests.length
    } catch {}
  }
})

const roleBadgeLabel = computed(() => {
  if (auth.isStudent) return 'Student'
  if (auth.isMentor)  return 'Mentor'
  if (auth.isAdmin)   return 'Admin'
  return ''
})

const roleBadgeClass = computed(() => {
  if (auth.isStudent) return 'role-s'
  if (auth.isMentor)  return 'role-m'
  return 'role-a'
})

// ── STUDENT NAV ──
const studentNav = [
  { name:'dashboard',     path:'/dashboard',     label:'Dashboard',      icon:ic('grid') },
  { name:'careers',       path:'/careers',       label:'Explore Careers',icon:ic('target') },
  { name:'mentors',       path:'/mentors',       label:'Mentors',        icon:ic('users') },
  { name:'opportunities', path:'/opportunities', label:'Opportunities',  icon:ic('trending') },
  { name:'community',     path:'/community',     label:'Community',      icon:ic('message-sq') },
  { name:'resources',     path:'/resources',     label:'Resources',      icon:ic('book') },
  { name:'progress',      path:'/progress',      label:'My Progress',    icon:ic('bar-chart') },
  { name:'messages',      path:'/messages',      label:'Messages',       icon:ic('mail') },
]

// ── MENTOR NAV ──
const mentorNav = [
  { name:'dashboard',   path:'/dashboard',    label:'Dashboard',         icon:ic('grid'),       badge:false },
  { name:'my-students', path:'/my-students',  label:'My Students',       icon:ic('users'),      badge:false },
  { name:'sessions',    path:'/sessions',     label:'Sessions',          icon:ic('calendar'),   badge:false },
  { name:'community',   path:'/community',    label:'Community',         icon:ic('message-sq'), badge:false },
  { name:'resources',   path:'/resources',    label:'Resources',         icon:ic('book'),       badge:false },
]

// ── ADMIN NAV ──
const adminNav = [
  { name:'admin',  path:'/admin',  label:'Dashboard',  icon:ic('grid') },
]

// ── SHARED ACCOUNT NAV ──
const accountNav = [
  { name:'profile',  path:'/profile',  label:'Profile',  icon:ic('user') },
  { name:'settings', path:'/settings', label:'Settings', icon:ic('settings') },
]

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

// ── SVG ICONS ──
function ic(name) {
  const icons = {
    grid:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    target:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    users:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    trending:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'message-sq':`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    book:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    'bar-chart':`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    mail:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    calendar:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  }
  return icons[name] || ''
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--sb);
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.22s ease;
  z-index: 150;
}
.sb-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 16px 16px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}
.sb-logo {
  width: 30px; height: 30px; border-radius: 7px;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: 700; font-size: 15px; color: #fff;
  flex-shrink: 0;
}
.sb-name { font-family: var(--font-display); font-weight: 700; font-size: 15.5px; color: #fff; flex: 1; }
.sb-close { display: none; background: none; border: none; color: rgba(255,255,255,.5); font-size: 14px; cursor: pointer; padding: 2px 4px; }
.sb-role-wrap { padding: 8px 16px; }
.sb-role { font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 20px; letter-spacing: .6px; text-transform: uppercase; }
.role-s { background: rgba(58,91,217,.25); color: #a5b8ff; }
.role-m { background: rgba(13,148,136,.25); color: #5eead4; }
.role-a { background: rgba(217,119,6,.25); color: #fcd34d; }
.sb-section-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,.3); padding: 6px 16px 4px; }
.sb-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
.sb-nav::-webkit-scrollbar { width: 2px; }
.sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }
.sb-link {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 16px; font-size: 12.5px; font-weight: 600;
  color: rgba(255,255,255,.6);
  transition: background var(--t-fast), color var(--t-fast);
  border-left: 2.5px solid transparent; margin: 1px 0;
}
.sb-link:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.9); }
.sb-link.active { background: rgba(58,91,217,.2); color: #fff; border-left-color: var(--acc); }
.sb-icon { display: flex; align-items: center; justify-content: center; opacity: .75; flex-shrink: 0; }
.sb-link.active .sb-icon { opacity: 1; }
.sb-badge {
  margin-left: auto; background: var(--coral); color: #fff;
  font-size: 9px; font-weight: 700; padding: 1px 6px;
  border-radius: 20px; flex-shrink: 0;
}
.sb-user { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-top: 1px solid rgba(255,255,255,.07); flex-shrink: 0; }
.sb-av { width: 28px; height: 28px; font-size: 10px; flex-shrink: 0; }
.sb-uinfo { flex: 1; min-width: 0; }
.sb-uname { font-size: 11.5px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-uemail { font-size: 9.5px; color: rgba(255,255,255,.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-out { background: none; border: none; color: rgba(255,255,255,.35); display: flex; align-items: center; cursor: pointer; padding: 4px; border-radius: var(--r-sm); transition: color var(--t-fast), background var(--t-fast); flex-shrink: 0; }
.sb-out:hover { color: #fff; background: rgba(255,255,255,.1); }
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 260px;
    height: 100dvh;
    z-index: 200;
    transform: translateX(-100%);
  }
  .sidebar.open { transform: translateX(0); }
  .sb-close { display: block; }
}
</style>