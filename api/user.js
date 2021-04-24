import apiClient from '~/services/apiClient'

export function getProfile () {
  return apiClient.get('/api/user/profile')
}

export function getProfilePage (id) {
  return apiClient.get('/api/profile/' + id)
}

export function getOffers () {
  return apiClient.get('/api/user/offers')
}

export function updateProfile (data) {
  return apiClient.put('/api/user/profile', data)
}

export function toggleNewsletter () {
  return apiClient.patch('/api/user/profile/newsletter')
}

export function softDelete (data) {
  return apiClient.delete('/api/user', data)
}

export function storeAgent (data) {
  return apiClient.post('/api/user/agents', data)
}

export function storeAvatar (data) {
  return apiClient.post('/api/user/avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function deleteAvatar (type) {
  return apiClient.delete('/api/user/avatar?avatar_type=' + type)
}

export function getAgents () {
  return apiClient.get('/api/user/agents')
}

export function getMyNotifications () {
  return apiClient.get('/api/user/notifications')
}

export function deactivateNotifications () {
  return apiClient.patch('/api/user/notifications/deactivate')
}

export function deleteAgent (id) {
  return apiClient.delete('/api/user/agents/' + id)
}

export function getPhone (id, recaptcha) {
  return apiClient.post(`/api/user/${id}/phone`, recaptcha)
}
