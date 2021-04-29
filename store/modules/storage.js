const state = {
  filters: {
    price: {
      max: [],
      min: []
    },
    attributes: {
      metraz: {
        max: [],
        min: []
      }
    }
  }
}

const mutations = {
  SET_FILTERS: (state, filters) => {
    state.filters = filters
  }
}

const actions = {
  setFilters ({ commit }, data) {
    commit('SET_FILTERS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
