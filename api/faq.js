import apiClient from '~/services/apiClient'

export function getFaqItems () {
  return apiClient.get('/api/faq')
}
