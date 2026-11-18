import api from './index.js'

// Student — get my connections
export async function getMyConnections() {
  const { data } = await api.get('/connections')
  return data.connections || []
}

// Mentor — get pending requests
export async function getPendingRequests() {
  const { data } = await api.get('/connections/requests')
  return data.requests || []
}

// Mentor — get accepted students
export async function getMyStudents() {
  const { data } = await api.get('/connections/students')
  return data.students || []
}

// Mentor — accept request
export async function acceptRequest(connectionId) {
  const { data } = await api.post(`/connections/${connectionId}/accept`)
  return data
}

// Mentor — decline request
export async function declineRequest(connectionId) {
  const { data } = await api.post(`/connections/${connectionId}/decline`)
  return data
}