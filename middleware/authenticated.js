export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  if (!store.state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
