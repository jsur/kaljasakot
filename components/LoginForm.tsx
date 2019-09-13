
import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'

import InputField from './InputField'
import Button from './Button'
import ErrorText from './ErrorText'

import { getAuthErrorString } from '../common/auth-helpers'
import { storeData, retrieveData } from '../common/asyncStorage'
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

  useEffect(() => {
    retrieveData('email').then(previousEmail => setEmail(previousEmail || ''))
  }, [])

  const login = async (email: string, password: string) => {
    if (loading) return
    setLoading(true)
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      await storeData('email', email)
      await onSuccess()
      setLoading(false)
    } catch (error) {
      console.log(error)
      console.log(error.code)
      setErrorMsg(getAuthErrorString(error.code))
      setLoading(false)
    }
  }

  return (
    <View style={styles.form}>
      <ErrorText text={errorMsg} />
      <InputField
        placeholder='Sähköposti'
        returnKeyType='next'
        value={email}
        autoFocus
        autoCapitalize='none'
        keyboardType='email-address'
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
        value={password}
        autoCapitalize='none'
        givenRef={passwordRef}
        secureTextEntry
        onChangeText={text => {
          setErrorMsg('')
          setPassword(text)
        }}
        onSubmitEditing={() => login(email, password)}
      />
      <View style={{ marginTop: '5%' }}>
        <Button
          text='Valmis'
          loading={loading}
          disabled={loading || !email || !password || password.length < 6}
          onPress={() => login(email, password)} />
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
