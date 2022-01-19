import apiClient from '~/services/apiClient'

export function sendOfferEmail (slug, data) {
  return apiClient.post('/api/contact/offer/' + slug, data)
}

export function sendProfileEmail (slug, data) {
  return apiClient.post('/api/contact/profile/' + slug, data)
}

export function sendContactForm (data) {
  return apiClient.post('/api/contact/contact-form', data)
}

export function verifyContact (data) {
  return apiClient.post('/api/contact/confirm-contact', data)
}
