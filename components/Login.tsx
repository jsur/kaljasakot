import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import LoginForm, { LoginFormInputs } from './LoginForm'
import ErrorText from './ErrorText'

import { BEER_YELLOW } from '../common/colors'

import firebase from '../config/firebase'

class Login extends React.Component<NavigationInjectedProps> {
  bubbleAnimation = new Animated.ValueXY({ x: 0, y: 400 })

  static navigationOptions = {
    title: 'Kirjaudu sisään'
  }

  state = {
    errorMsg: ''
  }

  componentDidMount () {
    this.animateBubble()
  }

  goToApp = () => this.props.navigation.navigate('AddBeer')

  onLoginSubmit = async ({ email, password }: LoginFormInputs) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(success => this.goToApp())
      .catch(error => this.setState({ errorMsg: error.message }))
  }

  animateBubble = () => {
    Animated.sequence([
      Animated.timing(this.bubbleAnimation, { toValue: { x: 20, y: -200 } } ),
      Animated.timing(this.bubbleAnimation, { toValue: { x: 10, y: 0 } } ),
      Animated.timing(this.bubbleAnimation, { toValue: { x: 10, y: 100 } } ),
    ]).start()
  }

  /*
  createUser = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(success => this.goToApp())
    .catch(error => this.setState({ errorMsg: error.message }))
  } */

  render() {
    const { errorMsg } = this.state
    const layout = this.bubbleAnimation.getLayout()
    return (
      <PageContainer backgroundColor={BEER_YELLOW}>
        <Animated.View style={[
          { width: 30, height: 30, borderRadius: 30, backgroundColor: 'red' },
          layout
          ]}></Animated.View>
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
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Login