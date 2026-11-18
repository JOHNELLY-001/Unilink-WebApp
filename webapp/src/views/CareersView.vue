<template>
  <div class="pg-wrap">
    <div class="pnl page-head" style="margin-bottom:16px">
      <div>
        <h2 class="st" style="font-size:16px">Explore Careers</h2>
        <p style="font-size:12px;color:var(--tx3);margin-top:2px">Discover career paths that match your combination and interests.</p>
      </div>
    </div>

    <div class="pnl filter-bar" style="margin-bottom:16px">
      <div class="fb-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="fb-input" placeholder="Search careers…" v-model="search" />
      </div>
      <div class="fb-fields">
        <button v-for="f in fields" :key="f" class="fb-field-btn" :class="{ active: activeField===f }" @click="activeField=f">{{ f }}</button>
      </div>
    </div>

    <div v-if="loading" class="sk-row"><div class="sk-card sk-pulse" v-for="n in 6" :key="n"></div></div>

    <div v-else class="careers-grid">
      <div class="career-card pnl" v-for="c in filtered" :key="c.id" @click="selected=c">
        <div class="cc-ic" :style="{ background: c.bg, color: c.color }">{{ c.icon }}</div>
        <div class="cc-title">{{ c.title }}</div>
        <div class="cc-field">{{ c.field }}</div>
        <div class="cc-combo">
          <span class="tg t-b" v-for="cb in c.combo" :key="cb">{{ cb }}</span>
        </div>
        <div class="cc-demand" :class="'demand-' + c.demand.toLowerCase().replace(' ','-')">
          {{ c.demand }} demand
        </div>
        <div class="cc-salary">
          TZS {{ formatSalary(c.salaryMin) }} – {{ formatSalary(c.salaryMax) }}/mo
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div class="modal-overlay" v-if="selected" @click.self="selected=null">
        <div class="modal-box">
          <button class="modal-close" @click="selected=null">✕</button>
          <div class="modal-ic" :style="{ background: selected.bg, color: selected.color }">{{ selected.icon }}</div>
          <h2 class="modal-title">{{ selected.title }}</h2>
          <p class="modal-field">{{ selected.field }} · {{ selected.duration }}</p>
          <p class="modal-desc">{{ selected.description }}</p>

          <div class="modal-sec-label">Key Skills</div>
          <div class="tr" style="margin-bottom:14px"><span class="tg t-b" v-for="s in selected.skills" :key="s">{{ s }}</span></div>

          <div class="modal-sec-label">Top Universities in Tanzania</div>
          <div class="tr" style="margin-bottom:14px"><span class="tg t-t" v-for="u in selected.universities" :key="u">{{ u }}</span></div>

          <div class="modal-sec-label">Salary Range</div>
          <p style="font-size:13px;color:var(--tx2);margin-bottom:16px">TZS {{ formatSalary(selected.salaryMin) }} – {{ formatSalary(selected.salaryMax) }} per month</p>

          <div class="modal-sec-label">Compatible Combinations</div>
          <div class="tr" style="margin-bottom:20px"><span class="tg t-g" v-for="cb in selected.combo" :key="cb">{{ cb }}</span></div>

          <RouterLink to="/mentors" class="ba modal-btn-full" @click="selected=null">Find a Mentor in {{ selected.field }}</RouterLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCareers, getCareerFields } from '../api/careers.js'

const careers = ref([])
const fields  = ref([])
const loading = ref(true)
const search  = ref('')
const activeField = ref('All Fields')
const selected = ref(null)

const filtered = computed(() => {
  let list = [...careers.value]
  if (activeField.value !== 'All Fields') list = list.filter(c => c.field === activeField.value)
  if (search.value) list = list.filter(c => c.title.toLowerCase().includes(search.value.toLowerCase()))
  return list
})

onMounted(async () => {
  const [c, f] = await Promise.all([getCareers(), getCareerFields()])
  careers.value = c; fields.value = f; loading.value = false
})

function formatSalary(n) {
  return n >= 1000000 ? (n/1000000).toFixed(1)+'M' : (n/1000).toFixed(0)+'K'
}
</script>

<style scoped>
.page-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.filter-bar { display:flex; flex-direction:column; gap:10px; }
.fb-search { display:flex; align-items:center; gap:8px; background:var(--page); border:1.5px solid var(--brd); border-radius:var(--r-md); padding:0 12px; height:36px; }
.fb-search:focus-within { border-color:var(--acc); }
.fb-input { background:none; border:none; outline:none; font-size:13px; color:var(--tx); flex:1; }
.fb-input::placeholder { color:var(--tx4); }
.fb-fields { display:flex; flex-wrap:wrap; gap:6px; }
.fb-field-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.sk-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.sk-card { height:180px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.careers-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.career-card { cursor:pointer; transition:box-shadow var(--t-base),transform var(--t-base); display:flex; flex-direction:column; gap:6px; }
.career-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.cc-ic { width:40px; height:40px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-size:20px; }
.cc-title { font-size:14px; font-weight:700; color:var(--tx); }
.cc-field { font-size:11px; color:var(--tx4); }
.cc-combo { display:flex; gap:4px; flex-wrap:wrap; }
.cc-salary { font-size:11px; color:var(--tx3); margin-top:2px; }
.cc-demand { font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; width:fit-content; }
.demand-very-high { background:var(--grn-lt); color:var(--grn); }
.demand-high { background:var(--acc-lt); color:var(--acc); }
.demand-medium { background:var(--gold-lt); color:var(--gold); }
.modal-overlay { position:fixed; inset:0; background:rgba(18,33,58,.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
.modal-box { background:var(--white); border-radius:var(--r-xl); padding:28px; width:100%; max-width:480px; position:relative; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); }
.modal-close { position:absolute; top:14px; right:14px; background:var(--page); border:1px solid var(--brd); border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; color:var(--tx3); }
.modal-ic { width:48px; height:48px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:12px; }
.modal-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--tx); margin-bottom:4px; }
.modal-field { font-size:12px; color:var(--tx3); margin-bottom:12px; }
.modal-desc { font-size:13px; color:var(--tx2); line-height:1.7; margin-bottom:16px; }
.modal-sec-label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; color:var(--tx3); margin-bottom:6px; }
.modal-btn-full { display:block; text-align:center; padding:10px; font-size:13px; border-radius:var(--r-md); }
@media(max-width:900px){ .careers-grid,.sk-row { grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .careers-grid { grid-template-columns:1fr; } }
</style>