import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/subscriptions')
}

export function buy (id, offerSlug, data) {
  return apiClient.post('/api/subscriptions/' + id + '/' + offerSlug, data)
}
