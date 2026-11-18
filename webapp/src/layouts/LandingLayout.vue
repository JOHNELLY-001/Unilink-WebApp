<template>
  <div class="landing-layout">
    <!-- NAV -->
    <nav class="ln">
      <RouterLink to="/" class="ln-brand">
        <div class="ln-logo">U</div>
        <span class="ln-name">UniLink</span>
      </RouterLink>

      <div class="ln-links">
        <a href="#careers" class="ln-link">Careers</a>
        <a href="#mentors" class="ln-link">Mentors</a>
        <a href="#opportunities" class="ln-link">Opportunities</a>
        <a href="#community" class="ln-link">Community</a>
      </div>

      <div class="ln-cta">
        <RouterLink to="/login" class="bo ln-btn">Log in</RouterLink>
        <RouterLink to="/register" class="ba ln-btn">Get Started</RouterLink>
      </div>

      <!-- Mobile hamburger -->
      <button class="ln-ham" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- Mobile nav dropdown -->
    <div class="ln-mob" :class="{ open: mobileOpen }">
      <a href="#careers" class="ln-mob-link" @click="mobileOpen = false">Careers</a>
      <a href="#mentors" class="ln-mob-link" @click="mobileOpen = false">Mentors</a>
      <a href="#opportunities" class="ln-mob-link" @click="mobileOpen = false">Opportunities</a>
      <a href="#community" class="ln-mob-link" @click="mobileOpen = false">Community</a>
      <RouterLink to="/login" class="ln-mob-link" @click="mobileOpen = false">Log in</RouterLink>
      <RouterLink to="/register" class="ln-mob-cta" @click="mobileOpen = false">Get Started</RouterLink>
    </div>

    <!-- PAGE CONTENT -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const mobileOpen = ref(false)
</script>

<style scoped>
.landing-layout {
  min-height: 100vh;
  background: var(--white);
}

/* ── NAV ── */
.ln {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--brd);
  display: flex;
  align-items: center;
  padding: 0 40px;
  height: 62px;
  gap: 32px;
}

.ln-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.ln-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: #fff;
}

.ln-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: var(--sb);
}

.ln-links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.ln-link {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--tx2);
  transition: color var(--t-fast);
}
.ln-link:hover { color: var(--acc); }

.ln-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.ln-btn { padding: 7px 16px; font-size: 13px; }

.ln-ham {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px;
  margin-left: auto;
  cursor: pointer;
}
.ln-ham span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--tx);
  border-radius: 2px;
}

/* ── MOBILE NAV ── */
.ln-mob {
  display: none;
  flex-direction: column;
  background: var(--white);
  border-bottom: 1px solid var(--brd);
  padding: 8px 20px 16px;
  gap: 4px;
}
.ln-mob.open { display: flex; }
.ln-mob-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--tx2);
  padding: 10px 0;
  border-bottom: 1px solid var(--brd);
}
.ln-mob-cta {
  margin-top: 8px;
  background: var(--acc);
  color: #fff;
  padding: 10px;
  border-radius: var(--r-md);
  text-align: center;
  font-weight: 700;
  font-size: 14px;
}

@media (max-width: 768px) {
  .ln { padding: 0 20px; }
  .ln-links { display: none; }
  .ln-cta { display: none; }
  .ln-ham { display: flex; }
}
</style>