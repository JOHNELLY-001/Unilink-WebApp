<template>
  <div class="pg-wrap">
    <div v-if="loading" class="sk-col"><div class="sk-item sk-pulse" v-for="n in 4" :key="n"></div></div>

    <template v-else-if="data">
      <!-- OVERALL -->
      <div class="pnl overall-card" style="margin-bottom:16px">
        <div class="ov-left">
          <div class="ov-label">Overall Progress</div>
          <div class="ov-val">{{ data.overall }}%</div>
          <div class="pbw ov-bar">
            <div class="pb" :style="{ width: data.overall+'%', background:'linear-gradient(to right,var(--acc),var(--teal))' }"></div>
          </div>
          <div class="ov-sub">Keep going — you're doing great!</div>
        </div>
        <div class="ov-right">
          <div class="ov-streak">🔥 {{ data.streak }}-day streak</div>
          <div class="ov-streak-sub">Keep logging in to maintain it</div>
        </div>
      </div>

      <!-- SECTIONS -->
      <div class="two" style="margin-bottom:16px">
        <div class="pnl" v-for="sec in data.sections" :key="sec.label">
          <div class="sh">
            <span class="st">{{ sec.label }}</span>
            <span style="font-size:11px;color:var(--tx3)">{{ sec.done }}/{{ sec.total }}</span>
          </div>
          <div class="pbw" style="margin-bottom:14px">
            <div class="pb" :style="{ width: sec.percent+'%', background: sec.color }"></div>
          </div>
          <div class="prog-item" v-for="item in sec.items" :key="item.name">
            <div class="pi-dot" :class="{ done: item.done }">{{ item.done ? '✓' : '' }}</div>
            <span class="pi-label" :class="{ done: item.done }">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- BADGES -->
      <div class="pnl" style="margin-bottom:16px">
        <div class="sh"><span class="st">Badges</span></div>
        <div class="badges-grid">
          <div class="badge-card" v-for="b in data.badges" :key="b.label" :class="{ earned: b.earned, unearned: !b.earned }">
            <div class="badge-ic">{{ b.icon }}</div>
            <div class="badge-label">{{ b.label }}</div>
            <div class="badge-desc">{{ b.desc }}</div>
          </div>
        </div>
      </div>

      <!-- SESSION HISTORY -->
      <div class="pnl">
        <div class="sh"><span class="st">Session History</span></div>
        <div class="ses-row" v-for="s in data.sessions" :key="s.topic">
          <div class="ses-av av">{{ s.mentor.split(' ').map(w=>w[0]).join('') }}</div>
          <div style="flex:1;min-width:0">
            <div class="ses-name">{{ s.mentor }}</div>
            <div class="ses-topic-s">{{ s.topic }}</div>
          </div>
          <div class="ses-right">
            <div class="ses-date">{{ s.date }}</div>
            <span class="tg" :class="s.status==='Completed' ? 't-n' : 't-b'">{{ s.status }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProgress } from '../api/progress.js'

const data    = ref(null)
const loading = ref(true)
onMounted(async () => { data.value = await getProgress(); loading.value = false })
</script>

<style scoped>
.sk-col { display:flex; flex-direction:column; gap:12px; }
.sk-item { height:120px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.overall-card { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
.ov-label { font-size:11.5px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.7px; margin-bottom:4px; }
.ov-val { font-family:var(--font-display); font-size:36px; font-weight:700; color:var(--acc); }
.ov-bar { margin:8px 0; max-width:300px; }
.ov-sub { font-size:12px; color:var(--tx3); }
.ov-streak { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--gold); }
.ov-streak-sub { font-size:11px; color:var(--tx3); margin-top:3px; }
.prog-item { display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid var(--brd); }
.prog-item:last-child { border-bottom:none; }
.pi-dot { width:16px; height:16px; border-radius:50%; border:2px solid var(--brd); display:flex; align-items:center; justify-content:center; font-size:8px; flex-shrink:0; transition:all var(--t-fast); }
.pi-dot.done { background:var(--grn); border-color:var(--grn); color:#fff; }
.pi-label { font-size:12px; color:var(--tx2); }
.pi-label.done { color:var(--tx4); text-decoration:line-through; }
.badges-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:4px; }
.badge-card { border:1.5px solid var(--brd); border-radius:var(--r-lg); padding:16px 12px; text-align:center; transition:all var(--t-fast); }
.badge-card.earned { border-color:var(--gold); background:var(--gold-lt); }
.badge-card.unearned { opacity:.5; filter:grayscale(1); }
.badge-ic { font-size:28px; margin-bottom:6px; }
.badge-label { font-size:12px; font-weight:700; color:var(--tx); margin-bottom:3px; }
.badge-desc { font-size:10.5px; color:var(--tx3); line-height:1.4; }
.ses-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--brd); }
.ses-row:last-child { border-bottom:none; }
.ses-av { width:32px; height:32px; font-size:10px; flex-shrink:0; }
.ses-name { font-size:12.5px; font-weight:700; color:var(--tx); }
.ses-topic-s { font-size:11px; color:var(--tx3); }
.ses-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.ses-date { font-size:10.5px; color:var(--tx4); }
@media(max-width:768px){ .badges-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:400px){ .badges-grid { grid-template-columns:1fr 1fr; } }
</style>