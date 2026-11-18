<template>
  <div class="pg-wrap">
    <div class="two" style="align-items:flex-start; gap:16px">

      <!-- LEFT: Settings Nav -->
      <div class="pnl set-nav" style="flex:0.5">
        <button
          v-for="tab in tabs" :key="tab.id"
          class="set-nav-btn"
          :class="{ active: activeTab===tab.id }"
          @click="activeTab=tab.id"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- RIGHT: Settings Panel -->
      <div style="flex:1.5; display:flex; flex-direction:column; gap:12px">

        <!-- NOTIFICATIONS -->
        <div class="pnl" v-if="activeTab==='notifications'">
          <div class="sh" style="margin-bottom:14px"><span class="st">Notification Preferences</span></div>
          <div class="tr-row" v-for="item in notifSettings" :key="item.key">
            <div>
              <div class="tr-l">{{ item.label }}</div>
              <div class="tr-s">{{ item.sub }}</div>
            </div>
            <div class="tog" :class="item.on ? 'on' : 'off'" @click="item.on = !item.on">
              <div class="tok"></div>
            </div>
          </div>
        </div>

        <!-- PRIVACY -->
        <div class="pnl" v-if="activeTab==='privacy'">
          <div class="sh" style="margin-bottom:14px"><span class="st">Privacy & Visibility</span></div>
          <div class="tr-row" v-for="item in privacySettings" :key="item.key">
            <div>
              <div class="tr-l">{{ item.label }}</div>
              <div class="tr-s">{{ item.sub }}</div>
            </div>
            <div class="tog" :class="item.on ? 'on' : 'off'" @click="item.on = !item.on">
              <div class="tok"></div>
            </div>
          </div>
        </div>

        <!-- ACCOUNT -->
        <div class="pnl" v-if="activeTab==='account'">
          <div class="sh" style="margin-bottom:14px"><span class="st">Account Settings</span></div>

          <label class="fl">Current Password</label>
          <input class="fi" type="password" placeholder="••••••••" v-model="pwForm.current" />

          <label class="fl">New Password</label>
          <input class="fi" type="password" placeholder="Min. 8 characters" v-model="pwForm.newPw" />

          <label class="fl">Confirm New Password</label>
          <input class="fi" type="password" placeholder="Repeat new password" v-model="pwForm.confirm" />

          <button class="ba" style="padding:9px 20px; font-size:13px; margin-bottom:24px">Update Password</button>

          <div class="danger-zone">
            <div class="dz-title">Danger Zone</div>
            <div class="dz-row">
              <div>
                <div class="dz-label">Deactivate Account</div>
                <div class="dz-sub">Temporarily hide your profile. You can reactivate anytime.</div>
              </div>
              <button class="bo dz-btn">Deactivate</button>
            </div>
            <div class="dz-row">
              <div>
                <div class="dz-label" style="color:var(--coral)">Delete Account</div>
                <div class="dz-sub">Permanently delete your account and all data. This cannot be undone.</div>
              </div>
              <button class="dz-btn dz-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- APPEARANCE -->
        <div class="pnl" v-if="activeTab==='appearance'">
          <div class="sh" style="margin-bottom:14px"><span class="st">Appearance</span></div>
          <div class="tr-row">
            <div>
              <div class="tr-l">Dark Mode</div>
              <div class="tr-s">Coming soon in a future update</div>
            </div>
            <div class="tog off" style="opacity:.4;cursor:not-allowed"><div class="tok"></div></div>
          </div>
          <div class="tr-row">
            <div>
              <div class="tr-l">Compact View</div>
              <div class="tr-s">Reduce spacing and padding across the app</div>
            </div>
            <div class="tog" :class="compact ? 'on' : 'off'" @click="compact=!compact">
              <div class="tok"></div>
            </div>
          </div>
        </div>

        <!-- Save button -->
        <div style="display:flex; justify-content:flex-end" v-if="activeTab !== 'account'">
          <button class="ba" style="padding:8px 24px; font-size:13px" @click="handleSave">Save Settings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('notifications')
const compact   = ref(false)

const tabs = [
  { id:'notifications', icon:'🔔', label:'Notifications' },
  { id:'privacy',       icon:'🔒', label:'Privacy' },
  { id:'account',       icon:'🔑', label:'Account & Security' },
  { id:'appearance',    icon:'🎨', label:'Appearance' },
]

const notifSettings = reactive([
  { key:'n1', label:'Session Reminders',      sub:'Get notified before upcoming mentor sessions',    on:true  },
  { key:'n2', label:'New Messages',           sub:'Notify me when I receive a new message',          on:true  },
  { key:'n3', label:'Opportunity Deadlines',  sub:'Alert me 3 days before opportunity deadlines',   on:true  },
  { key:'n4', label:'Community Activity',     sub:'Notify me when someone replies to my posts',      on:false },
  { key:'n5', label:'New Opportunities',      sub:'Weekly digest of new scholarships and internships',on:true },
  { key:'n6', label:'Mentor Connection Requests', sub:'When a mentor accepts or declines my request', on:true },
])

const privacySettings = reactive([
  { key:'p1', label:'Public Profile',         sub:'Allow other students and mentors to see your profile', on:true  },
  { key:'p2', label:'Show Career Interests',  sub:'Display your career interests on your profile',        on:true  },
  { key:'p3', label:'Show School Name',       sub:'Display your school on your public profile',           on:true  },
  { key:'p4', label:'Allow Mentor Requests',  sub:'Let mentors send you connection requests',             on:true  },
  { key:'p5', label:'Show in Search Results', sub:'Appear when other users search for students',          on:false },
])

const pwForm = reactive({ current:'', newPw:'', confirm:'' })

async function handleSave() {
  await new Promise(r => setTimeout(r, 500))
  // BACKEND READY → await api.patch('/settings', { notifSettings, privacySettings })
  alert('Settings saved!')
}
</script>

<style scoped>
.set-nav { display:flex; flex-direction:column; gap:2px; padding:8px; }
.set-nav-btn {
  display:flex; align-items:center; gap:10px;
  padding:10px 12px; border-radius:var(--r-md);
  background:none; border:none; font-size:13px; font-weight:600;
  color:var(--tx2); cursor:pointer; text-align:left;
  transition:background var(--t-fast), color var(--t-fast);
  width:100%;
}
.set-nav-btn:hover { background:var(--page); color:var(--tx); }
.set-nav-btn.active { background:var(--acc-lt); color:var(--acc); }

.danger-zone { border:1.5px solid #FECACA; border-radius:var(--r-lg); padding:16px; }
.dz-title { font-size:11px; font-weight:700; color:var(--coral); text-transform:uppercase; letter-spacing:.7px; margin-bottom:12px; }
.dz-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid #FEE2E2; }
.dz-row:last-child { border-bottom:none; }
.dz-label { font-size:13px; font-weight:600; color:var(--tx); margin-bottom:2px; }
.dz-sub { font-size:11px; color:var(--tx3); }
.dz-btn { padding:6px 14px; font-size:12px; border-radius:var(--r-sm); flex-shrink:0; }
.dz-delete { background:var(--coral); color:#fff; border:none; font-weight:700; cursor:pointer; }
.dz-delete:hover { background:#c05a24; }

@media(max-width:768px){ .two { flex-direction:column; } .set-nav { flex-direction:row; flex-wrap:wrap; } .set-nav-btn { flex:1; min-width:120px; justify-content:center; } }
</style>