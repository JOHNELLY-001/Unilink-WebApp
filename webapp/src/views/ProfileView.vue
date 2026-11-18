<template>
  <div class="pg-wrap">
    <div class="two" style="align-items:flex-start; gap:16px">

      <!-- LEFT: Profile Card -->
      <div style="flex:0.7; display:flex; flex-direction:column; gap:12px">
        <div class="pnl profile-card">
          <div class="pc-av-wrap">
            <div class="av pc-av">{{ auth.initials }}</div>
            <label class="pc-change-photo" for="avatar-upload">Change photo</label>
            <input id="avatar-upload" type="file" accept="image/*" style="display:none" @change="handleAvatarUpload" />
          </div>
          <div class="pc-name">{{ auth.fullName }}</div>
          <span class="pc-role-badge" :class="auth.isStudent ? 'role-s' : auth.isMentor ? 'role-m' : 'role-a'">
            {{ auth.isStudent ? 'Student' : auth.isMentor ? 'Mentor' : 'Admin' }}
          </span>

          <!-- Student meta -->
          <div class="pc-meta" v-if="auth.isStudent">
            <div class="pc-meta-row" v-if="auth.user?.form"><span>📚</span> {{ auth.user.form }}</div>
            <div class="pc-meta-row" v-if="auth.user?.combination"><span>🔬</span> {{ auth.user.combination }}</div>
            <div class="pc-meta-row" v-if="auth.user?.school"><span>🏫</span> {{ auth.user.school }}</div>
            <div class="pc-meta-row" v-if="auth.user?.region"><span>📍</span> {{ auth.user.region }}</div>
            <div class="pc-meta-row"><span>📧</span> {{ auth.user?.email }}</div>
          </div>

          <!-- Mentor meta -->
          <div class="pc-meta" v-else-if="auth.isMentor">
            <div class="pc-meta-row" v-if="auth.user?.title"><span>💼</span> {{ auth.user.title }}</div>
            <div class="pc-meta-row" v-if="auth.user?.company"><span>🏢</span> {{ auth.user.company }}</div>
            <div class="pc-meta-row" v-if="auth.user?.field"><span>🎯</span> {{ auth.user.field }}</div>
            <div class="pc-meta-row" v-if="auth.user?.availability"><span>🕙</span> {{ auth.user.availability }}</div>
            <div class="pc-meta-row"><span>📧</span> {{ auth.user?.email }}</div>
          </div>

          <div class="pc-bio" v-if="auth.user?.bio || auth.user?.studentBio || auth.user?.mentorBio">
            {{ auth.user?.bio || auth.user?.studentBio || auth.user?.mentorBio }}
          </div>
          <div class="pc-bio empty" v-else>No bio yet. Add one below.</div>
        </div>

        <!-- Student extra cards -->
        <template v-if="auth.isStudent">
          <div class="pnl">
            <div class="sh"><span class="st">Career Interests</span></div>
            <div class="tr" v-if="auth.user?.careerInterests?.length">
              <span class="tg t-b" v-for="i in auth.user.careerInterests" :key="i">{{ i }}</span>
            </div>
            <p v-else style="font-size:12px;color:var(--tx3)">No interests added yet.</p>
          </div>
          <div class="pnl" v-if="auth.user?.targetUniversities?.length">
            <div class="sh"><span class="st">Target Universities</span></div>
            <div class="tr">
              <span class="tg t-t" v-for="u in auth.user.targetUniversities" :key="u">{{ u }}</span>
            </div>
          </div>
        </template>

        <!-- Mentor extra cards -->
        <template v-if="auth.isMentor">
          <div class="pnl">
            <div class="sh"><span class="st">Mentoring Areas</span></div>
            <div class="tr" v-if="auth.user?.mentoringAreas?.length">
              <span class="tg t-t" v-for="a in auth.user.mentoringAreas" :key="a">{{ a }}</span>
            </div>
            <p v-else style="font-size:12px;color:var(--tx3)">No areas listed.</p>
          </div>
          <div class="pnl">
            <div class="sh"><span class="st">Approval Status</span></div>
            <span class="chip-g" v-if="auth.user?.approvalStatus === 'approved'">✅ Approved</span>
            <span class="chip-r" v-else-if="auth.user?.approvalStatus === 'pending'">⏳ Pending Review</span>
            <span class="chip-r" v-else>❌ Rejected</span>
          </div>
        </template>
      </div>

      <!-- RIGHT: Edit Form -->
      <div style="flex:1.3; display:flex; flex-direction:column; gap:12px">
        <div class="pnl">
          <div class="sh" style="margin-bottom:16px">
            <span class="st">Edit Profile</span>
            <button class="ba save-btn" @click="handleSave" :disabled="saving">{{ saving ? 'Saving…' : 'Save Changes' }}</button>
          </div>

          <div class="success-msg" v-if="saved">✅ Profile updated successfully!</div>
          <div class="error-msg"   v-if="saveError">❌ {{ saveError }}</div>

          <!-- SHARED FIELDS -->
          <div class="fr">
            <div><label class="fl">First Name</label><input class="fi" v-model="form.firstName" /></div>
            <div><label class="fl">Last Name</label><input class="fi" v-model="form.lastName" /></div>
          </div>
          <label class="fl">Email</label>
          <input class="fi" type="email" v-model="form.email" disabled style="opacity:.6;cursor:not-allowed" />
          <label class="fl">Phone</label>
          <input class="fi" type="tel" v-model="form.phone" placeholder="+255 7XX XXX XXX" />

          <!-- STUDENT-SPECIFIC FIELDS -->
          <template v-if="auth.isStudent">
            <div class="section-divider">Education</div>
            <div class="fr">
              <div>
                <label class="fl">Form Level</label>
                <select class="fi" v-model="form.form">
                  <option>Form 5</option>
                  <option>Form 6</option>
                </select>
              </div>
              <div>
                <label class="fl">Combination</label>
                <select class="fi" v-model="form.combination">
                  <option v-for="c in combos" :key="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <label class="fl">School</label>
            <input class="fi" v-model="form.school" placeholder="School name" />
            <label class="fl">Region</label>
            <select class="fi" v-model="form.region">
              <option value="">Select region</option>
              <option v-for="r in regions" :key="r">{{ r }}</option>
            </select>
            <div class="section-divider">About You</div>
            <label class="fl">Short Bio</label>
            <textarea class="fi" rows="3" v-model="form.bio" placeholder="Tell mentors about yourself…"></textarea>
            <label class="fl">Goals</label>
            <textarea class="fi" rows="2" v-model="form.goals" placeholder="What do you hope to achieve?"></textarea>
          </template>

          <!-- MENTOR-SPECIFIC FIELDS -->
          <template v-if="auth.isMentor">
            <div class="section-divider">Professional Info</div>
            <label class="fl">Job Title</label>
            <input class="fi" v-model="form.title" placeholder="e.g. Software Engineer" />
            <label class="fl">Company / Institution</label>
            <input class="fi" v-model="form.company" />
            <label class="fl">Field / Industry</label>
            <select class="fi" v-model="form.field">
              <option v-for="f in mentorFields" :key="f">{{ f }}</option>
            </select>
            <div class="fr">
              <div>
                <label class="fl">Years of Experience</label>
                <select class="fi" v-model="form.yearsExperience">
                  <option>1–3 years</option>
                  <option>3–5 years</option>
                  <option>5–10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label class="fl">Availability</label>
                <select class="fi" v-model="form.availability">
                  <option>Weekdays only</option>
                  <option>Weekends only</option>
                  <option>Weekdays &amp; Weekends</option>
                  <option>Evenings only</option>
                </select>
              </div>
            </div>
            <div class="section-divider">Bio &amp; Links</div>
            <label class="fl">Professional Bio</label>
            <textarea class="fi" rows="4" v-model="form.bio" placeholder="Share your journey and expertise…"></textarea>
            <label class="fl">LinkedIn URL</label>
            <input class="fi" v-model="form.linkedIn" placeholder="https://linkedin.com/in/…" />
            <label class="fl">Portfolio / Website</label>
            <input class="fi" v-model="form.portfolio" placeholder="https://yoursite.com" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import api from '../api/index.js'

const auth     = useAuthStore()
const saving   = ref(false)
const saved    = ref(false)
const saveError = ref('')
const uploading = ref(false)

const combos  = ['PCM','PCB','CBG','HGE','HGL','EGM','HKL','ECA']
const regions = ['Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma','Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza','Njombe','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu','Singida','Tabora','Tanga']
const mentorFields = ['Technology & Software','Medicine & Health','Law & Legal Services','Engineering','Business & Entrepreneurship','Finance & Banking','Education & Teaching','Architecture','Agriculture']

const u = auth.user || {}
const form = reactive({
  firstName:       u.firstName    || '',
  lastName:        u.lastName     || '',
  email:           u.email        || '',
  phone:           u.phone        || '',
  bio:             u.bio || u.studentBio || u.mentorBio || '',
  // Student
  form:            u.form         || 'Form 6',
  combination:     u.combination  || '',
  school:          u.school       || '',
  region:          u.region       || '',
  goals:           u.goals        || '',
  // Mentor
  title:           u.title        || '',
  company:         u.company      || '',
  field:           u.field        || '',
  yearsExperience: u.yearsExperience || '',
  availability:    u.availability  || '',
  linkedIn:        u.linkedinUrl   || '',
  portfolio:       u.portfolioUrl  || '',
})

async function handleSave() {
  saving.value   = true
  saved.value    = false
  saveError.value = ''
  try {
    await api.patch('/users/profile', form)
    // Refresh user from server
    const { data } = await api.get('/auth/me')
    auth.user = data.user
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  } catch (err) {
    saveError.value = err?.response?.data?.message || 'Failed to save profile.'
  } finally {
    saving.value = false
  }
}

async function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('avatar', file)
    const { data } = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    auth.user = { ...auth.user, avatarUrl: data.avatarUrl }
  } catch (err) {
    alert(err?.response?.data?.message || 'Upload failed.')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.profile-card { display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px; }
.pc-av-wrap { position:relative; margin-bottom:4px; }
.pc-av { width:64px; height:64px; font-size:22px; }
.pc-change-photo { background:none; border:none; font-size:11px; color:var(--acc); cursor:pointer; font-weight:600; margin-top:4px; display:block; }
.pc-name { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--tx); }
.pc-role-badge { font-size:10px; font-weight:700; padding:2px 10px; border-radius:20px; }
.role-s { background:var(--acc-lt); color:var(--acc); }
.role-m { background:var(--teal-lt); color:var(--teal); }
.role-a { background:var(--gold-lt); color:var(--gold); }
.pc-meta { display:flex; flex-direction:column; gap:5px; width:100%; text-align:left; margin-top:8px; }
.pc-meta-row { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--tx2); }
.pc-bio { font-size:12.5px; color:var(--tx2); line-height:1.6; text-align:left; border-top:1px solid var(--brd); padding-top:10px; width:100%; margin-top:4px; }
.pc-bio.empty { color:var(--tx4); font-style:italic; }
.section-divider { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; color:var(--tx3); padding:12px 0 6px; border-bottom:1px solid var(--brd); margin-bottom:12px; }
.save-btn { padding:6px 16px; font-size:12px; }
.save-btn:disabled { opacity:.6; cursor:not-allowed; }
.success-msg { background:var(--grn-lt); border:1px solid #6EE7B7; color:var(--grn); border-radius:var(--r-md); padding:9px 12px; font-size:12.5px; font-weight:600; margin-bottom:14px; }
.error-msg { background:#FEF2F2; border:1px solid #FECACA; color:#DC2626; border-radius:var(--r-md); padding:9px 12px; font-size:12.5px; margin-bottom:14px; }
@media(max-width:768px){ .two { flex-direction:column; } }
</style>