export const state = () => ({
  type: 'sell'
})

export const mutations = {
  setType (state, type) {
    state.type = type
  }
}

export const actions = {
  setType ({ commit }, type) {
    commit('setType', type)
  }
}
