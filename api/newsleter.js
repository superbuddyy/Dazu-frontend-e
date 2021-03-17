import apiClient from '~/services/apiClient'

export function store (email) {
  return apiClient.post('/api/newsletter/', email)
}

export function active (token) {
  return apiClient.patch('/api/newsletter/', token)
}
