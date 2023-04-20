export default function ({ state, redirect, route }) {
  // If the user is not authenticated
  console.log('test')
  console.log(state)
  if (!state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
