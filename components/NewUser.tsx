import React, { useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import ErrorText from './ErrorText'
import InputField from './InputField'
import Button from './Button'

import { getAuthErrorString } from '../common/auth-helpers'

import { BEER_YELLOW } from '../common/colors'

import { db, auth } from '../config/firebase'

const NewUser = (props: NavigationInjectedProps) => {
  const emailRef: React.RefObject<HTMLInputElement> = React.createRef()
  const passwordRef: React.RefObject<HTMLInputElement> = React.createRef()
  const passwordAgainRef: React.RefObject<HTMLInputElement> = React.createRef()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const createUser = useCallback(async (username: string, email: string, password: string, passwordAgain: string) => {
    if (loading) return
    if (password !== passwordAgain) {
      return setErrorMsg('Salasanat eivät täsmää')
    }
    if (password.length < 6) {
      return setErrorMsg('Salasanan oltava vähintään 6 merkkiä')
    }
    setLoading(true)
    try {
      const newUser = await auth.createUserWithEmailAndPassword(email, password)
      await db.collection('player').add({
        username,
        auth_id: newUser.user.uid,
        team_penalties: {}
      })
      setLoading(false)
      props.navigation.navigate('AddBeer')
      
    } catch (error) {
      console.log(error)
      console.log(error.code)
      setErrorMsg(getAuthErrorString(error.code))
      setLoading(false)
    }
  }, loading)

  return (
    <PageContainer backgroundColor={BEER_YELLOW}>
      <View style={styles.form}>
        <ErrorText text={errorMsg} />
        <InputField
          placeholder='Nimimerkki'
          returnKeyType='next'
          autoFocus
          value={username}
          autoCapitalize='none'
          onSubmitEditing={() => emailRef.current.focus()}
          onChangeText={text => {
            setErrorMsg('')
            setUsername(text)
          }}
        />
        <View style={styles.filler} />
        <InputField
          placeholder='Sähköposti'
          returnKeyType='next'
          value={email}
          autoCapitalize='none'
          givenRef={emailRef}
          onSubmitEditing={() => passwordRef.current.focus()}
          onChangeText={text => {
            setErrorMsg('')
            setEmail(text)
          }}
        />
        <View style={styles.filler} />
        <View style={styles.filler} />
        <InputField
          placeholder='Salasana'
          returnKeyType='next'
          value={password}
          autoCapitalize='none'
          givenRef={passwordRef}
          secureTextEntry
          onChangeText={text => {
            setErrorMsg('')
            setPassword(text)
          }}
          onSubmitEditing={() => passwordAgainRef.current.focus()}
        />
        <View style={styles.filler} />
        <InputField
          placeholder='Salasana uudelleen'
          returnKeyType='done'
          value={passwordAgain}
          autoCapitalize='none'
          givenRef={passwordAgainRef}
          secureTextEntry
          onChangeText={text => {
            setErrorMsg('')
            setPasswordAgain(text)
          }}
          onSubmitEditing={() => createUser(username, email, password, passwordAgain)}
        />
        <View style={{ marginTop: '5%' }}>
          <Button
            text='Luo käyttäjä'
            loading={loading}
            disabled={loading || !username || !email || !password || !passwordAgain}
            onPress={() => createUser(username, email, password, passwordAgain)} />
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filler: {
    height: 10
  }
})

export default NewUser


  /*
  createUser = () => {
    
    .then(success => this.goToApp())
    .catch(error => this.setState({ errorMsg: error.message }))
  } */
