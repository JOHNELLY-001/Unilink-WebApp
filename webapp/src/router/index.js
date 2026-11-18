import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  // ── PUBLIC ──
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: { layout: 'landing', public: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { layout: 'auth', public: true, guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { layout: 'auth', public: true, guestOnly: true },
  },

  // ── ONBOARDING ──
  {
    path: '/onboarding/student',
    name: 'onboarding-student',
    component: () =>
      import('../views/onboarding/StudentOnboarding.vue'),
    meta: { layout: 'onboarding', requiresAuth: true },
  },
  {
    path: '/onboarding/mentor',
    name: 'onboarding-mentor',
    component: () =>
      import('../views/onboarding/MentorOnboarding.vue'),
    meta: { layout: 'onboarding', requiresAuth: true },
  },

  // ── APP (shared) ──
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('../views/CommunityView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Community',
    },
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('../views/ResourcesView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Resources',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'My Profile',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Settings',
    },
  },

  // ── STUDENT ONLY ──
  {
    path: '/careers',
    name: 'careers',
    component: () => import('../views/CareersView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Explore Careers',
      role: 'student',
    },
  },
  {
    path: '/mentors',
    name: 'mentors',
    component: () => import('../views/MentorsView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Mentors',
      role: 'student',
    },
  },
  {
    path: '/opportunities',
    name: 'opportunities',
    component: () => import('../views/OpportunitiesView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Opportunities',
      role: 'student',
    },
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'My Progress',
      role: 'student',
    },
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/MessagesView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Messages',
      role: 'student',
    },
  },

  // ── MENTOR ONLY ──
  {
    path: '/my-students',
    name: 'my-students',
    component: () => import('../views/MyStudentsView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'My Students',
      role: 'mentor',
    },
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: () => import('../views/SessionsView.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresOnboarding: true,
      title: 'Sessions',
      role: 'mentor',
    },
  },

  // ── ADMIN ──
  {
    path: '/admin',
    name: 'admin',
    component: () =>
      import('../views/admin/AdminDashboard.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      requiresRole: 'admin',
      title: 'Admin Dashboard',
    },
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Restore the session whenever we need auth state (page reload, first nav).
  // restoreSession() is a no-op if already restored or already attempted.
  // An expired access token is handled by the axios interceptor (silent refresh).
  const needsAuthState = to.meta.requiresAuth || to.meta.requiresOnboarding || to.meta.guestOnly
  if (needsAuthState && !auth.user) {
    await auth.restoreSession()
  }

  // guest-only pages
  if (to.meta.guestOnly && auth.isAuthenticated) {
    if (!auth.onboardingComplete) {
      return {
        name: auth.isStudent
          ? 'onboarding-student'
          : 'onboarding-mentor',
      }
    }

    return { name: 'dashboard' }
  }

  // auth required
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // onboarding required
  if (
    to.meta.requiresOnboarding &&
    auth.isAuthenticated &&
    !auth.onboardingComplete
  ) {
    return {
      name: auth.isStudent
        ? 'onboarding-student'
        : 'onboarding-mentor',
    }
  }

  // admin role check
  if (
    to.meta.requiresRole &&
    auth.role !== to.meta.requiresRole
  ) {
    return { name: 'dashboard' }
  }

  // student/mentor role guard
  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'dashboard' }
  }

  // topbar title
  if (to.meta.title) {
    const { useUiStore } = await import('../stores/ui.js')
    useUiStore().setTitle(to.meta.title)
  }
})

export default router