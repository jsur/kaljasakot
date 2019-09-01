import React from 'react'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'
import * as Font from 'expo-font'

import AddBeer from './components/AddBeer'
import Settings from './components/Settings'
import Login from './components/Login'

import { FONT_REGULAR } from './common/fonts'
import { BEER_YELLOW, WHITE, BLACK } from './common/colors'

const LoggedInNavigator = createBottomTabNavigator({
  AddBeer: AddBeer,
  Settings: Settings
}, {
  navigationOptions: {
    headerLeft: null
  },
  initialRouteName: 'AddBeer',
  tabBarOptions: {
    activeTintColor: WHITE,
    inactiveTintColor: BLACK,
    activeBackgroundColor: BEER_YELLOW,
    labelStyle: {
      fontFamily: FONT_REGULAR
    }
  }
})

const LoginNavigator = createStackNavigator({
  Login: Login,
  LoggedIn: LoggedInNavigator
}, {
  initialRouteName: 'Login',
  headerLayoutPreset: 'center',
  defaultNavigationOptions: {
    title: 'Kaljasakot',
    headerStyle: {
      borderBottomColor: 'white',
      elevation: 0
    },
    headerTitleStyle: {
      fontFamily: FONT_REGULAR,
      fontWeight: '400'
    }
  }
})

const AppContainer = createAppContainer(LoginNavigator)

class App extends React.Component {
  state = {
    ready: false
  }

  async componentDidMount () {
    await Font.loadAsync({
      [FONT_REGULAR]: require('./assets/fonts/roboto-regular.ttf')
    })
    this.setState({ ready: true })
  }

  render() {
    if (!this.state.ready) {
      return null
    }
    return (
      <AppContainer />
    )
  }
}

export default App