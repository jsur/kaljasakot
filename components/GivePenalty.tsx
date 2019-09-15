import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Animated } from 'react-native'
import { AppContext } from '../AppState'

import PageContainer from './PageContainer'
import Button from './Button'
import ErrorText from './ErrorText'

import { LOGGEDIN_BACKGROUND, WHITE } from '../common/colors'
import { AppStateType } from '../AppState'
import { getPlayers, savePenalty } from '../common/firebase-helpers'
import { Player } from '../common/types'
import { BEER_YELLOW } from '../common/colors'
import { FONT_REGULAR, FONT_MEDIUM } from '../common/fonts'

const penaltyViewAnimation = new Animated.Value(0)

const GivePenalty = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0)
  const [successMsg, setSuccessMsg] = useState<string>('')

  const animateHeight = () => {
    setSuccessMsg('')
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

  const updatePenalty = (increment: 'more' | 'less', selectedPlayer: Player) => {
    setSuccessMsg('')
    if (increment === 'more') return setPenaltyAmount(prevState => prevState + 1)
    if (increment === 'less' && penaltyAmount > 0) return setPenaltyAmount(prevState => prevState - 1)
  }

  const getCurrentPenaltyAmount = (selectedPlayer: Player) => {
    return selectedPlayer && selectedPlayer.team_penalties[appState.currentTeam.id]
      ? selectedPlayer.team_penalties[appState.currentTeam.id]
      : 0
  }

  const savePenaltyToDB = async () => {
    try {
      setLoading(true)
      if (selectedPlayer && appState.currentTeam.id) {
        const updatedPlayer = {
          ...selectedPlayer,
          team_penalties: {
            ...selectedPlayer.team_penalties,
            [appState.currentTeam.id]: penaltyAmount
          }
        }
        await savePenalty(updatedPlayer)
        const newTeam = [...teamPlayers]
        const playerIdx = newTeam.findIndex(item => item.id === updatedPlayer.id)
        newTeam.splice(playerIdx, 1, updatedPlayer)
        setTeamPlayers(newTeam)
        setSuccessMsg('Sakko päivitetty!')
      }
    } catch (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
    setLoading(false)
  }

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
                    setSuccessMsg('')
                    setSelectedPlayer(isSelectedPlayer ? null : data.item)
                    setPenaltyAmount(getCurrentPenaltyAmount(data.item))
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
              <Text style={styles.penaltyAmountHeader}>Sakot nyt:</Text>
              <View style={styles.penaltyAmountCounter}>
              <TouchableOpacity style={styles.penaltyTouchable} onPress={() => updatePenalty('less', selectedPlayer)}>
                  <Image
                    source={require('../assets/images/minus-button-circle-white.png')}
                    style={[styles.penaltyImg, { opacity: penaltyAmount <= 0 ? 0.2 : 1 }]}
                    resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text style={styles.penaltyAmountText}>{penaltyAmount}</Text>
                <TouchableOpacity style={styles.penaltyTouchable} onPress={() => updatePenalty('more', selectedPlayer)}>
                  <Image
                    source={require('../assets/images/plus-button-circle-white.png')}
                    style={styles.penaltyImg}
                    resizeMode='contain'
                    />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  text={successMsg !== '' ? successMsg : 'Tallenna'}
                  disabled={successMsg !== '' || loading}
                  onPress={savePenaltyToDB}
                />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '12.5%',
    paddingRight: '12.5%'
  },
  penaltyAmountText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 80,
    color: WHITE
  },
  penaltyImg: {
    width: 50,
    height: 50
  },
  buttonWrapper: {
    marginBottom: '5%'
  }
})

export default GivePenalty