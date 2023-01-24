import createPersistedState from 'vuex-persistedstate'

export default ({ store, req, isDev }) => {
  if (process.browser) {
    createPersistedState({
      key: 'dazu',
      paths: ['user'],
      storage: {
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: key => localStorage.removeItem(key)
      }
    })(store)
  }
}
