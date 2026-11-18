<template>
  <div class="pg-wrap">
    <div class="pnl page-head" style="margin-bottom:16px">
      <div>
        <h2 class="st" style="font-size:16px">Find a Mentor</h2>
        <p style="font-size:12px;color:var(--tx3);margin-top:2px">Connect with verified Tanzanian professionals in your field of interest.</p>
      </div>
      <div class="ph-stats">
        <span class="ph-stat"><strong>{{ mentors.length }}</strong> mentors</span>
        <span class="ph-stat available"><strong>{{ availableCount }}</strong> available now</span>
      </div>
    </div>

    <div class="pnl filter-bar" style="margin-bottom:16px">
      <div class="fb-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="fb-input" placeholder="Search by name, field or topic…" v-model="search" />
      </div>
      <div class="fb-fields">
        <button v-for="f in fields" :key="f" class="fb-field-btn" :class="{ active: activeField === f }" @click="activeField = f">{{ f }}</button>
      </div>
    </div>

    <div v-if="loading" class="sk-row"><div class="sk-card sk-pulse" v-for="n in 6" :key="n"></div></div>

    <div v-else-if="filtered.length" class="mentor-grid">
      <div class="mentor-card pnl" v-for="m in filtered" :key="m.id" @click="openModal(m)">
        <div class="mc-top">
          <div class="av mc-av">{{ m.initials }}</div>
          <div class="mc-avail" :class="m.available ? 'avail-y' : 'avail-n'">{{ m.available ? 'Available' : 'Busy' }}</div>
        </div>
        <div class="mc-name">{{ m.name }}</div>
        <div class="mc-title">{{ m.title }}</div>
        <div class="mc-company">{{ m.company }}</div>
        <div class="mc-meta"><span>{{ m.sessions }} sessions completed</span></div>
        <div class="tr"><span class="tg t-b" v-for="area in m.areas.slice(0,2)" :key="area">{{ area }}</span></div>
        <button class="bt mc-btn" @click.stop="handleConnect(m)">Connect</button>
      </div>
    </div>

    <div v-else class="empty-state pnl">
      <div style="font-size:36px;margin-bottom:10px">🔍</div>
      <div class="st">No mentors found</div>
      <p style="font-size:12px;color:var(--tx3);margin-top:4px">Try a different search or field.</p>
    </div>

    <Teleport to="body">
      <div class="modal-overlay" v-if="selectedMentor" @click.self="selectedMentor = null">
        <div class="modal-box">
          <button class="modal-close" @click="selectedMentor = null">✕</button>
          <div class="modal-top">
            <div class="av modal-av">{{ selectedMentor.initials }}</div>
            <div>
              <div class="modal-name">{{ selectedMentor.name }}</div>
              <div class="modal-title-s">{{ selectedMentor.title }} · {{ selectedMentor.company }}</div>
              <div class="modal-meta">
                <span>{{ selectedMentor.sessions }} sessions completed</span>
                <div class="mc-avail" :class="selectedMentor.available ? 'avail-y' : 'avail-n'">{{ selectedMentor.available ? 'Available' : 'Busy' }}</div>
              </div>
            </div>
          </div>
          <div class="modal-bio">{{ selectedMentor.bio }}</div>
          <div class="modal-sec-label">Mentoring Areas</div>
          <div class="tr" style="margin-bottom:12px"><span class="tg t-b" v-for="area in selectedMentor.areas" :key="area">{{ area }}</span></div>
          <div class="modal-sec-label">Session Type</div>
          <p style="font-size:13px;color:var(--tx2);margin-bottom:16px">📹 {{ selectedMentor.type }}</p>
          <div class="modal-actions">
            <button class="bt modal-btn" @click="handleConnect(selectedMentor)" :disabled="connecting">{{ connecting ? 'Sending…' : 'Send Connection Request' }}</button>
            <button class="bo modal-btn" @click="selectedMentor = null">Cancel</button>
          </div>
          <div class="modal-success" v-if="connectSuccess">✅ Connection request sent to {{ selectedMentor.name }}!</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMentors, getMentorFields, requestConnection } from '../api/mentors.js'

const mentors = ref([])
const fields  = ref([])
const loading = ref(true)
const search  = ref('')
const activeField = ref('All Fields')
const selectedMentor = ref(null)
const connecting     = ref(false)
const connectSuccess = ref(false)

const availableCount = computed(() => mentors.value.filter(m => m.available).length)
const filtered = computed(() => {
  let list = [...mentors.value]
  if (activeField.value !== 'All Fields') list = list.filter(m => m.field === activeField.value)
  if (search.value) list = list.filter(m =>
    m.name.toLowerCase().includes(search.value.toLowerCase()) ||
    m.areas.some(a => a.toLowerCase().includes(search.value.toLowerCase()))
  )
  return list
})

onMounted(async () => {
  const [m, f] = await Promise.all([getMentors(), getMentorFields()])
  mentors.value = m; fields.value = f; loading.value = false
})

function openModal(m) { selectedMentor.value = m; connectSuccess.value = false }
async function handleConnect(m) {
  connecting.value = true
  await requestConnection(m.id)
  connecting.value = false; connectSuccess.value = true
}
</script>

<style scoped>
.page-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.ph-stats  { display:flex; gap:14px; }
.ph-stat   { font-size:12px; color:var(--tx3); }
.ph-stat.available strong { color:var(--grn); }
.filter-bar { display:flex; flex-direction:column; gap:10px; }
.fb-search { display:flex; align-items:center; gap:8px; background:var(--page); border:1.5px solid var(--brd); border-radius:var(--r-md); padding:0 12px; height:36px; }
.fb-search:focus-within { border-color:var(--acc); }
.fb-input  { background:none; border:none; outline:none; font-size:13px; color:var(--tx); flex:1; }
.fb-input::placeholder { color:var(--tx4); }
.fb-fields { display:flex; flex-wrap:wrap; gap:6px; }
.fb-field-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.sk-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.sk-card { height:220px; border-radius:var(--r-lg); }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.sk-pulse { background:var(--brd); animation:pulse 1.6s ease infinite; }
.mentor-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.mentor-card { cursor:pointer; transition:box-shadow var(--t-base),transform var(--t-base); }
.mentor-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.mc-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
.mc-av  { width:44px; height:44px; font-size:15px; }
.mc-avail { font-size:9.5px; font-weight:700; padding:2px 8px; border-radius:20px; }
.avail-y { background:var(--grn-lt); color:var(--grn); border:1px solid #6EE7B7; }
.avail-n { background:#F1F5F9; color:var(--tx4); border:1px solid var(--brd); }
.mc-name { font-size:14px; font-weight:700; color:var(--tx); margin-bottom:2px; }
.mc-title { font-size:11.5px; color:var(--tx2); }
.mc-company { font-size:11px; color:var(--tx4); margin-bottom:8px; }
.mc-meta { display:flex; gap:5px; font-size:10.5px; color:var(--tx3); margin-bottom:8px; }
.mc-btn { width:100%; padding:7px; font-size:12px; margin-top:4px; }
.empty-state { text-align:center; padding:48px 20px; }
.modal-overlay { position:fixed; inset:0; background:rgba(18,33,58,.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
.modal-box { background:var(--white); border-radius:var(--r-xl); padding:28px; width:100%; max-width:480px; position:relative; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); }
.modal-close { position:absolute; top:14px; right:14px; background:var(--page); border:1px solid var(--brd); border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; color:var(--tx3); }
.modal-top { display:flex; align-items:flex-start; gap:14px; margin-bottom:16px; }
.modal-av  { width:52px; height:52px; font-size:17px; flex-shrink:0; }
.modal-name { font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--tx); }
.modal-title-s { font-size:12px; color:var(--tx3); margin-top:2px; }
.modal-meta { display:flex; align-items:center; gap:8px; margin-top:6px; font-size:11px; color:var(--tx3); }
.modal-bio { font-size:13px; color:var(--tx2); line-height:1.7; margin-bottom:16px; }
.modal-sec-label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; color:var(--tx3); margin-bottom:6px; }
.modal-actions { display:flex; gap:8px; margin-top:20px; }
.modal-btn { flex:1; padding:9px; font-size:13px; }
.modal-btn:disabled { opacity:.6; cursor:not-allowed; }
.modal-success { margin-top:12px; background:var(--grn-lt); border:1px solid #6EE7B7; color:var(--grn); border-radius:var(--r-md); padding:9px 12px; font-size:12.5px; font-weight:600; text-align:center; }
@media(max-width:900px){ .mentor-grid,.sk-row { grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .mentor-grid { grid-template-columns:1fr; } }
</style>