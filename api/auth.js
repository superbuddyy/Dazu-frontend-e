import apiClient from '~/services/apiClient'

export function login (data) {
  return apiClient.post('/api/auth/login', data)
}

export function register (data) {
  return apiClient.post('/api/auth/register', data)
}

export function completeRegistration (data) {
  return apiClient.post('/api/auth/complete-registration', data)
}

export function setPassword (data) {
  return apiClient.post('/api/auth/set-password', data)
}

export function remindPassword (data) {
  return apiClient.post('/api/auth/remind-password', data)
}

export function resendMail (data) {
  return apiClient.post('/api/auth/resend-email', data)
}

export function getUser (data) {
  return apiClient.get('/api/user', data)
}

export function logout () {
  return apiClient.post('/api/auth/logout')
}

export function changePassword (data) {
  return apiClient.patch('/api/auth/change-password', data)
}

export function csrf () {
  return apiClient.get('/api/sanctum/csrf-cookie')
}

export function check () {
  return apiClient.get('/api/auth/check')
}
