export const state = () => ({
  assetUrl: 'https://api.dazu.pl/storage',
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
