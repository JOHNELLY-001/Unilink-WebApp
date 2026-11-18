import api from './index.js'

export async function getResources({ category = '', type = '', search = '' } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  if (type     && type     !== 'All') params.type     = type.toLowerCase()
  if (search)                         params.search   = search
  const { data } = await api.get('/resources', { params })
  return (data.resources || []).map(r => ({
    id:          r.id,
    icon:        r.icon,
    title:       r.title,
    type:        r.type ? r.type.charAt(0).toUpperCase() + r.type.slice(1) : '',
    category:    r.category,
    description: r.description,
    size:        r.sizeMb     ? `${r.sizeMb} MB`  : null,
    duration:    r.durationMin ? `${r.durationMin} min` : null,
    readTime:    r.readTimeMin ? `${r.readTimeMin} min` : null,
    downloads:   r.downloadCount || 0,
    views:       r.viewCount     || 0,
    fileUrl:     r.fileUrl,
    externalUrl: r.externalUrl,
  }))
}

export async function getResourceCategories() {
  return ['All', 'University Guides', 'Career Guides', 'Application Tips', 'Study Skills']
}

export async function getResourceTypes() {
  return ['All', 'PDF', 'Video', 'Article']
}

export async function recordView(resourceId) {
  await api.post(`/resources/${resourceId}/view`)
}