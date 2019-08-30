import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import LoginForm, { LoginFormInputs } from './LoginForm'
import ErrorText from './ErrorText'

import firebase from '../config/firebase'

class Login extends React.Component<NavigationInjectedProps> {
  static navigationOptions = {
    title: 'Kirjaudu sisään'
  }

  state = {
    errorMsg: ''
  }

  goToApp = () => this.props.navigation.navigate('AddBeer')

  onLoginSubmit = async ({ email, password }: LoginFormInputs) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(success => this.goToApp())
      .catch(error => this.setState({ errorMsg: error.message }))
  }

  /*
  createUser = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(success => this.goToApp())
    .catch(error => this.setState({ errorMsg: error.message }))
  } */

  render() {
    const { errorMsg } = this.state
    return (
      <PageContainer>
        <View style={styles.main}>
          <ErrorText text={errorMsg} />
          <LoginForm onSubmit={this.onLoginSubmit} />
        </View>
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default Login