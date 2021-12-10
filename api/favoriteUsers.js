import apiClient from '~/services/apiClient'

export function index (q) {
  return apiClient.get('/api/favorite-users' + q)
}

export function store (slug) {
  return apiClient.post('/api/favorite-users/' + slug)
}

export function destroy (slug) {
  return apiClient.delete('/api/favorite-users/' + slug)
}
