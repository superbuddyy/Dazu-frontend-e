export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  console.log('test')
  console.log(store)
  console.log('store')
  if (!store.state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
