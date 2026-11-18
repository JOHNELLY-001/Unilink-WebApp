import api from './index.js'

function formatSession(s) {
  if (!s) return null
  return {
    id:               s.id,
    topic:            s.topic,
    scheduledAt:      s.scheduledAt,
    durationMin:      s.durationMin,
    type:             s.type,
    status:           s.status,
    notes:            s.notes,
    studentId:        s.studentId,
    mentorId:         s.mentorId,
    studentName:      `${s.studentFirstName || ''} ${s.studentLastName || ''}`.trim(),
    studentInitials:  `${s.studentFirstName?.[0] || ''}${s.studentLastName?.[0] || ''}`.toUpperCase(),
    studentAvatar:    s.studentAvatar,
    mentorName:       `${s.mentorFirstName || ''} ${s.mentorLastName || ''}`.trim(),
    mentorInitials:   `${s.mentorFirstName?.[0] || ''}${s.mentorLastName?.[0] || ''}`.toUpperCase(),
    mentorAvatar:     s.mentorAvatar,
    mentorTitle:      s.mentorTitle,
    mentorCompany:    s.mentorCompany,
    dateFormatted:    s.scheduledAt
      ? new Date(s.scheduledAt).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
      : '',
    timeFormatted:    s.scheduledAt
      ? new Date(s.scheduledAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })
      : '',
    typeLabel:        s.type === 'video' ? 'Video call' : s.type === 'voice' ? 'Voice call' : 'In-person',
  }
}

export async function getSessions() {
  const { data } = await api.get('/sessions')
  return (data.sessions || []).map(formatSession)
}

export async function getUpcomingSession() {
  const { data } = await api.get('/sessions/upcoming')
  return formatSession(data.session)
}

export async function getUpcomingSessions() {
  const { data } = await api.get('/sessions/upcoming/all')
  return (data.sessions || []).map(formatSession)
}

// Mentor proposes a session to a student
export async function proposeSession({ studentId, topic, scheduledAt, durationMin, type }) {
  const { data } = await api.post('/sessions', { studentId, topic, scheduledAt, durationMin, type })
  return data
}

export async function updateSession(id, payload) {
  const { data } = await api.patch(`/sessions/${id}`, payload)
  return data
}

export async function cancelSession(id) {
  const { data } = await api.delete(`/sessions/${id}`)
  return data
}