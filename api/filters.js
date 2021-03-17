import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/favorite-filters')
}

export function store (data) {
  return apiClient.post('/api/favorite-filters', data)
}
