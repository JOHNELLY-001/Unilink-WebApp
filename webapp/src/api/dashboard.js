import api from './index.js'

export async function getDashboardStats() {
  const { data } = await api.get('/users/profile')
  const user = data.user
  return {
    profileCompletion:  calculateProfileCompletion(user),
    mentorSessions:     0, // comes from /progress
    opportunitiesViewed: 0,
    communityPosts:     0,
  }
}

export async function getUpcomingSession() {
  const { data } = await api.get('/sessions/upcoming')
  if (!data.session) return null
  const s = data.session
  return {
    id:            s.id,
    mentorName:    `${s.mentorFirstName} ${s.mentorLastName}`,
    mentorInitials:`${s.mentorFirstName?.[0]}${s.mentorLastName?.[0]}`,
    mentorTitle:   s.mentorTitle,
    mentorCompany: s.mentorCompany,
    topic:         s.topic,
    date:          new Date(s.scheduledAt).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    time:          new Date(s.scheduledAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }),
    type:          s.type === 'video' ? 'Video call' : s.type === 'voice' ? 'Voice call' : 'In-person',
  }
}

export async function getRecommendedMentors() {
  const { data } = await api.get('/mentors?limit=3')
  return (data.mentors || []).slice(0, 3).map(m => ({
    id:       m.id,
    initials: `${m.firstName?.[0]}${m.lastName?.[0]}`,
    name:     `${m.firstName} ${m.lastName}`,
    title:    m.title,
    company:  m.company,
    area:     m.field,
    areaTag:  't-b',
    sessions: parseInt(m.sessions) || 0,
  }))
}

export async function getRecentOpportunities() {
  const { data } = await api.get('/opportunities?limit=3')
  return (data.opportunities || []).slice(0, 3).map(o => ({
    id:       o.id,
    icon:     o.icon,
    iconBg:   '#EBF0FF',
    title:    o.title,
    org:      o.org,
    deadline: new Date(o.deadline).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }),
    type:     o.type.charAt(0).toUpperCase() + o.type.slice(1),
    typeTag:  o.type === 'scholarship' ? 't-b' : 't-t',
    daysLeft: o.daysLeft,
    urgent:   o.daysLeft <= 5,
    saved:    o.saved,
  }))
}

export async function getActivityFeed() {
  // Activity is derived from progress data for now
  return []
}

export async function getCareerProgress() {
  const { data } = await api.get('/progress')
  return (data.progress?.sections || []).slice(0, 3).map(s => ({
    label:   s.label,
    percent: s.percent,
    color:   s.label === 'Profile' ? '#3A5BD9'
           : s.label === 'Career Exploration' ? '#0D9488'
           : '#D97706',
  }))
}

export async function getCommunityHighlights() {
  const { data } = await api.get('/community/posts?limit=2')
  return (data.posts || []).slice(0, 2).map(p => ({
    id:       p.id,
    initials: `${p.firstName?.[0]}${p.lastName?.[0]}`,
    name:     `${p.firstName} ${p.lastName}`,
    school:   'UniLink',
    body:     p.body,
    likes:    parseInt(p.likes) || 0,
    time:     timeAgo(p.createdAt),
  }))
}

// ── HELPERS ──
function calculateProfileCompletion(user) {
  if (!user) return 0
  const fields = [
    user.firstName, user.lastName, user.email,
    user.combination, user.school, user.region, user.form,
    user.studentBio || user.mentorBio,
    user.avatarUrl,
  ]
  const done = fields.filter(Boolean).length
  return Math.round((done / fields.length) * 100)
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h    = Math.floor(diff / 3600000)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}