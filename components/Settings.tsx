import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import Button from './Button'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND } from '../common/colors'
import firebase from '../config/firebase'

interface State {
  isLoggingOut: boolean
}

class Settings extends React.Component<NavigationInjectedProps, State> {
  static navigationOptions = {
    title: 'Asetukset',
    tabBarIcon: ({ focused }) => {
      return <TabBarIcon imgSrc={focused
        ? require('../assets/images/settings-white.png')
        : require('../assets/images/settings-black.png')}
      />
    }
  }

  state = {
    isLoggingOut: false
  }

  logout = async () => {
    try {
      this.setState({ isLoggingOut: true })
      await firebase.auth().signOut()
      this.setState({ isLoggingOut: false }, () => clearNavigationStack(this.props.navigation))
    } catch (error) {

    }
  }

  render() {
    const { isLoggingOut } = this.state
    return (
      <PageContainer>
        <View style={styles.main}>
          <View style={styles.logoutWrapper}>
          <Button text='Kirjaudu ulos' loading={isLoggingOut} onPress={this.logout} />
          </View>
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
    backgroundColor: LOGGEDIN_BACKGROUND
  },
  logoutWrapper: {
    position: 'absolute',
    bottom: '5%'
  }
})

export default Settings