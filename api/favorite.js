import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/favorites')
}

export function store (offer) {
  return apiClient.post('/api/favorites/' + offer)
}

export function activateNotifications (offer) {
  return apiClient.patch('/api/favorites/' + offer + '/activate')
}

export function deactivateNotifications (offer) {
  return apiClient.patch('/api/favorites/' + offer + '/deactivate')
}

export function destroy (slug) {
  return apiClient.delete('/api/favorites/' + slug)
}
