import api from './index.js'

export async function getCareers({ field = '', search = '' } = {}) {
  const params = {}
  if (field  && field !== 'All Fields') params.field  = field
  if (search)                           params.search = search
  const { data } = await api.get('/careers', { params })
  return (data.careers || []).map(c => ({
    id:          c.id,
    icon:        c.icon,
    title:       c.title,
    field:       c.field,
    combo:       c.combinations || [],
    salaryMin:   c.salaryMin,
    salaryMax:   c.salaryMax,
    demand:      c.demandLevel,
    duration:    c.duration,
    universities:c.universities || [],
    description: c.description,
    skills:      c.skills || [],
    bg:          fieldBg(c.field),
    color:       fieldColor(c.field),
  }))
}

export async function getCareerFields() {
  const { data } = await api.get('/careers')
  const fields = [...new Set((data.careers || []).map(c => c.field).filter(Boolean))]
  return ['All Fields', ...fields]
}

export async function recordCareerView(careerId) {
  await api.post(`/careers/${careerId}/view`)
}

function fieldBg(field) {
  const map = { 'Technology & Software':'#EBF0FF','Medicine & Health':'#E0F5F3','Law & Legal Services':'#FEF3C7','Engineering':'#FEF0E6','Business & Entrepreneurship':'#D1FAE5','Finance & Banking':'#EBF0FF' }
  return map[field] || '#EBF0FF'
}
function fieldColor(field) {
  const map = { 'Technology & Software':'#3A5BD9','Medicine & Health':'#0D9488','Law & Legal Services':'#D97706','Engineering':'#DC6B2F','Business & Entrepreneurship':'#059669','Finance & Banking':'#3A5BD9' }
  return map[field] || '#3A5BD9'
}