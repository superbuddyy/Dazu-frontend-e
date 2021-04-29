const state = {
  assetUrl: 'http://localhost:8000/storage',
  carouselPause: false
}

const mutations = {
  SET_CAROUSEL_PAUSE: (state, carouselState) => {
    state.carouselPause = carouselState
  }
}

const actions = {
  setCarouselPause ({ commit }, data) {
    commit('SET_CAROUSEL_PAUSE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
