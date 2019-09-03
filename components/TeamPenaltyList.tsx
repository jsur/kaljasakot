import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import firebase from '../config/firebase'
import { WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR } from '../common/fonts'

interface Player {
  auth_id: string,
  team_penalties: {
    [teamId: string]: number
  },
  username: string
}

interface Props {
  players: Array<string>,
  teamId: string
}

interface State {
  playersWithPenalties: Array<{
    username: string,
    penalties: number
  }>
}

class TeamPenaltyList extends React.Component<Props, State> {
  state = {
    playersWithPenalties: []
  }
  
  componentDidMount() {
    if (this.props.players.length > 0) {
      this.populateState()
    }
  }

  populateState = async () => {
    const { players, teamId } = this.props
    try {
      const promises = players.map(id => this.getPenaltiesForPlayer(id))
      const resolved = await Promise.all(promises)
      const teamPlayers = resolved.filter(item => typeof item.team_penalties[teamId] === 'number')
      this.setState({
        playersWithPenalties: teamPlayers.map(item => {
          return {
            username: item.username,
            penalties: item.team_penalties[teamId]
          }
        }).sort((a, b) => b.penalties - a.penalties)
      })
    } catch (error) {
      console.log(error)
    }
  }

  getPenaltiesForPlayer = async (playerDocId: string): Player => {
    const snapshot = await firebase.firestore()
      .collection('player')
      .doc(playerDocId)
      .get()

    return snapshot.data()
  }

  render() {
    const { playersWithPenalties } = this.state
    return (
      <View style={styles.main}>
        <Text style={styles.header}>Jaetut sakot:</Text>
        <FlatList
          data={playersWithPenalties}
          keyExtractor={item => `${item.username}-${item.penalties}`}
          ItemSeparatorComponent={() => {
            return <View style={{ borderColor: BEER_YELLOW, borderWidth: StyleSheet.hairlineWidth }} />
          }}
          renderItem={data => {
            return (
              <TouchableOpacity
                style={styles.penaltyRow}
                onPress={() => {}}
              >
                <Text style={styles.rowText}>{`${data.item.username}: ${data.item.penalties}`}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: '5%'
  },
  header: {
    color: WHITE,
    fontFamily: FONT_REGULAR,
    fontSize: 20,
    lineHeight: 20,
    marginBottom: '2.5%'
  },
  penaltyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50
  },
  rowText: {
    color: WHITE,
    fontFamily: FONT_REGULAR,
    fontSize: 16
  }
})

export default TeamPenaltyList