
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import InputField from './InputField'
import Button from './Button'

export interface LoginFormInputs {
  email: string,
  password: string
}

interface LoginFormProps {
  onSubmit: () => LoginFormInputs
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={styles.form}>
      <InputField
        placeholder='Email'
        returnKeyType='next'
        autoFocus
        value={email}
        autoCapitalize='none'
        onChangeText={setEmail}
      />
      <View style={styles.filler} />
      <InputField
        placeholder='Salasana'
        returnKeyType='done'
        autoFocus
        value={password}
        autoCapitalize='none'
        onChangeText={setPassword}
      />
      <View style={{ marginTop: '5%' }}>
        <Button
          text='Valmis'
          disabled={!email || !password}
          onPress={() => onSubmit({email, password})} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filler: {
    height: '5%'
  }
})

export default LoginForm