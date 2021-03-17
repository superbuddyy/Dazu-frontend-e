import apiClient from '~/services/apiClient'

export function getFilters () {
  return apiClient.get('/api/search/filters')
}

export function search (query) {
  return apiClient.get('/api/search?' + query)
}
