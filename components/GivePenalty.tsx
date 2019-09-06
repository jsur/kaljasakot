import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { AppContext } from '../AppState'
// import { withNavigation, NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import Button from './Button'

import { LOGGEDIN_BACKGROUND } from '../common/colors'
import firebase from '../config/firebase'

const GivePenalty = () => {
  const [loading, setLoading] = useState(false)

  const value = useContext(AppContext)

  return (
    <PageContainer>
      <View style={styles.main}>
        <View style={styles.buttonWrapper}>
          <Button text='Sakota' loading={loading} onPress={this.givePenalty} />
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LOGGEDIN_BACKGROUND
  },
  buttonWrapper: {
    width: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default GivePenalty