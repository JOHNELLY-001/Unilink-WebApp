import api from './index.js'

export async function getOpportunities({ type = '', field = '', search = '' } = {}) {
  const params = {}
  if (type   && type  !== 'All Types')  params.type   = type.toLowerCase()
  if (field  && field !== 'All Fields') params.field  = field
  if (search)                           params.search = search
  const { data } = await api.get('/opportunities', { params })
  return (data.opportunities || []).map(mapOpp)
}

export async function getOpportunityTypes() {
  return ['All Types', 'Scholarship', 'Internship', 'Programme', 'Event']
}

export async function getOpportunityFields() {
  return ['All Fields', 'Technology', 'Health', 'Business', 'Law', 'Engineering']
}

export async function toggleSaveOpportunity(id) {
  // Check current saved state not available here — caller handles optimistic UI
  try {
    await api.post(`/opportunities/${id}/save`)
    return { saved: true }
  } catch {
    await api.delete(`/opportunities/${id}/save`)
    return { saved: false }
  }
}

export async function saveOpportunity(id) {
  const { data } = await api.post(`/opportunities/${id}/save`)
  return data
}

export async function unsaveOpportunity(id) {
  const { data } = await api.delete(`/opportunities/${id}/save`)
  return data
}

export async function getSavedOpportunities() {
  const { data } = await api.get('/opportunities/saved')
  return (data.opportunities || []).map(mapOpp)
}

function mapOpp(o) {
  const type = o.type ? o.type.charAt(0).toUpperCase() + o.type.slice(1) : ''
  return {
    id:       o.id,
    icon:     o.icon,
    iconBg:   typeIconBg(o.type),
    title:    o.title,
    org:      o.org,
    deadline: new Date(o.deadline).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }),
    daysLeft: o.daysLeft,
    type,
    typeTag:  typeTagClass(o.type),
    field:    o.field,
    description:  o.description,
    requirements: o.requirements || [],
    link:     o.link,
    saved:    o.saved || false,
    urgent:   parseInt(o.daysLeft) <= 5,
  }
}

function typeIconBg(type) {
  const map = { scholarship:'#EBF0FF', internship:'#E0F5F3', programme:'#FEF3C7', event:'#D1FAE5' }
  return map[type] || '#EBF0FF'
}
function typeTagClass(type) {
  const map = { scholarship:'t-b', internship:'t-t', programme:'t-g', event:'t-n' }
  return map[type] || 't-b'
}