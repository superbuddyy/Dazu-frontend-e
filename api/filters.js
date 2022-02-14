import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/favorite-filters')
}

export function store (data) {
  return apiClient.post('/api/favorite-filters', data)
}

export function update (data) {
  return apiClient.put('/api/favorite-filters', data)
}

export function destroy (data) {
  return apiClient.delete('/api/favorite-filters/' + data)
}
