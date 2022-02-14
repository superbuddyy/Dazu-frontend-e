import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/transactions')
}

export function invoice (id) {
  return apiClient.get('/api/transactions/' + id)
}
