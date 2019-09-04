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
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import TeamPenaltyList from './TeamPenaltyList'
import Button from './Button'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW, BLACK, LOGGEDIN_BACKGROUND_LIGHT } from '../common/colors'
import { FONT_REGULAR, FONT_MEDIUM } from '../common/fonts'

import { db, auth } from '../config/firebase'

interface Team {
  id: string,
  admins: Array<string>,
  logo_url: string,
  name: string,
  penalties: {
    [uid: string]: number
  },
  players: Array<string>
}

interface State {
  loading: false,
  teams: Array<Team>,
  allTeams: Array<Team>
}

class AddBeer extends React.Component<NavigationInjectedProps, State> {
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
    teams: [],
    allTeams: []
  }

  async componentDidMount () {
    if (!auth.currentUser) {
      clearNavigationStack(this.props.navigation)
    }
    await this.getOwnTeams()
    if (this.state.teams.length === 0) {
      await this.getAllTeams()
    }
  }

  getPlayer = async (): string | undefined => {
    try {
      const snapshot = await db.collection('player').where('auth_id', '==', auth.currentUser.uid).get()
      return snapshot.docs.length > 0 && snapshot.docs[0].id
    } catch (error) {
      console.log(error)
    }
  }

  getOwnTeams = async () => {
    try {
      this.setState({ loading: true })
      const playerId = await this.getPlayer()
      const snapshot = await db.collection('team').where('players', 'array-contains', playerId).get()
      const teams = []
      snapshot.forEach(doc => teams.push({ ...doc.data(), id: doc.id }))
      this.setState({ teams, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  getAllTeams = async () => {
    try {
      this.setState({ loading: true })
      const snapshot = await db.collection('team').get()
      const allTeams = []
      snapshot.forEach(doc => allTeams.push({ ...doc.data(), id: doc.id }))
      this.setState({ allTeams, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  onTeamPress = async (team: Team) => {
    this.setState({ loading: true })
    try {
      const playerId = await this.getPlayer()
      const newPlayers = [...team.players, playerId]
      await db.collection('team').doc(team.id).update({ players: newPlayers })
      await this.getOwnTeams()
      this.setState({ loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  render() {
    const { allTeams, teams, loading } = this.state
    const team = teams[0]
    return (
      <PageContainer>
        <View style={styles.main}>
          {
            loading
              ? <ActivityIndicator size='large' color={BEER_YELLOW} />
              : teams.length === 0 ? (
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
                    <Button text='Luo uusi joukkue' onPress={() => {}} />
                  </View>
                </View>
              )
              : (
                <>
                  <View style={styles.teamWrapper}>
                    { team.logo_url && <Image source={{ uri: team.logo_url }} style={styles.teamLogo} resizeMode='contain' /> }
                    <Text style={styles.teamName}>{team.name}</Text>
                  </View>
                  <TeamPenaltyList players={team.players} teamId={team.id} />
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

export default AddBeer