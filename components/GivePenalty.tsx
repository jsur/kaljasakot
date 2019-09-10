import React, { useState, useContext, useCallback, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Animated } from 'react-native'
import { AppContext } from '../AppState'
// import { withNavigation, NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import Button from './Button'
import ErrorText from './ErrorText'

import { LOGGEDIN_BACKGROUND, WHITE } from '../common/colors'
import { AppStateType } from '../AppState'
import { getPlayers } from '../common/firebase-helpers'
import { Player } from '../common/types'
import { BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR, FONT_MEDIUM } from '../common/fonts'

const penaltyViewAnimation = new Animated.Value(0)

const GivePenalty = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [givenPenaltyAmount, setGivenPenaltyAmount] = useState<number>(0)

  const animateHeight = () => {
    penaltyViewAnimation.setValue(0)
    Animated.spring(penaltyViewAnimation, { toValue: 1 }).start()
  }
  const interpolatedHeight = penaltyViewAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '60%']
  })

  const appState: AppStateType = useContext(AppContext)

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      setLoading(true)
      try {
        const players = await getPlayers(appState.currentTeam.players)
        setTeamPlayers(players)
      } catch (error) {
        setErrorMsg(error.message)
      }
      setLoading(false)
    }
    fetchTeamPlayers()
  }, [])

  const updatePenalty = useCallback(async (increment: 'more' | 'less', selectedPlayer: Player) => {
    console.log('selectedPlayer.team_penalties:', selectedPlayer)
    const currentPenalties = selectedPlayer.team_penalties[appState.currentTeam.id] || 0
    if (increment === 'more') {
      setGivenPenaltyAmount(prevState => prevState + 1)
    }
    if (increment === 'less' && currentPenalties > 0) {
      setGivenPenaltyAmount(prevState => prevState - 1)
    }
  }, givenPenaltyAmount)

  console.log('selectedPlayer:', selectedPlayer)
  return (
    <PageContainer>
      <View style={styles.main}>
        <ErrorText text={errorMsg} />
        <View style={styles.listWrapper}>
          <FlatList
            style={{ flex: 1, width: '100%' }}
            extraData={selectedPlayer}
            refreshing={loading}
            data={teamPlayers}
            keyExtractor={item => item.username}
            renderItem={data => {
              const isSelectedPlayer = selectedPlayer && selectedPlayer.username === data.item.username
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPlayer(isSelectedPlayer ? null : data.item)
                    !selectedPlayer ? animateHeight() : null
                  }}
                  style={styles.playerRow}
                >
                  <Text
                    style={[
                      styles.playerRowText,
                      { color: isSelectedPlayer ? BEER_YELLOW : WHITE }
                    ]}
                  >{data.item.username}</Text>
                  { isSelectedPlayer && <Image
                      source={require('../assets/images/jar-of-beer-white.png')}
                      style={{ width: 40, height: 40, position: 'absolute', right: 0 }}
                      resizeMode='contain'
                    />
                  }
                </TouchableOpacity>
              )
            }}
          />
        </View>
        {
          selectedPlayer && (
            <Animated.View style={[styles.penaltyAmountWrapper, { height: interpolatedHeight }]}>
              <Text style={styles.penaltyAmountHeader}>Sakon määrä</Text>
              <View style={styles.penaltyAmountCounter}>
                <Text style={styles.givenPenaltyAmount}>{givenPenaltyAmount}</Text>
                <TouchableOpacity onPress={() => updatePenalty('more', selectedPlayer)}>
                  <Image
                    source={require('../assets/images/jar-of-beer-white.png')}
                    style={{ width: 40, height: 40 }}
                    resizeMode='contain'
                    />
                </TouchableOpacity>
              </View>
              <View>
                <Text>tähän tallennus</Text>
              </View>
            </Animated.View>
          )
        }
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: LOGGEDIN_BACKGROUND
  },
  listWrapper: {
    flex: 1,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  playerRowText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 20
  },
  penaltyAmountWrapper: {
    width: '100%',
    backgroundColor: BEER_YELLOW,
    alignItems: 'center',
    paddingTop: '5%'
  },
  penaltyAmountHeader: {
    fontFamily: FONT_REGULAR,
    fontSize: 22,
    color: WHITE
  },
  penaltyAmountCounter: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  givenPenaltyAmount: {
    fontFamily: FONT_MEDIUM,
    fontSize: 80,
    color: WHITE
  }
})

export default GivePenalty