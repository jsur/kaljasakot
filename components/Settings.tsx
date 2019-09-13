import React from 'react'
import { StyleSheet, View, Text, AppState } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import Button from './Button'
import InputField from './InputField'

import { withAppState, AppStateType, emptyAppState } from '../AppState'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR } from '../common/fonts'
import { auth, db } from '../config/firebase'

interface Props {
  appState: AppStateType
}

interface State {
  isLoggingOut: boolean,
  usernameInputVisible: boolean,
  newUsername: string,
  loading: boolean,
  errorMsg: string
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
    isLoggingOut: false,
    usernameInputVisible: false,
    newUsername: '',
    loading: false,
    errorMsg: ''
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

  toggleUsernameInput = () => {
    this.setState(prevState => ({
      usernameInputVisible: !prevState.usernameInputVisible,
      newUsername: ''
    }))
  }

  newUsernameIsValid = () => {
    const { newUsername } = this.state
    return newUsername && newUsername.length >= 3 && newUsername.length < 15
  }

  updateUsername = async () => {
    if (this.newUsernameIsValid()) {
      try {
        this.setState({ loading: true })
        const { currentPlayer } = this.props.appState
        const newCurrentPlayer = {
          ...currentPlayer,
          username: this.state.newUsername
        }
        await db.collection('player').doc(currentPlayer.id).set(newCurrentPlayer)
        this.props.appState.updateAppState({ currentPlayer: newCurrentPlayer })
        this.setState({ loading: false, usernameInputVisible: false })
      } catch (error) {
        this.setState({ loading: false, errorMsg: error.message })
      }
    }
  }

  showUsername = () => {
    const { currentPlayer } = this.props.appState
    if (currentPlayer) {
      return currentPlayer.username.length > 10
      ? `${currentPlayer.username.slice(0, 10)}..`
      : currentPlayer.username
    }
    return ''
  }

  render() {
    const { isLoggingOut, usernameInputVisible, newUsername, loading } = this.state
    return (
      <PageContainer>
        <View style={styles.main}>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Käyttäjä:
              <Text style={{ color: BEER_YELLOW }}>{` ${this.showUsername()}`}</Text>
            </Text>
            <Button
              text={usernameInputVisible ? 'Sulje' : 'Muuta'}
              onPress={this.toggleUsernameInput}
              extraStyles={styles.settingsButton}
            />
          </View>
          {
            usernameInputVisible && (
              <View style={styles.settingEditRow}>
                <InputField
                  placeholder='Uusi nimimerkki'
                  returnKeyType='done'
                  autoFocus={usernameInputVisible}
                  value={newUsername}
                  autoCapitalize='none'
                  onSubmitEditing={this.updateUsername}
                  onChangeText={text => this.setState({ newUsername: text })}
                />
                <Button
                  text='Tallenna'
                  onPress={this.updateUsername}
                  disabled={loading || !this.newUsernameIsValid()}
                  loading={loading}
                  extraStyles={{ width: '50%' }}
                />
              </View>
            )
          }
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
  settingsRow: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: BEER_YELLOW,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  settingsText: {
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    color: WHITE
  },
  logoutWrapper: {
    position: 'absolute',
    bottom: '5%'
  },
  settingsButton: {
    height: 30,
    width: '25%',
    minWidth: 0,
    marginLeft: '5%',
    position: 'absolute',
    right: '2.5%'
  },
  settingEditRow: {
    width: '90%',
    height: '28.5%',
    padding: '2.5%',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

const includeStaticPropsSettings = withAppState(Settings)
includeStaticPropsSettings.navigationOptions = Settings.navigationOptions
export default includeStaticPropsSettings