
import React, { useState, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'

import InputField from './InputField'
import Button from './Button'
import ErrorText from './ErrorText'

import { getAuthErrorString } from '../common/auth-helpers'
import firebase from '../config/firebase'

export interface LoginFormInputs {
  email: string,
  password: string
}

interface LoginFormProps {
  onSuccess: () => undefined
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const passwordRef: React.RefObject = React.createRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      setLoading(false)
      onSuccess()
    } catch (error) {
      console.log(error.code)
      setErrorMsg(getAuthErrorString(error.code))
      setLoading(false)
    }
  }, loading)

  return (
    <View style={styles.form}>
      <ErrorText text={errorMsg} />
      <InputField
        placeholder='Email'
        returnKeyType='next'
        autoFocus={true}
        value={email}
        autoCapitalize='none'
        onSubmitEditing={() => passwordRef.current.focus()}
        onChangeText={text => {
          setErrorMsg('')
          setEmail(text)
        }}
      />
      <View style={styles.filler} />
      <InputField
        placeholder='Salasana'
        returnKeyType='done'
        autoFocus
        value={password}
        autoCapitalize='none'
        givenRef={passwordRef}
        onChangeText={text => {
          setErrorMsg('')
          setPassword(text)
        }}
        onSubmitEditing={login}
      />
      <View style={{ marginTop: '5%' }}>
        <Button
          text='Valmis'
          disabled={!email || !password}
          onPress={login} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filler: {
    height: 10
  }
})

export default LoginForm


  /*
  createUser = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(success => this.goToApp())
    .catch(error => this.setState({ errorMsg: error.message }))
  } */
