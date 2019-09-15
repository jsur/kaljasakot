import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import * as DocumentPicker from 'expo-document-picker'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import Button from './Button'
import InputField from './InputField'

import { withAppState, AppStateType, emptyAppState } from '../AppState'

import { clearNavigationStack } from '../common/auth-helpers'
import { uploadPhoto } from '../common/file-upload-helpers'
import { getTeamApplicants, removeApplicant } from '../common/firebase-helpers'
import { playerIsAdmin, usernameIsValid } from '../common/common-helpers'

import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR, FONT_MEDIUM } from '../common/fonts'
import { TeamApplicant } from '../common/types'
import { auth, db } from '../config/firebase'

interface Props {
  appState: AppStateType
}

interface State {
  isLoggingOut: boolean,
  usernameInputVisible: boolean,
  newUsername: string,
  loading: boolean,
  uploadLoading: boolean,
  applicantsLoading: boolean,
  errorMsg: string,
  applicants: Array<TeamApplicant>
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
    uploadLoading: false,
    applicantsLoading: false,
    errorMsg: '',
    applicants: []
  }

  componentDidMount() {
    this.getApplicants()
  }

  getApplicants = async () => {
    const { appState } = this.props
    if (playerIsAdmin(appState)) {
      try {
        this.setState({ applicantsLoading: true })
        const applicants = await getTeamApplicants(appState.currentTeam.id)
        this.setState({ applicants, applicantsLoading: false })
      } catch (error) {
        this.setState({ errorMsg: error.message, applicantsLoading: false })
      }
    }
  }

  logout = async () => {
    try {
      this.setState({ isLoggingOut: true })
      this.props.appState.updateAppState(emptyAppState)
      await auth.signOut()
      this.setState({ isLoggingOut: false }, () => clearNavigationStack(this.props.navigation))
    } catch (error) {
      this.setState({ errorMsg: error.message })
    }
  }

  toggleUsernameInput = () => {
    this.setState(prevState => ({
      usernameInputVisible: !prevState.usernameInputVisible,
      newUsername: ''
    }))
  }

  updateUsername = async () => {
    if (usernameIsValid(this.state.newUsername)) {
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

  chooseLogo = async () => {
    try {
      const { currentTeam } = this.props.appState
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' })
      if (result.type === 'success') {
        this.setState({ errorMsg: '', uploadLoading: true })
        const imageUrl = await uploadPhoto({ logoUri: result.uri, logoName: result.name })
        const newCurrentTeam = {
          ...currentTeam,
          logo_url: imageUrl
        }
        await db.collection('team').doc(currentTeam.id).set(newCurrentTeam)
        this.props.appState.updateAppState({ currentTeam: newCurrentTeam }, () => {
          this.setState({ uploadLoading: false })
        })
      }
    } catch (error) {
      this.setState({ errorMsg: error.message, uploadLoading: false })
    }
  }

  onApplicantPress = async (choice: 'deny' | 'accept', item: TeamApplicant) => {
    try {
      this.setState({ applicantsLoading: true })
      await removeApplicant(item.docId)
      if (choice === 'accept') {
        const { currentTeam } = this.props.appState
        await db.collection('team').doc(currentTeam.id).update({
          players: [ ...currentTeam.players, item.playerId ]
        })
      }
      await this.getApplicants()
    } catch (error) {
      this.setState({ errorMsg: error.message })
    }
  }

  render() {
    const { currentTeam } = this.props.appState
    const { isLoggingOut, usernameInputVisible, newUsername, loading, uploadLoading, applicants, applicantsLoading } = this.state
    const isAdmin = playerIsAdmin(this.props.appState)
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
                <View style={{ height: '2%' }} />
                <Button
                  text='Tallenna'
                  onPress={this.updateUsername}
                  disabled={loading || !usernameIsValid(newUsername)}
                  loading={loading}
                  extraStyles={{ width: '50%' }}
                />
              </View>
            )
          }
          {
            currentTeam && (
              <View style={styles.settingsRow}>
                <Text style={styles.settingsText}>Logo:</Text>
                <Image source={{ uri: currentTeam.logo_url }} style={styles.settingsLogo} resizeMode='contain' />
                <Button
                  text='Muuta'
                  onPress={this.chooseLogo}
                  disabled={uploadLoading}
                  loading={uploadLoading}
                  extraStyles={styles.settingsButton}
                />
              </View>
            )
          }
          {
            isAdmin && (
              <View style={styles.adminSettings}>
                <Text style={styles.settingsHeader}>Ylläpito</Text>
                <View style={styles.teamApplicantWrapper}>
                  <Text style={[styles.settingsText, { marginBottom: '2.5%' }]}>Hyväksy / hylkää pelaaja</Text>
                  <ScrollView>
                    {
                      applicantsLoading
                        ? <ActivityIndicator size='small' color={BEER_YELLOW} />
                        :  applicants.map(item => {
                            return (
                              <View key={item.playerId} style={styles.applicantRow}>
                                <Text style={[styles.settingsText, { color: BEER_YELLOW, flex: 1 }]}>{item.playerName}</Text>
                                <View style={styles.applicantButtons}>
                                  <TouchableOpacity onPress={() => this.onApplicantPress('deny', item)}>
                                    <Image
                                      source={require('../assets/images/cancel-red.png')}
                                      style={styles.applicantImage}
                                      resizeMode='contain'
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => this.onApplicantPress('accept', item)}>
                                    <Image
                                      source={require('../assets/images/checked-green.png')}
                                      style={styles.applicantImage}
                                      resizeMode='contain'
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )
                          })
                      }
                  </ScrollView>
                </View>
              </View>
            )
          }
          <View style={styles.logoutWrapper}>
            <Button
              text='Kirjaudu ulos'
              loading={isLoggingOut}
              onPress={this.logout}
              extraStyles={{ width: '50%' }}
            />
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
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '2.5%'
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
    padding: '2.5%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingsLogo: {
    width: 50,
    height: 50,
    marginLeft: '5%'
  },
  adminSettings: {
    flex: 1,
    width: '100%',
    paddingTop: '5%'
  },
  settingsHeader: {
    fontSize: 18,
    fontFamily: FONT_MEDIUM,
    color: WHITE
  },
  teamApplicantWrapper: {
    width: '100%',
    flex: 1,
    paddingTop: '2%'
  },
  applicantRow: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  applicantButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    right: '2.5%',
    width: '33%'
  },
  applicantImage: {
    width: 40,
    height: 40
  }
})

const includeStaticPropsSettings = withAppState(Settings)
includeStaticPropsSettings.navigationOptions = Settings.navigationOptions
export default includeStaticPropsSettings