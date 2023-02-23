import apiClient from '~/services/apiClient'

export function getFooterItems () {
  return apiClient.get('/api/footer')
}
