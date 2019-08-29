
import React, { useState } from 'react'
import { TextInput, View, StyleSheet } from 'react-native'

const LoginFields = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <View style={styles.filler} />
      <TextInput
        style={styles.input}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filler: {
    height: '5%'
  },
  input: {
    backgroundColor: 'white',
    width: '90%',
    height: '20%'
  }
})

export default LoginFields