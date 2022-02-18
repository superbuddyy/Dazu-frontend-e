export const state = () => ({
  assetUrl: process.env.VUE_APP_ASSETS_BASE_URL || 'https://api.dazu.pl/storage',
  carouselPause: false
})

export const mutations = {
  SET_CAROUSEL_PAUSE: (state, carouselState) => {
    state.carouselPause = carouselState
  }
}

export const actions = {
  setCarouselPause ({ commit }, data) {
    commit('SET_CAROUSEL_PAUSE', data)
  }
}
