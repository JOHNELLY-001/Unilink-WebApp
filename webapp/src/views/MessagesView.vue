<template>
  <div class="pg-wrap">
    <div class="pnl messages-placeholder">
      <div class="mp-icon">💬</div>
      <h2 class="mp-title">Messages</h2>
      <p class="mp-desc">Real-time messaging between students and mentors is coming in the next phase. For now, use the Connect button on mentor profiles to initiate contact.</p>
      <RouterLink to="/mentors" class="ba mp-btn">Browse Mentors</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.messages-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:400px; gap:12px; }
.mp-icon { font-size:52px; }
.mp-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--tx); }
.mp-desc { font-size:13.5px; color:var(--tx3); line-height:1.7; max-width:480px; }
.mp-btn { padding:10px 24px; font-size:13.5px; }
</style>