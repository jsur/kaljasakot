import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import Button from './Button'

import { LOGGEDIN_BACKGROUND } from '../common/colors'
import { auth, db } from '../config/firebase'

interface State {
  loading: boolean
}

class NewTeam extends React.Component<NavigationInjectedProps, State> {
  static navigationOptions = {
    title: 'Uusi joukkue'
  }

  state = {
    loading: false
  }

  createTeam = async () => {
    try {
      this.setState({ loading: true })
      // TÄHÄN FIREBASEA
      this.setState({ loading: false })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { loading } = this.state
    return (
      <PageContainer>
        <View style={styles.main}>
          <View style={styles.buttonWrapper}>
          <Button text='Perusta joukkue' loading={loading} onPress={this.createTeam} />
          </View>
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
    justifyContent: 'center',
    backgroundColor: LOGGEDIN_BACKGROUND
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default NewTeam