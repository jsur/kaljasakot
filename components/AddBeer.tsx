import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import PageContainer from './PageContainer'
import TabBarIcon from './TabBarIcon'

import { clearNavigationStack } from '../common/auth-helpers'
import { LOGGEDIN_BACKGROUND } from '../common/colors'
import firebase from '../config/firebase'

class AddBeer extends React.Component<NavigationInjectedProps> {
  static navigationOptions = {
    title: 'Sakot',
    tabBarIcon: ({ focused }) => {
      return <TabBarIcon imgSrc={focused
        ? require('../assets/images/jar-of-beer-white.png')
        : require('../assets/images/jar-of-beer-black.png')}
      />
    }
  }

  componentDidMount () {
    if (!firebase.auth().currentUser) {
      clearNavigationStack(this.props.navigation)
    }
  }

  render() {
    return (
      <PageContainer>
        <View style={styles.main}></View>
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
  }
})

export default AddBeer