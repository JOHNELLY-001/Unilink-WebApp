<template>
  <div class="pg-wrap">
    <div class="pnl page-head" style="margin-bottom:16px">
      <div>
        <h2 class="st" style="font-size:16px">Opportunities</h2>
        <p style="font-size:12px;color:var(--tx3);margin-top:2px">Scholarships, internships, programmes and events — all in one place.</p>
      </div>
    </div>

    <div class="pnl filter-bar" style="margin-bottom:16px">
      <div class="fb-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="fb-input" placeholder="Search opportunities…" v-model="search" />
      </div>
      <div class="filter-row">
        <div class="fb-fields">
          <button v-for="t in types" :key="t" class="fb-field-btn" :class="{ active: activeType===t }" @click="activeType=t">{{ t }}</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="sk-col"><div class="sk-item sk-pulse" v-for="n in 4" :key="n"></div></div>

    <div v-else-if="filtered.length" class="opp-list">
      <div class="opp-card pnl" v-for="o in filtered" :key="o.id">
        <div class="oc-left">
          <div class="oc-ic" :style="{ background: o.iconBg }">{{ o.icon }}</div>
          <div class="oc-body">
            <div class="oc-title">{{ o.title }}</div>
            <div class="oc-org">{{ o.org }}</div>
            <p class="oc-desc">{{ o.description }}</p>
            <div class="oc-reqs" v-if="o.requirements">
              <div class="oc-req-label">Requirements:</div>
              <ul class="oc-req-list">
                <li v-for="r in o.requirements" :key="r">{{ r }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="oc-right">
          <span class="tg" :class="o.typeTag">{{ o.type }}</span>
          <div class="oc-deadline" :class="{ urgent: o.daysLeft <= 5 }">
            📅 {{ o.deadline }}
            <span v-if="o.daysLeft <= 5" class="oc-urgent-badge">{{ o.daysLeft }}d left!</span>
          </div>
          <button class="oc-save" @click="toggleSave(o)" :title="o.saved ? 'Unsave' : 'Save'">
            {{ o.saved ? '🔖' : '🔖' }}
            <span>{{ o.saved ? 'Saved' : 'Save' }}</span>
          </button>
          <button class="ba oc-apply">Apply Now</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state pnl">
      <div style="font-size:36px;margin-bottom:10px">📋</div>
      <div class="st">No opportunities found</div>
      <p style="font-size:12px;color:var(--tx3);margin-top:4px">Try adjusting your filters.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOpportunities, getOpportunityTypes, toggleSaveOpportunity } from '../api/opportunities.js'

const opps    = ref([])
const types   = ref([])
const loading = ref(true)
const search  = ref('')
const activeType = ref('All Types')

const filtered = computed(() => {
  let list = [...opps.value]
  if (activeType.value !== 'All Types') list = list.filter(o => o.type === activeType.value)
  if (search.value) list = list.filter(o =>
    o.title.toLowerCase().includes(search.value.toLowerCase()) ||
    o.org.toLowerCase().includes(search.value.toLowerCase())
  )
  return list
})

onMounted(async () => {
  const [o, t] = await Promise.all([getOpportunities(), getOpportunityTypes()])
  opps.value = o; types.value = t; loading.value = false
})

async function toggleSave(o) {
  o.saved = !o.saved
  await toggleSaveOpportunity(o.id)
}
</script>

<style scoped>
.page-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.filter-bar { display:flex; flex-direction:column; gap:10px; }
.fb-search { display:flex; align-items:center; gap:8px; background:var(--page); border:1.5px solid var(--brd); border-radius:var(--r-md); padding:0 12px; height:36px; }
.fb-search:focus-within { border-color:var(--acc); }
.fb-input { background:none; border:none; outline:none; font-size:13px; color:var(--tx); flex:1; }
.fb-input::placeholder { color:var(--tx4); }
.filter-row { display:flex; gap:10px; flex-wrap:wrap; }
.fb-fields { display:flex; flex-wrap:wrap; gap:6px; }
.fb-field-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.sk-col { display:flex; flex-direction:column; gap:12px; }
.sk-item { height:120px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.opp-list { display:flex; flex-direction:column; gap:12px; }
.opp-card { display:flex; gap:16px; align-items:flex-start; }
.oc-left { display:flex; gap:12px; flex:1; min-width:0; }
.oc-ic { width:40px; height:40px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.oc-body { flex:1; min-width:0; }
.oc-title { font-size:14px; font-weight:700; color:var(--tx); margin-bottom:2px; }
.oc-org { font-size:11.5px; color:var(--tx3); margin-bottom:6px; }
.oc-desc { font-size:12.5px; color:var(--tx2); line-height:1.6; margin-bottom:8px; }
.oc-req-label { font-size:10.5px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
.oc-req-list { padding-left:14px; font-size:12px; color:var(--tx2); line-height:1.8; }
.oc-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; min-width:120px; }
.oc-deadline { font-size:11px; color:var(--tx3); text-align:right; }
.oc-deadline.urgent { color:var(--coral); font-weight:700; }
.oc-urgent-badge { display:block; font-size:10px; }
.oc-save { background:none; border:1px solid var(--brd); border-radius:var(--r-sm); padding:4px 10px; font-size:11px; color:var(--tx3); cursor:pointer; display:flex; align-items:center; gap:4px; transition:all var(--t-fast); }
.oc-save:hover { border-color:var(--acc); color:var(--acc); }
.oc-apply { padding:7px 14px; font-size:12px; width:100%; }
.empty-state { text-align:center; padding:48px 20px; }
@media(max-width:640px){
  .opp-card { flex-direction:column; }
  .oc-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; }
}
</style>