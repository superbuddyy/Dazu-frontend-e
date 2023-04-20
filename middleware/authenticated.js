export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  console.log('test')
  if (!store.state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
