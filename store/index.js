import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import settings from './modules/settings'
import storage from './modules/storage'

Vue.use(Vuex)

export default function () {
  return new Vuex.Store({
    modules: {
      user,
      settings,
      storage
    },
    plugins: []
  })
}
