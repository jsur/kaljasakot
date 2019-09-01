export const getAuthErrorString = (code: string) => {
  switch (code) {
    case 'auth/invalid-email': return 'Tarkista sähköposti'
    default: return 'Virhe kirjautumisessa'
  }
}