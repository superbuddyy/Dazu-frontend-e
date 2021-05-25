export const state = () => ({
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
})

export const mutations = {
  SET_FILTERS: (state, filters) => {
    state.filters = filters
  }
}

export const actions = {
  setFilters ({ commit }, data) {
    commit('SET_FILTERS', data)
  }
}
