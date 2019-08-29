import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

import PageContainer from './PageContainer'
import RegularText from './RegularText'
import LoginForm from './LoginForm'

import { NavigationInjectedProps } from 'react-navigation'

class Login extends React.Component<NavigationInjectedProps> {
  static navigationOptions = {
    title: 'Kirjaudu sisään'
  }

  render() {
    return (
      <PageContainer>
        <View style={styles.main}>
          <LoginForm />
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