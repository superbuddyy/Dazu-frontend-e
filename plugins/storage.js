import createPersistedState from 'vuex-persistedstate'
import cookie from 'cookie'

export default ({ store, req, isDev }) => {
  createPersistedState({
    key: 'dazu',
    paths: ['user'],
    storage: {
      getItem: key => process.client ? app.$cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key],
      setItem: (key, value) => app.$cookies.set(key, value, { expires: 365, secure: !isDev }),
      removeItem: key => app.$cookies.remove(key)
    }
  })(store)
}
