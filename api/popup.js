import apiClient from '~/services/apiClient'

export function show (id) {
  return apiClient.get('/api/popups/' + id)
}
