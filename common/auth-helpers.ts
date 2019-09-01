import { StackActions, NavigationActions, NavigationScreenProp } from 'react-navigation'

export const getAuthErrorString = (code: string) => {
  switch (code) {
    case 'auth/invalid-email': return 'Tarkista sähköposti'
    default: return 'Virhe kirjautumisessa'
  }
}

export const clearNavigationStack = (navigation: NavigationScreenProp<any>) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Login' })
    ]
  })
  navigation.dispatch(resetAction)
}