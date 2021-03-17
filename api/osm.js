import apiClient from '~/services/apiClient'

export function getLocation (address) {
  return apiClient.get('/osm/search?addressdetails=1&format=json&q=' + address)
}

export function getLocationReverse (lat, lon) {
  return apiClient.get(`/osm/reverse?format=json&lat=${lat}&lon=${lon}`)
}
