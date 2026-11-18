import api from './index.js'

export async function getPosts({ category = '' } = {}) {
  const params = {}
  if (category && category !== 'All') params.category = category
  const { data } = await api.get('/community/posts', { params })
  return (data.posts || []).map(p => ({
    id:       p.id,
    initials: `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase(),
    name:     `${p.firstName} ${p.lastName}`,
    school:   'UniLink',
    time:     timeAgo(p.createdAt),
    body:     p.body,
    likes:    parseInt(p.likes)   || 0,
    replies:  parseInt(p.replies) || 0,
    category: p.category,
    liked:    p.liked || false,
  }))
}

export async function getCategories() {
  return ['All', 'Mentorship', 'Opportunities', 'Academics', 'University', 'Careers', 'General']
}

export async function likePost(id) {
  const { data } = await api.post(`/community/posts/${id}/like`)
  return data
}

export async function unlikePost(id) {
  const { data } = await api.delete(`/community/posts/${id}/like`)
  return data
}

export async function createPost({ body, category }) {
  const { data } = await api.post('/community/posts', { body, category })
  const p = data.post
  return {
    id:       p.id,
    initials: '',
    name:     '',
    school:   'UniLink',
    time:     'Just now',
    body:     p.body,
    likes:    0,
    replies:  0,
    category: p.category,
    liked:    false,
  }
}

export async function deletePost(id) {
  const { data } = await api.delete(`/community/posts/${id}`)
  return data
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