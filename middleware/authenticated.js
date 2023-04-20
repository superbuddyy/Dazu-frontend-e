export default function ({ store, redirect, route }) {
  console.log(store)
  // If the user is not authenticated
  if (!store.state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
