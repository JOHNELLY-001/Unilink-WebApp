<template>
  <div class="auth-layout">
    <div class="auth-brand">
      <RouterLink to="/" class="auth-logo-wrap">
        <div class="auth-logo">U</div>
        <span class="auth-name">UniLink</span>
      </RouterLink>
    </div>
    <div class="auth-body">
      <RouterView />
    </div>
    <div class="auth-footer">
      <span>© {{ new Date().getFullYear() }} UniLink. Empowering Tanzania's next generation.</span>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: var(--page);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-brand {
  padding: 28px 0 0;
}

.auth-logo-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
}

.auth-logo {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: #fff;
}

.auth-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  color: var(--sb);
}

.auth-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 16px;
}

.auth-footer {
  padding: 20px;
  font-size: 11.5px;
  color: var(--tx4);
  text-align: center;
}
</style>