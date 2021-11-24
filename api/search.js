import apiClient from '~/services/apiClient'

export function getFilters () {
  return apiClient.get('/api/search/filters')
}

export function search (query) {
  return apiClient.get('/api/search?' + query)
}

export function getrecentsearch () {
  return apiClient.get('/api/recent-search')
}

export function postrecentsearch (data) {
  return apiClient.post('/api/recent-search', data)
}

export function deleterecentsearch () {
  return apiClient.delete('/api/recent-search', '')
}
