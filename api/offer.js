import apiClient from '~/services/apiClient'

export function index () {
  return apiClient.get('/api/offers')
}

export function show (slug) {
  return apiClient.get('/api/offers/' + slug)
}

export function similar (slug) {
  return apiClient.get('/api/offers/' + slug + '/similar')
}

export function getBill (slug) {
  return apiClient.get('/api/offers/bill/' + slug)
}

export function getStats (slug) {
  return apiClient.get('/api/offers/' + slug + '/stats')
}

export function report (slug, data) {
  return apiClient.post('/api/offers/' + slug + '/report', data)
}

export function deactivate (data) {
  return apiClient.patch('/api/offers/deactivate', data)
}

export function refresh (slug, gateway) {
  return apiClient.patch('/api/offers/refresh/' + slug + '?gateway=' + gateway + '?platform=desktop')
}

export function raise (slug, gateway) {
  return apiClient.patch('/api/offers/raise/' + slug + '?gateway=' + gateway + '?platform=desktop')
}

export function store (data) {
  return apiClient.post('/api/offers', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function update (offerSlug, data) {
  return apiClient.post('/api/offers/' + offerSlug, data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function charge (slug, data) {
  return apiClient.post('/api/offers/charge/' + slug, {...data, platform: 'desktop'})
}

export function getImageBlob (url) {
  return apiClient.get('/storage/' + url)
}

export function previewStore (data) {
  return apiClient.post('/api/offers-preview', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function previewUpdate (offerSlug, data) {
  return apiClient.post('/api/offers-preview/' + offerSlug, data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function previewShow (slug) {
  return apiClient.get('/api/offers-preview/' + slug)
}

export function previewMigrate (offerSlug, data) {
  return apiClient.post('/api/migrate/offers-preview/' + offerSlug, data, { headers: { 'Content-Type': 'multipart/form-data' } })
}
