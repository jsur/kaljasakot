import React from 'react'

import { Team, Player } from './common/types'

export const AppContext = React.createContext({})

interface AppStateActions {
  updateAppState: (stateObj: AppStateType, cb?: () => any) => undefined
}

interface AppStateKeys {
  currentTeam: Team,
  currentPlayer: Player
}

export const emptyAppState = {
  currentTeam: undefined,
  currentPlayer: undefined
}

export type AppStateType = AppStateActions & AppStateKeys

class AppState extends React.Component {
  state = emptyAppState


  updateAppState = (stateObj: Appst, cb?: () => any) => {
    if (typeof stateObj === 'object' && Object.keys(stateObj).length > 0) {
      this.setState(stateObj, () => {
        if (cb && typeof cb === 'function') cb()
      })
    }
  }

  render() {
    return (
        <AppContext.Provider
          value={{
            ...this.state,
            updateAppState: this.updateAppState
          }}
        >
          { this.props.children }
        </AppContext.Provider>
    )
  }
}

export default AppState

export const withAppState = (ChildComponent: any) => (props: any) => (
  <AppContext.Consumer>
    {
      context => <ChildComponent {...props} appState={context} />
    }
  </AppContext.Consumer>
)
