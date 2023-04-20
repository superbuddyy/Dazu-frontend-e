export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  
  console.log('test')
  console.log(store)
  console.log('test1')
  console.log(store.state)
  console.log('test2')
  console.log(store.state.user)
  console.log('test3')
  console.log(store.state.user)
  console.log('test4')

  if (!store.state.user.isLogged) {
    return redirect('/?next=' + route.path)
  }
}
