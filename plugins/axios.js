import { Message } from 'element-ui'
import { setClient } from '~/services/apiClient'

export default ({ app, store }) => {
  setClient(app.$axios)
  app.$axios.onError((error) => {
    let message = ''
    switch (parseInt(error.response.status)) {
      case 500:
        message = 'There was a problem, please try again'
        break
      case 401:
        if (error.response.data.error) {
          message = error.response.data.error
        } else {
          message = 'Log in to access this page'
        }
        app.router.push('/')
        app.store.dispatch('user/resetToken')
        break
      case 400:
        if (error.response.data.error) {
          if (error.response.data.error === 'email_already_exist') {
            message = 'This email address is already in use by another account'
          } else {
            message = error.response.data.error
          }
        } else {
          message = 'There was a problem, please try again'
        }
        break
      case 422:
        message = 'There was a problem, please try again'
        app.router.push('/')
        break
      case 404:
        app.router.push('/404')
        break
    }
    if (message !== '') {
      Message.error({
        message,
        duration: 5000
      })
    }
  })
}
