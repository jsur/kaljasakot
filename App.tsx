import React from 'react'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'
import * as Font from 'expo-font'

import Landing from './components/Landing'
import Settings from './components/Settings'
import Login from './components/Login'
import NewUser from './components/NewUser'
import NewTeam from './components/NewTeam'
import TabBarIcon from './components/TabBarIcon'
import GivePenalty from './components/GivePenalty'

import { FONT_LIGHT, FONT_REGULAR, FONT_MEDIUM } from './common/fonts'
import { BEER_YELLOW, WHITE, BLACK } from './common/colors'

import AppState from './AppState'

console.disableYellowBox = true

const firstTabButtonNavigator = createStackNavigator({
  Landing: {
    screen: Landing,
    navigationOptions: {
      title: 'Sakot'
    }
  },
  NewTeam,
  GivePenalty: {
    screen: GivePenalty,
    navigationOptions: {
      title: 'Valitse sakon saaja'
    }
  }
}, {
  headerLayoutPreset: 'center'
})

const LoggedInNavigator = createBottomTabNavigator({
  firstTab: {
    screen: firstTabButtonNavigator,
    navigationOptions: {
      title: 'Sakot',
      tabBarIcon: ({ focused }) => {
        return <TabBarIcon imgSrc={focused
          ? require('./assets/images/jar-of-beer-white.png')
          : require('./assets/images/jar-of-beer-black.png')}
        />
      }
    }
  },
  Settings: Settings
}, {
  navigationOptions: {
    header: null,
    headerLeft: null
  },
  initialRouteName: 'firstTab',
  headerLayoutPreset: 'center',
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
  NewUser: NewUser,
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
      [FONT_LIGHT]: require('./assets/fonts/roboto-light.ttf'),
      [FONT_REGULAR]: require('./assets/fonts/roboto-regular.ttf'),
      [FONT_MEDIUM]: require('./assets/fonts/roboto-medium.ttf')
    })
    this.setState({ ready: true })
  }

  render() {
    if (!this.state.ready) {
      return null
    }
    return (
      <AppState>
        <AppContainer />
      </AppState>
    )
  }
}

export default App