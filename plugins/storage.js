import createPersistedState from 'vuex-persistedstate'
import cookie from 'cookie'

export default ({ store, req, isDev }) => {
  createPersistedState({
    key: 'dazu',
    paths: ['user'],
    storage: {
      getItem: key => process.client ? this.$cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key],
      setItem: (key, value) => this.$cookies.set(key, value, { expires: 365, secure: !isDev }),
      removeItem: key => this.$cookies.remove(key)
    }
  })(store)
}
