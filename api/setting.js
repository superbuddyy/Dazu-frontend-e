import apiClient from '~/services/apiClient'

export function getSettings () {
  return apiClient.get('/api/settings')
}
