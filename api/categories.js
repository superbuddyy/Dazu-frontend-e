import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/categories')
}
