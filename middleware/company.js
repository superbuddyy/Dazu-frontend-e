export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  if (!store.state.user.roles.includes('company')) {
    return redirect('/')
  }
}
