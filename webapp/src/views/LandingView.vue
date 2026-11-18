<template>
  <div class="landing">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-h">
          Your path from <span class="hero-accent">classroom</span>
          <br>to <span class="hero-accent">career</span> starts here.
        </h1>
        <p class="hero-sub">
          UniLink connects Advenced level secondary school students with mentors, career guidance,
          university pathways, and opportunities — all in one platform.
        </p>
        <div class="hero-cta">
          <RouterLink to="/register" class="ba hero-btn-main">Get Started Free</RouterLink>
          <RouterLink to="/login" class="bo hero-btn-sec">Log in</RouterLink>
        </div>
        <div class="hero-stats">
          <div class="hero-stat" v-for="s in heroStats" :key="s.label">
            <div class="hero-stat-n">{{ s.value }}</div>
            <div class="hero-stat-l">{{ s.label }}</div>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hv-card hv-c1">
          <div class="hv-av">JM</div>
          <div>
            <div class="hv-name">James Mwangi</div>
            <div class="hv-role">Form 6, PCM · Kilakala</div>
          </div>
        </div>
        <div class="hv-card hv-c2">
          <div style="font-size:20px">🎯</div>
          <div>
            <div class="hv-name">Career Match</div>
            <div class="hv-role">Software Engineering — 94% fit</div>
          </div>
        </div>
        <div class="hv-card hv-c3">
          <div style="font-size:20px">📝</div>
          <div>
            <div class="hv-name">Session Booked</div>
            <div class="hv-role">with Dr. Amina Hassan</div>
          </div>
        </div>
        <div class="hv-bg-circle hv-bg1"></div>
        <div class="hv-bg-circle hv-bg2"></div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="hiw" id="careers">
      <div class="section-inner">
        <div class="sec-badge">How it works</div>
        <h2 class="sec-title">From sign-up to success in 4 steps</h2>
        <div class="hiw-grid">
          <div class="hiw-step" v-for="(step, i) in howItWorks" :key="i">
            <div class="hiw-num">{{ i + 1 }}</div>
            <div class="hiw-ic">{{ step.icon }}</div>
            <div class="hiw-label">{{ step.title }}</div>
            <div class="hiw-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CAREERS PREVIEW -->
    <section class="careers-sec">
      <div class="section-inner">
        <div class="sec-badge">Explore Careers</div>
        <h2 class="sec-title">Discover what suits your combination</h2>
        <p class="sec-sub">Browse 50+ career paths with salary insights, required qualifications, and top universities in Tanzania and beyond.</p>
        <div class="careers-grid">
          <div class="career-card" v-for="c in careerPreviews" :key="c.title">
            <div class="cc-ic" :style="{ background: c.bg, color: c.color }">{{ c.icon }}</div>
            <div class="cc-title">{{ c.title }}</div>
            <div class="cc-combo">{{ c.combo }}</div>
          </div>
        </div>
        <div class="sec-cta">
          <RouterLink to="/register" class="ba">Explore All Careers</RouterLink>
        </div>
      </div>
    </section>

    <!-- MENTORS -->
    <section class="mentors-sec" id="mentors">
      <div class="section-inner">
        <div class="sec-badge">Mentorship</div>
        <h2 class="sec-title">Learn from professionals who've been there</h2>
        <p class="sec-sub">Connect 1-on-1 with verified Tanzanian professionals across every field.</p>
        <div class="mentors-grid">
          <div class="mentor-card" v-for="m in featuredMentors" :key="m.name">
            <div class="mc-av">{{ m.initials }}</div>
            <div class="mc-name">{{ m.name }}</div>
            <div class="mc-title">{{ m.title }}</div>
            <div class="mc-company">{{ m.company }}</div>
            <div class="tr" style="justify-content:center; margin-top:8px">
              <span class="tg t-b">{{ m.area }}</span>
            </div>
          </div>
        </div>
        <div class="sec-cta">
          <RouterLink to="/register" class="ba">Connect with a Mentor</RouterLink>
        </div>
      </div>
    </section>

    <!-- OPPORTUNITIES -->
    <section class="opp-sec" id="opportunities">
      <div class="section-inner opp-inner">
        <div class="opp-text">
          <div class="sec-badge">Opportunities</div>
          <h2 class="sec-title" style="text-align:left">Scholarships, internships & university fairs</h2>
          <p class="sec-sub" style="text-align:left">Never miss a deadline. UniLink aggregates opportunities from universities, NGOs, and companies across Tanzania and internationally.</p>
          <div class="opp-list">
            <div class="opp-item" v-for="o in opportunities" :key="o.title">
              <div class="oi-ic-sm" :style="{ background: o.bg }">{{ o.icon }}</div>
              <div>
                <div class="opp-item-title">{{ o.title }}</div>
                <div class="opp-item-sub">{{ o.org }} · {{ o.deadline }}</div>
              </div>
              <span class="tg t-b opp-chip">{{ o.type }}</span>
            </div>
          </div>
          <RouterLink to="/register" class="ba" style="margin-top:20px; display:inline-block">
            View All Opportunities
          </RouterLink>
        </div>
        <div class="opp-visual">
          <div class="opp-stat-card" v-for="s in oppStats" :key="s.label">
            <div class="osc-n" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="osc-l">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMUNITY -->
    <section class="community-sec" id="community">
      <div class="section-inner">
        <div class="sec-badge">Community</div>
        <h2 class="sec-title">You're not alone on this journey</h2>
        <p class="sec-sub">Join a growing community of Form 5 & 6 students sharing experiences, tips, and support.</p>
        <div class="comm-cards">
          <div class="comm-card" v-for="p in communityPosts" :key="p.name">
            <div class="comm-top">
              <div class="av">{{ p.initials }}</div>
              <div>
                <div class="comm-name">{{ p.name }}</div>
                <div class="comm-meta">{{ p.school }} · {{ p.time }}</div>
              </div>
            </div>
            <p class="comm-body">{{ p.body }}</p>
            <div class="comm-likes">❤️ {{ p.likes }} students found this helpful</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="final-cta">
      <div class="section-inner">
        <h2 class="fcta-title">Ready to map your future?</h2>
        <p class="fcta-sub">Join thousands of Tanzanian students already using UniLink to plan, connect, and grow.</p>
        <RouterLink to="/register" class="ba fcta-btn">Create Free Account</RouterLink>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">U</div>
          <span class="footer-name">UniLink</span>
        </div>
        <div class="footer-copy">© {{ new Date().getFullYear() }} UniLink. Empowering Tanzania's next generation.</div>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
const heroStats = [
  { value: '2,400+', label: 'Students' },
  { value: '180+',   label: 'Mentors' },
  { value: '50+',    label: 'Career Paths' },
  { value: '300+',   label: 'Opportunities' },
]

const howItWorks = [
  { icon: '', title: 'Sign up',       desc: 'Create your account as a student or mentor in under 2 minutes.' },
  { icon: '', title: 'Personalize',   desc: 'Tell us your combination, interests, and goals. We tailor everything for you.' },
  { icon: '', title: 'Connect',      desc: 'Book sessions with verified mentors in your field of interest.' },
  { icon: '', title: 'Grow',          desc: 'Track your progress, apply for opportunities, and build your path.' },
]

const careerPreviews = [
  { icon: '💻', title: 'Software Engineering', combo: 'PCM / PCB', bg: '#EBF0FF', color: '#3A5BD9' },
  { icon: '🩺', title: 'Medicine',             combo: 'PCB',       bg: '#E0F5F3', color: '#0D9488' },
  { icon: '⚖️', title: 'Law',                  combo: 'HGE / HGL', bg: '#FEF3C7', color: '#D97706' },
  { icon: '🏗️', title: 'Civil Engineering',    combo: 'PCM',       bg: '#FEF0E6', color: '#DC6B2F' },
  { icon: '📊', title: 'Data Science',          combo: 'PCM / EGM', bg: '#D1FAE5', color: '#059669' },
  { icon: '💼', title: 'Business & MBA',        combo: 'ECA / HGE', bg: '#EBF0FF', color: '#3A5BD9' },
]

const featuredMentors = [
  { initials: 'AH', name: 'Dr. Amina Hassan',  title: 'Medical Officer',        company: 'Muhimbili Hospital',    area: 'Medicine' },
  { initials: 'JK', name: 'Joseph Kimaro',     title: 'Software Engineer',      company: 'Vodacom Tanzania',      area: 'Tech' },
  { initials: 'FN', name: 'Fatuma Ngowi',      title: 'Business Consultant',    company: 'Zanzibar Ventures',     area: 'Business' },
  { initials: 'DM', name: 'David Msangi',      title: 'Advocate',               company: 'TLS Dar es Salaam',     area: 'Law' },
]

const opportunities = [
  { icon: '🎓', title: 'UDSM Undergraduate Scholarship', org: 'University of Dar es Salaam', deadline: 'Closes Mar 30', type: 'Scholarship', bg: '#EBF0FF' },
  { icon: '💼', title: 'CRDB Bank Internship Programme', org: 'CRDB Bank',                  deadline: 'Closes Apr 15', type: 'Internship',  bg: '#E0F5F3' },
  { icon: '🌍', title: 'African Leadership Academy',     org: 'ALA',                         deadline: 'Closes May 1',  type: 'Programme',   bg: '#FEF3C7' },
]

const oppStats = [
  { value: '120+', label: 'Active Scholarships', color: '#3A5BD9' },
  { value: '80+',  label: 'Internship Listings',  color: '#0D9488' },
  { value: '40+',  label: 'University Events',    color: '#D97706' },
  { value: '60+',  label: 'Open Programmes',      color: '#059669' },
]

const communityPosts = [
  { initials: 'TM', name: 'Tumaini Mwamba', school: 'Tabora Boys', time: '2h ago', body: 'Just got my PCM results and I\'m not sure if I qualify for UDSM Computer Science. Anyone know the minimum cut-off this year?', likes: 24 },
  { initials: 'SK', name: 'Salma Kimaro',   school: 'Jangwani Girls', time: '5h ago', body: 'My mentor session with Dr. Amina was amazing. She helped me understand exactly what MUHAS looks for in applicants. Highly recommend connecting!', likes: 41 },
  { initials: 'GM', name: 'George Mushi',   school: 'Mzumbe', time: '1d ago', body: 'The CRDB internship deadline is next week — don\'t sleep on it. I applied last year and it was the best experience of my pre-university life.', likes: 67 },
]
</script>

<style scoped>
.landing { background: var(--white); }

/* ── SHARED SECTION ── */
.section-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 32px;
}

.sec-badge {
  display: inline-block;
  background: var(--acc-lt);
  color: var(--acc);
  border: 1px solid var(--acc-md);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.sec-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--tx);
  line-height: 1.3;
  margin-bottom: 10px;
  text-align: center;
}

.sec-sub {
  font-size: 14px;
  color: var(--tx3);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 28px;
  text-align: center;
}

.sec-cta { text-align: center; margin-top: 28px; }

/* ── HERO ── */
.hero {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 64px 40px;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 520px;
}

.hero-inner { flex: 1; }

.hero-badge {
  display: inline-block;
  background: var(--acc-lt);
  color: var(--acc);
  border: 1px solid var(--acc-md);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 18px;
}

.hero-h {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  color: var(--tx);
  line-height: 1.2;
  margin-bottom: 16px;
}

.hero-accent {
  color: var(--acc);
  position: relative;
}

.hero-sub {
  font-size: 15px;
  color: var(--tx3);
  line-height: 1.7;
  max-width: 480px;
  margin-bottom: 28px;
}

.hero-cta { display: flex; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
.hero-btn-main { padding: 11px 24px; font-size: 14px; border-radius: var(--r-md); }
.hero-btn-sec  { padding: 11px 24px; font-size: 14px; border-radius: var(--r-md); }

.hero-stats { display: flex; gap: 28px; flex-wrap: wrap; }
.hero-stat-n { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--acc); }
.hero-stat-l { font-size: 11.5px; color: var(--tx3); }

/* ── HERO VISUAL ── */
.hero-visual {
  flex: 1;
  position: relative;
  min-height: 320px;
  max-width: 400px;
}

.hv-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-lg);
  position: absolute;
}

.hv-av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.hv-name { font-size: 13px; font-weight: 700; color: var(--tx); }
.hv-role { font-size: 11px; color: var(--tx3); }

.hv-c1 { top: 10px; left: 0; width: 240px; }
.hv-c2 { top: 110px; right: 0; width: 230px; }
.hv-c3 { top: 210px; left: 20px; width: 230px; }

.hv-bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.07;
  z-index: -1;
}
.hv-bg1 { width: 280px; height: 280px; background: var(--acc); top: -40px; right: -40px; }
.hv-bg2 { width: 180px; height: 180px; background: var(--teal); bottom: 0; left: -20px; }

/* ── HOW IT WORKS ── */
.hiw { padding: 80px 0; background: var(--page); }
.hiw-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.hiw-step {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 24px 18px;
  text-align: center;
}
.hiw-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--acc);
  color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.hiw-ic { font-size: 28px; margin-bottom: 10px; }
.hiw-label { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--tx); margin-bottom: 6px; }
.hiw-desc { font-size: 12px; color: var(--tx3); line-height: 1.6; }

/* ── CAREERS ── */
.careers-sec { padding: 80px 0; }
.careers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.career-card {
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: box-shadow var(--t-base), transform var(--t-base);
}
.career-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.cc-ic {
  width: 40px; height: 40px;
  border-radius: var(--r-md);
  font-size: 20px;
  display: flex; align-items: center; justify-content: center;
}
.cc-title { font-size: 13.5px; font-weight: 700; color: var(--tx); }
.cc-combo { font-size: 11px; color: var(--tx3); }

/* ── MENTORS ── */
.mentors-sec { padding: 80px 0; background: var(--page); }
.mentors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.mentor-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 20px 16px;
  text-align: center;
}
.mc-av {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  color: #fff;
  font-weight: 700; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.mc-name { font-size: 13px; font-weight: 700; color: var(--tx); }
.mc-title { font-size: 11.5px; color: var(--tx2); margin-top: 2px; }
.mc-company { font-size: 11px; color: var(--tx4); }

/* ── OPPORTUNITIES ── */
.opp-sec { padding: 80px 0; }
.opp-inner { display: flex; gap: 60px; align-items: flex-start; }
.opp-text { flex: 1.2; }
.opp-list { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
.opp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--page);
  border: 1px solid var(--brd);
  border-radius: var(--r-md);
  padding: 10px 12px;
}
.oi-ic-sm {
  width: 32px; height: 32px;
  border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.opp-item-title { font-size: 12.5px; font-weight: 700; color: var(--tx); }
.opp-item-sub { font-size: 11px; color: var(--tx3); }
.opp-chip { margin-left: auto; flex-shrink: 0; }

.opp-visual {
  flex: 0.8;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.opp-stat-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 20px 16px;
  text-align: center;
}
.osc-n { font-family: var(--font-display); font-size: 26px; font-weight: 700; }
.osc-l { font-size: 11.5px; color: var(--tx3); margin-top: 4px; }

/* ── COMMUNITY ── */
.community-sec { padding: 80px 0; background: var(--page); }
.comm-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 28px; }
.comm-card {
  background: var(--white);
  border: 1px solid var(--brd);
  border-radius: var(--r-lg);
  padding: 18px;
}
.comm-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.comm-name { font-size: 13px; font-weight: 700; color: var(--tx); }
.comm-meta { font-size: 10.5px; color: var(--tx3); }
.comm-body { font-size: 13px; color: var(--tx2); line-height: 1.6; margin-bottom: 12px; }
.comm-likes { font-size: 11px; color: var(--tx4); }

/* ── FINAL CTA ── */
.final-cta {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--sb) 0%, #1a3560 100%);
  text-align: center;
}
.fcta-title {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}
.fcta-sub { font-size: 14px; color: rgba(255,255,255,0.65); margin-bottom: 28px; }
.fcta-btn { padding: 12px 32px; font-size: 14.5px; border-radius: var(--r-md); }

/* ── FOOTER ── */
.footer {
  background: var(--sb);
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 24px 40px;
}
.footer-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.footer-brand { display: flex; align-items: center; gap: 8px; }
.footer-logo {
  width: 26px; height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--acc), var(--teal));
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; color: #fff;
}
.footer-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: #fff; }
.footer-copy { font-size: 11.5px; color: rgba(255,255,255,0.4); }
.footer-links { display: flex; gap: 16px; }
.footer-links a { font-size: 12px; color: rgba(255,255,255,0.5); transition: color var(--t-fast); }
.footer-links a:hover { color: #fff; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .hero { flex-direction: column; padding: 48px 24px; text-align: center; }
  .hero-sub { max-width: 100%; }
  .hero-cta { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .hiw-grid { grid-template-columns: repeat(2, 1fr); }
  .careers-grid { grid-template-columns: repeat(2, 1fr); }
  .mentors-grid { grid-template-columns: repeat(2, 1fr); }
  .opp-inner { flex-direction: column; }
  .comm-cards { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .sec-title { font-size: 22px; }
  .hero-h { font-size: 28px; }
  .hiw-grid { grid-template-columns: 1fr; }
  .careers-grid { grid-template-columns: 1fr; }
  .mentors-grid { grid-template-columns: repeat(2, 1fr); }
  .opp-visual { grid-template-columns: 1fr 1fr; }
  .section-inner { padding: 0 16px; }
}
</style>