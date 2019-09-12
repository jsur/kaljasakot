import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import Button from './Button'

import { withAppState, AppStateType, emptyAppState } from '../AppState'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR } from '../common/fonts'
import { auth } from '../config/firebase'

interface Props {
  appState: AppStateType
}

interface State {
  isLoggingOut: boolean
}

class Settings extends React.Component<NavigationInjectedProps & Props, State> {
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
      this.props.appState.updateAppState(emptyAppState)
      await auth.signOut()
      this.setState({ isLoggingOut: false }, () => clearNavigationStack(this.props.navigation))
    } catch (error) {

    }
  }

  render() {
    const { isLoggingOut } = this.state
    const { currentPlayer } = this.props.appState
    return (
      <PageContainer>
        <View style={styles.main}>
          <View style={styles.usernameWrapper}>
            <Text style={[styles.settingsText, { color: BEER_YELLOW }]}>{currentPlayer.username}</Text>
          </View>
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
    paddingTop: '10%',
    paddingLeft: '5%',
    paddingRight: '5%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: LOGGEDIN_BACKGROUND
  },
  usernameWrapper: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  settingsText: {
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    color: WHITE
  },
  logoutWrapper: {
    position: 'absolute',
    bottom: '5%'
  }
})

const includeStaticPropsSettings = withAppState(Settings)
includeStaticPropsSettings.navigationOptions = Settings.navigationOptions
export default includeStaticPropsSettings