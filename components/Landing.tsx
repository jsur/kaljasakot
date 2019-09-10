import React from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { NavigationInjectedProps, NavigationEventSubscription } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import TeamPenaltyList from './TeamPenaltyList'
import Button from './Button'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR, FONT_MEDIUM } from '../common/fonts'

import { db, auth } from '../config/firebase'
import { getLoggedInPlayer, getOwnTeam } from '../common/firebase-helpers'
import { withAppState, AppStateType } from '../AppState'
import { Team } from '../common/types'

interface Props {
  appState: AppStateType
}

interface State {
  loading: false,
  allTeams: Array<Team>
}

class Landing extends React.Component<NavigationInjectedProps & Props, State> {
  willFocusListener: NavigationEventSubscription = null
  static navigationOptions = {
    title: 'Sakot',
    tabBarIcon: ({ focused }) => {
      return <TabBarIcon imgSrc={focused
        ? require('../assets/images/jar-of-beer-white.png')
        : require('../assets/images/jar-of-beer-black.png')}
      />
    }
  }

  state = {
    loading: false,
    allTeams: []
  }

  componentDidMount () {
    const { appState, navigation } = this.props
    if (!auth.currentUser) {
      clearNavigationStack(navigation)
    }
    this.willFocusListener = navigation.addListener('willFocus', async () => {
      this.setState({ loading: true })
      await this.refreshOwnTeam()
      if (!appState.currentTeam) {
        await this.getAllTeams()
      }
      this.setState({ loading: false })
    })
  }

  componentWillUnmount () {
    this.willFocusListener && this.willFocusListener.remove()
  }

  refreshOwnTeam = async () => {
    const ownTeam = await getOwnTeam()
    this.props.appState.updateAppState({ currentTeam: ownTeam })
  }

  getAllTeams = async () => {
    try {
      const snapshot = await db.collection('team').get()
      const allTeams = []
      snapshot.forEach(doc => allTeams.push({ ...doc.data(), id: doc.id }))
      this.setState({ allTeams })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  onTeamPress = async (team: Team) => {
    try {
      const playerId = await getLoggedInPlayer()
      const newPlayers = [...team.players, playerId]
      await db.collection('team').doc(team.id).update({ players: newPlayers })
      await this.refreshOwnTeam()
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  render() {
    const { allTeams, loading } = this.state
    const { currentTeam } = this.props.appState
    return (
      <PageContainer>
        <View style={styles.main}>
          {
            loading
              ? <ActivityIndicator size='large' color={BEER_YELLOW} />
              : !currentTeam ? (
                <View style={styles.noTeamWrapper}>
                  <Text style={styles.noTeamText}>Et ole vielä liittynyt</Text>
                  <Text style={styles.noTeamText}>mihinkään joukkueeseen.</Text>
                  <Text style={[styles.noTeamText, { marginTop: '2%' }]}>Valitse joku alla olevista tai luo uusi!</Text>
                  <View style={styles.listWrapper}>
                    <FlatList
                      style={{ width: '100%', height: '80%' }}
                      data={allTeams}
                      keyExtractor={item => item.id}
                      ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                      renderItem={data => {
                        return (
                          <TouchableOpacity
                            disabled={loading}
                            style={styles.teamRow}
                            onPress={() => this.onTeamPress(data.item)}
                          >
                            <Image source={{ uri: data.item.logo_url }} style={styles.teamRowLogo} resizeMode='contain' />
                            <Text style={styles.teamRowText}>{data.item.name}</Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  </View>
                  <View style={styles.newTeamButtonWrapper}>
                    <Button text='Luo uusi joukkue' onPress={() => this.props.navigation.navigate('NewTeam')} />
                  </View>
                </View>
              )
              : (
                <>
                  <View style={styles.teamWrapper}>
                    { currentTeam.logo_url && <Image source={{ uri: currentTeam.logo_url }} style={styles.teamLogo} resizeMode='contain' /> }
                    <Text style={styles.teamName}>{currentTeam.name}</Text>
                  </View>
                  <TeamPenaltyList players={currentTeam.players} teamId={currentTeam.id} />
                </>
              )
          }
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
    backgroundColor: LOGGEDIN_BACKGROUND,
    paddingTop: '5%'
  },
  noTeamWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  noTeamText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: WHITE,
    textAlign: 'center'
  },
  listWrapper: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    marginTop: '10%'
  },
  listSeparator: {
    borderBottomColor: BEER_YELLOW,
    borderWidth: 1
  },
  teamRow: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamRowText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 18,
    color: WHITE
  },
  teamRowLogo: {
    position: 'absolute',
    left: '5%',
    width: 45,
    height: 45
  },
  newTeamButtonWrapper: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  teamWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  teamName: {
    fontFamily: FONT_REGULAR,
    fontSize: 26,
    color: WHITE
  },
  teamLogo: {
    width: 50,
    height: 50,
    position: 'absolute',
    left: '5%'
  }
})

export default withAppState(Landing)