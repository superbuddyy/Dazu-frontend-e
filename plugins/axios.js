import { Message } from 'element-ui'
import { setClient } from '~/services/apiClient'

export default ({ app, store }) => {
  setClient(app.$axios)
  app.$axios.onError((error) => {
    let message = ''
    switch (parseInt(error.response.status)) {
      case 500:
        message = 'Wystąpił problem, spróbuj ponownie'
        break
      case 401:
        if (error.response.data.error) {
          message = error.response.data.error
        } else {
          message = 'Zaloguj się, aby mieć dostęp do tej strony'
        }
        app.router.push('/')
        app.store.dispatch('user/resetToken')
        break
      case 400:
        if (error.response.data.error) {
          if (error.response.data.error === 'email_already_exist') {
            message = 'Ten adres email jest już używany przez inne konto'
          } else {
            message = error.response.data.error
          }
        } else {
          message = 'Wystąpił problem, spróbuj ponownie'
        }
        break
      case 422:
        message = 'Wystąpił problem, spróbuj ponownie'
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
