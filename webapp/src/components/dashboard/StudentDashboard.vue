<template>
  <div>
    <!-- HERO -->
    <div class="hero-panel pnl" style="margin-bottom:16px">
      <div class="hp-left">
        <div class="hp-greeting">Good morning 👋</div>
        <h2 class="hp-name">{{ auth.fullName }}</h2>
        <p class="hp-sub">{{ auth.user?.form }} · {{ auth.user?.combination }} · {{ auth.user?.school }}</p>
        <div class="hp-tags">
          <span class="tg t-b" v-for="i in (auth.user?.careerInterests || []).slice(0,3)" :key="i">{{ i }}</span>
        </div>
      </div>
      <div class="hp-right">
        <div class="hp-completion">
          <div class="hpc-top">
            <span class="hpc-label">Profile Completion</span>
            <span class="hpc-val">{{ store.stats?.profileCompletion }}%</span>
          </div>
          <div class="pbw">
            <div class="pb" :style="{ width: store.stats?.profileCompletion + '%', background: 'linear-gradient(to right,var(--acc),var(--teal))' }"></div>
          </div>
          <RouterLink to="/profile" class="hpc-link">Complete your profile →</RouterLink>
        </div>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="sg" style="margin-bottom:16px">
      <div class="pnl stat-card" v-for="s in statCards" :key="s.label">
        <div class="sc-top">
          <div class="sc-ic" :style="{ background: s.bg, color: s.color }">{{ s.icon }}</div>
          <span class="sc-change" v-if="s.change">{{ s.change }}</span>
        </div>
        <div class="sc-val">{{ s.value }}</div>
        <div class="sc-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- ROW 1: Upcoming Session + Activity -->
    <div class="two" style="margin-bottom:16px">
      <div class="pnl">
        <div class="sh"><span class="st">Upcoming Session</span><RouterLink to="/mentors" class="sl">Book another</RouterLink></div>
        <div class="session-card" v-if="store.upcomingSession">
          <div class="ses-top">
            <div class="av ses-av">{{ store.upcomingSession.mentorInitials }}</div>
            <div>
              <div class="ses-name">{{ store.upcomingSession.mentorName }}</div>
              <div class="ses-title">{{ store.upcomingSession.mentorTitle }} · {{ store.upcomingSession.mentorCompany }}</div>
            </div>
          </div>
          <div class="ses-topic">{{ store.upcomingSession.topic }}</div>
          <div class="ses-meta">
            <div class="ses-meta-row"><span>📅</span><span>{{ store.upcomingSession.dateFormatted }}</span></div>
            <div class="ses-meta-row"><span>🕙</span><span>{{ store.upcomingSession.timeFormatted }}</span></div>
            <div class="ses-meta-row"><span>📹</span><span>{{ store.upcomingSession.typeLabel }}</span></div>
          </div>
          <div class="ses-actions">
            <button class="ba ses-btn">Join Session</button>
            <button class="bo ses-btn">Reschedule</button>
          </div>
        </div>
        <div class="no-session" v-else>
          <div style="font-size:32px;margin-bottom:8px">📅</div>
          <div class="no-ses-t">No upcoming sessions</div>
          <div class="no-ses-s">Browse mentors and book your first session.</div>
          <RouterLink to="/mentors" class="ba" style="padding:7px 18px;font-size:12px;margin-top:8px;display:inline-block">Find a Mentor</RouterLink>
        </div>
      </div>

      <div class="pnl">
        <div class="sh"><span class="st">Recent Activity</span></div>
        <div v-if="store.activity.length">
          <div class="ai-act" v-for="item in store.activity" :key="item.id">
            <div class="ad" :style="{ background: item.color }"></div>
            <div>
              <div class="at" v-html="item.html"></div>
              <div class="atm">{{ item.time }}</div>
            </div>
          </div>
        </div>
        <div v-else style="text-align:center;padding:24px 0;font-size:12.5px;color:var(--tx3)">
          No recent activity yet. Start exploring!
        </div>
      </div>
    </div>

    <!-- ROW 2: Opportunities + Career Progress -->
    <div class="two" style="margin-bottom:16px">
      <div class="pnl">
        <div class="sh"><span class="st">Opportunities</span><RouterLink to="/opportunities" class="sl">See all</RouterLink></div>
        <div class="oi" v-for="opp in store.opportunities" :key="opp.id">
          <div class="oi-ic" :style="{ background: opp.iconBg }">{{ opp.icon }}</div>
          <div style="flex:1;min-width:0">
            <div class="oi-t">{{ opp.title }}</div>
            <div class="oi-m">{{ opp.org }}</div>
            <div class="oi-sub" :style="{ color: opp.urgent ? 'var(--coral)' : 'var(--tx3)' }">
              {{ opp.urgent ? '🔴' : '📅' }} Closes {{ opp.deadline }}
              <span v-if="opp.urgent"> — {{ opp.daysLeft }}d left!</span>
            </div>
          </div>
          <div class="cr">
            <span class="tg" :class="opp.typeTag">{{ opp.type }}</span>
            <button class="bo" style="padding:4px 10px;font-size:10.5px;margin-top:4px">Apply</button>
          </div>
        </div>
        <div v-if="!store.opportunities.length" style="text-align:center;padding:20px;font-size:12px;color:var(--tx3)">No opportunities yet.</div>
      </div>

      <div class="pnl">
        <div class="sh"><span class="st">Career Exploration</span><RouterLink to="/careers" class="sl">Explore more</RouterLink></div>
        <div class="cp-list">
          <div class="cp-item" v-for="cp in store.careerProgress" :key="cp.label">
            <div class="cp-top">
              <span class="cp-label">{{ cp.label }}</span>
              <span class="cp-pct">{{ cp.percent }}%</span>
            </div>
            <div class="pbw"><div class="pb" :style="{ width: cp.percent+'%', background: cp.color }"></div></div>
          </div>
        </div>
        <RouterLink to="/careers" class="ba" style="width:100%;display:block;text-align:center;padding:8px;font-size:12px;margin-top:12px">Take Career Assessment</RouterLink>
      </div>
    </div>

    <!-- ROW 3: Recommended Mentors + Community -->
    <div class="two">
      <div class="pnl">
        <div class="sh"><span class="st">Recommended Mentors</span><RouterLink to="/mentors" class="sl">See all</RouterLink></div>
        <div class="mentor-row" v-for="m in store.mentors" :key="m.id">
          <div class="av mr-av">{{ m.initials }}</div>
          <div class="mr-info">
            <div class="mr-name">{{ m.name }}</div>
            <div class="mr-title">{{ m.title }} · {{ m.company }}</div>
            <div class="mr-meta">
              <span class="tg t-b" style="font-size:9px">{{ m.area }}</span>
              <span class="mr-sessions">{{ m.sessions }} sessions</span>
            </div>
          </div>
          <button class="bt mr-btn">Connect</button>
        </div>
        <div v-if="!store.mentors.length" style="text-align:center;padding:20px;font-size:12px;color:var(--tx3)">No mentors yet.</div>
      </div>

      <div class="pnl">
        <div class="sh"><span class="st">Community</span><RouterLink to="/community" class="sl">View all</RouterLink></div>
        <div class="comm-post" v-for="post in store.community" :key="post.id">
          <div class="comm-top-row">
            <div class="av cp-av">{{ post.initials }}</div>
            <div>
              <div class="cp-name">{{ post.name }}</div>
              <div class="cp-meta">{{ post.time }}</div>
            </div>
          </div>
          <p class="cp-body">{{ post.body }}</p>
          <div class="cp-footer">
            <button class="cp-like-btn">❤️ {{ post.likes }}</button>
            <button class="cp-reply-btn">Reply</button>
          </div>
        </div>
        <div v-if="!store.community.length" style="text-align:center;padding:20px;font-size:12px;color:var(--tx3)">No posts yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard.js'
import { useAuthStore } from '../../stores/auth.js'

const store = useDashboardStore()
const auth  = useAuthStore()

const statCards = computed(() => [
  { icon:'🧑‍🏫', label:'Mentor Sessions',  value: store.stats?.mentorSessions   ?? '—', change:'+1 this week', bg:'#EBF0FF', color:'#3A5BD9' },
  { icon:'🎯',   label:'Careers Explored', value: store.stats?.opportunitiesViewed ?? '—', change:'+3 this week', bg:'#E0F5F3', color:'#0D9488' },
  { icon:'📋',   label:'Opportunities',    value: '6 active',                              change: null,          bg:'#FEF3C7', color:'#D97706' },
  { icon:'💬',   label:'Community Posts',  value: store.stats?.communityPosts   ?? '—', change: null,          bg:'#D1FAE5', color:'#059669' },
])
</script>

<style scoped>
.hero-panel { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.hp-greeting { font-size:12px; color:var(--tx3); font-weight:600; margin-bottom:2px; }
.hp-name { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--tx); margin-bottom:3px; }
.hp-sub  { font-size:12px; color:var(--tx3); margin-bottom:8px; }
.hp-tags { display:flex; flex-wrap:wrap; gap:5px; }
.hp-right { flex-shrink:0; min-width:220px; }
.hp-completion { background:var(--page); border:1px solid var(--brd); border-radius:var(--r-md); padding:13px 15px; }
.hpc-top { display:flex; justify-content:space-between; margin-bottom:6px; }
.hpc-label { font-size:11.5px; font-weight:600; color:var(--tx2); }
.hpc-val   { font-size:12px; font-weight:700; color:var(--acc); }
.hpc-link  { font-size:11px; color:var(--acc); font-weight:600; margin-top:6px; display:block; }
.stat-card { display:flex; flex-direction:column; gap:4px; }
.sc-top  { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.sc-ic   { width:32px; height:32px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:16px; }
.sc-change { font-size:9.5px; font-weight:700; color:var(--grn); }
.sc-val  { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--tx); }
.sc-label{ font-size:11px; color:var(--tx3); }
.session-card { background:linear-gradient(135deg,#f0f4ff,#e8f8f6); border:1px solid var(--brd); border-radius:var(--r-md); padding:14px; }
.ses-top  { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.ses-av   { width:36px; height:36px; font-size:12px; }
.ses-name { font-size:13px; font-weight:700; color:var(--tx); }
.ses-title{ font-size:10.5px; color:var(--tx3); }
.ses-topic{ font-size:12.5px; font-weight:600; color:var(--acc); margin-bottom:10px; }
.ses-meta { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
.ses-meta-row { display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--tx2); }
.ses-actions { display:flex; gap:7px; }
.ses-btn { padding:6px 14px; font-size:11.5px; flex:1; }
.no-session { text-align:center; padding:20px 0; }
.no-ses-t { font-size:13px; font-weight:700; color:var(--tx); margin-bottom:4px; }
.no-ses-s { font-size:12px; color:var(--tx3); }
.cp-list { display:flex; flex-direction:column; gap:14px; }
.cp-top  { display:flex; justify-content:space-between; margin-bottom:4px; }
.cp-label{ font-size:12.5px; font-weight:600; color:var(--tx); }
.cp-pct  { font-size:11.5px; font-weight:700; color:var(--tx3); }
.mentor-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--brd); }
.mentor-row:last-child { border-bottom:none; }
.mr-av   { width:32px; height:32px; font-size:11px; flex-shrink:0; }
.mr-info { flex:1; min-width:0; }
.mr-name { font-size:12.5px; font-weight:700; color:var(--tx); }
.mr-title{ font-size:10.5px; color:var(--tx3); margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mr-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.mr-rating  { font-size:10px; color:var(--gold); font-weight:700; }
.mr-sessions{ font-size:10px; color:var(--tx4); }
.mr-btn  { padding:5px 12px; font-size:10.5px; flex-shrink:0; }
.comm-post { padding:11px 0; border-bottom:1px solid var(--brd); }
.comm-post:last-child { border-bottom:none; }
.comm-top-row { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.cp-av   { width:28px; height:28px; font-size:10px; flex-shrink:0; }
.cp-name { font-size:12px; font-weight:700; color:var(--tx); }
.cp-meta { font-size:10px; color:var(--tx4); }
.cp-body { font-size:12px; color:var(--tx2); line-height:1.6; margin-bottom:8px; }
.cp-footer { display:flex; align-items:center; gap:10px; }
.cp-like-btn,.cp-reply-btn { background:none; border:none; font-size:11px; color:var(--tx3); cursor:pointer; font-weight:600; padding:0; }
.cp-like-btn:hover { color:var(--coral); }
.cp-reply-btn:hover { color:var(--acc); }
@media(max-width:768px){ .hero-panel { flex-direction:column; } .hp-right { width:100%; } }
</style>