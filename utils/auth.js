const TokenKey = 'isLogged'

export function isLogged () {
  return app.$cookies.get(TokenKey) === '1'
}

export function setLogged (isLogged) {
  return app.$cookies.set(TokenKey, isLogged)
}

export function removeToken () {
  return app.$cookies.remove(TokenKey)
}
