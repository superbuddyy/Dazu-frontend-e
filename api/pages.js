import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/pages')
}

export function show (id) {
  return apiClient.get('/api/pages/' + id)
}
