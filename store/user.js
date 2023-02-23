import { login, register, completeRegistration, getUser, logout } from '@/api/auth'
import { updateProfile } from '@/api/user'
import { isLogged, setLogged, removeToken } from '@/utils/auth'


export const state = () => ({
  id: null,
  user: null,
  token: isLogged(),
  isLogged: false,
  loginFirst: false,
  name: '',
  email: '',
  nip: '',
  avatar: '',
  videoAvatar: '',
  default_avatar: '',
  city: '',
  street: '',
  zip_code: '',
  country: '',
  newsletter: false,
  introduction: '',
  roles: [],
  permissions: [],
  subscriptions: null
})

export const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_NIP: (state, nip) => {
    state.nip = nip
  },
  SET_NEWSLETTER: (state, newsletter) => {
    state.newsletter = newsletter
  },
  SET_ADDRESS: (state, address) => {
    state.city = address.city
    state.street = address.street
    state.country = address.country
    state.zip_code = address.zip_code
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_VIDEO_AVATAR: (state, avatar) => {
    state.videoAvatar = avatar
  },
  SET_DEFAULT_AVATAR: (state, avatar) => {
    state.default_avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_IS_LOGGED: (state, isLogged) => {
    state.isLogged = isLogged
  },
  SET_LOGIN_FIRST: (state, loginFirst) => {
    state.loginFirst = loginFirst
  }
}

export const actions = {
  setLoginFirst ({ commit }, status) {
    commit('SET_LOGIN_FIRST', status)
  },

  // user login
  login ({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password })
        .then((response) => {
          setLogged('1')
          console.log(response)
          commit('SET_NEWSLETTER', response.data.newsletter)
          commit('SET_NIP', response.data.nip)
          commit('SET_ADDRESS', response.data.address)
          commit('SET_ROLES', response.data.roles)
          commit('SET_PERMISSIONS', response.data.permissions)
          commit('SET_NAME', response.data.name)
          commit('SET_EMAIL', response.data.email)
          commit('SET_PHONE', response.data.phone)
          commit('SET_AVATAR', response.data.avatar)
          commit('SET_VIDEO_AVATAR', response.data.video_avatar)
          commit('SET_DEFAULT_AVATAR', response.data.default_avatar)
          commit('SET_ID', response.data.id)
          commit('SET_IS_LOGGED', true)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  setProfile ({ commit }, data) {
    commit('SET_ADDRESS', { city: data.city, street: data.street, zip_code: data.zip_code, country: data.country })
    commit('SET_EMAIL', data.email)
    commit('SET_PHONE', data.phone)
    commit('SET_NAME', data.name)
    commit('SET_NIP', data.nip)
  },

  setAvatar ({ commit }, data) {
    commit('SET_AVATAR', data)
  },
  setDefaultAvatar ({ commit }, data) {
    commit('SET_DEFAULT_AVATAR', data)
  },
  setVideoAvatar ({ commit }, data) {
    commit('SET_VIDEO_AVATAR', data)
  },

  setNewsletter ({ commit }, data) {
    commit('SET_NEWSLETTER', data)
  },

  // user register
  register ({ commit }, userInfo) {
    const { email, password, name, type } = userInfo
    return register({ email: email.trim(), password, name, type })
  },

  // user register
  completeRegistration ({ commit }, token) {
    return completeRegistration({ token })
  },

  getUser ({ commit }) {
    return new Promise((resolve, reject) => {
      getUser()
        .then((response) => {
          //
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateProfile ({ commit }) {
    return new Promise((resolve, reject) => {
      updateProfile()
        .then((response) => {
          commit('SET_NAME', response.data.name)
          commit('SET_PHONE', response.data.phone)
          commit('SET_ADDRESS', response.data.address)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_ROLES', '')
          commit('SET_PERMISSIONS', '')
          commit('SET_NAME', '')
          commit('SET_EMAIL', '')
          commit('SET_AVATAR', null)
          commit('SET_ID', '')
          commit('SET_IS_LOGGED', false)
          commit('SET_VIDEO_AVATAR', null)
          resolve()
          removeToken()
          localStorage.removeItem('recent_search')
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise((resolve) => {
      commit('SET_IS_LOGGED', false)
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}
