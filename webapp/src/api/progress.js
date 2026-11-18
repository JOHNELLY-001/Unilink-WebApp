import api from './index.js'

export async function getProgress() {
  const { data } = await api.get('/progress')
  return data.progress
}