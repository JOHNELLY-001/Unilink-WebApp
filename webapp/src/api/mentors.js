import api from './index.js'

export async function getMentors({ field = '', search = '' } = {}) {
  const params = {}
  if (field  && field  !== 'All Fields') params.field  = field
  if (search)                            params.search = search
  const { data } = await api.get('/mentors', { params })
  return (data.mentors || []).map(m => ({
    id:        m.id,
    initials:  `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase(),
    name:      `${m.firstName} ${m.lastName}`,
    title:     m.title,
    company:   m.company,
    field:     m.field,
    areas:     m.mentoringAreas || [],
    sessions:  parseInt(m.sessions) || 0,
    available: m.available,
    type:      m.sessionType,
    bio:       m.bio,
  }))
}

export async function getMentorFields() {
  const { data } = await api.get('/mentors')
  const fields = [...new Set((data.mentors || []).map(m => m.field).filter(Boolean))]
  return ['All Fields', ...fields]
}

export async function requestConnection(mentorId) {
  const { data } = await api.post(`/mentors/${mentorId}/connect`)
  return data
}