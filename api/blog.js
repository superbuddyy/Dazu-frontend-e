import apiClient from '~/services/apiClient'

export function lastPost () {
  return apiClient.get('/api/blog/last-post')
}

export function index () {
  return apiClient.get('/api/blog')
}

export function show (id) {
  return apiClient.get('/api/blog/' + id)
}
