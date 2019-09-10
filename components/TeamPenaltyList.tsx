import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'

import Button from './Button'

import { WHITE, BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR } from '../common/fonts'
import { getPlayerById } from '../common/firebase-helpers'

interface Props {
  players: Array<string>,
  teamId: string
}

interface State {
  playersWithPenalties: Array<{
    username: string,
    penalties: number
  }>,
  loading: boolean
}

class TeamPenaltyList extends React.Component<NavigationInjectedProps & Props, State> {
  state = {
    playersWithPenalties: [],
    loading: false
  }
  
  componentDidMount() {
    if (this.props.players.length > 0) {
      this.populateState()
    }
  }

  populateState = async () => {
    const { players, teamId } = this.props
    try {
      this.setState({ loading: true })
      const promises = players.map(id => getPlayerById(id))
      const resolved = await Promise.all(promises)
      const teamPlayers = resolved.filter(item => typeof item.team_penalties[teamId] === 'number')
      this.setState({
        playersWithPenalties: teamPlayers.map(item => {
          return {
            username: item.username,
            penalties: item.team_penalties[teamId]
          }
        }).sort((a, b) => b.penalties - a.penalties),
        loading: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  render() {
    const { playersWithPenalties, loading } = this.state
    const { navigation } = this.props
    return (
      <View style={styles.main}>
        <Text style={styles.header}>Jaetut sakot:</Text>
        {
          !loading && playersWithPenalties.length === 0
           ? (
            <View style={styles.emptyListView}>
              <Text style={[
                styles.rowText,
                { color: BEER_YELLOW, marginBottom: '7.5%', marginTop: '5%' }
              ]}>Ei sakkoja</Text>
            </View>
           ) : (
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
           )
        }
        <Button text='Uusi sakko' disabled={false} onPress={() => navigation.navigate('GivePenalty')} />
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
  },
  emptyListView: {
    width: '100%',
    minHeight: 100,
    alignItems: 'center'
  }
})

export default withNavigation(TeamPenaltyList)