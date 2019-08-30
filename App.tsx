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

const LoggedInNavigator = createBottomTabNavigator({
  AddBeer: AddBeer,
  Settings: Settings
})

const LoginNavigator = createStackNavigator({
  Login: Login,
  LoggedIn: LoggedInNavigator
}, {
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    headerTitleStyle: {
      fontFamily: FONT_REGULAR
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