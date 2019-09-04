import { StackActions, NavigationActions, NavigationScreenProp } from 'react-navigation'

export const getAuthErrorString = (code: string) => {
  switch (code) {
    case 'auth/invalid-email':
    case 'auth/invalid-password':
    case 'auth/user-not-found': return 'Tarkista sähköposti ja salasana'
    case 'auth/email-already-in-use': return 'Sähköposti käytössä'
    case 'auth/user-disabled': return 'Tunnus deaktivoitu, ota yhteys ylläpitoon'
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