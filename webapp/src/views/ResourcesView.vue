<template>
  <div class="pg-wrap">
    <div class="pnl page-head" style="margin-bottom:16px">
      <div>
        <h2 class="st" style="font-size:16px">Resources</h2>
        <p style="font-size:12px;color:var(--tx3);margin-top:2px">Guides, videos and articles curated for Form 5 & 6 students.</p>
      </div>
    </div>

    <div class="pnl filter-bar" style="margin-bottom:16px">
      <div class="fb-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="fb-input" placeholder="Search resources…" v-model="search" />
      </div>
      <div class="filter-row">
        <div class="fb-fields">
          <button v-for="c in categories" :key="c" class="fb-field-btn" :class="{ active: activeCategory===c }" @click="activeCategory=c">{{ c }}</button>
        </div>
        <div class="fb-fields">
          <button v-for="t in types" :key="t" class="fb-field-btn sm" :class="{ active: activeType===t }" @click="activeType=t">{{ t }}</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="res-grid"><div class="sk-card sk-pulse" v-for="n in 6" :key="n"></div></div>

    <div v-else-if="filtered.length" class="res-grid">
      <div class="res-card pnl" v-for="r in filtered" :key="r.id">
        <div class="rc-top">
          <div class="rc-ic">{{ r.icon }}</div>
          <span class="tg" :class="typeTag(r.type)">{{ r.type }}</span>
        </div>
        <div class="rc-title">{{ r.title }}</div>
        <div class="rc-category">{{ r.category }}</div>
        <p class="rc-desc">{{ r.description }}</p>
        <div class="rc-meta">
          <span v-if="r.size">📄 {{ r.size }}</span>
          <span v-if="r.duration">▶️ {{ r.duration }}</span>
          <span v-if="r.readTime">📖 {{ r.readTime }}</span>
          <span v-if="r.downloads">⬇️ {{ r.downloads.toLocaleString() }}</span>
          <span v-if="r.views">👁 {{ r.views.toLocaleString() }}</span>
        </div>
        <button class="ba rc-btn">{{ r.type === 'PDF' ? 'Download' : r.type === 'Video' ? 'Watch' : 'Read' }}</button>
      </div>
    </div>

    <div v-else class="empty-state pnl">
      <div style="font-size:36px;margin-bottom:10px">📚</div>
      <div class="st">No resources found</div>
      <p style="font-size:12px;color:var(--tx3);margin-top:4px">Try a different search or category.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getResources, getResourceCategories, getResourceTypes } from '../api/resources.js'

const resources = ref([])
const categories = ref([])
const types = ref([])
const loading = ref(true)
const search = ref('')
const activeCategory = ref('All')
const activeType = ref('All')

const filtered = computed(() => {
  let list = [...resources.value]
  if (activeCategory.value !== 'All') list = list.filter(r => r.category === activeCategory.value)
  if (activeType.value !== 'All') list = list.filter(r => r.type === activeType.value)
  if (search.value) list = list.filter(r => r.title.toLowerCase().includes(search.value.toLowerCase()))
  return list
})

onMounted(async () => {
  const [r, c, t] = await Promise.all([getResources(), getResourceCategories(), getResourceTypes()])
  resources.value = r; categories.value = c; types.value = t; loading.value = false
})

function typeTag(type) {
  if (type === 'PDF') return 't-b'
  if (type === 'Video') return 't-c'
  return 't-t'
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
.fb-field-btn.sm { padding:3px 10px; font-size:10.5px; }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.res-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.sk-card { height:200px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.res-card { display:flex; flex-direction:column; gap:6px; }
.rc-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
.rc-ic { font-size:28px; }
.rc-title { font-size:14px; font-weight:700; color:var(--tx); line-height:1.3; }
.rc-category { font-size:11px; color:var(--tx4); }
.rc-desc { font-size:12px; color:var(--tx2); line-height:1.6; flex:1; }
.rc-meta { display:flex; flex-wrap:wrap; gap:8px; font-size:10.5px; color:var(--tx3); }
.rc-btn { padding:7px; font-size:12px; margin-top:4px; }
.empty-state { text-align:center; padding:48px 20px; }
@media(max-width:900px){ .res-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .res-grid { grid-template-columns:1fr; } }
</style>