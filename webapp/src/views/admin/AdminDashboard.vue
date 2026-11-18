<template>
  <div class="pg-wrap">

    <!-- TABS -->
    <div class="admin-tabs pnl" style="margin-bottom:16px; padding:6px 8px">
      <button v-for="tab in tabs" :key="tab.id" class="admin-tab" :class="{ active: activeTab===tab.id }" @click="activeTab=tab.id">
        {{ tab.label }}
        <span class="tab-badge" v-if="tab.badge && tab.badge > 0">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- ── OVERVIEW ── -->
    <div v-if="activeTab==='overview'">
      <div class="sg" style="margin-bottom:16px">
        <div class="pnl stat-card" v-for="s in statCards" :key="s.label">
          <div class="sc-top"><div class="sc-ic" :style="{ background:s.bg, color:s.color }">{{ s.icon }}</div></div>
          <div class="sc-val">{{ s.value }}</div>
          <div class="sc-label">{{ s.label }}</div>
        </div>
      </div>
      <div class="two">
        <div class="pnl">
          <div class="sh"><span class="st">Recent Users</span></div>
          <div class="user-row" v-for="u in users.slice(0,5)" :key="u.id">
            <div class="av ur-av">{{ `${u.firstName?.[0]||''}${u.lastName?.[0]||''}`.toUpperCase() }}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12.5px;font-weight:700;color:var(--tx)">{{ u.firstName }} {{ u.lastName }}</div>
              <div style="font-size:10.5px;color:var(--tx3)">{{ u.email }}</div>
            </div>
            <span class="tg" :class="u.role==='student' ? 't-b' : 't-t'">{{ u.role }}</span>
          </div>
        </div>
        <div class="pnl">
          <div class="sh"><span class="st">Pending Mentor Approvals</span><span class="tg t-c" v-if="pendingMentors.length">{{ pendingMentors.length }}</span></div>
          <div v-if="!pendingMentors.length" class="empty-mini">✅ No pending approvals</div>
          <div class="mentor-row" v-for="m in pendingMentors.slice(0,3)" :key="m.id">
            <div class="av mr-av">{{ `${m.firstName?.[0]||''}${m.lastName?.[0]||''}`.toUpperCase() }}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12.5px;font-weight:700;color:var(--tx)">{{ m.firstName }} {{ m.lastName }}</div>
              <div style="font-size:10.5px;color:var(--tx3)">{{ m.title }} · {{ m.field }}</div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="bt mr-btn" @click="handleApprove(m)">✓</button>
              <button class="bo mr-btn" @click="handleReject(m)">✕</button>
            </div>
          </div>
          <button v-if="pendingMentors.length > 3" class="sl" style="margin-top:8px" @click="activeTab='mentors'">View all {{ pendingMentors.length }} →</button>
        </div>
      </div>
    </div>

    <!-- ── MENTOR APPROVALS ── -->
    <div v-if="activeTab==='mentors'">
      <div v-if="!pendingMentors.length" class="empty-state pnl"><div style="font-size:36px;margin-bottom:8px">✅</div><div class="st">No pending approvals</div></div>
      <div v-else class="approval-list">
        <div class="approval-card pnl" v-for="m in pendingMentors" :key="m.id">
          <div class="ac-top">
            <div class="av ac-av">{{ `${m.firstName?.[0]||''}${m.lastName?.[0]||''}`.toUpperCase() }}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:700;color:var(--tx)">{{ m.firstName }} {{ m.lastName }}</div>
              <div style="font-size:11.5px;color:var(--tx3)">{{ m.email }}</div>
              <div style="font-size:11.5px;color:var(--tx2);margin-top:2px">{{ m.title }} · {{ m.company }}</div>
            </div>
            <div style="display:flex;gap:7px">
              <button class="bt" style="padding:7px 16px;font-size:12px" @click="handleApprove(m)">Approve</button>
              <button class="bo" style="padding:7px 16px;font-size:12px" @click="handleReject(m)">Reject</button>
            </div>
          </div>
          <div class="ac-body">
            <div class="ac-field"><span>Field</span><strong>{{ m.field }}</strong></div>
            <div class="ac-field"><span>Experience</span><strong>{{ m.yearsExperience }}</strong></div>
            <div class="ac-field"><span>Session type</span><strong>{{ m.sessionType }}</strong></div>
            <div class="ac-field"><span>Availability</span><strong>{{ m.availability }}</strong></div>
          </div>
          <div style="margin-top:10px">
            <div class="ac-label">Mentoring Areas</div>
            <div class="tr"><span class="tg t-b" v-for="a in (m.mentoringAreas||[])" :key="a">{{ a }}</span></div>
          </div>
          <div style="margin-top:10px" v-if="m.bio">
            <div class="ac-label">Bio</div>
            <p style="font-size:12.5px;color:var(--tx2);line-height:1.6">{{ m.bio }}</p>
          </div>
          <div style="margin-top:8px" v-if="m.linkedinUrl">
            <a :href="m.linkedinUrl" target="_blank" style="font-size:12px;color:var(--acc)">LinkedIn Profile →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- ── USERS ── -->
    <div v-if="activeTab==='users'">
      <div class="pnl filter-bar" style="margin-bottom:14px">
        <div class="fb-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="fb-input" placeholder="Search users…" v-model="userSearch" />
        </div>
        <div class="fb-fields">
          <button v-for="r in ['All','student','mentor','admin']" :key="r" class="fb-field-btn" :class="{ active: userRoleFilter===r }" @click="userRoleFilter=r">{{ r }}</button>
        </div>
      </div>
      <div class="pnl">
        <table class="users-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td><div style="display:flex;align-items:center;gap:8px"><div class="av" style="width:26px;height:26px;font-size:9px">{{ `${u.firstName?.[0]||''}${u.lastName?.[0]||''}`.toUpperCase() }}</div>{{ u.firstName }} {{ u.lastName }}</div></td>
              <td style="font-size:11.5px;color:var(--tx3)">{{ u.email }}</td>
              <td><span class="tg" :class="u.role==='student'?'t-b':u.role==='mentor'?'t-t':'t-g'">{{ u.role }}</span></td>
              <td style="font-size:11px;color:var(--tx4)">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
              <td><span class="chip-g" v-if="u.isActive">Active</span><span class="chip-r" v-else>Inactive</span></td>
              <td><button class="bo" style="padding:3px 10px;font-size:10.5px" @click="toggleUser(u)">{{ u.isActive ? 'Deactivate' : 'Activate' }}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── CAREERS ── -->
    <div v-if="activeTab==='careers'">
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
        <button class="ba" style="padding:8px 18px;font-size:13px" @click="openCareerModal()">+ Add Career</button>
      </div>
      <div class="pnl">
        <div class="content-row" v-for="c in careers" :key="c.id">
          <span style="font-size:20px">{{ c.icon }}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--tx)">{{ c.title }}</div>
            <div style="font-size:11px;color:var(--tx3)">{{ c.field }} · {{ c.demand_level }} demand</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="bo" style="padding:4px 12px;font-size:11px" @click="openCareerModal(c)">Edit</button>
            <button class="bo" style="padding:4px 12px;font-size:11px;color:var(--coral);border-color:var(--coral)" @click="deleteCareer(c)">Delete</button>
          </div>
        </div>
        <div v-if="!careers.length" class="empty-mini">No careers added yet.</div>
      </div>
    </div>

    <!-- ── OPPORTUNITIES ── -->
    <div v-if="activeTab==='opportunities'">
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
        <button class="ba" style="padding:8px 18px;font-size:13px" @click="openOppModal()">+ Add Opportunity</button>
      </div>
      <div class="pnl">
        <div class="content-row" v-for="o in opportunities" :key="o.id">
          <span style="font-size:20px">{{ o.icon }}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--tx)">{{ o.title }}</div>
            <div style="font-size:11px;color:var(--tx3)">{{ o.org }} · {{ new Date(o.deadline).toLocaleDateString() }}</div>
          </div>
          <span class="tg t-b" style="text-transform:capitalize">{{ o.type }}</span>
          <div style="display:flex;gap:6px;margin-left:8px">
            <button class="bo" style="padding:4px 12px;font-size:11px" @click="openOppModal(o)">Edit</button>
            <button class="bo" style="padding:4px 12px;font-size:11px;color:var(--coral);border-color:var(--coral)" @click="deleteOpp(o)">Delete</button>
          </div>
        </div>
        <div v-if="!opportunities.length" class="empty-mini">No opportunities added yet.</div>
      </div>
    </div>

    <!-- ── RESOURCES ── -->
    <div v-if="activeTab==='resources'">
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
        <button class="ba" style="padding:8px 18px;font-size:13px" @click="openResourceModal()">+ Upload Resource</button>
      </div>
      <div class="pnl">
        <div class="content-row" v-for="r in adminResources" :key="r.id">
          <span style="font-size:20px">{{ r.icon }}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--tx)">{{ r.title }}</div>
            <div style="font-size:11px;color:var(--tx3)">{{ r.category }} · {{ r.type }}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="bo" style="padding:4px 12px;font-size:11px;color:var(--coral);border-color:var(--coral)" @click="deleteResource(r)">Delete</button>
          </div>
        </div>
        <div v-if="!adminResources.length" class="empty-mini">No resources yet.</div>
      </div>
    </div>

    <!-- ── COMMUNITY ── -->
    <div v-if="activeTab==='community'">
      <div class="pnl">
        <div class="sh"><span class="st">All Posts</span></div>
        <div class="content-row" v-for="p in communityPosts" :key="p.id">
          <div class="av" style="width:30px;height:30px;font-size:10px;flex-shrink:0">{{ `${p.firstName?.[0]||''}${p.lastName?.[0]||''}`.toUpperCase() }}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12.5px;font-weight:700;color:var(--tx)">{{ p.firstName }} {{ p.lastName }} <span class="tg t-b" style="font-size:9px;margin-left:4px">{{ p.role }}</span></div>
            <div style="font-size:12px;color:var(--tx2);margin-top:2px">{{ p.body.slice(0,120) }}{{ p.body.length > 120 ? '…' : '' }}</div>
            <div style="font-size:10.5px;color:var(--tx4);margin-top:3px">❤️ {{ p.likes }} · 💬 {{ p.replies }} · {{ new Date(p.createdAt).toLocaleDateString() }}</div>
          </div>
          <button class="bo" style="padding:4px 12px;font-size:11px;color:var(--coral);border-color:var(--coral);flex-shrink:0" @click="deletePost(p)">Delete</button>
        </div>
        <div v-if="!communityPosts.length" class="empty-mini">No posts yet.</div>
      </div>
    </div>

    <!-- ── CAREER MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="careerModal" @click.self="careerModal=false">
        <div class="modal-box">
          <button class="modal-close" @click="careerModal=false">✕</button>
          <h2 class="modal-title">{{ editingCareer?.id ? 'Edit Career' : 'Add Career' }}</h2>
          <div class="fr"><div><label class="fl">Icon (emoji)</label><input class="fi" v-model="careerForm.icon" placeholder="💻" /></div><div><label class="fl">Title</label><input class="fi" v-model="careerForm.title" placeholder="Software Engineering" /></div></div>
          <label class="fl">Field</label>
          <select class="fi" v-model="careerForm.field">
            <option v-for="f in careerFields" :key="f">{{ f }}</option>
          </select>
          <div class="fr">
            <div><label class="fl">Demand Level</label>
              <select class="fi" v-model="careerForm.demandLevel">
                <option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
              </select>
            </div>
            <div><label class="fl">Duration</label><input class="fi" v-model="careerForm.duration" placeholder="3–4 years" /></div>
          </div>
          <div class="fr">
            <div><label class="fl">Min Salary (TZS)</label><input class="fi" type="number" v-model="careerForm.salaryMin" /></div>
            <div><label class="fl">Max Salary (TZS)</label><input class="fi" type="number" v-model="careerForm.salaryMax" /></div>
          </div>
          <label class="fl">Description</label>
          <textarea class="fi" rows="3" v-model="careerForm.description"></textarea>
          <label class="fl">Combinations (comma separated)</label>
          <input class="fi" v-model="careerForm.combinationsStr" placeholder="PCM, PCB" />
          <label class="fl">Universities (comma separated)</label>
          <input class="fi" v-model="careerForm.universitiesStr" placeholder="UDSM, NM-AIST" />
          <label class="fl">Skills (comma separated)</label>
          <input class="fi" v-model="careerForm.skillsStr" placeholder="Programming, Maths" />
          <button class="ba" style="width:100%;padding:10px;font-size:13px" @click="saveCareer" :disabled="submitting">{{ submitting ? 'Saving…' : 'Save Career' }}</button>
        </div>
      </div>
    </Teleport>

    <!-- ── OPPORTUNITY MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="oppModal" @click.self="oppModal=false">
        <div class="modal-box">
          <button class="modal-close" @click="oppModal=false">✕</button>
          <h2 class="modal-title">{{ editingOpp?.id ? 'Edit Opportunity' : 'Add Opportunity' }}</h2>
          <div class="fr"><div><label class="fl">Icon</label><input class="fi" v-model="oppForm.icon" placeholder="🎓" /></div><div><label class="fl">Type</label><select class="fi" v-model="oppForm.type"><option>scholarship</option><option>internship</option><option>programme</option><option>event</option></select></div></div>
          <label class="fl">Title</label><input class="fi" v-model="oppForm.title" />
          <label class="fl">Organisation</label><input class="fi" v-model="oppForm.org" />
          <div class="fr"><div><label class="fl">Deadline</label><input class="fi" type="date" v-model="oppForm.deadline" /></div><div><label class="fl">Field</label><input class="fi" v-model="oppForm.field" placeholder="All Fields" /></div></div>
          <label class="fl">Description</label><textarea class="fi" rows="3" v-model="oppForm.description"></textarea>
          <label class="fl">Link</label><input class="fi" v-model="oppForm.link" placeholder="https://…" />
          <label class="fl">Requirements (comma separated)</label><input class="fi" v-model="oppForm.requirementsStr" />
          <button class="ba" style="width:100%;padding:10px;font-size:13px" @click="saveOpp" :disabled="submitting">{{ submitting ? 'Saving…' : 'Save Opportunity' }}</button>
        </div>
      </div>
    </Teleport>

    <!-- ── RESOURCE MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="resourceModal" @click.self="resourceModal=false">
        <div class="modal-box">
          <button class="modal-close" @click="resourceModal=false">✕</button>
          <h2 class="modal-title">Upload Resource</h2>
          <div class="fr"><div><label class="fl">Icon</label><input class="fi" v-model="resourceForm.icon" placeholder="📄" /></div><div><label class="fl">Type</label><select class="fi" v-model="resourceForm.type"><option>pdf</option><option>video</option><option>article</option></select></div></div>
          <label class="fl">Title</label><input class="fi" v-model="resourceForm.title" />
          <label class="fl">Category</label>
          <select class="fi" v-model="resourceForm.category">
            <option>University Guides</option><option>Career Guides</option><option>Application Tips</option><option>Study Skills</option>
          </select>
          <label class="fl">Description</label><textarea class="fi" rows="2" v-model="resourceForm.description"></textarea>
          <div v-if="resourceForm.type !== 'video'">
            <label class="fl">Upload File (PDF or Image)</label>
            <input type="file" class="fi" accept=".pdf,image/*" @change="handleFileChange" style="padding:6px" />
          </div>
          <div v-else>
            <label class="fl">External Video URL</label>
            <input class="fi" v-model="resourceForm.externalUrl" placeholder="https://youtube.com/…" />
            <label class="fl">Duration (minutes)</label>
            <input class="fi" type="number" v-model="resourceForm.durationMin" />
          </div>
          <div class="success-msg" v-if="resourceUploaded">✅ Resource uploaded successfully!</div>
          <button class="ba" style="width:100%;padding:10px;font-size:13px;margin-top:4px" @click="saveResource" :disabled="submitting">{{ submitting ? 'Uploading…' : 'Upload Resource' }}</button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import api from '../../api/index.js'

const activeTab = ref('overview')
const stats     = ref({})
const users     = ref([])
const pendingMentors = ref([])
const careers   = ref([])
const opportunities = ref([])
const adminResources = ref([])
const communityPosts = ref([])
const submitting = ref(false)
const userSearch = ref('')
const userRoleFilter = ref('All')

// Modals
const careerModal   = ref(false)
const oppModal      = ref(false)
const resourceModal = ref(false)
const resourceUploaded = ref(false)
const editingCareer = ref(null)
const editingOpp    = ref(null)
const selectedFile  = ref(null)

const careerFields = ['Technology & Software','Medicine & Health','Law & Legal Services','Engineering','Business & Entrepreneurship','Finance & Banking','Education & Teaching','Architecture','Agriculture']

const careerForm = reactive({ icon:'', title:'', field:'', demandLevel:'High', duration:'', salaryMin:'', salaryMax:'', description:'', combinationsStr:'', universitiesStr:'', skillsStr:'' })
const oppForm    = reactive({ icon:'🎓', title:'', org:'', type:'scholarship', deadline:'', field:'All Fields', description:'', link:'', requirementsStr:'' })
const resourceForm = reactive({ icon:'📄', title:'', type:'pdf', category:'', description:'', externalUrl:'', durationMin:'', readTimeMin:'' })

const tabs = computed(() => [
  { id:'overview',      label:'Overview' },
  { id:'mentors',       label:'Mentor Approvals', badge: pendingMentors.value.length },
  { id:'users',         label:'Users' },
  { id:'careers',       label:'Careers' },
  { id:'opportunities', label:'Opportunities' },
  { id:'resources',     label:'Resources' },
  { id:'community',     label:'Community' },
])

const statCards = computed(() => [
  { icon:'👥', label:'Total Users',         value: stats.value.totalUsers        || 0, bg:'#EBF0FF', color:'#3A5BD9' },
  { icon:'🎓', label:'Students',            value: stats.value.totalStudents     || 0, bg:'#E0F5F3', color:'#0D9488' },
  { icon:'🧑‍🏫', label:'Active Mentors',     value: stats.value.activeMentors     || 0, bg:'#FEF3C7', color:'#D97706' },
  { icon:'⏳', label:'Pending Approvals',   value: stats.value.pendingApprovals  || 0, bg:'#FEF0E6', color:'#DC6B2F' },
  { icon:'📋', label:'Active Opportunities',value: stats.value.activeOpps        || 0, bg:'#D1FAE5', color:'#059669' },
  { icon:'✅', label:'Sessions Completed',  value: stats.value.sessionsCompleted || 0, bg:'#EBF0FF', color:'#3A5BD9' },
  { icon:'💬', label:'Community Posts',     value: stats.value.communityPosts    || 0, bg:'#E0F5F3', color:'#0D9488' },
])

const filteredUsers = computed(() => {
  let list = [...users.value]
  if (userRoleFilter.value !== 'All') list = list.filter(u => u.role === userRoleFilter.value)
  if (userSearch.value) list = list.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.value.toLowerCase())
  )
  return list
})

onMounted(async () => {
  const [s, u, m, c, o, r, cp] = await Promise.all([
    api.get('/admin/stats'),
    api.get('/admin/users'),
    api.get('/admin/mentors/pending'),
    api.get('/admin/careers'),
    api.get('/admin/opportunities'),
    api.get('/admin/resources'),
    api.get('/admin/community/posts'),
  ])
  stats.value         = s.data.stats
  users.value         = u.data.users
  pendingMentors.value = m.data.mentors
  careers.value       = c.data.careers
  opportunities.value = o.data.opportunities
  adminResources.value = r.data.resources
  communityPosts.value = cp.data.posts
})

async function handleApprove(m) {
  await api.post(`/admin/mentors/${m.id}/approve`)
  pendingMentors.value = pendingMentors.value.filter(p => p.id !== m.id)
  stats.value.pendingApprovals--; stats.value.activeMentors++
}

async function handleReject(m) {
  await api.post(`/admin/mentors/${m.id}/reject`)
  pendingMentors.value = pendingMentors.value.filter(p => p.id !== m.id)
  stats.value.pendingApprovals--
}

async function toggleUser(u) {
  await api.patch(`/admin/users/${u.id}/toggle`)
  u.isActive = !u.isActive
}

function openCareerModal(career = null) {
  editingCareer.value = career
  Object.assign(careerForm, {
    icon: career?.icon || '', title: career?.title || '',
    field: career?.field || '', demandLevel: career?.demand_level || 'High',
    duration: career?.duration || '', salaryMin: career?.salary_min || '',
    salaryMax: career?.salary_max || '', description: career?.description || '',
    combinationsStr: (career?.combinations || []).join(', '),
    universitiesStr: (career?.universities || []).join(', '),
    skillsStr: (career?.skills || []).join(', '),
  })
  careerModal.value = true
}

async function saveCareer() {
  submitting.value = true
  const payload = {
    icon: careerForm.icon, title: careerForm.title, field: careerForm.field,
    demandLevel: careerForm.demandLevel, duration: careerForm.duration,
    salaryMin: parseInt(careerForm.salaryMin) || null,
    salaryMax: parseInt(careerForm.salaryMax) || null,
    description: careerForm.description,
    combinations: careerForm.combinationsStr.split(',').map(s=>s.trim()).filter(Boolean),
    universities: careerForm.universitiesStr.split(',').map(s=>s.trim()).filter(Boolean),
    skills: careerForm.skillsStr.split(',').map(s=>s.trim()).filter(Boolean),
  }
  try {
    if (editingCareer.value?.id) {
      const { data } = await api.patch(`/admin/careers/${editingCareer.value.id}`, payload)
      const idx = careers.value.findIndex(c => c.id === editingCareer.value.id)
      if (idx !== -1) careers.value[idx] = data.career
    } else {
      const { data } = await api.post('/admin/careers', payload)
      careers.value.unshift(data.career)
    }
    careerModal.value = false
  } finally { submitting.value = false }
}

async function deleteCareer(c) {
  if (!confirm(`Delete "${c.title}"?`)) return
  await api.delete(`/admin/careers/${c.id}`)
  careers.value = careers.value.filter(x => x.id !== c.id)
}

function openOppModal(opp = null) {
  editingOpp.value = opp
  Object.assign(oppForm, {
    icon: opp?.icon || '🎓', title: opp?.title || '', org: opp?.org || '',
    type: opp?.type || 'scholarship',
    deadline: opp?.deadline ? opp.deadline.split('T')[0] : '',
    field: opp?.field || 'All Fields', description: opp?.description || '',
    link: opp?.link || '',
    requirementsStr: (opp?.requirements || []).join(', '),
  })
  oppModal.value = true
}

async function saveOpp() {
  submitting.value = true
  const payload = { ...oppForm, requirements: oppForm.requirementsStr.split(',').map(s=>s.trim()).filter(Boolean) }
  delete payload.requirementsStr
  try {
    if (editingOpp.value?.id) {
      const { data } = await api.patch(`/admin/opportunities/${editingOpp.value.id}`, payload)
      const idx = opportunities.value.findIndex(o => o.id === editingOpp.value.id)
      if (idx !== -1) opportunities.value[idx] = data.opportunity
    } else {
      const { data } = await api.post('/admin/opportunities', payload)
      opportunities.value.unshift(data.opportunity)
    }
    oppModal.value = false
  } finally { submitting.value = false }
}

async function deleteOpp(o) {
  if (!confirm(`Delete "${o.title}"?`)) return
  await api.delete(`/admin/opportunities/${o.id}`)
  opportunities.value = opportunities.value.filter(x => x.id !== o.id)
}

function openResourceModal() { resourceUploaded.value = false; Object.assign(resourceForm, { icon:'📄', title:'', type:'pdf', category:'', description:'', externalUrl:'', durationMin:'' }); selectedFile.value = null; resourceModal.value = true }

function handleFileChange(e) { selectedFile.value = e.target.files[0] }

async function saveResource() {
  submitting.value = true
  resourceUploaded.value = false
  try {
    const fd = new FormData()
    Object.entries(resourceForm).forEach(([k,v]) => { if (v) fd.append(k, v) })
    if (selectedFile.value) fd.append('file', selectedFile.value)
    const { data } = await api.post('/admin/resources', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    adminResources.value.unshift(data.resource)
    resourceUploaded.value = true
    setTimeout(() => { resourceModal.value = false }, 1500)
  } finally { submitting.value = false }
}

async function deleteResource(r) {
  if (!confirm(`Delete "${r.title}"?`)) return
  await api.delete(`/admin/resources/${r.id}`)
  adminResources.value = adminResources.value.filter(x => x.id !== r.id)
}

async function deletePost(p) {
  if (!confirm('Delete this post?')) return
  await api.delete(`/admin/community/${p.id}`)
  communityPosts.value = communityPosts.value.filter(x => x.id !== p.id)
}
</script>

<style scoped>
.admin-tabs { display:flex; flex-wrap:wrap; gap:4px; }
.admin-tab { padding:7px 14px; border-radius:var(--r-md); border:none; background:none; font-size:12.5px; font-weight:600; color:var(--tx3); cursor:pointer; transition:all var(--t-fast); position:relative; }
.admin-tab:hover { background:var(--page); color:var(--tx); }
.admin-tab.active { background:var(--acc-lt); color:var(--acc); }
.tab-badge { position:absolute; top:4px; right:4px; background:var(--coral); color:#fff; font-size:8px; font-weight:700; width:14px; height:14px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.stat-card { display:flex; flex-direction:column; gap:4px; }
.sc-top { display:flex; align-items:center; margin-bottom:6px; }
.sc-ic  { width:32px; height:32px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:16px; }
.sc-val { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--tx); }
.sc-label { font-size:11px; color:var(--tx3); }
.user-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--brd); }
.user-row:last-child { border-bottom:none; }
.ur-av { width:28px; height:28px; font-size:9px; flex-shrink:0; }
.mentor-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--brd); }
.mentor-row:last-child { border-bottom:none; }
.mr-av { width:32px; height:32px; font-size:11px; flex-shrink:0; }
.mr-btn { padding:5px 10px; font-size:11px; }
.approval-list { display:flex; flex-direction:column; gap:12px; }
.approval-card {}
.ac-top { display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; }
.ac-av  { width:48px; height:48px; font-size:16px; flex-shrink:0; }
.ac-body { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; background:var(--page); border:1px solid var(--brd); border-radius:var(--r-md); padding:12px; }
.ac-field { display:flex; flex-direction:column; gap:2px; }
.ac-field span { font-size:10px; color:var(--tx4); text-transform:uppercase; letter-spacing:.5px; }
.ac-field strong { font-size:12.5px; color:var(--tx); }
.ac-label { font-size:10px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.6px; margin-bottom:5px; }
.filter-bar { display:flex; flex-direction:column; gap:10px; }
.fb-search { display:flex; align-items:center; gap:8px; background:var(--page); border:1.5px solid var(--brd); border-radius:var(--r-md); padding:0 12px; height:36px; }
.fb-search:focus-within { border-color:var(--acc); }
.fb-input { background:none; border:none; outline:none; font-size:13px; color:var(--tx); flex:1; }
.fb-fields { display:flex; flex-wrap:wrap; gap:6px; }
.fb-field-btn { padding:5px 13px; border-radius:20px; border:1.5px solid var(--brd); background:var(--white); font-size:11.5px; font-weight:600; color:var(--tx2); cursor:pointer; transition:all var(--t-fast); }
.fb-field-btn:hover { border-color:var(--acc-md); color:var(--acc); }
.fb-field-btn.active { border-color:var(--acc); background:var(--acc-lt); color:var(--acc); }
.users-table { width:100%; border-collapse:collapse; }
.users-table th { font-size:10.5px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.5px; padding:8px 10px; text-align:left; border-bottom:1px solid var(--brd); }
.users-table td { font-size:12.5px; color:var(--tx); padding:9px 10px; border-bottom:1px solid var(--brd); }
.users-table tr:last-child td { border-bottom:none; }
.content-row { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--brd); }
.content-row:last-child { border-bottom:none; }
.empty-mini { text-align:center; padding:20px 0; font-size:12.5px; color:var(--tx3); }
.empty-state { text-align:center; padding:48px 20px; }
.modal-overlay { position:fixed; inset:0; background:rgba(18,33,58,.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
.modal-box { background:var(--white); border-radius:var(--r-xl); padding:28px; width:100%; max-width:520px; position:relative; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); }
.modal-close { position:absolute; top:14px; right:14px; background:var(--page); border:1px solid var(--brd); border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; }
.modal-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--tx); margin-bottom:20px; }
.success-msg { background:var(--grn-lt); border:1px solid #6EE7B7; color:var(--grn); border-radius:var(--r-md); padding:10px; font-size:12.5px; font-weight:600; text-align:center; margin-bottom:10px; }
</style>