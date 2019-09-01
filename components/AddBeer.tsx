import React from 'react'
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'
import TeamPenaltyList from './TeamPenaltyList'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR } from '../common/fonts'

import firebase from '../config/firebase'

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
  teams: Array<Team>
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
    teams: [
      {
        admins: [],
        logo_url: '',
        name: '',
        penalties: {},
        players: []
      }
    ]
  }

  async componentDidMount () {
    if (!firebase.auth().currentUser) {
      clearNavigationStack(this.props.navigation)
    }
    await this.getTeam()
  }

  getPlayer = async (): string | undefined => {
    try {
      const snapshot = await firebase.firestore()
        .collection('player')
        .where('auth_id', '==', firebase.auth().currentUser.uid)
        .get()
      
      return snapshot.docs.length > 0 && snapshot.docs[0].id
    } catch (error) {
      console.log(error)
    }
  }

  getTeam = async () => {
    try {
      this.setState({ loading: true })
      const playerId = await this.getPlayer()
      const snapshot = await firebase.firestore()
        .collection('team')
        .where('players', 'array-contains', playerId)
        .get()
      const teams = []
      snapshot.forEach(doc => teams.push({ ...doc.data(), id: doc.id }))
      this.setState({ teams, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  render() {
    const { teams, loading } = this.state
    const team = teams[0]
    return (
      <PageContainer>
        <View style={styles.main}>
          {
            loading
              ? <ActivityIndicator size='large' color={BEER_YELLOW} />
              : (
                <>
                  <Text style={styles.teamName}>{team.name}</Text>
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
  teamName: {
    fontFamily: FONT_REGULAR,
    fontSize: 26,
    color: WHITE
  }
})

export default AddBeer