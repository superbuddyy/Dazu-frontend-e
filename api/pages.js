import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/footers')
}

export function show (id) {
  return apiClient.get('/api/footers/' + id)
}
