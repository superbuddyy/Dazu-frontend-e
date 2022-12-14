const TokenKey = 'isLogged'

export function isLogged () {
  return this.$cookies.get(TokenKey) === '1'
}

export function setLogged (isLogged) {
  return this.$cookies.set(TokenKey, isLogged)
}

export function removeToken () {
  return this.$cookies.remove(TokenKey)
}
